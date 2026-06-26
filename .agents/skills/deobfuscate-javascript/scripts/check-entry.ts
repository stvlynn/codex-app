import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as parser from "@babel/parser";
import * as t from "@babel/types";
import {
  CHUNK_NAME_REGISTRY,
  extractChunkBasename,
} from "./resolve-npm-imports.ts";
import { PARSER_PLUGINS } from "./extract.ts";

/**
 * check-entry.ts — sanity-check a restoration entry BEFORE building the graph.
 *
 * The failure mode this prevents: pointing `build-import-graph.ts` at a
 * transitive vendor-leaf chunk (e.g. `main-BDm-p1LA.js`, which is really
 * vscode-languageserver-types imported by 39 other chunks), getting a tiny
 * dependency closure, and declaring the app "restored". A real app entry has a
 * large local fan-out and is imported by ~nobody; a vendor leaf is the inverse.
 *
 * Signals (all cheap — parse only the candidate, substring-scan the siblings):
 *   - isRoot:         the entry is referenced by index.html (<script>/preload).
 *   - localOutDegree: how many local sibling chunks the entry imports.
 *   - inDegree:       how many sibling chunks import the entry.
 *   - looksVendored:  content/basename matches a known vendored package.
 *
 * A chunk is flagged `suspicious` when it is NOT an index.html root AND is
 * imported by many siblings AND imports few locals — i.e. it is a dependency,
 * not an application entry. The out-degree guard is what keeps a real subtree
 * entry like `app-main-*` (not in index.html, but fan-out 305) from flagging.
 */

const IN_DEGREE_MIN = 5;
const OUT_DEGREE_MAX = 8;
const VENDOR_HEAD_BYTES = 4096;

const VENDOR_CONTENT_RE =
  /\b(?:vscode-languageserver|_zod\b|z\.object\(|react-dom|@tanstack|Statsig|katex|mermaid\b|dagre\b|highlight\.js|hljs|protobufjs|lodash)\b/;
const VENDOR_BASENAME_RE =
  /^(?:reduce|flatten|isEqual|isEmpty|merge|clone|invert|debounce|throttle|chunk-|vendor-|polyfill|tslib)/i;

export type EntryReport = {
  entry: string;
  entryFile: string;
  rootDir: string;
  indexHtml: string | null;
  scriptRoots: string[];
  preloadRoots: string[];
  isRoot: boolean;
  localOutDegree: number;
  inDegree: number;
  looksVendored: boolean;
  suspicious: boolean;
  recommendation: string;
  parseError?: string;
};

function basenameOf(filePath: string): string {
  return path.basename(filePath).replace(/\.[mc]?[jt]sx?$/i, "");
}

function isRelative(source: string): boolean {
  return (
    source.startsWith("./") ||
    source.startsWith("../") ||
    source.startsWith("/")
  );
}

const ASSET_EXT = new Set([
  ".css",
  ".scss",
  ".less",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".wasm",
  ".json",
  ".txt",
  ".md",
]);

function isAsset(source: string): boolean {
  return ASSET_EXT.has(path.extname(source).toLowerCase());
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Count local-sibling imports of `source` (its restoration out-degree). An
 * import counts as local when it is a relative non-asset specifier that is not
 * a known npm-leaf chunk. Top-level only — ES import/export live in the body.
 */
export function countLocalOutDegree(source: string): {
  count: number;
  parseError?: string;
} {
  let ast: t.File;
  try {
    ast = parser.parse(source, {
      sourceType: "unambiguous",
      errorRecovery: true,
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowUndeclaredExports: true,
      plugins: PARSER_PLUGINS,
    });
  } catch (err) {
    return { count: 0, parseError: (err as Error).message };
  }
  const sources = new Set<string>();
  const consider = (raw: string | null | undefined): void => {
    if (!raw || !isRelative(raw) || isAsset(raw)) return;
    const chunk = extractChunkBasename(raw);
    if (chunk && CHUNK_NAME_REGISTRY[chunk]) return; // known npm-leaf, not local
    sources.add(raw);
  };
  for (const node of ast.program.body) {
    if (t.isImportDeclaration(node)) consider(node.source.value);
    else if (t.isExportNamedDeclaration(node) && node.source)
      consider(node.source.value);
    else if (t.isExportAllDeclaration(node)) consider(node.source.value);
  }
  return { count: sources.size };
}

/** Extract `<script src>` and `<link rel=modulepreload href>` basenames. */
export function readIndexRoots(htmlPath: string): {
  scriptRoots: string[];
  preloadRoots: string[];
} {
  let html: string;
  try {
    html = fs.readFileSync(htmlPath, "utf-8");
  } catch {
    return { scriptRoots: [], preloadRoots: [] };
  }
  const scriptRoots: string[] = [];
  const preloadRoots: string[] = [];
  for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*"([^"]+\.js)"/gi)) {
    scriptRoots.push(basenameOf(m[1]!));
  }
  for (const m of html.matchAll(
    /<link\b[^>]*\brel\s*=\s*"modulepreload"[^>]*\bhref\s*=\s*"([^"]+\.js)"/gi,
  )) {
    preloadRoots.push(basenameOf(m[1]!));
  }
  // Also handle href-before-rel attribute order.
  for (const m of html.matchAll(
    /<link\b[^>]*\bhref\s*=\s*"([^"]+\.js)"[^>]*\brel\s*=\s*"modulepreload"/gi,
  )) {
    preloadRoots.push(basenameOf(m[1]!));
  }
  return {
    scriptRoots: [...new Set(scriptRoots)],
    preloadRoots: [...new Set(preloadRoots)],
  };
}

