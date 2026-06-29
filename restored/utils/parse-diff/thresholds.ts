// Restored from ref/webview/assets/parse-diff-C81j2HIg.js
// parse-diff-C81j2HIg chunk restored from the Codex webview bundle.
import { FileDiffThresholds, HunkStats } from "./types";
const CHANGED_BYTES_LIMIT = 12 * 1024 * 1024;
const FILE_CHANGED_BYTES_LIMIT = 3 * 1024 * 1024;
const MAX_CHANGED_LINE_BYTES = 1024 * 1024;
const MAX_TOTAL_CHANGED_LINES = 9000;
const MAX_FILES = 128;
const MAX_FILE_CHANGED_LINES = 15000;
export function isDiffTooLarge(thresholds: FileDiffThresholds): boolean {
  return (
    thresholds.fileCount > MAX_FILES ||
    thresholds.totalChangedLines > MAX_TOTAL_CHANGED_LINES ||
    thresholds.totalChangedBytes > CHANGED_BYTES_LIMIT
  );
}
export function isFileDiffTooLarge(stats: HunkStats): boolean {
  return (
    stats.additions + stats.deletions > MAX_FILE_CHANGED_LINES ||
    stats.changedBytes > FILE_CHANGED_BYTES_LIMIT ||
    stats.maxChangedLineBytes > MAX_CHANGED_LINE_BYTES
  );
}
