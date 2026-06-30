// Restored from ref/webview/assets/use-command-hotkey-w91Z1IHx.js
// React hook that binds a command ID to its configured keyboard shortcut.
//
import { useCommandKeybinding } from "../../widgets/app-shell/command-keybindings.tsx";
import { useHotkeyN } from "../utils/use-hotkey";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface UseCommandHotkeyOptions {
  /** The command ID to look up keybindings for. */
  commandId: string;
  /** Whether the hotkey is currently enabled. */
  enabled?: boolean;
  /** Callback fired when the accelerator is pressed. */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Optional callback fired when the accelerator key is released. */
  onKeyUp?: (event: KeyboardEvent) => void;
  /** Whether to use capture phase for event listeners. */
  capture?: boolean;
  /** CSS selector for elements where the hotkey should be ignored. */
  ignoreWithin?: string;
  /** Custom event target (defaults to `window`). */
  keyboardEventTarget?: EventTarget | null;
}

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

/**
 * Registers a global keyboard shortcut for a given command ID.
 * Looks up the accelerator from the command-keybindings registry and
 * delegates to the underlying `useHotkey` hook.
 */
export function useCommandHotkey({
  commandId,
  enabled = true,
  onKeyDown,
  onKeyUp,
  capture,
  ignoreWithin,
  keyboardEventTarget,
}: UseCommandHotkeyOptions): void {
  const keybindings = useCommandKeybinding();
  const binding = keybindings.data?.keybindings.find(
    (kb) => kb.command === commandId,
  );
  const accelerator = binding?.key ?? "";
  const isEnabled = enabled && binding != null;
  useHotkeyN({
    accelerator,
    enabled: isEnabled,
    onKeyDown,
    onKeyUp,
    capture,
    ignoreWithin,
    keyboardEventTarget,
  });
}
