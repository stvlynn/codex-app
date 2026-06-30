// Restored from ref/webview/assets/hotkey-window-state-5mYLM9i4.js

import { m as appScopeM, t as appScopeT } from "../boundaries/tanstack-query";
import { n as rpcN } from "../../entities/host/rpc-app-services.ts";

export interface HotkeyWindowState {
  supported: boolean;
  configuredHotkey: string | null;
  isGateEnabled: boolean;
  isDevMode: boolean;
  isDevOverrideEnabled: boolean;
  isActive: boolean;
}

export const HOTKEY_WINDOW_STATE_QUERY_KEY = [
  "hotkey-window-hotkey-state",
] as const;

export const hotkeyWindowStateQueryOptions = appScopeM(appScopeT, () => ({
  queryKey: HOTKEY_WINDOW_STATE_QUERY_KEY,
  queryFn: async (): Promise<HotkeyWindowState> => {
    const hotkeyWindowHotkeys = rpcN.hotkeyWindowHotkeys;
    if (hotkeyWindowHotkeys == null) {
      return {
        supported: false,
        configuredHotkey: null,
        isGateEnabled: false,
        isDevMode: false,
        isDevOverrideEnabled: false,
        isActive: false,
      };
    }
    return hotkeyWindowHotkeys.getState();
  },
}));
