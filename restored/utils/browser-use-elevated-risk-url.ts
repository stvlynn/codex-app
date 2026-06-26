// Restored from ref/webview/assets/browser-use-elevated-risk-learn-more-url-DDETM-uv.js
// BrowserUseElevatedRiskLearnMoreUrl chunk restored from the Codex webview bundle.
import { t as getStatsigUrl } from "../boundaries/statsig-url-config";
import { CODEX_COMPUTER_USE_URL } from "../utils/links-bd-mmkun-d";

// Export order must match the manifest: n, t
export function getBrowserUseElevatedRiskLearnMoreUrl(_urlId: string) {
  return getStatsigUrl(_urlId, CODEX_COMPUTER_USE_URL);
}

export const BROWSER_USE_ELEVATED_RISK_LEARN_MORE_URL_ID = `4168530037`;
