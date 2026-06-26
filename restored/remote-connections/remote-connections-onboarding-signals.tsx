// Restored from ref/webview/assets/remote-connections-onboarding-signals-BDrBMO3c.js
// remote-connections-onboarding-signals-BDrBMO3c chunk restored from the Codex webview bundle.
import { g as appScopeG, t as appScopeT } from "../boundaries/tanstack-query";
import { T as persistedSignal } from "../utils/persisted-signal";
export const hasSeenRemoteConnectionsHomeAnnouncement = persistedSignal(
  "has-seen-remote-connections-home-announcement",
  false,
);
export const remoteConnectionsOnboardingStatus = appScopeG(
  appScopeT,
  "hidden" as "hidden" | "visible" | "dismissed",
);
