// Restored from ref/webview/assets/permissions-mode-defaults-D1kNIn1C.js
// PermissionsModeDefaults chunk restored from the Codex webview bundle.
import {
  getPersistedAtomStore,
  setPersistedAtomItem,
} from "../utils/persisted-atom-store";
import { persistedAtomT as persistedAtom } from "../utils/persisted-atom";

const AGENT_MODE_BY_HOST_ID_KEY = "agent-mode-by-host-id";

// Export order must match the manifest: i, n, r, t
export const permissionsModeDefaults = persistedAtom(
  AGENT_MODE_BY_HOST_ID_KEY,
  {},
);

export const preferredNonFullAccessAgentModeByHostId = persistedAtom(
  "preferred-non-full-access-agent-mode-by-host-id",
  {},
);

export function setPermissionModeDefault(hostId: string, mode: string) {
  setPersistedAtomItem(AGENT_MODE_BY_HOST_ID_KEY, {
    ...getPersistedAtomStore(AGENT_MODE_BY_HOST_ID_KEY, {}),
    [hostId]: mode,
  });
}

export function getPermissionModeDefault(
  hostId: string,
  defaults: Record<string, string>,
): string | null {
  return defaults[hostId] ?? null;
}
