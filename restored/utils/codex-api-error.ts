// Restored from ref/webview/assets/codex-api-error-_CzxEWtd.js
// Codex API error detail parser using Zod schema validation.

import { z } from "zod";

const errorDetailSchema = z.object({
  detail: z.union([
    z
      .string()
      .transform((message) => ({ type: null as string | null, message })),
    z.object({ type: z.string(), message: z.string() }),
    z
      .object({
        error_code: z.string().optional(),
        message: z.string(),
        type: z.string().optional(),
      })
      .transform(({ error_code, message, type }) => ({
        type: type ?? error_code ?? null,
        message,
      })),
  ]),
});

export interface ErrorDetail {
  type: string | null;
  message: string;
}

export function parseCodexApiError(message: string): ErrorDetail | null {
  try {
    const parsed = errorDetailSchema.safeParse(JSON.parse(message));
    return parsed.success ? parsed.data.detail : null;
  } catch {
    return null;
  }
}
