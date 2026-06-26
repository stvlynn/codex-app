// Restored from ref/webview/assets/permission-request-model-BfKjp2UJ.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/permission-request-model-BfKjp2UJ.js
 *   Chunk: permission-request-model-BfKjp2UJ
 *   Classification: single-util
 *   Domain: utils
 *   Semantic path: utils/permission-request-model.ts
 */

// --- Types ---

export type FileSystemAccess = "read" | "write" | "deny";

export type SpecialPathKind =
  | "root"
  | "minimal"
  | "project_roots"
  | "tmpdir"
  | "slash_tmp"
  | "unknown";

export interface PathEntry {
  type: "path";
  path: string;
}

export interface GlobPatternEntry {
  type: "glob_pattern";
  pattern: string;
}

export interface SpecialPathEntry {
  type: "special";
  value: {
    kind: SpecialPathKind;
    subpath?: string;
    path?: string;
  };
}

export type FileSystemPath = PathEntry | GlobPatternEntry | SpecialPathEntry;

export interface FileSystemPermission {
  entries?: Array<{ path: FileSystemPath; access: FileSystemAccess }>;
  read?: string[];
  write?: string[];
}

export interface PermissionRequest {
  network?: unknown;
  fileSystem?: FileSystemPermission;
}

export type PermissionKind = "network" | "fileSystem";
export type FileSystemPermissionAccess = "read" | "write" | "readWrite";

export interface NetworkPermission {
  kind: "network";
}

export interface FileSystemPermissionResult {
  kind: "fileSystem";
  access: FileSystemPermissionAccess;
  paths: string[];
}

export type PermissionResult = NetworkPermission | FileSystemPermissionResult;

// --- Helpers ---

function resolveFileSystemPath(path: FileSystemPath): string {
  switch (path.type) {
    case "path":
      return path.path;
    case "glob_pattern":
      return path.pattern;
    case "special":
      return resolveSpecialPath(path.value);
  }
}

function resolveSpecialPath(value: {
  kind: SpecialPathKind;
  subpath?: string;
  path?: string;
}): string {
  switch (value.kind) {
    case "root":
      return "/";
    case "minimal":
      return ":minimal";
    case "project_roots":
      return value.subpath == null
        ? ":project_roots"
        : `:project_roots/${value.subpath}`;
    case "tmpdir":
      return ":tmpdir";
    case "slash_tmp":
      return "/tmp";
    case "unknown":
      return value.subpath == null
        ? (value.path ?? "")
        : `${value.path}/${value.subpath}`;
  }
}

// --- Main function ---

/**
 * Transforms a permission request into a flat list of permission results.
 * Groups file system permissions by access type (read, write, readWrite).
 */
export function buildPermissionResults(
  request: PermissionRequest,
): PermissionResult[] {
  const results: PermissionResult[] = [];

  if (request.network != null) {
    results.push({ kind: "network" });
  }

  if (request.fileSystem == null) {
    return results;
  }

  const readPaths = new Set<string>();
  const writePaths = new Set<string>();

  if (request.fileSystem.entries != null) {
    for (const entry of request.fileSystem.entries) {
      const resolved = resolveFileSystemPath(entry.path);
      switch (entry.access) {
        case "read":
          readPaths.add(resolved);
          break;
        case "write":
          writePaths.add(resolved);
          break;
        case "deny":
          break;
      }
    }
  } else {
    if (request.fileSystem.read != null) {
      for (const path of request.fileSystem.read) {
        readPaths.add(path);
      }
    }
    if (request.fileSystem.write != null) {
      for (const path of request.fileSystem.write) {
        writePaths.add(path);
      }
    }
  }

  const readArray = Array.from(readPaths);
  const writeArray = Array.from(writePaths);
  const readWritePaths = readArray.filter((p) => writePaths.has(p));
  const readOnlyPaths = readArray.filter((p) => !writePaths.has(p));
  const writeOnlyPaths = writeArray.filter((p) => !readPaths.has(p));

  if (readWritePaths.length > 0) {
    results.push({
      kind: "fileSystem",
      access: "readWrite",
      paths: readWritePaths,
    });
  }
  if (readOnlyPaths.length > 0) {
    results.push({
      kind: "fileSystem",
      access: "read",
      paths: readOnlyPaths,
    });
  }
  if (writeOnlyPaths.length > 0) {
    results.push({
      kind: "fileSystem",
      access: "write",
      paths: writeOnlyPaths,
    });
  }

  return results;
}
