// Restored from ref/webview/assets/hooks-settings-route-29iNzgOb.js

import { getDominantSource } from "./hooks-settings-model";
const HOOKS_SETTINGS_PATH = "hooks-settings";
const SETTINGS_BASE = "/settings";
export interface HooksSettingsParams {
  hostId?: string | null;
  pluginId?: string | null;
  projectRoot?: string | null;
  source?: string | null;
}
export interface HooksSettingsRouteConfig {
  source: string;
  projectRoot?: string | null;
  pluginId?: string | null;
}
export function buildHooksSettingsQuery({
  hostId,
  pluginId,
  projectRoot,
  source,
}: HooksSettingsParams): string {
  const params = new URLSearchParams();
  if (hostId != null) params.set("hostId", hostId);
  if (source != null) {
    params.set("source", source);
    if (projectRoot != null) params.set("projectRoot", projectRoot);
    if (source === "plugin" && pluginId !== undefined) {
      params.set("pluginId", pluginId ?? "__unknown__");
    }
  }
  const query = params.toString();
  return query === "" ? HOOKS_SETTINGS_PATH : `${HOOKS_SETTINGS_PATH}?${query}`;
}
export function buildHooksSettingsRoute(params: HooksSettingsParams): string {
  return `${SETTINGS_BASE}/${buildHooksSettingsQuery(params)}`;
}
export function buildHooksSettingsPath({
  hooks,
  hostId,
  projectRoot,
}: {
  hooks: Array<{
    source: string;
    pluginId?: string | null;
  }>;
  hostId?: string | null;
  projectRoot?: string | null;
}): string {
  const dominantSource = getDominantSource(hooks.map((h) => h.source));
  return buildHooksSettingsQuery({
    hostId,
    pluginId:
      dominantSource === "plugin" ? getCommonPluginId(hooks) : undefined,
    projectRoot,
    source: dominantSource ?? undefined,
  });
}
function getCommonPluginId(
  hooks: Array<{
    pluginId?: string | null;
  }>,
): string | null {
  const ids = new Set(hooks.map((h) => h.pluginId));
  if (ids.size === 1) {
    const first = ids.values().next().value;
    return first ?? null;
  }
  return null;
}
export function updateSearchParams(
  params: URLSearchParams,
  hostId: string,
  config: HooksSettingsRouteConfig | null,
): void {
  params.delete("hostId");
  params.delete("pluginId");
  params.delete("projectRoot");
  params.delete("source");
  if (config == null) return;
  params.set("hostId", hostId);
  params.set("source", config.source);
  if (config.source === "project") {
    params.set("projectRoot", config.projectRoot ?? "");
    return;
  }
  if (config.source === "plugin" && config.pluginId !== undefined) {
    params.set("pluginId", config.pluginId ?? "__unknown__");
  }
}
