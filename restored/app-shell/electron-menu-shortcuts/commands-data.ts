// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// Command definition data: combines and tags all Codex commands.

import type { CommandDefinition } from "./types";
import { electronOnlyCommands } from "./electron-commands";
import { vscodeOnlyCommands } from "./vscode-commands";
import { webviewCommands } from "./webview-commands";
import { registerCommands } from "./registry";

function tagWithKind(
  commands: CommandDefinition[],
  kind: "webview" | "vscode-only" | "electron-only",
): CommandDefinition[] {
  return commands.map((item) => ({ ...item, kind }));
}

/** All command definitions combined and tagged with their runtime kind. */
export const allCommands: CommandDefinition[] = [
  ...tagWithKind(webviewCommands, "webview"),
  ...tagWithKind(vscodeOnlyCommands, "vscode-only"),
  ...tagWithKind(electronOnlyCommands, "electron-only"),
];

// Register all commands on module load
registerCommands(allCommands);

/** Command menu group names in display order. */
export const commandMenuGroups = [
  "thread",
  "navigation",
  "panels",
  "workspace",
  "skills",
  "configure",
  "app",
];

/** Environment action command IDs (environmentAction1-9). */
export const environmentActionCommandIds = allCommands
  .filter(
    (item) =>
      item.kind === "webview" && /^environmentAction[1-9]$/.test(item.id),
  )
  .map((item) => item.id);

/** Thread slot command IDs (thread1-9). */
export const threadCommandIds = allCommands
  .filter((item) => item.kind === "webview" && /^thread[1-9]$/.test(item.id))
  .map((item) => item.id);

/** Default keymap stale time in milliseconds. */
export const DEFAULT_KEYMAP_STALE_TIME_MS = 1000;
