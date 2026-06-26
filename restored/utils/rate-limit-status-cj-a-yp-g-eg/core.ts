// Restored from ref/webview/assets/rate-limit-status-CjAYpGEg.js

import { isBusinessOrEnterpriseSku } from "../skus";
import type {
  RateLimitWindow,
  RateLimitAlert,
  RateLimitSummary,
  RateLimitState,
  RateLimitBackend,
} from "./types";
const SEVERITY_THRESHOLD_PERCENT = 90;
export function hasValidWindowDuration(
  window: RateLimitWindow | null | undefined,
): boolean {
  return window != null && (window.windowDurationMins ?? 0) > 0;
}
export function getSecondsUntilReset(
  resetTimestamp: number | null | undefined,
  now: Date = new Date(),
): number | null {
  const date = parseTimestamp(resetTimestamp);
  return date ? Math.floor((date.getTime() - now.getTime()) / 1000) : null;
}
export function computeRateLimitAlert(
  status:
    | {
        primary?: RateLimitWindow | null;
        secondary?: RateLimitWindow | null;
      }
    | null
    | undefined,
): RateLimitAlert | null {
  const { primary, secondary } = status ?? {
    primary: null,
    secondary: null,
  };
  const primaryUsed = primary?.usedPercent ?? 0;
  const secondaryUsed = secondary?.usedPercent ?? 0;
  const primaryWindowMins = primary?.windowDurationMins ?? 0;
  const secondaryWindowMins = secondary?.windowDurationMins ?? 0;
  const maxUsed = Math.max(primaryUsed, secondaryUsed);
  if (maxUsed < SEVERITY_THRESHOLD_PERCENT) return null;
  if (
    secondaryUsed > primaryUsed ||
    (primaryUsed === secondaryUsed && secondaryWindowMins > primaryWindowMins)
  ) {
    return {
      severity: maxUsed >= 100 ? "blocked" : "warning",
      usedPercent: secondaryUsed,
      remainingPercent: computeRemainingPercent(secondaryUsed),
      windowMinutes: secondaryWindowMins,
      resetsAt: secondary?.resetsAt ?? null,
    };
  }
  if (maxUsed === primaryUsed) {
    return {
      severity: maxUsed >= 100 ? "blocked" : "warning",
      usedPercent: primaryUsed,
      remainingPercent: computeRemainingPercent(primaryUsed),
      windowMinutes: primaryWindowMins,
      resetsAt: primary?.resetsAt ?? null,
    };
  }
  return null;
}
export function computeRemainingPercent(usedPercent: number): number {
  return Number.isFinite(usedPercent)
    ? Math.min(Math.max(100 - usedPercent, 0), 100)
    : 100;
}
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "\u2013";
  return `${Math.round(Math.min(Math.max(value, 0), 100))}%`;
}
export function parseTimestamp(
  timestamp: number | null | undefined,
): Date | null {
  if (timestamp == null || !Number.isFinite(timestamp)) return null;
  const ms = timestamp * 1000;
  return Number.isFinite(ms) ? new Date(ms) : null;
}
export function getRateLimitBackend(
  state: RateLimitState | null | undefined,
): RateLimitBackend | null {
  return state?.rate_limit ?? null;
}
export function getCreditsInfo(state: RateLimitState | null | undefined): {
  unlimited?: boolean;
  has_credits?: boolean;
} | null {
  return state?.credits ?? null;
}
export function getRateLimitWindows(
  state: RateLimitState | null | undefined,
): RateLimitWindow[] {
  const backend = getRateLimitBackend(state);
  const windows: RateLimitWindow[] = [];
  if (backend?.primary_window) windows.push(backend.primary_window);
  if (backend?.secondary_window) windows.push(backend.secondary_window);
  return windows;
}
export function getMostConstrainedWindow(
  state: RateLimitState | null | undefined,
): RateLimitWindow | null {
  const windows = getRateLimitWindows(state);
  if (windows.length === 0) return null;
  return windows.reduce((best, current) => {
    if (!best || (current.usedPercent ?? 0) > (best.usedPercent ?? 0))
      return current;
    if ((current.usedPercent ?? 0) < (best.usedPercent ?? 0)) return best;
    return (current.resetsAt ?? 0) > (best.resetsAt ?? 0) ? current : best;
  });
}
export function getNextResetTimestamp(
  state: RateLimitState | null | undefined,
): number | null {
  return getMostConstrainedWindow(state)?.resetsAt ?? null;
}
export function computeMonthlyUsageSummary(
  state: RateLimitState | null | undefined,
): RateLimitSummary | null {
  const limit = parseNumeric(state?.effective_monthly_limit?.limit ?? null);
  const used = parseNumeric(state?.current_month_usage ?? null);
  if (limit == null || used == null || limit < 0) return null;
  const usedPercent =
    limit === 0 ? 100 : Math.min(Math.max((used / limit) * 100, 0), 100);
  return {
    limit,
    used,
    usedPercent,
    remainingPercent: computeRemainingPercent(usedPercent),
  };
}
export function getHardCapLimit(
  state: RateLimitState | null | undefined,
): number | null {
  return state?.effective_monthly_limit?.enforcement_mode === "HARD_CAP"
    ? parseNumeric(state.effective_monthly_limit.limit)
    : null;
}
export function isHardCapReached(
  state: RateLimitState | null | undefined,
): boolean {
  const limit = getHardCapLimit(state);
  const used = parseNumeric(state?.current_month_usage ?? null);
  return limit != null && used != null && used >= limit;
}
export function isRateLimited(
  state: RateLimitState | null | undefined,
): boolean {
  if (state?.rate_limit_reached_type != null) return true;
  const backend = getRateLimitBackend(state);
  const noCredits =
    isBusinessOrEnterpriseSku(state?.plan_type) &&
    state?.credits?.unlimited === false &&
    state?.credits?.has_credits === false;
  return !!(
    backend?.limit_reached === true ||
    backend?.allowed === false ||
    noCredits ||
    isSpendControlReached(state)
  );
}
export function hasCreditsOrUnlimited(
  state: RateLimitState | null | undefined,
): boolean {
  const credits = getCreditsInfo(state);
  return credits?.unlimited === true || credits?.has_credits === true;
}
export function isSpendControlReached(
  state: RateLimitState | null | undefined,
): boolean {
  return state?.spend_control?.reached === true;
}
export function parseNumeric(
  value: number | string | null | undefined,
): number | null {
  if (value == null) return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}
