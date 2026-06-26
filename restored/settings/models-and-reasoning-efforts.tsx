// Restored from ref/webview/assets/models-and-reasoning-efforts-Ct6D5g-X.js
// ModelsAndReasoningEfforts chunk restored from the Codex webview bundle.

export const REASONING_EFFORTS = [
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

export type ReasoningEffort = (typeof REASONING_EFFORTS)[number];

export const DEFAULT_MODEL = "gpt-5.5";

export const DEFAULT_REASONING_EFFORT: ReasoningEffort = "medium";

export function isValidReasoningEffort(
  value: unknown,
): value is ReasoningEffort {
  return (
    typeof value === "string" &&
    REASONING_EFFORTS.includes(value as ReasoningEffort)
  );
}
