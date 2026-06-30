// Restored from ref/webview/assets/tooltip-dismiss-BS2Xt99s.js
// TooltipDismiss chunk restored from the Codex webview bundle.
var tooltipDismissT = `codex:dismiss-tooltips`;
export function tooltipDismissN() {
  typeof window > `u` || window.dispatchEvent(new Event(tooltipDismissT));
}
export { tooltipDismissT };
