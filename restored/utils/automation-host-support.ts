// Restored from ref/webview/assets/automation-host-support-pSeSdr0l.js

import { r as configuredHostId } from "../boundaries/host-config";

interface ElectronBridgeHostConfig {
  id: string;
  kind: "local" | string;
}

interface ElectronBridgeApi {
  getSharedObjectSnapshotValue?: (
    key: "host_config",
  ) => ElectronBridgeHostConfig | null | undefined;
}

declare global {
  interface Window {
    electronBridge?: ElectronBridgeApi;
  }
}

/**
 * Returns `true` when the given host identifier corresponds to the local
 * automation host.
 *
 * In a browser environment this checks the live `host_config` snapshot exposed
 * by the Electron bridge when available; otherwise it falls back to comparing
 * the identifier with the configured host id.
 */
export function isLocalAutomationHost(hostId: string): boolean {
  if (typeof window === "undefined") {
    return hostId === configuredHostId;
  }

  const hostConfig =
    window.electronBridge?.getSharedObjectSnapshotValue?.("host_config") ??
    null;

  if (hostConfig == null) {
    return hostId === configuredHostId;
  }

  return hostConfig.id === hostId && hostConfig.kind === "local";
}
