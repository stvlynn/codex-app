import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import type { StageEReviewIndex } from "./prepare-stage-e-review.ts";

export type StageEVerdict = "PASS" | "NEEDS_FIX";

export type StageEVerdictEntry = {
  file: string;
  verdict: StageEVerdict;
  issues: string[];
  sourcePath: string;
};

export type StageEResultIssue = {
  code: string;
  message: string;
};

export type StageEResultVerification = {
  ok: boolean;
  targetDir: string;
  packetsDir: string;
  resultsDir: string;
  expectedFileCount: number;
  verdictFileCount: number;
  passCount: number;
  needsFixCount: number;
  issues: StageEResultIssue[];
};

export type VerifyStageEResultsOptions = {
  targetDir: string;
  packetsDir?: string;
  resultsDir?: string;
};

const RESULT_FILE_RE = /\.(md|markdown|txt)$/i;
const VERDICT_BLOCK_RE =
  /^=== FILE: (.+?) ===[^\S\r\n]*\r?\nVERDICT:[^\S\r\n]*(PASS|NEEDS_FIX)[^\S\r\n]*(?:\r?\n([\s\S]*?))?(?=^=== FILE: |^=== SUMMARY ===|(?![\s\S]))/gm;
const FILE_MARKER_RE = /^=== FILE: (.+?) ===/gm;

function readIndex(packetsDir: string): StageEReviewIndex {
  const indexPath = path.join(packetsDir, "index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error(`missing Stage E packet index: ${indexPath}`);
  }
  return JSON.parse(fs.readFileSync(indexPath, "utf8")) as StageEReviewIndex;
}

function listResultFiles(resultsDir: string): string[] {
  if (!fs.existsSync(resultsDir)) return [];
  const result: string[] = [];
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && RESULT_FILE_RE.test(entry.name)) {
        result.push(fullPath);
      }
    }
  };
  visit(resultsDir);
  return result.sort((left, right) => left.localeCompare(right));
}

