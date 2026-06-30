// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { SITES_PROJECT_URL_PREFIX, THREAD_URL_PREFIX } from "./url-constants";
export function buildSitesProjectUrl(projectId: string): string {
  return `${SITES_PROJECT_URL_PREFIX}${encodeURIComponent(projectId.trim())}`;
}
export function buildThreadUrl(threadId: string): string {
  return `${THREAD_URL_PREFIX}${threadId.trim()}`;
}
