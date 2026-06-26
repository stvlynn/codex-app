// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { isSubagentUrl } from "./is-subagent-chatgpt-url";
export function parseSubagentIdFromUrl(url: string): string | null {
  if (!isSubagentUrl(url)) return null;
  const subagentId = url.slice(11).trim();
  return subagentId.length === 0 ? null : subagentId;
}
