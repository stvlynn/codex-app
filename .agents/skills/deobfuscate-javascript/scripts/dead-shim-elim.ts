// Dead-shim elimination: a final polish pass that removes Vite/Rolldown
// lazy-getter scaffolding once the surrounding code no longer references it.
//
// Concrete patterns we handle:
//
//   import { t as loadJsxRuntime } from "./jsx-runtime-XXX.js";
//   var jsxRuntime = loadJsxRuntime();      // 1. unused var with single-call init
//                                           // 2. callee bound to an import specifier
//                                           // 3. import specifier has no other refs
//
//   // → all three lines removed
//
// We run this iteratively to a fixpoint so cascading removals (e.g. removing
// a var causes its callee import binding to drop to zero references) collapse
// in a single pass.

import * as parser from "@babel/parser";
import babelTraverse, { type Binding, type NodePath } from "@babel/traverse";
import babelGenerator from "@babel/generator";
import * as t from "@babel/types";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;
const generate = ((
  babelGenerator as unknown as { default?: typeof babelGenerator }
).default ?? babelGenerator) as typeof babelGenerator;

export type DeadShimStats = {
  varsRemoved: number;
  importsRemoved: number;
  importDeclarationsRemoved: number;
  expressionStatementsRemoved: number;
};

export type DeadShimResult = {
  code: string;
  stats: DeadShimStats;
};

const PARSER_PLUGINS: parser.ParserPlugin[] = [
  "jsx",
  "typescript",
  "classProperties",
  "dynamicImport",
  "importMeta",
  "objectRestSpread",
  "topLevelAwait",
];

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

function isHarmlessInit(node: t.Expression | null | undefined): boolean {
  if (!node) return true;
  if (
    t.isLiteral(node) ||
    t.isIdentifier(node) ||
    t.isArrowFunctionExpression(node) ||
    t.isFunctionExpression(node) ||
    t.isClassExpression(node)
  ) {
    return true;
  }
  if (t.isUnaryExpression(node) && node.operator !== "delete") {
    return isHarmlessInit(node.argument as t.Expression);
  }
  if (t.isArrayExpression(node)) {
    return node.elements.every(
      (el) => el === null || (t.isExpression(el) && isHarmlessInit(el)),
    );
  }
  if (t.isObjectExpression(node)) {
    for (const prop of node.properties) {
      if (t.isObjectProperty(prop) && t.isExpression(prop.value)) {
        if (!isHarmlessInit(prop.value)) return false;
        continue;
      }
      if (t.isSpreadElement(prop)) {
        if (!isHarmlessInit(prop.argument)) return false;
        continue;
      }
      return false;
    }
    return true;
  }
  // CallExpression: only safe if the callee is a local identifier whose
  // binding we will also remove. The caller decides; we report it here.
  if (t.isCallExpression(node) && node.arguments.length === 0) {
    const callee = node.callee;
    if (t.isIdentifier(callee)) return true; // tentatively — caller checks ref counts
  }
  return false;
}

function isImportBindingPath(path: NodePath): boolean {
  return (
    path.isImportSpecifier() ||
    path.isImportDefaultSpecifier() ||
    path.isImportNamespaceSpecifier()
  );
}

function importSourceForBinding(binding: Binding): string | null {
  const path = binding.path;
  if (!isImportBindingPath(path)) return null;
  const parent = path.parentPath;
  if (!parent || !parent.isImportDeclaration()) return null;
  return parent.node.source.value;
}

function isJsxRuntimeImport(source: string): boolean {
  return /(?:^|[/.-])jsx(?:-dev)?-runtime(?:[/.-]|$)/.test(source);
}

function isRuntimeHelperImport(source: string): boolean {
  return (
    isJsxRuntimeImport(source) ||
    /(?:^|[/])chunk-[A-Za-z0-9_-]+\.js$/.test(source)
  );
}

function collectRuntimeInitRefs(
  node: t.Expression,
  refs: Set<string>,
): boolean {
  if (t.isIdentifier(node)) {
    refs.add(node.name);
    return true;
  }
  if (t.isLiteral(node)) return true;
  if (!t.isCallExpression(node)) return false;
  if (!t.isIdentifier(node.callee)) return false;
  refs.add(node.callee.name);
  for (const arg of node.arguments) {
    if (!t.isExpression(arg)) return false;
    if (!collectRuntimeInitRefs(arg, refs)) return false;
  }
  return true;
}

