// Restored from ref/webview/assets/announcement-atoms-CRReXLJz.js
// announcement-atoms-CRReXLJz chunk restored from the Codex webview bundle.
import { x as appScopeX } from "../shared/boundaries/tanstack-query/vscode.ts";
import { T as persistedAtom } from "../shared/utils/persisted-atom.tsx";
export const hasSeenAppGenAnnouncement = persistedAtom(
  "has-seen-appgen-announcement",
  false,
);
export const hasSeenKnowledgeWorkAnnouncement = persistedAtom(
  "has-seen-knowledge-work-announcement",
  false,
);
export const workspaceMessageLastSeenAtByAccount = persistedAtom(
  "workspace-message-last-seen-at-by-account",
  {},
);
export const hasSeenFastModeAnnouncement = persistedAtom(
  "has-seen-fast-mode-announcement",
  false,
);
export const hasSeenWorkPluginsAnnouncement = persistedAtom(
  "has-seen-work-plugins-announcement",
  false,
);
export const isAnnouncementBannerVisible = appScopeX(false);
export function getLastSeenAt(
  lastSeenMap: Record<string, number> | null,
  accountId: string | null,
): number | null {
  if (accountId == null) {
    return null;
  }
  return lastSeenMap?.[accountId] ?? null;
}
export function updateLastSeenAt(
  lastSeenMap: Record<string, number>,
  accountId: string | null,
  timestamp: number,
): Record<string, number> {
  const currentValue = getLastSeenAt(lastSeenMap, accountId);
  if (currentValue != null && currentValue >= timestamp) {
    return lastSeenMap;
  }
  return {
    ...lastSeenMap,
    [accountId ?? "anonymous"]: timestamp,
  };
}
