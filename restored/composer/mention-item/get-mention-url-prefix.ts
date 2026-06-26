// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function getMentionUrlPrefix(kind: string): string {
  switch (kind) {
    case "app":
      return "app://";
    case "agent":
      return "agent://";
    case "plugin":
      return "plugin://";
    case "subagent":
      return "subagent://";
    case "thread":
      return "thread://";
    case "chatgpt-conversation":
      return "chatgpt-conversation://";
    case "mcp-resource":
      return "mcp-resource://";
    case "sites-project":
      return "sites-project://";
    default:
      return "";
  }
}
