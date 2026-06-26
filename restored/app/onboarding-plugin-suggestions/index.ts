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
} from "./types";
export {
  connectAppsRowMessage,
  resolveMailProvider,
  getOnboardingPluginSuggestions,
} from "./main";
export {
  getOnboardingSuggestionSummary,
  getSuggestionPrompts,
  getUniqueRoles,
  normalizeRole,
} from "./helpers";
export { welcomeV2SuggestionsByRole } from "./welcome-v2-data";
export { allRolePluginSuggestions } from "./role-suggestions-map";
