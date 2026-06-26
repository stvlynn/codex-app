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

const IDENT_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally",
  "for", "function", "if", "import", "in", "instanceof", "new", "null",
  "return", "super", "switch", "this", "throw", "true", "try", "typeof",
  "var", "void", "while", "with", "yield", "let", "static",
  "implements", "interface", "package", "private", "protected", "public",
  "await",
]);

function isValidIdentifierName(name: string): boolean {
  return IDENT_RE.test(name) && !RESERVED.has(name);
}

export type SimplifyStats = {
  passes: number;
  constantsFolded: number;
  deadIfsRemoved: number;
  conditionalCollapsed: number;
  logicalCollapsed: number;
  inlinedConstants: number;
  computedToDot: number;
  sequencesExpanded: number;
  notNotCollapsed: number;
  identityOps: number;
  zeroCommaStripped: number;
  templateLiteralsCollapsed: number;
  shorthandRestored: number;
  boolObjectKeyCollapsed: number;
};

export type SimplifyOptions = {
  maxPasses?: number;
  noInline?: boolean;
};

export type SimplifyResult = {
  code: string;
  stats: SimplifyStats;
};

function emptyStats(): SimplifyStats {
  return {
    passes: 0,
    constantsFolded: 0,
    deadIfsRemoved: 0,
    conditionalCollapsed: 0,
    logicalCollapsed: 0,
    inlinedConstants: 0,
    computedToDot: 0,
    sequencesExpanded: 0,
    notNotCollapsed: 0,
    identityOps: 0,
    zeroCommaStripped: 0,
    templateLiteralsCollapsed: 0,
    shorthandRestored: 0,
    boolObjectKeyCollapsed: 0,
  };
}

function foldBinary(node: t.BinaryExpression): t.Expression | null {
  const { left, right, operator } = node;
  if (t.isNumericLiteral(left) && t.isNumericLiteral(right)) {
    const l = left.value;
    const r = right.value;
    let res: number | undefined;
    switch (operator) {
      case "+": res = l + r; break;
      case "-": res = l - r; break;
      case "*": res = l * r; break;
      case "/": res = r !== 0 ? l / r : undefined; break;
      case "%": res = r !== 0 ? l % r : undefined; break;
      case "**": res = l ** r; break;
      case "|": res = l | r; break;
      case "&": res = l & r; break;
      case "^": res = l ^ r; break;
      case "<<": res = l << r; break;
      case ">>": res = l >> r; break;
      case ">>>": res = l >>> r; break;
    }
    if (res !== undefined && Number.isFinite(res)) {
      if (res < 0) {
        return t.unaryExpression("-", t.numericLiteral(-res));
      }
      return t.numericLiteral(res);
    }
  }
  if (
    operator === "+" &&
    t.isStringLiteral(left) &&
    t.isStringLiteral(right)
  ) {
    return t.stringLiteral(left.value + right.value);
  }
  if (
    operator === "+" &&
    t.isStringLiteral(left) &&
    t.isNumericLiteral(right)
  ) {
    return t.stringLiteral(left.value + String(right.value));
  }
  if (
    operator === "+" &&
    t.isNumericLiteral(left) &&
    t.isStringLiteral(right)
  ) {
    return t.stringLiteral(String(left.value) + right.value);
  }
  return null;
}

function foldComparison(node: t.BinaryExpression): t.Expression | null {
  const { left, right, operator } = node;
  if (
    !(t.isNumericLiteral(left) || t.isStringLiteral(left) || t.isBooleanLiteral(left)) ||
    !(t.isNumericLiteral(right) || t.isStringLiteral(right) || t.isBooleanLiteral(right))
  ) {
    return null;
  }
  if (left.type !== right.type) {
    if (operator !== "==" && operator !== "!=" && operator !== "===" && operator !== "!==") {
      return null;
    }
  }
  const lv = (left as { value: number | string | boolean }).value;
  const rv = (right as { value: number | string | boolean }).value;
  let res: boolean | undefined;
  switch (operator) {
    case "===": res = lv === rv; break;
    case "!==": res = lv !== rv; break;
    case "==": res = lv == rv; break;
    case "!=": res = lv != rv; break;
    case ">": res = (lv as number) > (rv as number); break;
    case "<": res = (lv as number) < (rv as number); break;
    case ">=": res = (lv as number) >= (rv as number); break;
    case "<=": res = (lv as number) <= (rv as number); break;
  }
  return res === undefined ? null : t.booleanLiteral(res);
}

