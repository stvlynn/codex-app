import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type NodePath } from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";

const traverse = ((babelTraverse as unknown as { default?: typeof babelTraverse })
  .default ?? babelTraverse) as typeof babelTraverse;
const generate = ((babelGenerator as unknown as { default?: typeof babelGenerator })
  .default ?? babelGenerator) as typeof babelGenerator;

export const PARSER_PLUGINS: parser.ParserPlugin[] = [
  "jsx",
  "classProperties",
  "classPrivateProperties",
  "classPrivateMethods",
  "dynamicImport",
  "importMeta",
  "objectRestSpread",
  "topLevelAwait",
];

export function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "unambiguous",
    errorRecovery: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });
}

export type NormalizeExportsStats = {
  inlined: number;
  preserved: number;
};

export type NormalizeExportsResult = {
  code: string;
  stats: NormalizeExportsStats;
};

export type NormalizeOptions = {
  prefer?: "exported" | "local";
};

function isProgramLevel(p: NodePath): boolean {
  return p.parentPath?.isProgram() === true;
}

function isProgramLevelStatement(p: NodePath): boolean {
  let cur: NodePath | null = p;
  while (cur && !cur.isStatement()) cur = cur.parentPath;
  return cur?.parentPath?.isProgram() === true;
}

export function normalizeExports(
  source: string,
  opts: NormalizeOptions = {},
): NormalizeExportsResult {
  if (!source) return { code: "", stats: { inlined: 0, preserved: 0 } };
  const prefer = opts.prefer ?? "exported";
  const ast = parseSource(source);
  const stats: NormalizeExportsStats = { inlined: 0, preserved: 0 };

  const exportDecls: NodePath<t.ExportNamedDeclaration>[] = [];
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration) return;
      if (path.node.source) return;
      if (!isProgramLevel(path)) return;
      exportDecls.push(path);
    },
  });

  for (const exportPath of exportDecls) {
    if (exportPath.removed) continue;
    const specifiers = exportPath.node.specifiers.filter(
      (s): s is t.ExportSpecifier => t.isExportSpecifier(s),
    );
    if (specifiers.length === 0) continue;

    const keep: t.ExportSpecifier[] = [];
    let mutated = false;

    for (const spec of specifiers) {
      const localName = t.isIdentifier(spec.local) ? spec.local.name : null;
      const exportedName = t.isIdentifier(spec.exported)
        ? spec.exported.name
        : t.isStringLiteral(spec.exported)
          ? spec.exported.value
          : null;
      if (!localName || !exportedName) {
        keep.push(spec);
        continue;
      }

      const binding = exportPath.scope.getBinding(localName);
      if (!binding || binding.references !== 1) {
        keep.push(spec);
        stats.preserved++;
        continue;
      }
      const bp = binding.path;
      if (!isProgramLevelStatement(bp)) {
        keep.push(spec);
        stats.preserved++;
        continue;
      }

      const finalName = prefer === "local" ? localName : exportedName;

      if (bp.isFunctionDeclaration() || bp.isClassDeclaration()) {
        const decl = bp.node as t.FunctionDeclaration | t.ClassDeclaration;
        if (!decl.id || decl.id.name !== localName) {
          keep.push(spec);
          stats.preserved++;
          continue;
        }
        decl.id = t.identifier(finalName);
        const wrapper = t.exportNamedDeclaration(decl, []);
        bp.replaceWith(wrapper);
        mutated = true;
        stats.inlined++;
        continue;
      }

      if (bp.isVariableDeclarator()) {
        const varDeclPath = bp.parentPath as NodePath<t.VariableDeclaration>;
        if (!varDeclPath.isVariableDeclaration()) {
          keep.push(spec);
          stats.preserved++;
          continue;
        }
        if (!t.isIdentifier(bp.node.id) || bp.node.id.name !== localName) {
          keep.push(spec);
          stats.preserved++;
          continue;
        }
        if (!bp.node.init) {
          keep.push(spec);
          stats.preserved++;
          continue;
        }
        const init = bp.node.init;
        const declarators = varDeclPath.node.declarations;
        const idx = declarators.indexOf(bp.node);
        if (idx < 0) {
          keep.push(spec);
          stats.preserved++;
          continue;
        }
        const kind = varDeclPath.node.kind === "var" ? "const" : varDeclPath.node.kind;
        const newDeclarator = t.variableDeclarator(t.identifier(finalName), init);
        const exportDecl = t.exportNamedDeclaration(
          t.variableDeclaration(kind, [newDeclarator]),
          [],
        );

        if (declarators.length === 1) {
          varDeclPath.replaceWith(exportDecl);
        } else {
          declarators.splice(idx, 1);
          varDeclPath.insertAfter(exportDecl);
        }
        mutated = true;
        stats.inlined++;
        continue;
      }

      keep.push(spec);
      stats.preserved++;
    }

    if (mutated) {
      if (keep.length === 0) {
        exportPath.remove();
      } else {
        exportPath.node.specifiers = keep;
      }
    }
  }

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats,
  };
}

const USAGE =
  "Usage: bun scripts/normalize-exports.ts <input.js|-> [--out output.js] [--prefer local|exported]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") {
    return await Bun.stdin.text();
  }
  return fs.readFileSync(inputPath, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        prefer: { type: "string", default: "exported" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values, positionals } = parsed;

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }
  const prefer = values.prefer;
  if (prefer !== "exported" && prefer !== "local") {
    console.error(USAGE);
    console.error(`unknown --prefer value: ${prefer}`);
    process.exit(64);
  }

  const inputPath = positionals[0]!;
  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: NormalizeExportsResult;
  try {
    result = normalizeExports(source, { prefer: prefer as "exported" | "local" });
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  if (values.out) {
    try {
      fs.writeFileSync(values.out, result.code);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(result.code);
  }

  console.error(
    `normalize-exports: ${result.stats.inlined} inlined, ${result.stats.preserved} preserved`,
  );
}

if (import.meta.main) {
  await main();
}
