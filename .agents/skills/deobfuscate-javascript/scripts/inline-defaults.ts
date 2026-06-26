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

export type InlineDefaultsStats = {
  letAssignMerged: number;
  defaultsInlined: number;
  aliasesRemoved: number;
};

export type InlineDefaultsResult = {
  code: string;
  stats: InlineDefaultsStats;
};

export type InlineDefaultsOptions = {
  allowNullish?: boolean;
};

function isSafeDefault(expr: t.Node): expr is t.Expression {
  if (
    t.isStringLiteral(expr) ||
    t.isNumericLiteral(expr) ||
    t.isBooleanLiteral(expr) ||
    t.isNullLiteral(expr)
  ) {
    return true;
  }
  if (t.isIdentifier(expr) && expr.name === "undefined") return true;
  if (t.isUnaryExpression(expr) && expr.operator === "-" && t.isNumericLiteral(expr.argument)) {
    return true;
  }
  if (t.isArrayExpression(expr) && expr.elements.length === 0) return true;
  if (t.isObjectExpression(expr) && expr.properties.length === 0) return true;
  if (t.isTemplateLiteral(expr) && expr.expressions.length === 0) return true;
  return false;
}

function mergeLetAssign(ast: t.File, stats: InlineDefaultsStats): void {
  traverse(ast, {
    VariableDeclaration(path) {
      if (path.node.kind !== "let") return;
      const decls = path.node.declarations;
      if (decls.length === 0) return;

      const names = new Set<string>();
      for (const d of decls) {
        if (!t.isIdentifier(d.id)) return;
        if (d.init) return;
        names.add(d.id.name);
      }

      const next = path.getSibling(
        (path.key as number) + 1,
      );
      if (!next || !next.isExpressionStatement()) return;
      const expr = next.node.expression;
      if (!t.isAssignmentExpression(expr) || expr.operator !== "=") return;
      if (!t.isObjectPattern(expr.left)) return;

      const pattern = expr.left;
      const patternNames = new Set<string>();
      for (const prop of pattern.properties) {
        if (t.isRestElement(prop)) {
          if (!t.isIdentifier(prop.argument)) return;
          patternNames.add(prop.argument.name);
          continue;
        }
        if (!t.isObjectProperty(prop)) return;
        let local: string | null = null;
        if (t.isIdentifier(prop.value)) local = prop.value.name;
        else if (t.isAssignmentPattern(prop.value) && t.isIdentifier(prop.value.left)) {
          local = prop.value.left.name;
        }
        if (!local) return;
        patternNames.add(local);
      }

      if (names.size !== patternNames.size) return;
      for (const n of names) if (!patternNames.has(n)) return;

      const merged = t.variableDeclaration("let", [
        t.variableDeclarator(pattern, expr.right),
      ]);
      path.replaceWith(merged);
      next.remove();
      stats.letAssignMerged++;
    },
  });
}

function findFunctionScope(path: NodePath): NodePath | null {
  let cur: NodePath | null = path;
  while (cur) {
    if (cur.isFunction() || cur.isProgram()) return cur;
    cur = cur.parentPath;
  }
  return null;
}

function findDestructurePropertyForBinding(
  scope: NodePath,
  name: string,
): {
  pattern: t.ObjectPattern;
  property: t.ObjectProperty;
} | null {
  let result: { pattern: t.ObjectPattern; property: t.ObjectProperty } | null = null;
  scope.traverse({
    Function(p) {
      if (p === scope) return;
      p.skip();
    },
    ObjectPattern(p) {
      if (result) return;
      for (const prop of p.node.properties) {
        if (!t.isObjectProperty(prop)) continue;
        let local: string | null = null;
        if (t.isIdentifier(prop.value)) local = prop.value.name;
        else if (t.isAssignmentPattern(prop.value) && t.isIdentifier(prop.value.left)) {
          local = prop.value.left.name;
        }
        if (local === name) {
          result = { pattern: p.node, property: prop };
          p.stop();
          return;
        }
      }
    },
  });
  return result;
}

type DefaultMatch = {
  targetName: string;
  sourceName: string;
  defaultValue: t.Expression;
  declaratorPath: NodePath<t.VariableDeclarator>;
};

function matchUndefinedTernary(
  decl: t.VariableDeclarator,
): { sourceName: string; defaultValue: t.Expression } | null {
  if (!t.isIdentifier(decl.id) || !decl.init) return null;
  if (!t.isConditionalExpression(decl.init)) return null;
  const { test, consequent, alternate } = decl.init;
  if (!t.isBinaryExpression(test)) return null;
  const { left, right, operator } = test;
  let sourceName: string | null = null;
  let positiveBranch: t.Expression;
  let negativeBranch: t.Expression;

  const undefinedSide = (n: t.Node): boolean =>
    (t.isIdentifier(n) && n.name === "undefined") ||
    (t.isUnaryExpression(n) && n.operator === "void");

  if (operator === "===") {
    if (t.isIdentifier(left) && undefinedSide(right)) {
      sourceName = left.name;
    } else if (t.isIdentifier(right) && undefinedSide(left)) {
      sourceName = right.name;
    } else {
      return null;
    }
    positiveBranch = consequent;
    negativeBranch = alternate;
  } else if (operator === "!==") {
    if (t.isIdentifier(left) && undefinedSide(right)) {
      sourceName = left.name;
    } else if (t.isIdentifier(right) && undefinedSide(left)) {
      sourceName = right.name;
    } else {
      return null;
    }
    positiveBranch = alternate;
    negativeBranch = consequent;
  } else {
    return null;
  }

  if (!t.isIdentifier(negativeBranch) || negativeBranch.name !== sourceName) {
    return null;
  }
  if (!isSafeDefault(positiveBranch)) return null;
  return { sourceName, defaultValue: positiveBranch };
}

