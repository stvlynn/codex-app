// Restored from ref/webview/assets/parse-diff-C81j2HIg.js
// parse-diff-C81j2HIg chunk restored from the Codex webview bundle.
import * as SourcePaths from "../../boundaries/src";
import { QuotedPathMatch } from "./types";
function getLineEnding(line: string): string {
  if (line.endsWith("\r\n")) return "\r\n";
  if (line.endsWith("\n")) return "\n";
  return "";
}
function parseQuotedGitDiffPath(
  lineBody: string,
  startIndex: number,
): QuotedPathMatch | null {
  return SourcePaths.srcHn(lineBody, startIndex) as QuotedPathMatch | null;
}
function unquoteDiffHeader(line: string): {
  line: string;
  paths: {
    oldPath: string;
    newPath: string;
  };
} | null {
  const lineEnding = getLineEnding(line);
  const body = line.slice(0, line.length - lineEnding.length).slice(11);
  const oldMatch = parseQuotedGitDiffPath(body, 0);
  if (oldMatch == null || body[oldMatch.nextIndex] !== " ") return null;
  const newMatch = parseQuotedGitDiffPath(body, oldMatch.nextIndex + 1);
  if (
    newMatch == null ||
    newMatch.nextIndex !== body.length ||
    !oldMatch.path.startsWith("a/") ||
    !newMatch.path.startsWith("b/")
  ) {
    return null;
  }
  return {
    line: `diff --git ${oldMatch.pathForUnquotedDiffHeader} ${newMatch.pathForUnquotedDiffHeader}${lineEnding}`,
    paths: {
      oldPath: oldMatch.path.slice(2),
      newPath: newMatch.path.slice(2),
    },
  };
}
function unquotePathLine(line: string, prefix: string): string | null {
  const lineEnding = getLineEnding(line);
  const body = line.slice(0, line.length - lineEnding.length);
  const match = parseQuotedGitDiffPath(body, prefix.length + 1);
  if (match == null) return null;
  return `${prefix} ${match.pathForUnquotedDiffHeader}${lineEnding}`;
}
export function normalizeQuotedPaths(diffText: string): {
  diff: string;
  pathsByFileIndex: Map<
    number,
    {
      oldPath: string;
      newPath: string;
    }
  >;
} {
  const pathsByFileIndex = new Map<
    number,
    {
      oldPath: string;
      newPath: string;
    }
  >();
  let fileIndex = -1;
  const diff = diffText
    .split(/(?<=\n)/)
    .map((line) => {
      if (line.startsWith("diff --git ")) {
        fileIndex += 1;
      }
      if (line.startsWith('diff --git "')) {
        const result = unquoteDiffHeader(line);
        if (result != null) {
          pathsByFileIndex.set(fileIndex, result.paths);
          return result.line;
        }
      }
      if (line.startsWith('--- "')) {
        const result = unquotePathLine(line, "---");
        if (result != null) return result;
      }
      if (line.startsWith('+++ "')) {
        const result = unquotePathLine(line, "+++");
        if (result != null) return result;
      }
      return line;
    })
    .join("");
  return {
    diff,
    pathsByFileIndex,
  };
}
