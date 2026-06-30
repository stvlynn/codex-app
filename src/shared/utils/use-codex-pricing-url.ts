// Restored from ref/webview/assets/use-codex-pricing-url-En1bzzbT.js
// use-codex-pricing-url-En1bzzbT chunk restored from the Codex webview bundle.
import {
  c as useStatsigClient,
  i as useStatsigExperiment,
} from "@statsig/js-client";
import {
  CODEX_LOCAL_ENVIRONMENTS_URL as CHATGPT_PRICING_URL_LOGGED_IN,
  CODEX_COMPUTER_USE_URL as CHATGPT_PRICING_URL_LOGGED_OUT,
} from "./links-bd-mmkun-d";
export interface UseCodexPricingUrlOptions {
  logExposure?: boolean;
}
export function useCodexPricingUrl(
  options: UseCodexPricingUrlOptions,
): () => string {
  const { logExposure } = options;
  const statsigClient = useStatsigClient();
  return () => {
    const experiment = useStatsigExperiment(statsigClient, "337040058", {
      disableExposureLog: !logExposure,
    });
    const showLoggedInPricing = experiment.get(
      "show_logged_in_pricing_page",
      false,
    );
    return showLoggedInPricing
      ? CHATGPT_PRICING_URL_LOGGED_IN
      : CHATGPT_PRICING_URL_LOGGED_OUT;
  };
}
