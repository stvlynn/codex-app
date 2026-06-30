// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function isMentionOfKind(
  mention: {
    kind: string;
  },
  kind: string,
): boolean {
  return mention.kind === kind;
}
export function getMentionKind(mention: { kind: string }): string {
  return mention.kind;
}
