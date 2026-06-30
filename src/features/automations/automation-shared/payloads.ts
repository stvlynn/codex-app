// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared payload builders for create/update operations.

import type { AutomationDraft, ExecutionEnvironment } from "./types";

/**
 * Build the update payload from a draft (requires an existing id).
 */
export function buildUpdatePayload({
  draft,
  name,
  prompt,
  status,
  rrule,
}: {
  draft: AutomationDraft;
  name: string;
  prompt: string;
  status: "ACTIVE" | "PAUSED";
  rrule: string;
}):
  | {
      id: string;
      kind: "heartbeat";
      name: string;
      prompt: string;
      status: "ACTIVE" | "PAUSED";
      targetThreadId: string;
      model: null;
      reasoningEffort: null;
      rrule: string;
    }
  | {
      id: string;
      kind: "cron";
      name: string;
      prompt: string;
      status: "ACTIVE" | "PAUSED";
      cwds: string[];
      executionEnvironment: ExecutionEnvironment;
      localEnvironmentConfigPath: string | null;
      model: string;
      reasoningEffort: string | null;
      rrule: string;
    } {
  if (draft.id == null) throw new Error("Automation draft is incomplete");

  if (draft.kind === "heartbeat") {
    if (draft.targetThreadId == null)
      throw new Error("Heartbeat automation draft is incomplete");
    return {
      id: draft.id,
      kind: "heartbeat",
      name,
      prompt,
      status,
      targetThreadId: draft.targetThreadId,
      model: null,
      reasoningEffort: null,
      rrule,
    };
  }

  if (draft.executionEnvironment == null || draft.model == null)
    throw new Error("Cron automation draft is incomplete");

  return {
    id: draft.id,
    kind: "cron",
    name,
    prompt,
    status,
    cwds: draft.cwds,
    executionEnvironment: draft.executionEnvironment,
    localEnvironmentConfigPath: draft.localEnvironmentConfigPath,
    model: draft.model,
    reasoningEffort: draft.reasoningEffort,
    rrule,
  };
}

/**
 * Build the create payload from a draft (no id required).
 */
export function buildCreatePayload({
  draft,
  name,
  prompt,
  rrule,
}: {
  draft: AutomationDraft;
  name: string;
  prompt: string;
  rrule: string;
}):
  | {
      kind: "heartbeat";
      name: string;
      prompt: string;
      targetThreadId: string;
      model: null;
      reasoningEffort: null;
      rrule: string;
    }
  | {
      kind: "cron";
      name: string;
      prompt: string;
      cwds: string[];
      executionEnvironment: ExecutionEnvironment;
      localEnvironmentConfigPath: string | null;
      model: string;
      reasoningEffort: string | null;
      rrule: string;
    } {
  if (draft.kind === "heartbeat") {
    if (draft.targetThreadId == null)
      throw new Error("Heartbeat automation draft is incomplete");
    return {
      kind: "heartbeat",
      name,
      prompt,
      targetThreadId: draft.targetThreadId,
      model: null,
      reasoningEffort: null,
      rrule,
    };
  }

  if (draft.executionEnvironment == null || draft.model == null)
    throw new Error("Cron automation draft is incomplete");

  return {
    kind: "cron",
    name,
    prompt,
    cwds: draft.cwds,
    executionEnvironment: draft.executionEnvironment,
    localEnvironmentConfigPath: draft.localEnvironmentConfigPath,
    model: draft.model,
    reasoningEffort: draft.reasoningEffort,
    rrule,
  };
}
