// Restored from ref/webview/assets/format-currency-CMEP8JPI.js
// Currency formatting utilities with login-hint URL injection for purchase flows.

const PURCHASE_PATH = "/purchase/";
const LOGIN_HINT_FLAG = "3800100299";
export interface LoginHintUrlOptions {
  loginHint: string | null | undefined;
  statsigClient: unknown;
  url: string;
}
export function appendLoginHintToPurchaseUrl(
  options: LoginHintUrlOptions,
): string {
  const { loginHint, url } = options;
  if (loginHint == null) return url;
  const targetUrl = new URL(url);
  if (!targetUrl.pathname.startsWith(PURCHASE_PATH)) {
    return url;
  }
  targetUrl.searchParams.set("login_hint", loginHint);
  return targetUrl.toString();
}
export interface FormatCurrencyOptions {
  intl: Intl.NumberFormat;
  amount: number;
  currencyCode: string;
  currencyFractionDigits?: number;
}
export function formatCurrency(options: FormatCurrencyOptions): string {
  const { intl, amount, currencyCode, currencyFractionDigits } = options;
  const fractionDigits =
    currencyFractionDigits ??
    getCurrencyFractionDigits({
      intl,
      currencyCode,
    });
  return intl.formatNumber(amount, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
export interface GetFractionDigitsOptions {
  intl: Intl.NumberFormat;
  currencyCode: string;
}
export function getCurrencyFractionDigits(
  options: GetFractionDigitsOptions,
): number {
  const { intl, currencyCode } = options;
  return (
    intl.formatters
      .getNumberFormat(intl.locale, {
        style: "currency",
        currency: currencyCode,
      })
      .resolvedOptions().maximumFractionDigits ?? 0
  );
}
