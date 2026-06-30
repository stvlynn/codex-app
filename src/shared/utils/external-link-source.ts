// Restored from ref/webview/assets/external-link-source-CIes3-Y_.js
// ExternalLinkSource chunk restored from the Codex webview bundle.

export interface ExternalLinkMatch {
  appId: string;
  hostnames: string[];
}

interface ExternalLinkSourceEntry {
  appId: string;
  hostnames: string[];
}

const EXTERNAL_LINK_SOURCES: ExternalLinkSourceEntry[] = [
  { appId: "google-calendar", hostnames: ["calendar.google.com"] },
  { appId: "google-drive", hostnames: ["docs.google.com"] },
  { appId: "google-drive", hostnames: ["drive.google.com"] },
  { appId: "figma", hostnames: ["figma.com"] },
  { appId: "github", hostnames: ["github.com"] },
  { appId: "linear", hostnames: ["linear.app"] },
  { appId: "gmail", hostnames: ["mail.google.com"] },
  { appId: "notion", hostnames: ["app.notion.com", "notion.so"] },
  { appId: "google-drive", hostnames: ["sheets.google.com"] },
  { appId: "slack", hostnames: ["slack.com"] },
  { appId: "google-drive", hostnames: ["slides.google.com"] },
];

/**
 * Identifies the external application source for a given URL.
 * Returns the matching app configuration or null if no match is found.
 */
export function getExternalLinkSource(url: string): ExternalLinkMatch | null {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const source of EXTERNAL_LINK_SOURCES) {
    if (
      source.hostnames.some(
        (knownHostname) =>
          hostname === knownHostname || hostname.endsWith(`.${knownHostname}`),
      )
    ) {
      return source;
    }
  }
  return null;
}