function matchNullishCoalesce(
  decl: t.VariableDeclarator,
): { sourceName: string; defaultValue: t.Expression } | null {
  if (!t.isIdentifier(decl.id) || !decl.init) return null;
  if (!t.isLogicalExpression(decl.init)) return null;
  if (decl.init.operator !== "??") return null;
  if (!t.isIdentifier(decl.init.left)) return null;
  if (!isSafeDefault(decl.init.right)) return null;
  return {
    sourceName: decl.init.left.name,
    defaultValue: decl.init.right,
  };
}

function inlineOne(
  match: DefaultMatch,
  programScope: NodePath,
  stats: InlineDefaultsStats,
): boolean {
  const fnScope = findFunctionScope(match.declaratorPath);
  if (!fnScope) return false;
  const found = findDestructurePropertyForBinding(fnScope, match.sourceName);
  if (!found) return false;

  const { property } = found;
  let valueIdent: t.Identifier;
  let existingDefault: t.Expression | null = null;
  if (t.isIdentifier(property.value)) {
    valueIdent = property.value;
  } else if (
    t.isAssignmentPattern(property.value) &&
    t.isIdentifier(property.value.left)
  ) {
    valueIdent = property.value.left;
    existingDefault = property.value.right;
  } else {
    return false;
  }

  if (existingDefault) {
    if (!t.isNodesEquivalent(existingDefault, match.defaultValue)) return false;
  }

  const sourcePropertyName =
    t.isIdentifier(property.key) ? property.key.name :
    t.isStringLiteral(property.key) ? property.key.value :
    null;
  if (!sourcePropertyName) return false;

  const targetName = match.targetName;
  const sourceName = match.sourceName;
  const renameToSource = targetName !== sourceName;

  const fnBinding = fnScope.scope.getBinding(targetName);
  if (!fnBinding) return false;

  const declPath = match.declaratorPath;
  const declListPath = declPath.parentPath as NodePath<t.VariableDeclaration>;
  if (!declListPath.isVariableDeclaration()) return false;
  const declList = declListPath.node;
  const idxInList = declList.declarations.indexOf(declPath.node);
  if (idxInList < 0) return false;

  if (renameToSource) {
    const sourceBinding = fnScope.scope.getBinding(sourceName);
    if (!sourceBinding) return false;
    for (const ref of fnBinding.referencePaths) {
      if (!ref.isIdentifier()) return false;
      if (ref.scope.getBinding(sourceName) !== sourceBinding) return false;
    }
  }

  if (!existingDefault) {
    property.value = t.assignmentPattern(
      t.identifier(sourceName),
      t.cloneNode(match.defaultValue),
    );
  }

  if (renameToSource) {
    for (const ref of [...fnBinding.referencePaths]) {
      if (ref.isIdentifier()) {
        ref.node.name = sourceName;
      }
    }
    stats.aliasesRemoved++;
  }

  if (declList.declarations.length === 1) {
    declListPath.remove();
  } else {
    declList.declarations.splice(idxInList, 1);
  }

  stats.defaultsInlined++;
  return true;
}

function collectMatches(ast: t.File): DefaultMatch[] {
  const matches: DefaultMatch[] = [];
  traverse(ast, {
    VariableDeclarator(path) {
      if (!t.isIdentifier(path.node.id)) return;
      const targetName = path.node.id.name;
      const ternary = matchUndefinedTernary(path.node);
      const nullish = ternary ?? matchNullishCoalesce(path.node);
      if (!nullish) return;
      matches.push({
        targetName,
        sourceName: nullish.sourceName,
        defaultValue: nullish.defaultValue,
        declaratorPath: path,
      });
    },
  });
  return matches;
}

export function inlineDefaults(
  source: string,
  _opts: InlineDefaultsOptions = {},
): InlineDefaultsResult {
  const stats: InlineDefaultsStats = {
    letAssignMerged: 0,
    defaultsInlined: 0,
    aliasesRemoved: 0,
  };
  if (!source) return { code: "", stats };

  const ast = parseSource(source);

  mergeLetAssign(ast, stats);

  let programPath: NodePath<t.Program> | null = null;
  traverse(ast, {
    Program(p) {
      programPath = p;
    },
  });
  if (!programPath) {
    const { code } = generate(ast, {
      retainLines: false,
      compact: false,
      concise: false,
      jsescOption: { minimal: true },
    });
    return { code: code.endsWith("\n") ? code : code + "\n", stats };
  }

  let progressed = true;
  let safety = 0;
  while (progressed && safety++ < 20) {
    progressed = false;
    (programPath as NodePath<t.Program>).scope.crawl();
    const matches = collectMatches(ast);
    for (const m of matches) {
      if (m.declaratorPath.removed) continue;
      if (inlineOne(m, programPath as NodePath<t.Program>, stats)) {
        progressed = true;
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
  "Usage: bun scripts/inline-defaults.ts <input.js|-> [--out output.js]";

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

  const inputPath = positionals[0]!;
  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: InlineDefaultsResult;
  try {
    result = inlineDefaults(source);
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
    `inline-defaults: ${result.stats.letAssignMerged} let+assign merged, ` +
      `${result.stats.defaultsInlined} defaults inlined, ` +
      `${result.stats.aliasesRemoved} aliases removed`,
  );
}

if (import.meta.main) {
  await main();
}
