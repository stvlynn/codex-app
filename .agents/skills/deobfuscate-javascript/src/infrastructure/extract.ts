import * as fs from "node:fs";
import { parseArgs } from "node:util";

import {
  DEFAULT_CONTEXT_SIZE,
  PARSER_PLUGINS,
  type FilterOptions,
  type SymbolEntry,
  extractSymbols,
  filterSymbols,
  parseSource,
} from "../domain/parsing.ts";

export {
  DEFAULT_CONTEXT_SIZE,
  PARSER_PLUGINS,
  type FilterOptions,
  type SymbolEntry,
  extractSymbols,
  filterSymbols,
  parseSource,
};

const USAGE =
  "Usage: bun src/infrastructure/extract.ts <input.js|-> [--out symbols.json] [--context-size 500] " +
  "[--top N] [--min-refs N] [--scope-kind Program|FunctionDeclaration|...] " +
  "[--kind param,let,const,var,hoisted,...] " +
  "[--name <regex>] [--only-cryptic] [--no-context] [--max-same-scope N] [--compact]";

const VALID_BINDING_KINDS = new Set([
  "var",
  "let",
  "const",
  "param",
  "hoisted",
  "local",
  "module",
  "unknown",
]);

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
        "context-size": {
          type: "string",
          default: String(DEFAULT_CONTEXT_SIZE),
        },
        top: { type: "string" },
        "min-refs": { type: "string" },
        "scope-kind": { type: "string" },
        kind: { type: "string" },
        name: { type: "string" },
        "only-cryptic": { type: "boolean", default: false },
        "no-context": { type: "boolean", default: false },
        "max-same-scope": { type: "string" },
        compact: { type: "boolean", default: false },
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
  const outPath = values.out;
  const contextSize = parseInt(
    values["context-size"] ?? String(DEFAULT_CONTEXT_SIZE),
    10,
  );

  let namePattern: RegExp | undefined;
  if (values.name) {
    try {
      namePattern = new RegExp(values.name);
    } catch (err) {
      console.error(`invalid --name regex: ${(err as Error).message}`);
      process.exit(64);
    }
  }
  const minRefs = values["min-refs"]
    ? parseInt(values["min-refs"], 10)
    : undefined;
  const top = values.top ? parseInt(values.top, 10) : undefined;

  let kinds: Set<string> | undefined;
  if (values.kind) {
    kinds = new Set(
      values.kind
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    );
    for (const k of kinds) {
      if (!VALID_BINDING_KINDS.has(k)) {
        console.error(
          `invalid --kind value '${k}'. Expected one of: ${[...VALID_BINDING_KINDS].join(", ")}`,
        );
        process.exit(64);
      }
    }
  }

  if (top !== undefined && (!Number.isFinite(top) || top <= 0)) {
    console.error("--top must be a positive integer");
    process.exit(64);
  }
  if (minRefs !== undefined && (!Number.isFinite(minRefs) || minRefs < 0)) {
    console.error("--min-refs must be a non-negative integer");
    process.exit(64);
  }

  let source: string;
  try {
    source = await readInput(inputPath);
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }

  if (
    source &&
    /[#@]\s*sourceMappingURL=/.test(
      source.slice(Math.max(0, source.length - 8192)),
    )
  ) {
    console.error(
      "⚠️  sourceMappingURL detected in input — run src/infrastructure/sourcemap-check.ts first; recovering from the sourcemap is faster and lossless.",
    );
  }

  let symbols: SymbolEntry[];
  try {
    symbols = extractSymbols(source, contextSize);
  } catch (err) {
    console.error(`parse error: ${(err as Error).message}`);
    process.exit(2);
  }

  const compact = values.compact === true;
  let maxSameScope: number | undefined;
  if (values["max-same-scope"] !== undefined) {
    maxSameScope = parseInt(values["max-same-scope"], 10);
    if (!Number.isFinite(maxSameScope) || maxSameScope < 0) {
      console.error("--max-same-scope must be a non-negative integer");
      process.exit(64);
    }
  } else if (compact) {
    maxSameScope = 10;
  }

  const totalBeforeFilter = symbols.length;
  symbols = filterSymbols(symbols, {
    minRefs,
    scopeKind: values["scope-kind"],
    kinds,
    namePattern,
    onlyCryptic: values["only-cryptic"],
    top,
    noContext: values["no-context"] || compact,
    maxSameScope,
  });

  const json = JSON.stringify(symbols, null, 2) + "\n";
  if (outPath) {
    try {
      fs.writeFileSync(outPath, json);
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
    const filtered = totalBeforeFilter - symbols.length;
    const suffix =
      filtered > 0 ? ` (${filtered} filtered out of ${totalBeforeFilter})` : "";
    console.error(
      `extracted ${symbols.length} symbol(s)${suffix} → ${outPath}`,
    );
  } else {
    process.stdout.write(json);
  }
}

if (import.meta.main) {
  await main();
}
