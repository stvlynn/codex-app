// Restored from ref/webview/assets/open-in-targets-query-BYglWjqj.js
// Open-in-targets query hook restored from the Codex webview bundle.
import { useQuery } from "@tanstack/react-query";

export const OPEN_IN_TARGETS_QUERY_KEY = ["open-in-targets"] as const;

export interface OpenInTarget {
  id: string;
  name: string;
  icon?: string;
}

export interface UseOpenInTargetsOptions {
  enabled?: boolean;
}

export function useOpenInTargets(
  vscodeApi: {
    call: (method: string, params: Record<string, unknown>) => Promise<unknown>;
  } | null,
  options: UseOpenInTargetsOptions = {},
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: OPEN_IN_TARGETS_QUERY_KEY,
    queryFn: async () => {
      if (!vscodeApi) {
        throw new Error("VSCode API is not available");
      }
      return vscodeApi.call("open-in-targets", {});
    },
    enabled: enabled && !!vscodeApi,
    staleTime: 60_000, // 1 minute
  });
}
