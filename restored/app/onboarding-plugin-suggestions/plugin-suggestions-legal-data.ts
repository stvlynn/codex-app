// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Plugin suggestion data for legal and data science roles.

import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import {
  connectMessagesTitle,
  connectMessagesTitleV2,
  connectEmailTitle,
  connectFilesTitle,
  connectCalendarTitle,
} from "./shared-titles";
const legalPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.slack.subtext",
      defaultMessage: "Track decisions and blockers from messaging",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.slack.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.teams.subtext",
      defaultMessage: "Track decisions and blockers from messaging",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.teams.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.googleCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.googleCalendar.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.outlookCalendar.subtext",
      defaultMessage: "Prep for upcoming operating reviews",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.outlookCalendar.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.googleDrive.subtext",
      defaultMessage: "Review project plans",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.googleDrive.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.sharepoint.subtext",
      defaultMessage: "Review project plans",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.sharepoint.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.gmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.gmail.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.legal.outlookEmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description: "Role-based plugin suggestion card subtext for legal users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.legal.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
];
const dataSciencePluginSuggestions = [
  {
    pluginName: "github",
    titleMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.github.title",
      defaultMessage: "Connect GitHub",
      description:
        "Role-based plugin suggestion card title for data science users",
    }),
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.github.subtext",
      defaultMessage: "Inspect notebooks, models, and pipelines",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.github.starterPrompt",
      defaultMessage:
        "Use GitHub to review recent notebook and pipeline changes and explain what changed",
      description:
        "Prompt to prefill after connecting GitHub from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.gmail.subtext",
      defaultMessage: "Summarize analysis requests",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.gmail.starterPrompt",
      defaultMessage: "Use Gmail to summarize data requests from my inbox",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.outlookEmail.subtext",
      defaultMessage: "Summarize analysis requests",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize data requests from my inbox",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.googleDrive.subtext",
      defaultMessage: "Review experiments and readouts",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to review experiment docs and metric definitions",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.sharepoint.subtext",
      defaultMessage: "Review experiments and readouts",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review experiment docs and metric definitions",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.slack.subtext",
      defaultMessage: "Catch up on metric questions",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.slack.starterPrompt",
      defaultMessage:
        "Use Slack to summarize metric discussions and open analysis asks",
      description:
        "Prompt to prefill after connecting Slack from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "teams",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.teams.subtext",
      defaultMessage: "Catch up on metric questions",
      description:
        "Role-based plugin suggestion card subtext for data science users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.dataScience.teams.starterPrompt",
      defaultMessage:
        "Use Teams to summarize metric discussions and open analysis asks",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
];
export { legalPluginSuggestions, dataSciencePluginSuggestions };
