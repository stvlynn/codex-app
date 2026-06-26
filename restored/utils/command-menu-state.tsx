// Restored from ref/webview/assets/command-menu-state-Cs_dyGtg.js
// Command menu state helpers for tracking menu item counts and finding active items.

import { signal } from "@tanstack/react-query";

export interface CommandMenuRegistry {
  [key: string]: Array<{ menuItem?: unknown }>;
}

export function countMenuItems(
  registry: CommandMenuRegistry,
  key: string,
): number {
  return registry[key]?.length ?? 0;
}

export function findLastMenuItem(
  registry: CommandMenuRegistry,
  key: string,
): unknown | undefined {
  const items = registry[key];
  if (!items) return undefined;
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]?.menuItem;
    if (item != null) return item;
  }
  return undefined;
}

export const menuRegistry = signal(false);
export const menuRegistryState = signal({} as CommandMenuRegistry);
