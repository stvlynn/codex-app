// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared kind-switching and execution-environment helpers.

import { r as createDefaultScheduleConfig } from "../../boundaries/rrule";
import type {
  AutomationDraft,
  AutomationKind,
  ExecutionEnvironment,
} from "./types";

/**
 * Switch the draft between cron and heartbeat kinds, adjusting fields accordingly.
 */
export function switchDraftKind(
  draft: AutomationDraft,
  kind: AutomationKind,
): AutomationDraft {
  const scheduleConfig =
    kind === "heartbeat" && draft.kind !== "heartbeat"
      ? createDefaultScheduleConfig()
      : kind === "cron" && draft.kind === "heartbeat"
        ? {
            ...draft.scheduleConfig,
            intervalHours: Math.max(
              1,
              Math.round(
                ((draft.scheduleConfig as { intervalMinutes?: number })
                  .intervalMinutes ?? 60) / 60,
              ),
            ),
            intervalMinutes: null,
          }
        : draft.scheduleConfig;

  return {
    ...draft,
    kind,
    executionEnvironment:
      kind === "cron" ? (draft.executionEnvironment ?? "worktree") : null,
    targetThreadId: kind === "heartbeat" ? draft.targetThreadId : null,
    rawRrule:
      kind === "heartbeat" && draft.kind !== "heartbeat"
        ? null
        : draft.rawRrule,
    scheduleConfig,
    scheduleDirty:
      (kind === "heartbeat" && draft.kind !== "heartbeat") ||
      (kind === "cron" && draft.kind === "heartbeat")
        ? true
        : draft.scheduleDirty,
  };
}

/**
 * Derive the destination type from a draft.
 */
export function getDraftDestination(draft: AutomationDraft): string {
  return draft.kind === "heartbeat"
    ? "thread"
    : (draft.executionEnvironment ?? "worktree");
}

/**
 * Return the list of valid execution environments.
 */
export function getExecutionEnvironments({
  allowThreadDestination,
}: {
  allowThreadDestination: boolean;
}): ExecutionEnvironment[] {
  return allowThreadDestination
    ? ["local", "worktree", "thread"]
    : ["local", "worktree"];
}

/**
 * Set the execution environment on a draft, switching kind if needed.
 */
export function setDraftExecutionEnvironment(
  draft: AutomationDraft,
  environment: string,
): AutomationDraft {
  if (environment === "thread") {
    return switchDraftKind(draft, "heartbeat");
  }
  return {
    ...switchDraftKind(draft, "cron"),
    executionEnvironment: environment as ExecutionEnvironment,
    localEnvironmentConfigPath:
      environment === "worktree" ? draft.localEnvironmentConfigPath : null,
  };
}
