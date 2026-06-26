// Restored from ref/webview/assets/mcp-tool-item-content-utils-BoJx2r_K.js

import { z } from "zod";
import type { McpServerStatuses } from "./types";
const metaSchema = z
  .object({
    connectorId: z.string().optional(),
    connector_id: z.string().optional(),
    "openai/outputTemplate": z.string().nullish(),
    ui: z
      .object({
        resourceUri: z.string().optional(),
      })
      .strip()
      .optional(),
    "ui/resourceUri": z.string().optional(),
  })
  .passthrough();
function getToolMeta(args: {
  mcpServerStatuses?: McpServerStatuses | null;
  server: string;
  tool: string;
}): unknown | null {
  if (args.mcpServerStatuses == null) return undefined;
  const s = args.mcpServerStatuses.data.find((x) => x.name === args.server);
  return (
    s?.tools[args.tool]?._meta ??
    Object.values(s?.tools ?? {}).find((t) => t?.name === args.tool)?._meta ??
    null
  );
}
function extractResourceUri(meta: unknown): string | null {
  if (meta == null) return null;
  const p = metaSchema.safeParse(meta);
  return p.success
    ? (p.data.ui?.resourceUri ??
        p.data["ui/resourceUri"] ??
        p.data["openai/outputTemplate"] ??
        null)
    : null;
}
function extractConnectorId(meta: unknown): string | null {
  if (meta == null) return null;
  const p = metaSchema.safeParse(meta);
  if (!p.success) return null;
  const id = p.data.connectorId ?? p.data.connector_id;
  if (id == null) return null;
  const t = id.trim();
  return t.length === 0 ? null : t;
}
export function getResourceUriFromToolResult(args: {
  mcpServerStatuses?: McpServerStatuses | null;
  server: string;
  tool: string;
  toolResult?: {
    _meta?: unknown;
  } | null;
}): {
  resourceUri: string | null;
} | null {
  const fromStatus = extractResourceUri(getToolMeta(args));
  if (fromStatus != null)
    return {
      resourceUri: fromStatus,
    };
  const fromResult = extractResourceUri(args.toolResult?._meta);
  return fromResult == null
    ? null
    : {
        resourceUri: fromResult,
      };
}
export function getConnectorIdFromServerStatus(args: {
  mcpServerStatuses?: McpServerStatuses | null;
  server: string;
  tool: string;
}): string | null {
  const meta = getToolMeta(args);
  return meta === undefined
    ? (undefined as unknown as null)
    : extractConnectorId(meta);
}
export function getConnectorIdFromMeta(meta: unknown): string | null {
  return extractConnectorId(meta);
}
