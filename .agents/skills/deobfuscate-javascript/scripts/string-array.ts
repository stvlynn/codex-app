import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type NodePath, type Binding } from "@babel/traverse";
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

const OBFUSCATOR_ID_RE = /^_0x[a-f0-9]+$/i;

type CollectedArray = {
  name: string;
  values: string[];
  declarator: NodePath<t.VariableDeclarator>;
  binding: Binding;
};

export type StringArrayStats = {
  arraysCollected: number;
  rotationsApplied: number;
  rotationsRemoved: number;
  referencesReplaced: number;
  arraysRemoved: number;
  decoderIndirection: boolean;
};

export type StringArrayResult = {
  code: string;
  stats: StringArrayStats;
};

function getStringValues(arr: t.ArrayExpression): string[] | null {
  const values: string[] = [];
  for (const el of arr.elements) {
    if (el && t.isStringLiteral(el)) {
      values.push(el.value);
    } else {
      return null;
    }
  }
  return values;
}

function extractRotateCount(arg: t.Node): number | null {
  if (t.isNumericLiteral(arg)) return arg.value;
  if (
    t.isUpdateExpression(arg) &&
    arg.operator === "++" &&
    t.isIdentifier(arg.argument)
  ) {
    return null;
  }
  return null;
}

function applyRotation(values: string[], rawCount: number): string[] {
  const n = values.length;
  if (n === 0) return values;
  let count = ((rawCount % n) + n) % n;
  const rotated = values.slice();
  while (count-- > 0) {
    const head = rotated.shift();
    if (head !== undefined) rotated.push(head);
  }
  return rotated;
}

type RotationMatch = {
  callExpr: NodePath<t.CallExpression>;
  entry: CollectedArray;
  rotateCount: number | null;
};

function findRotationIIFE(
  programPath: NodePath<t.Program>,
  collected: Map<Binding, CollectedArray>,
): RotationMatch[] {
  const matches: RotationMatch[] = [];
  programPath.traverse({
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        !t.isFunctionExpression(callee) &&
        !t.isArrowFunctionExpression(callee)
      ) {
        return;
      }
      const body = (callee as t.FunctionExpression).body;
      if (!t.isBlockStatement(body)) return;

      let hasWhile = false;
      let hasPushShift = false;
      path.traverse({
        WhileStatement() {
          hasWhile = true;
        },
        CallExpression(inner) {
          const innerCallee = inner.node.callee;
          if (!t.isMemberExpression(innerCallee)) return;
          const prop = innerCallee.property;
          const propName = t.isIdentifier(prop)
            ? prop.name
            : t.isStringLiteral(prop)
            ? prop.value
            : "";
          if (propName === "push" || propName === "shift") {
            hasPushShift = true;
          }
        },
      });

      if (!hasWhile || !hasPushShift) return;

      const args = path.node.arguments;
      if (args.length < 2) return;
      const arrayArg = args[0];
      const rotateArg = args[1];
      if (!t.isIdentifier(arrayArg)) return;
      const argBinding = path.scope.getBinding(arrayArg.name);
      if (!argBinding) return;
      const entry = collected.get(argBinding);
      if (!entry) return;
      const rotateCount = extractRotateCount(rotateArg);
      matches.push({
        callExpr: path,
        entry,
        rotateCount,
      });
    },
  });
  return matches;
}

