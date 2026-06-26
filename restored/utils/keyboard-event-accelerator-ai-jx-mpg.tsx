// Restored from ref/webview/assets/keyboard-event-accelerator-AI-jxMPG.js
// Keyboard event accelerator string builder for Codex webview

import { getPhysicalKeyLabel } from "./keyboard-layout-map";
const MODIFIER_KEYS = new Set<string>([
  "Meta",
  "Control",
  "Alt",
  "AltGraph",
  "Shift",
]);
const KEY_LOCATION_LEFT = 1;
const KEY_LOCATION_RIGHT = 2;
const ARROW_KEY_MAP = new Map<string, string>([
  ["Escape", "Esc"],
  ["ArrowUp", "Up"],
  ["ArrowDown", "Down"],
  ["ArrowLeft", "Left"],
  ["ArrowRight", "Right"],
]);
interface KeyboardEventLike {
  key: string;
  code?: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  location?: number;
}

/**
 * Build a keyboard accelerator string (e.g. "Ctrl+Shift+A") from a keyboard event.
 * Returns null if the key is a bare modifier with no accompanying key.
 */
export function getKeyboardAccelerator(
  event: KeyboardEventLike,
): string | null {
  const keyLabel = getKeyLabel(event);
  if (keyLabel == null) return null;
  const parts: string[] = [];
  if (event.ctrlKey) parts.push("Ctrl");
  if (event.metaKey) parts.push("Command");
  if (event.altKey) parts.push("Alt");
  if (event.shiftKey) parts.push("Shift");
  parts.push(keyLabel);
  return parts.join("+");
}

/**
 * Get the modifier key label when the key is pressed (e.g. "LeftOption").
 * Returns null for non-modifier keys or when the modifier is combined with others.
 */
export function getModifierKeyPressed(event: KeyboardEventLike): string | null {
  return getModifierKeyLabel(event, "pressed");
}

/**
 * Get the modifier key label when the key is released (e.g. "LeftOption").
 * Returns null for non-modifier keys.
 */
export function getModifierKeyReleased(
  event: KeyboardEventLike,
): string | null {
  return getModifierKeyLabel(event, "released");
}
function getModifierKeyLabel(
  event: KeyboardEventLike,
  state: "pressed" | "released",
): string | null {
  if (event.key.toLowerCase() === "fn") return "Fn";
  const side =
    event.location === KEY_LOCATION_LEFT
      ? "Left"
      : event.location === KEY_LOCATION_RIGHT
        ? "Right"
        : null;
  if (side == null) return null;
  switch (event.key) {
    case "Alt":
      return state === "released" ||
        (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey)
        ? `${side}Option`
        : null;
    case "Meta":
      return state === "released" ||
        (event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey)
        ? `${side}Command`
        : null;
    case "Control":
      return side === "Left" &&
        (state === "released" ||
          (event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey))
        ? "LeftControl"
        : null;
    default:
      return null;
  }
}
function getKeyLabel(event: KeyboardEventLike): string | null {
  const physicalKey = getPhysicalKeyLabel({
    altKey: event.altKey,
    code: event.code,
    key: event.key,
  });
  if (MODIFIER_KEYS.has(physicalKey)) return null;
  if (physicalKey === " ") return "Space";
  if (physicalKey === "+") return "Plus";
  return (
    ARROW_KEY_MAP.get(physicalKey) ??
    (/^f\d{1,2}$/i.test(physicalKey)
      ? physicalKey.toUpperCase()
      : physicalKey.toLowerCase() === "fn"
        ? "Fn"
        : physicalKey.length === 1
          ? physicalKey.toUpperCase()
          : (mapCodeToSimpleLabel(event.code) ?? physicalKey))
  );
}
function mapCodeToSimpleLabel(code: string | undefined): string | null {
  if (code == null) return null;
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (code === "Space") return "Space";
  return null;
}
