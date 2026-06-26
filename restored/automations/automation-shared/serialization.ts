// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared serialization helpers.

import { t as serializeScheduleConfig } from "../../boundaries/rrule";
import type { AutomationDraft } from "./types";

/**
 * Serialize the draft's schedule config back to an RRULE string.
 */
export function serializeDraftSchedule(draft: AutomationDraft): string {
  if (!draft.scheduleDirty && draft.rawRrule) {
    return draft.rawRrule;
  }
  return serializeScheduleConfig(draft.scheduleConfig);
}
