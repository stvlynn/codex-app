// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Plugin suggestion data for sales and design roles.

import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import {
  connectMessagesTitle,
  connectMessagesTitleV2,
  connectEmailTitle,
  connectFilesTitle,
  connectCalendarTitle,
} from "./shared-titles";
const salesPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.gmail.subtext",
      defaultMessage: "Reply to prospects and customers",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.gmail.starterPrompt",
      defaultMessage:
        "Use Gmail to draft follow-ups for my highest-priority prospects",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.outlookEmail.subtext",
      defaultMessage: "Reply to prospects and customers",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to draft follow-ups for my highest-priority prospects",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.googleCalendar.subtext",
      defaultMessage: "Prep for customer meetings",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.googleCalendar.starterPrompt",
      defaultMessage:
        "Use Google Calendar to prep me for upcoming customer calls with context and talk tracks",
      description:
        "Prompt to prefill after connecting Google Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.outlookCalendar.subtext",
      defaultMessage: "Prep for customer meetings",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.outlookCalendar.starterPrompt",
      defaultMessage:
        "Use Outlook Calendar to prep me for upcoming customer calls with context and talk tracks",
      description:
        "Prompt to prefill after connecting Outlook Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.googleDrive.subtext",
      defaultMessage: "Review account plans and decks",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to review account plans and key materials",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.sharepoint.subtext",
      defaultMessage: "Review account plans and decks",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review account plans and key materials",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitleV2,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.slack.subtext",
      defaultMessage: "Catch up on deal discussions",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.slack.starterPrompt",
      defaultMessage: "Use Slack to summarize account threads and deal risks",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitleV2,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.teams.subtext",
      defaultMessage: "Catch up on deal discussions",
      description: "Role-based plugin suggestion card subtext for sales users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.sales.teams.starterPrompt",
      defaultMessage: "Use Teams to summarize account threads and deal risks",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
];
export { salesPluginSuggestions };