export function findIndexHtml(
  rootDir: string,
  override?: string,
): string | null {
  const candidates = override
    ? [override]
    : [
        path.join(rootDir, "..", "index.html"),
        path.join(rootDir, "index.html"),
        path.join(path.dirname(rootDir), "index.html"),
      ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return path.normalize(c);
  }
  return null;
}

function countInDegree(entryFile: string, rootDir: string): number {
  const fileName = path.basename(entryFile);
  const specRe = new RegExp(`["'\`]\\.{1,2}/${escapeRegExp(fileName)}["'\`]`);
  let inDegree = 0;
  let siblings: string[];
  try {
    siblings = fs.readdirSync(rootDir);
  } catch {
    return 0;
  }
  for (const name of siblings) {
    if (!name.endsWith(".js") || name === fileName) continue;
    let text: string;
    try {
      text = fs.readFileSync(path.join(rootDir, name), "utf-8");
    } catch {
      continue;
    }
    if (text.includes(fileName) && specRe.test(text)) inDegree++;
  }
  return inDegree;
}

export type CheckEntryOptions = {
  rootDir?: string;
  indexHtml?: string;
  inDegreeMin?: number;
  outDegreeMax?: number;
};

export function checkEntry(
  entryPath: string,
  opts: CheckEntryOptions = {},
): EntryReport {
  const rootDir = opts.rootDir ?? path.dirname(entryPath);
  const inDegreeMin = opts.inDegreeMin ?? IN_DEGREE_MIN;
  const outDegreeMax = opts.outDegreeMax ?? OUT_DEGREE_MAX;
  const entry = basenameOf(entryPath);
  const source = fs.readFileSync(entryPath, "utf-8");

  const indexHtml = findIndexHtml(rootDir, opts.indexHtml);
  const { scriptRoots, preloadRoots } = indexHtml
    ? readIndexRoots(indexHtml)
    : { scriptRoots: [], preloadRoots: [] };
  const isRoot = scriptRoots.includes(entry) || preloadRoots.includes(entry);

  const { count: localOutDegree, parseError } = countLocalOutDegree(source);
  const inDegree = countInDegree(entryPath, rootDir);

  const head = source.slice(0, VENDOR_HEAD_BYTES);
  const looksVendored =
    !!CHUNK_NAME_REGISTRY[entry] ||
    VENDOR_BASENAME_RE.test(entry) ||
    VENDOR_CONTENT_RE.test(head);

  const suspicious =
    !isRoot && inDegree >= inDegreeMin && localOutDegree <= outDegreeMax;

  let recommendation: string;
  if (isRoot) {
    recommendation = `'${entry}' is referenced by ${path.basename(
      indexHtml ?? "index.html",
    )} — a real app entry. Proceed.`;
  } else if (suspicious) {
    const hint =
      scriptRoots.length > 0
        ? `The real app entry is the index.html <script> root: ${scriptRoots.join(
            ", ",
          )} (or a high-fan-out chunk such as app-main-*).`
        : `Pick the index.html <script> root, or a high-fan-out chunk such as app-main-*.`;
    recommendation =
      `'${entry}' looks like a TRANSITIVE DEPENDENCY, not an app entry ` +
      `(imported by ${inDegree} sibling chunk(s), imports only ${localOutDegree} local chunk(s)` +
      `${looksVendored ? ", vendored content" : ""}). ` +
      `Restoring from it only covers its small dependency closure. ${hint}`;
  } else {
    recommendation = `'${entry}' looks reasonable to restore from (in-degree ${inDegree}, local out-degree ${localOutDegree}).`;
  }

  return {
    entry,
    entryFile: entryPath,
    rootDir,
    indexHtml,
    scriptRoots,
    preloadRoots,
    isRoot,
    localOutDegree,
    inDegree,
    looksVendored,
    suspicious,
    recommendation,
    parseError,
  };
}