function foldUnary(node: t.UnaryExpression): t.Expression | null {
  const { argument, operator } = node;
  if (t.isNumericLiteral(argument)) {
    if (operator === "-") return t.numericLiteral(-argument.value);
    if (operator === "+") return t.numericLiteral(argument.value);
    if (operator === "!") return t.booleanLiteral(!argument.value);
    if (operator === "~") return t.numericLiteral(~argument.value);
  }
  if (t.isBooleanLiteral(argument)) {
    if (operator === "!") return t.booleanLiteral(!argument.value);
  }
  if (t.isStringLiteral(argument)) {
    if (operator === "!") return t.booleanLiteral(!argument.value);
  }
  if (operator === "!" && t.isArrayExpression(argument)) {
    return t.booleanLiteral(false);
  }
  if (operator === "!" && t.isObjectExpression(argument)) {
    return t.booleanLiteral(false);
  }
  if (operator === "void" && (t.isLiteral(argument) || t.isIdentifier(argument))) {
    return t.identifier("undefined");
  }
  return null;
}

function literalEquals(a: t.Node, b: t.Node): boolean {
  if (a.type !== b.type) return false;
  if (t.isNumericLiteral(a) && t.isNumericLiteral(b)) return a.value === b.value;
  if (t.isStringLiteral(a) && t.isStringLiteral(b)) return a.value === b.value;
  if (t.isBooleanLiteral(a) && t.isBooleanLiteral(b)) return a.value === b.value;
  if (t.isNullLiteral(a) && t.isNullLiteral(b)) return true;
  return false;
}

