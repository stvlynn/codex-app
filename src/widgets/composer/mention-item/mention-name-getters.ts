// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function getMentionDisplayName(mention: {
  displayName: string;
  name: string;
}): string {
  return mention.displayName ?? mention.name;
}
export function getMentionName(mention: { name: string }): string {
  return mention.name;
}