function parseIssues(blockBody: string): string[] {
  const issuesStart = blockBody.match(/^ISSUES:\s*$/m);
  if (!issuesStart) return [];
  return blockBody
    .slice((issuesStart.index ?? 0) + issuesStart[0].length)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

export function parseStageEVerdicts(
  text: string,
  sourcePath = "<inline>",
): { entries: StageEVerdictEntry[]; invalidMarkers: string[] } {
  const entries: StageEVerdictEntry[] = [];
  const parsedFiles = new Set<string>();
  for (const match of text.matchAll(VERDICT_BLOCK_RE)) {
    const file = match[1]!.trim();
    const verdict = match[2] as StageEVerdict;
    const body = match[3] ?? "";
    parsedFiles.add(file);
    entries.push({
      file,
      verdict,
      issues: parseIssues(body),
      sourcePath,
    });
  }

  const markerFiles = [...text.matchAll(FILE_MARKER_RE)].map((match) =>
    match[1]!.trim(),
  );
  const invalidMarkers = markerFiles.filter((file) => !parsedFiles.has(file));
  return { entries, invalidMarkers };
}

function countByFile(entries: StageEVerdictEntry[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries)
    counts.set(entry.file, (counts.get(entry.file) ?? 0) + 1);
  return counts;
}

function formatFileList(files: string[], maxShown = 20): string {
  if (files.length <= maxShown) return files.join(", ");
  return `${files.slice(0, maxShown).join(", ")} ... (${files.length - maxShown} more)`;
}

export function verifyStageEResults(
  options: VerifyStageEResultsOptions,
): StageEResultVerification {
  const targetDir = path.resolve(options.targetDir);
  const packetsDir = path.resolve(
    options.packetsDir ??
      path.join(targetDir, ".deobfuscate-javascript", "_stage-e"),
  );
  const resultsDir = path.resolve(
    options.resultsDir ?? path.join(packetsDir, "results"),
  );
  const index = readIndex(packetsDir);
  const expectedFiles = index.batches.flatMap((batch) => batch.files);
  const expectedFileSet = new Set(expectedFiles);
  const filesByBatchId = new Map(
    index.batches.map((batch) => [batch.id, new Set(batch.files)]),
  );
  const issues: StageEResultIssue[] = [];
  const resultFiles = listResultFiles(resultsDir);

  if (resultFiles.length === 0) {
    issues.push({
      code: "missing-results",
      message: `no reviewer result files found in ${resultsDir}`,
    });
  }

  const entries: StageEVerdictEntry[] = [];
  for (const resultFile of resultFiles) {
    const text = fs.readFileSync(resultFile, "utf8");
    const parsed = parseStageEVerdicts(text, resultFile);
    const resultBatchId = path.basename(resultFile).replace(/\.[^.]+$/, "");
    const declaredBatchFiles = filesByBatchId.get(resultBatchId);
    if (declaredBatchFiles) {
      const outOfBatchFiles = parsed.entries
        .map((entry) => entry.file)
        .filter((file) => !declaredBatchFiles.has(file));
      if (outOfBatchFiles.length > 0) {
        issues.push({
          code: "batch-result-mismatch",
          message: `${resultFile} is named for ${resultBatchId} but contains verdicts for files outside that batch: ${formatFileList(outOfBatchFiles)}`,
        });
      }
    }
    entries.push(...parsed.entries);
    for (const marker of parsed.invalidMarkers) {
      issues.push({
        code: "invalid-verdict-block",
        message: `${resultFile} has a file marker without a strict PASS/NEEDS_FIX verdict: ${marker}`,
      });
    }
  }

  const counts = countByFile(entries);
  const missingFiles = expectedFiles.filter((file) => !counts.has(file));
  const duplicateFiles = [...counts]
    .filter(([, count]) => count > 1)
    .map(([file]) => file);
  const extraFiles = entries
    .map((entry) => entry.file)
    .filter((file) => !expectedFileSet.has(file));
  const needsFixEntries = entries.filter(
    (entry) => expectedFileSet.has(entry.file) && entry.verdict === "NEEDS_FIX",
  );

  if (missingFiles.length > 0) {
    issues.push({
      code: "missing-verdicts",
      message: `expected files without reviewer verdicts (${missingFiles.length}): ${formatFileList(missingFiles)}`,
    });
  }
  if (duplicateFiles.length > 0) {
    issues.push({
      code: "duplicate-verdicts",
      message: `files with more than one reviewer verdict (${duplicateFiles.length}): ${formatFileList(duplicateFiles)}`,
    });
  }
  if (extraFiles.length > 0) {
    issues.push({
      code: "unexpected-files",
      message: `reviewer verdicts for files not present in packet index (${extraFiles.length}): ${formatFileList(extraFiles)}`,
    });
  }
  if (needsFixEntries.length > 0) {
    const needsFixFiles = needsFixEntries.map((entry) => entry.file);
    issues.push({
      code: "needs-fix",
      message: `reviewer returned NEEDS_FIX for (${needsFixFiles.length}): ${formatFileList(needsFixFiles)}`,
    });
  }

  return {
    ok: issues.length === 0,
    targetDir: path.basename(targetDir),
    packetsDir,
    resultsDir,
    expectedFileCount: expectedFiles.length,
    verdictFileCount: entries.length,
    passCount: entries.filter(
      (entry) => expectedFileSet.has(entry.file) && entry.verdict === "PASS",
    ).length,
    needsFixCount: needsFixEntries.length,
    issues,
  };
}

function usage(): never {
  console.error(
    "Usage: bun verify-stage-e-results.ts <target-dir> [--packets-dir DIR] [--results-dir DIR]",
  );
  process.exit(64);
}

if (import.meta.main) {
  let parsed;
  try {
    parsed = parseArgs({
      args: process.argv.slice(2),
      allowPositionals: true,
      options: {
        "packets-dir": { type: "string" },
        "results-dir": { type: "string" },
      },
    });
  } catch (error) {
    console.error((error as Error).message);
    usage();
  }
  const [targetDir] = parsed.positionals;
  if (!targetDir) usage();
  try {
    const verification = verifyStageEResults({
      targetDir,
      packetsDir: parsed.values["packets-dir"],
      resultsDir: parsed.values["results-dir"],
    });
    console.log(JSON.stringify(verification, null, 2));
    process.exit(verification.ok ? 0 : 1);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
