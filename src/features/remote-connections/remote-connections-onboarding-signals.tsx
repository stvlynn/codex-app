// Restored from ref/webview/assets/remote-connections-onboarding-signals-BDrBMO3c.js
// remote-connections-onboarding-signals-BDrBMO3c chunk restored from the Codex webview bundle.
import { g as appScopeG, t as appScopeT } from "../../shared/boundaries/tanstack-query/vscode.ts";
import { T as persistedSignal } from "../../shared/utils/persisted-signal.tsx";
export const hasSeenRemoteConnectionsHomeAnnouncement = persistedSignal(
  "has-seen-remote-connections-home-announcement",
  false,
);
export const remoteConnectionsOnboardingStatus = appScopeG(
  appScopeT,
  "hidden" as "hidden" | "visible" | "dismissed",
);
