// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { SUBAGENT_URL_PREFIX, PLUGIN_URL_PREFIX } from "./url-constants";
export function buildSubagentUrl(id: string): string {
  return `${SUBAGENT_URL_PREFIX}${id}`;
}
export function buildPluginUrl(pluginId: string): string {
  return `${PLUGIN_URL_PREFIX}${pluginId.trim()}`;
}
