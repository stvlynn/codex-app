// Restored from ref/webview/assets/mcp-tool-item-content-utils-BoJx2r_K.js

export interface McpServerStatuses {
  data: Array<{
    name: string;
    tools: Record<
      string,
      {
        name?: string;
        _meta?: unknown;
      }
    >;
  }>;
}
export interface OriginScope {
  kind: "codex_app" | "mcp_server";
  connectorId?: string | null;
  instanceFallbackId?: string;
  server?: string;
}
export interface CspConfig {
  baseUriDomains: string[];
  connectDomains: string[];
  frameDomains: string[];
  includeDefaultDomains: boolean;
  isTrusted: boolean;
  resourceDomains: string[];
}
export interface RenderData {
  kind: "dil" | "html" | "fallback";
  source?: string | null;
  htmlFallback?: {
    html: string | null;
    csp: CspConfig;
    heightHint?: number;
    minFrameHeight?: number;
    prefersBorder: boolean;
    isCollapsible: boolean;
    widgetDomain: string | null;
  } | null;
  renderData?: {
    html: string | null;
    csp: CspConfig;
    heightHint?: number;
    minFrameHeight?: number;
    prefersBorder: boolean;
    isCollapsible: boolean;
    widgetDomain: string | null;
  } | null;
}
