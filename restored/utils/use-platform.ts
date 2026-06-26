// Restored from ref/webview/assets/use-platform-D3fl3oDu.js
// React hook that returns the current platform and modifier key symbol.
//
import { useOsInfo } from "../utils/use-os-info";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type Platform = "macOS" | "windows" | "linux" | "web";
export interface UsePlatformResult {
  /** Normalised platform name. */
  platform: Platform;
  /** The modifier key symbol for the current platform (⌘ on macOS, ^ elsewhere). */
  modifierSymbol: string;
  /** Whether the OS info query is still loading. */
  isLoading: boolean;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/**
 * Normalises a raw OS platform string into a canonical Platform value.
 */
function normalisePlatform(osPlatform: string | undefined): Platform {
  if (osPlatform === "darwin" || osPlatform === "macOS") return "macOS";
  if (osPlatform === "win32" || osPlatform === "windows") return "windows";
  if (osPlatform === "linux") return "linux";
  return "web";
}

/**
 * Returns the modifier key symbol for the given platform.
 */
function getModifierSymbol(platform: Platform): string {
  return platform === "macOS" ? "⌘" : "^";
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

/**
 * Returns the current platform (macOS / windows / linux / web) and
 * the corresponding modifier key symbol.
 */
export function usePlatform(): UsePlatformResult {
  const { data, isLoading } = useOsInfo();
  const platform = normalisePlatform(data?.platform);
  const modifierSymbol = getModifierSymbol(platform);
  return {
    platform,
    modifierSymbol,
    isLoading,
  };
}
