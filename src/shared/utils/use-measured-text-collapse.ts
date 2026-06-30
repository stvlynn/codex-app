// Restored from ref/webview/assets/use-measured-text-collapse-BhNFLYvW.js
import React from "react";
import { useElementWidth } from "../utils/use-resize-observer";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type CollapseState = "uncollapsible" | "collapsed" | "expanded";
export interface TextMeasurement {
  collapsedHeightPx: number | null;
  contentHeightPx: number;
  element: HTMLElement;
  fallbackFontSizePx: number | undefined;
  font: string;
  lineHeightPx: number;
  maxWidthPx: number;
}
export interface UseMeasuredTextCollapseOptions {
  text: string;
  collapsedLineCount: number | null;
  fallbackFontSizePx?: number;
}
export interface MeasuredTextCollapseResult {
  setTextContentMeasurementRef: (element: HTMLElement | null) => void;
  collapseState: CollapseState;
  handleToggleExpansion: () => void;
}

// ------------------------------------------------------------------
// Main hook
// ------------------------------------------------------------------

export function useMeasuredTextCollapse(
  options: UseMeasuredTextCollapseOptions,
): MeasuredTextCollapseResult {
  const { text, collapsedLineCount, fallbackFontSizePx } = options;
  const [expandedText, setExpandedText] = React.useState<string | null>(null);
  const { setTextMeasurementRef, textMeasurement } = useTextMeasurement({
    collapsedLineCount,
    fallbackFontSizePx,
  });
  const collapseState: CollapseState =
    textMeasurement == null ||
    textMeasurement.collapsedHeightPx == null ||
    textMeasurement.contentHeightPx <= textMeasurement.collapsedHeightPx + 1
      ? "uncollapsible"
      : expandedText === text
        ? "expanded"
        : "collapsed";
  const handleToggleExpansion = () => {
    setExpandedText((prev) => (prev === text ? null : text));
  };
  return {
    setTextContentMeasurementRef: setTextMeasurementRef,
    collapseState,
    handleToggleExpansion,
  };
}

// ------------------------------------------------------------------
// Internal measurement hook
// ------------------------------------------------------------------

interface UseTextMeasurementOptions {
  collapsedLineCount: number | null;
  fallbackFontSizePx?: number;
}
interface UseTextMeasurementResult {
  setTextMeasurementRef: (element: HTMLElement | null) => void;
  textMeasurement: TextMeasurement | null;
}
function useTextMeasurement(
  options: UseTextMeasurementOptions,
): UseTextMeasurementResult {
  const { collapsedLineCount, fallbackFontSizePx } = options;
  const [measurement, setMeasurement] = React.useState<TextMeasurement | null>(
    null,
  );
  const updateMeasurement = React.useCallback(
    (element: HTMLElement, maxWidth: number) => {
      const newMeasurement = computeTextMeasurement(
        element,
        maxWidth,
        collapsedLineCount,
        fallbackFontSizePx,
      );
      setMeasurement((prev) =>
        measurementsEqual(prev, newMeasurement) ? prev : newMeasurement,
      );
    },
    [collapsedLineCount, fallbackFontSizePx],
  );
  const setRefFromResizeObserver = useElementWidth(
    React.useCallback(
      (entry: ResizeObserverEntry) => {
        const element = entry.target as HTMLElement;
        updateMeasurement(element, entry.contentRect.width);
      },
      [updateMeasurement],
    ),
  );
  const setTextMeasurementRef = React.useCallback(
    (element: HTMLElement | null) => {
      setRefFromResizeObserver(element);
      if (element != null) {
        updateMeasurement(element, element.clientWidth);
      }
    },
    [setRefFromResizeObserver, updateMeasurement],
  );
  return {
    setTextMeasurementRef,
    textMeasurement: measurement,
  };
}

// ------------------------------------------------------------------
// Measurement equality (to avoid unnecessary re-renders)
// ------------------------------------------------------------------

function measurementsEqual(
  a: TextMeasurement | null,
  b: TextMeasurement | null,
): boolean {
  if (a == null || b == null) return a === b;
  return (
    a.collapsedHeightPx === b.collapsedHeightPx &&
    a.contentHeightPx === b.contentHeightPx &&
    a.font === b.font &&
    a.lineHeightPx === b.lineHeightPx &&
    a.maxWidthPx === b.maxWidthPx &&
    a.element === b.element &&
    a.fallbackFontSizePx === b.fallbackFontSizePx
  );
}

// ------------------------------------------------------------------
// Compute text measurement from DOM element
// ------------------------------------------------------------------

function computeTextMeasurement(
  element: HTMLElement,
  maxWidth: number,
  collapsedLineCount: number | null,
  fallbackFontSizePx: number | undefined,
): TextMeasurement | null {
  const maxWidthPx = Math.floor(maxWidth);
  if (maxWidthPx <= 0) return null;
  const computedStyle = window.getComputedStyle(element);
  const fontSizePx = parseFontSize(computedStyle, fallbackFontSizePx);
  const lineHeightPx = parseLineHeight(computedStyle, fontSizePx);
  return {
    collapsedHeightPx:
      collapsedLineCount == null
        ? null
        : Math.ceil(lineHeightPx * collapsedLineCount),
    contentHeightPx: Math.ceil(element.scrollHeight),
    element,
    fallbackFontSizePx,
    font: buildFontString(computedStyle, fontSizePx),
    lineHeightPx,
    maxWidthPx,
  };
}

// ------------------------------------------------------------------
// CSS parsing helpers
// ------------------------------------------------------------------

function buildFontString(
  style: CSSStyleDeclaration,
  fontSizePx: number,
): string {
  return [
    style.fontStyle || "normal",
    style.fontVariant || "normal",
    style.fontWeight || "400",
    `${fontSizePx}px`,
    style.fontFamily || "sans-serif",
  ].join(" ");
}
function parseFontSize(
  style: CSSStyleDeclaration,
  fallback: number | undefined,
): number {
  const parsed = Number.parseFloat(style.fontSize);
  return Number.isFinite(parsed) ? parsed : (fallback ?? 16);
}
function parseLineHeight(
  style: CSSStyleDeclaration,
  fontSizePx: number,
): number {
  const parsed = Number.parseFloat(style.lineHeight);
  return Number.isFinite(parsed) ? parsed : fontSizePx * 1.5;
}
