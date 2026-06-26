import * as fs from "node:fs";
import * as path from "node:path";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";

const SOURCE_FILE_RE = /\.[cm]?[jt]sx?$/i;

export type StageEFileEntry = {
  absolutePath: string;
  restoredRelativePath: string;
  bytes: number;
  sha256: string;
  source: string;
};

export type StageEIndexedFile = {
  path: string;
  bytes: number;
  sha256: string;
};

export type StageEBatch = {
  id: string;
  fileCount: number;
  bytes: number;
  files: string[];
};

export type StageEReviewIndex = {
  generatedAt: string;
  targetDir: string;
  checklist: string;
  fileCount: number;
  files: StageEIndexedFile[];
  batchCount: number;
  maxFilesPerBatch: number;
  maxBytesPerBatch: number;
  batches: StageEBatch[];
};

export type PrepareStageEReviewOptions = {
  targetDir: string;
  checklistPath?: string;
  outDir?: string;
  maxFilesPerBatch?: number;
  maxBytesPerBatch?: number;
  now?: Date;
};

export type StageEReviewPacketIssue = {
  code: string;
  message: string;
};

export type StageEReviewPacketVerification = {
  ok: boolean;
  targetDir: string;
  outDir: string;
  publicFileCount: number;
  indexedFileCount: number;
  batchCount: number;
  batchedFileCount: number;
  issues: StageEReviewPacketIssue[];
};

export type VerifyStageEReviewPacketsOptions = {
  targetDir: string;
  checklistPath?: string;
  outDir?: string;
};

function walkPublicSourceFiles(targetDir: string): string[] {
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    throw new Error(`target directory does not exist: ${targetDir}`);
  }
  const result: string[] = [];
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === ".deobfuscate-javascript") continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && SOURCE_FILE_RE.test(entry.name)) {
        result.push(fullPath);
      }
    }
  };
  visit(targetDir);
  return result.sort((left, right) => left.localeCompare(right));
}

function toReviewerRelativePath(
  targetDir: string,
  absolutePath: string,
): string {
  return path.relative(targetDir, absolutePath).split(path.sep).join("/");
}

function assertPositiveInteger(name: string, value: number): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

function collectPublicFileEntries(targetDir: string): StageEFileEntry[] {
  return walkPublicSourceFiles(targetDir).map((absolutePath) => {
    const source = fs.readFileSync(absolutePath, "utf8");
    return {
      absolutePath,
      restoredRelativePath: toReviewerRelativePath(targetDir, absolutePath),
      bytes: Buffer.byteLength(source),
      sha256: createHash("sha256").update(source).digest("hex"),
      source,
    };
  });
}

function buildBatches(
  files: StageEFileEntry[],
  maxFilesPerBatch: number,
  maxBytesPerBatch: number,
): StageEBatch[] {
  const batches: StageEFileEntry[][] = [];
  let currentBatch: StageEFileEntry[] = [];
  let currentBytes = 0;

  for (const file of files) {
    const shouldFlush =
      currentBatch.length > 0 &&
      (currentBatch.length >= maxFilesPerBatch ||
        currentBytes + file.bytes > maxBytesPerBatch);
    if (shouldFlush) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBytes = 0;
    }
    currentBatch.push(file);
    currentBytes += file.bytes;
  }
  if (currentBatch.length > 0) batches.push(currentBatch);

  return batches.map((batch, index) => ({
    id: `batch-${String(index + 1).padStart(2, "0")}`,
    fileCount: batch.length,
    bytes: batch.reduce((sum, file) => sum + file.bytes, 0),
    files: batch.map((file) => file.restoredRelativePath),
  }));
}

function languageForFile(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  if (extension.endsWith("x")) return extension.includes("j") ? "jsx" : "tsx";
  return extension.includes("j") ? "js" : "ts";
}

function renderCandidateFileBlock(
  relativePath: string,
  source: string,
): string {
  return [
    `=== FILE: ${relativePath} ===`,
    "",
    `\`\`\`${languageForFile(relativePath)}`,
    source,
    "```",
    "",
  ].join("\n");
}

