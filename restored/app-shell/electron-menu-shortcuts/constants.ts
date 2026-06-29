// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// Constants for command equivalence and key display overrides.

/**
 * Command ID pairs that are treated as equivalent for shortcut purposes.
 * Commands in the same pair share the same keyboard shortcuts.
 */
export const COMMAND_ALIAS_GROUPS: string[][] = [
  ["closeTab", "closeWindow"],
  ["nextTab", "nextThread"],
  ["nextTab", "nextRecentThread"],
  ["previousTab", "previousThread"],
  ["previousTab", "previousRecentThread"],
];

/**
 * Special modifier combinations that have custom display names on macOS.
 */
export const KEY_DISPLAY_OVERRIDES = new Map<string, string>([
  ["LeftOption+RightOption", "⌥ + ⌥"],
  ["LeftAlt+RightAlt", "⌥ + ⌥"],
  ["LeftCommand+RightCommand", "⌘ + ⌘"],
  ["LeftCmd+RightCmd", "⌘ + ⌘"],
  ["LeftMeta+RightMeta", "⌘ + ⌘"],
  ["LeftShift+RightShift", "⇧ + ⇧"],
]);
