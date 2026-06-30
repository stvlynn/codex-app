// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Plugin suggestion data for engineering and product management roles.

import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import {
  connectMessagesTitle,
  connectMessagesTitleV2,
  connectEmailTitle,
  connectFilesTitle,
  connectCalendarTitle,
} from "./shared-titles.ts";
const engineeringPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.slack.subtext",
      defaultMessage: "Catch up on engineering threads",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.slack.starterPrompt",
      defaultMessage:
        "Use Slack to catch me up on engineering discussions needing attention",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.teams.subtext",
      defaultMessage: "Catch up on engineering threads",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.teams.starterPrompt",
      defaultMessage:
        "Use Teams to catch me up on engineering discussions needing attention",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
  {
    pluginName: "github",
    titleMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.github.title",
      defaultMessage: "Connect GitHub",
      description: "Role-based plugin suggestion card title for engineers",
    }),
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.github.subtext",
      defaultMessage: "Review PRs, code, and CI checks",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.github.starterPrompt",
      defaultMessage:
        "Use GitHub to review my open PRs and call out risks and failing checks",
      description:
        "Prompt to prefill after connecting GitHub from the role-based plugin suggestion card",
    }),
  },
  {
    pluginName: "linear",
    titleMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.linear.title",
      defaultMessage: "Connect Linear",
      description: "Role-based plugin suggestion card title for engineers",
    }),
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.linear.subtext",
      defaultMessage: "Track bugs and implementation work",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.linear.starterPrompt",
      defaultMessage:
        "Use Linear to summarize my active engineering issues and what is blocked",
      description:
        "Prompt to prefill after connecting Linear from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.gmail.subtext",
      defaultMessage: "Monitor build alerts",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.gmail.starterPrompt",
      defaultMessage:
        "Check my email inbox for failed builds, deploy alerts, and CI issues needing attention.",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.outlookEmail.subtext",
      defaultMessage: "Monitor build alerts",
      description: "Role-based plugin suggestion card subtext for engineers",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.engineering.outlookEmail.starterPrompt",
      defaultMessage:
        "Check my email inbox for failed builds, deploy alerts, and CI issues needing attention.",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
];
const productManagementPluginSuggestions = [
  {
    pluginName: "linear",
    titleMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.linear.title",
      defaultMessage: "Connect Linear",
      description:
        "Role-based plugin suggestion card title for product management users",
    }),
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.linear.subtext",
      defaultMessage: "Track product work and blockers",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.linear.starterPrompt",
      defaultMessage:
        "Use Linear to summarize active product work, blockers, and decisions",
      description:
        "Prompt to prefill after connecting Linear from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.slack.subtext",
      defaultMessage: "Catch up on product discussions",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.slack.starterPrompt",
      defaultMessage:
        "Use Slack to summarize product feedback, decisions, and blockers",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.teams.subtext",
      defaultMessage: "Catch up on product discussions",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.teams.starterPrompt",
      defaultMessage:
        "Use Teams to summarize product feedback, decisions, and blockers",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.googleDrive.subtext",
      defaultMessage: "Review PRDs, research, and launch plans",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to review PRDs, research, and launch plans",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.sharepoint.subtext",
      defaultMessage: "Review PRDs, research, and launch plans",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review PRDs, research, and launch plans",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.gmail.subtext",
      defaultMessage: "Summarize stakeholder requests from my inbox",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.gmail.starterPrompt",
      defaultMessage:
        "Use Gmail to summarize things in my inbox that need my attention",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.outlookEmail.subtext",
      defaultMessage: "Summarize stakeholder requests from my inbox",
      description:
        "Role-based plugin suggestion card subtext for product management users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.productManagement.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook to summarize things in my inbox that need my attention",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
];
export { engineeringPluginSuggestions, productManagementPluginSuggestions };
