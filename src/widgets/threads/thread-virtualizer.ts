// Restored from ref/webview/assets/thread-virtualizer-BihN83qB.js

export interface VirtualizerEntry {
  turnKey: string;
  estimatedHeightPx?: number;
}

export interface VirtualizerLayout {
  bottomOffsetsPx: number[];
  heightsPx: number[];
  topOffsetsPx: number[];
  totalHeightPx: number;
  turnIndexByKey: Map<string, number>;
  turnKeys: string[];
}

export interface BuildLayoutInput {
  entries: VirtualizerEntry[];
  gapPx: number;
  measuredHeightsByKey: Record<string, number>;
}

const DEFAULT_ROW_HEIGHT_PX = 280;

export function buildVirtualizerLayout({
  entries,
  gapPx,
  measuredHeightsByKey,
}: BuildLayoutInput): VirtualizerLayout {
  const topOffsetsPx: number[] = [];
  const heightsPx: number[] = [];
  const turnIndexByKey = new Map<string, number>();
  const turnKeys: string[] = [];
  let totalHeightPx = 0;

  for (const [index, entry] of entries.entries()) {
    const { turnKey } = entry;
    const height =
      measuredHeightsByKey[turnKey] ??
      entry.estimatedHeightPx ??
      DEFAULT_ROW_HEIGHT_PX;
    turnIndexByKey.set(turnKey, index);
    turnKeys.push(turnKey);
    topOffsetsPx.push(totalHeightPx);
    heightsPx.push(height);
    totalHeightPx += height;
    if (index < entries.length - 1) {
      totalHeightPx += gapPx;
    }
  }

  return {
    bottomOffsetsPx: topOffsetsPx.map(
      (offset, index) => totalHeightPx - offset - (heightsPx[index] ?? 0),
    ),
    heightsPx,
    topOffsetsPx,
    totalHeightPx,
    turnIndexByKey,
    turnKeys,
  };
}

export interface RangeInput {
  distanceFromBottomPx: number;
  layout: VirtualizerLayout;
  overscanCount: number;
  viewportHeightPx: number;
}

export interface RangeResult {
  startIndex: number;
  endIndex: number;
}

function findFirstOffsetAtLeast(offsets: number[], threshold: number): number {
  let low = 0;
  let high = offsets.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if ((offsets[mid] ?? 0) < threshold) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

function findLastOffsetAbove(
  offsets: number[],
  heights: number[],
  threshold: number,
): number {
  let low = 0;
  let high = offsets.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if ((offsets[mid] ?? 0) + (heights[mid] ?? 0) <= threshold) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

export function computeVisibleRange({
  distanceFromBottomPx,
  layout,
  overscanCount,
  viewportHeightPx,
}: RangeInput): RangeResult {
  if (layout.turnKeys.length === 0) {
    return { startIndex: 0, endIndex: 0 };
  }

  const scrollTop = Math.min(
    Math.max(0, distanceFromBottomPx),
    layout.totalHeightPx,
  );
  const viewportBottom = Math.min(
    scrollTop + Math.max(0, viewportHeightPx),
    layout.totalHeightPx,
  );
  const firstVisible = findFirstOffsetAtLeast(
    layout.bottomOffsetsPx,
    viewportBottom,
  );
  const lastVisible = findLastOffsetAbove(
    layout.bottomOffsetsPx,
    layout.heightsPx,
    scrollTop,
  );

  return {
    startIndex: Math.max(0, firstVisible - overscanCount),
    endIndex: Math.min(
      layout.turnKeys.length,
      Math.max(lastVisible, firstVisible + 1) + overscanCount,
    ),
  };
}

export interface AnchorRangeInput {
  anchorKey: string;
  layout: VirtualizerLayout;
  previousRange: RangeResult;
}

export function anchorVisibleRange({
  anchorKey,
  layout,
  previousRange,
}: AnchorRangeInput): RangeResult | null {
  const anchorIndex = layout.turnIndexByKey.get(anchorKey);
  if (anchorIndex == null) return null;
  return {
    startIndex: anchorIndex,
    endIndex: Math.min(
      layout.turnKeys.length,
      anchorIndex + previousRange.endIndex - previousRange.startIndex,
    ),
  };
}

export interface ScrollToItemInput {
  layout: VirtualizerLayout;
  turnKey: string;
  viewportHeightPx: number;
}

export function computeScrollToItemOffset({
  layout,
  turnKey,
  viewportHeightPx,
}: ScrollToItemInput): number | null {
  const index = layout.turnIndexByKey.get(turnKey);
  if (index == null) return null;
  return Math.max(
    0,
    (layout.bottomOffsetsPx[index] ?? 0) -
      viewportHeightPx / 2 +
      (layout.heightsPx[index] ?? 0) / 2,
  );
}
