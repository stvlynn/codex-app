// Restored from ref/webview/assets/file-diff-KtBt16gK.js
// FileDiff chunk restored from the Codex webview bundle.
//
// This is a large virtualized file-diff rendering component (82KB original).
// The full implementation depends on many internal Shiki highlighting APIs
// that are not fully restored. This facade preserves the public API surface.

import React from "react";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface DiffMetrics {
  hunkLineCount: number;
  lineHeight: number;
  diffHeaderHeight: number;
  spacing: number;
}
export interface DiffLine {
  type: "context" | "change";
  lines?: number;
  additions?: number;
  deletions?: number;
  additionLineIndex?: number;
  deletionLineIndex?: number;
}
export interface DiffHunk {
  collapsedBefore: number;
  splitLineCount: number;
  splitLineStart: number;
  unifiedLineCount: number;
  unifiedLineStart: number;
  additionCount: number;
  additionStart: number;
  additionLines: number;
  deletionCount: number;
  deletionStart: number;
  deletionLines: number;
  deletionLineIndex: number;
  additionLineIndex: number;
  hunkContent: DiffLine[];
  hunkContext: string;
  hunkSpecs: string;
  noEOFCRAdditions: boolean;
  noEOFCRDeletions: boolean;
}
export interface FileDiff {
  name: string;
  prevName?: string;
  type: "change" | "new" | "deleted" | "rename-pure" | "rename-changed";
  hunks: DiffHunk[];
  splitLineCount: number;
  unifiedLineCount: number;
  isPartial: boolean;
  additionLines: string[];
  deletionLines: string[];
  cacheKey: string;
  mode?: string;
  prevMode?: string;
  prevObjectId?: string;
  newObjectId?: string;
}
export interface ParseDiffOptions {
  cacheKey?: string;
  isGitDiff?: boolean;
  oldFile?: {
    contents: string;
  };
  newFile?: {
    contents: string;
  };
  throwOnError?: boolean;
}
export interface FileDiffOptions {
  diffStyle?: "split" | "unified";
  overflow?: "scroll" | "hidden";
  collapsed?: boolean;
  disableLineNumbers?: boolean;
  disableFileHeader?: boolean;
  diffIndicators?: "bars" | "symbols" | "classic";
  hunkSeparators?: "line-info" | "custom" | ((hunkIndex: number) => string);
  expandUnchanged?: boolean;
  collapsedContextThreshold?: number;
  unsafeCSS?: string;
  controlledSelection?: boolean;
  contentEditable?: boolean;
  useTokenTransformer?: boolean;
  enableGutterUtility?: boolean;
  enableLineSelection?: boolean;
  lineHoverHighlight?: string;
  lineDiffType?: string;
  onGutterUtilityClick?: () => void;
  onPostRender?: (element: HTMLElement) => void;
  renderCustomHeader?: (fileDiff: FileDiff) => React.ReactNode;
  renderHeaderPrefix?: (fileDiff: FileDiff) => React.ReactNode;
  renderHeaderMetadata?: (fileDiff: FileDiff) => React.ReactNode;
  renderGutterUtility?: (getHoveredLine: () => unknown) => React.ReactNode;
  renderAnnotation?: (annotation: unknown) => React.ReactNode;
  parseDiffOptions?: ParseDiffOptions;
}
export interface FileDiffMetrics {
  hunkLineCount: number;
  lineHeight: number;
  diffHeaderHeight: number;
  spacing: number;
}
export interface LineAnnotation {
  id: string;
  lineNumber: number;
  content: string;
}
export interface FileDiffComponentProps {
  fileDiff: FileDiff;
  className?: string;
  hunkSeparators?: "line-info" | "custom" | ((hunkIndex: number) => string);
  isLoadingFullContent?: boolean;
  lineAnnotations?: LineAnnotation[];
  lineDiffType?: string;
  metrics?: FileDiffMetrics;
  onGutterUtilityClick?: () => void;
  onPostRender?: (element: HTMLElement) => void;
  renderAnnotation?: (annotation: LineAnnotation) => React.ReactNode;
  selectedLines?: Set<number>;
  overflow?: "scroll" | "hidden";
  useReviewLineInfoSeparators?: boolean;
  [key: string]: unknown;
}

// ------------------------------------------------------------------
// Parse diff
// ------------------------------------------------------------------

/**
 * Parse a unified diff patch into a structured FileDiff object.
 */
export function parseDiff(
  patchContent: string,
  options?: ParseDiffOptions,
): FileDiff | null {
  // Full implementation requires Shiki highlighting internals.
  // This facade preserves the API for consumers.
  return null;
}

// ------------------------------------------------------------------
// FileDiff component
// ------------------------------------------------------------------

/**
 * Render a virtualized file diff with syntax highlighting.
 */
export function FileDiffComponent(
  props: FileDiffComponentProps,
): React.ReactElement {
  // Full implementation requires Shiki highlighting internals.
  // This facade preserves the API for consumers.
  return React.createElement("div", {
    className: props.className,
    "data-file-diff": true,
  });
}

// Re-export parseDiff as the original chunk's default parser
export { parseDiff as fileDiffN };

// Aliases used by consumer checkpoints
export declare const fileDiffT: any;

// Additional aliases exported for consumers mapped via IMPORT_MAP
export const n: any = undefined;
export const t: any = undefined;
