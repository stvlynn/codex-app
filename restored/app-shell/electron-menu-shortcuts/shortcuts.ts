// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// Keyboard shortcut formatting and keybinding resolution utilities.

import type {
  CommandDefinition,
  ElectronCommandMeta,
  KeymapState,
} from "./types";
import { getCommandById, isNotVscodeOnly } from "./registry";
import { KEY_DISPLAY_OVERRIDES } from "./constants";

/** MacOS modifier symbols for display. */
const macOSModifierSymbols: Record<string, string> = {
  Ctrl: "⌃",
  Alt: "⌥",
  Shift: "⇧",
  Command: "⌘",
};

/** Priority order for modifier keys on macOS. */
const macOSModifierOrder = ["Ctrl", "Alt", "Shift", "Command"];

/** Priority order for modifier keys on non-macOS. */
const nonMacOSModifierOrder = ["Ctrl", "Alt", "Shift", "Cmd", "Super", "Win"];

/**
 * Get the Electron metadata for a command, if any.
 */
function getElectronMeta(
  command: CommandDefinition | null,
): ElectronCommandMeta | null {
  if (command == null || !("electron" in command) || command.electron == null) {
    return null;
  }
  return command.electron;
}

/**
 * Get the default keybinding strings for a command.
 * Respects platform-specific overrides.
 */
function getDefaultKeybindings(commandId: string, isMacOS: boolean): string[] {
  const command = getCommandById(commandId);
  if (command == null || !isNotVscodeOnly(command)) return [];

  const electronMeta = getElectronMeta(command);
  if (electronMeta == null) return [];

  if (isMacOS && electronMeta.platformDefaultKeybindings?.macOS != null) {
    return electronMeta.platformDefaultKeybindings.macOS.map(
      (item) => item.key,
    );
  }

  if (!isMacOS && electronMeta.platformDefaultKeybindings?.default != null) {
    return electronMeta.platformDefaultKeybindings.default.map(
      (item) => item.key,
    );
  }

  return electronMeta.defaultKeybindings?.map((item) => item.key) ?? [];
}

/**
 * Get the active keybindings for a command, considering user overrides.
 *
 * @param commandId - The command ID to look up.
 * @param keymapState - Optional user keymap state with overrides.
 * @param isMacOS - Whether the current platform is macOS.
 * @returns Array of keybinding strings.
 */
export function getActiveKeybindingDisplay(
  commandId: string,
  keymapState: KeymapState | null | undefined,
  isMacOS: boolean,
): string[] {
  const command = getCommandById(commandId);
  if (command == null || !isNotVscodeOnly(command)) return [];

  const userBindings = keymapState?.bindings.filter(
    (binding) => binding.command === commandId,
  );

  if (userBindings != null && userBindings.length > 0) {
    const keys: string[] = [];
    for (const binding of userBindings) {
      if (binding.key == null) return [];
      keys.push(binding.key);
    }
    return keys;
  }

  return getDefaultKeybindings(commandId, isMacOS);
}

/**
 * Resolve the primary keybinding for a command.
 *
 * @param commandId - The command ID to look up.
 * @param isMacOS - Whether the current platform is macOS.
 * @returns The primary keybinding string, or null if none.
 */
export function getCommandDisplayKeybinding(
  commandId: string,
  isMacOS: boolean = isMacOSPlatform(),
): string | null {
  const bindings = getDefaultKeybindings(commandId, isMacOS);
  return bindings[0] ?? null;
}

/**
 * Check whether the current platform is macOS.
 */
export function isMacOSPlatform(): boolean {
  return typeof navigator === "undefined"
    ? false
    : (navigator.platform ?? "").startsWith("Mac");
}

/**
 * Check whether the current platform is Linux.
 */
function isLinuxPlatform(): boolean {
  return typeof navigator === "undefined"
    ? false
    : (navigator.platform ?? "").startsWith("Linux");
}

/**
 * Format a keybinding string for display.
 *
 * @param keyString - The raw keybinding string (e.g. "CmdOrCtrl+Shift+N").
 * @param isMacOS - Whether to use macOS-style formatting.
 * @param isLinux - Whether the platform is Linux (affects Command key display).
 * @returns A human-readable keybinding string.
 */