function runOnePass(
  ast: t.File,
  stats: SimplifyStats,
  noInline: boolean,
): boolean {
  let changed = false;

  traverse(ast, {
    BinaryExpression: {
      exit(path) {
        const folded = foldBinary(path.node);
        if (folded) {
          path.replaceWith(folded);
          stats.constantsFolded++;
          changed = true;
          return;
        }
        const cmp = foldComparison(path.node);
        if (cmp) {
          path.replaceWith(cmp);
          stats.constantsFolded++;
          changed = true;
          return;
        }
        const { left, right, operator } = path.node;
        if (operator === "+" && t.isNumericLiteral(right) && right.value === 0) {
          path.replaceWith(left);
          stats.identityOps++;
          changed = true;
          return;
        }
        if (operator === "+" && t.isNumericLiteral(left) && left.value === 0) {
          path.replaceWith(right);
          stats.identityOps++;
          changed = true;
          return;
        }
        if (operator === "*" && t.isNumericLiteral(right) && right.value === 1) {
          path.replaceWith(left);
          stats.identityOps++;
          changed = true;
          return;
        }
        if (operator === "*" && t.isNumericLiteral(left) && left.value === 1) {
          path.replaceWith(right);
          stats.identityOps++;
          changed = true;
          return;
        }
      },
    },

    UnaryExpression: {
      exit(path) {
        const folded = foldUnary(path.node);
        if (folded) {
          path.replaceWith(folded);
          stats.constantsFolded++;
          changed = true;
          return;
        }
        const { argument, operator } = path.node;
        if (
          operator === "!" &&
          t.isUnaryExpression(argument) &&
          argument.operator === "!" &&
          t.isUnaryExpression(argument.argument) &&
          argument.argument.operator === "!"
        ) {
          path.replaceWith(argument.argument);
          stats.notNotCollapsed++;
          changed = true;
          return;
        }
      },
    },

    IfStatement(path) {
      const test = path.node.test;
      if (t.isBooleanLiteral(test) || t.isNumericLiteral(test) || t.isStringLiteral(test)) {
        const truthy = Boolean((test as { value: number | string | boolean }).value);
        if (truthy) {
          path.replaceWith(path.node.consequent);
        } else if (path.node.alternate) {
          path.replaceWith(path.node.alternate);
        } else {
          path.remove();
        }
        stats.deadIfsRemoved++;
        changed = true;
      }
    },

    ConditionalExpression(path) {
      const test = path.node.test;
      if (t.isBooleanLiteral(test) || t.isNumericLiteral(test) || t.isStringLiteral(test)) {
        const truthy = Boolean((test as { value: number | string | boolean }).value);
        path.replaceWith(truthy ? path.node.consequent : path.node.alternate);
        stats.conditionalCollapsed++;
        changed = true;
      }
    },

    LogicalExpression(path) {
      const { left, right, operator } = path.node;
      if (t.isBooleanLiteral(left)) {
        if (operator === "&&") {
          path.replaceWith(left.value ? right : left);
          stats.logicalCollapsed++;
          changed = true;
          return;
        }
        if (operator === "||") {
          path.replaceWith(left.value ? left : right);
          stats.logicalCollapsed++;
          changed = true;
          return;
        }
      }
    },

    MemberExpression: {
      exit(path) {
        const node = path.node;
        if (
          node.computed &&
          t.isStringLiteral(node.property) &&
          isValidIdentifierName(node.property.value)
        ) {
          node.computed = false;
          node.property = t.identifier(node.property.value);
          stats.computedToDot++;
          changed = true;
          return;
        }
        if (!node.computed) return;
        if (!t.isObjectExpression(node.object)) return;
        if (!t.isConditionalExpression(node.property)) return;
        const obj = node.object;
        const cond = node.property;
        if (obj.properties.length !== 2) return;
        const byKey = new Map<string, t.Expression>();
        for (const p of obj.properties) {
          if (!t.isObjectProperty(p) || p.computed) return;
          let key: string;
          if (t.isIdentifier(p.key)) key = p.key.name;
          else if (t.isStringLiteral(p.key)) key = p.key.value;
          else if (t.isBooleanLiteral(p.key)) key = String(p.key.value);
          else return;
          if (!t.isExpression(p.value)) return;
          byKey.set(key, p.value);
        }
        if (!byKey.has("true") || !byKey.has("false")) return;
        const trueExpr = byKey.get("true")!;
        const falseExpr = byKey.get("false")!;
        let testExpr: t.Expression = cond.test;
        if (
          t.isStringLiteral(cond.consequent, { value: "true" }) &&
          t.isStringLiteral(cond.alternate, { value: "false" })
        ) {
          // shape: cond ? "true" : "false"
        } else if (
          t.isStringLiteral(cond.consequent, { value: "false" }) &&
          t.isStringLiteral(cond.alternate, { value: "true" })
        ) {
          testExpr = t.unaryExpression("!", cond.test);
        } else if (t.isBooleanLiteral(cond.consequent, { value: true }) && t.isBooleanLiteral(cond.alternate, { value: false })) {
          // shape: cond ? true : false (after boolean keys)
        } else if (t.isBooleanLiteral(cond.consequent, { value: false }) && t.isBooleanLiteral(cond.alternate, { value: true })) {
          testExpr = t.unaryExpression("!", cond.test);
        } else {
          return;
        }
        if (t.isStringLiteral(falseExpr) && falseExpr.value === "") {
          path.replaceWith(t.logicalExpression("&&", testExpr, trueExpr));
        } else if (t.isStringLiteral(trueExpr) && trueExpr.value === "") {
          path.replaceWith(t.logicalExpression("&&", t.unaryExpression("!", testExpr), falseExpr));
        } else {
          path.replaceWith(t.conditionalExpression(testExpr, trueExpr, falseExpr));
        }
        stats.boolObjectKeyCollapsed++;
        changed = true;
      },
    },

    ObjectProperty(path) {
      const { key, value, computed, shorthand } = path.node;
      if (
        computed &&
        t.isStringLiteral(key) &&
        isValidIdentifierName(key.value)
      ) {
        path.node.computed = false;
        path.node.key = t.identifier(key.value);
        stats.computedToDot++;
        changed = true;
      }
      if (
        !shorthand &&
        !path.node.computed &&
        t.isIdentifier(path.node.key) &&
        t.isIdentifier(value) &&
        path.node.key.name === value.name
      ) {
        path.node.shorthand = true;
        stats.shorthandRestored++;
        changed = true;
      }
    },

    SequenceExpression(path) {
      const { expressions } = path.node;
      if (expressions.length === 1 && expressions[0]) {
        path.replaceWith(expressions[0]);
        stats.sequencesExpanded++;
        changed = true;
        return;
      }
      if (path.parentPath.isExpressionStatement()) {
        const statements = expressions.map((expr) =>
          t.expressionStatement(expr),
        );
        path.parentPath.replaceWithMultiple(statements);
        stats.sequencesExpanded++;
        changed = true;
        return;
      }
    },

    CallExpression(path) {
      const callee = path.node.callee;
      if (
        t.isSequenceExpression(callee) &&
        callee.expressions.length === 2 &&
        t.isNumericLiteral(callee.expressions[0]!, { value: 0 })
      ) {
        path.node.callee = callee.expressions[1]!;
        stats.zeroCommaStripped++;
        changed = true;
      }
    },

    TemplateLiteral(path) {
      const { quasis, expressions } = path.node;
      if (expressions.length !== 0 || quasis.length !== 1) return;
      if (path.parentPath?.isTaggedTemplateExpression()) return;
      const cooked = quasis[0]!.value.cooked ?? quasis[0]!.value.raw;
      path.replaceWith(t.stringLiteral(cooked));
      stats.templateLiteralsCollapsed++;
      changed = true;
    },
  });

  if (!noInline) {
    if (inlineConstants(ast, stats)) changed = true;
  }

  return changed;
}

