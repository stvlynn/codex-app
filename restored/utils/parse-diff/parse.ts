// Restored from ref/webview/assets/parse-diff-C81j2HIg.js
// parse-diff-C81j2HIg chunk restored from the Codex webview bundle.
import * as ParsePatchFiles from "../../boundaries/pierre/parse-patch-files";
import { useHostConfigWt as hostConfigValue } from "../../boundaries/host-config";
import { vscodeApiH as logger } from "../../boundaries/tanstack-query/vscode";
import { sumBy } from "../../boundaries/lodash/sum-by";
import { createLazyChangedBytesGetter } from "./changed-bytes";
import { normalizeQuotedPaths } from "./quoted-paths";
import { DiffParseOptions, ParsedDiffFile, ParsedFile } from "./types";
const LARGE_DIFF_THRESHOLD_CHARS = 200000;
const DIFF_CACHE_SIZE = 50;
let diffCounter = 0;
const diffCache = new Map<string, Map<string, ParsedDiffFile[]>>();
function findBinaryFileIndexes(diffText: string): Set<number> {
  const indexes = new Set<number>();
  let fileIndex = -1;
  for (const line of diffText.split(/\r?\n/)) {
    if (line.startsWith("diff --git ")) {
      fileIndex += 1;
      continue;
    }
    if (line.startsWith("GIT binary patch") && fileIndex >= 0) {
      indexes.add(fileIndex);
    }
  }
  return indexes;
}
function findGitlinkFileIndexes(diffText: string): Set<number> {
  const indexes = new Set<number>();
  let fileIndex = -1;
  for (const line of diffText.split(/\r?\n/)) {
    if (line.startsWith("diff --git ")) {
      fileIndex += 1;
      continue;
    }
    if (
      fileIndex >= 0 &&
      (/^(?:new file mode|deleted file mode|old mode|new mode) 160000$/.test(
        line,
      ) ||
        /^index [0-9a-f]+\.\.[0-9a-f]+ 160000$/.test(line))
    ) {
      indexes.add(fileIndex);
    }
  }
  return indexes;
}
function applyExplicitPaths(
  file: ParsedFile,
  paths?: {
    oldPath: string;
    newPath: string;
  },
): ParsedFile {
  if (paths == null) return file;
  if (file.type === "rename-pure" || file.type === "rename-changed") {
    return {
      ...file,
      name: paths.newPath,
      prevName: paths.oldPath,
    };
  }
  return {
    ...file,
    name: paths.newPath,
  };
}
function resolveOldAndNewPaths(file: ParsedFile): {
  oldPath: string;
  newPath: string;
} {
  return {
    oldPath:
      file.type === "new" ? hostConfigValue : (file.prevName ?? file.name),
    newPath: file.type === "deleted" ? hostConfigValue : file.name,
  };
}
export function parseDiff(
  diffText: string,
  { maxFiles }: DiffParseOptions = {},
): ParsedDiffFile[] {
  const cacheKey =
    diffText.length <= LARGE_DIFF_THRESHOLD_CHARS ? `${maxFiles ?? "all"}` : "";
  let cache: Map<string, ParsedDiffFile[]> | undefined;
  if (cacheKey) {
    cache = diffCache.get(diffText);
    const cached = cache?.get(cacheKey);
    if (cached) return cached;
  }
  const binaryFileIndexes = findBinaryFileIndexes(diffText);
  const gitlinkFileIndexes = findGitlinkFileIndexes(diffText);
  const { diff, pathsByFileIndex } = normalizeQuotedPaths(diffText);
  let parsedPatches: Array<{
    files: ParsedFile[];
  }>;
  try {
    parsedPatches = ParsePatchFiles.parsePatchFilesT(
      diff,
      `codex-diff-${diffCounter++}`,
    ) as Array<{
      files: ParsedFile[];
    }>;
  } catch (error) {
    logger.error("Failed to parse diff", {
      safe: {},
      sensitive: {
        error,
      },
    });
    parsedPatches = [];
  }
  const results: ParsedDiffFile[] = [];
  let fileIndex = 0;
  for (const patch of parsedPatches) {
    for (const file of patch.files) {
      if (maxFiles !== undefined && results.length >= maxFiles) {
        return results;
      }
      try {
        const patchedFile = applyExplicitPaths(
          file,
          pathsByFileIndex.get(fileIndex),
        );
        const { oldPath, newPath } = resolveOldAndNewPaths(patchedFile);
        const changedBytesGetter = createLazyChangedBytesGetter(patchedFile);
        const hunks = patchedFile.hunks;
        const additions = sumBy(hunks, (hunk) => hunk.additionLines);
        const deletions = sumBy(hunks, (hunk) => hunk.deletionLines);
        const firstAdditionLine = hunks.find(
          (hunk) => hunk.additionCount > 0,
        )?.additionStart;
        const firstDeletionLine = hunks.find(
          (hunk) => hunk.deletionLines > 0,
        )?.deletionStart;
        results.push({
          metadata: patchedFile,
          oldPath,
          newPath,
          additions,
          deletions,
          get changedBytes() {
            return changedBytesGetter().changedBytes;
          },
          get maxChangedLineBytes() {
            return changedBytesGetter().maxChangedLineBytes;
          },
          firstAdditionLine,
          firstDeletionLine,
          isBinary: binaryFileIndexes.has(fileIndex),
          isGitlink: gitlinkFileIndexes.has(fileIndex),
        });
      } catch (error) {
        logger.error("Failed to parse diff", {
          safe: {},
          sensitive: {
            name: file.name,
            error,
          },
        });
      }
      fileIndex += 1;
    }
  }
  if (cacheKey) {
    const map = cache ?? new Map();
    map.set(cacheKey, results);
    diffCache.set(diffText, map);
    if (diffCache.size > DIFF_CACHE_SIZE) {
      const firstKey = diffCache.keys().next().value;
      if (firstKey) diffCache.delete(firstKey);
    }
  }
  return results;
}
