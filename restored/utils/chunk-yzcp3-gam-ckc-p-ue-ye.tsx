// Restored from ref/webview/assets/chunk-YZCP3GAM-CkcPUeYE.js
// Mermaid SVG drawing utilities for rendering diagram elements.

import type { Selection } from "d3-selection";

// Inline sanitize-url to avoid boundary dependency
type UrlValue = string | null | undefined;
function sanitizeUrl(url: UrlValue): string {
  if (url == null) return "";
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "";
  return trimmed;
}
const NEWLINE_REPLACEMENT = "\n";
type D3Selection = Selection<SVGGElement, unknown, null, undefined>;
type D3RectSelection = Selection<SVGRectElement, unknown, null, undefined>;
type D3TextSelection = Selection<SVGTextElement, unknown, null, undefined>;
type D3DivSelection = Selection<HTMLDivElement, unknown, null, undefined>;
export interface RectOptions {
  x: number;
  y: number;
  fill: string;
  stroke: string;
  width: number;
  height: number;
  name?: string;
  rx?: number;
  ry?: number;
  attrs?: Record<string, string | number>;
  class?: string;
}
export function drawRect(
  container: D3Selection,
  options: RectOptions,
): D3RectSelection {
  const rect = container.append("rect");
  rect.attr("x", options.x);
  rect.attr("y", options.y);
  rect.attr("fill", options.fill);
  rect.attr("stroke", options.stroke);
  rect.attr("width", options.width);
  rect.attr("height", options.height);
  if (options.name) rect.attr("name", options.name);
  if (options.rx) rect.attr("rx", options.rx);
  if (options.ry) rect.attr("ry", options.ry);
  if (options.attrs !== undefined) {
    for (const key in options.attrs) {
      rect.attr(key, options.attrs[key]);
    }
  }
  if (options.class) rect.attr("class", options.class);
  return rect;
}
export interface BackgroundRectOptions {
  startx: number;
  starty: number;
  stopx: number;
  stopy: number;
  fill: string;
  stroke: string;
}
export function drawBackgroundRect(
  container: D3Selection,
  options: BackgroundRectOptions,
): void {
  drawRect(container, {
    x: options.startx,
    y: options.starty,
    width: options.stopx - options.startx,
    height: options.stopy - options.starty,
    fill: options.fill,
    stroke: options.stroke,
    class: "rect",
  }).lower();
}
export interface TextOptions {
  x: number;
  y: number;
  text: string;
  anchor: string;
  class?: string;
  textMargin: number;
}
export function drawText(
  container: D3Selection,
  options: TextOptions,
): D3TextSelection {
  const sanitizedText = options.text.replace(NEWLINE_REPLACEMENT, " ");
  const text = container.append("text");
  text.attr("x", options.x);
  text.attr("y", options.y);
  text.attr("class", "legend");
  text.style("text-anchor", options.anchor);
  if (options.class) text.attr("class", options.class);
  const tspan = text.append("tspan");
  tspan.attr("x", options.x + options.textMargin * 2);
  tspan.text(sanitizedText);
  return text;
}
export function drawImage(
  container: D3Selection,
  x: number,
  y: number,
  href: string,
): void {
  const image = container.append("image");
  image.attr("x", x);
  image.attr("y", y);
  const sanitized = sanitizeUrl(href);
  image.attr("xlink:href", sanitized);
}
export function drawEmbeddedImage(
  container: D3Selection,
  x: number,
  y: number,
  href: string,
): void {
  const use = container.append("use");
  use.attr("x", x);
  use.attr("y", y);
  const sanitized = sanitizeUrl(href);
  use.attr("xlink:href", `#${sanitized}`);
}
export interface NoteRectDefaults {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  anchor: string;
  rx: number;
  ry: number;
}
export function getNoteRectDefaults(): NoteRectDefaults {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: "#EDF2AE",
    stroke: "#666",
    anchor: "start",
    rx: 0,
    ry: 0,
  };
}
export interface TextObjDefaults {
  x: number;
  y: number;
  width: number;
  height: number;
  "text-anchor": string;
  style: string;
  textMargin: number;
  rx: number;
  ry: number;
  tspan: boolean;
}
export function getTextObjDefaults(): TextObjDefaults {
  return {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    "text-anchor": "start",
    style: "#666",
    textMargin: 0,
    rx: 0,
    ry: 0,
    tspan: true,
  };
}
export function createTooltip(): D3DivSelection {
  // d3 selection for tooltip - using any since d3 is vendored
  const d3Select = (sel: string) => ({}) as D3DivSelection;
  let tooltip = d3Select(".mermaidTooltip");
  // @ts-expect-error d3 vendored
  if (tooltip.empty?.()) {
    // @ts-expect-error d3 vendored
    tooltip = d3Select("body")
      .append("div")
      .attr("class", "mermaidTooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("text-align", "center")
      .style("max-width", "200px")
      .style("padding", "2px")
      .style("font-size", "12px")
      .style("background", "#ffffde")
      .style("border", "1px solid #333")
      .style("border-radius", "2px")
      .style("pointer-events", "none")
      .style("z-index", "100");
  }
  return tooltip;
}
