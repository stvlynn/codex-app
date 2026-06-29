// Restored from ref/webview/assets/use-nux-ChpUn11I.js
// New-user-experience state hook restored from the Codex webview bundle.
import * as runtimeConstants from "../boundaries/src";
import { t as useAuth } from "../boundaries/use-auth";
import { useGlobalState } from "./use-global-state";
export type NuxState = "none" | string | null;
export function useNux(): NuxState {
  const { data: nuxState, isLoading } = useGlobalState(
    runtimeConstants.srcBr.NUX_2025_09_15,
  );
  void nuxState;
  void isLoading;
  useAuth();
  return "none";
}
