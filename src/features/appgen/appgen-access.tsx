// Restored from ref/webview/assets/appgen-access-C6Cefphc.js
// Helpers for managing AppGen access modes, groups, and user invites.

import { t as uniq } from "../../shared/boundaries/lodash/uniq.ts";
export interface AccessOption {
  disabled: boolean;
  value: string;
}
export interface AccessModeOptions {
  availableAccessModes?: string[];
  currentAccessMode: string;
  isWorkspaceAccount: boolean;
}
export function buildAccessModeOptions({
  availableAccessModes,
  currentAccessMode,
  isWorkspaceAccount,
}: AccessModeOptions): AccessOption[] {
  const modes =
    availableAccessModes ??
    (isWorkspaceAccount ? ["workspace_all", "custom"] : []);
  const options: AccessOption[] = modes.map((mode) => ({
    disabled: false,
    value: mode,
  }));
  return modes.some((mode) => mode === currentAccessMode)
    ? options
    : [
        ...options,
        {
          disabled: true,
          value: currentAccessMode,
        },
      ];
}
export interface AccessGroup {
  id: string;
  source: "workspace" | "tenant";
}
export interface AccessPolicy {
  access_mode: string;
  allowed_users: Array<{
    account_user_id: string;
    email: string;
  }>;
  allowed_groups: AccessGroup[];
  allowed_workspace_group_ids?: string[];
  allowed_tenant_group_ids?: string[];
  allowed_account_user_ids?: string[];
}
export interface BuildAccessPolicyInput {
  accessGroups: AccessGroup[];
  accessMode: string;
  allowedUserEmails: string[];
  canManageInvitees: boolean;
  existingGroups: AccessGroup[];
  knownAccessGroups: AccessGroup[];
  selectedGroups: AccessGroup[];
}
export function buildAccessPolicy({
  accessGroups,
  accessMode,
  allowedUserEmails,
  canManageInvitees,
  existingGroups,
  knownAccessGroups,
  selectedGroups,
}: BuildAccessPolicyInput): Partial<AccessPolicy> {
  if (!canManageInvitees) {
    return {
      access_mode: accessMode,
    };
  }
  return {
    access_mode: accessMode,
    allowed_user_emails: compactAndDeduplicateEmails(allowedUserEmails),
    ...buildGroupPolicy({
      accessGroups,
      knownAccessGroups,
      existingGroups,
      removedGroups: [],
      selectedGroups,
    }),
  };
}
export interface AccessSummaryInput {
  accessPolicy?: AccessPolicy;
}
export interface AccessSummary {
  accessMode: string;
  groupCount: number;
  userCount: number;
}
export function summarizeAccessPolicy(
  input: AccessSummaryInput,
): AccessSummary {
  if (input.accessPolicy == null) {
    return {
      accessMode: "admins_only",
      groupCount: 0,
      userCount: 0,
    };
  }
  return {
    accessMode: input.accessPolicy.access_mode,
    groupCount:
      (input.accessPolicy.allowed_tenant_group_ids?.length ?? 0) +
      (input.accessPolicy.allowed_workspace_group_ids?.length ?? 0),
    userCount: Math.max(
      (input.accessPolicy.allowed_account_user_ids?.length ?? 1) - 1,
      0,
    ),
  };
}
export interface RemoveUserFromPolicyInput {
  accessPolicy: AccessPolicy;
  currentUserId: string;
}
export function removeUserFromAccessPolicy({
  accessPolicy,
  currentUserId,
}: RemoveUserFromPolicyInput): Partial<AccessPolicy> {
  return {
    access_mode: accessPolicy.access_mode,
    allowed_user_emails: compactAndDeduplicateEmails(
      accessPolicy.allowed_users
        .filter((user) => user.account_user_id !== currentUserId)
        .map((user) => user.email),
    ),
  };
}
export interface RemoveGroupFromPolicyInput {
  accessGroups: AccessGroup[];
  accessPolicy: AccessPolicy;
  group: AccessGroup;
  knownAccessGroups: AccessGroup[];
}
export function removeGroupFromAccessPolicy({
  accessGroups,
  accessPolicy,
  group,
  knownAccessGroups,
}: RemoveGroupFromPolicyInput): Partial<AccessPolicy> {
  return {
    access_mode: accessPolicy.access_mode,
    allowed_user_emails: compactAndDeduplicateEmails(
      accessPolicy.allowed_users.map((user) => user.email),
    ),
    ...buildGroupPolicy({
      accessGroups,
      knownAccessGroups,
      existingGroups: accessPolicy.allowed_groups.filter(
        (existingGroup) => existingGroup.id !== group.id,
      ),
      removedGroups: [group],
      selectedGroups: [],
    }),
  };
}
interface BuildGroupPolicyInput {
  accessGroups: AccessGroup[];
  knownAccessGroups: AccessGroup[];
  existingGroups: AccessGroup[];
  removedGroups: AccessGroup[];
  selectedGroups: AccessGroup[];
}
function buildGroupPolicy({
  accessGroups,
  knownAccessGroups,
  existingGroups,
  removedGroups,
  selectedGroups,
}: BuildGroupPolicyInput): Partial<AccessPolicy> {
  const groupById = new Map(
    [...knownAccessGroups, ...accessGroups].map((group) => [group.id, group]),
  );
  const resolvedExisting = existingGroups.flatMap((group) => {
    const resolved = groupById.get(group.id);
    return resolved == null ? [] : [resolved];
  });
  const resolvedRemoved = removedGroups.flatMap((group) => {
    const resolved = groupById.get(group.id);
    return resolved == null ? [] : [resolved];
  });
  const selected = [...resolvedExisting, ...selectedGroups];
  const considered = [...selectedGroups, ...resolvedRemoved];
  const includesWorkspace = considered.some(
    (group) => group.source === "workspace",
  );
  const includesTenant = considered.some((group) => group.source === "tenant");
  return {
    ...(includesWorkspace
      ? {
          allowed_workspace_group_ids: getGroupIds(
            selected.filter((group) => group.source === "workspace"),
          ),
        }
      : {}),
    ...(includesTenant
      ? {
          allowed_tenant_group_ids: getGroupIds(
            selected.filter((group) => group.source === "tenant"),
          ),
        }
      : {}),
  };
}
function compactAndDeduplicateEmails(
  emails: Array<string | null | undefined>,
): string[] {
  return uniq(emails.flatMap((email) => (email == null ? [] : [email])));
}
function getGroupIds(groups: AccessGroup[]): string[] {
  return Array.from(new Set(groups.map((group) => group.id)));
}
