// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared constants and state atoms.

import { X as appScopeX } from "../../boundaries/tanstack-query";
import {
  i as buildHeartbeatScheduleConfig,
  m as buildCronScheduleConfig,
  p as parseHeartbeatSchedule,
  r as createDefaultScheduleConfig,
} from "../../boundaries/rrule";
import type { AutomationDraft, ExecutionEnvironment } from "./types";

export const DEFAULT_AUTOMATION_DRAFT: AutomationDraft = {
  id: null,
  kind: "cron",
  name: "",
  prompt: "",
  status: "ACTIVE",
  cwds: [],
  executionEnvironment: "worktree",
  localEnvironmentConfigPath: null,
  targetThreadId: null,
  model: null,
  reasoningEffort: null,
  rawRrule: null,
  scheduleConfig: createDefaultScheduleConfig(),
  scheduleDirty: false,
};

export const HOME_DIR_PATH = "~";

/** Jotai atom for the current automation draft. */
export const automationDraftAtom = appScopeX<AutomationDraft | null>(null);

/** Jotai atom for the active automation id. */
export const automationIdAtom = appScopeX<string | null>(null);

/** Jotai atom tracking whether the draft has unsaved changes. */
export const automationIsDirtyAtom = appScopeX<boolean>(false);
