// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function isPluginUrl(url: string): boolean {
  return url.startsWith("plugin://");
}
export function parseChatgptConversationId(url: string): string | null {
  if (!url.startsWith("chatgpt-conversation://")) return null;
  try {
    const id = decodeURIComponent(url.slice(23)).trim();
    return id.length === 0 ? null : id;
  } catch {
    return null;
  }
}
