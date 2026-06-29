// Restored from ref/webview/assets/use-is-thread-realtime-enabled-ChiO9bP6.js
// Thread realtime mode enabled hook restored from the Codex webview bundle.
import * as statsigClient from "@statsig/js-client";
import * as runtimeConstants from "../boundaries/src";
import { useGlobalState } from "./use-global-state";
export function useIsThreadRealtimeEnabled(): boolean {
  const { o: checkStatsigGate } = statsigClient;
  const { data: isDebugDisabled } = useGlobalState(
    runtimeConstants.srcBr.REALTIME_VOICE_MODE_DEBUG_DISABLED,
  );
  return checkStatsigGate("2380644311") && isDebugDisabled !== true;
}
