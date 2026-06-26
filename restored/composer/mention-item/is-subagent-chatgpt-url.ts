// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function isSubagentUrl(url: string): boolean {
  return url.startsWith("subagent://");
}
export function isChatgptConversationUrl(url: string): boolean {
  return url.startsWith("chatgpt-conversation://");
}
