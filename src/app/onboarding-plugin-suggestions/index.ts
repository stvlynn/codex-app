// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Onboarding plugin suggestions — barrel export.

export type {
  IntlMessageDescriptor,
  IntlShape,
  PluginSuggestionItem,
  PluginSuggestionConfig,
  MailAwarePluginConfig,
  OnboardingPluginSuggestion,
  UserRole,
} from "../dialog-layout/types.ts";
export {
  connectAppsRowMessage,
  resolveMailProvider,
  getOnboardingPluginSuggestions,
} from "../../shared/boundaries/lodash/main.ts";
export {
  getOnboardingSuggestionSummary,
  getSuggestionPrompts,
  getUniqueRoles,
  normalizeRole,
} from "../../shared/utils/hooks-settings-model/helpers.ts";
export { welcomeV2SuggestionsByRole } from "./welcome-v2-data.ts";
export { allRolePluginSuggestions } from "./role-suggestions-map.ts";
