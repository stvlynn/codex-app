// Restored from ref/webview/assets/chatgpt-token-auth.browser-fpdQoL-R.js

import { z } from "zod";

export const PlanType = z.enum([
  "free",
  "go",
  "plus",
  "pro",
  "prolite",
  "team",
  "self_serve_business_usage_based",
  "business",
  "enterprise_cbp_usage_based",
  "enterprise",
  "edu",
  "unknown",
]);

export type PlanType = z.infer<typeof PlanType>;

export const ChatGPTTokenAuthSchema = z.object({
  accessToken: z.string(),
  accountId: z.string(),
  accountUserId: z.string().nullable().default(null),
  userId: z.string().nullable(),
  email: z.string().nullable(),
  planType: PlanType,
  computeResidency: z.string().nullable().default(null),
});

export type ChatGPTTokenAuth = z.infer<typeof ChatGPTTokenAuthSchema>;

function buildLoginUrl(): string {
  const url = new URL("/auth/login", window.location.origin);
  url.searchParams.set(
    "next",
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  );
  return url.toString();
}

export function isChatGPTDomain(): boolean {
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname === "chatgpt.com" ||
    hostname.endsWith(".chatgpt.com") ||
    hostname === "chatgpt-staging.com" ||
    hostname.endsWith(".chatgpt-staging.com")
  );
}

export function redirectToLogin(): void {
  window.location.assign(buildLoginUrl());
}

export function ensureChatGPTAuth(): boolean {
  if (isChatGPTDomain()) {
    redirectToLogin();
    return true;
  }
  return false;
}