export function prepareStageEReviewPackets(
  options: PrepareStageEReviewOptions,
): StageEReviewIndex {
  const targetDir = path.resolve(options.targetDir);
  const checklistPath = path.resolve(
    options.checklistPath ??
      path.join(import.meta.dir, "acceptance-checklist.md"),
  );
  const outDir = path.resolve(
    options.outDir ??
      path.join(targetDir, ".deobfuscate-javascript", "_stage-e"),
  );
  const maxFilesPerBatch = options.maxFilesPerBatch ?? 8;
  const maxBytesPerBatch = options.maxBytesPerBatch ?? 90_000;
  assertPositiveInteger("maxFilesPerBatch", maxFilesPerBatch);
  assertPositiveInteger("maxBytesPerBatch", maxBytesPerBatch);
  const checklist = fs.readFileSync(checklistPath, "utf8");
  const files = collectPublicFileEntries(targetDir);
  const batches = buildBatches(files, maxFilesPerBatch, maxBytesPerBatch);
  const index: StageEReviewIndex = {
    generatedAt: (options.now ?? new Date()).toISOString(),
    targetDir: path.basename(targetDir),
    checklist: path.relative(process.cwd(), checklistPath),
    fileCount: files.length,
    files: files.map((file) => ({
      path: file.restoredRelativePath,
      bytes: file.bytes,
      sha256: file.sha256,
    })),
    batchCount: batches.length,
    maxFilesPerBatch,
    maxBytesPerBatch,
    batches,
  };

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.join(outDir, "results"), { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(outDir, "batches.tsv"),
    `${batches
      .flatMap((batch) => batch.files.map((file) => `${batch.id}\t${file}`))
      .join("\n")}\n`,
  );
  fs.writeFileSync(
    path.join(outDir, "README.md"),
    [
      "# Stage E Reviewer Packets",
      "",
      "Generated reviewer-agent payloads for the restored tree. These files are hidden under the deobfuscation workspace and are not public deliverables.",
      "",
      `- Target directory: \`${path.basename(targetDir)}\``,
      `- Public files: ${files.length}`,
      `- Batches: ${batches.length}`,
      `- Prompt template: \`${index.checklist}\``,
      "",
      "Use one `batch-XX.md` file per reviewer-agent call. The reviewer must return the strict Stage E verdict blocks from the checklist.",
      "Save reviewer replies under `results/` and run `verify-stage-e-results.ts` after the loop to prove every public file has exactly one `PASS` verdict.",
      "",
    ].join("\n"),
  );

  const filesByRelativePath = new Map(
    files.map((file) => [file.restoredRelativePath, file]),
  );
  for (const batch of batches) {
    const header = [
      `# Stage E Reviewer Payload: ${batch.id}`,
      "",
      `Target directory: \`${path.basename(targetDir)}\``,
      `Files in this batch: ${batch.fileCount}`,
      "",
      "Read the checklist and every file below end-to-end. Return only the strict verdict blocks required by the checklist.",
      "",
      "---",
      "",
      checklist,
      "",
      "---",
      "",
      "## Candidate Files",
      "",
    ].join("\n");
    const body = batch.files
      .map((relativePath) => {
        const file = filesByRelativePath.get(relativePath);
        if (!file) throw new Error(`Missing batched file: ${relativePath}`);
        return renderCandidateFileBlock(relativePath, file.source);
      })
      .join("\n");
    fs.writeFileSync(path.join(outDir, `${batch.id}.md`), header + body);
  }

  return index;
}

