import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import { extractSymbols, type SymbolEntry } from "./extract.ts";
import {
  writeJsonAtomic,
  type ImportEdge,
  type ImportSpec,
  type Manifest,
  type ManifestFile,
} from "./build-import-graph.ts";
import { Progress } from "./progress.ts";

export type SymbolStatus = "pending" | "claimed" | "done";

export type LedgerSymbol = {
  id: string;
  originalName: string;
  restoredName: string | null;
  kind: string;
  isExport: boolean;
  /** When `isExport` is true, the alias the file exports this binding under. */
  exportedAs?: string;
  /** When this binding is an `import { imported as local }`, where it came from. */
  importedFrom?: { target: string; imported: string; importKind: ImportSpec["kind"] };
  referenceCount: number;
  declStart: number;
  declEnd: number;
  status: SymbolStatus;
  owner: string | null;
  claimedAt?: string | null;
  completedAt?: string | null;
};

export type LedgerFileTotals = {
  pending: number;
  claimed: number;
  done: number;
};

export type LedgerFile = {
  totals: LedgerFileTotals;
  symbols: LedgerSymbol[];
};

export type CrossFileBinding = {
  consumer: string;
  consumerLocal: string;
  consumerSymbolId: string | null;
  producer: string;
  producerExportedAs: string;
  producerSymbolId: string | null;
  producerRestoredName: string | null;
};

export type Ledger = {
  version: 1;
  manifest: string;
  createdAt: string;
  updatedAt: string;
  files: Record<string, LedgerFile>;
  crossFileBindings: CrossFileBinding[];
};

const NOW = (): string => new Date().toISOString();

function totalsOf(symbols: LedgerSymbol[]): LedgerFileTotals {
  const totals: LedgerFileTotals = { pending: 0, claimed: 0, done: 0 };
  for (const s of symbols) totals[s.status]++;
  return totals;
}

/**
 * Build (or refresh) per-file `LedgerSymbol[]` from the file's source code
 * and the file's `manifest` entry. Pure: no I/O.
 */
export function buildLedgerFile(
  source: string,
  manifestFile: ManifestFile,
  prior?: LedgerFile,
): LedgerFile {
  const exportLocalToAlias = new Map<string, string>();
  const importLocalToOrigin = new Map<
    string,
    { target: string; imported: string; importKind: ImportSpec["kind"] }
  >();
  for (const exp of manifestFile.exports ?? []) {
    if (exp.local && exp.local !== "*" && exp.exported && !exp.reExportFrom) {
      exportLocalToAlias.set(exp.local, exp.exported);
    }
  }
  for (const imp of manifestFile.imports ?? []) {
    for (const spec of imp.specifiers) {
      importLocalToOrigin.set(spec.local, {
        target: imp.target,
        imported: spec.imported,
        importKind: spec.kind,
      });
    }
  }

  const priorById = new Map<string, LedgerSymbol>();
  for (const s of prior?.symbols ?? []) priorById.set(s.id, s);

  const raw: SymbolEntry[] = extractSymbols(source);
  const symbols: LedgerSymbol[] = [];
  for (const s of raw) {
    // Only Program-scope bindings can be exported — inner scope params/vars
    // that happen to share a name with an export alias must NOT be flagged
    // as `isExport`, otherwise they pollute the producer-export propagation
    // map (`d` exported as `s` would compete with a fn-param `d`).
    const isProgramScope = s.scopeKind === "Program";
    const exportedAs = isProgramScope
      ? exportLocalToAlias.get(s.name)
      : undefined;
    const importedFrom = isProgramScope
      ? importLocalToOrigin.get(s.name)
      : undefined;
    const previous = priorById.get(s.id);
    const symbol: LedgerSymbol = previous
      ? {
          ...previous,
          kind: s.kind,
          referenceCount: s.referenceCount,
          declStart: s.declStart,
          declEnd: s.declEnd,
          isExport: exportedAs !== undefined,
          exportedAs,
          importedFrom,
        }
      : {
          id: s.id,
          originalName: s.name,
          restoredName: null,
          kind: s.kind,
          isExport: exportedAs !== undefined,
          exportedAs,
          importedFrom,
          referenceCount: s.referenceCount,
          declStart: s.declStart,
          declEnd: s.declEnd,
          status: "pending",
          owner: null,
        };
    symbols.push(symbol);
  }

  return { totals: totalsOf(symbols), symbols };
}

