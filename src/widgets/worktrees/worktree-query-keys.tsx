// Restored from ref/webview/assets/worktree-query-keys-CAJzb-Nd.js
// Worktree query-key factories restored from the Codex webview bundle.

export function getWorktreesQueryKey(projectPath: string): string[] {
  return ["git", projectPath, "codex-worktrees"];
}

export function getWorktreeSnapshotRefQueryKey(
  projectPath: string,
  snapshotRef?: string | null,
): string[] {
  const base = ["git", projectPath, "worktree-snapshot-ref"];
  return snapshotRef ? [...base, snapshotRef] : base;
}
