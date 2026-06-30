// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { isAgentUrl } from "./is-app-agent-url";
import { isSubagentUrl } from "./is-subagent-chatgpt-url";
import { isPluginUrl } from "./is-plugin-parse-chatgpt";
import { parseThreadIdFromUrl } from "./parse-thread-id";
import { parseChatgptConversationId } from "./is-plugin-parse-chatgpt";
import { parseMcpResource } from "./parse-sites-mcp";
import { parseSitesProjectId } from "./parse-sites-mcp";
import { isAppUrl } from "./is-app-agent-url";
export function getMentionKindFromHref({
  href,
  label,
}: {
  href: string;
  label: string;
}):
  | "agent"
  | "plugin"
  | "chatgpt-conversation"
  | "mcp-resource"
  | "sites-project"
  | "app"
  | "skill"
  | "text" {
  if (
    isAgentUrl(href) ||
    isSubagentUrl(href) ||
    parseThreadIdFromUrl(href) != null
  )
    return "agent";
  if (isPluginUrl(href)) return "plugin";
  if (parseChatgptConversationId(href) == null) {
    if (parseMcpResource(href) == null) {
      if (parseSitesProjectId(href) == null) {
        if (isAppUrl(href)) return "app";
        return label.trim().startsWith("$") ? "skill" : "text";
      }
      return "sites-project";
    }
    return "mcp-resource";
  }
  return "chatgpt-conversation";
}