export type CrossFileBuildContext = {
  manifest: Manifest;
  /** Per-file ledger map (already populated). */
  ledgerFiles: Record<string, LedgerFile>;
};

export function buildCrossFileBindings(
  ctx: CrossFileBuildContext,
): CrossFileBinding[] {
  const bindings: CrossFileBinding[] = [];
  const { manifest, ledgerFiles } = ctx;

  // Build a producer-side index: producer-basename → exportedAs → restored name
  const producerExportIndex = new Map<
    string,
    Map<string, { restoredName: string | null; symbolId: string | null }>
  >();

  for (const [basename, file] of Object.entries(manifest.files)) {
    if (file.kind !== "local") continue;
    const ledgerFile = ledgerFiles[basename];
    if (!ledgerFile) continue;
    const exportMap = new Map<
      string,
      { restoredName: string | null; symbolId: string | null }
    >();
    for (const sym of ledgerFile.symbols) {
      if (sym.isExport && sym.exportedAs) {
        exportMap.set(sym.exportedAs, {
          restoredName: sym.restoredName,
          symbolId: sym.id,
        });
      }
    }
    producerExportIndex.set(basename, exportMap);
  }

  for (const [consumer, file] of Object.entries(manifest.files)) {
    if (file.kind !== "local") continue;
    const consumerLedger = ledgerFiles[consumer];
    const consumerSymById = new Map<string, string>(); // localName → symbolId
    for (const s of consumerLedger?.symbols ?? []) {
      // Prefer the program-scope binding (lowest declStart).
      if (!consumerSymById.has(s.originalName)) {
        consumerSymById.set(s.originalName, s.id);
      }
    }

    for (const imp of file.imports ?? []) {
      if (imp.kind === "external") continue;
      for (const spec of imp.specifiers) {
        const consumerLocal = spec.local;
        const consumerSymbolId = consumerSymById.get(consumerLocal) ?? null;

        if (imp.kind === "npm-leaf") {
          // Producer is an npm package; we still record the binding so the
          // consumer's local alias gets the canonical package export name.
          bindings.push({
            consumer,
            consumerLocal,
            consumerSymbolId,
            producer: imp.target,
            producerExportedAs: spec.imported,
            producerSymbolId: null,
            producerRestoredName: null,
          });
          continue;
        }

        const producerExports = producerExportIndex.get(imp.target);
        const producerInfo = producerExports?.get(spec.imported);
        bindings.push({
          consumer,
          consumerLocal,
          consumerSymbolId,
          producer: imp.target,
          producerExportedAs: spec.imported,
          producerSymbolId: producerInfo?.symbolId ?? null,
          producerRestoredName: producerInfo?.restoredName ?? null,
        });
      }
    }
  }

  return bindings;
}

export type BuildLedgerOptions = {
  fullDir: string;
  manifest: Manifest;
  prior?: Ledger;
  rebuild?: boolean;
  onlyBasenames?: Set<string>;
  /** Optional progress reporter; the CLI passes one, tests omit it. */
  progress?: Progress | null;
};

