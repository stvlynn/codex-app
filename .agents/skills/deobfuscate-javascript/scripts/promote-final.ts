import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import {
  analyzeSource,
  DEFAULT_OPTIONS,
  type FileQualityReport,
  type QualityGateOptions,
} from "./quality-gate.ts";

const SOURCE_EXT_RE = /\.[cm]?[jt]sx?$/i;

export type PromoteFinalOptions = {
  candidate: string;
  target: string;
  reportPath?: string;
  qualityOptions?: QualityGateOptions;
};

export type PromoteFinalResult = {
  promoted: boolean;
  reports: FileQualityReport[];
};

function collectFiles(input: string): string[] {
  const stat = fs.statSync(input);
  if (stat.isFile()) return [input];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (
        entry.name === ".deobfuscate-javascript" ||
        entry.name === "node_modules"
      ) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (SOURCE_EXT_RE.test(entry.name)) out.push(full);
    }
  };
  walk(input);
  return out.sort();
}

function writeReport(reportPath: string | undefined, reports: FileQualityReport[]): void {
  if (!reportPath) return;
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(reports, null, 2)}\n`);
}

function copyCandidate(candidate: string, target: string): void {
  const candidateReal = fs.realpathSync(candidate);
  const targetParent = path.dirname(target);
  fs.mkdirSync(targetParent, { recursive: true });
  const resolvedTargetParent = fs.realpathSync(targetParent);
  const resolvedTarget = path.join(resolvedTargetParent, path.basename(target));
  if (candidateReal === resolvedTarget || candidateReal.startsWith(`${resolvedTarget}${path.sep}`)) {
    throw new Error("candidate cannot be the same as, or inside, target");
  }
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(candidate, target, { recursive: true });
}

export function promoteFinal(options: PromoteFinalOptions): PromoteFinalResult {
  if (!fs.existsSync(options.candidate)) {
    throw new Error(`candidate not found: ${options.candidate}`);
  }
  const qualityOptions = options.qualityOptions ?? DEFAULT_OPTIONS;
  const reports = collectFiles(options.candidate).map((file) =>
    analyzeSource(fs.readFileSync(file, "utf-8"), file, qualityOptions),
  );
  writeReport(options.reportPath, reports);
  if (reports.some((report) => report.issues.length > 0)) {
    return { promoted: false, reports };
  }
  copyCandidate(options.candidate, options.target);
  return { promoted: true, reports };
}

const USAGE =
  "Usage: bun scripts/promote-final.ts <candidate-file-or-dir> <target-file-or-dir> " +
  "[--report quality-report.json] [--allow-flat] [--allow-mechanical-names]";

async function main(): Promise<void> {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      options: {
        report: { type: "string" },
        "allow-flat": { type: "boolean", default: false },
        "allow-mechanical-names": { type: "boolean", default: false },
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
  try {
    const result = promoteFinal({
      candidate: positionals[0]!,
      target: positionals[1]!,
      reportPath: values.report,
      qualityOptions: {
        ...DEFAULT_OPTIONS,
        allowFlat: values["allow-flat"] ?? false,
        allowMechanicalNames: values["allow-mechanical-names"] ?? false,
      },
    });
    if (!result.promoted) {
      for (const report of result.reports.filter((item) => item.issues.length > 0)) {
        console.error(`promote-final: FAIL ${report.file}`);
        for (const issue of report.issues) {
          console.error(`  [${issue.code}] ${issue.message}`);
        }
      }
      process.exit(1);
    }
    console.error(`promote-final: promoted ${positionals[0]} -> ${positionals[1]}`);
    console.error(
      "promote-final: Stage E reviewer-agent PASS is still required before completion",
    );
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