function countValues(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function readExistingIndex(outDir: string): StageEReviewIndex | null {
  const indexPath = path.join(outDir, "index.json");
  if (!fs.existsSync(indexPath)) return null;
  return JSON.parse(fs.readFileSync(indexPath, "utf8")) as StageEReviewIndex;
}

function parseBatchesTsv(outDir: string): string[] | null {
  const tsvPath = path.join(outDir, "batches.tsv");
  if (!fs.existsSync(tsvPath)) return null;
  const text = fs.readFileSync(tsvPath, "utf8").trim();
  if (!text) return [];
  return text.split(/\r?\n/).map((line) => line.split("\t")[1] ?? "");
}

export function verifyStageEReviewPackets(
  options: VerifyStageEReviewPacketsOptions,
): StageEReviewPacketVerification {
  const targetDir = path.resolve(options.targetDir);
  const checklistPath = path.resolve(
    options.checklistPath ??
      path.join(import.meta.dir, "acceptance-checklist.md"),
  );
  const outDir = path.resolve(
    options.outDir ??
      path.join(targetDir, ".deobfuscate-javascript", "_stage-e"),
  );
  const publicEntries = collectPublicFileEntries(targetDir);
  const publicFiles = publicEntries.map((file) => file.restoredRelativePath);
  const publicFileSet = new Set(publicFiles);
  const issues: StageEReviewPacketIssue[] = [];
  const index = readExistingIndex(outDir);
  if (!index) {
    issues.push({
      code: "missing-index",
      message: `missing Stage E packet index: ${path.join(outDir, "index.json")}`,
    });
    return {
      ok: false,
      targetDir: path.basename(targetDir),
      outDir,
      publicFileCount: publicFiles.length,
      indexedFileCount: 0,
      batchCount: 0,
      batchedFileCount: 0,
      issues,
    };
  }

  const indexedFiles = index.batches.flatMap((batch) => batch.files);
  const indexedMetadata = index.files ?? [];
  const indexedMetadataByPath = new Map(
    indexedMetadata.map((file) => [file.path, file]),
  );
  const indexedCounts = countValues(indexedFiles);
  const duplicates = [...indexedCounts]
    .filter(([, count]) => count > 1)
    .map(([file]) => file);
  const missingFiles = publicFiles.filter((file) => !indexedCounts.has(file));
  const extraFiles = indexedFiles.filter((file) => !publicFileSet.has(file));
  const hiddenFiles = indexedFiles.filter((file) =>
    file.split("/").includes(".deobfuscate-javascript"),
  );

  if (index.fileCount !== publicFiles.length) {
    issues.push({
      code: "file-count-mismatch",
      message: `index fileCount=${index.fileCount}, current public files=${publicFiles.length}`,
    });
  }
  if (!Array.isArray(index.files)) {
    issues.push({
      code: "missing-file-metadata",
      message:
        "index.json is missing per-file bytes/sha256 metadata; regenerate Stage E packets",
    });
  } else {
    const metadataFiles = index.files.map((file) => file.path);
    const metadataCounts = countValues(metadataFiles);
    const duplicateMetadata = [...metadataCounts]
      .filter(([, count]) => count > 1)
      .map(([file]) => file);
    const missingMetadata = publicFiles.filter(
      (file) => !metadataCounts.has(file),
    );
    const extraMetadata = metadataFiles.filter(
      (file) => !publicFileSet.has(file),
    );
    if (duplicateMetadata.length > 0) {
      issues.push({
        code: "duplicate-file-metadata",
        message: `files appear more than once in index metadata: ${duplicateMetadata.join(", ")}`,
      });
    }
    if (missingMetadata.length > 0) {
      issues.push({
        code: "missing-file-metadata",
        message: `public files missing from index metadata: ${missingMetadata.join(", ")}`,
      });
    }
    if (extraMetadata.length > 0) {
      issues.push({
        code: "extra-file-metadata",
        message: `index metadata references files not present in public tree: ${extraMetadata.join(", ")}`,
      });
    }
    for (const entry of publicEntries) {
      const metadata = indexedMetadataByPath.get(entry.restoredRelativePath);
      if (!metadata) continue;
      if (metadata.bytes !== entry.bytes || metadata.sha256 !== entry.sha256) {
        issues.push({
          code: "file-content-mismatch",
          message: `${entry.restoredRelativePath} differs from index metadata; regenerate Stage E packets`,
        });
      }
    }
  }
  if (index.batchCount !== index.batches.length) {
    issues.push({
      code: "batch-count-mismatch",
      message: `index batchCount=${index.batchCount}, batches.length=${index.batches.length}`,
    });
  }
  if (duplicates.length > 0) {
    issues.push({
      code: "duplicate-files",
      message: `files appear in more than one batch: ${duplicates.join(", ")}`,
    });
  }
  if (missingFiles.length > 0) {
    issues.push({
      code: "missing-files",
      message: `public files missing from packets: ${missingFiles.join(", ")}`,
    });
  }
  if (extraFiles.length > 0) {
    issues.push({
      code: "extra-files",
      message: `packet files not present in public tree: ${extraFiles.join(", ")}`,
    });
  }
  if (hiddenFiles.length > 0) {
    issues.push({
      code: "hidden-files",
      message: `hidden checkpoint files leaked into packets: ${hiddenFiles.join(", ")}`,
    });
  }

  const tsvFiles = parseBatchesTsv(outDir);
  if (!tsvFiles) {
    issues.push({
      code: "missing-batches-tsv",
      message: `missing Stage E packet TSV: ${path.join(outDir, "batches.tsv")}`,
    });
  } else if (tsvFiles.join("\n") !== indexedFiles.join("\n")) {
    issues.push({
      code: "batches-tsv-mismatch",
      message: "batches.tsv does not match index.json batch order",
    });
  }

  const checklist = fs.readFileSync(checklistPath, "utf8");
  const declaredBatchIds = new Set(index.batches.map((batch) => batch.id));
  const existingBatchIds = fs.existsSync(outDir)
    ? fs
        .readdirSync(outDir)
        .filter((file) => /^batch-\d+\.md$/.test(file))
        .map((file) => path.basename(file, ".md"))
        .sort()
    : [];
  const extraBatchIds = existingBatchIds.filter(
    (batchId) => !declaredBatchIds.has(batchId),
  );
  if (extraBatchIds.length > 0) {
    issues.push({
      code: "extra-batch-files",
      message: `batch markdown files not declared in index: ${extraBatchIds.join(", ")}`,
    });
  }

  for (const batch of index.batches) {
    if (batch.fileCount !== batch.files.length) {
      issues.push({
        code: "batch-file-count-mismatch",
        message: `${batch.id} fileCount=${batch.fileCount}, files.length=${batch.files.length}`,
      });
    }
    if (batch.files.length > index.maxFilesPerBatch) {
      issues.push({
        code: "batch-file-cap-exceeded",
        message: `${batch.id} has ${batch.files.length} files; cap is ${index.maxFilesPerBatch}`,
      });
    }
    if (batch.files.length > 1 && batch.bytes > index.maxBytesPerBatch) {
      issues.push({
        code: "batch-byte-cap-exceeded",
        message: `${batch.id} has ${batch.bytes} bytes; cap is ${index.maxBytesPerBatch}`,
      });
    }
    const currentBatchBytes = batch.files.reduce((sum, file) => {
      const entry = publicEntries.find(
        (candidate) => candidate.restoredRelativePath === file,
      );
      return sum + (entry?.bytes ?? 0);
    }, 0);
    if (batch.bytes !== currentBatchBytes) {
      issues.push({
        code: "batch-byte-mismatch",
        message: `${batch.id} bytes=${batch.bytes}, current public bytes=${currentBatchBytes}`,
      });
    }
    const batchPath = path.join(outDir, `${batch.id}.md`);
    if (!fs.existsSync(batchPath)) {
      issues.push({
        code: "missing-batch-packet",
        message: `missing reviewer packet: ${batchPath}`,
      });
      continue;
    }
    const packet = fs.readFileSync(batchPath, "utf8");
    if (!packet.includes(checklist)) {
      issues.push({
        code: "missing-checklist",
        message: `${batch.id}.md does not include the configured checklist text`,
      });
    }
    for (const file of batch.files) {
      if (!packet.includes(`=== FILE: ${file} ===`)) {
        issues.push({
          code: "missing-file-marker",
          message: `${batch.id}.md is missing marker for ${file}`,
        });
      }
      const entry = publicEntries.find(
        (candidate) => candidate.restoredRelativePath === file,
      );
      if (
        entry &&
        !packet.includes(renderCandidateFileBlock(file, entry.source))
      ) {
        issues.push({
          code: "batch-packet-content-mismatch",
          message: `${batch.id}.md does not contain the current source payload for ${file}; regenerate Stage E packets`,
        });
      }
    }
  }

  if (!fs.existsSync(path.join(outDir, "README.md"))) {
    issues.push({
      code: "missing-readme",
      message: `missing Stage E packet README: ${path.join(outDir, "README.md")}`,
    });
  }

  return {
    ok: issues.length === 0,
    targetDir: path.basename(targetDir),
    outDir,
    publicFileCount: publicFiles.length,
    indexedFileCount: index.fileCount,
    batchCount: index.batchCount,
    batchedFileCount: indexedFiles.length,
    issues,
  };
}

function usage(): never {
  console.error(
    "Usage: bun prepare-stage-e-review.ts <target-dir> [--out-dir DIR] [--checklist PATH] [--max-files N] [--max-bytes N] [--verify]",
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
        "out-dir": { type: "string" },
        checklist: { type: "string" },
        "max-files": { type: "string" },
        "max-bytes": { type: "string" },
        verify: { type: "boolean", default: false },
      },
    });
  } catch (error) {
    console.error((error as Error).message);
    usage();
  }
  const [targetDir] = parsed.positionals;
  if (!targetDir) usage();
  const maxFilesPerBatch = parsed.values["max-files"]
    ? Number(parsed.values["max-files"])
    : undefined;
  const maxBytesPerBatch = parsed.values["max-bytes"]
    ? Number(parsed.values["max-bytes"])
    : undefined;
  if (
    (maxFilesPerBatch !== undefined &&
      (!Number.isInteger(maxFilesPerBatch) || maxFilesPerBatch <= 0)) ||
    (maxBytesPerBatch !== undefined &&
      (!Number.isInteger(maxBytesPerBatch) || maxBytesPerBatch <= 0))
  ) {
    usage();
  }
  try {
    if (parsed.values.verify) {
      const verification = verifyStageEReviewPackets({
        targetDir,
        checklistPath: parsed.values.checklist,
        outDir: parsed.values["out-dir"],
      });
      console.log(JSON.stringify(verification, null, 2));
      process.exit(verification.ok ? 0 : 1);
    }
    const index = prepareStageEReviewPackets({
      targetDir,
      checklistPath: parsed.values.checklist,
      outDir: parsed.values["out-dir"],
      maxFilesPerBatch,
      maxBytesPerBatch,
    });
    console.log(JSON.stringify(index, null, 2));
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
