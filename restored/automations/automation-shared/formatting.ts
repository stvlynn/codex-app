// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared formatting helpers.

import type { IntlShape } from "./types";

/**
 * Format the next-run time of an automation into a human-readable string.
 */
export function formatNextRunAt({
  intl,
  nextRunAt,
  status,
}: {
  intl: IntlShape;
  nextRunAt: string | null;
  status: "ACTIVE" | "PAUSED";
}): string {
  if (status === "PAUSED") return "-";
  if (nextRunAt == null) {
    return intl.formatMessage({
      id: "inbox.automations.nextRun.none",
      defaultMessage: "Not scheduled",
      description:
        "Fallback label when an automation does not have a next run time",
    });
  }
  return formatRelativeDate({ intl, timestamp: nextRunAt });
}

function formatRelativeDate({
  intl,
  timestamp,
}: {
  intl: IntlShape;
  timestamp: string;
}): string {
  const date = new Date(timestamp);
  const dayDelta = getDayDelta(date, new Date());
  const time = intl.formatDate(date, { timeStyle: "short" });

  if (dayDelta === 0) {
    return intl.formatMessage(
      {
        id: "inbox.automations.relativeDate.today",
        defaultMessage: "Today at {time}",
        description: "Relative next-run label for a time later today",
      },
      { time },
    );
  }

  if (dayDelta === 1) {
    return intl.formatMessage(
      {
        id: "inbox.automations.relativeDate.tomorrow",
        defaultMessage: "Tomorrow at {time}",
        description: "Relative next-run label for a time tomorrow",
      },
      { time },
    );
  }

  if (dayDelta > 1 && dayDelta < 7) {
    return intl.formatMessage(
      {
        id: "inbox.automations.relativeDate.weekday",
        defaultMessage: "{weekday} at {time}",
        description: "Relative next-run label for a day later this week",
      },
      {
        weekday: intl.formatDate(date, { weekday: "long" }),
        time,
      },
    );
  }

  return intl.formatDate(date, { dateStyle: "medium", timeStyle: "short" });
}

function getDayDelta(a: Date, b: Date): number {
  const aMidnight = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bMidnight = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((aMidnight.getTime() - bMidnight.getTime()) / 86_400_000);
}