export function transformStringArrays(source: string): StringArrayResult {
  if (!source) {
    return {
      code: "",
      stats: {
        arraysCollected: 0,
        rotationsApplied: 0,
        rotationsRemoved: 0,
        referencesReplaced: 0,
        arraysRemoved: 0,
        decoderIndirection: false,
      },
    };
  }

  const ast = parseSource(source);
  const collected = new Map<Binding, CollectedArray>();
  const byName = new Map<string, CollectedArray[]>();

  let programPath: NodePath<t.Program> | null = null;

  traverse(ast, {
    Program(path) {
      programPath = path;
    },
    VariableDeclarator(path) {
      const id = path.node.id;
      const init = path.node.init;
      if (!t.isIdentifier(id) || !OBFUSCATOR_ID_RE.test(id.name)) return;
      if (!t.isArrayExpression(init)) return;
      const values = getStringValues(init);
      if (values === null || values.length === 0) return;
      const binding = path.scope.getBinding(id.name);
      if (!binding) return;
      const entry: CollectedArray = {
        name: id.name,
        values,
        declarator: path,
        binding,
      };
      collected.set(binding, entry);
      const list = byName.get(id.name) ?? [];
      list.push(entry);
      byName.set(id.name, list);
    },
  });

  if (collected.size === 0 || !programPath) {
    return {
      code: source,
      stats: {
        arraysCollected: 0,
        rotationsApplied: 0,
        rotationsRemoved: 0,
        referencesReplaced: 0,
        arraysRemoved: 0,
        decoderIndirection: false,
      },
    };
  }

  let rotationsApplied = 0;
  let rotationsRemoved = 0;
  const rotations = findRotationIIFE(programPath, collected);
  for (const rot of rotations) {
    if (rot.rotateCount !== null) {
      rot.entry.values = applyRotation(rot.entry.values, rot.rotateCount);
      rotationsApplied++;
    }
    rot.callExpr.remove();
    rotationsRemoved++;
  }

  let referencesReplaced = 0;

  traverse(ast, {
    MemberExpression(path) {
      const obj = path.node.object;
      if (!t.isIdentifier(obj)) return;
      const binding = path.scope.getBinding(obj.name);
      if (!binding) return;
      const entry = collected.get(binding);
      if (!entry) return;

      const prop = path.node.property;
      let idx: number | null = null;
      if (path.node.computed) {
        if (t.isNumericLiteral(prop)) idx = prop.value;
        else if (
          t.isStringLiteral(prop) &&
          /^-?\d+$/.test(prop.value)
        ) {
          idx = parseInt(prop.value, 10);
        }
      }
      if (idx === null || !Number.isInteger(idx)) return;
      if (idx < 0 || idx >= entry.values.length) return;
      const value = entry.values[idx];
      if (value === undefined) return;
      path.replaceWith(t.stringLiteral(value));
      referencesReplaced++;
    },
  });

  programPath.scope.crawl();

  let arraysRemoved = 0;
  for (const entry of collected.values()) {
    const decl = entry.declarator;
    if (decl.removed) continue;
    const idNode = decl.node.id;
    if (!t.isIdentifier(idNode)) continue;
    const freshBinding = decl.scope.getBinding(idNode.name);
    if (!freshBinding) continue;
    if (freshBinding.references === 0) {
      try {
        const parent = decl.parentPath;
        if (
          parent &&
          parent.isVariableDeclaration() &&
          parent.node.declarations.length === 1
        ) {
          parent.remove();
        } else {
          decl.remove();
        }
        arraysRemoved++;
      } catch {
        // ignore — leave the declaration in place
      }
    }
  }

  const decoderIndirection =
    collected.size > 0 && referencesReplaced === 0;

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    comments: true,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats: {
      arraysCollected: collected.size,
      rotationsApplied,
      rotationsRemoved,
      referencesReplaced,
      arraysRemoved,
      decoderIndirection,
    },
  };
}

const USAGE = "Usage: bun scripts/string-array.ts <input.js|-> [--out output.js]";

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

  let result: StringArrayResult;
  try {
    result = transformStringArrays(source);
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
  if (stats.arraysCollected === 0) {
    console.error("string-array: no _0x... string array declarations found");
  } else {
    const parts = [
      `${stats.arraysCollected} array(s)`,
      `${stats.referencesReplaced} ref(s) replaced`,
      `${stats.arraysRemoved} array(s) removed`,
    ];
    if (stats.rotationsApplied > 0) {
      parts.push(`${stats.rotationsApplied} rotation(s) applied`);
    }
    if (stats.rotationsRemoved > stats.rotationsApplied) {
      parts.push(
        `${stats.rotationsRemoved - stats.rotationsApplied} rotation IIFE(s) removed without count`,
      );
    }
    console.error(`string-array: ${parts.join(", ")}`);
    if (stats.decoderIndirection) {
      console.error(
        "string-array: WARNING — collected arrays but replaced 0 references. Likely a decoder function indirection (e.g., `_0xabc('0x1')`); run scripts/simplify.ts first or rewrite the decoder manually.",
      );
    }
  }
}

if (import.meta.main) {
  await main();
}
