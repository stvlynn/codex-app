import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import type { SymbolEntry } from "./extract.ts";

export type Batch = {
  index: number;
  scopeKey: string;
  scopeKind: string;
  scopeStart: number;
  scopeEnd: number;
  scopeSize: number;
  symbolCount: number;
  symbolIds: string[];
};

export type Plan = {
  input: string;
  totalSymbols: number;
  batchSize: number;
  batches: Batch[];
};

const CRYPTIC_NAME_RE = /^(?:_0x[0-9a-fA-F]+|[a-zA-Z_]\d*|[a-zA-Z]{1,2})$/;

export type PlanOptions = {
  batchSize?: number;
  onlyCryptic?: boolean;
  minRefs?: number;
};

function scopeKeyOf(s: SymbolEntry): string {
  return `${s.scopeKind}@${s.scopeSize}@${s.declStart - (s.declStart % 100000)}`;
}

function groupByScope(
  symbols: SymbolEntry[],
): Map<string, { meta: SymbolEntry; entries: SymbolEntry[] }> {
  const groups = new Map<
    string,
    { meta: SymbolEntry; entries: SymbolEntry[] }
  >();
  for (const s of symbols) {
    const key = `${s.scopeKind}:${s.scopeSize}`;
    let g = groups.get(key);
    if (!g) {
      g = { meta: s, entries: [] };
      groups.set(key, g);
    }
    g.entries.push(s);
  }
  return groups;
}

function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function planBatches(
  symbols: SymbolEntry[],
  inputPath: string,
  opts: PlanOptions = {},
): Plan {
  const batchSize = opts.batchSize ?? 100;
  let filtered = symbols;
  if (opts.onlyCryptic) {
    filtered = filtered.filter((s) => CRYPTIC_NAME_RE.test(s.name));
  }
  if (opts.minRefs !== undefined && opts.minRefs > 0) {
    filtered = filtered.filter((s) => s.referenceCount >= opts.minRefs!);
  }

  const groups = groupByScope(filtered);
  const sortedGroups = [...groups.entries()].sort(
    ([, a], [, b]) => b.meta.scopeSize - a.meta.scopeSize,
  );

  const batches: Batch[] = [];
  let idx = 0;
  for (const [key, group] of sortedGroups) {
    const sortedEntries = [...group.entries].sort(
      (a, b) => b.referenceCount - a.referenceCount,
    );
    for (const part of chunk(sortedEntries, batchSize)) {
      batches.push({
        index: idx++,
        scopeKey: key,
        scopeKind: group.meta.scopeKind,
        scopeStart: 0,
        scopeEnd: 0,
        scopeSize: group.meta.scopeSize,
        symbolCount: part.length,
        symbolIds: part.map((s) => s.id),
      });
    }
  }

  return {
    input: inputPath,
    totalSymbols: filtered.length,
    batchSize,
    batches,
  };
}

export function formatChecklist(plan: Plan, outDir: string): string {
  const lines: string[] = [];
  lines.push(`# Rename Checklist — ${plan.input}`);
  lines.push("");
  lines.push(
    `**Total symbols:** ${plan.totalSymbols} · **Batches:** ${plan.batches.length} · **Batch size:** ${plan.batchSize}`,
  );
  lines.push("");
  lines.push(
    `Per-batch symbol files in \`${outDir}/\`. Work through batches in order — earlier batches cover larger scopes (more impact per rename).`,
  );
  lines.push("");
  lines.push("## Workflow");
  lines.push("");
  lines.push(
    "1. For each unchecked batch below, read `<outDir>/batch-N.json`. Decide names. Write `<outDir>/renames-N.json`.",
  );
  lines.push(
    "2. After all batches: `cat <outDir>/renames-*.json | jq -s 'add' > <outDir>/renames.json` (or merge with the Write tool).",
  );
  lines.push(
    "3. Apply once: `bun scripts/apply.ts <input> <outDir>/renames.json --out <output>`.",
  );
  lines.push(
    "4. Optional: re-extract on `<output>` and re-plan if many symbols remain unnamed.",
  );
  lines.push("");
  lines.push("## Batches");
  lines.push("");
  for (const b of plan.batches) {
    lines.push(
      `- [ ] **Batch ${b.index}** — ${b.scopeKind} scope (size ${b.scopeSize}) · ${b.symbolCount} symbols · \`batch-${b.index}.json\``,
    );
  }
  lines.push("");
  return lines.join("\n");
}

const USAGE =
  "Usage: bun scripts/plan.ts <symbols.json|-> --out-dir <dir> " +
  "[--input <name>] [--batch-size 100] [--only-cryptic] [--min-refs N]";

async function readSymbols(p: string): Promise<SymbolEntry[]> {
  const text = p === "-" ? await Bun.stdin.text() : fs.readFileSync(p, "utf-8");
  return JSON.parse(text) as SymbolEntry[];
}

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        "out-dir": { type: "string" },
        input: { type: "string" },
        "batch-size": { type: "string", default: "100" },
        "only-cryptic": { type: "boolean", default: false },
        "min-refs": { type: "string" },
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
  if (!values["out-dir"]) {
    console.error("--out-dir is required");
    console.error(USAGE);
    process.exit(64);
  }

  const symPath = positionals[0]!;
  const outDir = values["out-dir"]!;
  const inputLabel = values.input ?? symPath;
  const batchSize = parseInt(values["batch-size"] ?? "100", 10);
  if (!Number.isFinite(batchSize) || batchSize <= 0) {
    console.error("--batch-size must be a positive integer");
    process.exit(64);
  }
  const minRefs = values["min-refs"]
    ? parseInt(values["min-refs"], 10)
    : undefined;
  if (minRefs !== undefined && (!Number.isFinite(minRefs) || minRefs < 0)) {
    console.error("--min-refs must be a non-negative integer");
    process.exit(64);
  }

  let symbols: SymbolEntry[];
  try {
    symbols = await readSymbols(symPath);
  } catch (err) {
    console.error(`failed to read symbols: ${(err as Error).message}`);
    process.exit(1);
  }

  const plan = planBatches(symbols, inputLabel, {
    batchSize,
    onlyCryptic: values["only-cryptic"],
    minRefs,
  });

  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch (err) {
    console.error(`failed to create out-dir: ${(err as Error).message}`);
    process.exit(1);
  }

  const symById = new Map(symbols.map((s) => [s.id, s]));
  for (const batch of plan.batches) {
    const entries = batch.symbolIds
      .map((id) => symById.get(id))
      .filter((s): s is SymbolEntry => s !== undefined);
    const fp = path.join(outDir, `batch-${batch.index}.json`);
    fs.writeFileSync(fp, JSON.stringify(entries, null, 2) + "\n");
  }

  const checklistPath = path.join(outDir, "CHECKLIST.md");
  fs.writeFileSync(checklistPath, formatChecklist(plan, outDir));
  const planPath = path.join(outDir, "plan.json");
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2) + "\n");

  console.error(
    `plan: ${plan.batches.length} batches, ${plan.totalSymbols} symbols → ${outDir}/`,
  );
  console.error(`  checklist: ${checklistPath}`);
}

if (import.meta.main) {
  await main();
}
