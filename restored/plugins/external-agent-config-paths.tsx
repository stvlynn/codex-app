// Restored from ref/webview/assets/external-agent-config-paths-BKS908XB.js
// External agent config path utilities restored from the Codex webview bundle.

export function joinConfigPaths(
  basePath: string,
  ...segments: string[]
): string {
  const separator = getPathSeparator(basePath);
  return [
    basePath.replace(/[\\/]+$/, ""),
    ...segments.map((segment) => segment.replace(/^[\\/]+|[\\/]+$/g, "")),
  ].join(separator);
}

export function getConfigDir(path: string): string {
  const separator = getPathSeparator(path);
  const trimmed = path.replace(/[\\/]+$/, "");
  const lastSepIndex = trimmed.lastIndexOf(separator);
  if (lastSepIndex === -1) return ".";
  if (lastSepIndex === 0) return separator;
  const parentPath = trimmed.slice(0, lastSepIndex);
  return isWindowsDrive(parentPath) || isUncServerShare(parentPath)
    ? `${parentPath}${separator}`
    : parentPath;
}

function getPathSeparator(path: string): string {
  return path.includes("\\") ? "\\" : "/";
}

function isWindowsDrive(path: string): boolean {
  return /^[A-Za-z]:$/.test(path);
}

function isUncServerShare(path: string): boolean {
  return /^\\\\[^\\]+\\[^\\]+$/.test(path);
}
