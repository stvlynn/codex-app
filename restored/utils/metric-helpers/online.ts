// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
import { isBrowser } from "../load-script";
export function isOnline(): boolean {
  return isBrowser() ? window.navigator.onLine : true;
}
export function isOffline(): boolean {
  return !isOnline();
}
