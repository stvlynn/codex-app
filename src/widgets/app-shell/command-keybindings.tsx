// Restored from ref/webview/assets/command-keybindings-2FWPR3Ii.js
// Jotai atoms and helpers for resolving command keybindings.

import {
  c as computed,
  l as atomWithQuery,
  t as queryClient,
} from "../../shared/boundaries/app-scope.ts";
import {
  a as queryStateAtom,
  u as queryConstants,
} from "../../shared/utils/vscode-lsp-types-impl.ts";
import { platformAtom, type Platform } from "../../shared/utils/platform.tsx";
import {
  formatKeyString,
  getActiveKeybindingDisplay,
  getCommandById,
  getDefaultKeybindingKeys,
  threadCommandIds,
} from "./electron-menu-shortcuts";
import type { KeymapState } from "./electron-menu-shortcuts/types";
export interface KeybindingMenuItem {
  accelerator: string;
  label: string;
}

/** Atom that holds the persisted VSCode-style command keymap state. */
const keymapStateAtom = queryStateAtom(
  queryClient,
  "codex-command-keymap-state",
  {
    enabled: true,
    staleTime: queryConstants.ONE_MINUTE,
  },
);

/** Atom family that resolves the active keybinding strings for a command. */
const commandKeybindingsAtom = atomWithQuery(
  queryClient,
  (commandId: string, { get }) => {
    getCommandById(commandId);
    const platform = get(platformAtom);
    return getActiveKeybindingDisplay(
      commandId,
      get(keymapStateAtom).data,
      platform === "macOS",
    );
  },
);

/** Atom family that formats a command's keybindings for display. */
const formattedKeybindingsAtom = atomWithQuery(
  queryClient,
  (commandId: string, { get }) => {
    const platform = get(platformAtom);
    return get(commandKeybindingsAtom, commandId).map((key) =>
      formatKeyString(key, platform === "macOS", platform === "linux"),
    );
  },
);

/** Atom family that returns the primary formatted keybinding for a command. */
export const primaryKeybindingAtom = atomWithQuery(
  queryClient,
  (commandId: string, { get }) =>
    get(formattedKeybindingsAtom, commandId)[0] ?? null,
);

/** Computed atom that maps thread slot commands to their primary keybinding. */
export const threadKeybindingsAtom = computed(queryClient, ({ get }) =>
  threadCommandIds.map((commandId) => get(primaryKeybindingAtom, commandId)),
);

/** Atom family that reports whether a command has a custom user binding. */
export const hasCustomBindingAtom = atomWithQuery(
  queryClient,
  (commandId: string, { get }) =>
    get(keymapStateAtom).data?.bindings.some(
      (binding) => binding.command === commandId,
    ) === true,
);

/** Atom family that returns the raw primary keybinding string for a command. */
export const primaryRawKeybindingAtom = atomWithQuery(
  queryClient,
  (commandId: string, { get }) =>
    get(commandKeybindingsAtom, commandId)[0] ?? null,
);

/** Returns true if the command has at least one default keybinding. */
export function hasKeybinding(commandId: string, platform: Platform): boolean {
  return getDefaultKeybindingKeys(commandId, platform === "macOS").length > 0;
}

/** Builds menu items (accelerator + display label) for a command's keybindings. */
export function getKeybindingMenuItems(
  commandId: string,
  keymapState: KeymapState | null | undefined,
  platform: Platform,
): KeybindingMenuItem[] {
  return getActiveKeybindingDisplay(
    commandId,
    keymapState,
    platform === "macOS",
  ).map((key) => ({
    accelerator: key,
    label: formatKeyString(key, platform === "macOS", platform === "linux"),
  }));
}
