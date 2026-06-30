// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared draft creation and conversion helpers.

import {
  Bi as isHeartbeatAutomation,
  Ri as resolveAutomationModel,
  Vi as validateExecutionEnvironment,
  _n as normalizePath,
} from "../../boundaries/src-l0hb-m-z-p";
import {
  i as buildHeartbeatScheduleConfig,
  m as buildCronScheduleConfig,
  p as parseHeartbeatSchedule,
} from "../../boundaries/rrule";
import type {
  Automation,
  AutomationDraft,
  AutomationKind,
  DirectiveSeed,
  DirectiveState,
} from "./types";
import { DEFAULT_AUTOMATION_DRAFT } from "./constants";

/**
 * Build a new directive state from an existing automation (view mode).
 */
export function buildDirectiveFromAutomation({
  directiveKey,
  automation,
}: {
  directiveKey: string;
  automation: Automation;
}): DirectiveState {
  return {
    directiveKey,
    mode: "view",
    id: automation.id,
    kind: automation.kind,
    name: automation.name,
    prompt: automation.prompt,
    rrule: automation.rrule,
    cwds: [],
    executionEnvironment: null,
    localEnvironmentConfigPath: null,
    model: automation.model,
    reasoningEffort: automation.reasoningEffort,
    targetThreadId: automation.targetThreadId,
    status: automation.status,
  };
}

/**
 * Convert an API automation into an editable draft.
 */
export function automationToDraft(
  automation: Automation,
  models: string[] = [],
): AutomationDraft {
  const modelSettings = resolveAutomationModel({
    automation,
    models,
  });

  return {
    id: automation.id,
    kind: automation.kind,
    name: automation.name,
    prompt: automation.prompt,
    status: automation.status,
    cwds: isHeartbeatAutomation(automation) ? [] : automation.cwds,
    executionEnvironment: isHeartbeatAutomation(automation)
      ? null
      : validateExecutionEnvironment(automation.executionEnvironment),
    localEnvironmentConfigPath: isHeartbeatAutomation(automation)
      ? null
      : automation.localEnvironmentConfigPath,
    targetThreadId: isHeartbeatAutomation(automation)
      ? automation.targetThreadId
      : null,
    model: isHeartbeatAutomation(automation) ? null : modelSettings.model,
    reasoningEffort: isHeartbeatAutomation(automation)
      ? null
      : modelSettings.reasoningEffort,
    rawRrule: automation.rrule,
    scheduleConfig: isHeartbeatAutomation(automation)
      ? parseHeartbeatSchedule(automation.rrule)
      : buildCronScheduleConfig(automation.rrule),
    scheduleDirty: false,
  };
}

/**
 * Build a draft from a directive seed and optional target automation.
 */
export function buildDraftFromSeed({
  seed,
  targetAutomation,
  models,
}: {
  seed: DirectiveSeed;
  targetAutomation: Automation | null;
  models: string[];
}): AutomationDraft {
  const sourceAutomation = seed.mode === "view" ? targetAutomation : null;
  const sourceRrule = sourceAutomation?.rrule ?? seed.rrule;

  const modelSettings =
    targetAutomation == null
      ? null
      : resolveAutomationModel({
          automation: targetAutomation,
          models: models ?? [],
        });

  const fallbackExecutionEnvironment =
    seed.id != null && targetAutomation == null
      ? null
      : targetAutomation != null && !isHeartbeatAutomation(targetAutomation)
        ? validateExecutionEnvironment(targetAutomation.executionEnvironment)
        : DEFAULT_AUTOMATION_DRAFT.executionEnvironment;

  const kind: AutomationKind =
    targetAutomation?.kind ??
    seed.kind ??
    (seed.id != null && targetAutomation == null
      ? DEFAULT_AUTOMATION_DRAFT.kind
      : "cron");

  const targetThreadId: string | null =
    kind === "heartbeat"
      ? (seed.targetThreadId ??
        (targetAutomation != null && isHeartbeatAutomation(targetAutomation)
          ? targetAutomation.targetThreadId
          : null))
      : null;

  return {
    id: seed.id ?? targetAutomation?.id ?? null,
    kind,
    name: sourceAutomation?.name ?? seed.name ?? "",
    prompt: sourceAutomation?.prompt ?? seed.prompt ?? "",
    status:
      sourceAutomation?.status ??
      seed.status ??
      targetAutomation?.status ??
      "ACTIVE",
    cwds:
      targetAutomation != null && !isHeartbeatAutomation(targetAutomation)
        ? targetAutomation.cwds
        : seed.cwds.map(normalizePath),
    executionEnvironment:
      kind === "heartbeat"
        ? null
        : (seed.executionEnvironment ?? fallbackExecutionEnvironment),
    localEnvironmentConfigPath:
      kind === "heartbeat"
        ? null
        : (seed.localEnvironmentConfigPath ??
          (targetAutomation != null && !isHeartbeatAutomation(targetAutomation)
            ? targetAutomation.localEnvironmentConfigPath
            : DEFAULT_AUTOMATION_DRAFT.localEnvironmentConfigPath)),
    targetThreadId,
    model:
      kind === "heartbeat"
        ? null
        : (seed.model ??
          modelSettings?.model ??
          DEFAULT_AUTOMATION_DRAFT.model),
    reasoningEffort:
      kind === "heartbeat"
        ? null
        : (seed.reasoningEffort ??
          modelSettings?.reasoningEffort ??
          DEFAULT_AUTOMATION_DRAFT.reasoningEffort),
    rawRrule: sourceRrule,
    scheduleConfig:
      kind === "heartbeat"
        ? buildHeartbeatScheduleConfig(sourceRrule)
        : buildCronScheduleConfig(sourceRrule),
    scheduleDirty: false,
  };
}

/**
 * Check whether the draft matches the factory-default state.
 */
export function isDraftUnchanged(draft: AutomationDraft): boolean {
  return (
    draft.id == null &&
    draft.kind === "cron" &&
    draft.name === "" &&
    draft.prompt === "" &&
    draft.cwds.length === 0 &&
    draft.executionEnvironment === "worktree" &&
    draft.localEnvironmentConfigPath == null &&
    draft.targetThreadId == null &&
    draft.model == null &&
    draft.reasoningEffort == null &&
    draft.rawRrule == null &&
    draft.scheduleDirty === false
  );
}
