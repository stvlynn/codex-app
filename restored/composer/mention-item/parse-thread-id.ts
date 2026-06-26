// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { ai as zodString } from "../../boundaries/zod";
export function parseThreadIdFromUrl(url: string): string | null {
  if (!url.startsWith("thread://")) return null;
  const threadId = url.slice(9).trim();
  return threadId.length === 0 ? null : zodString(threadId);
}
