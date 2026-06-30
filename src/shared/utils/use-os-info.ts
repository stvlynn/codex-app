// Restored from ref/webview/assets/use-os-info-C5UGPaac.js
// UseOsInfo chunk restored from the Codex webview bundle.
import { useOsInfo as useOsInfoQuery } from "../utils/platform";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface UseOsInfoResult {
  data:
    | {
        platform: string;
      }
    | undefined;
  isLoading: boolean;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

/**
 * Lightweight wrapper around the platform OS-info query that returns
 * only the data and loading state.
 */
export function useOsInfo(): UseOsInfoResult {
  const result = useOsInfoQuery();
  return {
    data: result.data,
    isLoading: result.isLoading,
  };
}