export function buildLedger(opts: BuildLedgerOptions): Ledger {
  const { fullDir, manifest, prior, rebuild, onlyBasenames } = opts;
  const filesDir = path.join(fullDir, "files");

  const ledgerFiles: Record<string, LedgerFile> = {};
  for (const [basename, file] of Object.entries(manifest.files)) {
    // Only `local` files are restored. `oversized-local`, `npm-leaf`, and
    // `external` are recorded in the manifest (and consumed via
    // crossFileBindings for context) but get no ledger entry / symbols.json /
    // workspace dir.
    if (file.kind !== "local") continue;
    if (onlyBasenames && !onlyBasenames.has(basename)) {
      const previous = prior?.files?.[basename];
      if (previous) ledgerFiles[basename] = previous;
      continue;
    }

    const ws = path.join(filesDir, basename);
    fs.mkdirSync(ws, { recursive: true });
    const archive = path.join(ws, "original.js");
    let source: string | undefined;
    if (fs.existsSync(archive)) {
      source = fs.readFileSync(archive, "utf-8");
    } else if (file.path && fs.existsSync(file.path)) {
      source = fs.readFileSync(file.path, "utf-8");
      fs.writeFileSync(archive, source);
    }
    if (source === undefined) {
      const previous = prior?.files?.[basename];
      if (previous) ledgerFiles[basename] = previous;
      continue;
    }

    const previous = rebuild ? undefined : prior?.files?.[basename];
    const ledgerFile = buildLedgerFile(source, file, previous);
    ledgerFiles[basename] = ledgerFile;

    // Persist per-file symbols.json (the same shape extract.ts emits).
    const rawSymbols = extractSymbols(source);
    writeJsonAtomic(path.join(ws, "symbols.json"), rawSymbols);

    // Mark the file as extracted on the manifest entry — having a ledger
    // implies we've parsed and indexed the source.
    file.stages.extracted = true;
    file.lastUpdated = NOW();
    opts.progress?.tick(1, basename);
  }

  const crossFileBindings = buildCrossFileBindings({
    manifest,
    ledgerFiles,
  });

  const createdAt = prior?.createdAt ?? NOW();
  return {
    version: 1,
    manifest: "manifest.json",
    createdAt,
    updatedAt: NOW(),
    files: ledgerFiles,
    crossFileBindings,
  };
}

const USAGE =
  "Usage: bun scripts/build-symbol-ledger.ts --target <dir> [--manifest <path>] " +
  "[--out <ledger.json>] [--rebuild] [--only basename1,basename2,...]";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        target: { type: "string" },
        manifest: { type: "string" },
        out: { type: "string" },
        rebuild: { type: "boolean", default: false },
        only: { type: "string" },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { values } = parsed;
  if (!values.target) {
    console.error(USAGE);
    process.exit(64);
  }
  const targetDir = values.target!;
  const fullDir = path.join(targetDir, ".deobfuscate-javascript", "_full");
  const manifestPath = values.manifest ?? path.join(fullDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`manifest not found: ${manifestPath}`);
    console.error("run scripts/build-import-graph.ts first");
    process.exit(1);
  }
  const out = values.out ?? path.join(fullDir, "ledger.json");

  let manifest: Manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
  } catch (err) {
    console.error(`failed to parse manifest: ${(err as Error).message}`);
    process.exit(1);
  }

  let prior: Ledger | undefined;
  if (!values.rebuild && fs.existsSync(out)) {
    try {
      prior = JSON.parse(fs.readFileSync(out, "utf-8")) as Ledger;
    } catch {
      prior = undefined;
    }
  }

  const onlyBasenames = values.only
    ? new Set(values.only.split(",").map((s) => s.trim()).filter(Boolean))
    : undefined;

  const localTotal = Object.values(manifest.files).filter(
    (f) => f.kind === "local",
  ).length;
  const progress = new Progress({ label: "ledger", total: localTotal });
  let ledger: Ledger;
  try {
    ledger = buildLedger({
      fullDir,
      manifest,
      prior,
      rebuild: values.rebuild,
      onlyBasenames,
      progress,
    });
  } catch (err) {
    console.error(`failed to build ledger: ${(err as Error).message}`);
    process.exit(2);
  }
  progress.done("ledger built");

  // buildLedger() already flipped file.stages.extracted; persist the manifest.
  manifest.updatedAt = NOW();
  writeJsonAtomic(manifestPath, manifest);

  writeJsonAtomic(out, ledger);

  let totalSymbols = 0;
  let totalPending = 0;
  let totalDone = 0;
  for (const f of Object.values(ledger.files)) {
    totalSymbols += f.symbols.length;
    totalPending += f.totals.pending;
    totalDone += f.totals.done;
  }
  console.error(
    `ledger: ${Object.keys(ledger.files).length} file(s) · ${totalSymbols} symbol(s) (${totalPending} pending, ${totalDone} done) · ${ledger.crossFileBindings.length} cross-file binding(s) → ${out}`,
  );
}

if (import.meta.main) {
  await main();
}
