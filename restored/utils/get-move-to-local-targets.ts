// Restored from ref/webview/assets/get-move-to-local-targets-DiY2bn2e.js
// Computes candidate local worktree roots when moving content out of a source worktree.

import {
  F as normalizeFileUrl,
  I as toPosixPath,
  P as joinPaths,
} from "../boundaries/rpc";

export interface RepoWorktreeEntry {
  root: string;
}

export interface MoveToLocalTarget {
  gitRoot: string;
  workspaceRoot: string;
}

export interface GetMoveToLocalTargetsOptions {
  cwd: string;
  sourceWorktreeRoot: string;
  repoWorktreeEntries: RepoWorktreeEntry[];
}

export function getMoveToLocalTargets({
  cwd,
  sourceWorktreeRoot,
  repoWorktreeEntries,
}: GetMoveToLocalTargetsOptions): MoveToLocalTarget[] {
  const relativeSubpath = computeRelativeSubpath({
    cwd,
    sourceWorktreeRoot,
  });
  const sourceNormalizedRoot = normalizeFileUrl(sourceWorktreeRoot);

  return (repoWorktreeEntries ?? [])
    .filter((entry) => normalizeFileUrl(entry.root) !== sourceNormalizedRoot)
    .map((entry) => {
      const workspaceRoot =
        relativeSubpath.length > 0
          ? joinPaths(entry.root, relativeSubpath)
          : entry.root;
      return {
        gitRoot: entry.root,
        workspaceRoot,
      };
    });
}

function computeRelativeSubpath({
  cwd,
  sourceWorktreeRoot,
}: {
  cwd: string;
  sourceWorktreeRoot: string;
}): string {
  const cwdPath = toPosixPath(cwd);
  const sourcePath = toPosixPath(sourceWorktreeRoot).replace(/\/+$/, "");
  const cwdRoot = normalizeFileUrl(cwd).replace(/\/+$/, "");
  const sourceRoot = normalizeFileUrl(sourceWorktreeRoot).replace(/\/+$/, "");

  if (cwdRoot === sourceRoot) return "";

  const sourceRootWithTrailingSlash = `${sourceRoot}/`;
  if (!cwdRoot.startsWith(sourceRootWithTrailingSlash)) return "";

  const sourcePathWithTrailingSlash = `${sourcePath}/`;
  return cwdPath.slice(sourcePathWithTrailingSlash.length);
}
