// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// Type definitions for command definitions and keyboard shortcuts.

/** Platform-specific keybinding defaults. */
export interface PlatformKeybindings {
  /** Default keybindings for all platforms. */
  default?: KeybindingEntry[];
  /** macOS-specific keybindings. */
  macOS?: KeybindingEntry[];
}

/** A single keybinding entry. */
export interface KeybindingEntry {
  /** The key combination string (e.g. "CmdOrCtrl+N"). */
  key: string;
}

/** Electron-specific command metadata. */
export interface ElectronCommandMeta {
  /** Menu title for Electron menus. */
  menuTitle?: string;
  /** Internationalization key for the menu title. */
  menuTitleIntlId?: string;
  /** Default keybindings for this command. */
  defaultKeybindings?: KeybindingEntry[];
  /** Platform-specific default keybindings. */
  platformDefaultKeybindings?: PlatformKeybindings;
}

/** VSCode command metadata. */
export interface VSCodeCommandMeta {
  /** VSCode command ID (defaults to "chatgpt.{id}"). */
  commandId?: string;
  /** Title shown in VSCode command palette. */
  title?: string;
  /** Icon for the command. */
  icon?: string | { light: string; dark: string };
  /** Enablement condition. */
  enablement?: string;
  /** Keybinding configuration. */
  keybinding?: {
    key: string;
    mac?: string;
    when?: string;
  };
}

/** The runtime kind of a command. */
export type CommandKind = "webview" | "vscode-only" | "electron-only";

/** A command definition entry. */
export interface CommandDefinition {
  /** Unique command identifier. */
  id: string;
  /** Internationalization key for the title. */
  titleIntlId?: string;
  /** Internationalization key for the description. */
  descriptionIntlId?: string;
  /** Which menu group this command belongs to. */
  commandMenuGroupKey?: string;
  /** Whether this command appears in the command menu. */
  commandMenu?: boolean;
  /** Which contexts this command is available in. */
  availableIn?: ("electron" | "browser")[];
  /** Shortcut scope (e.g. "os-global" for global shortcuts). */
  shortcutScope?: "os-global" | "app";
  /** Whether this command allows bare modifier keys. */
  allowsBareModifiers?: boolean;
  /** Whether this command allows key repeat. */
  allowsKeyRepeat?: boolean;
  /** Electron-specific metadata. */
  electron?: ElectronCommandMeta;
  /** VSCode-specific metadata. */
  vscodeCommand?: VSCodeCommandMeta;
  /** Runtime kind of the command. */
  kind?: CommandKind;
}

/** Keybinding as stored in user keymap state. */
export interface UserKeybinding {
  /** Command ID this keybinding is for. */
  command: string;
  /** The key combination. */
  key?: string;
}

/** Keymap state containing user-defined keybindings. */
export interface KeymapState {
  /** User-defined keybinding overrides. */
  bindings: UserKeybinding[];
}
