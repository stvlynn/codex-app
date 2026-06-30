// Restored from ref/webview/assets/parse-owner-repo-C5HIXlEB.js
// GitHub owner/repo parsing utilities restored from the Codex webview bundle.

export interface OwnerRepo {
  owner: string;
  repoName: string;
}

function parseGenericGitUrl(url: string): OwnerRepo | null {
  try {
    let remaining = url.trim();
    let host: string | null = null;

    const sshMatch = /^(?<user>[^@]+)@(?<host>[^:]+):(?<path>.+)$/.exec(
      remaining,
    );
    if (sshMatch?.groups?.path && sshMatch.groups.host) {
      host = sshMatch.groups.host;
      remaining = `${host}/${sshMatch.groups.path}`;
    }

    if (host == null) {
      const protoMatch = /^(?<proto>[a-z]+):\/\/(?<rest>.+)$/i.exec(remaining);
      if (protoMatch?.groups?.rest) {
        remaining = protoMatch.groups.rest;
      }
    } else {
      remaining = remaining.replace(/^[a-z]+:\/\//i, "");
    }

    remaining = remaining.replace(/^[^@]+@/, "");
    remaining = remaining.replace(/[?#].*$/, "").replace(/\.git$/i, "");

    const segments = remaining.split("/").filter(Boolean);
    if (!host && segments.length > 0) {
      host = segments[0] ?? null;
    }

    const pathSegments = host ? segments.slice(1) : segments;
    if (pathSegments.length < 2) return null;

    const repoName = pathSegments[pathSegments.length - 1];
    const owner = pathSegments[pathSegments.length - 2];
    if (!owner || !repoName) return null;

    return { owner, repoName };
  } catch {
    return null;
  }
}

export function parseGitHubUrl(url: string): OwnerRepo | null {
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;

    const cleaned = trimmed.replace(/[?#].*$/, "");
    const sshPath = /^(?:[^@]+)@github\.com:(?<path>.+)$/i.exec(cleaned)?.groups
      ?.path;

    let segments: string[];
    if (sshPath) {
      segments = sshPath.split("/").filter(Boolean);
    } else {
      const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(cleaned);
      if (!hasProtocol && !/^github\.com\//i.test(cleaned)) return null;
      const parsed = new URL(hasProtocol ? cleaned : `https://${cleaned}`);
      if (parsed.hostname.toLowerCase() !== "github.com") return null;
      segments = parsed.pathname.split("/").filter(Boolean);
    }

    return segments.length === 2
      ? parseGenericGitUrl(cleaned.replace(/\/+$/, ""))
      : null;
  } catch {
    return null;
  }
}

export { parseGenericGitUrl };
