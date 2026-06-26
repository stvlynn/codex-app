// Restored from ref/webview/assets/build-start-conversation-params-D8aKUHyS.js

import { Yt as buildAttachmentList } from "../boundaries/host-config";
import { Gi as buildPermissions } from "../boundaries/src-l0hb-m-z-p";

export interface StartConversationParamsInput {
  agentMode: string;
  permissionProfileId?: string | null;
  shouldSendPermissionOverrides?: boolean;
  workspaceRoots: string[];
  config: unknown;
  configOverrides?: unknown;
  input: string;
  commentAttachments?: unknown[];
  collaborationMode?: string | null;
  responsesapiClientMetadata?: unknown;
  serviceTier?: string | null;
  cwd: string;
  fileAttachments: unknown[];
  addedFiles: unknown[];
  memoryPreferences?: unknown;
  threadSource?: string | null;
  threadStartKind?: string | null;
  workspaceKind?: "project" | "projectless" | string;
  projectlessOutputDirectory?: string | null;
  projectAssignment?: unknown;
  additionalDeveloperInstructions?: string | null;
}

export interface PermissionProfile {
  id: string;
  extends: null;
}

export interface Permissions {
  activePermissionProfile?: PermissionProfile;
  runtimeWorkspaceRoots?: string[];
  approvalsReviewer?: string | null;
  [key: string]: unknown;
}

export interface StartConversationParams {
  input: string;
  commentAttachments?: unknown[];
  workspaceRoots: string[];
  collaborationMode?: string | null;
  responsesapiClientMetadata?: unknown;
  serviceTier?: string | null;
  useAppServerPermissionDefault?: true;
  permissions?: Permissions;
  approvalsReviewer?: string | null;
  cwd: string;
  attachments: unknown[];
  workspaceKind: string;
  projectAssignment?: unknown;
  threadSource?: string | null;
  threadStartKind?: string | null;
  config?: unknown;
  projectlessOutputDirectory?: string | null;
  memoryPreferences?: unknown;
  additionalDeveloperInstructions?: string | null;
}

/**
 * Builds the parameter object used to start a new conversation.
 *
 * The returned object aggregates file attachments, computes permission
 * overrides when requested, and includes optional projectless output
 * configuration.
 */
export function buildStartConversationParams({
  agentMode,
  permissionProfileId,
  shouldSendPermissionOverrides,
  workspaceRoots,
  config,
  configOverrides,
  input,
  commentAttachments,
  collaborationMode,
  responsesapiClientMetadata,
  serviceTier,
  cwd,
  fileAttachments,
  addedFiles,
  memoryPreferences,
  threadSource,
  threadStartKind,
  workspaceKind = "project",
  projectlessOutputDirectory,
  projectAssignment,
  additionalDeveloperInstructions,
}: StartConversationParamsInput): StartConversationParams {
  if (workspaceKind === "projectless" && projectlessOutputDirectory == null) {
    throw new Error("Projectless conversations require an output directory");
  }

  const attachments = buildAttachmentList([...fileAttachments, ...addedFiles]);
  const permissions =
    shouldSendPermissionOverrides === false
      ? null
      : (buildPermissions(
          agentMode,
          workspaceRoots,
          config,
        ) as Permissions | null);

  if (permissions != null && permissionProfileId != null) {
    permissions.activePermissionProfile = {
      id: permissionProfileId,
      extends: null,
    };
    permissions.runtimeWorkspaceRoots = workspaceRoots;
  }

  return {
    input,
    commentAttachments,
    workspaceRoots,
    collaborationMode,
    ...(responsesapiClientMetadata === undefined
      ? {}
      : { responsesapiClientMetadata }),
    serviceTier,
    ...(permissions == null
      ? { useAppServerPermissionDefault: true as const }
      : { permissions, approvalsReviewer: permissions.approvalsReviewer }),
    cwd,
    attachments,
    workspaceKind,
    ...(projectAssignment === undefined ? {} : { projectAssignment }),
    ...(threadSource === undefined ? {} : { threadSource }),
    ...(threadStartKind === undefined ? {} : { threadStartKind }),
    ...(configOverrides === undefined ? {} : { config: configOverrides }),
    ...(workspaceKind === "projectless"
      ? { projectlessOutputDirectory: projectlessOutputDirectory! }
      : {}),
    ...(memoryPreferences === undefined ? {} : { memoryPreferences }),
    ...(additionalDeveloperInstructions === undefined
      ? {}
      : { additionalDeveloperInstructions }),
  };
}
