// Restored from ref/webview/assets/is-plan-event-enabled-yBXVgx1W.js
// IsPlanEventEnabled chunk restored from the Codex webview bundle.

export interface PlanEventSettings {
  enabled?: boolean;
}

export interface PlanEventConfig {
  __default?: PlanEventSettings;
}

/**
 * Determines whether plan events are enabled based on the provided settings.
 * Falls back to the default configuration if no explicit setting is provided.
 */
export function isPlanEventEnabled(
  defaultConfig: PlanEventConfig | undefined,
  settings: PlanEventSettings | undefined,
): boolean {
  return typeof settings?.enabled === "boolean"
    ? settings.enabled
    : (defaultConfig?.__default?.enabled ?? true);
}
