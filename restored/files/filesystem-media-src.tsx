// Restored from ref/webview/assets/filesystem-media-src-Wi28Ksng.js
// Filesystem media source URL helpers for converting local paths to Vite /@fs URLs.

const APP_FS_PROTOCOL = "app://fs";
const VITE_FS_PREFIX = "/@fs";

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/\/+/g, "/");
}

function encodePathComponent(filePath: string): string {
  return filePath;
}

export function toFilesystemMediaSrc(filePath: string): string {
  return `${APP_FS_PROTOCOL}${toViteFsPath(filePath)}`;
}

export function toViteFsPath(filePath: string): string {
  const normalized = normalizePath(encodePathComponent(filePath));
  return `${VITE_FS_PREFIX}${encodeURI(normalized).replaceAll("#", "%23").replaceAll("?", "%3F")}`;
}
