// Restored from ref/webview/assets/mcp-tool-item-content-utils-BoJx2r_K.js

import { z } from "zod";
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
export function parseToolResultMeta(toolResult: {
  _meta?: unknown;
}): z.infer<typeof metaSchema> | null {
  const p = z.union([z.string(), z.number()]).safeParse(toolResult._meta);
  return p.success ? p.data : null;
}
export function isMcpAppEnabled(): boolean {
  return false;
}
