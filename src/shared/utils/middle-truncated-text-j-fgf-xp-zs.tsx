// Restored from ref/webview/assets/middle-truncated-text-jFgfXPZs.js
// MiddleTruncatedText chunk restored from the Codex webview bundle.
import { useState, useCallback, useRef, useEffect } from "react";
import clsx from "clsx";
import { t as Tooltip } from "../ui/ui/tooltip-b.tsx";
import { useMeasuredTextCollapse } from "../utils/use-measured-text-collapse";
const ELLIPSIS = "\u2026";
const FALLBACK_FONT_SIZE_PX = 12;
export interface MiddleTruncatedTextProps {
  text: string;
  className?: string;
}
export function MiddleTruncatedText({
  text,
  className,
}: MiddleTruncatedTextProps): JSX.Element {
  const { setTextMeasurementRef, textMeasurement } = useMeasuredTextCollapse({
    fallbackFontSizePx: FALLBACK_FONT_SIZE_PX,
  });
  const displayText = computeMiddleTruncatedText(text, textMeasurement);
  const fitsWithoutTruncation = displayText === text;
  return (
    <Tooltip tooltipContent={text} disabled={fitsWithoutTruncation}>
      <span
        ref={setTextMeasurementRef}
        className={clsx(
          "block min-w-0 overflow-hidden whitespace-nowrap",
          className,
        )}
      >
        {displayText}
      </span>
    </Tooltip>
  );
}
function computeMiddleTruncatedText(
  text: string,
  measurement: {
    font: string;
    maxWidthPx: number;
  } | null,
): string {
  if (!measurement || text.length === 0 || measurement.maxWidthPx <= 0)
    return text;
  if (textFitsInSingleLine(text, measurement.font, measurement.maxWidthPx))
    return text;
  const graphemes = Array.from(text);
  let low = 0,
    high = graphemes.length - 1;
  let best = `${graphemes[0]}${ELLIPSIS}${graphemes[graphemes.length - 1]}`;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const prefix = Math.ceil(mid / 2);
    const suffix = Math.floor(mid / 2);
    const candidate = `${graphemes.slice(0, prefix).join("")}${ELLIPSIS}${graphemes.slice(graphemes.length - suffix).join("")}`;
    if (
      textFitsInSingleLine(candidate, measurement.font, measurement.maxWidthPx)
    ) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}
function textFitsInSingleLine(
  text: string,
  font: string,
  maxWidth: number,
): boolean {
  return (
    computeLineBreaks({
      text,
      font,
      maxWidth,
      whiteSpace: "pre-wrap",
    }) <= 1
  );
}
interface LineBreakOptions {
  text: string;
  font: string;
  maxWidth: number;
  whiteSpace?: "normal" | "pre-wrap";
}
function computeLineBreaks(options: LineBreakOptions): number {
  const { text, font, maxWidth, whiteSpace = "normal" } = options;
  const ctx = getCanvasContext();
  ctx.font = font;
  const segmenter = new Intl.Segmenter(undefined, {
    granularity: "grapheme",
  });
  const segments: {
    text: string;
    width: number;
    breakable: boolean;
  }[] = [];
  for (const seg of segmenter.segment(text)) {
    segments.push({
      text: seg.segment,
      width: measureWidth(seg.segment, ctx),
      breakable:
        /\s/.test(seg.segment) ||
        isCJK(seg.segment) ||
        /[-\u2013\u2014]/.test(seg.segment),
    });
  }
  let lines = 0,
    current = 0;
  for (const seg of segments) {
    if (seg.text === "\n") {
      lines++;
      current = 0;
      continue;
    }
    if (current + seg.width > maxWidth) {
      lines++;
      current = seg.width;
    } else {
      current += seg.width;
    }
  }
  return current > 0 || lines === 0 ? lines + 1 : lines;
}
function measureWidth(text: string, ctx: CanvasRenderingContext2D): number {
  const emojis = countEmojis(text);
  const raw = ctx.measureText(text).width;
  if (emojis === 0) return raw;
  return raw - emojis * getEmojiCorrection(ctx.font, ctx);
}
const EMOJI_RE = /\p{Emoji_Presentation}/u;
function countEmojis(text: string): number {
  let n = 0;
  for (const seg of new Intl.Segmenter(undefined, {
    granularity: "grapheme",
  }).segment(text)) {
    if (EMOJI_RE.test(seg.segment)) n++;
  }
  return n;
}
function isCJK(text: string): boolean {
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (
      (cp >= 0x4e00 && cp <= 0x9fff) ||
      (cp >= 0x3400 && cp <= 0x4dbf) ||
      (cp >= 0x3000 && cp <= 0x303f) ||
      (cp >= 0x3040 && cp <= 0x309f) ||
      (cp >= 0x30a0 && cp <= 0x30ff) ||
      (cp >= 0x3100 && cp <= 0x312f) ||
      (cp >= 0xac00 && cp <= 0xd7af) ||
      (cp >= 0xff00 && cp <= 0xffef)
    )
      return true;
  }
  return false;
}
const canvasCache = new Map<string, CanvasRenderingContext2D>();
function getCanvasContext(): CanvasRenderingContext2D {
  if (typeof OffscreenCanvas !== "undefined")
    return new OffscreenCanvas(1, 1).getContext("2d")!;
  if (typeof document !== "undefined")
    return document.createElement("canvas").getContext("2d")!;
  throw new Error("Canvas not available");
}
const emojiCorrectionCache = new Map<string, number>();
function getEmojiCorrection(
  font: string,
  ctx: CanvasRenderingContext2D,
): number {
  const cached = emojiCorrectionCache.get(font);
  if (cached !== undefined) return cached;
  const emojiWidth = ctx.measureText("\uD83D\uDE00").width;
  let correction = 0;
  if (emojiWidth > 16.5 && typeof document !== "undefined" && document.body) {
    const span = document.createElement("span");
    span.style.cssText = `font:${font};display:inline-block;visibility:hidden;position:absolute`;
    span.textContent = "\uD83D\uDE00";
    document.body.appendChild(span);
    const domWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    if (emojiWidth - domWidth > 0.5) correction = emojiWidth - domWidth;
  }
  emojiCorrectionCache.set(font, correction);
  return correction;
}
