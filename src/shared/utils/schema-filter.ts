// Restored from ref/webview/assets/schema-filter-r146tzO0.js

import { __assign } from "tslib";
import { isPlanEventEnabled } from "./is-plan-event-enabled";
export interface SchemaFilterSettings {
  integrations?: Record<string, boolean>;
}
export interface RemotePluginSettings {
  subscriptions?: Array<{
    partnerAction: string;
  }>;
}
export interface RemotePluginEntry {
  creationName: string;
  name: string;
  settings: RemotePluginSettings;
}
export interface SchemaFilterContext {
  event: {
    event?: string;
    integrations?: Record<string, boolean | undefined>;
  };
  updateEvent(
    key: "integrations",
    value: Record<string, boolean | undefined>,
  ): void;
}
export interface SchemaFilterOptions {
  remotePlugins?: RemotePluginEntry[];
}
function buildDisabledIntegrations(
  schema: SchemaFilterSettings,
  options: SchemaFilterOptions,
): Record<string, boolean> {
  if (!schema || !Object.keys(schema)) return {};
  const disabledIntegrationNames = schema.integrations
    ? Object.keys(schema.integrations).filter(
        (name) => schema.integrations?.[name] === false,
      )
    : [];
  const disabledPluginNames: string[] = [];
  (options.remotePlugins ?? []).forEach((plugin) => {
    disabledIntegrationNames.forEach((name) => {
      if (plugin.creationName === name) {
        disabledPluginNames.push(plugin.name);
      }
    });
  });
  return (options.remotePlugins ?? []).reduce<Record<string, boolean>>(
    (acc, plugin) => {
      if (
        plugin.settings.subscriptions &&
        disabledPluginNames.includes(plugin.name)
      ) {
        plugin.settings.subscriptions.forEach((subscription) => {
          acc[`${plugin.name} ${subscription.partnerAction}`] = false;
        });
      }
      return acc;
    },
    {},
  );
}
export function schemaFilter(
  schema: SchemaFilterSettings,
  options: SchemaFilterOptions,
) {
  function apply(ctx: SchemaFilterContext): SchemaFilterContext {
    const eventSchema = schema;
    const eventName = ctx.event.event;
    if (!eventSchema || !eventName) return ctx;
    const eventConfig = eventSchema[eventName as keyof SchemaFilterSettings];
    if (isPlanEventEnabled(eventSchema, eventConfig as SchemaFilterSettings)) {
      const disabled = buildDisabledIntegrations(
        eventConfig as SchemaFilterSettings,
        options,
      );
      return ctx.updateEvent(
        "integrations",
        __assign(
          __assign(
            __assign({}, ctx.event.integrations),
            (eventConfig as SchemaFilterSettings)?.integrations,
          ),
          disabled,
        ),
      );
    }
    return ctx.updateEvent("integrations", {
      ...ctx.event.integrations,
      All: false,
      "Segment.io": true,
    });
  }
  return {
    name: "Schema Filter",
    version: "0.1.0",
    isLoaded: () => true,
    load: () => Promise.resolve(),
    type: "before",
    page: apply,
    alias: apply,
    track: apply,
    identify: apply,
    group: apply,
  };
}
