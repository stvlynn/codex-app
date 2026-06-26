// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared types and constants.

export type AutomationKind = "cron" | "heartbeat";

export type ExecutionEnvironment = "local" | "worktree" | "thread";

export interface Automation {
  id: string | null;
  kind: AutomationKind;
  name: string;
  prompt: string;
  status: "ACTIVE" | "PAUSED";
  cwds: string[];
  executionEnvironment: ExecutionEnvironment | null;
  localEnvironmentConfigPath: string | null;
  targetThreadId: string | null;
  model: string | null;
  reasoningEffort: string | null;
  rrule: string | null;
}

export interface AutomationDraft {
  id: string | null;
  kind: AutomationKind;
  name: string;
  prompt: string;
  status: "ACTIVE" | "PAUSED";
  cwds: string[];
  executionEnvironment: ExecutionEnvironment | null;
  localEnvironmentConfigPath: string | null;
  targetThreadId: string | null;
  model: string | null;
  reasoningEffort: string | null;
  rawRrule: string | null;
  scheduleConfig: unknown;
  scheduleDirty: boolean;
}

export interface DirectiveSeed {
  id: string | null;
  mode: "view" | "edit" | "create";
  kind: AutomationKind | null;
  name: string | null;
  prompt: string | null;
  status: "ACTIVE" | "PAUSED" | null;
  cwds: string[];
  executionEnvironment: ExecutionEnvironment | null;
  localEnvironmentConfigPath: string | null;
  targetThreadId: string | null;
  model: string | null;
  reasoningEffort: string | null;
  rrule: string | null;
}

export interface DirectiveState {
  directiveKey: string;
  mode: "view" | "edit" | "create";
  id: string | null;
  kind: AutomationKind;
  name: string;
  prompt: string;
  rrule: string | null;
  cwds: string[];
  executionEnvironment: ExecutionEnvironment | null;
  localEnvironmentConfigPath: string | null;
  model: string | null;
  reasoningEffort: string | null;
  targetThreadId: string | null;
  status: "ACTIVE" | "PAUSED";
}

export interface ValidationResult {
  trimmedName: string;
  trimmedPrompt: string;
  missingRequirements: string[];
  canSave: boolean;
}

export interface ModelSettings {
  isLoading: boolean;
  model: string | null;
  reasoningEffort: string | null;
}

export interface IntlShape {
  formatMessage: (
    descriptor: { id: string; defaultMessage: string; description?: string },
    values?: Record<string, string | number>,
  ) => string;
  formatDate: (date: Date, options?: Record<string, string>) => string;
}
