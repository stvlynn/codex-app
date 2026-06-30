// Restored from ref/webview/assets/browser-sidebar-comment-mode-coachmark-state-B5FxFSFk.js
// browser-sidebar-comment-mode-coachmark-state-B5FxFSFk chunk restored from the Codex webview bundle.
import {
  hydratePersistedAtoms,
  setPersistedAtomItem,
  getPersistedAtomItem,
} from "../../shared/utils/persisted-atom-store.ts";
import { filterImportableProfiles } from "../../shared/hooks/use-browser-profile-import.ts";
const HAS_SEEN_BROWSER_PROFILE_IMPORT_NUX_KEY =
  "has-seen-browser-profile-import-nux-v1";
const COACHMARK_DISMISSED_KEY =
  "browser-sidebar-comment-mode-coachmark-dismissed";

// Simple persisted signal using the atom store
function createPersistedSignal<T>(
  key: string,
  initialValue: T,
): {
  value: T;
} {
  const stored = getPersistedAtomItem(key);
  return {
    value: stored !== undefined ? (stored as T) : initialValue,
  };
}

// Simple persisted atom using the atom store
function createPersistedAtom<T>(
  key: string,
  initialValue: T,
): {
  value: T;
} {
  const stored = getPersistedAtomItem(key);
  return {
    value: stored !== undefined ? (stored as T) : initialValue,
  };
}
export const hasSeenBrowserProfileImportNuxSignal = createPersistedSignal(
  HAS_SEEN_BROWSER_PROFILE_IMPORT_NUX_KEY,
  false,
);
export interface CoachmarkVisibilityParams {
  baseGateEnabled: boolean;
  hasSeen: boolean;
  hasSettledOpen: boolean;
  isVisible: boolean;
  profiles: unknown[] | null;
  profilesQuerySucceeded: boolean;
  serviceAvailable: boolean;
}
export function shouldShowCoachmark({
  baseGateEnabled,
  hasSeen,
  hasSettledOpen,
  isVisible,
  profiles,
  profilesQuerySucceeded,
  serviceAvailable,
}: CoachmarkVisibilityParams): boolean {
  return (
    isVisible &&
    hasSettledOpen &&
    baseGateEnabled &&
    serviceAvailable &&
    profilesQuerySucceeded &&
    profiles != null &&
    filterImportableProfiles(profiles).length > 0 &&
    hasSeen === false
  );
}
export const coachmarkDismissedAtom = createPersistedAtom(
  COACHMARK_DISMISSED_KEY,
  false,
);
export function dismissCoachmark(): void {
  setPersistedAtomItem(COACHMARK_DISMISSED_KEY, true);
}
export function hydrateCoachmarkState(): void {
  hydratePersistedAtoms();
}
