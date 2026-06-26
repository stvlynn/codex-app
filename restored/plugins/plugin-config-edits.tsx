// Restored from ref/webview/assets/plugin-config-edits-Dq2JYPpm.js
// plugin-config-edits-Dq2JYPpm chunk restored from the Codex webview bundle.
import { useMemoCache as useReactMemoCache } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atom } from "jotai";
import { useCallback } from "react";

export interface PluginConfigEdit {
  keyPath: string;
  value: unknown;
  mergeStrategy: "upsert";
}

export function createPluginConfigEdits(params: {
  pluginId: string;
  enabled: boolean;
}): PluginConfigEdit[] {
  const { pluginId, enabled } = params;
  return [
    {
      keyPath: `plugins.${pluginId}.enabled`,
      value: enabled,
      mergeStrategy: "upsert",
    },
  ];
}

export function resolvePluginId(
  pluginIdWithVersion: string,
): string | undefined {
  const versionMatch = pluginIdWithVersion.match(/^(.*)@(.*)$/);
  if (versionMatch == null) return undefined;
  const [, pluginId, version] = versionMatch;
  if (!isValidVersion(version)) return undefined;
  return pluginId;
}

function isValidVersion(version: string): boolean {
  // Simple semver-like check
  return /^\d+\.\d+\.\d+/.test(version);
}

export function usePluginConfigEdits(): {
  createEdits: (params: {
    pluginId: string;
    enabled: boolean;
  }) => PluginConfigEdit[];
  resolvePluginId: (pluginIdWithVersion: string) => string | undefined;
} {
  const t = useReactMemoCache(2);

  let result: {
    createEdits: typeof createPluginConfigEdits;
    resolvePluginId: typeof resolvePluginId;
  };
  if (t[0] === undefined) {
    result = { createEdits: createPluginConfigEdits, resolvePluginId };
    t[0] = true;
    t[1] = result;
  } else {
    result = t[1];
  }

  return result;
}
