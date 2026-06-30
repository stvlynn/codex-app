// Restored from ref/webview/assets/platform-BWhOK2AS.js
import {
  c as atomWithQuery,
  t as queryClient,
} from "../boundaries/tanstack-query";
import {
  a as useSuspenseQuery,
  u as queryConstants,
} from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type Platform = "macOS" | "windows" | "linux";

export interface OsInfo {
  platform: string;
}

// ------------------------------------------------------------------
// Query key
// ------------------------------------------------------------------

export const osInfoQueryKey = ["os-info"];

// ------------------------------------------------------------------
// Internal: platform normalisation helpers
// ------------------------------------------------------------------

function getPlatformFromNavigator(): Platform {
  const platform =
    typeof navigator === "undefined" ? "" : (navigator.platform ?? "");
  if (platform.startsWith("Mac")) return "macOS";
  if (platform.startsWith("Win")) return "windows";
  return "linux";
}

function normalizePlatform(osPlatform: string): Platform {
  if (osPlatform === "win32") return "windows";
  if (osPlatform === "darwin") return "macOS";
  return "linux";
}

export function resolvePlatform(osPlatform?: string | null): Platform {
  if (osPlatform != null && osPlatform !== "web") {
    return normalizePlatform(osPlatform);
  }
  return getPlatformFromNavigator();
}

// ------------------------------------------------------------------
// React-query hook for raw OS info
// ------------------------------------------------------------------

export function useOsInfo() {
  return useSuspenseQuery<OsInfo>({
    queryKey: osInfoQueryKey,
    staleTime: queryConstants.INFINITE,
  });
}

// ------------------------------------------------------------------
// Jotai atom: derived platform value
// ------------------------------------------------------------------

export const platformAtom = atomWithQuery<Platform>((get) => {
  const { data } = get(useOsInfo);
  return resolvePlatform(data?.platform);
});
