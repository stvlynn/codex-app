// Restored from ref/webview/assets/collaboration-mode-queries-CTBlLhk8.js
// collaboration-mode-queries-CTBlLhk8 chunk restored from the Codex webview bundle.
import { appScopeM, appScopeP, appScopeT } from "../boundaries/app-scope";
import { useHostConfigBt } from "../boundaries/host-config";
import { threadContextInputsM } from "../app/thread-context-inputs";
import { vscodeApiU } from "../boundaries/tanstack-query/vscode";
const COLLABORATION_MODE_ORDER = ["plan", "default"] as const;
type CollaborationMode = (typeof COLLABORATION_MODE_ORDER)[number] | string;
interface CollaborationModeEntry {
  mode: CollaborationMode;
}
interface CollaborationModeListParams {
  hostId: string;
}
interface CollaborationModeListResponse {
  data: CollaborationModeEntry[];
}
function normalizeCollaborationMode(
  entry: CollaborationModeEntry,
): CollaborationModeEntry {
  const { mode } = entry;
  if (mode == null || mode === "plan" || mode === "default") {
    return entry;
  }
  return {
    ...entry,
    mode: "default",
  };
}
function orderCollaborationModes(
  entries: CollaborationModeEntry[],
  order: readonly CollaborationMode[],
): CollaborationModeEntry[] {
  const byMode = new Map<CollaborationMode, CollaborationModeEntry>();
  for (const entry of entries) {
    const normalized = normalizeCollaborationMode(entry);
    if (!byMode.has(normalized.mode)) {
      byMode.set(normalized.mode, normalized);
    }
  }
  return order
    .map((mode) => byMode.get(mode))
    .filter((entry): entry is CollaborationModeEntry => entry != null);
}
function buildCollaborationModeListQuery(hostId: string) {
  return {
    queryKey: ["collaboration-modes", "list", hostId],
    staleTime: vscodeApiU.INFINITE,
    queryFn: async () => {
      const response = (await useHostConfigBt("list-collaboration-modes", {
        hostId,
      } as CollaborationModeListParams)) as CollaborationModeListResponse;
      return orderCollaborationModes(response.data, COLLABORATION_MODE_ORDER);
    },
  };
}
export const collaborationModeListQuery = appScopeP(
  appScopeT,
  (hostId: string) => buildCollaborationModeListQuery(hostId),
);
export const collaborationModeListQueryFromContext = appScopeM(
  appScopeT,
  ({ get }) => buildCollaborationModeListQuery(get(threadContextInputsM)),
);
