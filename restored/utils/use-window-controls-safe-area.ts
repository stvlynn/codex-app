// Restored from ref/webview/assets/use-window-controls-safe-area-KZMmRJgn.js
import React from "react";
import { p as useEventListener } from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type WindowChromeType = "native" | "application-menu";
export interface SafeAreaInsets {
  left: number;
  right: number;
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const SAFE_AREA_DEFAULTS: Record<string, SafeAreaInsets> = Object.freeze({
  default: Object.freeze({
    left: 0,
    right: 0,
  }),
  mac: Object.freeze({
    legacy: Object.freeze({
      left: 82,
      right: 0,
    }),
    modern: Object.freeze({
      left: 92,
      right: 0,
    }),
  }),
  applicationMenu: Object.freeze({
    left: 0,
    right: 0,
  }),
});
const MAC_OS_VERSION_RE = /mac os x (\d+)[_.](\d+)/i;

// ------------------------------------------------------------------
// Pure helpers
// ------------------------------------------------------------------

export function resolveWindowChromeType(
  appType: string,
  platform: string,
): WindowChromeType {
  if (appType !== "electron") return "native";
  switch (platform) {
    case "win32":
    case "linux":
      return "application-menu";
    case "darwin":
    case "unknown":
      return "native";
  }
}
export function isApplicationMenuChrome(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.codexWindowChrome === "application-menu"
  );
}
function resolveMacSafeArea(userAgent: string): SafeAreaInsets {
  const match = MAC_OS_VERSION_RE.exec(userAgent);
  if (!match) return SAFE_AREA_DEFAULTS.mac.modern;
  const major = Number.parseInt(match[1] ?? "", 10);
  const minor = Number.parseInt(match[2] ?? "", 10);
  if (Number.isNaN(major) || Number.isNaN(minor)) {
    return SAFE_AREA_DEFAULTS.mac.modern;
  }
  return major === 10 && minor <= 15
    ? SAFE_AREA_DEFAULTS.mac.legacy
    : SAFE_AREA_DEFAULTS.mac.modern;
}
function getWindowControlsOverlayInsets(): SafeAreaInsets | null {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return null;
  }
  const overlay = navigator.windowControlsOverlay;
  if (!overlay?.visible) return null;
  const rect = overlay.getTitlebarAreaRect();
  return {
    left: Math.max(0, Math.round(rect.x)),
    right: Math.max(0, Math.round(window.innerWidth - (rect.x + rect.width))),
  };
}
function resolveSafeAreaInsets(
  isFullscreen: boolean,
  overlayInsets: SafeAreaInsets | null,
  customInsets?: SafeAreaInsets,
): SafeAreaInsets {
  if (isFullscreen) return SAFE_AREA_DEFAULTS.default;
  if (isApplicationMenuChrome()) {
    return customInsets ?? SAFE_AREA_DEFAULTS.applicationMenu;
  }
  if (typeof navigator === "undefined") return SAFE_AREA_DEFAULTS.default;
  const userAgent = (navigator.userAgent ?? "").toLowerCase();
  const platform =
    navigator.userAgentData?.platform?.toLowerCase() ??
    navigator.platform?.toLowerCase() ??
    userAgent;
  const isMac =
    platform.includes("darwin") ||
    platform.includes("mac") ||
    userAgent.includes("mac os x") ||
    userAgent.includes("macintosh");
  const isWindowsOrLinux =
    platform.includes("win") ||
    userAgent.includes("windows") ||
    platform.includes("linux");
  if (isMac) {
    return resolveMacSafeArea(userAgent);
  }
  if (isWindowsOrLinux) {
    return customInsets ?? SAFE_AREA_DEFAULTS.applicationMenu;
  }
  return SAFE_AREA_DEFAULTS.default;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useWindowControlsSafeArea(
  customInsets?: SafeAreaInsets,
): SafeAreaInsets {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [overlayInsets, setOverlayInsets] =
    React.useState<SafeAreaInsets | null>(null);

  // Listen for fullscreen changes from VSCode extension
  const handleFullscreenChange = React.useCallback(
    (event: { isFullScreen: boolean }) => {
      setIsFullscreen(event.isFullScreen);
    },
    [],
  );
  useEventListener("window-fullscreen-changed", handleFullscreenChange, []);

  // Track window controls overlay geometry changes
  React.useEffect(() => {
    if (typeof window === "undefined") {
      setOverlayInsets(null);
      return;
    }
    const overlay = navigator.windowControlsOverlay;
    if (!overlay) {
      setOverlayInsets(null);
      return;
    }
    const updateOverlay = () => {
      setOverlayInsets(getWindowControlsOverlayInsets());
    };
    updateOverlay();
    overlay.addEventListener("geometrychange", updateOverlay);
    window.addEventListener("resize", updateOverlay);
    return () => {
      overlay.removeEventListener("geometrychange", updateOverlay);
      window.removeEventListener("resize", updateOverlay);
    };
  }, []);

  // Track fullscreen via display-mode media query
  React.useEffect(() => {
    const mq = window.matchMedia("(display-mode: fullscreen)");
    setIsFullscreen(mq.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsFullscreen(event.matches);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);
  return resolveSafeAreaInsets(isFullscreen, overlayInsets, customInsets);
}
