import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
import * as t from "@babel/types";

const traverse = ((babelTraverse as unknown as { default?: typeof babelTraverse })
  .default ?? babelTraverse) as typeof babelTraverse;

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

export type Location = {
  start: number;
  end: number;
  line: number;
};

export type FlattenerPattern = {
  kind: "while-switch-flattening";
  loc: Location;
  dispatchVariable: string | null;
  caseCount: number;
  caseLabels: Array<string | number>;
  containingFunction: string | null;
  rewriteHint: string;
};

export type SplitDispatchPattern = {
  kind: "split-string-dispatch";
  loc: Location;
  states: string[];
  splitOn: string;
  rewriteHint: string;
};

export type OpaquePredicatePattern = {
  kind: "opaque-predicate";
  loc: Location;
  flavor:
    | "literal-vs-literal"
    | "not-not-array"
    | "not-not-object"
    | "void-zero";
  alwaysTruthy: boolean;
  rewriteHint: string;
};

export type ControlFlowReport = {
  input: string;
  size: number;
  flatteners: FlattenerPattern[];
  splitDispatches: SplitDispatchPattern[];
  opaquePredicates: OpaquePredicatePattern[];
  summary: string;
};

function lineOf(source: string, offset: number): number {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === "\n") line++;
  }
  return line;
}

function locOf(source: string, node: t.Node): Location {
  return {
    start: node.start ?? 0,
    end: node.end ?? 0,
    line: lineOf(source, node.start ?? 0),
  };
}

function getCaseLabel(test: t.Expression | null | undefined): string | number | null {
  if (test === null || test === undefined) return null;
  if (t.isStringLiteral(test)) return test.value;
  if (t.isNumericLiteral(test)) return test.value;
  return null;
}

function whileAlwaysTrue(test: t.Expression): boolean {
  if (t.isBooleanLiteral(test) && test.value) return true;
  if (t.isNumericLiteral(test) && test.value !== 0) return true;
  if (
    t.isUnaryExpression(test) &&
    test.operator === "!" &&
    t.isUnaryExpression(test.argument) &&
    test.argument.operator === "!" &&
    t.isArrayExpression(test.argument.argument)
  ) {
    return true;
  }
  return false;
}

function evalLiteralCompare(test: t.BinaryExpression): boolean | null {
  const { left, right, operator } = test;
  if (
    !(t.isNumericLiteral(left) || t.isStringLiteral(left)) ||
    !(t.isNumericLiteral(right) || t.isStringLiteral(right))
  ) {
    return null;
  }
  const lv = left.value as number | string;
  const rv = right.value as number | string;
  switch (operator) {
    case "===": return lv === rv;
    case "!==": return lv !== rv;
    case "==": return lv == rv;
    case "!=": return lv != rv;
    case ">": return (lv as number) > (rv as number);
    case "<": return (lv as number) < (rv as number);
    case ">=": return (lv as number) >= (rv as number);
    case "<=": return (lv as number) <= (rv as number);
    default: return null;
  }
}

function isNotNotArray(test: t.Expression): boolean {
  return (
    t.isUnaryExpression(test) &&
    test.operator === "!" &&
    t.isUnaryExpression(test.argument) &&
    test.argument.operator === "!" &&
    t.isArrayExpression(test.argument.argument)
  );
}

function isNotNotObject(test: t.Expression): boolean {
  return (
    t.isUnaryExpression(test) &&
    test.operator === "!" &&
    t.isUnaryExpression(test.argument) &&
    test.argument.operator === "!" &&
    t.isObjectExpression(test.argument.argument)
  );
}

function isVoidZero(test: t.Expression): boolean {
  return (
    t.isUnaryExpression(test) &&
    test.operator === "void" &&
    t.isNumericLiteral(test.argument) &&
    test.argument.value === 0
  );
}

function findContainingFunction(
  source: string,
  node: t.Node,
  ast: t.File,
): string | null {
  let containing: string | null = null;
  const start = node.start ?? 0;
  const end = node.end ?? 0;
  traverse(ast, {
    Function(path) {
      const ns = path.node.start ?? -1;
      const ne = path.node.end ?? -1;
      if (ns <= start && ne >= end) {
        let name: string | null = null;
        if (path.node.type === "FunctionDeclaration" && path.node.id) {
          name = path.node.id.name;
        } else {
          const parent = path.parent;
          if (
            t.isVariableDeclarator(parent) &&
            t.isIdentifier(parent.id)
          ) {
            name = parent.id.name;
          } else if (
            t.isAssignmentExpression(parent) &&
            t.isIdentifier(parent.left)
          ) {
            name = parent.left.name;
          } else if (t.isProperty(parent) && t.isIdentifier(parent.key)) {
            name = parent.key.name;
          }
        }
        if (name) containing = name;
      }
    },
  });
  return containing;
}