export type EntryCandidate = {
  basename: string;
  resolvedFile: string | null;
  source: "script" | "preload";
  report: EntryReport | null;
};

export type DiscoverEntryResult = {
  indexHtml: string | null;
  chosen: EntryCandidate | null;
  candidates: EntryCandidate[];
  reason: string;
};

/**
 * Auto-discover the application entry from index.html and pick the best app
 * entry among its `<script>`/`modulepreload` roots. This is what makes the
 * whole-tree restore the default: the caller no longer hand-globs `app-main-*`.
 *
 * Selection: resolve every index root to a real file under `rootDir`, run
 * `checkEntry` on each, then prefer a non-suspicious `<script>` root. Module
 * preload roots are dependencies of that entry and must not beat the script
 * root just because the script contains vendored/runtime fingerprints. If no
 * script root is usable, prefer the non-suspicious, non-vendored candidate with
 * the highest local out-degree. If nothing looks clean, fall back to the highest
 * fan-out candidate and flag the risk in `reason`.
 */
export function discoverEntry(
  rootDir: string,
  opts: { indexHtml?: string } = {},
): DiscoverEntryResult {
  const indexHtml = findIndexHtml(rootDir, opts.indexHtml);
  if (!indexHtml) {
    return {
      indexHtml: null,
      chosen: null,
      candidates: [],
      reason: `no index.html found near ${rootDir}`,
    };
  }

  const { scriptRoots, preloadRoots } = readIndexRoots(indexHtml);
  const ordered: Array<{ basename: string; source: "script" | "preload" }> = [];
  const seen = new Set<string>();
  for (const basename of scriptRoots) {
    if (seen.has(basename)) continue;
    seen.add(basename);
    ordered.push({ basename, source: "script" });
  }
  for (const basename of preloadRoots) {
    if (seen.has(basename)) continue;
    seen.add(basename);
    ordered.push({ basename, source: "preload" });
  }
  if (ordered.length === 0) {
    return {
      indexHtml,
      chosen: null,
      candidates: [],
      reason: `${path.basename(indexHtml)} referenced no .js script/preload roots`,
    };
  }

  let dirEntries: string[];
  try {
    dirEntries = fs.readdirSync(rootDir);
  } catch {
    dirEntries = [];
  }
  const fileByBasename = new Map<string, string>();
  for (const name of dirEntries) {
    if (!/\.[mc]?js$/i.test(name)) continue;
    const base = basenameOf(name);
    if (!fileByBasename.has(base))
      fileByBasename.set(base, path.join(rootDir, name));
  }

  const candidates: EntryCandidate[] = ordered.map(({ basename, source }) => {
    const resolvedFile = fileByBasename.get(basename) ?? null;
    let report: EntryReport | null = null;
    if (resolvedFile) {
      try {
        report = checkEntry(resolvedFile, { rootDir, indexHtml });
      } catch {
        report = null;
      }
    }
    return { basename, resolvedFile, source, report };
  });

  type Resolved = EntryCandidate & { report: EntryReport };
  const resolved = candidates.filter((c): c is Resolved => c.report !== null);

  const byBestEntry = (a: Resolved, b: Resolved): number => {
    if (b.report.localOutDegree !== a.report.localOutDegree)
      return b.report.localOutDegree - a.report.localOutDegree;
    if (a.source !== b.source) return a.source === "script" ? -1 : 1;
    return a.basename.localeCompare(b.basename);
  };

  const scriptLike = resolved
    .filter((c) => c.source === "script" && !c.report.suspicious)
    .sort(byBestEntry);

  if (scriptLike.length > 0) {
    const chosen = scriptLike[0]!;
    const skipped = resolved
      .filter((c) => c.basename !== chosen.basename)
      .filter((c) => c.report.looksVendored || c.report.suspicious)
      .map((c) => c.basename);
    const reason =
      `${ordered.length} index root(s); chose script root '${chosen.basename}' ` +
      `(local out-degree ${chosen.report.localOutDegree}, looks vendored=${chosen.report.looksVendored})` +
      (chosen.report.looksVendored
        ? " — verify it is the app entry."
        : "") +
      (skipped.length
        ? `; skipped vendored/suspicious: ${skipped.join(", ")}`
        : "");
    return { indexHtml, chosen, candidates, reason };
  }

  const appLike = resolved
    .filter((c) => !c.report.suspicious && !c.report.looksVendored)
    .sort(byBestEntry);

  if (appLike.length > 0) {
    const chosen = appLike[0]!;
    const skipped = resolved
      .filter((c) => c.report.looksVendored || c.report.suspicious)
      .map((c) => c.basename);
    const reason =
      `${ordered.length} index root(s); chose '${chosen.basename}' ` +
      `(local out-degree ${chosen.report.localOutDegree}, in index.html=${chosen.report.isRoot})` +
      (skipped.length
        ? `; skipped vendored/suspicious: ${skipped.join(", ")}`
        : "");
    return { indexHtml, chosen, candidates, reason };
  }

  const fallback = [...resolved].sort(byBestEntry);
  if (fallback.length > 0) {
    const chosen = fallback[0]!;
    const reason =
      `${ordered.length} index root(s); all look vendored/suspicious. ` +
      `Picking highest fan-out '${chosen.basename}' ` +
      `(local out-degree ${chosen.report.localOutDegree}) — verify it is the app entry.`;
    return { indexHtml, chosen, candidates, reason };
  }

  return {
    indexHtml,
    chosen: null,
    candidates,
    reason:
      `none of the index.html roots resolved to a file under ${rootDir}: ` +
      candidates.map((c) => c.basename).join(", "),
  };
}

