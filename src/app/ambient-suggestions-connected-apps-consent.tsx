// Restored from ref/webview/assets/ambient-suggestions-connected-apps-consent-DQgR2iFO.js
// ambient-suggestions-connected-apps-consent-DQgR2iFO chunk restored from the Codex webview bundle.
import { T as persistedSignal } from "../shared/utils/persisted-signal.tsx";
export interface ConnectedApp {
  id: string;
  name: string;
  isAccessible: boolean;
  isEnabled: boolean;
}
export const hasSeenAmbientSuggestionsConnectedAppsConsent = persistedSignal(
  "has-seen-ambient-suggestions-connected-apps-consent",
  false,
);
export const hasDismissedAmbientSuggestionsConnectAppsRow = persistedSignal(
  "has-dismissed-ambient-suggestions-connect-apps-row",
  false,
);
export function filterAccessibleAndEnabledApps(
  apps: ConnectedApp[],
): ConnectedApp[] {
  return apps.filter((app) => app.isAccessible && app.isEnabled);
}
