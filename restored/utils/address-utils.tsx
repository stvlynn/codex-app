// Restored from ref/webview/assets/address-utils-D9uhGifl.js
// Spreadsheet address/cell-reference utilities restored from the Codex webview bundle.

const DEFAULT_FONT_SIZE = 8.43;
const DEFAULT_ROW_HEIGHT = 7;
const HORIZONTAL_PADDING_RATIO = 0.1;
const VERTICAL_PADDING_RATIO = 0;
const MIN_HORIZONTAL_PADDING = 2;
const MIN_VERTICAL_PADDING = 4 / 3;
const PIXELS_PER_INCH = 96;
const POINTS_PER_INCH = 72;

export const DEFAULT_FONT_SIZE_PT = 8.43;

function getFontSizeOrDefault(fontSize?: number): number {
  return fontSize && fontSize > 0 ? fontSize : DEFAULT_ROW_HEIGHT;
}

function getCeiledFontSize(fontSize?: number): number {
  return Math.ceil(getFontSizeOrDefault(fontSize));
}

export function getColumnWidth(
  columnWidth?: number | null,
  fontSize?: number,
): number {
  return columnWidth == null || columnWidth <= 0
    ? 64
    : columnWidth * getCeiledFontSize(fontSize);
}

export function getRowHeight(
  rowHeight?: number | null,
  fontSize?: number,
): number {
  if (!Number.isFinite(rowHeight ?? 0) || (rowHeight ?? 0) <= 0) return 0;
  const rawHeight = (rowHeight ?? 0) / getCeiledFontSize(fontSize);
  return Math.round(rawHeight * 100) / 100;
}

export function pointsToPixels(points?: number | null): number {
  return (
    ((points == null || points === 0 ? 15 : points) * PIXELS_PER_INCH) /
    POINTS_PER_INCH
  );
}

export function pixelsToPoints(pixels?: number | null): number {
  return Number.isFinite(pixels ?? 0)
    ? ((pixels ?? 0) * POINTS_PER_INCH) / PIXELS_PER_INCH
    : 15;
}

export function getCellPadding(fontSize?: number): {
  padLr: number;
  padTb: number;
} {
  const effectiveSize = fontSize && fontSize > 0 ? fontSize : 11;
  return {
    padLr: Math.max(
      MIN_HORIZONTAL_PADDING,
      Math.floor(effectiveSize * HORIZONTAL_PADDING_RATIO),
    ),
    padTb: Math.max(
      MIN_VERTICAL_PADDING,
      Math.floor(effectiveSize * VERTICAL_PADDING_RATIO),
    ),
  };
}

