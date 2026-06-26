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

export type StripStats = {
  cacheVarsRemoved: number;
  conditionalsStripped: number;
  cacheReadsDropped: number;
  cacheWritesDropped: number;
  uninitMerged: number;
  unusedLocalsRemoved: number;
};

export type StripResult = {
  code: string;
  stats: StripStats;
};

function emptyStats(): StripStats {
  return {
    cacheVarsRemoved: 0,
    conditionalsStripped: 0,
    cacheReadsDropped: 0,
    cacheWritesDropped: 0,
    uninitMerged: 0,
    unusedLocalsRemoved: 0,
  };
}

const REACT_COMPILER_HINT_RE = /(?:\.\s*c\b|\buseMemoCache\s*\()/;

function isCacheMember(node: t.Node, cacheName: string): boolean {
  return (
    t.isMemberExpression(node) &&
    node.computed &&
    t.isIdentifier(node.object, { name: cacheName }) &&
    (t.isNumericLiteral(node.property) || t.isUnaryExpression(node.property))
  );
}

function isCacheWrite(expr: t.Node, cacheName: string): boolean {
  return (
    t.isAssignmentExpression(expr) &&
    expr.operator === "=" &&
    isCacheMember(expr.left, cacheName)
  );
}

function isCacheRead(expr: t.Node, cacheName: string): boolean {
  return (
    t.isAssignmentExpression(expr) &&
    expr.operator === "=" &&
    t.isIdentifier(expr.left) &&
    isCacheMember(expr.right, cacheName)
  );
}

function exprListContainsCache(exprs: readonly t.Expression[], cacheName: string): boolean {
  for (const e of exprs) {
    if (isCacheWrite(e, cacheName)) return true;
    if (isCacheRead(e, cacheName)) return true;
  }
  return false;
}

function exprListAllCacheReads(exprs: readonly t.Expression[], cacheName: string): boolean {
  if (exprs.length === 0) return false;
  for (const e of exprs) {
    if (!isCacheRead(e, cacheName)) return false;
  }
  return true;
}

function asExprList(expr: t.Expression): t.Expression[] {
  if (t.isSequenceExpression(expr)) return [...expr.expressions];
  return [expr];
}

function stripCacheOps(exprs: readonly t.Expression[], cacheName: string, stats: StripStats): t.Expression[] {
  const kept: t.Expression[] = [];
  for (const e of exprs) {
    if (isCacheWrite(e, cacheName)) {
      stats.cacheWritesDropped++;
      continue;
    }
    if (isCacheRead(e, cacheName)) {
      stats.cacheReadsDropped++;
      continue;
    }
    kept.push(e);
  }
  return kept;
}

function combineToExpression(exprs: t.Expression[]): t.Expression | null {
  if (exprs.length === 0) return null;
  if (exprs.length === 1) return exprs[0]!;
  return t.sequenceExpression(exprs);
}

function testReferencesCache(test: t.Expression, cacheName: string): boolean {
  let found = false;
  function walk(node: t.Node): void {
    if (found) return;
    if (isCacheMember(node, cacheName)) {
      found = true;
      return;
    }
    if (t.isBinaryExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isLogicalExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isUnaryExpression(node)) {
      walk(node.argument);
      return;
    }
  }
  walk(test);
  return found;
}

function findCacheVars(ast: t.File): Set<string> {
  const names = new Set<string>();
  traverse(ast, {
    VariableDeclarator(path) {
      const { id, init } = path.node;
      if (!t.isIdentifier(id)) return;
      if (!init || !t.isCallExpression(init)) return;
      if (init.arguments.length !== 1) return;
      const arg = init.arguments[0];
      if (!arg || !t.isNumericLiteral(arg)) return;
      const callee = init.callee;
      let calleeName: string | null = null;
      if (t.isIdentifier(callee)) {
        calleeName = callee.name;
      } else if (
        t.isMemberExpression(callee) &&
        !callee.computed &&
        t.isIdentifier(callee.property)
      ) {
        calleeName = callee.property.name;
      } else if (
        t.isSequenceExpression(callee) &&
        callee.expressions.length === 2 &&
        t.isNumericLiteral(callee.expressions[0]!, { value: 0 })
      ) {
        const inner = callee.expressions[1]!;
        if (
          t.isMemberExpression(inner) &&
          !inner.computed &&
          t.isIdentifier(inner.property)
        ) {
          calleeName = inner.property.name;
        }
      }
      if (calleeName !== "c" && calleeName !== "useMemoCache") return;
      names.add(id.name);
    },
  });
  return names;
}

function stripConditional(
  path: NodePath<t.ConditionalExpression>,
  cacheName: string,
  stats: StripStats,
): boolean {
  const node = path.node;
  if (!testReferencesCache(node.test, cacheName)) return false;

  const consequentList = asExprList(node.consequent);
  const alternateList = asExprList(node.alternate);

  let computeList: t.Expression[];
  if (exprListAllCacheReads(consequentList, cacheName) && exprListContainsCache(alternateList, cacheName)) {
    computeList = alternateList;
  } else if (exprListAllCacheReads(alternateList, cacheName) && exprListContainsCache(consequentList, cacheName)) {
    computeList = consequentList;
  } else if (exprListContainsCache(consequentList, cacheName) || exprListContainsCache(alternateList, cacheName)) {
    // ambiguous: pick whichever side has the most non-cache expressions
    const consNonCache = consequentList.filter((e) => !isCacheRead(e, cacheName) && !isCacheWrite(e, cacheName));
    const altNonCache = alternateList.filter((e) => !isCacheRead(e, cacheName) && !isCacheWrite(e, cacheName));
    computeList = consNonCache.length >= altNonCache.length ? consequentList : alternateList;
  } else {
    return false;
  }

  if (computeList === consequentList) {
    for (const e of asExprList(node.alternate)) {
      if (isCacheRead(e, cacheName)) stats.cacheReadsDropped++;
      else if (isCacheWrite(e, cacheName)) stats.cacheWritesDropped++;
    }
  } else {
    for (const e of asExprList(node.consequent)) {
      if (isCacheRead(e, cacheName)) stats.cacheReadsDropped++;
      else if (isCacheWrite(e, cacheName)) stats.cacheWritesDropped++;
    }
  }

  const kept = stripCacheOps(computeList, cacheName, stats);
  const combined = combineToExpression(kept);
  stats.conditionalsStripped++;
  if (combined === null) {
    if (path.parentPath.isExpressionStatement()) {
      path.parentPath.remove();
    } else {
      path.replaceWith(t.identifier("undefined"));
    }
    return true;
  }
  path.replaceWith(combined);
  return true;
}

function branchStatements(branch: t.Statement | null | undefined): t.Statement[] {
  if (!branch) return [];
  if (t.isBlockStatement(branch)) return branch.body;
  return [branch];
}

function statementContainsCacheWrite(stmt: t.Node, cacheName: string): boolean {
  let found = false;
  function walk(node: t.Node | null | undefined): void {
    if (!node || found) return;
    if (t.isExpressionStatement(node)) {
      walk(node.expression);
      return;
    }
    if (t.isSequenceExpression(node)) {
      for (const expr of node.expressions) walk(expr);
      return;
    }
    if (isCacheWrite(node, cacheName)) {
      found = true;
      return;
    }
    if (t.isBlockStatement(node)) {
      for (const child of node.body) walk(child);
      return;
    }
    if (t.isIfStatement(node)) {
      walk(node.test);
      walk(node.consequent);
      walk(node.alternate);
      return;
    }
    if (t.isVariableDeclaration(node)) {
      for (const decl of node.declarations) walk(decl.init);
      return;
    }
    if (t.isAssignmentExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isCallExpression(node)) {
      walk(node.callee as t.Node);
      for (const arg of node.arguments) {
        if (t.isNode(arg)) walk(arg);
      }
      return;
    }
    if (t.isConditionalExpression(node)) {
      walk(node.test);
      walk(node.consequent);
      walk(node.alternate);
      return;
    }
    if (t.isLogicalExpression(node) || t.isBinaryExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isUnaryExpression(node)) {
      walk(node.argument);
      return;
    }
    if (t.isMemberExpression(node)) {
      walk(node.object);
      walk(node.property);
    }
  }
  walk(stmt);
  return found;
}

function countDroppedCacheOps(stmt: t.Node, cacheName: string, stats: StripStats): void {
  function walk(node: t.Node | null | undefined): void {
    if (!node) return;
    if (isCacheWrite(node, cacheName)) {
      stats.cacheWritesDropped++;
      return;
    }
    if (isCacheRead(node, cacheName)) {
      stats.cacheReadsDropped++;
      return;
    }
    if (t.isExpressionStatement(node)) {
      walk(node.expression);
      return;
    }
    if (t.isSequenceExpression(node)) {
      for (const expr of node.expressions) walk(expr);
      return;
    }
    if (t.isBlockStatement(node)) {
      for (const child of node.body) walk(child);
      return;
    }
    if (t.isIfStatement(node)) {
      walk(node.test);
      walk(node.consequent);
      walk(node.alternate);
      return;
    }
    if (t.isVariableDeclaration(node)) {
      for (const decl of node.declarations) walk(decl.init);
      return;
    }
    if (t.isAssignmentExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isConditionalExpression(node)) {
      walk(node.test);
      walk(node.consequent);
      walk(node.alternate);
      return;
    }
    if (t.isLogicalExpression(node) || t.isBinaryExpression(node)) {
      walk(node.left);
      walk(node.right);
      return;
    }
    if (t.isUnaryExpression(node)) walk(node.argument);
  }
  walk(stmt);
}

function stripCacheOpsFromStatement(
  stmt: t.Statement,
  cacheName: string,
  stats: StripStats,
): t.Statement[] {
  if (!t.isExpressionStatement(stmt)) return [t.cloneNode(stmt, true)];
  const kept = stripCacheOps(asExprList(stmt.expression), cacheName, stats);
  const combined = combineToExpression(kept);
  return combined ? [t.expressionStatement(combined)] : [];
}

function hasBlockScopedDeclaration(statements: readonly t.Statement[]): boolean {
  return statements.some((stmt) => {
    if (t.isVariableDeclaration(stmt)) {
      return stmt.kind === "let" || stmt.kind === "const";
    }
    return t.isFunctionDeclaration(stmt) || t.isClassDeclaration(stmt);
  });
}

function stripIfStatement(
  path: NodePath<t.IfStatement>,
  cacheName: string,
  stats: StripStats,
): boolean {
  const node = path.node;
  if (!testReferencesCache(node.test, cacheName)) return false;

  const consequent = branchStatements(node.consequent);
  const alternate = branchStatements(node.alternate);
  const consequentWrites = consequent.some((stmt) => statementContainsCacheWrite(stmt, cacheName));
  const alternateWrites = alternate.some((stmt) => statementContainsCacheWrite(stmt, cacheName));
  if (!consequentWrites && !alternateWrites) return false;

  const computeBranch = consequentWrites && !alternateWrites ? consequent : alternate;
  const skippedBranch = computeBranch === consequent ? alternate : consequent;
  for (const stmt of skippedBranch) countDroppedCacheOps(stmt, cacheName, stats);

  const replacement = computeBranch.flatMap((stmt) =>
    stripCacheOpsFromStatement(stmt, cacheName, stats),
  );
  stats.conditionalsStripped++;
  if (replacement.length === 0) {
    path.remove();
  } else if (hasBlockScopedDeclaration(replacement)) {
    path.replaceWith(t.blockStatement(replacement));
  } else {
    path.replaceWithMultiple(replacement);
  }
  return true;
}

function dropTrailingIdentifierInSequence(ast: t.File): void {
  traverse(ast, {
    SequenceExpression(path) {
      const exprs = path.node.expressions;
      if (exprs.length < 2) return;
      const last = exprs[exprs.length - 1]!;
      if (!t.isIdentifier(last)) return;
      const localName = last.name;
      const previous = exprs[exprs.length - 2]!;
      if (
        t.isAssignmentExpression(previous) &&
        previous.operator === "=" &&
        t.isIdentifier(previous.left, { name: localName })
      ) {
        if (exprs.length === 2) {
          path.replaceWith(previous.right);
        } else {
          const kept = exprs.slice(0, -2);
          kept.push(previous.right);
          path.replaceWith(t.sequenceExpression(kept));
        }
      }
    },
  });
}

function mergeUninitWithLaterAssignment(ast: t.File, stats: StripStats): void {
  traverse(ast, {
    Program(programPath) {
      programPath.scope.crawl();
      programPath.traverse({
        VariableDeclarator(declPath) {
          const { id, init } = declPath.node;
          if (!t.isIdentifier(id)) return;
          if (init) return;
          const binding = declPath.scope.getBinding(id.name);
          if (!binding) return;
          if (binding.constantViolations.length !== 1) return;
          const assignmentPath = binding.constantViolations[0];
          if (!assignmentPath || !assignmentPath.isAssignmentExpression()) return;
          const assignNode = assignmentPath.node;
          if (assignNode.operator !== "=") return;
          if (!t.isIdentifier(assignNode.left, { name: id.name })) return;
          const assignStmt = assignmentPath.parentPath;
          if (!assignStmt.isExpressionStatement()) return;

          const declStmt = declPath.parentPath;
          if (!declStmt.isVariableDeclaration()) return;
          const blockPath = declStmt.parentPath;
          if (!blockPath) return;
          if (assignStmt.parentPath !== blockPath) return;
          const siblings = blockPath.get("body") as NodePath[] | undefined;
          if (!Array.isArray(siblings)) return;
          const declIdx = siblings.findIndex((p) => p.node === declStmt.node);
          const assignIdx = siblings.findIndex((p) => p.node === assignStmt.node);
          if (declIdx < 0 || assignIdx < 0) return;
          if (assignIdx <= declIdx) return;

          for (const ref of binding.referencePaths) {
            let cur: NodePath | null = ref;
            let containingStmt: NodePath | null = null;
            while (cur && cur !== blockPath) {
              if (cur.parentPath === blockPath) {
                containingStmt = cur;
                break;
              }
              cur = cur.parentPath;
            }
            if (!containingStmt) return;
            const refIdx = siblings.findIndex((p) => p.node === containingStmt.node);
            if (refIdx >= 0 && refIdx < assignIdx) return;
          }

          declPath.node.init = assignNode.right;
          if (binding.references === 0) {
            const decls = (declStmt.node as t.VariableDeclaration).declarations;
            if (decls.length === 1) {
              (declStmt.node as t.VariableDeclaration).kind = "const";
            }
          }
          assignStmt.remove();
          stats.uninitMerged++;
        },
      });
    },
  });
}

function removeUnusedLocals(ast: t.File, stats: StripStats): void {
  let progressed = true;
  let guard = 0;
  while (progressed && guard++ < 10) {
    progressed = false;
    traverse(ast, {
      Program(programPath) {
        programPath.scope.crawl();
        programPath.traverse({
          Function(fnPath) {
            const seen = new Set<string>();
            for (const name of Object.keys(fnPath.scope.bindings)) {
              if (seen.has(name)) continue;
              seen.add(name);
              const binding = fnPath.scope.bindings[name];
              if (!binding) continue;
              if (binding.kind !== "let" && binding.kind !== "const" && binding.kind !== "var") continue;
              if (binding.references !== 0) continue;
              if (binding.constantViolations.length !== 0) continue;
              const bp = binding.path;
              if (!bp.isVariableDeclarator()) continue;
              // Skip destructured declarators — multiple bindings share one
              // VariableDeclarator, so removing it would drop all sibling
              // (possibly *used*) bindings. A future pass could rewrite the
              // pattern to drop only the unused properties.
              if (bp.node.id && !t.isIdentifier(bp.node.id)) continue;
              const init = bp.node.init;
              if (init && hasSideEffects(init)) continue;
              const declStmt = bp.parentPath;
              if (!declStmt || !declStmt.isVariableDeclaration()) continue;
              try {
                if (declStmt.node.declarations.length === 1) {
                  declStmt.remove();
                } else {
                  bp.remove();
                }
                stats.unusedLocalsRemoved++;
                progressed = true;
              } catch {
                // ignore
              }
            }
          },
        });
      },
    });
  }
}

function hasSideEffects(expr: t.Expression): boolean {
  if (
    t.isLiteral(expr) ||
    t.isIdentifier(expr) ||
    t.isArrowFunctionExpression(expr) ||
    t.isFunctionExpression(expr) ||
    t.isClassExpression(expr)
  ) {
    return false;
  }
  if (t.isUnaryExpression(expr) && (expr.operator === "!" || expr.operator === "-" || expr.operator === "+" || expr.operator === "void" || expr.operator === "typeof")) {
    return hasSideEffects(expr.argument as t.Expression);
  }
  if (t.isArrayExpression(expr)) {
    return expr.elements.some((e) => e !== null && t.isExpression(e) && hasSideEffects(e));
  }
  if (t.isObjectExpression(expr)) {
    for (const p of expr.properties) {
      if (t.isObjectProperty(p) && t.isExpression(p.value) && hasSideEffects(p.value)) return true;
      if (t.isSpreadElement(p) && hasSideEffects(p.argument)) return true;
    }
    return false;
  }
  return true;
}

type BindingLike = {
  path: NodePath<t.Node>;
  references: number;
};

function bindingIsCacheVar(binding: BindingLike): boolean {
  const bindingPath = binding.path;
  if (!bindingPath.isVariableDeclarator()) return false;
  const { id, init } = bindingPath.node;
  if (!t.isIdentifier(id)) return false;
  if (!init || !t.isCallExpression(init)) return false;
  if (init.arguments.length !== 1 || !t.isNumericLiteral(init.arguments[0])) return false;

  const callee = init.callee;
  if (t.isIdentifier(callee)) {
    return callee.name === "c" || callee.name === "useMemoCache";
  }
  if (
    t.isMemberExpression(callee) &&
    !callee.computed &&
    t.isIdentifier(callee.property)
  ) {
    return callee.property.name === "c" || callee.property.name === "useMemoCache";
  }
  if (
    t.isSequenceExpression(callee) &&
    callee.expressions.length === 2 &&
    t.isNumericLiteral(callee.expressions[0]!, { value: 0 })
  ) {
    const inner = callee.expressions[1]!;
    return (
      t.isMemberExpression(inner) &&
      !inner.computed &&
      t.isIdentifier(inner.property) &&
      (inner.property.name === "c" || inner.property.name === "useMemoCache")
    );
  }
  return false;
}

function removeUnusedCacheVars(ast: t.File, cacheNames: Set<string>, stats: StripStats): void {
  traverse(ast, {
    Program(programPath) {
      programPath.scope.crawl();
      for (const name of cacheNames) {
        const binding = programPath.scope.getBinding(name);
        if (binding && bindingIsCacheVar(binding)) {
          if (binding.references === 0) {
            try {
              const parent = binding.path.parentPath;
              if (parent && parent.isVariableDeclaration() && parent.node.declarations.length === 1) {
                parent.remove();
              } else {
                binding.path.remove();
              }
              stats.cacheVarsRemoved++;
            } catch {
              // ignore
            }
          }
        }
        programPath.traverse({
          Function(fnPath) {
            const inner = fnPath.scope.getOwnBinding(name);
            if (!inner) return;
            if (!bindingIsCacheVar(inner)) return;
            if (inner.references === 0) {
              try {
                const parent = inner.path.parentPath;
                if (parent && parent.isVariableDeclaration() && parent.node.declarations.length === 1) {
                  parent.remove();
                } else {
                  inner.path.remove();
                }
                stats.cacheVarsRemoved++;
              } catch {
                // ignore
              }
            }
          },
        });
      }
    },
  });
}

export function stripReactCompiler(source: string): StripResult {
  if (!source) return { code: "", stats: emptyStats() };
  if (!REACT_COMPILER_HINT_RE.test(source)) {
    return {
      code: source.endsWith("\n") ? source : source + "\n",
      stats: emptyStats(),
    };
  }
  const ast = parseSource(source);
  const stats = emptyStats();

  const cacheNames = findCacheVars(ast);
  if (cacheNames.size === 0) {
    const { code } = generate(ast, {
      retainLines: false,
      compact: false,
      concise: false,
      jsescOption: { minimal: true },
    });
    return { code: code.endsWith("\n") ? code : code + "\n", stats };
  }

  let guard = 0;
  let changed = true;
  while (changed && guard++ < 5) {
    changed = false;
    for (const cacheName of cacheNames) {
      traverse(ast, {
        IfStatement(path) {
          if (stripIfStatement(path, cacheName, stats)) {
            changed = true;
            path.skip();
          }
        },
        ConditionalExpression(path) {
          if (stripConditional(path, cacheName, stats)) {
            changed = true;
          }
        },
      });
    }
  }

  dropTrailingIdentifierInSequence(ast);
  mergeUninitWithLaterAssignment(ast, stats);
  removeUnusedCacheVars(ast, cacheNames, stats);
  removeUnusedLocals(ast, stats);

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
  "Usage: bun scripts/strip-react-compiler.ts <input.js|-> [--out output.js]";

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

  const inputPath = positionals[0]!;

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: StripResult;
  try {
    result = stripReactCompiler(source);
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
    `strip-react-compiler: ${result.stats.conditionalsStripped} conditionals, ` +
      `${result.stats.cacheReadsDropped} reads, ` +
      `${result.stats.cacheWritesDropped} writes, ` +
      `${result.stats.cacheVarsRemoved} cache var(s) removed, ` +
      `${result.stats.uninitMerged} uninit merged, ` +
      `${result.stats.unusedLocalsRemoved} unused removed`,
  );
}

if (import.meta.main) {
  await main();
}
