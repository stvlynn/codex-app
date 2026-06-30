// Restored from ref/webview/assets/parse-diff-C81j2HIg.js
// parse-diff-C81j2HIg chunk restored from the Codex webview bundle.
export interface FileDiffThresholds {
  fileCount: number;
  totalChangedLines: number;
  totalChangedBytes: number;
}
export interface HunkStats {
  additions: number;
  deletions: number;
  changedBytes: number;
  maxChangedLineBytes: number;
}
export interface HunkContent {
  type: "context" | "change";
  additions: number;
  deletions: number;
  additionLineIndex: number;
  deletionLineIndex: number;
}
export interface Hunk {
  additionLines: number;
  deletionLines: number;
  additionCount: number;
  deletionCount: number;
  additionStart: number;
  deletionStart: number;
  hunkContent: HunkContent[];
}
export interface ParsedFile {
  type: string;
  name: string;
  prevName?: string;
  hunks: Hunk[];
  additionLines: string[];
  deletionLines: string[];
}
export interface ParsedDiffFile {
  metadata: ParsedFile;
  oldPath: string;
  newPath: string;
  additions: number;
  deletions: number;
  get changedBytes(): number;
  get maxChangedLineBytes(): number;
  firstAdditionLine: number | undefined;
  firstDeletionLine: number | undefined;
  isBinary: boolean;
  isGitlink: boolean;
}
export interface QuotedPathMatch {
  value: string;
  nextIndex: number;
  path: string;
  pathForUnquotedDiffHeader: string;
}
export interface DiffParseOptions {
  maxFiles?: number;
}
