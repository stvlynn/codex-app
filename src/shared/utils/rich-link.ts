// Restored from ref/webview/assets/rich-link-gOumTmPC.js

import { getExternalLinkSource } from "./external-link-source";
export interface RichLinkSource {
  appId: string;
}
export interface RichLinkData {
  displayText: string;
  href: string;
  sourceAppId: string;
}
function normalizeUrl(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0 || /\s/u.test(trimmed)) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return trimmed;
}
export function createRichLink(text: string): RichLinkData | null {
  const href = normalizeUrl(text);
  if (href == null) return null;
  const url = new URL(href);
  const source = getExternalLinkSource(href);
  if (source == null) return null;
  return {
    displayText: formatDisplayText(href, url, source),
    href,
    sourceAppId: source.appId,
  };
}
export function normalizeRichLink({
  displayText,
  href,
}: {
  displayText: string;
  href: string;
}): RichLinkData | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const source = getExternalLinkSource(href);
  if (source == null) return null;
  return {
    displayText,
    href,
    sourceAppId: source.appId,
  };
}
function formatDisplayText(
  href: string,
  url: URL,
  source: RichLinkSource,
): string {
  switch (source.appId) {
    case "figma":
      return formatFigmaDisplayText(url) ?? href;
    case "github":
      return formatGitHubDisplayText(url) ?? href;
    case "notion":
      return formatNotionDisplayText(url) ?? href;
    case "gmail":
    case "google-calendar":
    case "google-drive":
    case "linear":
    case "slack":
      return href;
    default:
      return href;
  }
}
function formatGitHubDisplayText(url: URL): string | null {
  const segments = getPathSegments(url);
  const [owner, repo, kind, prNumber] = segments;
  if (owner == null || repo == null) return null;
  if (kind === "blob" && segments.length >= 5) {
    return decodePathSegment(segments[segments.length - 1] ?? "");
  }
  if (
    kind === "pull" &&
    prNumber != null &&
    segments.length === 4 &&
    url.search.length === 0 &&
    url.hash.length === 0
  ) {
    return `${owner}/${repo}#${prNumber}`;
  }
  if (
    segments.length === 2 &&
    url.search.length === 0 &&
    url.hash.length === 0
  ) {
    return `${owner}/${repo}`;
  }
  return null;
}
function formatNotionDisplayText(url: URL): string | null {
  const lastSegment = getLastPathSegment(url);
  if (lastSegment == null) return null;
  return humanizeSegment(lastSegment.replace(/-[a-f0-9]{32}$/iu, ""));
}
function formatFigmaDisplayText(url: URL): string | null {
  const lastSegment = getLastPathSegment(url);
  if (lastSegment == null) return null;
  return humanizeSegment(lastSegment);
}
function getPathSegments(url: URL): string[] {
  return url.pathname.split("/").filter((segment) => segment.length > 0);
}
function getLastPathSegment(url: URL): string | null {
  const segments = getPathSegments(url);
  return segments[segments.length - 1] ?? null;
}
function humanizeSegment(segment: string): string | null {
  const decoded = decodePathSegment(segment);
  if (decoded == null) return null;
  const readable = decoded.replace(/[-_]+/gu, " ").trim();
  if (readable.length === 0) return null;
  return readable;
}
function decodePathSegment(segment: string): string | null {
  if (segment == null) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    return null;
  }
  if (decoded.length === 0) return null;
  return decoded;
}
