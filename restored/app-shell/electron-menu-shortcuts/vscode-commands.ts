// Restored from ref/webview/assets/electron-menu-shortcuts-j6UKqTX5.js
// VSCode-only command definitions.

import type { CommandDefinition } from "./types";

/** VSCode-only commands (sidebar, command palette). */
export const vscodeOnlyCommands: CommandDefinition[] = [
  {
    id: "implementTodo",
    vscodeCommand: { title: "Implement with Codex", enablement: "false" },
  },
  {
    id: "openSidebar",
    vscodeCommand: {
      title: "Open Codex Sidebar",
      icon: {
        light: "resources/blossom-black.svg",
        dark: "resources/blossom-white.svg",
      },
    },
  },
  {
    id: "newCodexPanel",
    vscodeCommand: { title: "New Codex Agent", icon: "$(plus)" },
  },
  { id: "addToThread", vscodeCommand: { title: "Add to Codex Thread" } },
  {
    id: "addFileToThread",
    vscodeCommand: { title: "Add File to Codex Thread" },
  },
  {
    id: "showLspMcpCliArgs",
    vscodeCommand: { title: "Copy Codex CLI args for LSP MCP" },
  },
  {
    id: "dumpNuxState",
    vscodeCommand: {
      title: "Debug: print NUX state to console",
      enablement: "chatgpt.sidebarView.visible",
    },
  },
  {
    id: "resetNuxState",
    vscodeCommand: {
      title: "Debug: reset NUX state",
      enablement: "chatgpt.sidebarView.visible",
    },
  },
];
