// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Onboarding plugin suggestion types.

export interface IntlMessageDescriptor {
  id: string;
  defaultMessage: string;
  description?: string;
}
export interface IntlShape {
  formatMessage: (
    descriptor: IntlMessageDescriptor,
    values?: Record<string, string | number>,
  ) => string;
}
export interface PluginSuggestionItem {
  appIds: string[];
  titleMessage: IntlMessageDescriptor;
  promptMessage: IntlMessageDescriptor;
}
export interface PluginSuggestionConfig {
  appIds: string[];
  titleMessage: IntlMessageDescriptor;
  subtextMessage: IntlMessageDescriptor;
  starterPromptMessage: IntlMessageDescriptor;
}
export interface MailAwarePluginConfig extends PluginSuggestionConfig {
  mailProvider?: "google" | "microsoft";
  pluginName: string;
}
export interface OnboardingPluginSuggestion {
  id: string;
  title: string;
  description: string;
  prompt: string;
  appIds: string[];
  status: "pending";
  createdAtMs: number;
  updatedAtMs: number;
  analyticsType: "onboarding_starter";
  homeAction: {
    type: "connect-plugin-onboarding";
    plugin: unknown;
  };
  showTooltip: boolean;
  source: "default";
}
export type UserRole =
  | "engineering"
  | "product_management"
  | "finance"
  | "data_science"
  | "design"
  | "marketing"
  | "sales"
  | "operations"
  | "legal"
  | "hr"
  | "customer_success"
  | "something_else"
  | "student";
