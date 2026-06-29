// Restored from ref/webview/assets/parse-diff-C81j2HIg.js
// parse-diff-C81j2HIg chunk restored from the Codex webview bundle.
import { ParsedFile } from "./types";
const FILE_CHANGED_BYTES_LIMIT = 3 * 1024 * 1024;
const MAX_CHANGED_LINE_BYTES = 1024 * 1024;
const MAX_FILE_CHANGED_LINES = 15000;
const changedBytesCache = new WeakMap<
  ParsedFile,
  {
    changedBytes: number;
    maxChangedLineBytes: number;
  }
>();
export function computeChangedBytes(file: ParsedFile): {
  changedBytes: number;
  maxChangedLineBytes: number;
} {
  const cached = changedBytesCache.get(file);
  if (cached != null) return cached;
  let changedBytes = 0;
  let maxChangedLineBytes = 0;
  for (const hunk of file.hunks) {
    for (const content of hunk.hunkContent) {
      if (content.type === "context") continue;
      const deletionEnd = content.deletionLineIndex + content.deletions;
      for (let i = content.deletionLineIndex; i < deletionEnd; i += 1) {
        const length = file.deletionLines[i]?.length ?? 0;
        changedBytes += length;
        maxChangedLineBytes = Math.max(maxChangedLineBytes, length);
      }
      const additionEnd = content.additionLineIndex + content.additions;
      for (let i = content.additionLineIndex; i < additionEnd; i += 1) {
        const length = file.additionLines[i]?.length ?? 0;
        changedBytes += length;
        maxChangedLineBytes = Math.max(maxChangedLineBytes, length);
      }
    }
  }
  const result = {
    changedBytes,
    maxChangedLineBytes,
  };
  changedBytesCache.set(file, result);
  return result;
}
export function isFileDiffTooLargeDetailed(file: ParsedFile): boolean {
  if (
    file.hunks.reduce(
      (total, hunk) => total + hunk.additionLines + hunk.deletionLines,
      0,
    ) > MAX_FILE_CHANGED_LINES
  ) {
    return true;
  }
  const { changedBytes, maxChangedLineBytes } = computeChangedBytes(file);
  return (
    changedBytes > FILE_CHANGED_BYTES_LIMIT ||
    maxChangedLineBytes > MAX_CHANGED_LINE_BYTES
  );
}
export function createLazyChangedBytesGetter(file: ParsedFile): () => {
  changedBytes: number;
  maxChangedLineBytes: number;
} {
  let cached: {
    changedBytes: number;
    maxChangedLineBytes: number;
  } | null = null;
  return () => (cached ??= computeChangedBytes(file));
}
