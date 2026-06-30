// Restored from ref/webview/assets/mcp-tool-item-content-utils-BoJx2r_K.js

import { djb2Hash } from "../../../shared/utils/hash-code.tsx";
import type { OriginScope } from "./types";
function extractHost(domain: string | null | undefined): string | null {
  if (domain == null) return null;
  try {
    const u = new URL(domain);
    return u.hostname ? slugify(u.hostname) : null;
  } catch {
    return domain.startsWith("http") ? null : extractHost(`https://${domain}`);
  }
}
function buildConnectorSlug(id: string | null | undefined): string | null {
  if (id == null) return null;
  const t = id.trim();
  return t.length === 0 ? null : hashSlug("app", "mcp-app", t);
}
function hashSlug(
  fb: string,
  prefix: string,
  value: string | undefined,
): string {
  const h = djb2Hash(value ?? "");
  const max = 63 - prefix.length - h.length - 2;
  const slug =
    (value ?? "")
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "")
      .slice(0, max)
      .replaceAll(/-+$/g, "") || fb;
  return `${prefix}-${slug}-${h}`;
}
function slugify(host: string): string | null {
  const s = host
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  if (!s) return null;
  if (s.length <= 63) return s;
  const h = djb2Hash(host);
  return `${s.slice(0, 63 - h.length - 1).replaceAll(/-+$/g, "")}-${h}`;
}
function resolveSubdomain(scope: OriginScope, domain?: string | null): string {
  if (scope.kind === "codex_app") {
    return (
      extractHost(domain) ??
      buildConnectorSlug(scope.connectorId) ??
      hashSlug("instance", "mcp-app-instance", scope.instanceFallbackId)
    );
  }
  return hashSlug("server", "mcp-server", scope.server);
}
export function buildSubdomain(args: {
  locale: string;
  originScope: OriginScope;
  widgetDomain?: string | null;
}): string {
  return `${resolveSubdomain(args.originScope, args.widgetDomain)}.${args.locale}`;
}
export function buildSourceId(args: {
  originScope: OriginScope;
  sourceUrl: string;
}): string {
  const key =
    args.originScope.kind === "codex_app"
      ? `codex_app:${args.originScope.connectorId ?? `instance:${args.originScope.instanceFallbackId}`}`
      : `mcp_server:${args.originScope.server}`;
  return `source-${djb2Hash(`${key}\n${args.sourceUrl}`)}`;
}
