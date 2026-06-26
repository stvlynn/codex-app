import { afterEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { prepareStageEReviewPackets } from "./prepare-stage-e-review.ts";
import {
  parseStageEVerdicts,
  verifyStageEResults,
} from "./verify-stage-e-results.ts";

const tempRoots: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stage-e-results-"));
  tempRoots.push(dir);
  return dir;
}

function writeRestoredFile(targetDir: string, relativePath: string): void {
  const filePath = path.join(targetDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `export const ${path.basename(relativePath, path.extname(relativePath)).replace(/[^A-Za-z0-9_$]/g, "")} = true;\n`,
  );
}

afterEach(() => {
  for (const dir of tempRoots.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("verify-stage-e-results", () => {
  test("parses strict PASS and NEEDS_FIX verdict blocks", () => {
    const parsed = parseStageEVerdicts(
      [
        "=== FILE: Button.tsx ===",
        "VERDICT: PASS",
        "",
        "=== FILE: ui/ContextMenu.tsx ===",
        "VERDICT: NEEDS_FIX",
        "ISSUES:",
        "- naming:line 12 - mechanical name remains",
        "",
        "=== SUMMARY ===",
        "PASSED: 1",
        "NEEDS_FIX: 1",
      ].join("\n"),
    );

    expect(parsed.invalidMarkers).toEqual([]);
    expect(parsed.entries).toEqual([
      {
        file: "Button.tsx",
        verdict: "PASS",
        issues: [],
        sourcePath: "<inline>",
      },
      {
        file: "ui/ContextMenu.tsx",
        verdict: "NEEDS_FIX",
        issues: ["naming:line 12 - mechanical name remains"],
        sourcePath: "<inline>",
      },
    ]);
  });

  test("accepts exactly one PASS verdict for every indexed file", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "checklist.md");
    const packetsDir = path.join(root, "packets");
    const resultsDir = path.join(packetsDir, "results");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    writeRestoredFile(targetDir, "First.ts");
    writeRestoredFile(targetDir, "nested/Second.ts");
    prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir: packetsDir,
      maxFilesPerBatch: 1,
    });
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(
      path.join(resultsDir, "batch-01.md"),
      "=== FILE: First.ts ===\nVERDICT: PASS\n",
    );
    fs.writeFileSync(
      path.join(resultsDir, "batch-02.md"),
      "=== FILE: nested/Second.ts ===\nVERDICT: PASS\n",
    );

    const verification = verifyStageEResults({
      targetDir,
      packetsDir,
      resultsDir,
    });

    expect(verification.ok).toBe(true);
    expect(verification.expectedFileCount).toBe(2);
    expect(verification.verdictFileCount).toBe(2);
    expect(verification.passCount).toBe(2);
    expect(verification.issues).toEqual([]);
  });

  test("fails when verdicts are missing, duplicated, unexpected, or NEEDS_FIX", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "checklist.md");
    const packetsDir = path.join(root, "packets");
    const resultsDir = path.join(packetsDir, "results");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    writeRestoredFile(targetDir, "First.ts");
    writeRestoredFile(targetDir, "Second.ts");
    writeRestoredFile(targetDir, "Third.ts");
    prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir: packetsDir,
    });
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(
      path.join(resultsDir, "review.md"),
      [
        "=== FILE: First.ts ===",
        "VERDICT: PASS",
        "",
        "=== FILE: First.ts ===",
        "VERDICT: PASS",
        "",
        "=== FILE: Second.ts ===",
        "VERDICT: NEEDS_FIX",
        "ISSUES:",
        "- readability:missing Props type",
        "",
        "=== FILE: Extra.ts ===",
        "VERDICT: PASS",
      ].join("\n"),
    );

    const verification = verifyStageEResults({
      targetDir,
      packetsDir,
      resultsDir,
    });

    expect(verification.ok).toBe(false);
    expect(verification.issues.map((issue) => issue.code)).toEqual([
      "missing-verdicts",
      "duplicate-verdicts",
      "unexpected-files",
      "needs-fix",
    ]);
  });

  test("flags file markers without strict verdicts", () => {
    const parsed = parseStageEVerdicts(
      "=== FILE: Broken.tsx ===\nVERDICT: MAYBE\n",
    );

    expect(parsed.entries).toEqual([]);
    expect(parsed.invalidMarkers).toEqual(["Broken.tsx"]);
  });

  test("flags batch result files that contain verdicts for another batch", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "checklist.md");
    const packetsDir = path.join(root, "packets");
    const resultsDir = path.join(packetsDir, "results");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    writeRestoredFile(targetDir, "First.ts");
    writeRestoredFile(targetDir, "Second.ts");
    prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir: packetsDir,
      maxFilesPerBatch: 1,
    });
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(
      path.join(resultsDir, "batch-01.md"),
      "=== FILE: Second.ts ===\nVERDICT: PASS\n",
    );
    fs.writeFileSync(
      path.join(resultsDir, "batch-02.md"),
      "=== FILE: First.ts ===\nVERDICT: PASS\n",
    );

    const verification = verifyStageEResults({
      targetDir,
      packetsDir,
      resultsDir,
    });

    expect(verification.ok).toBe(false);
    expect(verification.issues.map((issue) => issue.code)).toEqual([
      "batch-result-mismatch",
      "batch-result-mismatch",
    ]);
  });

  test("CLI exits non-zero until every result is PASS", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "checklist.md");
    const packetsDir = path.join(root, "packets");
    const resultsDir = path.join(packetsDir, "results");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    writeRestoredFile(targetDir, "Only.ts");
    prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir: packetsDir,
    });
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(
      path.join(resultsDir, "batch-01.md"),
      "=== FILE: Only.ts ===\nVERDICT: NEEDS_FIX\nISSUES:\n- naming:bad\n",
    );

    const result = spawnSync(
      "bun",
      [
        path.join(import.meta.dir, "verify-stage-e-results.ts"),
        targetDir,
        "--packets-dir",
        packetsDir,
        "--results-dir",
        resultsDir,
      ],
      {
        cwd: path.join(import.meta.dir, "..", "..", "..", ".."),
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).issues[0].code).toBe("needs-fix");
  });
});
