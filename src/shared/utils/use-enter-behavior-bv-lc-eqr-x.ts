// Restored from ref/webview/assets/use-enter-behavior-BVLcEqrX.js
// UseEnterBehavior chunk restored from the Codex webview bundle.
import { useSettingValue } from "../utils/setting-storage";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type EnterBehavior = "send" | "newline";
export interface UseEnterBehaviorResult {
  enterBehavior: EnterBehavior;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

/**
 * Reads the user's preferred composer enter behavior from settings.
 * "send" means Enter submits the message; "newline" means Enter
 * inserts a line break and Shift+Enter submits.
 */
export function useEnterBehavior(): UseEnterBehaviorResult {
  const enterBehavior = useSettingValue<EnterBehavior>({
    key: "composerEnterBehavior",
    default: "send",
  });
  return {
    enterBehavior,
  };
}
