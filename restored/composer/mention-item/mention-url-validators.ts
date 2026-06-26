// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function isValidMentionUrl(url: string): boolean {
  return (
    url.startsWith("app://") ||
    url.startsWith("agent://") ||
    url.startsWith("plugin://") ||
    url.startsWith("subagent://") ||
    url.startsWith("chatgpt-conversation://") ||
    url.startsWith("mcp-resource://") ||
    url.startsWith("sites-project://") ||
    url.startsWith("thread://")
  );
}
export function normalizeMentionUrl(url: string): string {
  return url.trim();
}
