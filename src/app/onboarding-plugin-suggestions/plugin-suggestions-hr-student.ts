// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Plugin suggestion data for student and HR roles.

import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import {
  connectMessagesTitle,
  connectMessagesTitleV2,
  connectEmailTitle,
  connectFilesTitle,
  connectCalendarTitle,
} from "./shared-titles.ts";
const studentPluginSuggestions = [
  {
    pluginName: "github",
    titleMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.github.title",
      defaultMessage: "Connect GitHub",
      description: "Role-based plugin suggestion card title for students",
    }),
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.github.subtext",
      defaultMessage: "Debug code and projects",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.github.starterPrompt",
      defaultMessage:
        "Use GitHub to debug my project and explain the fix in plain English",
      description:
        "Prompt to prefill after connecting GitHub from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.gmail.subtext",
      defaultMessage: "Summarize updates for classes from email",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.gmail.starterPrompt",
      defaultMessage:
        "Use Gmail to summarize class emails and deadlines for this week",
      description:
        "Prompt to prefill after connecting Gmail from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-email",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.outlookEmail.subtext",
      defaultMessage: "Summarize updates for classes from email",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize class emails and deadlines for this week",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.googleDrive.subtext",
      defaultMessage: "Review notes, readings, and papers",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.googleDrive.starterPrompt",
      defaultMessage:
        "Use Google Drive to summarize lecture notes and study materials for a topic",
      description:
        "Prompt to prefill after connecting Google Drive from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "sharepoint",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.sharepoint.subtext",
      defaultMessage: "Review notes, readings, and papers",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to summarize lecture notes and study materials for a topic",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.googleCalendar.subtext",
      defaultMessage: "Track due dates and study blocks",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.googleCalendar.starterPrompt",
      defaultMessage:
        "Use Google Calendar to build a plan around upcoming deadlines and exams",
      description:
        "Prompt to prefill after connecting Google Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.outlookCalendar.subtext",
      defaultMessage: "Track due dates and study blocks",
      description: "Role-based plugin suggestion card subtext for students",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.student.outlookCalendar.starterPrompt",
      defaultMessage:
        "Use Outlook Calendar to build a plan around upcoming deadlines and exams",
      description:
        "Prompt to prefill after connecting Outlook Calendar from the role-based plugin suggestion card",
    }),
  },
];
const hrPluginSuggestions = [
  {
    mailProvider: "google",
    pluginName: "slack",
    titleMessage: connectMessagesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.slack.subtext",
      defaultMessage: "Get context from recent team discussions",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.slack.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.hr.teams.subtext",
      defaultMessage: "Get context from recent team discussions",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.teams.starterPrompt",
      defaultMessage:
        "Use Teams to catch me up on recent decisions and open questions",
      description:
        "Prompt to prefill after connecting Teams from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "gmail",
    titleMessage: connectEmailTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.gmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.gmail.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.hr.outlookEmail.subtext",
      defaultMessage: "Summarize stakeholder asks from email",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.outlookEmail.starterPrompt",
      defaultMessage:
        "Use Outlook Email to summarize exec and stakeholder requests",
      description:
        "Prompt to prefill after connecting Outlook Email from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-drive",
    titleMessage: connectFilesTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.googleDrive.subtext",
      defaultMessage: "Review results, research, and plans",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.googleDrive.starterPrompt",
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
      id: "electron.onboarding.pluginSuggestions.hr.sharepoint.subtext",
      defaultMessage: "Review results, research, and plans",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.sharepoint.starterPrompt",
      defaultMessage:
        "Use SharePoint to review the latest results and research, and flag opportunities",
      description:
        "Prompt to prefill after connecting SharePoint from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "google",
    pluginName: "google-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.googleCalendar.subtext",
      defaultMessage: "Prep for upcoming meetings",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.googleCalendar.starterPrompt",
      defaultMessage:
        "Use Google Calendar to prep me for planning meetings and project reviews",
      description:
        "Prompt to prefill after connecting Google Calendar from the role-based plugin suggestion card",
    }),
  },
  {
    mailProvider: "microsoft",
    pluginName: "outlook-calendar",
    titleMessage: connectCalendarTitle,
    subtextMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.outlookCalendar.subtext",
      defaultMessage: "Prep for upcoming meetings",
      description: "Role-based plugin suggestion card subtext for HR users",
    }),
    starterPromptMessage: defineMessage({
      id: "electron.onboarding.pluginSuggestions.hr.outlookCalendar.starterPrompt",
      defaultMessage:
        "Use Outlook Calendar to prep me for planning meetings and project reviews",
      description:
        "Prompt to prefill after connecting Outlook Calendar from the role-based plugin suggestion card",
    }),
  },
];
export { studentPluginSuggestions, hrPluginSuggestions };
