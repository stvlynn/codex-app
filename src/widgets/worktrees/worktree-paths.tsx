// Restored from ref/webview/assets/worktree-paths-Cm8IyBTl.js

import { I as normalizePath } from "../../entities/host/rpc-app-services.ts";

/**
 * Extracts the repository root path from a git worktree or .git path.
 *
 * - If the path contains `/.git/worktrees/`, strips everything from that
 *   segment onward.
 * - If the path ends with `/.git`, strips that suffix.
 * - Otherwise returns `null`.
 */
export function getRepoRootFromGitPath(
  gitPath: string | null | undefined,
): string | null {
  if (!gitPath) {
    return null;
  }

  const normalized = normalizePath(gitPath).replace(/\/+$/, "");
  const worktreesIndex = normalized.indexOf("/.git/worktrees/");

  if (worktreesIndex !== -1) {
    return normalized.slice(0, worktreesIndex);
  }

  if (normalized.endsWith("/.git")) {
    return normalized.slice(0, -5);
  }

  return null;
}

/**
 * Computes the two-segment worktree path under a repository root.
 *
 * Given a worktree path and a repository root, returns
 * `<repoRoot>/<firstSegment>/<secondSegment>` when the worktree path is
 * inside the repo root and has at least two nested segments.
 */
export function getWorktreeSubpath(
  worktreePath: string | null | undefined,
  repoRoot: string | null | undefined,
): string | null {
  if (!worktreePath || !repoRoot) {
    return null;
  }

  const normalizedWorktree = normalizePath(worktreePath).replace(/\/+$/, "");
  const normalizedRoot = normalizePath(repoRoot).replace(/\/+$/, "");
  const rootPrefix = `${normalizedRoot}/`;

  if (!normalizedWorktree.startsWith(rootPrefix)) {
    return null;
  }

  const relativeSegments = normalizedWorktree
    .slice(rootPrefix.length)
    .split("/")
    .filter(Boolean);

  if (relativeSegments.length < 2) {
    return null;
  }

  return `${normalizedRoot}/${relativeSegments[0]}/${relativeSegments[1]}`;
}
