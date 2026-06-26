import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";

const TAIL_BYTES = 8192;
const MAX_LISTED_SOURCES = 20;

type Report = {
  input: string;
  hasComment: boolean;
  sourceMappingURL?: string;
  kind?: "data-url" | "relative" | "absolute" | "http";
  mapPath?: string;
  mapFound: boolean;
  parseError?: string;
  sourcesCount: number;
  sources?: string[];
  recommendation: string;
};

function findSourceMapUrl(source: string): string | undefined {
  const tail = source.slice(Math.max(0, source.length - TAIL_BYTES));
  const regex = /[#@]\s*sourceMappingURL=([^\s\n\r"'*]+)/g;
  let last: string | undefined;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(tail)) !== null) {
    last = m[1];
  }
  return last;
}

function classifyUrl(url: string): Report["kind"] {
  if (url.startsWith("data:")) return "data-url";
  if (/^https?:\/\//i.test(url)) return "http";
  if (path.isAbsolute(url)) return "absolute";
  return "relative";
}

function decodeDataUrl(url: string): unknown | undefined {
  const m = url.match(/^data:application\/json(?:;charset=[^;,]+)?(?:;base64)?,(.+)$/);
  if (!m) return undefined;
  const isBase64 = url.includes(";base64");
  try {
    const raw = isBase64
      ? Buffer.from(m[1]!, "base64").toString("utf-8")
      : decodeURIComponent(m[1]!);
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function loadMapFile(mapPath: string): unknown | undefined {
  try {
    return JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  } catch {
    return undefined;
  }
}

function extractSources(parsed: unknown): string[] {
  if (parsed && typeof parsed === "object" && "sources" in parsed) {
    const sources = (parsed as { sources: unknown }).sources;
    if (Array.isArray(sources)) {
      return sources.filter((s): s is string => typeof s === "string");
    }
  }
  return [];
}

function buildReport(inputPath: string, source: string): Report {
  const url = findSourceMapUrl(source);
  const report: Report = {
    input: inputPath,
    hasComment: !!url,
    mapFound: false,
    sourcesCount: 0,
    recommendation: "",
  };

  if (!url) {
    const adj = inputPath + ".map";
    if (fs.existsSync(adj)) {
      const parsed = loadMapFile(adj);
      const sources = parsed ? extractSources(parsed) : [];
      report.mapPath = adj;
      report.mapFound = !!parsed;
      report.sourcesCount = sources.length;
      report.sources = sources;
      report.recommendation = parsed
        ? `Adjacent ${path.basename(adj)} found with ${sources.length} original source(s). Recover from sourcemap instead of running the rename pipeline — far higher fidelity.`
        : `Adjacent ${path.basename(adj)} found but failed to parse as JSON. Inspect manually, otherwise fall back to extract/apply.`;
      return report;
    }
    report.recommendation =
      "No sourceMappingURL comment, no adjacent .map file. Proceed with the extract/apply rename pipeline.";
    return report;
  }

  report.sourceMappingURL = url;
  report.kind = classifyUrl(url);

  if (report.kind === "data-url") {
    const parsed = decodeDataUrl(url);
    const sources = parsed ? extractSources(parsed) : [];
    report.mapFound = !!parsed;
    report.sourcesCount = sources.length;
    report.sources = sources;
    report.recommendation = parsed
      ? `Inline data-URL sourcemap with ${sources.length} original source(s). Decode and reconstruct originals instead of renaming.`
      : "Inline data-URL sourcemap detected but could not decode. Try a tool like source-map-explorer.";
    return report;
  }

  if (report.kind === "http") {
    report.recommendation = `sourceMappingURL is a URL (${url}). Fetch it manually (curl/wget), then re-run with the local .map file alongside the JS, or feed the downloaded .map to a sourcemap tool.`;
    return report;
  }

  const mapPath = report.kind === "absolute" ? url : path.join(path.dirname(inputPath), url);
  report.mapPath = mapPath;

  if (!fs.existsSync(mapPath)) {
    report.recommendation = `sourceMappingURL points to ${url} but ${mapPath} does not exist. Either fetch the .map manually, or proceed with extract/apply.`;
    return report;
  }

  const parsed = loadMapFile(mapPath);
  if (!parsed) {
    report.parseError = "invalid JSON";
    report.recommendation = `${mapPath} exists but is not valid JSON. Inspect manually, otherwise fall back to extract/apply.`;
    return report;
  }

  const sources = extractSources(parsed);
  report.mapFound = true;
  report.sourcesCount = sources.length;
  report.sources = sources;
  report.recommendation = `${path.basename(mapPath)} found with ${sources.length} original source(s). Recover from sourcemap instead of renaming — preserves original variable names, comments, and file structure.`;
  return report;
}

function summarise(report: Report): void {
  const found = report.hasComment || report.mapFound;
  console.error(found ? "✓ sourcemap detected" : "✗ no sourcemap");
  if (report.sourceMappingURL) {
    const url = report.sourceMappingURL;
    const display = url.length > 100 ? url.slice(0, 97) + "..." : url;
    console.error(`  sourceMappingURL = ${display}`);
    if (report.kind) console.error(`  kind             = ${report.kind}`);
  }
  if (report.mapPath) console.error(`  map file         = ${report.mapPath}`);
  if (report.parseError) console.error(`  parse error      = ${report.parseError}`);
  if (report.sources && report.sources.length > 0) {
    console.error(`  ${report.sources.length} original source(s):`);
    for (const src of report.sources.slice(0, MAX_LISTED_SOURCES)) {
      console.error(`    ${src}`);
    }
    if (report.sources.length > MAX_LISTED_SOURCES) {
      console.error(`    ... and ${report.sources.length - MAX_LISTED_SOURCES} more`);
    }
  }
  console.error("");
  console.error(report.recommendation);
}

const USAGE = "Usage: bun scripts/sourcemap-check.ts <input.js> [--out report.json]";

function main(): void {
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
  const { positionals, values } = parsed;

  if (positionals.length === 0) {
    console.error(USAGE);
    process.exit(64);
  }

  const inputPath = positionals[0]!;
  let source: string;
  try {
    source = fs.readFileSync(inputPath, "utf-8");
  } catch (err) {
    console.error(`failed to read input: ${(err as Error).message}`);
    process.exit(1);
  }
  const report = buildReport(inputPath, source);

  if (values.out) {
    try {
      fs.writeFileSync(values.out, JSON.stringify(report, null, 2) + "\n");
    } catch (err) {
      console.error(`failed to write output: ${(err as Error).message}`);
      process.exit(1);
    }
  }
  summarise(report);
  process.exit(report.mapFound ? 0 : 1);
}

main();
