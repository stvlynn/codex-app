// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function parseMentionText(text: string): string {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith("$[") || trimmed.startsWith("@[")) &&
    trimmed.endsWith("]")
  )
    return trimmed.slice(2, -1);
  if (trimmed.startsWith("$") || trimmed.startsWith("@"))
    return trimmed.slice(1);
  return trimmed;
}