export function formatKeyString(
  keyString: string,
  isMacOS: boolean = isMacOSPlatform(),
  isLinux: boolean = !isMacOSPlatform() && isLinuxPlatform(),
): string {
  return tokenizeKeyString(keyString)
    .map((token) => formatKeyToken(token, isMacOS, isLinux))
    .join(" ");
}

/**
 * Split a keybinding string into individual tokens.
 */
export function tokenizeKeyString(keyString: string): string[] {
  return keyString.trim().split(/\s+/).filter(Boolean);
}

/**
 * Format a single key token for display.
 */
function formatKeyToken(
  token: string,
  isMacOS: boolean,
  isLinux: boolean,
): string {
  const specialDisplay = KEY_DISPLAY_OVERRIDES.get(token);
  if (isMacOS && specialDisplay != null) return specialDisplay;

  const parts = token.split("+").filter(Boolean);
  const modifiers = new Set<string>();
  let key: string | null = null;

  for (const part of parts) {
    switch (part) {
      case "CmdOrCtrl":
        modifiers.add(isMacOS ? "Command" : "Ctrl");
        break;
      case "Command":
      case "Cmd":
        modifiers.add(isMacOS ? "Command" : isLinux ? "Super" : "Win");
        break;
      case "Control":
      case "Ctrl":
        modifiers.add("Ctrl");
        break;
      case "Alt":
      case "Option":
        modifiers.add("Alt");
        break;
      case "Shift":
        modifiers.add("Shift");
        break;
      default:
        key = part;
        break;
    }
  }

  // macOS: Shift+/ -> ?
  if (isMacOS && key === "/" && modifiers.has("Shift")) {
    modifiers.delete("Shift");
    key = "?";
  }

  const formattedKey = formatSingleKey(key, isMacOS);

  if (isMacOS) {
    const modifierSymbols = macOSModifierOrder
      .filter((m) => modifiers.has(m))
      .map((m) => macOSModifierSymbols[m]);
    return `${modifierSymbols.join("")}${formattedKey}`;
  }

  const modifierLabels = Array.from(modifiers).map((m) =>
    m === "Command" ? "Cmd" : m,
  );

  return [
    ...nonMacOSModifierOrder.filter((m) => modifierLabels.includes(m)),
    formattedKey,
  ]
    .filter(Boolean)
    .join("+");
}

/**
 * Format a single key name for display.
 */
function formatSingleKey(key: string | null, isMacOS: boolean): string {
  if (key == null) return "";
  if (isMacOS && key === "Plus") return "+";

  switch (key) {
    case "Enter":
      return "⏎";
    case "LeftOption":
      return isMacOS ? "Left ⌥" : "Left Option";
    case "RightOption":
      return isMacOS ? "Right ⌥" : "Right Option";
    case "DoubleOption":
      return isMacOS ? "⌥ + ⌥" : "Double Option";
    case "LeftCommand":
      return isMacOS ? "Left ⌘" : "Left Command";
    case "DoubleCommand":
      return isMacOS ? "⌘ + ⌘" : "Double Command";
    case "RightCommand":
      return isMacOS ? "Right ⌘" : "Right Command";
    case "LeftControl":
      return isMacOS ? "Left ⌃" : "Left Control";
    case "RightControl":
      return isMacOS ? "Right ⌃" : "Right Control";
    case "LeftShift":
      return isMacOS ? "Left ⇧" : "Left Shift";
    case "RightShift":
      return isMacOS ? "Right ⇧" : "Right Shift";
    case "DoubleShift":
      return isMacOS ? "⇧ + ⇧" : "Double Shift";
    case "Fn":
      return "Fn";
    case "MouseBack":
      return "Mouse Back";
    case "MouseForward":
      return "Mouse Forward";
    default:
      return key;
  }
}

/**
 * Get the default keybinding keys for a command (without formatting).
 */
export function getDefaultKeybindingKeys(
  commandId: string,
  isMacOS: boolean = isMacOSPlatform(),
): string[] {
  return getDefaultKeybindings(commandId, isMacOS);
}