function summarise(report: EntryReport): void {
  console.error(report.suspicious ? "✗ suspicious entry" : "✓ entry looks ok");
  console.error(`  entry             = ${report.entry}`);
  console.error(`  in index.html?    = ${report.isRoot ? "yes" : "no"}`);
  console.error(`  local out-degree  = ${report.localOutDegree}`);
  console.error(`  imported-by       = ${report.inDegree}`);
  console.error(`  looks vendored    = ${report.looksVendored}`);
  if (report.scriptRoots.length > 0) {
    console.error(`  index.html roots  = ${report.scriptRoots.join(", ")}`);
  }
  if (report.parseError) {
    console.error(`  parse warning     = ${report.parseError}`);
  }
  console.error("");
  console.error(report.recommendation);
}

function summariseDiscovery(result: DiscoverEntryResult): void {
  console.error(result.chosen ? "✓ discovered entry" : "✗ no entry discovered");
  console.error(`  index.html        = ${result.indexHtml ?? "(none)"}`);
  for (const c of result.candidates) {
    const outDegree = c.report ? String(c.report.localOutDegree) : "?";
    const flag = !c.report
      ? " [unresolved]"
      : c.report.looksVendored
        ? " [vendored]"
        : c.report.suspicious
          ? " [suspicious]"
          : "";
    const mark =
      result.chosen && c.basename === result.chosen.basename ? "→" : " ";
    console.error(
      `  ${mark} ${c.basename} (${c.source}, out-degree ${outDegree})${flag}`,
    );
  }
  console.error("");
  console.error(result.reason);
}

const USAGE =
  "Usage: bun scripts/check-entry.ts <entry.js> [--root <assets-dir>] " +
  "[--index <index.html>] [--out report.json]\n" +
  "       bun scripts/check-entry.ts --discover --root <assets-dir> " +
  "[--index <index.html>] [--out result.json]\n" +
  "Exit: 0 ok · 3 suspicious (vendor/transitive leaf) · 1 I/O or none discovered · 64 usage.";

function main(): void {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        root: { type: "string" },
        index: { type: "string" },
        out: { type: "string", short: "o" },
        discover: { type: "boolean", default: false },
      },
      allowPositionals: true,
    });
  } catch (err) {
    console.error(USAGE);
    console.error((err as Error).message);
    process.exit(64);
  }
  const { positionals, values } = parsed;

  if (values.discover) {
    if (!values.root) {
      console.error(USAGE);
      console.error("--discover requires --root <assets-dir>");
      process.exit(64);
    }
    let result: DiscoverEntryResult;
    try {
      result = discoverEntry(values.root, { indexHtml: values.index });
    } catch (err) {
      console.error(`failed to discover entry: ${(err as Error).message}`);
      process.exit(1);
    }
    if (values.out) {
      try {
        fs.writeFileSync(values.out, JSON.stringify(result, null, 2) + "\n");
      } catch (err) {
        console.error(`failed to write output: ${(err as Error).message}`);
        process.exit(1);
      }
    }
    summariseDiscovery(result);
    if (!result.chosen || !result.chosen.resolvedFile) process.exit(1);
    process.stdout.write(result.chosen.resolvedFile + "\n");
    process.exit(result.chosen.report?.suspicious ? 3 : 0);
  }

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }

  const entryPath = positionals[0]!;
  if (!fs.existsSync(entryPath)) {
    console.error(`entry not found: ${entryPath}`);
    process.exit(1);
  }

  let report: EntryReport;
  try {
    report = checkEntry(entryPath, {
      rootDir: values.root,
      indexHtml: values.index,
    });
  } catch (err) {
    console.error(`failed to check entry: ${(err as Error).message}`);
    process.exit(1);
  }

  if (values.out) {
    try {
      fs.writeFileSync(values.out, JSON.stringify(report, null, 2) + "\n");
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  }
  summarise(report);
  process.exit(report.suspicious ? 3 : 0);
}

if (import.meta.main) {
  main();
}
