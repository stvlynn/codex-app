// Restored from ref/webview/assets/onboarding-mail-provider-DwX9H-oo.js
// Onboarding mail provider utilities restored from the Codex webview bundle.

export const ONBOARDING_MAIL_PROVIDER_QUERY_KEY = [
  "email-domain-mail-provider",
] as const;
export interface UseOnboardingMailProviderOptions {
  domain: string | null;
  enabled?: boolean;
}
export interface MailProviderResponse {
  provider: string | null;
}
export function useOnboardingMailProvider(
  vscodeApi: {
    call: (method: string, params: Record<string, unknown>) => Promise<unknown>;
  } | null,
  options: UseOnboardingMailProviderOptions,
) {
  const { domain, enabled = true } = options;
  return vscodeApi?.call("email-domain-mail-provider", {
    enabled: enabled && domain != null,
    params:
      domain == null
        ? undefined
        : {
            domain,
          },
    staleTime: Infinity,
  });
}
export function extractEmailDomain(email: string | null): string | null {
  if (email == null) return null;
  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0) return null;
  const domain = email
    .slice(atIndex + 1)
    .trim()
    .toLowerCase();
  return domain.length === 0 ? null : domain;
}
export function isMicrosoftSku(sku: string): boolean {
  return (
    sku === "microsoft" ||
    sku.includes("business") ||
    sku.includes("enterprise")
  );
}
export function resolveMailProvider(
  provider: string | null,
  sku: string,
): string | null {
  if (provider === "other") {
    return isMicrosoftSku(sku) ? "microsoft" : "google";
  }
  return provider;
}
