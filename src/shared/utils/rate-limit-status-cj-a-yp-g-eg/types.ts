// Restored from ref/webview/assets/rate-limit-status-CjAYpGEg.js

export interface RateLimitWindow {
  usedPercent: number;
  windowDurationMins?: number;
  resetsAt?: number | null;
}
export interface RateLimitAlert {
  severity: "blocked" | "warning";
  usedPercent: number;
  remainingPercent: number;
  windowMinutes: number;
  resetsAt: number | null;
}
export interface RateLimitSummary {
  limit: number;
  used: number;
  usedPercent: number;
  remainingPercent: number;
}
export interface RateLimitBackend {
  limit_reached?: boolean;
  allowed?: boolean;
  primary_window?: RateLimitWindow | null;
  secondary_window?: RateLimitWindow | null;
}
export interface RateLimitState {
  plan_type?: string;
  rate_limit?: RateLimitBackend | null;
  rate_limit_reached_type?: {
    type?: string;
  } | null;
  credits?: {
    unlimited?: boolean;
    has_credits?: boolean;
  } | null;
  spend_control?: {
    reached?: boolean;
    individual_limit?: {
      used_percent?: number;
      limit?: number | string | null;
    } | null;
  } | null;
  effective_monthly_limit?: {
    limit?: number | string | null;
    enforcement_mode?: string;
  } | null;
  current_month_usage?: number | string | null;
}
