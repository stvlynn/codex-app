// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function parseSitesProjectId(url: string): string | null {
  if (!url.startsWith("sites-project://")) return null;
  try {
    const id = decodeURIComponent(url.slice(16)).trim();
    return id.length === 0 ? null : id;
  } catch {
    return null;
  }
}
export function parseMcpResource(url: string): {
  resourceUri: string;
  server: string;
} | null {
  if (!url.startsWith("mcp-resource://")) return null;
  const rest = url.slice(15);
  const slash = rest.indexOf("/");
  if (slash === -1) return null;
  try {
    const server = decodeURIComponent(rest.slice(0, slash));
    const resourceUri = decodeURIComponent(rest.slice(slash + 1));
    return server.length === 0 || resourceUri.length === 0
      ? null
      : {
          resourceUri,
          server,
        };
  } catch {
    return null;
  }
}
