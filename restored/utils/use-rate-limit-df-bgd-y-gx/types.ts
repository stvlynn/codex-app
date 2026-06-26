// Restored from ref/webview/assets/use-rate-limit-DfBgdYGx.js

export interface RateLimitWindow {
  usedPercent: number;
  windowDurationMins: number | null;
  resetsAt: number | null;
}
export interface RateLimitCredits {
  hasCredits: boolean;
  unlimited: boolean;
  balance: number | null;
}
export interface RateLimitSnapshot {
  limitId: null;
  limitName: string | null;
  primary: RateLimitWindow | null;
  secondary: RateLimitWindow | null;
  credits: RateLimitCredits | null;
  individualLimit: null;
  planType: string | null;
  rateLimitReachedType: null;
}
export interface RateLimitItem {
  limitName: string | null;
  snapshot: RateLimitSnapshot;
  blocked: boolean;
}
export interface RateLimitResponse {
  rate_limit?: {
    primary_window?: RawRateLimitWindow | null;
    secondary_window?: RawRateLimitWindow | null;
  } | null;
  credits?: {
    has_credits: boolean;
    unlimited: boolean;
    balance?: number | null;
  } | null;
  plan_type?: string | null;
  rate_limit_name?: string | null;
  additional_rate_limits?: Array<{
    rate_limit?: {
      primary_window?: RawRateLimitWindow | null;
      secondary_window?: RawRateLimitWindow | null;
    } | null;
    limit_name?: string | null;
  }> | null;
}
export interface RawRateLimitWindow {
  used_percent?: number | null;
  limit_window_seconds?: number | null;
  reset_at?: number | null;
}
export interface FilterRateLimitOptions {
  activeLimitName?: string | null;
  selectedModel?: string | null;
}
export interface RateLimitReachedFlags {
  coreRateLimitBlocked: boolean;
  selectedModelRateLimitReached: boolean;
}
