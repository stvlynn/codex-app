// Restored from ref/webview/assets/pull-request-status-utils-ClWM1OCD.js
// PullRequestStatusUtils chunk restored from the Codex webview bundle.

export type PullRequestStatus = "merged" | "open" | "draft" | "closed";

export interface PullRequestRef {
  merged: boolean;
  state: string;
  draft: boolean;
}

export function getPullRequestStatus(pr: PullRequestRef): PullRequestStatus {
  if (pr.merged) return "merged";
  switch (pr.state.toUpperCase()) {
    case "OPEN":
      return pr.draft ? "draft" : "open";
    case "MERGED":
      return "merged";
    case "CLOSED":
      return "closed";
    default:
      return "closed";
  }
}

export function parsePullRequestNumber(url: string): number | null {
  const match = /\/pull\/(\d+)(?:$|[/?#])/.exec(url);
  return match ? Number(match[1]) : null;
}
