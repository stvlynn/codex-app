// Restored from ref/webview/assets/hooks-settings-model-CesfUzEC.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/hooks-settings-model-CesfUzEC.js
 *   Chunk: hooks-settings-model-CesfUzEC
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/hooks-settings-model/types.ts
 */

export type HookSource =
  | "plugin"
  | "user"
  | "admin"
  | "project"
  | "sessionFlags"
  | "unknown";

export type HookEventName =
  | "preToolUse"
  | "permissionRequest"
  | "postToolUse"
  | "preCompact"
  | "postCompact"
  | "sessionStart"
  | "userPromptSubmit"
  | "subagentStart"
  | "subagentStop"
  | "stop";

export type TrustStatus = "untrusted" | "modified" | "managed" | "trusted";

export interface HookEntry {
  key: string;
  source: string;
  pluginId?: string | null;
  trustStatus: TrustStatus;
  enabled: boolean;
  displayOrder: number;
  eventName: HookEventName;
}

export interface HookGroup {
  cwd: string;
  hooks: HookEntry[];
  warnings: HookWarning[];
  errors: HookError[];
}

export interface HookWarning {
  path: string;
  message: string;
}

export interface HookError {
  path: string;
  message: string;
}

export interface HookSummary {
  id: string;
  installed: boolean;
  hooks: HookEntry[];
}

export interface HookPluginSummary {
  id: "plugin";
  entry: HookGroup;
  pluginEntries: Array<{ pluginId: string | null; entry: HookGroup }>;
}

export interface HookProjectSummary {
  id: "project";
  projectEntries: HookGroup[];
}

export interface HookSimpleSummary {
  id: HookSource;
  entry: HookGroup;
}

export type HookSettingsSummary =
  | HookPluginSummary
  | HookProjectSummary
  | HookSimpleSummary;

export interface HookEventStats {
  eventName: HookEventName;
  active: number;
  installed: number;
  needsReview: number;
}

export interface HookIssueSummary {
  issueCount: number;
  needsReview: number;
}

export interface HookSourceConfig {
  source: HookSource;
  pluginId?: string | null;
  projectRoot?: string;
}

export const UNKNOWN_HOOK_PLUGIN_ID = "__unknown__";
