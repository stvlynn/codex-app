// Restored from ref/webview/assets/diff-summary-qXVUYlx3.js
// DiffSummary chunk restored from the Codex webview bundle.

export interface FileDiffStats {
  additions: number;
  deletions: number;
}

export interface DiffSummaryResult {
  fileCount: number;
  linesAdded: number;
  linesDeleted: number;
  hasChanges: boolean;
}

/**
 * Computes an aggregate summary of line changes across multiple file diffs.
 */
export function computeDiffSummary(
  fileDiffs: FileDiffStats[],
): DiffSummaryResult {
  let totalAdditions = 0;
  let totalDeletions = 0;
  for (const fileDiff of fileDiffs) {
    totalAdditions += fileDiff.additions;
    totalDeletions += fileDiff.deletions;
  }
  return {
    fileCount: fileDiffs.length,
    linesAdded: totalAdditions,
    linesDeleted: totalDeletions,
    hasChanges: totalAdditions > 0 || totalDeletions > 0,
  };
}
