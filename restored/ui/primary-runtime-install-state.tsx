// Restored from ref/webview/assets/primary-runtime-install-state-BkTYe0Xa.js

import { g as appScopeG, t as appScopeT } from "../boundaries/tanstack-query";
import { r as defaultHostId } from "../boundaries/host-config";
import { h as vscodeApi } from "../boundaries/vscode-api";
import { n as rpcN } from "../boundaries/rpc";

const INSTALL_TIMEOUT_MS = 90_000;

const pendingInstallRequests = new Map<string, Promise<unknown>>();
let installRequestQueue = Promise.resolve();

export interface PrimaryRuntimeInstallState {
  phase?: PrimaryRuntimeInstallPhase;
}

export type PrimaryRuntimeInstallPhase =
  | "ready"
  | "error"
  | "checking"
  | "downloading"
  | "verifying"
  | "extracting"
  | "validating"
  | "installed"
  | "configuring";

export interface CancelPrimaryRuntimeInstallOptions {
  hostId: string;
}

export interface RunPrimaryRuntimeInstallRequestOptions {
  hostId: string;
  release: string | null;
  request: "finishInstall";
}

export function isPrimaryRuntimeInstalling(): boolean {
  return pendingInstallRequests.size > 0;
}

export function cancelPrimaryRuntimeInstall({
  hostId,
}: CancelPrimaryRuntimeInstallOptions): Promise<void> {
  const primaryRuntime = rpcN.primaryRuntime;
  if (primaryRuntime == null) {
    return Promise.reject(new Error("Primary runtime is unavailable"));
  }
  return Promise.resolve(primaryRuntime.cancelInstall({ hostId }));
}

export function runPrimaryRuntimeInstallRequest({
  hostId,
  request,
  release,
}: RunPrimaryRuntimeInstallRequestOptions): Promise<unknown> {
  const requestKey = JSON.stringify({ hostId, release });
  const existingRequest = pendingInstallRequests.get(requestKey);
  if (existingRequest != null) {
    return existingRequest;
  }

  const newRequest = installRequestQueue.then(() => {
    const primaryRuntime = rpcN.primaryRuntime;
    if (primaryRuntime == null) {
      throw new Error("Primary runtime is unavailable");
    }
    return primaryRuntime[request]({ hostId, release });
  });

  pendingInstallRequests.set(requestKey, newRequest);
  installRequestQueue = newRequest.then(
    () => undefined,
    () => undefined,
  );

  newRequest
    .finally(() => {
      pendingInstallRequests.delete(requestKey);
    })
    .catch(() => undefined);

  return newRequest;
}

export const nullPrimaryRuntimeReleaseQueryOptions = appScopeG(appScopeT, null);
export const latestPrimaryRuntimeReleaseQueryOptions = appScopeG(
  appScopeT,
  "latest",
);

export function isPrimaryRuntimeInstallInProgress(
  state: PrimaryRuntimeInstallState | null | undefined,
): boolean {
  switch (state?.phase) {
    case undefined:
    case "ready":
    case "error":
      return false;
    case "checking":
    case "downloading":
    case "verifying":
    case "extracting":
    case "validating":
    case "installed":
    case "configuring":
      return true;
  }
}

async function finishPrimaryRuntimeInstall({
  hostId = defaultHostId,
  release = "latest",
}: {
  hostId?: string;
  release?: string;
} = {}): Promise<unknown> {
  return runPrimaryRuntimeInstallRequest({
    hostId,
    release,
    request: "finishInstall",
  });
}

export interface FinishPrimaryRuntimeInstallWithTimeoutOptions {
  hostId?: string;
  release?: string;
}

export async function finishPrimaryRuntimeInstallWithTimeout({
  hostId = defaultHostId,
  release = "latest",
}: FinishPrimaryRuntimeInstallWithTimeoutOptions = {}): Promise<void> {
  const installPromise = finishPrimaryRuntimeInstall({ hostId, release });
  let timeoutId: number | undefined;

  try {
    const result = await Promise.race([
      installPromise.then(() => "ready" as const),
      new Promise<"timeout">((resolve) => {
        timeoutId = window.setTimeout(
          () => resolve("timeout"),
          INSTALL_TIMEOUT_MS,
        );
      }),
    ]);

    if (result === "timeout") {
      vscodeApi.warning("Primary runtime install timed out before first turn", {
        safe: {
          timeoutMs: INSTALL_TIMEOUT_MS,
        },
        sensitive: {},
      });
      installPromise.catch((error: unknown) => {
        vscodeApi.error(
          "Primary runtime install failed after first-turn timeout",
          {
            safe: {},
            sensitive: { error },
          },
        );
      });
    }
  } catch (error) {
    vscodeApi.error("Primary runtime install failed before first turn", {
      safe: {},
      sensitive: { error },
    });
  } finally {
    if (timeoutId != null) {
      window.clearTimeout(timeoutId);
    }
  }
}

export { runPrimaryRuntimeInstallRequest as primaryRuntimeInstallStateSState };
