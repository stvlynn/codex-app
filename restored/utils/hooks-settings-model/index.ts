// Restored from ref/webview/assets/hooks-settings-model-CesfUzEC.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/hooks-settings-model-CesfUzEC.js
 *   Chunk: hooks-settings-model-CesfUzEC
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/hooks-settings-model/index.ts
 */

export * from "./types";
export * from "./helpers";

import type {
  HookGroup,
  HookEntry,
  HookEventStats,
  HookIssueSummary,
  HookSettingsSummary,
  HookSourceConfig,
  HookSummary,
  HookSource,
  HookEventName,
} from "./types";

import {
  ALL_HOOK_EVENTS,
  isHookActive,
  isHookNeedsReview,
  buildSummaryBySource,
  ALL_HOOK_SOURCES,
  filterBySource,
  buildHookGroup,
  dedupeByKey,
  dedupeErrors,
  normalizeSource,
} from "./helpers";

import { UNKNOWN_HOOK_PLUGIN_ID } from "./types";

/**
 * Returns statistics for each hook event type.
 */
export function getHookEventStats(groups: HookGroup[]): HookEventStats[] {
  return ALL_HOOK_EVENTS.map((eventName) => {
    const matching = groups.flatMap((g) =>
      g.hooks.filter((h) => h.eventName === eventName),
    );
    return {
      eventName,
      active: matching.filter(isHookActive).length,
      installed: matching.length,
      needsReview: matching.filter(isHookNeedsReview).length,
    };
  });
}

/**
 * Returns the total number of hooks that need review.
 */
export function getNeedsReviewCount(groups: HookGroup[]): number {
  return groups.flatMap((g) => g.hooks).filter(isHookNeedsReview).length;
}

/**
 * Returns hooks from a plugin that match keys in the given summary.
 */
export function getPluginHooksForSummary(
  groups: HookGroup[],
  summary: HookSummary | null,
): HookEntry[] {
  if (summary == null) return [];
  const summaryKeys = new Set(summary.hooks.map((h) => h.key));
  return (
    groups
      ?.flatMap((g) =>
        g.hooks.filter(
          (h) =>
            h.source === "plugin" &&
            h.pluginId === summary.id &&
            summaryKeys.has(h.key) &&
            isHookNeedsReview(h),
        ),
      )
      .filter((h): h is HookEntry => h != null) ?? []
  );
}

/**
 * Determines the default selection for a hook settings view.
 */
export function getDefaultSelection(
  summary: HookSettingsSummary | null,
  currentSelection: HookSourceConfig[],
  fallbackSelection?: HookSourceConfig,
): HookSourceConfig[] | undefined {
  if (
    summary == null ||
    !summary.id ||
    ("installed" in summary && !summary.installed) ||
    ("entry" in summary && summary.entry.hooks.length === 0)
  ) {
    return undefined;
  }
  if (currentSelection.length > 0) return currentSelection;
  if (fallbackSelection != null) return [fallbackSelection];
  return undefined;
}

/**
 * Returns a summary of issues (warnings + errors) and hooks needing review.
 */
export function getHookIssueSummary(group: HookGroup): HookIssueSummary {
  return {
    issueCount: group.warnings.length + group.errors.length,
    needsReview: group.hooks.filter(isHookNeedsReview).length,
  };
}

/**
 * Builds summaries for all hook sources.
 */
export function buildAllSourceSummaries(
  groups: HookGroup[],
): HookSettingsSummary[] {
  const summaries: HookSettingsSummary[] = [];
  for (const source of ALL_HOOK_SOURCES) {
    const summary = buildSummaryBySource(groups, source);
    if (summary != null) {
      summaries.push(summary);
    }
  }
  return summaries;
}

/**
 * Builds a source config from raw parameters.
 */
export function buildSourceConfig({
  pluginId,
  source,
  projectRoot,
  projectRoots,
}: {
  pluginId?: string | null;
  source: string | null;
  projectRoot?: string | null;
  projectRoots?: string[] | null;
}): HookSourceConfig | null {
  const normalized = normalizeSource(source);
  if (
    (normalized === "project" || (normalized == null && source == null)) &&
    projectRoot != null &&
    projectRoots?.includes(projectRoot)
  ) {
    return { source: "project", projectRoot };
  }
  if (normalized == null || normalized === "project") return null;
  if (normalized === "plugin") {
    if (pluginId == null) return { source: "plugin" };
    if (pluginId === UNKNOWN_HOOK_PLUGIN_ID) {
      return { source: "plugin", pluginId: null };
    }
    return { source: "plugin", pluginId };
  }
  return { source: normalized };
}

/**
 * Looks up the entry for a given source config from a list of summaries.
 */
export function findEntryForSourceConfig(
  summaries: HookSettingsSummary[],
  config: HookSourceConfig | null,
): HookGroup | null {
  if (config == null) return null;
  const summary = summaries.find((s) => s.id === config.source);
  if (summary == null) return null;

  if (config.source === "project") {
    if (summary.id !== "project") return null;
    return (
      summary.projectEntries.find((e) => e.cwd === config.projectRoot) ?? null
    );
  }

  if (config.source === "plugin") {
    if (summary.id !== "plugin") return null;
    if (config.pluginId === undefined) return summary.entry;
    return (
      summary.pluginEntries.find((e) => e.pluginId === config.pluginId)
        ?.entry ?? null
    );
  }

  if (summary.id === config.source) return summary.entry;
  return null;
}

/**
 * Sorts hooks by display order for a given event name.
 */
export function sortHooksByDisplayOrder(
  hooks: HookEntry[],
  eventName: HookEventName,
): HookEntry[] {
  return hooks
    .filter((h) => h.eventName === eventName)
    .sort((a, b) => {
      if (a.displayOrder < b.displayOrder) return -1;
      if (a.displayOrder > b.displayOrder) return 1;
      return 0;
    });
}

/**
 * Determines the dominant source from a list of raw source strings.
 */
export function getDominantSource(sources: string[]): HookSource | null {
  if (sources.length === 0) return null;
  const normalized = new Set(sources.map(normalizeSource));
  if (normalized.size === 1) {
    return normalized.values().next().value ?? null;
  }
  return null;
}

export { isHookNeedsReview as hookNeedsReview };
