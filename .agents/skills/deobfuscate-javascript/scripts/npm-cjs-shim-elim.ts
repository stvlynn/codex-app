import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((
  babelGenerator as unknown as { default?: typeof babelGenerator }
).default ?? babelGenerator) as typeof babelGenerator;

const PARSER_PLUGINS: parser.ParserPlugin[] = [
  "jsx",
  "typescript",
  "classProperties",
  "classPrivateProperties",
  "classPrivateMethods",
  "dynamicImport",
  "importMeta",
  "objectRestSpread",
  "topLevelAwait",
];

export type NpmCjsShimStats = {
  namespaceVarsCollapsed: number;
  directMembersCollapsed: number;
};

export type NpmCjsShimResult = {
  code: string;
  stats: NpmCjsShimStats;
};

function parseSource(source: string): t.File {
  return parser.parse(source, {
    sourceType: "module",
    errorRecovery: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowUndeclaredExports: true,
    plugins: PARSER_PLUGINS,
  });
}

function collectDefaultImports(ast: t.File): Set<string> {
  const out = new Set<string>();
  traverse(ast, {
    ImportDeclaration(importPath) {
      if (importPath.node.source.value.startsWith(".")) return;
      for (const spec of importPath.node.specifiers) {
        if (t.isImportDefaultSpecifier(spec)) out.add(spec.local.name);
      }
    },
  });
  return out;
}

function isImportedDefaultCall(
  node: t.Node,
  defaultImports: Set<string>,
): string | null {
  return t.isCallExpression(node) &&
    t.isIdentifier(node.callee) &&
    defaultImports.has(node.callee.name)
    ? node.callee.name
    : null;
}

function isToESModuleCall(
  node: t.Node | null | undefined,
  defaultImports: Set<string>,
): string | null {
  if (!t.isCallExpression(node)) return null;
  if (!t.isIdentifier(node.callee, { name: "toESModule" })) return null;
  const firstArg = node.arguments[0];
  if (!firstArg) return null;
  return isImportedDefaultCall(firstArg, defaultImports);
}

function removeDeclarator(
  path: import("@babel/traverse").NodePath<t.VariableDeclarator>,
): void {
  const parent = path.parentPath;
  path.remove();
  if (parent.isVariableDeclaration() && parent.node.declarations.length === 0) {
    parent.remove();
  }
}

export function eliminateNpmCjsShim(source: string): NpmCjsShimResult {
  const ast = parseSource(source);
  const stats: NpmCjsShimStats = {
    namespaceVarsCollapsed: 0,
    directMembersCollapsed: 0,
  };
  const defaultImports = collectDefaultImports(ast);
  if (defaultImports.size === 0) {
    return { code: source, stats };
  }

  traverse(ast, {
    VariableDeclarator(varPath) {
      const id = varPath.node.id;
      if (!t.isIdentifier(id)) return;
      const replacement = isToESModuleCall(varPath.node.init, defaultImports);
      if (!replacement) return;
      const binding = varPath.scope.getBinding(id.name);
      if (binding) {
        for (const ref of binding.referencePaths) {
          ref.replaceWith(t.identifier(replacement));
        }
      }
      removeDeclarator(varPath);
      stats.namespaceVarsCollapsed++;
    },
  });

  traverse(ast, {
    MemberExpression(memberPath) {
      if (memberPath.node.computed) return;
      const replacement = isToESModuleCall(
        memberPath.node.object as t.Expression,
        defaultImports,
      );
      if (!replacement) return;
      memberPath.get("object").replaceWith(t.identifier(replacement));
      stats.directMembersCollapsed++;
    },
  });

  const code = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
  }).code;
  return { code: code.endsWith("\n") ? code : `${code}\n`, stats };
}

const USAGE =
  "Usage: bun scripts/npm-cjs-shim-elim.ts <input.js|-> [--out output.js]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") return await Bun.stdin.text();
  return fs.readFileSync(inputPath, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: { out: { type: "string", short: "o" } },
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

  try {
    const result = eliminateNpmCjsShim(await readInput(positionals[0]!));
    if (values.out) {
      fs.writeFileSync(values.out, result.code);
    } else {
      process.stdout.write(result.code);
    }
    console.error(
      `npm-cjs-shim-elim: ${result.stats.namespaceVarsCollapsed} vars, ` +
        `${result.stats.directMembersCollapsed} direct members`,
    );
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
