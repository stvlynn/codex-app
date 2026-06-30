// Restored from ref/webview/assets/keyboard-layout-map-Z1-mi1D4.js

const NON_ALPHANUMERIC_KEY_MAP = new Map<string, string>([
  ["Backquote", "`"],
  ["Minus", "-"],
  ["Equal", "="],
  ["BracketLeft", "["],
  ["BracketRight", "]"],
  ["Backslash", "\\"],
  ["Semicolon", ";"],
  ["Quote", "'"],
  ["Comma", ","],
  ["Period", "."],
  ["Slash", "/"],
  ["Space", " "],
  ["NumpadMultiply", "*"],
  ["NumpadAdd", "+"],
  ["NumpadSubtract", "-"],
  ["NumpadDecimal", "."],
  ["NumpadDivide", "/"],
]);

let customLayoutMap: Map<string, string> | null = null;

export function setKeyboardLayoutMap(
  layoutMap: Map<string, string> | null,
): void {
  customLayoutMap = layoutMap;
}

export function getPhysicalKeyLabel({
  altKey,
  code,
  key,
}: {
  altKey: boolean;
  code?: string;
  key: string;
}): string {
  if (!altKey || code == null) return key;
  return customLayoutMap?.get(code) ?? mapCodeToKeyLabel(code) ?? key;
}

function mapCodeToKeyLabel(code: string): string | null {
  if (/^Key[A-Z]$/.test(code)) {
    return code.slice(3).toLowerCase();
  }
  if (/^Digit[0-9]$/.test(code)) {
    return code.slice(5);
  }
  return NON_ALPHANUMERIC_KEY_MAP.get(code) ?? null;
}
