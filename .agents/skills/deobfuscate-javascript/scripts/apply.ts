import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type Binding, type Scope } from "@babel/traverse";
import babelGenerator from "@babel/generator";
import type * as t from "@babel/types";

const traverse = ((babelTraverse as unknown as { default?: typeof babelTraverse })
  .default ?? babelTraverse) as typeof babelTraverse;
const generate = ((babelGenerator as unknown as { default?: typeof babelGenerator })
  .default ?? babelGenerator) as typeof babelGenerator;

const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue", "debugger", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally",
  "for", "function", "if", "import", "in", "instanceof", "new", "null",
  "return", "super", "switch", "this", "throw", "true", "try", "typeof",
  "var", "void", "while", "with", "yield",
  "let", "static",
  "implements", "interface", "package", "private", "protected", "public",
  "await",
]);

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

function isIdContinue(ch: string): boolean {
  return /^[$_\p{ID_Continue}]$/u.test(ch);
}

export function toIdentifier(raw: string): string {
  if (!raw) return "_";
  let result = "";
  let capitalizeNext = false;
  for (const ch of raw) {
    if (ch === "." || ch === " " || ch === "-") {
      if (result.length > 0) capitalizeNext = true;
    } else if (isIdContinue(ch)) {
      if (capitalizeNext) {
        capitalizeNext = false;
        result += ch.toUpperCase();
      } else {
        result += ch;
      }
    }
  }
  if (!result) return "_";
  if (/^[0-9]/.test(result)) result = "_" + result;
  if (RESERVED.has(result)) result = "_" + result;
  return result;
}

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

type Entry = {
  id: string;
  oldName: string;
  newName: string;
  binding: Binding;
  scope: Scope;
  scopeSize: number;
  declStart: number;
};

export type ApplyStats = {
  renamed: number;
  skipped: number;
  ignored: number;
};

export type ApplyResult = {
  code: string;
  stats: ApplyStats;
};

export function applyRenames(
  source: string,
  renames: Record<string, string>,
): ApplyResult {
  if (!source) {
    return { code: "", stats: { renamed: 0, skipped: 0, ignored: Object.keys(renames).length } };
  }

  const ast = parseSource(source);
  const entries: Entry[] = [];
  const seenScopes = new WeakSet<Scope>();
  const seenIds = new Set<string>();

  traverse(ast, {
    Scopable(path) {
      const scope = path.scope;
      if (seenScopes.has(scope)) return;
      seenScopes.add(scope);
      const block = scope.block as t.Node;
      const scopeStart = block.start ?? 0;
      const scopeEnd = block.end ?? source.length;
      const scopeSize = scopeEnd - scopeStart;

      for (const [name, binding] of Object.entries(scope.bindings)) {
        const idNode = binding.identifier;
        const declStart = idNode.start ?? 0;
        const id = `${name}@${declStart}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);
        if (!Object.prototype.hasOwnProperty.call(renames, id)) continue;
        const newName = renames[id];
        if (typeof newName !== "string" || newName === name) continue;
        entries.push({
          id,
          oldName: name,
          newName,
          binding,
          scope,
          scopeSize,
          declStart,
        });
      }
    },
  });

  entries.sort((a, b) => b.scopeSize - a.scopeSize || a.declStart - b.declStart);

  const matchedIds = new Set(entries.map((e) => e.id));
  const takenByScope = new Map<unknown, Set<string>>();
  let renamed = 0;
  let skipped = 0;

  for (const entry of entries) {
    let safe = toIdentifier(entry.newName);
    let taken = takenByScope.get(entry.scope);
    if (!taken) {
      taken = new Set();
      takenByScope.set(entry.scope, taken);
    }
    while (
      taken.has(safe) ||
      entry.scope.hasBinding(safe) ||
      entry.scope.parentHasBinding(safe)
    ) {
      safe = "_" + safe;
    }
    if (safe === entry.oldName) {
      skipped++;
      continue;
    }
    taken.add(safe);
    entry.scope.rename(entry.oldName, safe);
    renamed++;
  }

  const { code } = generate(ast, {
    retainLines: false,
    compact: false,
    concise: false,
    jsescOption: { minimal: true },
  });

  return {
    code: code.endsWith("\n") ? code : code + "\n",
    stats: {
      renamed,
      skipped,
      ignored: Object.keys(renames).length - matchedIds.size,
    },
  };
}

const USAGE =
  "Usage: bun scripts/apply.ts <input.js|-> <renames.json> [--out output.js]";

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

  if (positionals.length < 2) {
    console.error(USAGE);
    process.exit(64);
  }

  const inputPath = positionals[0]!;
  const renamesPath = positionals[1]!;
  const outPath = values.out;

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  let renames: Record<string, string>;
  try {
    renames = JSON.parse(fs.readFileSync(renamesPath, "utf-8"));
  } catch (err) {
    console.error(`failed to read renames: ${(err as Error).message}`);
    process.exit(1);
  }

  let result: ApplyResult;
  try {
    result = applyRenames(source, renames);
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  if (outPath) {
    try {
      fs.writeFileSync(outPath, result.code);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  } else {
    process.stdout.write(result.code);
  }

  const skippedNote = result.stats.skipped > 0
    ? `, skipped ${result.stats.skipped} (already same name after normalization)`
    : "";
  const ignoredNote = result.stats.ignored > 0
    ? ` (${result.stats.ignored} id(s) in renames.json had no matching binding)`
    : "";
  const dest = outPath ? ` → ${outPath}` : "";
  console.error(
    `renamed ${result.stats.renamed} symbol(s)${skippedNote}${ignoredNote}${dest}`,
  );
}

if (import.meta.main) {
  await main();
}
