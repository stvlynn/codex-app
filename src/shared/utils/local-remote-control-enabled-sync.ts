// Restored from ref/webview/assets/local-remote-control-enabled-sync-DueNKRXX.js
// Local remote-control enabled sync restored from the Codex webview bundle.
import {
  Bt as callHostConfig,
  R as localHostId,
} from "../boundaries/host-config";
import {
  dn as getRemoteConnectionStatus,
  pn as updateRemoteConnectionStatus,
} from "../../app/thread-context-inputs";
export interface SyncOptions {
  shouldApplyStatus?: () => boolean;
}
export interface ForceOptions {
  force?: boolean;
}
async function applyRemoteControlEnabled(
  scope: {
    get: (atom: unknown, hostId: string) => unknown;
  },
  hostId: string,
  enabled: boolean,
  options: SyncOptions = {},
): Promise<unknown> {
  const { shouldApplyStatus = () => true } = options;
  const previousStatus = scope.get(getRemoteConnectionStatus, hostId);
  const result = await callHostConfig("set-remote-control-enabled-for-host", {
    enabled,
    hostId,
  });
  const currentStatus = scope.get(getRemoteConnectionStatus, hostId);
  const hasChanged =
    currentStatus !== previousStatus &&
    ((
      currentStatus as
        | {
            status?: string;
          }
        | undefined
    )?.status === "connected" ||
      (
        currentStatus as
          | {
              status?: string;
            }
          | undefined
      )?.status === "errored");
  if (shouldApplyStatus() && (!enabled || !hasChanged)) {
    updateRemoteConnectionStatus(scope, hostId, result);
  }
  return result;
}
let lastEnabledState: boolean | undefined;
let inFlightRequest:
  | {
      enabled: boolean;
      promise: Promise<unknown>;
    }
  | undefined;
let requestCounter = 0;
export async function syncRemoteControlEnabled(
  scope: {
    get: (atom: unknown, hostId: string) => unknown;
  },
  enabled: boolean,
  options: ForceOptions = {},
): Promise<unknown> {
  if (inFlightRequest?.enabled === enabled) {
    return inFlightRequest.promise;
  }
  if (!options.force && lastEnabledState === enabled) {
    return null;
  }
  const requestId = ++requestCounter;
  let pendingPromise = applyRemoteControlEnabled(scope, localHostId, enabled, {
    shouldApplyStatus: () => requestId === requestCounter,
  });
  inFlightRequest = {
    enabled,
    promise: pendingPromise,
  };
  try {
    const result = await pendingPromise;
    if (requestId === requestCounter) {
      lastEnabledState = enabled;
      return result;
    }
    if (lastEnabledState != null && lastEnabledState !== enabled) {
      await syncRemoteControlEnabled(scope, lastEnabledState, {
        force: true,
      });
    }
    return result;
  } catch (error) {
    if (requestId === requestCounter && lastEnabledState === enabled) {
      lastEnabledState = undefined;
    }
    throw error;
  } finally {
    if (inFlightRequest?.promise === pendingPromise) {
      inFlightRequest = undefined;
    }
  }
}
export { applyRemoteControlEnabled };
