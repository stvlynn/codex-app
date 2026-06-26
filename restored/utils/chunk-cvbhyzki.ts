// Restored from ref/webview/assets/chunk-CVBHYZKI-D5c0MJ_k.js
// ChunkCVBHYZKI chunk restored from the Codex webview bundle.

import { chunkAGHRB4JFN } from "./esbuild-runtime-umd-b";
export interface FlowchartSubGraphTitleMargin {
  top?: number;
  bottom?: number;
}
export interface FlowchartConfig {
  flowchart?: {
    subGraphTitleMargin?: FlowchartSubGraphTitleMargin;
  };
}
export interface SubGraphTitleMargins {
  subGraphTitleTopMargin: number;
  subGraphTitleBottomMargin: number;
  subGraphTitleTotalMargin: number;
}

/**
 * Extracts sub-graph title margins from a flowchart configuration.
 */
export const getSubGraphTitleMargins = chunkAGHRB4JFN(
  (config: FlowchartConfig): SubGraphTitleMargins => {
    const topMargin = config?.flowchart?.subGraphTitleMargin?.top ?? 0;
    const bottomMargin = config?.flowchart?.subGraphTitleMargin?.bottom ?? 0;
    return {
      subGraphTitleTopMargin: topMargin,
      subGraphTitleBottomMargin: bottomMargin,
      subGraphTitleTotalMargin: topMargin + bottomMargin,
    };
  },
  "getSubGraphTitleMargins",
);
