// Restored from ref/webview/assets/imported-connector-apps-Cw08FNtc.js

export interface ConnectorApp {
  id: string;
  name: string;
  logoUrl?: string | null;
  logoUrlDark?: string | null;
  isAccessible: boolean;
  isEnabled: boolean;
  pluginDisplayNames: string[];
}

export interface ConnectorPluginInterface {
  displayName?: string;
}

export interface ConnectorPlugin {
  id: string;
  name: string;
  installed: boolean;
  enabled: boolean;
  interface?: ConnectorPluginInterface;
}

export interface ConnectorPluginBinding {
  plugin: ConnectorPlugin;
  displayName?: string;
}

export interface ConnectorEntry {
  codexAppId?: string | null;
  name: string;
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "");
}

function hasLogo(app: ConnectorApp): number {
  return app.logoUrl != null || app.logoUrlDark != null ? 1 : 0;
}

export function selectImportedConnectorApps({
  apps,
  connectors,
}: {
  apps: ConnectorApp[];
  connectors: ConnectorEntry[];
}): ConnectorApp[] {
  const appById = new Map(apps.map((app) => [app.id, app]));
  const appsByNormalizedName = new Map<string, ConnectorApp[]>();

  for (const app of apps) {
    const key = normalizeName(app.name);
    const group = appsByNormalizedName.get(key) ?? [];
    group.push(app);
    appsByNormalizedName.set(key, group);
  }

  const selected: ConnectorApp[] = [];
  const seenIds = new Set<string>();

  for (const connector of connectors) {
    const matchedApp =
      (connector.codexAppId == null
        ? undefined
        : appById.get(connector.codexAppId)) ??
      [...(appsByNormalizedName.get(normalizeName(connector.name)) ?? [])].sort(
        (a, b) => hasLogo(b) - hasLogo(a),
      )[0];

    if (matchedApp == null || seenIds.has(matchedApp.id)) continue;
    seenIds.add(matchedApp.id);
    selected.push(matchedApp);
  }

  return selected;
}

function findMatchingPlugin(
  app: ConnectorApp,
  plugins: ConnectorPluginBinding[],
): ConnectorPluginBinding | null {
  const nameSet = new Set(
    [app.name, ...app.pluginDisplayNames].map(normalizeName),
  );
  return (
    plugins.find((plugin) =>
      [
        plugin.plugin.name,
        plugin.displayName ?? "",
        plugin.plugin.interface?.displayName ?? "",
      ].some((name) => nameSet.has(normalizeName(name))),
    ) ?? null
  );
}

function mergePluginState(
  app: ConnectorApp,
  binding: ConnectorPluginBinding,
): ConnectorPluginBinding {
  return {
    ...binding,
    plugin: {
      ...binding.plugin,
      installed: app.isAccessible,
      enabled: app.isEnabled,
    },
  };
}

export function bindConnectorAppsToPlugins({
  apps,
  plugins,
}: {
  apps: ConnectorApp[];
  plugins: ConnectorPluginBinding[];
}): Array<{ app: ConnectorApp; plugin: ConnectorPlugin }> {
  const seenPluginIds = new Set<string>();
  return apps.flatMap((app) => {
    const binding = findMatchingPlugin(app, plugins);
    if (binding == null || seenPluginIds.has(binding.plugin.id)) return [];
    seenPluginIds.add(binding.plugin.id);
    return [{ app, plugin: mergePluginState(app, binding).plugin }];
  });
}
