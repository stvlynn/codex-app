import { afterEach, describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import {
  prepareStageEReviewPackets,
  verifyStageEReviewPackets,
} from "./prepare-stage-e-review.ts";

const tempRoots: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stage-e-review-"));
  tempRoots.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempRoots.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("prepare-stage-e-review", () => {
  test("creates review packets for public source files only", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const outDir = path.join(root, "packets");
    const checklistPath = path.join(root, "acceptance-checklist.md");

    fs.mkdirSync(path.join(targetDir, "components"), { recursive: true });
    fs.mkdirSync(
      path.join(targetDir, ".deobfuscate-javascript", "_full", "checkpoints"),
      { recursive: true },
    );
    fs.writeFileSync(
      path.join(checklistPath),
      "REVIEWER CHECKLIST\nReturn PASS or NEEDS_FIX.\n",
    );
    fs.writeFileSync(
      path.join(targetDir, "Button.tsx"),
      "export function Button() { return <button />; }\n",
    );
    fs.writeFileSync(
      path.join(targetDir, "components", "useThing.ts"),
      "export function useThing(): string { return 'thing'; }\n",
    );
    fs.writeFileSync(
      path.join(
        targetDir,
        ".deobfuscate-javascript",
        "_full",
        "checkpoints",
        "bad.tsx",
      ),
      "const callbackValue1 = true;\n",
    );

    const index = prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir,
      maxFilesPerBatch: 1,
      maxBytesPerBatch: 10_000,
      now: new Date("2026-05-23T00:00:00.000Z"),
    });

    expect(index.fileCount).toBe(2);
    expect(index.batchCount).toBe(2);
    expect(index.batches.flatMap((batch) => batch.files)).toEqual([
      "Button.tsx",
      "components/useThing.ts",
    ]);

    const batchesTsv = fs.readFileSync(
      path.join(outDir, "batches.tsv"),
      "utf8",
    );
    expect(fs.existsSync(path.join(outDir, "results"))).toBe(true);
    expect(batchesTsv).toContain("batch-01\tButton.tsx");
    expect(batchesTsv).toContain("batch-02\tcomponents/useThing.ts");
    expect(batchesTsv).not.toContain("bad.tsx");

    const packet = fs.readFileSync(path.join(outDir, "batch-01.md"), "utf8");
    expect(packet).toContain("REVIEWER CHECKLIST");
    expect(packet).toContain("=== FILE: Button.tsx ===");
    expect(packet).toContain("```tsx");
    expect(packet).not.toContain("callbackValue1");

    const savedIndex = JSON.parse(
      fs.readFileSync(path.join(outDir, "index.json"), "utf8"),
    );
    expect(savedIndex.fileCount).toBe(2);
    expect(savedIndex.files).toHaveLength(2);
    expect(savedIndex.files[0]).toMatchObject({
      path: "Button.tsx",
      bytes: Buffer.byteLength(
        "export function Button() { return <button />; }\n",
      ),
    });
    expect(savedIndex.files[0].sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(savedIndex.generatedAt).toBe("2026-05-23T00:00:00.000Z");

    const verification = verifyStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir,
    });
    expect(verification.ok).toBe(true);
    expect(verification.issues).toEqual([]);
    expect(verification.publicFileCount).toBe(2);
    expect(verification.batchedFileCount).toBe(2);
  });

  test("splits a batch before exceeding the byte cap", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "acceptance-checklist.md");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    fs.writeFileSync(
      path.join(targetDir, "First.ts"),
      `export const first = "${"a".repeat(40)}";\n`,
    );
    fs.writeFileSync(
      path.join(targetDir, "Second.ts"),
      `export const second = "${"b".repeat(40)}";\n`,
    );

    const index = prepareStageEReviewPackets({
      targetDir,
      checklistPath,
      maxFilesPerBatch: 8,
      maxBytesPerBatch: 70,
    });

    expect(index.batchCount).toBe(2);
    expect(index.batches.map((batch) => batch.files)).toEqual([
      ["First.ts"],
      ["Second.ts"],
    ]);
  });

  test("returns usage error for invalid CLI batch sizes", () => {
    const result = spawnSync(
      "bun",
      [
        path.join(import.meta.dir, "prepare-stage-e-review.ts"),
        "restored",
        "--max-files",
        "0",
      ],
      {
        cwd: path.join(import.meta.dir, "..", "..", "..", ".."),
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(64);
    expect(result.stderr).toContain("Usage: bun prepare-stage-e-review.ts");
  });

  test("rejects invalid library batch sizes", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "acceptance-checklist.md");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    fs.writeFileSync(
      path.join(targetDir, "Only.ts"),
      "export const only = true;\n",
    );

    expect(() =>
      prepareStageEReviewPackets({
        targetDir,
        checklistPath,
        maxFilesPerBatch: 0,
      }),
    ).toThrow("maxFilesPerBatch must be a positive integer");
  });

  test("verifies packet coverage against the current public tree", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "acceptance-checklist.md");
    const outDir = path.join(root, "packets");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    fs.writeFileSync(
      path.join(targetDir, "First.ts"),
      "export const first = true;\n",
    );
    prepareStageEReviewPackets({ targetDir, checklistPath, outDir });

    fs.writeFileSync(
      path.join(targetDir, "Second.ts"),
      "export const second = true;\n",
    );
    const verification = verifyStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir,
    });

    expect(verification.ok).toBe(false);
    expect(verification.issues.map((issue) => issue.code)).toContain(
      "file-count-mismatch",
    );
    expect(verification.issues.map((issue) => issue.code)).toContain(
      "missing-files",
    );
  });

  test("verifies packet source content against the current public tree", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "acceptance-checklist.md");
    const outDir = path.join(root, "packets");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    fs.writeFileSync(
      path.join(targetDir, "First.ts"),
      "export const first = true;\n",
    );
    prepareStageEReviewPackets({ targetDir, checklistPath, outDir });

    fs.writeFileSync(
      path.join(targetDir, "First.ts"),
      "export const first = false;\n",
    );
    const verification = verifyStageEReviewPackets({
      targetDir,
      checklistPath,
      outDir,
    });

    expect(verification.ok).toBe(false);
    expect(verification.issues.map((issue) => issue.code)).toContain(
      "file-content-mismatch",
    );
    expect(verification.issues.map((issue) => issue.code)).toContain(
      "batch-packet-content-mismatch",
    );
  });

  test("CLI --verify returns non-zero for stale packets", () => {
    const root = tempDir();
    const targetDir = path.join(root, "restored");
    const checklistPath = path.join(root, "acceptance-checklist.md");
    const outDir = path.join(root, "packets");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(checklistPath, "Checklist\n");
    fs.writeFileSync(
      path.join(targetDir, "First.ts"),
      "export const first = true;\n",
    );
    prepareStageEReviewPackets({ targetDir, checklistPath, outDir });
    fs.writeFileSync(
      path.join(targetDir, "Second.ts"),
      "export const second = true;\n",
    );

    const result = spawnSync(
      "bun",
      [
        path.join(import.meta.dir, "prepare-stage-e-review.ts"),
        targetDir,
        "--checklist",
        checklistPath,
        "--out-dir",
        outDir,
        "--verify",
      ],
      {
        cwd: path.join(import.meta.dir, "..", "..", "..", ".."),
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).ok).toBe(false);
  });
});
