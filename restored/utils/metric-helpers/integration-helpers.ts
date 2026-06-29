// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
interface StatsClient {
  increment: (name: string, value?: number, tags?: string[]) => void;
}
interface AnalyticsContext {
  stats: StatsClient;
}
interface IntegrationSettings {
  integrations?: Record<string, unknown>;
}
function normalizeIntegrationSettings(
  settings: IntegrationSettings,
): Record<string, Record<string, unknown>> {
  return Object.entries(settings.integrations ?? {}).reduce<
    Record<string, Record<string, unknown>>
  >((accumulator, [name, value]) => {
    accumulator[name] =
      value != null && typeof value === "object"
        ? (value as Record<string, unknown>)
        : {};
    return accumulator;
  }, {});
}
export function mergeIntegrationsSettings(
  defaults: IntegrationSettings,
  overrides: IntegrationSettings,
): Record<string, Record<string, unknown>> {
  const overrideMap = normalizeIntegrationSettings(overrides);
  return Object.entries(defaults.integrations ?? {}).reduce<
    Record<string, Record<string, unknown>>
  >((accumulator, [name, value]) => {
    accumulator[name] = {
      ...(value as Record<string, unknown>),
      ...overrideMap[name],
    };
    return accumulator;
  }, {});
}
export function recordIntegrationInvocation(
  ctx: AnalyticsContext,
  params: {
    methodName: string;
    integrationName: string;
    type: string;
    didError?: boolean;
  },
): void {
  const { methodName, integrationName, type, didError = false } = params;
  ctx.stats.increment(
    `analytics_js.integration.invoke${didError ? `.error` : ``}`,
    1,
    [
      `method:${methodName}`,
      `integration_name:${integrationName}`,
      `type:${type}`,
    ],
  );
}
