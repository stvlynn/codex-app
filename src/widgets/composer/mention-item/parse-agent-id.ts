// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { ai as zodString } from "../../boundaries/zod";
import { isAgentUrl } from "./is-app-agent-url";
export function parseAgentIdFromUrl(url: string): string | null {
  if (!isAgentUrl(url)) return null;
  const agentId = url.slice(8).trim();
  return agentId.length === 0 ? null : zodString(agentId);
}
