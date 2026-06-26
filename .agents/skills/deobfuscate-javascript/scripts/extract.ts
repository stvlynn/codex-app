import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import babelTraverse, { type Scope } from "@babel/traverse";
import type * as t from "@babel/types";

const traverse = ((
  babelTraverse as unknown as { default?: typeof babelTraverse }
).default ?? babelTraverse) as typeof babelTraverse;

export const DEFAULT_CONTEXT_SIZE = 500;

export const PARSER_PLUGINS: parser.ParserPlugin[] = [
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

export type SymbolEntry = {
  id: string;
  name: string;
  kind: string;
  bindingPathType: string;
  scopeKind: string;
  scopeSize: number;
  declStart: number;
  declEnd: number;
  referenceCount: number;
  constant: boolean;
  sameScopeBindings: string[];
  context: string;
};

function computeContext(
  source: string,
  scopeStart: number,
  scopeEnd: number,
  symStart: number,
  symEnd: number,
  contextSize: number,
): string {
  const ctxLen = scopeEnd - scopeStart;
  if (ctxLen <= contextSize) {
    return source.slice(scopeStart, scopeEnd);
  }
  const isProgram = scopeStart === 0 && scopeEnd === source.length;
  if (isProgram) {
    const half = Math.floor(contextSize / 2);
    if (symEnd < half) {
      return source.slice(0, Math.min(contextSize, source.length));
    }
    if (symStart > source.length - half) {
      return source.slice(Math.max(0, source.length - contextSize));
    }
    return source.slice(
      Math.max(0, symStart - half),
      Math.min(source.length, symEnd + half),
    );
  }
  return source.slice(scopeStart, Math.min(scopeEnd, scopeStart + contextSize));
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

export type FilterOptions = {
  minRefs?: number;
  scopeKind?: string;
  kinds?: Set<string>;
  namePattern?: RegExp;
  onlyCryptic?: boolean;
  top?: number;
  noContext?: boolean;
  maxSameScope?: number;
};

const CRYPTIC_NAME_RE = /^(?:[a-zA-Z_]\d*|_0x[0-9a-fA-F]+|[a-zA-Z]{1,2})$/;

export function filterSymbols(
  symbols: SymbolEntry[],
  opts: FilterOptions,
): SymbolEntry[] {
  let out = symbols;
  if (opts.minRefs !== undefined && opts.minRefs > 0) {
    out = out.filter((s) => s.referenceCount >= opts.minRefs!);
  }
  if (opts.scopeKind) {
    out = out.filter((s) => s.scopeKind === opts.scopeKind);
  }
  if (opts.kinds && opts.kinds.size > 0) {
    out = out.filter((s) => opts.kinds!.has(s.kind));
  }
  if (opts.namePattern) {
    out = out.filter((s) => opts.namePattern!.test(s.name));
  }
  if (opts.onlyCryptic) {
    out = out.filter((s) => CRYPTIC_NAME_RE.test(s.name));
  }
  if (opts.top !== undefined && opts.top > 0) {
    out = out.slice(0, opts.top);
  }
  if (opts.noContext || opts.maxSameScope !== undefined) {
    out = out.map((s) => {
      const next = { ...s };
      if (opts.noContext) next.context = "";
      if (opts.maxSameScope !== undefined && opts.maxSameScope >= 0) {
        next.sameScopeBindings = s.sameScopeBindings.slice(
          0,
          opts.maxSameScope,
        );
      }
      return next;
    });
  }
  return out;
}

export function extractSymbols(
  source: string,
  contextSize: number = DEFAULT_CONTEXT_SIZE,
): SymbolEntry[] {
  if (!source) return [];
  const ast = parseSource(source);
  const symbols: SymbolEntry[] = [];
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
      const sameScopeBindings = Object.keys(scope.bindings).sort();

      for (const [name, binding] of Object.entries(scope.bindings)) {
        if (!binding?.identifier || !binding.path) continue;
        const idNode = binding.identifier;
        const declStart = idNode.start ?? 0;
        const declEnd = idNode.end ?? declStart + name.length;
        const id = `${name}@${declStart}`;
        if (seenIds.has(id)) continue;
        seenIds.add(id);

        const context = computeContext(
          source,
          scopeStart,
          scopeEnd,
          declStart,
          declEnd,
          contextSize,
        );

        symbols.push({
          id,
          name,
          kind: binding.kind,
          bindingPathType: binding.path.type,
          scopeKind: block.type,
          scopeSize,
          declStart,
          declEnd,
          referenceCount: binding.referencePaths.length,
          constant: binding.constant,
          sameScopeBindings,
          context,
        });
      }
    },
  });

  symbols.sort(
    (a, b) => b.scopeSize - a.scopeSize || a.declStart - b.declStart,
  );
  return symbols;
}

const USAGE =
  "Usage: bun scripts/extract.ts <input.js|-> [--out symbols.json] [--context-size 500] " +
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
      "⚠️  sourceMappingURL detected in input — run scripts/sourcemap-check.ts first; recovering from the sourcemap is faster and lossless.",
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
