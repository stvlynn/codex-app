// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { isAppUrl } from "./is-app-agent-url";
import { isPluginUrl } from "./is-plugin-parse-chatgpt";
export function getMentionTypeFromUrl(url: string): "app" | "plugin" | "skill" {
  if (isAppUrl(url)) return "app";
  if (isPluginUrl(url)) return "plugin";
  return "skill";
}
