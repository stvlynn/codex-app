// Restored from ref/webview/assets/plan-management-state-oe_4sqNh.js

import { SubscriptionSku } from "./skus";
export const PLUS_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/plus?checkout_from=codex_app";
export const GO_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/go?checkout_from=codex_app";
export const PROLITE_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/pro5x?checkout_from=codex_app";
export const PRO_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/pro?checkout_from=codex_app";
export const CODEX_TEAM_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/codex_team?checkout_from=codex_app";
export const TEAM_PURCHASE_URL =
  "https://chatgpt.com/codex/purchase/team?checkout_from=codex_app";
export const BILLING_SETTINGS_URL = "https://chatgpt.com/#settings/Billing";
export const CANCEL_IOS_SUBSCRIPTION_URL =
  "https://help.openai.com/en/articles/7905690-how-to-cancel-your-apple-subscription-for-chatgpt-in-the-chatgpt-ios-app";
export const CANCEL_ANDROID_SUBSCRIPTION_URL =
  "https://help.openai.com/en/articles/8258076-how-to-cancel-a-subscription-in-the-chatgpt-android-app";
const PLAN_PRIORITY: Record<string, number> = {
  [SubscriptionSku.FREE]: 0,
  [SubscriptionSku.GO]: 1,
  [SubscriptionSku.PLUS]: 2,
  [SubscriptionSku.PROLITE]: 3,
  [SubscriptionSku.PRO]: 4,
};
export type MobilePlatform = "ios" | "android";
export function getMobilePlatform(platform: string): MobilePlatform | null {
  if (platform === "chatgpt_mobile_ios" || platform === "sora_mobile_ios") {
    return "ios";
  }
  if (platform === "chatgpt_mobile_android") {
    return "android";
  }
  return null;
}
export type PlanChangeAction = "upgrade" | "view";
export interface PlanDisplayInfo {
  displayPlan: string;
  pricePlan: string;
  cta: PlanChangeAction;
}
export function getPlanDisplayInfo(plan: string): PlanDisplayInfo | null {
  if (!isValidIndividualPlan(plan)) return null;
  switch (plan) {
    case SubscriptionSku.FREE:
      return {
        displayPlan: "free",
        pricePlan: plan,
        cta: "upgrade",
      };
    case SubscriptionSku.GO:
      return {
        displayPlan: "go",
        pricePlan: plan,
        cta: "upgrade",
      };
    case SubscriptionSku.PLUS:
      return {
        displayPlan: "plus",
        pricePlan: plan,
        cta: "view",
      };
    case SubscriptionSku.PROLITE:
    case SubscriptionSku.PRO:
      return {
        displayPlan: "pro",
        pricePlan: plan,
        cta: "view",
      };
  }
}
export function isPaidIndividualPlan(plan: string): boolean {
  return (
    plan === SubscriptionSku.GO ||
    plan === SubscriptionSku.PLUS ||
    plan === SubscriptionSku.PROLITE ||
    plan === SubscriptionSku.PRO
  );
}
export type PlanChangeType = "current" | "downgrade" | "upgrade";
export interface PlanChangeOptions {
  currentPlan: string;
  targetPlan: string;
}
export function getPlanChangeType({
  currentPlan,
  targetPlan,
}: PlanChangeOptions): PlanChangeType {
  if (currentPlan === targetPlan) return "current";
  return PLAN_PRIORITY[targetPlan] < PLAN_PRIORITY[currentPlan]
    ? "downgrade"
    : "upgrade";
}
export function getPlanChangeUrl({
  currentPlan,
  targetPlan,
}: PlanChangeOptions): string | null {
  const changeType = getPlanChangeType({
    currentPlan,
    targetPlan,
  });
  if (changeType === "current") return null;
  if (changeType === "downgrade") {
    return `https://chatgpt.com/codex/downgrade/${targetPlan === SubscriptionSku.PROLITE ? "pro5x" : targetPlan}`;
  }
  switch (targetPlan) {
    case SubscriptionSku.PLUS:
      return PLUS_PURCHASE_URL;
    case SubscriptionSku.GO:
      return GO_PURCHASE_URL;
    case SubscriptionSku.PROLITE:
      return PROLITE_PURCHASE_URL;
    default:
      return PRO_PURCHASE_URL;
  }
}
export function isValidIndividualPlan(plan: string): boolean {
  return (
    plan === SubscriptionSku.FREE ||
    plan === SubscriptionSku.GO ||
    plan === SubscriptionSku.PLUS ||
    plan === SubscriptionSku.PROLITE ||
    plan === SubscriptionSku.PRO
  );
}
