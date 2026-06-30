// Restored from ref/webview/assets/appgen-url-n_yb-0uU.js
// Appgen URL utilities restored from the Codex webview bundle.

export function stripProtocolAndOrigin(
  url: string | null | undefined,
): string | null {
  if (url == null) return null;
  const parsed = new URL(url);
  return `${parsed.host}${parsed.pathname === "/" ? "" : parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function isUrlUnderPath(baseUrl: string, candidateUrl: string): boolean {
  try {
    const base = new URL(baseUrl);
    const candidate = new URL(candidateUrl);
    if (base.origin !== candidate.origin) return false;
    const normalizedBase = normalizePath(base.pathname);
    const normalizedCandidate = normalizePath(candidate.pathname);
    return (
      normalizedBase === "/" ||
      normalizedCandidate === normalizedBase ||
      normalizedCandidate.startsWith(`${normalizedBase}/`)
    );
  } catch {
    return false;
  }
}

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/u, "") || "/";
}
