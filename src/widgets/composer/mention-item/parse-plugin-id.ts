// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { isPluginUrl } from "./is-plugin-parse-chatgpt";
export function parsePluginIdFromUrl(url: string): string | null {
  if (!isPluginUrl(url)) return null;
  const pluginId = url.slice(9).trim();
  return pluginId.length === 0 ? null : pluginId;
}
