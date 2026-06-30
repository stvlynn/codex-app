// Restored from ref/webview/assets/use-app-server-connection-state-urqZ7B3X.js
// use-app-server-connection-state-urqZ7B3X chunk restored from the Codex webview bundle.
import { appScopeA } from "../boundaries/app-scope";
import {
  threadContextInputsC,
  threadContextInputsH,
  threadContextInputsM,
  threadContextInputsP,
  threadContextInputsV,
} from "../../app/thread-context-inputs";
export interface AppServerConnectionState {
  appServerVersion: string | null;
  error: unknown | null;
  installedCodexVersion: string | null;
  state: unknown | null;
}
export function useAppServerConnectionState(
  hostId: string | undefined,
): AppServerConnectionState {
  const connection = appScopeA(threadContextInputsV, hostId);
  const state = appScopeA(threadContextInputsM, hostId);
  const appServerVersion = appScopeA(threadContextInputsC, hostId);
  const error = appScopeA(threadContextInputsP, hostId);
  const installedCodexVersion = appScopeA(threadContextInputsH, hostId);
  if (connection == null) {
    return {
      appServerVersion,
      error,
      installedCodexVersion,
      state: null,
    };
  }
  return {
    appServerVersion,
    error,
    installedCodexVersion,
    state,
  };
}
