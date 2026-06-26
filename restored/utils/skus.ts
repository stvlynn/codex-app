// Restored from ref/webview/assets/skus-K50o09d3.js

export const SubscriptionSku = {
  FREE: "free",
  GO: "go",
  PLUS: "plus",
  PRO: "pro",
  PROLITE: "prolite",
  SELF_SERVE_BUSINESS: "team",
  ENTERPRISE_CBP: "business",
  SELF_SERVE_BUSINESS_USAGE_BASED: "self_serve_business_usage_based",
  ENTERPRISE_CBP_USAGE_BASED: "enterprise_cbp_usage_based",
  FINSERV: "finserv",
  EDUCATION_CBP: "education",
  QUORUM: "quorum",
  DEPRECATED_ENTERPRISE: "enterprise",
  HC: "hc",
  DEPRECATED_ENTERPRISE_2: "deprecated_enterprise",
  DEPRECATED_EDU: "edu",
  DEPRECATED_EDU_2: "deprecated_edu",
} as const;

export type SubscriptionSku =
  (typeof SubscriptionSku)[keyof typeof SubscriptionSku];

export function isEducationSku(sku: string): boolean {
  return (
    sku === SubscriptionSku.EDUCATION_CBP ||
    sku === SubscriptionSku.DEPRECATED_EDU ||
    sku === SubscriptionSku.DEPRECATED_EDU_2 ||
    sku === "k12"
  );
}

export function isQuorumSku(sku: string): boolean {
  return sku === SubscriptionSku.QUORUM;
}

export function isSelfServeBusinessSku(sku: string): boolean {
  return (
    sku === SubscriptionSku.SELF_SERVE_BUSINESS ||
    sku === SubscriptionSku.SELF_SERVE_BUSINESS_USAGE_BASED
  );
}

export function isBusinessOrEnterpriseSku(sku: string): boolean {
  return (
    sku === "business" ||
    sku === "enterprise" ||
    sku === "enterprise_cbp_usage_based" ||
    sku === "deprecated_enterprise" ||
    sku === SubscriptionSku.HC ||
    sku === SubscriptionSku.FINSERV ||
    isEducationSku(sku) ||
    isQuorumSku(sku)
  );
}

export function isPaidBusinessSku(sku: string): boolean {
  return isBusinessOrEnterpriseSku(sku) && !isQuorumSku(sku);
}

export function isUsageBasedSku(sku: string): boolean {
  return (
    sku === SubscriptionSku.SELF_SERVE_BUSINESS_USAGE_BASED ||
    sku === SubscriptionSku.ENTERPRISE_CBP_USAGE_BASED
  );
}
