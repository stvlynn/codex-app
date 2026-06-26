// Restored from ref/webview/assets/hooks-settings-model-CesfUzEC.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/hooks-settings-model-CesfUzEC.js
 *   Chunk: hooks-settings-model-CesfUzEC
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/hooks-settings-model/helpers.ts
 */

import type {
  HookEntry,
  HookGroup,
  HookError,
  HookSource,
  HookSettingsSummary,
  HookSourceConfig,
} from "./types";

export const ALL_HOOK_SOURCES: HookSource[] = [
  "plugin",
  "user",
  "admin",
  "project",
  "sessionFlags",
  "unknown",
];

export const ALL_HOOK_EVENTS = [
  "preToolUse",
  "permissionRequest",
  "postToolUse",
  "preCompact",
  "postCompact",
  "sessionStart",
  "userPromptSubmit",
  "subagentStart",
  "subagentStop",
  "stop",
] as const;

export function isHookNeedsReview(entry: HookEntry): boolean {
  return entry.trustStatus === "untrusted" || entry.trustStatus === "modified";
}

export function isHookActive(entry: HookEntry): boolean {
  return (
    entry.trustStatus === "managed" ||
    (entry.enabled && entry.trustStatus === "trusted")
  );
}

export function normalizeSource(source: string | null): HookSource | null {
  switch (source) {
    case "plugin":
      return "plugin";
    case "user":
      return "user";
    case "system":
    case "mdm":
    case "cloudRequirements":
    case "cloudManagedConfig":
    case "legacyManagedConfigFile":
    case "legacyManagedConfigMdm":
      return "admin";
    case "project":
      return "project";
    case "sessionFlags":
      return "sessionFlags";
    case "unknown":
      return "unknown";
    case null:
      return null;
    default:
      return null;
  }
}

export function dedupeByKey(entries: HookEntry[]): HookEntry[] {
  const map = new Map<string, HookEntry>();
  for (const entry of entries) {
    if (!map.has(entry.key)) {
      map.set(entry.key, entry);
    }
  }
  return Array.from(map.values());
}

export function dedupeErrors(errors: HookError[]): HookError[] {
  const map = new Map<string, HookError>();
  for (const error of errors) {
    map.set(`${error.path}:${error.message}`, error);
  }
  return Array.from(map.values());
}

export function buildHookGroup(
  groups: HookGroup[],
  hooks: HookEntry[],
  extraGroups: HookGroup[] = [],
): HookGroup {
  const dedupedHooks = dedupeByKey(hooks);
  const hookKeys = new Set(dedupedHooks.map((h) => h.key));
  const relatedGroups = [
    ...groups.filter((g) => g.hooks.some((h) => hookKeys.has(h.key))),
    ...extraGroups,
  ];
  return {
    cwd: "",
    hooks: dedupedHooks,
    warnings: Array.from(
      new Set(relatedGroups.flatMap((g) => g.warnings)),
    ),
    errors: dedupeErrors(relatedGroups.flatMap((g) => g.errors)),
  };
}

export function isUnknownGroup(group: HookGroup): boolean {
  return (
    group.hooks.length === 0 &&
    (group.warnings.length > 0 || group.errors.length > 0)
  );
}

export function extractPluginEntries(groups: HookGroup[]): Array<{
  pluginId: string | null;
  entry: HookGroup;
}> {
  const map = new Map<string | null, HookEntry[]>();
  for (const group of groups) {
    for (const hook of group.hooks) {
      if (normalizeSource(hook.source) !== "plugin") continue;
      const existing = map.get(hook.pluginId ?? null);
      if (existing == null) {
        map.set(hook.pluginId ?? null, [hook]);
      } else {
        existing.push(hook);
      }
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      if (a == null) return 1;
      if (b == null) return -1;
      return a.localeCompare(b);
    })
    .map(([pluginId, hooks]) => ({
      pluginId,
      entry: buildHookGroup(groups, hooks),
    }));
}

export function filterBySource(
  groups: HookGroup[],
  source: HookSource,
): HookGroup | null {
  const filteredHooks = groups.flatMap((g) =>
    g.hooks.filter((h) => normalizeSource(h.source) === source),
  );
  const unknownGroups =
    source === "unknown" ? groups.filter(isUnknownGroup) : [];
  if (filteredHooks.length === 0 && unknownGroups.length === 0) {
    return null;
  }
  return buildHookGroup(groups, filteredHooks, unknownGroups);
}

export function buildSummaryBySource(
  groups: HookGroup[],
  source: HookSource,
): HookSettingsSummary | null {
  switch (source) {
    case "project": {
      const projectEntries = groups
        .map((g) => {
          const projectHooks = g.hooks.filter(
            (h) => normalizeSource(h.source) === "project",
          );
          if (projectHooks.length === 0) return null;
          return { ...g, hooks: projectHooks };
        })
        .filter((g): g is HookGroup => g != null);
      if (projectEntries.length === 0) return null;
      return { id: "project", projectEntries };
    }
    case "plugin": {
      const entry = filterBySource(groups, "plugin");
      const pluginEntries = extractPluginEntries(groups);
      if (entry == null || pluginEntries.length === 0) return null;
      return { id: "plugin", entry, pluginEntries };
    }
    case "user":
    case "admin":
    case "sessionFlags":
    case "unknown": {
      const entry = filterBySource(groups, source);
      if (entry == null) return null;
      return { id: source, entry };
    }
  }
}
