// Restored from ref/webview/assets/heartbeat-automation-permissions-CKjRbTXW.js
// Heartbeat automation permissions signals restored from the Codex webview bundle.
import {
  l as createScopeAtom,
  t as scopeAtomValue,
} from "../boundaries/app-scope";
import {
  at as resolvePermissionsFromAutomation,
  st as resolvePermissionsFromHeartbeat,
} from "../../app/thread-context-inputs";
import { persistedSignalT } from "./persisted-signal";
export interface PermissionProfile {
  activePermissionProfile?: {
    id: unknown;
    extends: null;
  };
  runtimeWorkspaceRoots?: unknown;
  approvalPolicy: unknown;
  approvalsReviewer: unknown;
  sandboxPolicy: unknown;
  [key: string]: unknown;
}
export const heartbeatThreadPermissionsById = persistedSignalT(
  "heartbeat-thread-permissions-by-id",
  {},
);
function normalizePermissionProfile(
  input: Record<string, unknown> | null | undefined,
): PermissionProfile | null {
  if (
    input == null ||
    input.approvalPolicy == null ||
    input.approvalsReviewer == null ||
    input.sandboxPolicy == null
  ) {
    return null;
  }
  const normalized: PermissionProfile = {
    approvalPolicy: input.approvalPolicy,
    approvalsReviewer: input.approvalsReviewer,
    sandboxPolicy: input.sandboxPolicy,
  };
  if (
    "activePermissionProfile" in input &&
    input.activePermissionProfile !== undefined
  ) {
    normalized.activePermissionProfile =
      input.activePermissionProfile as PermissionProfile["activePermissionProfile"];
  } else if ("permissions" in input && input.permissions != null) {
    normalized.activePermissionProfile = {
      id: input.permissions,
      extends: null,
    };
  }
  if ("runtimeWorkspaceRoots" in input && input.runtimeWorkspaceRoots != null) {
    normalized.runtimeWorkspaceRoots = input.runtimeWorkspaceRoots;
  }
  return normalized;
}
function resolvePermissions(
  heartbeatContext: Record<string, unknown> | null | undefined,
  automationPayload: Record<string, unknown> | null | undefined,
): PermissionProfile | null {
  return (
    normalizePermissionProfile(automationPayload) ??
    (heartbeatContext?.turnId == null ||
    (heartbeatContext.params as Record<string, unknown> | undefined)
      ?.collaborationMode == null
      ? null
      : normalizePermissionProfile(
          (heartbeatContext.params as Record<string, unknown>) ?? {},
        ))
  );
}
export function getResolvedPermissions(
  heartbeatContext: Record<string, unknown> | null | undefined,
  automationPayload: Record<string, unknown> | null | undefined,
  fallback: PermissionProfile | null | undefined,
): PermissionProfile | null {
  return (
    resolvePermissions(heartbeatContext, automationPayload) ?? fallback ?? null
  );
}
export const permissionProfileFingerprintAtom = createScopeAtom(
  scopeAtomValue,
  (threadId: string | null | undefined, { get }) => {
    const permissions = resolvePermissions(
      get(resolvePermissionsFromHeartbeat, threadId),
      get(resolvePermissionsFromAutomation, threadId),
    );
    return permissions == null ? null : JSON.stringify(permissions);
  },
);
export function mergePermissionsRecord(
  record: Record<string, unknown>,
  key: string,
  value: unknown,
): Record<string, unknown> {
  if (value == null || JSON.stringify(record[key]) === JSON.stringify(value)) {
    return record;
  }
  return {
    ...record,
    [key]: value,
  };
}
export { resolvePermissions };
