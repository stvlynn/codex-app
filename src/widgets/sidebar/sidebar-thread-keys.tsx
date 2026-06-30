// Restored from ref/webview/assets/sidebar-thread-keys-Ch_amVKz.js

function normalizeConversationId(id: string): string {
  return id;
}

const LOCAL_PREFIX = "local:";
const REMOTE_PREFIX = "remote:";
const PENDING_WORKTREE_PREFIX = "pending-worktree:";

export type SidebarThreadKeyKind = "local" | "remote" | "pending-worktree";

export interface LocalSidebarThreadKey {
  kind: "local";
  key: string;
  conversationId: string;
}

export interface RemoteSidebarThreadKey {
  kind: "remote";
  key: string;
  taskId: string;
}

export interface PendingWorktreeSidebarThreadKey {
  kind: "pending-worktree";
  key: string;
  pendingWorktreeId: string;
}

export type SidebarThreadKey =
  | LocalSidebarThreadKey
  | RemoteSidebarThreadKey
  | PendingWorktreeSidebarThreadKey;

export function makeLocalKey(conversationId: string): string {
  return `${LOCAL_PREFIX}${conversationId}`;
}

export function makeRemoteKey(taskId: string): string {
  return `${REMOTE_PREFIX}${taskId}`;
}

export function makePendingWorktreeKey(pendingWorktreeId: string): string {
  return `${PENDING_WORKTREE_PREFIX}${pendingWorktreeId}`;
}

export function parseSidebarThreadKey(
  key: string | null | undefined,
): SidebarThreadKey | null {
  if (key == null) return null;

  if (key.startsWith(LOCAL_PREFIX)) {
    const conversationId = normalizeConversationId(key.slice(6));
    return {
      kind: "local",
      key: makeLocalKey(conversationId),
      conversationId,
    };
  }

  if (key.startsWith(REMOTE_PREFIX)) {
    const taskId = key.slice(7);
    return { kind: "remote", key: makeRemoteKey(taskId), taskId };
  }

  if (key.startsWith(PENDING_WORKTREE_PREFIX)) {
    const pendingWorktreeId = key.slice(17);
    return {
      kind: "pending-worktree",
      key: makePendingWorktreeKey(pendingWorktreeId),
      pendingWorktreeId,
    };
  }

  return null;
}

export function buildSidebarThreadKey(options: {
  localId?: string;
  remoteId?: string;
  pendingId?: string;
}): string | null {
  const { localId, remoteId, pendingId } = options;
  if (localId) return makeLocalKey(normalizeConversationId(localId));
  if (remoteId) return makeRemoteKey(remoteId);
  if (pendingId) return makePendingWorktreeKey(pendingId);
  return null;
}

export function extractLocalConversationId(
  key: string | null | undefined,
): string | null {
  const parsed = parseSidebarThreadKey(key);
  return parsed?.kind === "local" ? parsed.conversationId : null;
}

export function extractThreadId(key: string | null | undefined): string | null {
  const parsed = parseSidebarThreadKey(key);
  switch (parsed?.kind) {
    case "local":
      return parsed.conversationId;
    case "remote":
      return parsed.taskId;
    case "pending-worktree":
    case undefined:
      return null;
  }
}

export function getSidebarThreadKeyForRouting(
  key: string | null | undefined,
): string | null {
  const parsed = parseSidebarThreadKey(key);
  switch (parsed?.kind) {
    case "local":
      return normalizeConversationId(parsed.conversationId);
    case "remote":
      return parsed.taskId;
    case "pending-worktree":
      return parsed.pendingWorktreeId;
    case undefined:
      throw new Error("Invalid sidebar thread key");
  }
}

export {
  makeLocalKey,
  makeRemoteKey,
  makePendingWorktreeKey,
  parseSidebarThreadKey,
  buildSidebarThreadKey,
  extractLocalConversationId,
  extractThreadId,
  getSidebarThreadKeyForRouting,
};
