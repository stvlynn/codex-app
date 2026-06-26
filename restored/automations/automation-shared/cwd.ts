// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared CWD and model-setting helpers.

import type { AutomationDraft, ModelSettings } from "./types";
import { HOME_DIR_PATH } from "./constants";

/**
 * Update the working-directory list on a draft.
 */
export function setDraftCwds(
  draft: AutomationDraft,
  cwds: string[],
): AutomationDraft {
  let nextCwds = cwds;

  if (cwds.includes(HOME_DIR_PATH)) {
    nextCwds =
      isSingleHomeDir(draft.cwds) && cwds.length > 1
        ? cwds.filter((item) => item !== HOME_DIR_PATH)
        : [HOME_DIR_PATH];
  }

  const isUnchanged =
    nextCwds.length === 1 &&
    draft.cwds.length === 1 &&
    nextCwds[0] === draft.cwds[0];

  const isHomeOnly = isSingleHomeDir(nextCwds);

  return {
    ...draft,
    cwds: nextCwds,
    executionEnvironment: isHomeOnly ? "local" : draft.executionEnvironment,
    localEnvironmentConfigPath:
      !isHomeOnly && isUnchanged ? draft.localEnvironmentConfigPath : null,
  };
}

/**
 * Set the target thread on a heartbeat draft.
 */
export function setDraftTargetThread({
  draft,
  threadId,
  title,
}: {
  draft: AutomationDraft;
  threadId: string;
  title: string;
}): AutomationDraft {
  return {
    ...draft,
    name: draft.name.trim().length === 0 ? title : draft.name,
    targetThreadId: threadId,
  };
}

/**
 * Check whether the draft is using a single home-directory CWD.
 */
export function isDraftUsingHomeDir(draft: AutomationDraft): boolean {
  return draft.kind === "cron" && isSingleHomeDir(draft.cwds);
}

function isSingleHomeDir(cwds: string[]): boolean {
  return cwds.length === 1 && cwds[0] === HOME_DIR_PATH;
}

/**
 * Apply default model settings to a cron draft when needed.
 */
export function applyModelSettings({
  draft,
  modelSettings,
}: {
  draft: AutomationDraft;
  modelSettings: ModelSettings;
}): AutomationDraft {
  if (draft.kind === "heartbeat") {
    return {
      ...draft,
      model: null,
      reasoningEffort: null,
    };
  }

  if (modelSettings.isLoading || draft.model != null) {
    return draft;
  }

  return {
    ...draft,
    model: modelSettings.model,
    reasoningEffort: modelSettings.reasoningEffort,
  };
}
