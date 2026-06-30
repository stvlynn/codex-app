// Restored from ref/webview/assets/rate-limit-status-CjAYpGEg.js

const MINUTES_PER_DAY = 1440;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;
const MINUTES_PER_MONTH = 30 * MINUTES_PER_DAY;
const MINUTES_PER_YEAR = 365 * MINUTES_PER_DAY;
const MINUTES_PER_HOUR = 60;
export function formatWindowDurationLabel({
  intl,
  minutes = 0,
  variant = "summary",
}: {
  intl: {
    formatMessage(
      d: {
        id: string;
        defaultMessage: string;
        description?: string;
      },
      v?: Record<string, unknown>,
    ): string;
  };
  minutes?: number;
  variant?: "summary" | "sentence";
}): string {
  const mins = minutes ?? 0;
  const years = roundToUnit(mins, MINUTES_PER_YEAR);
  if (years != null) {
    const msg =
      variant === "summary"
        ? {
            id: "composer.mode.rateLimit.annualDynamicTitle",
            defaultMessage:
              "{years, plural, one {Annual} other {{years} Years}}",
            description: "Dynamic annual rate limit label (title case)",
          }
        : {
            id: "composer.mode.rateLimit.annualDynamicSentence",
            defaultMessage:
              "{years, plural, one {annual limit} other {{years} year limit}}",
            description: "Dynamic annual rate limit label (sentence case)",
          };
    return intl.formatMessage(msg, {
      years,
    });
  }
  const months = roundToUnit(mins, MINUTES_PER_MONTH);
  if (months != null) {
    const msg =
      variant === "summary"
        ? {
            id: "composer.mode.rateLimit.monthlyDynamicTitle",
            defaultMessage:
              "{months, plural, one {Monthly} other {{months} Months}}",
            description: "Dynamic monthly rate limit label (title case)",
          }
        : {
            id: "composer.mode.rateLimit.monthlyDynamicSentence",
            defaultMessage:
              "{months, plural, one {monthly limit} other {{months} month limit}}",
            description: "Dynamic monthly rate limit label (sentence case)",
          };
    return intl.formatMessage(msg, {
      months,
    });
  }
  if (mins >= 10079) {
    const weeks = Math.ceil(mins / MINUTES_PER_WEEK);
    const msg =
      variant === "summary"
        ? {
            id: "composer.mode.rateLimit.weeklyDynamicTitle",
            defaultMessage:
              "{weeks, plural, one {Weekly} other {{weeks} Weeks}}",
            description: "Dynamic weekly rate limit label (title case)",
          }
        : {
            id: "composer.mode.rateLimit.weeklyDynamicSentence",
            defaultMessage:
              "{weeks, plural, one {weekly limit} other {{weeks} week limit}}",
            description: "Dynamic weekly rate limit label (sentence case)",
          };
    return intl.formatMessage(msg, {
      weeks,
    });
  }
  if (mins >= 1439) {
    return intl.formatMessage(
      {
        id: "composer.mode.rateLimit.day",
        defaultMessage: "{days}d",
        description: "Daily rate limit label",
      },
      {
        days: Math.ceil(mins / MINUTES_PER_DAY),
      },
    );
  }
  if (mins >= 60) {
    return intl.formatMessage(
      {
        id: "composer.mode.rateLimit.hour",
        defaultMessage: "{hours}h",
        description: "Hourly rate limit label",
      },
      {
        hours: Math.ceil(mins / 60),
      },
    );
  }
  if (mins > 0) {
    return intl.formatMessage(
      {
        id: "composer.mode.rateLimit.minute",
        defaultMessage: "{minutes}m",
        description: "Minute rate limit label",
      },
      {
        minutes: Math.ceil(mins),
      },
    );
  }
  return intl.formatMessage({
    id: "composer.mode.rateLimit.heading",
    defaultMessage: "Usage remaining",
    description: "Rate limit summary heading",
  });
}
function roundToUnit(value: number, unit: number): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const rounded = Math.max(1, Math.round(value / unit));
  return value >= rounded * unit * 0.95 && value <= rounded * unit * 1.05
    ? rounded
    : null;
}
export function formatResetDate(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  if (seconds <= 0) {
    return new Intl.RelativeTimeFormat(undefined, {
      numeric: "auto",
    }).format(0, "second");
  }
  if (seconds < MINUTES_PER_HOUR * 60) {
    return new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}
export function formatDateTimeParts(date: Date): {
  date: string;
  time: string;
} {
  return {
    date: new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    }).format(date),
  };
}
