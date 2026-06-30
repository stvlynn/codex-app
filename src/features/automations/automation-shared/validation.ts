// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared validation helpers.

import { u as isScheduleValid } from "../../boundaries/rrule";
import type { AutomationDraft, ValidationResult } from "./types";

/**
 * Validate an automation draft and report missing fields.
 */
export function validateAutomationDraft(
  draft: AutomationDraft,
): ValidationResult {
  const trimmedName = draft.name.trim();
  const trimmedPrompt = draft.prompt.trim();
  const missingRequirements: string[] = [];

  if (trimmedName.length === 0) missingRequirements.push("name");
  if (trimmedPrompt.length === 0) missingRequirements.push("prompt");

  if (draft.kind === "heartbeat") {
    if (draft.targetThreadId == null) missingRequirements.push("thread");
  } else {
    if (draft.cwds.length === 0) missingRequirements.push("cwd");
    if (draft.executionEnvironment == null)
      missingRequirements.push("executionEnvironment");
    if (draft.model == null) missingRequirements.push("model");
  }

  if (!isScheduleValid(draft.scheduleConfig)) {
    missingRequirements.push("schedule");
  }

  return {
    trimmedName,
    trimmedPrompt,
    missingRequirements,
    canSave: missingRequirements.length === 0,
  };
}
