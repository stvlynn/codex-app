// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js
import * as codexRuntime from "../../boundaries/src";
import type {
  FindMatchingRemoteProjectPathParams,
  GitOrigin,
  OriginMatchParams,
  RemoteProject,
} from "./types";
export function findRemoteProjectByHostAndPath(
  projects: RemoteProject[],
  hostId: string,
  remotePath: string,
): RemoteProject | null {
  const normalizedTargetPath = codexRuntime.d(remotePath);
  return (
    projects.find(
      (project) =>
        project.hostId === hostId &&
        codexRuntime.d(project.remotePath) === normalizedTargetPath,
    ) ?? null
  );
}
export function findMatchingRemoteProjectPath({
  sourceWorkspaceRoot,
  sourceGitRoot,
  sourceGitOrigins,
  destinationWorkspaceRoots,
  destinationGitOrigins,
}: FindMatchingRemoteProjectPathParams): string | null {
  const sourceOrigin = findGitOriginForDir(
    sourceWorkspaceRoot,
    sourceGitOrigins,
  );
  return (
    destinationWorkspaceRoots.find((destinationWorkspaceRoot) => {
      const destinationOrigin = findGitOriginForDir(
        destinationWorkspaceRoot,
        destinationGitOrigins,
      );
      return pathsMatchAcrossOrigins({
        sourceWorkspaceRoot,
        sourceGitRoot,
        sourceGitOriginUrl: sourceOrigin?.originUrl ?? null,
        destinationWorkspaceRoot,
        destinationGitRoot: destinationOrigin?.root ?? null,
        destinationGitOriginUrl: destinationOrigin?.originUrl ?? null,
      });
    }) ?? null
  );
}
function pathsMatchAcrossOrigins({
  sourceWorkspaceRoot,
  sourceGitRoot,
  sourceGitOriginUrl,
  destinationWorkspaceRoot,
  destinationGitRoot,
  destinationGitOriginUrl,
}: OriginMatchParams): boolean {
  const relativeSourcePath = getRelativeWorkspacePath(
    sourceWorkspaceRoot,
    sourceGitRoot,
  );
  const sourceRepoKey = normalizeGitUrl(sourceGitOriginUrl);
  return (
    relativeSourcePath != null &&
    sourceRepoKey != null &&
    normalizeGitUrl(destinationGitOriginUrl) === sourceRepoKey &&
    getRelativeWorkspacePath(destinationWorkspaceRoot, destinationGitRoot) ===
      relativeSourcePath
  );
}
function getRelativeWorkspacePath(
  workspaceRoot: string | null,
  gitRoot: string | null,
): string | null {
  if (workspaceRoot == null || gitRoot == null) {
    return null;
  }
  const normalizedWorkspace = sanitizeAbsolutePath(workspaceRoot);
  const normalizedGitRoot = sanitizeAbsolutePath(gitRoot);
  if (normalizedWorkspace === normalizedGitRoot) {
    return "";
  }
  const gitRootPrefix =
    normalizedGitRoot === "/" ? normalizedGitRoot : `${normalizedGitRoot}/`;
  return normalizedWorkspace.startsWith(gitRootPrefix)
    ? normalizedWorkspace.slice(gitRootPrefix.length)
    : null;
}
function findGitOriginForDir(
  dir: string | null,
  origins: GitOrigin[] | undefined,
): GitOrigin | null {
  if (dir == null) {
    return null;
  }
  const normalizedDir = sanitizeAbsolutePath(dir);
  return (
    origins?.find(
      (origin) => sanitizeAbsolutePath(origin.dir) === normalizedDir,
    ) ?? null
  );
}
function normalizeGitUrl(url: string | null): string | null {
  const parsed = url == null ? null : codexRuntime.Lt(url);
  return parsed == null
    ? null
    : `${parsed.host}/${parsed.owner}/${parsed.repo}`.toLowerCase();
}
function sanitizeAbsolutePath(path: string): string {
  const normalized = codexRuntime.jr(path.trim()).replace(/\/+/g, "/");
  return normalized === "/" ? normalized : normalized.replace(/\/+$/, "");
}
