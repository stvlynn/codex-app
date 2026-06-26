// Restored from ref/webview/assets/use-rate-limit-DfBgdYGx.js
import { computeRateLimitAlert } from "../rate-limit-status-cj-a-yp-g-eg";
import type { RateLimitItem, RateLimitReachedFlags } from "./types";
import {
  selectActiveLimit,
  findByModelName,
  isCodexLimit,
  normalizeModelName,
  normalizeRateLimitName,
  findHeaviestWindow,
  isRateLimited,
  isBackendRateLimitBlocked,
  buildSnapshot,
} from "./core";

/**
 * Returns the active rate-limit item and checks whether the rate limit
 * has been reached on that item.
 */
export function useRateLimitR(
  items: RateLimitItem[],
  options: import("./types").FilterRateLimitOptions = {},
): boolean | null {
  const active = selectActiveLimit(items, options);
  if (active == null) return null;
  return computeRateLimitAlert(active.snapshot);
}

/**
 * Returns the earliest reset time among the active limit's windows.
 */
export function useRateLimitS(items: RateLimitItem[]): number | null {
  return findHeaviestWindow(items[0]?.snapshot)?.resetsAt ?? null;
}

/**
 * Checks whether any rate limit is currently blocking usage.
 */
export function useRateLimitD(
  response: import("./types").RateLimitResponse | null,
  options: import("./types").FilterRateLimitOptions = {},
): boolean {
  if (response == null || isRateLimited(response)) return false;
  const activeLimitName =
    options.activeLimitName ?? normalizeRateLimitName(response.rate_limit_name);
  const additional = response.additional_rate_limits;
  if (!Array.isArray(additional)) {
    return activeLimitName != null && !isCodexLimit(activeLimitName);
  }
  const selectedModelName = normalizeModelName(options.selectedModel);
  const hasSelectedModelBlocked =
    selectedModelName != null &&
    additional.some((item) =>
      isBackendRateLimitBlocked(item)
        ? normalizeModelName(item.limit_name) === selectedModelName
        : false,
    );
  if (hasSelectedModelBlocked) return true;
  return activeLimitName != null && !isCodexLimit(activeLimitName);
}

/**
 * Checks whether a specific model's rate limit is blocking.
 */
export function useRateLimitU(
  response: import("./types").RateLimitResponse | null,
  modelName: string | null,
): boolean {
  if (response == null) return false;
  const normalized = normalizeModelName(modelName);
  if (normalized == null) return false;
  const additional = response.additional_rate_limits;
  if (!Array.isArray(additional)) return false;
  return additional.some((item) =>
    isBackendRateLimitBlocked(item)
      ? normalizeModelName(item.limit_name) === normalized
      : false,
  );
}

/**
 * Returns the type of rate-limit block: "upsell", "model_limit", or "none".
 */
export function useRateLimitA(flags: RateLimitReachedFlags): string {
  if (flags.coreRateLimitBlocked) return "upsell";
  if (flags.selectedModelRateLimitReached) return "model_limit";
  return "none";
}

// Re-exports for internal consumers
export { normalizeRateLimitName as useRateLimitC };
export { buildSnapshot as useRateLimitF };
export { selectActiveLimit as useRateLimitI };
export { isCodexLimit as useRateLimitL };
export { findByModelName as useRateLimitN };
