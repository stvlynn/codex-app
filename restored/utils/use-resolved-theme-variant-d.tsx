// Restored from ref/webview/assets/use-resolved-theme-variant-D-DZx3uS.js
// UseResolvedThemeVariant chunk restored from the Codex webview bundle.
import { useSyncExternalStore } from "react";
import { useSettingValue } from "../utils/setting-storage";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function noopSubscribe(): () => void {
  return () => {};
}
function subscribeToSystemTheme(callback: () => void): () => void {
  const electronBridge = (
    window as Window & {
      electronBridge?: {
        subscribeToSystemThemeVariant?: (cb: () => void) => () => void;
      };
    }
  ).electronBridge;
  const electronSubscribe = electronBridge?.subscribeToSystemThemeVariant;
  if (electronSubscribe != null) {
    return electronSubscribe(callback);
  }
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => callback();
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }
  if (
    typeof mediaQuery.addListener === "function" &&
    typeof mediaQuery.removeListener === "function"
  ) {
    mediaQuery.addListener(handler);
    return () => {
      mediaQuery.removeListener(handler);
    };
  }
  return () => {};
}
function getSystemThemeVariant(): ResolvedTheme {
  const electronBridge = (
    window as Window & {
      electronBridge?: {
        getSystemThemeVariant?: () => ResolvedTheme | undefined;
      };
    }
  ).electronBridge;
  const electronTheme = electronBridge?.getSystemThemeVariant?.();
  if (electronTheme != null) {
    return electronTheme;
  }
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// ------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------

/**
 * Returns the user's raw theme preference ("light", "dark", or "system").
 */
export function useThemePreference(): ThemePreference {
  return useSettingValue<ThemePreference>({
    key: "theme",
    default: "system",
  });
}

/**
 * Resolves a theme preference to an actual "light" | "dark" value.
 * When the preference is "system", it subscribes to OS-level theme changes.
 */
export function useResolvedThemeVariant(
  preference: ThemePreference,
): ResolvedTheme {
  const getSnapshot =
    preference === "system"
      ? getSystemThemeVariant
      : () => preference as ResolvedTheme;
  const getServerSnapshot =
    preference === "system"
      ? getSystemThemeVariant
      : () => preference as ResolvedTheme;
  const subscribe =
    preference === "system" ? subscribeToSystemTheme : noopSubscribe;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns the list of active theme variants for the given preference.
 * "system" expands to both ["light", "dark"]; explicit preferences return
 * a single-element array.
 */
export function getActiveThemeVariants(
  preference: ThemePreference,
): ResolvedTheme[] {
  return preference === "system"
    ? ["light", "dark"]
    : [preference as ResolvedTheme];
}
