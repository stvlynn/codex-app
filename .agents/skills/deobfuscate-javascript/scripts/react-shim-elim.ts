import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";
import { formatPath } from "./format.ts";

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

export type ReactShimElimStats = {
  reactNamespacesCollapsed: number;
  directMemberShimsCollapsed: number;
  importsRemoved: number;
  importDeclarationsRemoved: number;
};

export type ReactShimElimResult = {
  code: string;
  stats: ReactShimElimStats;
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

function isJsxRuntimeSource(source: string): boolean {
  return /(?:^|[/.-])jsx(?:-dev)?-runtime(?:[/.-]|$)/.test(source);
}

function isRuntimeHelperSource(source: string): boolean {
  return /(?:^|[/])chunk-[A-Za-z0-9_-]+\.js$/.test(source);
}

function localImportSources(ast: t.File): Map<string, string> {
  const out = new Map<string, string>();
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      for (const specifier of path.node.specifiers) {
        out.set(specifier.local.name, source);
      }
    },
  });
  return out;
}

function isReactNamespaceShim(
  init: t.Expression | null | undefined,
  importSources: Map<string, string>,
): boolean {
  if (!t.isCallExpression(init)) return false;
  if (!t.isIdentifier(init.callee)) return false;
  const helperSource = importSources.get(init.callee.name);
  if (!helperSource || !isRuntimeHelperSource(helperSource)) return false;
  const firstArg = init.arguments[0];
  if (!t.isCallExpression(firstArg)) return false;
  if (!t.isIdentifier(firstArg.callee)) return false;
  const runtimeSource = importSources.get(firstArg.callee.name);
  return Boolean(runtimeSource && isJsxRuntimeSource(runtimeSource));
}

function isReactNamespaceShimMember(
  node: t.Node,
  importSources: Map<string, string>,
): node is t.MemberExpression {
  return (
    t.isMemberExpression(node) &&
    !node.computed &&
    isReactNamespaceShim(node.object as t.Expression, importSources)
  );
}

function ensureReactDefaultImport(ast: t.File): void {
  const hasReactBinding = ast.program.body.some(
    (statement) =>
      t.isImportDeclaration(statement) &&
      statement.source.value === "react" &&
      statement.specifiers.some(
        (specifier) =>
          t.isImportDefaultSpecifier(specifier) &&
          specifier.local.name === "React",
      ),
  );
  if (hasReactBinding) return;
  ast.program.body.unshift(
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier("React"))],
      t.stringLiteral("react"),
    ),
  );
}

function removeUnusedImportSpecifiers(
  ast: t.File,
  stats: ReactShimElimStats,
): void {
  traverse(ast, {
    Program(programPath) {
      programPath.scope.crawl();
      for (const statementPath of programPath.get("body")) {
        if (!statementPath.isImportDeclaration()) continue;
        for (const specifierPath of statementPath.get("specifiers")) {
          const localName = specifierPath.node.local.name;
          const binding = programPath.scope.getBinding(localName);
          if (binding && binding.references > 0) continue;
          specifierPath.remove();
          stats.importsRemoved++;
        }
        if (statementPath.node.specifiers.length === 0) {
          statementPath.remove();
          stats.importDeclarationsRemoved++;
        }
      }
    },
  });
}

export function eliminateReactShim(source: string): ReactShimElimResult {
  const ast = parseSource(source);
  const stats: ReactShimElimStats = {
    reactNamespacesCollapsed: 0,
    directMemberShimsCollapsed: 0,
    importsRemoved: 0,
    importDeclarationsRemoved: 0,
  };
  const importSources = localImportSources(ast);
  let needsReactImport = false;

  traverse(ast, {
    MemberExpression(path) {
      if (!isReactNamespaceShimMember(path.node, importSources)) return;
      path.get("object").replaceWith(t.identifier("React"));
      stats.directMemberShimsCollapsed++;
      needsReactImport = true;
    },
    Program(programPath) {
      for (const statementPath of programPath.get("body")) {
        if (!statementPath.isVariableDeclaration()) continue;
        for (const declaratorPath of statementPath.get("declarations")) {
          const id = declaratorPath.node.id;
          if (!t.isIdentifier(id)) continue;
          if (!isReactNamespaceShim(declaratorPath.node.init, importSources))
            continue;
          programPath.scope.rename(id.name, "React");
          declaratorPath.remove();
          stats.reactNamespacesCollapsed++;
          needsReactImport = true;
        }
        if (
          !statementPath.removed &&
          statementPath.node?.declarations.length === 0
        ) {
          statementPath.remove();
        }
      }
    },
  });

  if (needsReactImport) ensureReactDefaultImport(ast);
  removeUnusedImportSpecifiers(ast, stats);
  return {
    code: generate(ast, { jsescOption: { minimal: true } }).code,
    stats,
  };
}

const USAGE =
  "Usage: bun scripts/react-shim-elim.ts <input.tsx|-> [--out output.tsx] [--format]";

async function readInput(inputPath: string): Promise<string> {
  if (inputPath === "-") return await Bun.stdin.text();
  return fs.readFileSync(inputPath, "utf-8");
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        out: { type: "string", short: "o" },
        format: { type: "boolean", default: false },
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
  try {
    const result = eliminateReactShim(await readInput(positionals[0]!));
    if (values.out) {
      fs.writeFileSync(values.out, `${result.code}\n`);
      if (values.format) formatPath(values.out);
    } else {
      process.stdout.write(`${result.code}\n`);
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
