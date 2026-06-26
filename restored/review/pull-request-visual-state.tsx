// Restored from ref/webview/assets/pull-request-visual-state-DB2RsvTJ.js
// PullRequestVisualState chunk restored from the Codex webview bundle.

export type PullRequestVisualStatus = "merged" | "open" | "draft" | null;

export interface PullRequestVisualStatusInput {
  hasOpenPr: boolean;
  isDraft: boolean;
  url?: string | null;
}

export function getPullRequestVisualStatus({
  hasOpenPr,
  isDraft,
  url,
}: PullRequestVisualStatusInput): PullRequestVisualStatus {
  if (hasOpenPr) {
    return isDraft ? "draft" : "open";
  }
  return url == null ? null : "merged";
}

export type PullRequestMergeState =
  | "merged"
  | "draft"
  | "failing"
  | "successful"
  | "ready"
  | "in_progress";

export interface PullRequestMergeStateInput {
  canMerge: boolean;
  ciStatus: string;
  hasMergeConflicts?: boolean;
  status: PullRequestVisualStatus;
}

export function getPullRequestMergeState({
  canMerge,
  ciStatus,
  hasMergeConflicts = false,
  status,
}: PullRequestMergeStateInput): PullRequestMergeState {
  if (status === "merged") return "merged";
  if (status === "draft") return "draft";
  if (hasMergeConflicts || ciStatus === "failing") return "failing";
  if (ciStatus === "passing" && !canMerge) return "successful";
  if (canMerge) return "ready";
  return "in_progress";
}
