// Restored from ref/webview/assets/use-is-dark-Dz6aJFFs.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/use-is-dark-Dz6aJFFs.js
 *   Chunk: use-is-dark-Dz6aJFFs
 *   Classification: single-util
 *   Domain: utils
 *   Semantic path: utils/use-is-dark.ts
 */
import { useSyncExternalStore } from "react";
const DARK_MODE_LUMINANCE_THRESHOLD = 0.5;
let cachedIsDark: boolean | null = null;
const listeners = new Set<() => void>();
let rootObserver: MutationObserver | null = null;
let headObserver: MutationObserver | null = null;
let mediaQuery: MediaQueryList | null = null;
function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}
function recomputeIsDark() {
  const next = computeIsDark();
  if (next !== cachedIsDark) {
    cachedIsDark = next;
    notifyListeners();
  }
}
function handleStylesheetLink(link: HTMLLinkElement) {
  if (link.rel !== "stylesheet") return;
  if (link.sheet) {
    queueMicrotask(() => recomputeIsDark());
    return;
  }
  const onDone = () => recomputeIsDark();
  link.addEventListener("load", onDone, {
    once: true,
  });
  link.addEventListener("error", onDone, {
    once: true,
  });
}
function handleHeadMutation(event: MutationRecord) {
  if (event.type === "childList") {
    let addedStylesheet = false;
    for (const node of Array.from(event.addedNodes)) {
      if (node instanceof HTMLLinkElement && node.rel === "stylesheet") {
        handleStylesheetLink(node);
        addedStylesheet = true;
      }
    }
    if (event.removedNodes.length > 0 || !addedStylesheet) {
      recomputeIsDark();
    }
    return;
  }
  if (event.type === "attributes") {
    const target = event.target;
    if (
      target instanceof HTMLLinkElement &&
      target.rel === "stylesheet" &&
      (event.attributeName === "href" ||
        event.attributeName === "media" ||
        event.attributeName === "rel")
    ) {
      handleStylesheetLink(target);
      return;
    }
    recomputeIsDark();
  }
}
function startObserving() {
  if (typeof window === "undefined" || rootObserver || headObserver) return;
  recomputeIsDark();
  rootObserver = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        recomputeIsDark();
        break;
      }
    }
  });
  rootObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  const head = document.head;
  if (head) {
    headObserver = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList" || record.type === "attributes") {
          handleHeadMutation(record);
          break;
        }
      }
    });
    headObserver.observe(head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "media", "rel"],
    });
  }
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
  ) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", recomputeIsDark);
  }
}
function stopObserving() {
  rootObserver?.disconnect();
  headObserver?.disconnect();
  rootObserver = null;
  headObserver = null;
  mediaQuery?.removeEventListener("change", recomputeIsDark);
  mediaQuery = null;
}
function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  startObserving();
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      stopObserving();
    }
  };
}
function getSnapshot() {
  return cachedIsDark;
}
export function useIsDark(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// --- Color parsing helpers for computing dark mode from CSS variable ---

function srgbToLinear(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}
function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}
interface RGB {
  r: number;
  g: number;
  b: number;
}
function parseColor(input: string): RGB | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    const double = (c: string) => c + c;
    if (hex.length === 3 || hex.length === 4) {
      return {
        r: parseInt(double(hex[0]), 16),
        g: parseInt(double(hex[1]), 16),
        b: parseInt(double(hex[2]), 16),
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
    return null;
  }
  const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/\s*,\s*/).map((p) => p.trim());
    if (parts.length >= 3) {
      const r = parseColorChannel(parts[0]);
      const g = parseColorChannel(parts[1]);
      const b = parseColorChannel(parts[2]);
      if (r != null && g != null && b != null) {
        return {
          r,
          g,
          b,
        };
      }
    }
    return null;
  }
  const hslMatch = trimmed.match(/^hsla?\(([^)]+)\)$/);
  if (hslMatch) {
    const parts = hslMatch[1].split(/\s*,\s*/).map((p) => p.trim());
    if (parts.length >= 3) {
      const h = parseFloat(parts[0]);
      const s = parsePercentage(parts[1]);
      const l = parsePercentage(parts[2]);
      if (![h, s, l].some(Number.isNaN)) {
        return hslToRgb(h, s, l);
      }
    }
    return null;
  }
  return null;
}
function parseColorChannel(value: string): number | null {
  if (value.endsWith("%")) {
    const pct = parseFloat(value.slice(0, -1));
    if (Number.isNaN(pct)) return null;
    return Math.round((pct / 100) * 255);
  }
  const num = parseFloat(value);
  if (Number.isNaN(num)) return null;
  return Math.max(0, Math.min(255, num));
}
function parsePercentage(value: string): number {
  if (value.endsWith("%")) {
    const pct = parseFloat(value.slice(0, -1));
    return Number.isNaN(pct) ? 0 : pct / 100;
  }
  const num = parseFloat(value);
  return Number.isNaN(num) ? 0 : num / 100;
}
function hslToRgb(h: number, s: number, l: number): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp >= 0 && hp < 1) {
    [r1, g1, b1] = [c, x, 0];
  } else if (hp >= 1 && hp < 2) {
    [r1, g1, b1] = [x, c, 0];
  } else if (hp >= 2 && hp < 3) {
    [r1, g1, b1] = [0, c, x];
  } else if (hp >= 3 && hp < 4) {
    [r1, g1, b1] = [0, x, c];
  } else if (hp >= 4 && hp < 5) {
    [r1, g1, b1] = [x, 0, c];
  } else if (hp >= 5 && hp < 6) {
    [r1, g1, b1] = [c, 0, x];
  }
  const m = l - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
function getEditorBackgroundColor(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const el = document.createElement("div");
    el.style.display = "none";
    el.style.backgroundColor = "var(--color-token-editor-background)";
    document.body.appendChild(el);
    const color = getComputedStyle(el).backgroundColor || "";
    el.remove();
    return color;
  } catch {
    return null;
  }
}
function computeIsDark(): boolean | null {
  const color = getEditorBackgroundColor();
  if (!color) return null;
  const rgb = parseColor(color);
  if (!rgb) return null;
  return relativeLuminance(rgb.r, rgb.g, rgb.b) < DARK_MODE_LUMINANCE_THRESHOLD;
}
