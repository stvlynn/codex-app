// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { APP_URL_PREFIX, AGENT_URL_PREFIX } from "./url-constants";
export function buildAppUrl(id: string): string {
  return `${APP_URL_PREFIX}${id}`;
}
export function buildAgentUrl(id: string): string {
  return `${AGENT_URL_PREFIX}${id}`;
}