export function isBackendRateLimitBlocked(
  state: RateLimitState | null | undefined,
): boolean {
  const backend = getRateLimitBackend(state);
  return backend?.limit_reached === true || backend?.allowed === false;
}
export function getSpendControlWarningThreshold(
  state: RateLimitState | null | undefined,
): number | null {
  if (isSpendControlReached(state)) return null;
  const usedPercent = state?.spend_control?.individual_limit?.used_percent;
  if (usedPercent == null || usedPercent < 70) return null;
  return usedPercent >= 85 ? 85 : 70;
}
export function isSpendControlAndHardCapReached(
  state: RateLimitState | null | undefined,
  monthlyState: RateLimitState | null | undefined,
): boolean {
  return !isSpendControlReached(state) || !isHardCapReached(monthlyState)
    ? false
    : hasMatchingIndividualLimit(state, monthlyState);
}
export function isSpendControlWarningActive(
  state: RateLimitState | null | undefined,
  monthlyState: RateLimitState | null | undefined,
): boolean {
  return (
    getSpendControlWarningThreshold(state) != null &&
    hasMatchingIndividualLimit(state, monthlyState)
  );
}
function hasMatchingIndividualLimit(
  state: RateLimitState | null | undefined,
  monthlyState: RateLimitState | null | undefined,
): boolean {
  const hardCap = getHardCapLimit(monthlyState);
  const individualLimit = parseNumeric(
    state?.spend_control?.individual_limit?.limit ?? null,
  );
  return (
    hardCap != null && (individualLimit == null || individualLimit === hardCap)
  );
}
export function shouldShowWorkspaceRateLimitBanner({
  rateLimitStatus,
  isWorkspaceAccount,
}: {
  rateLimitStatus: RateLimitState | null | undefined;
  isWorkspaceAccount: boolean;
}): boolean {
  const type = rateLimitStatus?.rate_limit_reached_type?.type;
  const hasCustomType = type != null && type !== "rate_limit_reached";
  return (
    isWorkspaceAccount &&
    hasCreditsOrUnlimited(rateLimitStatus) &&
    !isSpendControlReached(rateLimitStatus) &&
    !hasCustomType
  );
}
export function isWorkspaceSpendControlReached({
  rateLimitStatus,
  isWorkspaceAccount,
}: {
  rateLimitStatus: RateLimitState | null | undefined;
  isWorkspaceAccount: boolean;
}): boolean {
  return isWorkspaceAccount && isSpendControlReached(rateLimitStatus);
}
export function shouldShowCreditsUI({
  rateLimitStatus,
  isWorkspaceAccount,
  isCreditsEnabled,
}: {
  rateLimitStatus: RateLimitState | null | undefined;
  isWorkspaceAccount: boolean;
  isCreditsEnabled: boolean;
}): boolean {
  const hasCredits =
    !isWorkspaceAccount && hasCreditsOrUnlimited(rateLimitStatus);
  return (
    isCreditsEnabled &&
    !isWorkspaceSpendControlReached({
      rateLimitStatus,
      isWorkspaceAccount,
    }) &&
    isRateLimited(rateLimitStatus) &&
    !hasCredits &&
    !shouldShowWorkspaceRateLimitBanner({
      rateLimitStatus,
      isWorkspaceAccount,
    })
  );
}
export function formatResetTimestamp(
  intl: {
    locale: string;
  },
  timestamp: number,
): string {
  const now = new Date();
  const resetDate = new Date(timestamp * 1000);
  if (
    resetDate.getFullYear() === now.getFullYear() &&
    resetDate.getMonth() === now.getMonth() &&
    resetDate.getDate() === now.getDate()
  ) {
    return resetDate.toLocaleTimeString(intl.locale, {
      timeStyle: "short",
    });
  }
  return resetDate.toLocaleString(intl.locale, {
    timeStyle: "short",
    dateStyle: "medium",
  });
}