function numberToColumnLetters(colIndex: number): string {
  let result = ``;
  for (colIndex += 1; colIndex; ) {
    const remainder = (colIndex - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    colIndex = Math.floor((colIndex - remainder) / 26);
  }
  return result;
}

function columnLettersToNumber(letters: string): number {
  const match = letters.match(/[A-Z]+/);
  if (!match) return 0;
  let result = 0;
  for (const char of match[0]) {
    result = result * 26 + (char.charCodeAt(0) - 64);
  }
  return result - 1;
}

function rowNumberFromRef(ref: string): number {
  const match = ref.match(/\d+/);
  return match ? parseInt(match[0], 10) - 1 : 0;
}

export function colorToRgba(colorCode?: number | null): string {
  const hex = String(colorCode).replace(/^0x/i, ``);
  if (hex.length === 8) {
    return `rgba(${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${parseInt(hex.slice(6, 8), 16)}, ${(1).toFixed(3)})`;
  }
  if (hex.length === 6) {
    return `#${hex}`;
  }
  return `#ffffff`;
}

export function getIndexedColor(index?: number | null): string | undefined {
  if (index == null) return undefined;
  if (index === 64) return `#000000`;
  const palette =
    `#000000.#FFFFFF.#FF0000.#00FF00.#0000FF.#FFFF00.#FF00FF.#00FFFF.#000000.#FFFFFF.#FF0000.#00FF00.#0000FF.#FFFF00.#FF00FF.#00FFFF.#800000.#008000.#000080.#808000.#800080.#008080.#C0C0C0.#808080.#9999FF.#993366.#FFFFCC.#CCFFFF.#660066.#FF8080.#0066CC.#CCCCFF.#000080.#FF00FF.#FFFF00.#00FFFF.#800080.#800000.#008080.#0000FF.#00CCFF.#CCFFFF.#CCFFCC.#FFFF99.#99CCFF.#FF99CC.#CC99FF.#FFCC99.#3366FF.#33CCCC.#99CC00.#FFCC00.#FF9900.#FF6600.#666699.#969696.#003366.#339966.#003300.#333300.#993300.#993366.#333399.#333333`.split(
      `.`,
    );
  return palette[index];
}

function parseCellRange(
  rangeStr: string,
): { ref: string; bounds: CellBounds } | null {
  const normalized = normalizeCellReference(rangeStr);
  if (!normalized) return null;
  const parts = normalized.split(`:`);
  const startRef = parts[0];
  if (!startRef) return null;
  const endRef = parts[1] ?? startRef;
  const startRow = rowNumberFromRef(startRef);
  const startCol = columnLettersToNumber(startRef);
  const endRow = rowNumberFromRef(endRef);
  const endCol = columnLettersToNumber(endRef);
  const bounds: CellBounds = {
    startRow: Math.min(startRow, endRow),
    startCol: Math.min(startCol, endCol),
    endRow: Math.max(startRow, endRow),
    endCol: Math.max(startCol, endCol),
  };
  return {
    ref: cellRangeToRef(bounds),
    bounds,
  };
}

function cellRangeToRef(bounds: CellBounds): string {
  const start = cellRefToString(bounds.startRow, bounds.startCol);
  const end = cellRefToString(bounds.endRow, bounds.endCol);
  return start === end ? start : `${start}:${end}`;
}

function cellRefToString(row: number, col: number): string {
  return `${numberToColumnLetters(col)}${row + 1}`;
}

function normalizeCellReference(ref: string): string | null {
  const trimmed = ref.trim();
  if (!trimmed) return null;
  const withoutSheet = trimmed.includes(`!`)
    ? trimmed.slice(trimmed.indexOf(`!`) + 1)
    : trimmed;
  return withoutSheet.replace(/\$/g, ``).toUpperCase();
}

export function getRangeDimensions(bounds: CellBounds): {
  rows: number;
  cols: number;
} {
  return {
    rows: bounds.endRow - bounds.startRow + 1,
    cols: bounds.endCol - bounds.startCol + 1,
  };
}

export function rangesOverlap(a: CellBounds, b: CellBounds): boolean {
  return (
    a.startRow <= b.endRow &&
    a.endRow >= b.startRow &&
    a.startCol <= b.endCol &&
    a.endCol >= b.startCol
  );
}

export function parseCellReference(ref: string): {
  sheetName?: string;
  ref: string;
} {
  const withoutEquals = ref.startsWith(`=`) ? ref.slice(1) : ref;
  const bangIndex = withoutEquals.indexOf(`!`);
  if (bangIndex === -1) {
    return {
      ref: parseCellRange(withoutEquals)?.ref ?? withoutEquals,
    };
  }
  const sheetNameRaw = withoutEquals.slice(0, bangIndex);
  const cellPart = withoutEquals.slice(bangIndex + 1);
  const parsedRange = parseCellRange(cellPart);
  return {
    sheetName: unquoteSheetName(sheetNameRaw),
    ref: parsedRange?.ref ?? cellPart,
  };
}

function unquoteSheetName(name: string): string {
  if (name.startsWith(`'`) && name.endsWith(`'`) && name.length >= 2) {
    return name.slice(1, -1).replace(/''/g, `'`);
  }
  return name;
}

export interface CellBounds {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export {
  parseCellRange as parseCellRangeInternal,
  columnLettersToNumber,
  numberToColumnLetters,
  normalizeCellReference,
  cellRangeToRef,
  cellRefToString,
  rowNumberFromRef,
};
