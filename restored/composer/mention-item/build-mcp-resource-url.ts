// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { MCP_RESOURCE_URL_PREFIX } from "./url-constants";
export function buildMcpResourceUrl({
  resourceUri,
  server,
}: {
  resourceUri: string;
  server: string;
}): string {
  return `${MCP_RESOURCE_URL_PREFIX}${encodeURIComponent(server)}/${encodeURIComponent(resourceUri)}`;
}