export function analyzeControlFlow(
  source: string,
  inputPath = "<stdin>",
): ControlFlowReport {
  if (!source) {
    return {
      input: inputPath,
      size: 0,
      flatteners: [],
      splitDispatches: [],
      opaquePredicates: [],
      summary: "empty input",
    };
  }

  const ast = parseSource(source);

  const flatteners: FlattenerPattern[] = [];
  const splitDispatches: SplitDispatchPattern[] = [];
  const opaquePredicates: OpaquePredicatePattern[] = [];

  traverse(ast, {
    WhileStatement(path) {
      if (!whileAlwaysTrue(path.node.test)) return;
      const body = path.node.body;
      const block = t.isBlockStatement(body) ? body : null;
      const stmts = block ? block.body : [body];
      const switchStmt = stmts.find((s) => t.isSwitchStatement(s)) as
        | t.SwitchStatement
        | undefined;
      if (!switchStmt) return;

      let dispatchVar: string | null = null;
      const disc = switchStmt.discriminant;
      if (t.isIdentifier(disc)) {
        dispatchVar = disc.name;
      } else if (t.isMemberExpression(disc) && t.isIdentifier(disc.object)) {
        dispatchVar = disc.object.name;
      } else if (t.isUpdateExpression(disc) && t.isIdentifier(disc.argument)) {
        dispatchVar = disc.argument.name;
      }

      const caseLabels: Array<string | number> = [];
      for (const c of switchStmt.cases) {
        const label = getCaseLabel(c.test ?? null);
        if (label !== null) caseLabels.push(label);
      }

      flatteners.push({
        kind: "while-switch-flattening",
        loc: locOf(source, path.node),
        dispatchVariable: dispatchVar,
        caseCount: switchStmt.cases.length,
        caseLabels,
        containingFunction: findContainingFunction(source, path.node, ast),
        rewriteHint: dispatchVar
          ? `Trace ${dispatchVar} transitions across ${switchStmt.cases.length} case(s); inline them in execution order.`
          : `Trace switch dispatch (${switchStmt.cases.length} cases) and inline in execution order.`,
      });
    },

    CallExpression(path) {
      const callee = path.node.callee;
      if (!t.isMemberExpression(callee)) return;
      if (!t.isIdentifier(callee.property, { name: "split" })) return;
      const args = path.node.arguments;
      if (args.length !== 1) return;
      const sep = args[0];
      if (!t.isStringLiteral(sep)) return;
      const obj = callee.object;
      if (!t.isStringLiteral(obj)) return;
      const parts = obj.value.split(sep.value);
      if (parts.length < 2) return;
      if (!parts.every((p) => /^-?\d+$/.test(p))) return;
      splitDispatches.push({
        kind: "split-string-dispatch",
        loc: locOf(source, path.node),
        states: parts,
        splitOn: sep.value,
        rewriteHint: `States ${parts.join(", ")} are likely a dispatch order — find the corresponding switch and inline.`,
      });
    },

    IfStatement(path) {
      const test = path.node.test;
      if (t.isBinaryExpression(test)) {
        const result = evalLiteralCompare(test);
        if (result !== null) {
          opaquePredicates.push({
            kind: "opaque-predicate",
            loc: locOf(source, path.node),
            flavor: "literal-vs-literal",
            alwaysTruthy: result,
            rewriteHint: result
              ? "Replace with the then-branch (predicate is constant true)."
              : "Replace with the else-branch (or remove; predicate is constant false).",
          });
          return;
        }
      }
      if (isNotNotArray(test)) {
        opaquePredicates.push({
          kind: "opaque-predicate",
          loc: locOf(source, path.node),
          flavor: "not-not-array",
          alwaysTruthy: true,
          rewriteHint: "`!![]` is always true — replace with the then-branch.",
        });
        return;
      }
      if (isNotNotObject(test)) {
        opaquePredicates.push({
          kind: "opaque-predicate",
          loc: locOf(source, path.node),
          flavor: "not-not-object",
          alwaysTruthy: true,
          rewriteHint: "`!!{}` is always true — replace with the then-branch.",
        });
        return;
      }
      if (isVoidZero(test)) {
        opaquePredicates.push({
          kind: "opaque-predicate",
          loc: locOf(source, path.node),
          flavor: "void-zero",
          alwaysTruthy: false,
          rewriteHint: "`void 0` is always falsy (undefined) — remove or use else-branch.",
        });
      }
    },
  });

  const total =
    flatteners.length + splitDispatches.length + opaquePredicates.length;
  let summary: string;
  if (total === 0) {
    summary = "no control-flow obfuscation patterns detected";
  } else {
    const parts: string[] = [];
    if (flatteners.length > 0) parts.push(`${flatteners.length} flattener(s)`);
    if (splitDispatches.length > 0)
      parts.push(`${splitDispatches.length} split-dispatch(es)`);
    if (opaquePredicates.length > 0)
      parts.push(`${opaquePredicates.length} opaque predicate(s)`);
    summary = `found ${parts.join(", ")} — see rewriteHint per item; this report does not mutate the source`;
  }

  return {
    input: inputPath,
    size: source.length,
    flatteners,
    splitDispatches,
    opaquePredicates,
    summary,
  };
}

const USAGE =
  "Usage: bun scripts/control-flow-report.ts <input.js|-> [--out report.json]";

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

  let report: ControlFlowReport;
  try {
    report = analyzeControlFlow(source, inputPath);
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  const json = JSON.stringify(report, null, 2) + "\n";
  if (values.out) {
    try {
      fs.writeFileSync(values.out, json);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(json);
  }

  console.error(`control-flow-report: ${report.summary}`);
}

if (import.meta.main) {
  await main();
}
