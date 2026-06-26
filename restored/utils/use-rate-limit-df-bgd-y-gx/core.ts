// Restored from ref/webview/assets/use-rate-limit-DfBgdYGx.js
import {
  isRateLimited,
  isBackendRateLimitBlocked,
} from "../rate-limit-status-cj-a-yp-g-eg";
import type {
  RateLimitResponse,
  RateLimitItem,
  RateLimitSnapshot,
  RawRateLimitWindow,
  RateLimitCredits,
} from "./types";
const CODEX_KEYWORD = "codex";
export function normalizeRateLimitName(
  name: string | null | undefined,
): string | null {
  if (name == null) return null;
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
}
export function normalizeModelName(
  name: string | null | undefined,
): string | null {
  if (name == null) return null;
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[_\s.]+/g, "-");
  return normalized.length > 0 ? normalized : null;
}
export function isCodexLimit(name: string | null | undefined): boolean {
  if (name == null) return true;
  return name.trim().toLowerCase() === CODEX_KEYWORD;
}
export function parseRawWindow(
  window: RawRateLimitWindow | null | undefined,
): import("./types").RateLimitWindow | null {
  if (window == null) return null;
  return {
    usedPercent: window.used_percent ?? 0,
    windowDurationMins:
      window.limit_window_seconds == null
        ? null
        : window.limit_window_seconds / 60,
    resetsAt: window.reset_at ?? null,
  };
}
export function buildSnapshot(
  rateLimit: RateLimitResponse["rate_limit"],
  credits: RateLimitResponse["credits"],
  planType: string | null | undefined,
  limitName: string | null,
): RateLimitSnapshot {
  return {
    limitId: null,
    limitName,
    primary: parseRawWindow(rateLimit?.primary_window),
    secondary: parseRawWindow(rateLimit?.secondary_window),
    credits: credits
      ? {
          hasCredits: credits.has_credits,
          unlimited: credits.unlimited,
          balance: credits.balance ?? null,
        }
      : null,
    individualLimit: null,
    planType: normalizePlanType(planType),
    rateLimitReachedType: null,
  };
}
export function normalizePlanType(
  planType: string | null | undefined,
): string | null {
  if (!planType) return null;
  switch (planType) {
    case "free":
    case "plus":
    case "pro":
      return planType;
    case "team":
    case "self_serve_business_usage_based":
      return "team";
    case "business":
    case "enterprise_cbp_usage_based":
      return "business";
    case "enterprise":
    case "edu":
      return planType;
    case "hc":
      return "enterprise";
    case "education":
    case "k12":
      return "edu";
    case "go":
    case "guest":
    case "free_workspace":
    case "quorum":
      return "unknown";
    default:
      return "unknown";
  }
}
export function findHeaviestWindow(
  snapshot: RateLimitSnapshot,
): import("./types").RateLimitWindow | null {
  const windows = [snapshot.primary, snapshot.secondary].filter(
    (w): w is import("./types").RateLimitWindow => w != null,
  );
  if (windows.length === 0) return null;
  return windows.reduce((heaviest, current) => {
    if (current.usedPercent > heaviest.usedPercent) return current;
    if (current.usedPercent < heaviest.usedPercent) return heaviest;
    return (current.resetsAt ?? -Infinity) > (heaviest.resetsAt ?? -Infinity)
      ? current
      : heaviest;
  });
}
export function findByModelName(
  items: RateLimitItem[],
  modelName: string | null | undefined,
): RateLimitItem | null {
  const normalized = normalizeModelName(modelName);
  if (normalized == null) return null;
  return (
    items.find((item) => normalizeModelName(item.limitName) === normalized) ??
    null
  );
}

/**
 * Converts a raw rate-limit response into an array of `RateLimitItem`s.
 * The first item is always the primary (core) rate limit with `limitName: null`.
 */
export function useRateLimitO(
  response: RateLimitResponse | null,
): RateLimitItem[] {
  if (response == null) return [];
  const items: RateLimitItem[] = [];
  const primaryLimitName = normalizeRateLimitName(response.rate_limit_name);
  const primarySnapshot = buildSnapshot(
    response.rate_limit,
    response.credits,
    response.plan_type,
    primaryLimitName,
  );
  items.push({
    limitName: null,
    snapshot: primarySnapshot,
    blocked: isRateLimited(response),
  });
  const additional = response.additional_rate_limits;
  if (Array.isArray(additional)) {
    for (const item of additional) {
      if (!item?.rate_limit) continue;
      const limitName = item.limit_name?.trim() ?? null;
      if (limitName == null || limitName.length === 0) continue;
      const snapshot = buildSnapshot(
        item.rate_limit,
        null,
        response.plan_type,
        limitName,
      );
      items.push({
        limitName,
        snapshot,
        blocked: isBackendRateLimitBlocked(item),
      });
    }
  }
  return items;
}

/**
 * Filters rate-limit items by the active limit name or selected model.
 * Falls back to the primary (limitName === null) item if no match is found.
 */
export function useRateLimitT(
  items: RateLimitItem[],
  {
    activeLimitName,
    selectedModel,
  }: import("./types").FilterRateLimitOptions = {},
): RateLimitItem[] {
  if (items.length === 0) return items;
  const selectedModelName = normalizeModelName(selectedModel);
  const activeLimitNameNormalized = normalizeModelName(activeLimitName);
  const targetName =
    selectedModelName ??
    (activeLimitNameNormalized && !isCodexLimit(activeLimitNameNormalized)
      ? activeLimitNameNormalized
      : null);
  if (targetName) {
    return items.filter((item) =>
      item.limitName == null
        ? true
        : normalizeModelName(item.limitName) === targetName,
    );
  }
  return items.filter((item) => item.limitName == null);
}
export function selectActiveLimit(
  items: RateLimitItem[],
  {
    activeLimitName,
    selectedModel,
  }: import("./types").FilterRateLimitOptions = {},
): RateLimitItem | null {
  if (items.length === 0) return null;
  const primary = items.find((item) => item.limitName == null) ?? null;
  const selectedModelItem = findByModelName(items, selectedModel);
  const activeLimitItem = findByModelName(items, activeLimitName);
  const primaryNotBlocked = primary?.blocked !== true;
  if (primaryNotBlocked && selectedModelItem?.blocked === true) {
    return selectedModelItem;
  }
  if (
    primaryNotBlocked &&
    activeLimitItem?.blocked === true &&
    !isCodexLimit(activeLimitItem.limitName)
  ) {
    return activeLimitItem;
  }
  return primary ?? selectedModelItem ?? activeLimitItem ?? items[0] ?? null;
}
export { isRateLimited, isBackendRateLimitBlocked };
