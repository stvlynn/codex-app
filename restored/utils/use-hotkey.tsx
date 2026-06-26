// Restored from ref/webview/assets/use-hotkey-D1ZoA2rx.js
import React, { useRef, useEffect, useEffectEvent, useCallback } from "react";
import {
  tokenizeKeyString,
  DEFAULT_KEYMAP_STALE_TIME_MS,
  isMacOSPlatform,
} from "../app-shell/electron-menu-shortcuts";
import { getPhysicalKeyLabel } from "./keyboard-layout-map";
const SHORTCUT_CAPTURE_SELECTOR = "[data-codex-shortcut-capture]";
const INPUT_SELECTOR =
  "input,textarea,select,[contenteditable='true'],[data-codex-composer],[data-codex-terminal]";
interface ParsedAccelerator {
  key: string;
  requireCtrl: boolean;
  requireMeta: boolean;
  requireAlt: boolean;
  requireShift: boolean;
}
function parseAccelerator(
  accelerator: string,
  isMac: boolean,
): ParsedAccelerator {
  const parts = accelerator.split("+").filter(Boolean);
  let key: string | null = null;
  let requireCtrl = false;
  let requireMeta = false;
  let requireAlt = false;
  let requireShift = false;
  for (const part of parts) {
    switch (part) {
      case "CmdOrCtrl":
        isMac ? (requireMeta = true) : (requireCtrl = true);
        break;
      case "Command":
      case "Cmd":
        requireMeta = true;
        break;
      case "Control":
      case "Ctrl":
        requireCtrl = true;
        break;
      case "Alt":
      case "Option":
        requireAlt = true;
        break;
      case "Shift":
        requireShift = true;
        break;
      default:
        key = part.toLowerCase();
        break;
    }
  }
  return {
    key: normalizeKey(key ?? ""),
    requireCtrl,
    requireMeta,
    requireAlt,
    requireShift,
  };
}
function normalizeKey(key: string): string {
  switch (key) {
    case "esc":
    case "escape":
      return "escape";
    case "up":
    case "arrowup":
      return "arrowup";
    case "down":
    case "arrowdown":
      return "arrowdown";
    case "left":
    case "arrowleft":
      return "arrowleft";
    case "right":
    case "arrowright":
      return "arrowright";
    case "space":
      return " ";
    case "plus":
      return "+";
    default:
      return key;
  }
}
function isTargetWithinSelector(
  event: KeyboardEvent,
  selector: string,
): boolean {
  return (
    event.target instanceof Element && event.target.closest(selector) != null
  );
}
function keyMatches(event: KeyboardEvent, parsed: ParsedAccelerator): boolean {
  return (
    getPhysicalKeyLabel(event).toLowerCase() === parsed.key ||
    (parsed.key === "=" && parsed.requireShift && event.key === "+")
  );
}
function acceleratorMatches(
  event: KeyboardEvent,
  parsed: ParsedAccelerator,
): boolean {
  if (!parsed.key) return false;
  if (!keyMatches(event, parsed)) return false;
  if (event.ctrlKey !== parsed.requireCtrl) return false;
  if (event.metaKey !== parsed.requireMeta) return false;
  if (event.altKey !== parsed.requireAlt) return false;
  if (event.shiftKey !== parsed.requireShift) return false;
  return true;
}

/**
 * Checks whether a keyboard event matches a given accelerator string.
 */
export function useHotkeyT(event: KeyboardEvent, accelerator: string): boolean {
  const parsedAccelerators = tokenizeKeyString(accelerator);
  const first = parsedAccelerators[0];
  if (first == null || parsedAccelerators.length !== 1) return false;
  return acceleratorMatches(event, parseAccelerator(first, isMacOSPlatform()));
}
function hasModifier(parsed: ParsedAccelerator): boolean {
  return parsed.requireCtrl || parsed.requireMeta || parsed.requireAlt;
}
export interface UseHotkeyOptions {
  /** The keyboard accelerator string (e.g. "Cmd+K", "Ctrl+Shift+P"). */
  accelerator: string;
  /** Whether to allow repeated keydown events while held. */
  allowRepeat?: boolean;
  /** Whether the hotkey is currently enabled. */
  enabled?: boolean;
  /** Callback fired when the accelerator is pressed. */
  onKeyDown: (event: KeyboardEvent) => void;
  /** Optional callback fired when the accelerator key is released. */
  onKeyUp?: (event: KeyboardEvent) => void;
  /** Whether to use capture phase for event listeners. */
  capture?: boolean;
  /** CSS selector for elements where the hotkey should be ignored. */
  ignoreWithin?: string;
  /** Custom event target (defaults to `window`). */
  keyboardEventTarget?: EventTarget | null;
}

