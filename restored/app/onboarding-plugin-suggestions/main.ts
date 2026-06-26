// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Main entry point for onboarding plugin suggestions.

import type { IntlShape, OnboardingPluginSuggestion } from "./types";
import { resolveMailProvider } from "../../utils/onboarding-mail-provider";
import { connectAppsRowMessage } from "./welcome-v2-data";
import { allRolePluginSuggestions } from "./role-suggestions-map";
export function getOnboardingPluginSuggestions({
  intl,
  mailProvider,
  plan: planArg = null,
  plugins = [],
  roles,
}: {
  intl: IntlShape;
  mailProvider: string | null;
  plan?: string | null;
  plugins?: unknown[];
  roles: string[];
}): OnboardingPluginSuggestion[] {
  let primaryRole = roles[0] ?? "something_else",
    resolvedMailProvider = resolveMailProvider(mailProvider, planArg);
  return (
    allRolePluginSuggestions[
      primaryRole as keyof typeof allRolePluginSuggestions
    ]?.flatMap((item) => {
      let matchedPlugin = plugins.find(
        (plugin) =>
          (
            plugin as {
              plugin: {
                name: string;
              };
            }
          ).plugin.name === item.pluginName,
      );
      return matchedPlugin == null ||
        (item.mailProvider != null &&
          item.mailProvider !== resolvedMailProvider)
        ? []
        : [
            {
              id: `onboarding-plugin-${primaryRole}-${item.pluginName}`,
              title: intl.formatMessage(item.titleMessage),
              description: intl.formatMessage(item.subtextMessage),
              prompt: intl.formatMessage(item.starterPromptMessage),
              appIds: [item.pluginName],
              status: "pending" as const,
              createdAtMs: 0,
              updatedAtMs: 0,
              analyticsType: "onboarding_starter" as const,
              homeAction: {
                type: "connect-plugin-onboarding" as const,
                plugin: matchedPlugin,
              },
              showTooltip: true,
              source: "default",
            },
          ];
    }) ?? []
  );
}
export { connectAppsRowMessage, resolveMailProvider };