function isDeadRuntimeInitExpression(
  expr: t.Expression,
  statementPath: NodePath<t.ExpressionStatement>,
  programPath: NodePath<t.Program>,
): boolean {
  const refs = new Set<string>();
  if (!collectRuntimeInitRefs(expr, refs)) return false;
  if (refs.size === 0) return false;

  let sawJsxRuntime = false;
  for (const name of refs) {
    const binding = programPath.scope.getBinding(name);
    if (!binding) return false;
    const source = importSourceForBinding(binding);
    if (!source || !isRuntimeHelperImport(source)) return false;
    if (isJsxRuntimeImport(source)) sawJsxRuntime = true;
    const otherRefs = binding.referencePaths.filter(
      (refPath) => !refPath.findParent((parent) => parent === statementPath),
    );
    if (otherRefs.length > 0) return false;
  }

  return sawJsxRuntime;
}

function pass(ast: t.File, stats: DeadShimStats): boolean {
  let progressed = false;
  traverse(ast, {
    Program(programPath) {
      programPath.scope.crawl();
      for (const stmt of programPath.get("body")) {
        if (!stmt.isExpressionStatement()) continue;
        const expr = stmt.node.expression;
        if (!t.isCallExpression(expr)) continue;
        if (!isDeadRuntimeInitExpression(expr, stmt, programPath)) continue;
        try {
          stmt.remove();
          stats.expressionStatementsRemoved++;
          progressed = true;
        } catch {
          // ignore
        }
      }
      if (progressed) return;

      const bindings = programPath.scope.bindings;
      for (const name of Object.keys(bindings)) {
        const binding = bindings[name];
        if (!binding) continue;
        if (binding.references !== 0) continue;
        if (binding.constantViolations.length !== 0) continue;
        const path = binding.path;

        // Case 1: unused top-level variable declarator.
        if (path.isVariableDeclarator()) {
          const init = path.node.init;
          // Allow CallExpression init only when the callee resolves to another
          // top-level binding that's also unreferenced (chained dead getter).
          let safe = true;
          if (init && !isHarmlessInit(init)) safe = false;
          if (safe && init && t.isCallExpression(init)) {
            const callee = init.callee;
            if (t.isIdentifier(callee)) {
              const calleeBinding = programPath.scope.getBinding(callee.name);
              if (!calleeBinding) safe = false;
              else {
                // Count refs that AREN'T this initializer.
                const otherRefs = calleeBinding.referencePaths.filter(
                  (rp) => rp.node !== callee,
                );
                if (otherRefs.length > 0) safe = false;
              }
              for (const arg of init.arguments) {
                if (!t.isExpression(arg) || !isHarmlessInit(arg)) {
                  safe = false;
                  break;
                }
              }
            } else {
              safe = false;
            }
          }
          if (!safe) continue;
          const decl = path.parentPath;
          if (!decl || !decl.isVariableDeclaration()) continue;
          try {
            if (decl.node.declarations.length === 1) decl.remove();
            else path.remove();
            stats.varsRemoved++;
            progressed = true;
          } catch {
            // ignore
          }
          continue;
        }

        // Case 2: unused import specifier. Drop the specifier; if the parent
        // import declaration becomes empty, drop it too.
        if (
          path.isImportSpecifier() ||
          path.isImportDefaultSpecifier() ||
          path.isImportNamespaceSpecifier()
        ) {
          const decl = path.parentPath;
          if (!decl || !decl.isImportDeclaration()) continue;
          try {
            path.remove();
            stats.importsRemoved++;
            progressed = true;
            if (decl.node.specifiers.length === 0) {
              decl.remove();
              stats.importDeclarationsRemoved++;
            }
          } catch {
            // ignore
          }
        }
      }
    },
  });
  return progressed;
}

export function eliminateDeadShim(source: string): DeadShimResult {
  const stats: DeadShimStats = {
    varsRemoved: 0,
    importsRemoved: 0,
    importDeclarationsRemoved: 0,
    expressionStatementsRemoved: 0,
  };
  let ast = parseSource(source);
  let guard = 0;
  while (guard++ < 8) {
    const progressed = pass(ast, stats);
    if (!progressed) break;
    // Re-parse to refresh scope bindings cleanly.
    const intermediate = generate(ast, { jsescOption: { minimal: true } }).code;
    ast = parseSource(intermediate);
  }
  const code = generate(ast, { jsescOption: { minimal: true } }).code;
  return { code, stats };
}

export const __test = { isHarmlessInit, pass, isDeadRuntimeInitExpression };
