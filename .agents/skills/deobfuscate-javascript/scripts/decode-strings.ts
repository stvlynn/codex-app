import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse from "@babel/traverse";
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

export type DecodeStats = {
  fromCharCode: number;
  atob: number;
  escapesNormalized: boolean;
};

export type DecodeResult = {
  code: string;
  stats: DecodeStats;
};

function decodeBase64(input: string): string | null {
  try {
    return atob(input);
  } catch {
    return null;
  }
}

function clearRawExtras(node: t.StringLiteral): void {
  if (node.extra) {
    delete (node.extra as Record<string, unknown>).raw;
    delete (node.extra as Record<string, unknown>).rawValue;
  }
}

export function decodeStrings(source: string): DecodeResult {
  if (!source) {
    return {
      code: "",
      stats: { fromCharCode: 0, atob: 0, escapesNormalized: false },
    };
  }

  const ast = parseSource(source);
  let fromCharCodeCount = 0;
  let atobCount = 0;
  let escapesNormalized = false;

  traverse(ast, {
    StringLiteral(path) {
      if (path.node.extra && (path.node.extra as Record<string, unknown>).raw) {
        clearRawExtras(path.node);
        escapesNormalized = true;
      }
    },
    CallExpression(path) {
      const callee = path.node.callee;

      if (
        t.isMemberExpression(callee) &&
        !callee.computed &&
        t.isIdentifier(callee.object, { name: "String" }) &&
        t.isIdentifier(callee.property, { name: "fromCharCode" })
      ) {
        const args = path.node.arguments;
        if (args.length === 0) return;
        const codes: number[] = [];
        for (const arg of args) {
          if (
            t.isNumericLiteral(arg) &&
            Number.isInteger(arg.value) &&
            arg.value >= 0 &&
            arg.value <= 0xffff
          ) {
            codes.push(arg.value);
          } else {
            return;
          }
        }
        let decoded: string;
        try {
          decoded = String.fromCharCode(...codes);
        } catch {
          return;
        }
        path.replaceWith(t.stringLiteral(decoded));
        fromCharCodeCount++;
        return;
      }

      if (t.isIdentifier(callee, { name: "atob" })) {
        const args = path.node.arguments;
        if (args.length !== 1) return;
        const arg = args[0];
        if (!t.isStringLiteral(arg)) return;
        const decoded = decodeBase64(arg.value);
        if (decoded === null) return;
        path.replaceWith(t.stringLiteral(decoded));
        atobCount++;
      }
    },
  });

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    comments: true,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats: { fromCharCode: fromCharCodeCount, atob: atobCount, escapesNormalized },
  };
}

const USAGE = "Usage: bun scripts/decode-strings.ts <input.js|-> [--out output.js]";

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

  let result: DecodeResult;
  try {
    result = decodeStrings(source);
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
  const parts: string[] = [];
  if (stats.fromCharCode > 0) parts.push(`${stats.fromCharCode} fromCharCode`);
  if (stats.atob > 0) parts.push(`${stats.atob} atob`);
  if (stats.escapesNormalized) parts.push("escapes normalized");
  if (parts.length === 0) {
    console.error("decode-strings: nothing to decode");
  } else {
    console.error(`decode-strings: ${parts.join(", ")}`);
  }
}

if (import.meta.main) {
  await main();
}
