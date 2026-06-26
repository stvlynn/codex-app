// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Plugin suggestion data for operations and people/HR roles.

import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import {
  connectMessagesTitle,
  connectMessagesTitleV2,
  connectEmailTitle,
  connectFilesTitle,
  connectCalendarTitle,
} from "./shared-titles";
const operationsPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.slack.subtext",
      defaultMessage: "Track decisions and blockers from messaging",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.slack.starterPrompt",
      defaultMessage:
        "Use Slack to summarize cross-functional decisions, blockers, and owners",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.teams.subtext",
      defaultMessage: "Track decisions and blockers from messaging",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.teams.starterPrompt",
      defaultMessage:
        "Use Teams to summarize cross-functional decisions, blockers, and owners",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.googleCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.googleCalendar.starterPrompt",
      defaultMessage:
        "Use Google Calendar to prep me for planning meetings and operating reviews",
      description:
        "Prompt to prefill after connecting Google Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.outlookCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.outlookCalendar.starterPrompt",
      defaultMessage:
        "Use Outlook Calendar to prep me for planning meetings and operating reviews",
      description:
        "Prompt to prefill after connecting Outlook Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.googleDrive.subtext",
      defaultMessage: "Review project plans",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to review project plans and surface risks",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.sharepoint.subtext",
      defaultMessage: "Review project plans",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review project plans and surface risks",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.gmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.gmail.starterPrompt",
      defaultMessage: "Use Gmail to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.outlookEmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description:
        "Role-based plugin suggestion card subtext for operations users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.operations.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
];
const peopleHrPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.slack.subtext",
      defaultMessage: "Get context from recent team discussions",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.slack.starterPrompt",
      defaultMessage:
        "Use Slack to catch me up on recent decisions and open questions",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.teams.subtext",
      defaultMessage: "Get context from recent team discussions",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.teams.starterPrompt",
      defaultMessage:
        "Use Teams to catch me up on recent decisions and open questions",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.googleCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.googleCalendar.starterPrompt",
      defaultMessage:
        "Use Google Calendar to prep me for planning meetings and operating reviews",
      description:
        "Prompt to prefill after connecting Google Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.outlookCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.outlookCalendar.starterPrompt",
      defaultMessage:
        "Use Outlook Calendar to prep me for planning meetings and operating reviews",
      description:
        "Prompt to prefill after connecting Outlook Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.googleDrive.subtext",
      defaultMessage: "Review results, research, and plans",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to review the latest results and research, and flag opportunities",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.sharepoint.subtext",
      defaultMessage: "Review results, research, and plans",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review the latest results and research, and flag opportunities",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.gmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.gmail.starterPrompt",
      defaultMessage: "Use Gmail to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.outlookEmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description:
        "Role-based plugin suggestion card subtext for people and HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.peopleHr.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
];
export { operationsPluginSuggestions, peopleHrPluginSuggestions };