/**
 * React hook that registers a global keyboard shortcut.
 * Supports chord accelerators (e.g. "Ctrl+K Ctrl+C") and
 * respects the current keyboard layout.
 */
export function useHotkeyN({
  accelerator,
  allowRepeat = false,
  enabled = true,
  onKeyDown,
  onKeyUp,
  capture = true,
  ignoreWithin,
  keyboardEventTarget,
}: UseHotkeyOptions): void {
  const isMac = isMacOSPlatform();
  const parsedAccelerators = tokenizeKeyString(accelerator).map((item) =>
    parseAccelerator(item, isMac),
  );
  const isChord = parsedAccelerators.length > 1;
  const isKeyDownRef = useRef(false);
  const matchedKeyRef = useRef<ParsedAccelerator | null>(null);
  const chordIndexRef = useRef(0);
  const chordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasKeyUpHandler = onKeyUp != null;
  const resetChord = useCallback(() => {
    chordIndexRef.current = 0;
    if (chordTimeoutRef.current != null) {
      clearTimeout(chordTimeoutRef.current);
      chordTimeoutRef.current = null;
    }
  }, []);
  const resetState = useCallback(() => {
    isKeyDownRef.current = false;
    matchedKeyRef.current = null;
    resetChord();
  }, [resetChord]);
  const startChordTimeout = useCallback(() => {
    if (chordTimeoutRef.current != null) {
      clearTimeout(chordTimeoutRef.current);
    }
    chordTimeoutRef.current = setTimeout(
      resetChord,
      DEFAULT_KEYMAP_STALE_TIME_MS,
    );
  }, [resetChord]);
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (
      !enabled ||
      (!allowRepeat && event.repeat) ||
      isTargetWithinSelector(event, SHORTCUT_CAPTURE_SELECTOR) ||
      (ignoreWithin && isTargetWithinSelector(event, ignoreWithin))
    ) {
      return;
    }
    const currentParsed = parsedAccelerators[chordIndexRef.current];
    if (currentParsed == null) return;

    // Ignore hotkeys when focus is inside an input, unless the accelerator
    // has a modifier or is part of a chord.
    if (
      isTargetWithinSelector(event, INPUT_SELECTOR) &&
      (isChord || !hasModifier(currentParsed))
    ) {
      return;
    }
    if (!acceleratorMatches(event, currentParsed)) {
      if (!isChord) return;
      resetChord();
      const first = parsedAccelerators[0];
      if (first == null || !acceleratorMatches(event, first)) return;
    }
    if (!isChord) {
      isKeyDownRef.current = true;
      matchedKeyRef.current = currentParsed;
      onKeyDown(event);
      return;
    }

    // Chord handling
    event.preventDefault();
    chordIndexRef.current += 1;
    if (chordIndexRef.current < parsedAccelerators.length) {
      startChordTimeout();
      return;
    }
    isKeyDownRef.current = true;
    matchedKeyRef.current =
      parsedAccelerators[parsedAccelerators.length - 1] ?? null;
    resetChord();
    onKeyDown(event);
  });
  const handleKeyUp = useEffectEvent((event: KeyboardEvent) => {
    if (!isKeyDownRef.current) return;
    const matched = matchedKeyRef.current;
    if (matched == null) return;
    if (keyMatches(event, matched)) {
      isKeyDownRef.current = false;
      matchedKeyRef.current = null;
      onKeyUp?.(event);
    }
  });
  useEffect(() => {
    if (!enabled) {
      resetState();
      return;
    }
    const target =
      keyboardEventTarget ?? (typeof window === "undefined" ? null : window);
    if (target == null) {
      resetState();
      return;
    }
    target.addEventListener("keydown", handleKeyDown as EventListener, {
      capture,
    });
    if (hasKeyUpHandler) {
      target.addEventListener("keyup", handleKeyUp as EventListener, {
        capture,
      });
    }
    return () => {
      target.removeEventListener("keydown", handleKeyDown as EventListener, {
        capture,
      });
      if (hasKeyUpHandler) {
        target.removeEventListener("keyup", handleKeyUp as EventListener, {
          capture,
        });
      }
      resetState();
    };
  }, [
    accelerator,
    capture,
    enabled,
    hasKeyUpHandler,
    keyboardEventTarget,
    resetState,
  ]);
}
