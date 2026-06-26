// Restored from ref/webview/assets/profile-queries-BWvaDOFi.js
// ProfileQueries formatting helpers.

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const PLAN_LABELS: Record<string, string> = {
  business: "Business",
  enterprise: "Enterprise",
  enterprise_cbp_usage_based: "Enterprise",
  free: "Free",
  free_workspace: "Free",
  go: "Go",
  guest: "Free",
  plus: "Plus",
  pro: "Pro",
  prolite: "Pro",
  self_serve_business_usage_based: "Business",
  team: "Team",
};
const WHITESPACE_REGEX = /\s/g;
const USERNAME_REGEX = /^[a-z0-9._-]+$/;

// ------------------------------------------------------------------
// Formatting helpers
// ------------------------------------------------------------------

export function getInitials(displayName: string | null | undefined): string {
  const trimmed = displayName?.trim();
  if (trimmed == null || trimmed.length === 0) return "?";
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? "") : "";
  const result = `${first}${last}`.toUpperCase();
  return result.length > 0 ? result : "?";
}
function formatPlanLabel(rawPlan: string | null | undefined): string | null {
  const trimmed = rawPlan?.trim();
  if (trimmed == null) return null;
  const lower = trimmed.toLowerCase();
  if (lower in PLAN_LABELS) {
    return PLAN_LABELS[lower];
  }
  return trimmed
    .split(/[_-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
export function formatDuration(
  intl: {
    formatMessage: (
      descriptor: unknown,
      values?: Record<string, unknown>,
    ) => string;
  },
  durationMs: number,
): string {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  if (totalSeconds >= 3600) {
    const totalMinutes = Math.round(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) {
      return intl.formatMessage(
        {
          id: "profile.stats.durationHours",
          defaultMessage: "{hours}h",
          description: "Formatted profile duration with hours",
        },
        {
          hours,
        },
      );
    }
    return intl.formatMessage(
      {
        id: "profile.stats.durationHoursMinutes",
        defaultMessage: "{hours}h {minutes}m",
        description: "Formatted profile duration with hours and minutes",
      },
      {
        hours,
        minutes,
      },
    );
  }
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (seconds === 0) {
      return intl.formatMessage(
        {
          id: "profile.stats.durationMinutes",
          defaultMessage: "{minutes}m",
          description: "Formatted profile duration with minutes",
        },
        {
          minutes,
        },
      );
    }
    return intl.formatMessage(
      {
        id: "profile.stats.durationMinutesSeconds",
        defaultMessage: "{minutes}m {seconds}s",
        description: "Formatted profile duration with minutes and seconds",
      },
      {
        minutes,
        seconds,
      },
    );
  }
  return intl.formatMessage(
    {
      id: "profile.stats.durationSeconds",
      defaultMessage: "{seconds}s",
      description: "Formatted profile duration with seconds",
    },
    {
      seconds: totalSeconds,
    },
  );
}
export function formatCompactNumber(
  intl: {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  },
  value: number | null | undefined,
): string {
  return intl.formatNumber(Math.max(0, Math.round(value ?? 0)), {
    maximumFractionDigits: 1,
    notation: "compact",
  });
}
export function formatDayStreak(
  intl: {
    formatMessage: (
      descriptor: unknown,
      values?: Record<string, unknown>,
    ) => string;
  },
  days: number | null | undefined,
): string {
  return intl.formatMessage(
    {
      id: "profile.stats.dayStreakValue",
      defaultMessage: "{days, plural, one {# day} other {# days}}",
      description: "Formatted day count for profile streak stats",
    },
    {
      days: Math.max(0, Math.round(days ?? 0)),
    },
  );
}
export function getPlanDisplayName({
  accountStructure,
  plan,
  workspaceName,
}: {
  accountStructure?: string | null;
  plan?: string | null;
  workspaceName?: string | null;
}): string | null {
  const trimmedWorkspace = workspaceName?.trim();
  if (
    trimmedWorkspace != null &&
    accountStructure?.toLowerCase() === "workspace"
  ) {
    return trimmedWorkspace;
  }
  return formatPlanLabel(plan);
}
export function sanitizeUsernameInput(input: string): string {
  const trimmed = input.trim();
  return trimmed.startsWith("@") ? trimmed.slice(1).trim() : trimmed;
}
export type UsernameValidationResult =
  | {
      ok: true;
      username: string;
    }
  | {
      ok: false;
      reason: UsernameValidationFailureReason;
    };
export type UsernameValidationFailureReason =
  | "empty"
  | "tooShort"
  | "tooLong"
  | "invalidCharacters";
export function validateUsername(input: string): UsernameValidationResult {
  const sanitized = sanitizeUsernameInput(input);
  if (sanitized.length === 0) {
    return {
      ok: false,
      reason: "empty",
    };
  }
  if (sanitized.length < 3) {
    return {
      ok: false,
      reason: "tooShort",
    };
  }
  if (sanitized.length > 20) {
    return {
      ok: false,
      reason: "tooLong",
    };
  }
  if (USERNAME_REGEX.test(sanitized)) {
    return {
      ok: true,
      username: sanitized,
    };
  }
  return {
    ok: false,
    reason: "invalidCharacters",
  };
}
export function sanitizeDisplayName(name: string): string {
  return name.replace(WHITESPACE_REGEX, "").slice(0, 20);
}
