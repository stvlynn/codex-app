// Restored from ref/webview/assets/thread-detail-level-CGt2uMmR.js
// ThreadDetailLevel chunk restored from the Codex webview bundle.
import { useSettingValue } from "../utils/setting-storage";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type DetailLevel = "STEPS_COMMANDS" | "STEPS_PROSE" | "STEPS_EXECUTION";

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const DEFAULT_DETAIL_LEVEL: DetailLevel = "STEPS_COMMANDS";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/**
 * Normalises a raw detail-level string into a valid DetailLevel.
 * Falls back to STEPS_COMMANDS when the value is STEPS_EXECUTION
 * (remapped for compatibility) or null/undefined.
 */
export function normalizeDetailLevel(
  raw: string | null | undefined,
): DetailLevel {
  if (raw === "STEPS_EXECUTION") {
    return "STEPS_COMMANDS";
  }
  return (raw ?? DEFAULT_DETAIL_LEVEL) as DetailLevel;
}

// ------------------------------------------------------------------
// Hooks / API
// ------------------------------------------------------------------

/**
 * Reads the user's preferred conversation detail mode from settings
 * and returns a normalised DetailLevel.
 */
export function useThreadDetailLevel(): DetailLevel {
  const raw = useSettingValue<string | null>({
    key: "conversationDetailMode",
    default: null,
  });
  return normalizeDetailLevel(raw);
}

/**
 * The most verbose detail level (prose narration of steps).
 */
export const DETAIL_LEVEL_PROSE: DetailLevel = "STEPS_PROSE";

/**
 * The default detail level (command-style step listing).
 */
export const DETAIL_LEVEL_COMMANDS: DetailLevel = "STEPS_COMMANDS";
