// Restored from ref/webview/assets/mcp-tool-item-content-utils-BoJx2r_K.js

import { z } from "zod";
import type { RenderData, CspConfig } from "./types";
const HTML_MIME = new Set(["text/html", "text/html;profile=mcp-app"]);
const WILD_RE = /^([a-z][a-z0-9+.-]*:\/\/)?%2a(?=\.)/i;
const BAD_RE = /[\s;,"']/;
const domainList = z
  .string()
  .transform((v) => v.trim())
  .transform((v) => {
    if (!v || BAD_RE.test(v)) return null;
    if (v === "blob:" || v === "data:") return v;
    const d = v.replace(WILD_RE, "$1*");
    const u = /^[a-z][a-z0-9+.-]*:\/\//i.test(d) ? d : `https://${d}`;
    let url: URL;
    try {
      url = new URL(u);
    } catch {
      return null;
    }
    const loc = url.hostname === "localhost";
    if (
      (url.protocol !== "https:" && !loc) ||
      url.hostname === "*" ||
      url.username ||
      url.password
    )
      return null;
    const h = url.hostname.replace(/^%2a(?=\.)/i, "*");
    if (h.includes("*") && !h.startsWith("*.")) return null;
    return `${url.protocol}//${h}${url.port ? `:${url.port}` : ""}`;
  })
  .pipe(z.string().nullable())
  .transform((v) => (v ? [v] : []));
const contentSchema = z
  .object({
    _meta: z
      .object({
        "openai/widgetCSP": z
          .object({
            baseUriDomains: domainList.optional(),
            base_uri_domains: domainList.optional(),
            connectDomains: domainList.optional(),
            connect_domains: domainList.optional(),
            frameDomains: domainList.optional(),
            frame_domains: domainList.optional(),
            resourceDomains: domainList.optional(),
            resource_domains: domainList.optional(),
          })
          .strip()
          .optional(),
        "openai/widgetDomain": z.string().optional(),
        "openai/widgetHeightHint": z
          .number()
          .finite()
          .positive()
          .optional()
          .catch(undefined),
        "openai/widgetShowCodexWidgetInline": z.boolean().optional(),
        "openai/widgetMinFrameHeight": z
          .number()
          .finite()
          .nonnegative()
          .optional()
          .catch(undefined),
        "openai/widgetPrefersBorder": z.boolean().optional(),
        ui: z
          .object({
            csp: z
              .object({
                baseUriDomains: domainList.optional(),
                connectDomains: domainList.optional(),
                frameDomains: domainList.optional(),
                resourceDomains: domainList.optional(),
              })
              .strip()
              .optional(),
            domain: z.string().optional(),
            prefersBorder: z.boolean().optional(),
          })
          .strip()
          .optional(),
      })
      .strip()
      .optional(),
    mimeType: z.string().optional().catch(undefined),
    text: z.string().optional().catch(undefined),
  })
  .strip();
function mergeCsp(
  mcp?: {
    baseUriDomains?: string[];
    connectDomains?: string[];
    frameDomains?: string[];
    resourceDomains?: string[];
  },
  oai?: {
    baseUriDomains?: string[];
    base_uri_domains?: string[];
    connectDomains?: string[];
    connect_domains?: string[];
    frameDomains?: string[];
    frame_domains?: string[];
    resourceDomains?: string[];
    resource_domains?: string[];
  },
): CspConfig {
  const rd =
    mcp?.resourceDomains ?? oai?.resourceDomains ?? oai?.resource_domains ?? [];
  const fd = mcp?.frameDomains ?? oai?.frameDomains ?? oai?.frame_domains ?? [];
  return {
    baseUriDomains:
      mcp?.baseUriDomains ?? oai?.baseUriDomains ?? oai?.base_uri_domains ?? [],
    connectDomains: [
      ...new Set([
        ...(mcp?.connectDomains ??
          oai?.connectDomains ??
          oai?.connect_domains ??
          []),
        ...rd,
      ]),
    ],
    frameDomains: fd,
    includeDefaultDomains: false,
    isTrusted: mcp != null || oai != null,
    resourceDomains: rd,
  };
}
export function parseMcpToolContents(
  contents: Array<unknown>,
): RenderData | null {
  let dil: RenderData | null = null;
  for (const item of contents ?? []) {
    const p = contentSchema.safeParse(item);
    if (!p.success) continue;
    if (p.data.mimeType === "text/x-dil;profile=mcp-app") {
      dil ??= {
        htmlFallback: null,
        kind: "dil",
        source: p.data.text ?? null,
      };
      continue;
    }
    if (p.data.mimeType == null || !HTML_MIME.has(p.data.mimeType)) continue;
    const mcpCsp = p.data._meta?.ui?.csp;
    const oaiCsp = p.data._meta?.["openai/widgetCSP"];
    const h = p.data._meta?.["openai/widgetHeightHint"];
    const mh = p.data._meta?.["openai/widgetMinFrameHeight"];
    const html: NonNullable<RenderData["htmlFallback"]> = {
      csp: mergeCsp(mcpCsp, oaiCsp),
      ...(h == null
        ? {}
        : {
            heightHint: h,
          }),
      html: p.data.text ?? null,
      prefersBorder:
        p.data._meta?.["openai/widgetPrefersBorder"] ??
        p.data._meta?.ui?.prefersBorder ??
        false,
      isCollapsible: !(
        p.data._meta?.["openai/widgetShowCodexWidgetInline"] ?? false
      ),
      widgetDomain:
        p.data._meta?.ui?.domain ??
        p.data._meta?.["openai/widgetDomain"] ??
        null,
      ...(mh == null
        ? {}
        : {
            minFrameHeight: mh,
          }),
    };
    if (dil == null) return html;
    return {
      ...dil,
      htmlFallback: html,
    };
  }
  return dil;
}
export function decideRenderStrategy(args: {
  isDilEnabled: boolean;
  renderData: RenderData | null;
  resourceUri: string | null;
  shouldRenderMcpApp: boolean;
}): RenderData {
  if (!args.shouldRenderMcpApp)
    return {
      kind: "fallback",
    };
  if (args.renderData?.kind === "dil") {
    if (!args.isDilEnabled || args.resourceUri == null) {
      return args.renderData.htmlFallback == null
        ? {
            kind: "fallback",
          }
        : {
            kind: "html",
            renderData: args.renderData.htmlFallback,
          };
    }
    return {
      kind: "dil",
      source: args.renderData.source,
    };
  }
  return {
    kind: "html",
    renderData: args.renderData?.kind === "html" ? args.renderData : null,
  };
}
