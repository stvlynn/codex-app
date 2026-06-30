// Restored from ref/webview/assets/get-resize-observer-entry-size-DrKQ-0pS.js
// GetResizeObserverEntrySize chunk restored from the Codex webview bundle.

export interface ResizeObserverEntrySize {
  width: number;
  height: number;
}

export function getResizeObserverEntrySize(
  entry: ResizeObserverEntry,
): ResizeObserverEntrySize {
  if (entry.borderBoxSize) {
    const size = Array.isArray(entry.borderBoxSize)
      ? entry.borderBoxSize[0]
      : entry.borderBoxSize;
    return {
      width: size.inlineSize,
      height: size.blockSize,
    };
  }
  return {
    width: entry.contentRect.width,
    height: entry.contentRect.height,
  };
}
