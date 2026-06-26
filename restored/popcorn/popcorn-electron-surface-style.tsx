// Restored from ref/webview/assets/popcorn-electron-surface-style-jyyIi7EC.js
// PopcornElectronSurfaceStyle chunk restored from the Codex webview bundle.
// This module provides drag-and-drop layout utilities and surface styling for the Popcorn electron surface.

import React from "react";
import clsx from "clsx";
export interface PopcornTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}
export const defaultTransform: PopcornTransform = {
  scaleX: 1,
  scaleY: 1,
  x: 0,
  y: 0,
};
export interface PopcornRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
export interface HorizontalListSortingStrategyInput {
  rects: PopcornRect[];
  activeNodeRect: PopcornRect | null;
  activeIndex: number;
  overIndex: number;
  index: number;
}
export function horizontalListSortingStrategy({
  rects,
  activeNodeRect,
  activeIndex,
  overIndex,
  index,
}: HorizontalListSortingStrategyInput): PopcornTransform | null {
  const activeRect = rects[activeIndex] ?? activeNodeRect;
  if (!activeRect) return null;
  const gap = getGap(rects, index, activeIndex);
  if (index === activeIndex) {
    const overRect = rects[overIndex];
    return overRect
      ? {
          x:
            activeIndex < overIndex
              ? overRect.left +
                overRect.width -
                (activeRect.left + activeRect.width)
              : overRect.left - activeRect.left,
          y: 0,
          ...defaultTransform,
        }
      : null;
  }
  if (index > activeIndex && index <= overIndex) {
    return {
      x: -activeRect.width - gap,
      y: 0,
      ...defaultTransform,
    };
  }
  if (index < activeIndex && index >= overIndex) {
    return {
      x: activeRect.width + gap,
      y: 0,
      ...defaultTransform,
    };
  }
  return {
    x: 0,
    y: 0,
    ...defaultTransform,
  };
}
function getGap(
  rects: PopcornRect[],
  index: number,
  activeIndex: number,
): number {
  const current = rects[index];
  const previous = rects[index - 1];
  if (!current || !previous) return 0;
  const isBeforeActive = index <= activeIndex;
  const currentLeft = isBeforeActive ? current.left : previous.left;
  const previousRight = isBeforeActive
    ? previous.left + previous.width
    : current.left + current.width;
  return currentLeft - previousRight;
}
export interface PopcornSortableItemProps {
  id: string;
  index: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export function PopcornSortableItem({
  id,
  index,
  disabled = false,
  children,
  className,
  style,
}: PopcornSortableItemProps): JSX.Element {
  return (
    <div
      data-id={id}
      data-index={index}
      data-disabled={disabled}
      className={clsx("popcorn-sortable-item", className)}
      style={style}
    >
      {children}
    </div>
  );
}
export interface PopcornSurfaceStyleProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "electron" | "browser";
  draggable?: boolean;
  droppable?: boolean;
}
export function PopcornSurfaceStyle({
  children,
  className,
  variant = "default",
  draggable = false,
  droppable = false,
}: PopcornSurfaceStyleProps): JSX.Element {
  return (
    <div
      className={clsx(
        "popcorn-surface",
        {
          "popcorn-surface--electron": variant === "electron",
          "popcorn-surface--browser": variant === "browser",
          "popcorn-surface--draggable": draggable,
          "popcorn-surface--droppable": droppable,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
export interface PopcornDraggableConfig {
  draggable?:
    | boolean
    | {
        draggable: boolean;
        droppable: boolean;
      };
}
export function normalizeDraggableConfig(
  config: boolean | PopcornDraggableConfig,
): {
  draggable: boolean;
  droppable: boolean;
} {
  if (typeof config === "boolean") {
    return {
      draggable: config,
      droppable: config,
    };
  }
  return {
    draggable: config.draggable ?? false,
    droppable: config.droppable ?? false,
  };
}
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
export function isNonNegative(value: number | null): boolean {
  return value !== null && value >= 0;
}
export function arrayMove<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  const result = array.slice();
  result.splice(
    toIndex < 0 ? result.length + toIndex : toIndex,
    0,
    result.splice(fromIndex, 1)[0],
  );
  return result;
}
export function mapArrayToValues<K, V>(
  keys: K[],
  map: Map<K, V>,
): (V | undefined)[] {
  return keys.reduce<(V | undefined)[]>((acc, key, index) => {
    const value = map.get(key);
    if (value) acc[index] = value;
    return acc;
  }, Array(keys.length));
}