function inlineConstants(ast: t.File, stats: SimplifyStats): boolean {
  let changed = false;
  const programPath: { value: NodePath<t.Program> | null } = { value: null };

  traverse(ast, {
    Program(p) {
      programPath.value = p;
    },
  });
  if (!programPath.value) return false;

  const candidates = new Map<
    string,
    { value: t.Expression; bindingPath: NodePath; refCount: number }
  >();

  traverse(ast, {
    VariableDeclarator(path) {
      const { id, init } = path.node;
      if (!t.isIdentifier(id) || !init) return;
      if (!t.isLiteral(init)) return;
      if (t.isTemplateLiteral(init) || t.isRegExpLiteral(init)) return;
      const binding = path.scope.getBinding(id.name);
      if (!binding) return;
      if (!binding.constant) return;
      const key = `${id.name}@${id.start ?? 0}`;
      candidates.set(key, {
        value: init,
        bindingPath: binding.path,
        refCount: binding.references,
      });
    },
  });

  if (candidates.size === 0) return false;

  traverse(ast, {
    Identifier(path) {
      if (path.isBindingIdentifier({ name: path.node.name })) return;
      if (
        path.parentPath?.isMemberExpression({ property: path.node }) &&
        !path.parent.computed
      ) {
        return;
      }
      if (path.parentPath?.isObjectProperty({ key: path.node }) && !path.parent.computed) {
        return;
      }
      const binding = path.scope.getBinding(path.node.name);
      if (!binding) return;
      const key = `${path.node.name}@${binding.identifier.start ?? 0}`;
      const cand = candidates.get(key);
      if (!cand) return;
      if (binding.path !== cand.bindingPath) return;
      path.replaceWith(t.cloneNode(cand.value));
      stats.inlinedConstants++;
      changed = true;
    },
  });

  if (!changed) return false;

  programPath.value.scope.crawl();

  for (const [, cand] of candidates) {
    const bp = cand.bindingPath;
    if (bp.removed || !bp.isVariableDeclarator()) continue;
    const idNode = bp.node.id;
    if (!t.isIdentifier(idNode)) continue;
    const freshBinding = bp.scope.getBinding(idNode.name);
    if (!freshBinding || freshBinding.references > 0) continue;
    const parent = bp.parentPath;
    if (
      parent &&
      parent.isVariableDeclaration() &&
      parent.node.declarations.length === 1
    ) {
      try {
        parent.remove();
      } catch {
        // ignore
      }
    } else {
      try {
        bp.remove();
      } catch {
        // ignore
      }
    }
  }

  return changed;
}

export function simplify(
  source: string,
  opts: SimplifyOptions = {},
): SimplifyResult {
  if (!source) {
    return { code: "", stats: emptyStats() };
  }
  const maxPasses = opts.maxPasses ?? 10;
  const noInline = opts.noInline ?? false;

  const ast = parseSource(source);
  const stats = emptyStats();

  for (let i = 0; i < maxPasses; i++) {
    const changed = runOnePass(ast, stats, noInline);
    stats.passes++;
    if (!changed) break;
  }

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    comments: true,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats,
  };
}

const USAGE =
  "Usage: bun scripts/simplify.ts <input.js|-> [--out output.js] [--max-passes 10] [--no-inline]";

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
        "max-passes": { type: "string", default: "10" },
        "no-inline": { type: "boolean", default: false },
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
  const maxPasses = parseInt(values["max-passes"] ?? "10", 10);
  if (!Number.isFinite(maxPasses) || maxPasses <= 0) {
    console.error("--max-passes must be a positive integer");
    process.exit(64);
  }

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: SimplifyResult;
  try {
    result = simplify(source, {
      maxPasses,
      noInline: values["no-inline"],
    });
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

  const { stats } = result;
  const total =
    stats.constantsFolded +
    stats.deadIfsRemoved +
    stats.conditionalCollapsed +
    stats.logicalCollapsed +
    stats.inlinedConstants +
    stats.computedToDot +
    stats.sequencesExpanded +
    stats.notNotCollapsed +
    stats.identityOps +
    stats.zeroCommaStripped +
    stats.templateLiteralsCollapsed +
    stats.shorthandRestored +
    stats.boolObjectKeyCollapsed;
  console.error(
    `simplify: ${stats.passes} pass(es), ${total} simplification(s) — ` +
      `${stats.constantsFolded} folded, ${stats.deadIfsRemoved} dead-if, ` +
      `${stats.inlinedConstants} inlined, ${stats.computedToDot} computed→dot, ` +
      `${stats.sequencesExpanded} seq, ${stats.identityOps} identity, ` +
      `${stats.zeroCommaStripped} (0,fn), ${stats.templateLiteralsCollapsed} tpl→str, ` +
      `${stats.shorthandRestored} shorthand, ${stats.boolObjectKeyCollapsed} bool-obj-key`,
  );
}

if (import.meta.main) {
  await main();
}
