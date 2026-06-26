// Restored from ref/webview/assets/workbook-from-csv-Bw8OaanU.js

import { parseCellReference, cellRangeToRef } from "../utils/address-utils";
const DEFAULT_CSV_SHEET_NAME = "CSV import";
const MAX_SHEET_NAME_LENGTH = 31;
const INVALID_SHEET_NAME_CHARS = /\\|\/|\?|\*|\[|\]||:/g;
export interface CsvParseOptions {
  separator?: string;
  anchor?: string;
  sheetName?: string;
}
export interface CellBounds {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}
export interface ParsedCellReference {
  sheetName?: string;
  ref: string;
  bounds: CellBounds;
}
export interface CsvImportPlan {
  sheetName: string;
  values: string[][];
  rangeRef: string;
  rect: {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
  };
}
export function sanitizeSheetName(name?: string | null): string {
  const cleaned = (
    (name ?? DEFAULT_CSV_SHEET_NAME)
      .trim()
      .replace(INVALID_SHEET_NAME_CHARS, "")
      .trim() || DEFAULT_CSV_SHEET_NAME
  ).slice(0, MAX_SHEET_NAME_LENGTH);
  return cleaned;
}
function parseSeparator(separator?: string): string {
  const value = separator ?? ",";
  if (value.length !== 1) {
    throw new Error(
      `CSV import separator must be a single character; received "${value}".`,
    );
  }
  return value;
}
function normalizeRows(rows: string[][]): string[][] {
  if (rows.length === 0) return [];
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (width === 0) return [];
  return rows.map((row) => {
    if (row.length === width) return row;
    const padded = row.slice();
    while (padded.length < width) padded.push("");
    return padded;
  });
}
function parseCsvRows(text: string, separator: string): string[][] {
  if (!text.trim()) return [];
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;
  const flushCell = () => {
    currentRow.push(currentCell);
    currentCell = "";
  };
  const flushRow = () => {
    flushCell();
    rows.push(currentRow);
    currentRow = [];
  };
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i] ?? "";
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          currentCell += '"';
          i += 1;
          continue;
        }
        inQuotes = false;
        continue;
      }
      currentCell += char;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === separator) {
      flushCell();
      continue;
    }
    if (char === "\n") {
      flushRow();
      continue;
    }
    if (char === "\r") {
      if (text[i + 1] === "\n") i += 1;
      flushRow();
      continue;
    }
    currentCell += char;
  }
  flushRow();
  while (rows.length > 0) {
    const last = rows[rows.length - 1] ?? [];
    if (!(last.length > 0 && last.every((cell) => cell === ""))) break;
    rows.pop();
  }
  return rows;
}
export function planCsvImport(
  csvText: string,
  options: CsvParseOptions = {},
): CsvImportPlan {
  const separator = parseSeparator(options.separator);
  const anchorInput = options.anchor ?? "A1";
  const parsedAnchor = parseCellReference(anchorInput);
  const anchorSheetName = parsedAnchor.sheetName?.trim();
  const optionSheetName = options.sheetName?.trim();
  if (
    anchorSheetName &&
    optionSheetName &&
    anchorSheetName !== optionSheetName
  ) {
    throw new Error(
      `CSV import specifies conflicting sheet names: "${optionSheetName}" (options.sheetName) vs "${anchorSheetName}" (anchor).`,
    );
  }
  const sheetName = sanitizeSheetName(anchorSheetName ?? optionSheetName);
  const anchorRef = parseCellReference(parsedAnchor.ref);
  if (!anchorRef) {
    throw new Error(
      `CSV import anchor must be an A1 cell reference; received "${anchorInput}".`,
    );
  }
  const { bounds } = anchorRef;
  if (bounds.startRow !== bounds.endRow || bounds.startCol !== bounds.endCol) {
    throw new Error(
      `CSV import anchor must be a single cell reference; received "${anchorInput}".`,
    );
  }
  const parsedRows = parseCsvRows(csvText, separator);
  const rows = normalizeRows(parsedRows);
  const rowCount = rows.length;
  const columnCount = rowCount > 0 ? (rows[0]?.length ?? 0) : 0;
  if (rowCount === 0 || columnCount === 0) {
    return {
      sheetName,
      values: [],
      rangeRef: cellRangeToRef(bounds),
      rect: {
        r1: bounds.startRow,
        c1: bounds.startCol,
        r2: bounds.startRow,
        c2: bounds.startCol,
      },
    };
  }
  const rangeBounds = {
    startRow: bounds.startRow,
    startCol: bounds.startCol,
    endRow: bounds.startRow + rowCount - 1,
    endCol: bounds.startCol + columnCount - 1,
  };
  return {
    sheetName,
    values: rows,
    rangeRef: cellRangeToRef(rangeBounds),
    rect: {
      r1: rangeBounds.startRow,
      c1: rangeBounds.startCol,
      r2: rangeBounds.endRow,
      c2: rangeBounds.endCol,
    },
  };
}
