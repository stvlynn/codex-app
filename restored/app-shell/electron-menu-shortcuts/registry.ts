// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// Command registry: Map-based lookup and command metadata queries.

import type { CommandDefinition } from "./types";
import { COMMAND_ALIAS_GROUPS } from "./constants";

/** Internal Map of all commands indexed by ID. */
const commandById = new Map<string, CommandDefinition>();

/**
 * Register an array of command definitions into the lookup map.
 * Throws if duplicate IDs are encountered.
 */
export function registerCommands(commands: CommandDefinition[]): void {
  for (const command of commands) {
    if (commandById.has(command.id)) {
      throw new Error(`Duplicate Codex command id: ${command.id}`);
    }
    commandById.set(command.id, command);
  }
}

/**
 * Look up a command definition by its ID.
 * @returns The command definition, or null if not found.
 */
export function getCommandById(commandId: string): CommandDefinition | null {
  return commandById.get(commandId) ?? null;
}

/**
 * Check whether a command with the given ID exists.
 */
export function hasCommand(commandId: string): boolean {
  return commandById.has(commandId);
}

/**
 * Check whether a command is visible (i.e. not vscode-only).
 */
export function isNotVscodeOnly(
  command: CommandDefinition | null | undefined,
): boolean {
  return command != null && command.kind !== "vscode-only";
}

/**
 * Check whether a command should appear in the command menu.
 */
export function isCommandMenuItem(command: CommandDefinition): boolean {
  return (
    command.kind === "webview" &&
    "commandMenu" in command &&
    command.commandMenu === true
  );
}

/**
 * Check whether a command is available in a given context.
 */
export function isAvailableIn(
  command: CommandDefinition,
  context: string,
): boolean {
  return command.availableIn?.includes(context) ?? true;
}

/**
 * Check whether a command has a description internationalization key.
 */
export function hasDescription(command: CommandDefinition): boolean {
  return "descriptionIntlId" in command;
}

/**
 * Check whether a command allows bare modifier keys.
 */
export function allowsBareModifiers(command: CommandDefinition): boolean {
  return (
    "shortcutScope" in command &&
    command.shortcutScope === "os-global" &&
    "allowsBareModifiers" in command &&
    command.allowsBareModifiers === true
  );
}

/**
 * Check whether a command is a global shortcut (os-global scope).
 */
export function isGlobalShortcut(command: CommandDefinition): boolean {
  return "shortcutScope" in command && command.shortcutScope === "os-global";
}

/**
 * Check whether a key string represents a mouse button.
 */
export function isMouseButton(key: string): boolean {
  return key === "MouseBack" || key === "MouseForward";
}

/**
 * Check whether two command IDs are equivalent (share the same shortcuts).
 */
export function areCommandsEquivalent(
  commandIdA: string,
  commandIdB: string,
): boolean {
  if (commandIdA === commandIdB) return true;
  return COMMAND_ALIAS_GROUPS.some(
    (pair) => pair.includes(commandIdA) && pair.includes(commandIdB),
  );
}
