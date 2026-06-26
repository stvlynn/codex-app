// Restored from ref/webview/assets/appgen-gating-C3NQrPIO.js
// appgen-gating-C3NQrPIO chunk restored from the Codex webview bundle.
import {
  c as computed,
  m as mutation,
  t as queryClient,
} from "../boundaries/tanstack-query";
import { u as queryConstants } from "../boundaries/vscode-api";
import { f as getGate, o as checkGate } from "@statsig/js-client";
import { apiClient } from "../utils/request-client";
const APPGEN_ACCESS_QUERY_KEY = ["appgen", "access"];
const APPGEN_GATE_NAME = "637432221";
const APPGEN_SECONDARY_GATE = "1741944562";
const appgenAccessQuery = mutation(queryClient, ({ get }) => ({
  enabled: get(getGate, APPGEN_GATE_NAME),
  queryKey: APPGEN_ACCESS_QUERY_KEY,
  queryFn: () => apiClient.safeGet("/wham/sites/access"),
  retry: false,
  staleTime: queryConstants.TEN_MINUTES,
}));
export type AppgenAccessStatus = "available" | "unavailable" | "loading";
export const appgenAccessStatus = computed(
  queryClient,
  ({ get }): AppgenAccessStatus => {
    if (!get(getGate, APPGEN_GATE_NAME)) return "unavailable";
    const { data, isError } = get(appgenAccessQuery);
    if (isError || data?.enabled === false) return "unavailable";
    if (data?.enabled === true) return "available";
    return "loading";
  },
);
export function isAppgenEnabled(): boolean {
  return checkGate(APPGEN_GATE_NAME) && checkGate(APPGEN_SECONDARY_GATE);
}
