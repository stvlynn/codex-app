// Restored from ref/webview/assets/settings-shared-B8obOSL1.js
import { defineMessages } from "react-intl";
export type SettingsNavSlug =
  | "appearance"
  | "pets"
  | "general-settings"
  | "profile"
  | "keyboard-shortcuts"
  | "codex-micro"
  | "appshots"
  | "agent"
  | "git-settings"
  | "data-controls"
  | "code-review"
  | "cloud-settings"
  | "cloud-environments"
  | "personalization"
  | "usage"
  | "computer-use"
  | "browser-use"
  | "local-environments"
  | "worktrees"
  | "environments"
  | "mcp-settings"
  | "hooks-settings"
  | "connections"
  | "plugins-settings"
  | "skills-settings";
type MessageDescriptor = {
  id: string;
  defaultMessage: string;
  description: string;
};
export const NAV_LABELS: Record<SettingsNavSlug, MessageDescriptor> =
  defineMessages({
    appearance: {
      id: "settings.nav.appearance",
      defaultMessage: "Appearance",
      description: "Title for appearance settings section",
    },
    pets: {
      id: "settings.nav.pets",
      defaultMessage: "Pets",
      description: "Title for pets settings section",
    },
    "general-settings": {
      id: "settings.nav.general-settings",
      defaultMessage: "General",
      description: "Title for general settings section",
    },
    profile: {
      id: "settings.nav.profile",
      defaultMessage: "Profile",
      description: "Title for profile section",
    },
    "keyboard-shortcuts": {
      id: "settings.nav.keyboard-shortcuts",
      defaultMessage: "Keyboard shortcuts",
      description: "Title for keyboard shortcuts settings section",
    },
    "codex-micro": {
      id: "settings.nav.codex-micro",
      defaultMessage: "Codex Micro",
      description: "Title for Codex Micro settings section",
    },
    appshots: {
      id: "settings.nav.appshots",
      defaultMessage: "Appshots",
      description: "Title for appshots settings section",
    },
    agent: {
      id: "settings.nav.agent",
      defaultMessage: "Configuration",
      description: "Title for configuration settings section",
    },
    "git-settings": {
      id: "settings.nav.git-settings",
      defaultMessage: "Git",
      description: "Title for git settings section",
    },
    "data-controls": {
      id: "settings.nav.data-controls",
      defaultMessage: "Archived chats",
      description: "Title for archived threads settings section",
    },
    "code-review": {
      id: "settings.nav.codeReview",
      defaultMessage: "Code review",
      description: "Title for code review settings section",
    },
    "cloud-settings": {
      id: "settings.nav.cloudSettings",
      defaultMessage: "Cloud preferences",
      description: "Title for cloud settings section",
    },
    "cloud-environments": {
      id: "settings.nav.cloudEnvironments",
      defaultMessage: "Cloud environments",
      description: "Title for cloud environments settings section",
    },
    personalization: {
      id: "settings.nav.personalization",
      defaultMessage: "Personalization",
      description: "Title for personalization settings section",
    },
    usage: {
      id: "settings.nav.usage",
      defaultMessage: "Usage & billing",
      description: "Title for usage and billing settings section",
    },
    "computer-use": {
      id: "settings.nav.computer-use",
      defaultMessage: "Computer use",
      description: "Title for computer use settings section",
    },
    "browser-use": {
      id: "settings.nav.browser-use",
      defaultMessage: "Browser",
      description: "Title for in-app browser settings section",
    },
    "local-environments": {
      id: "settings.nav.local-environments",
      defaultMessage: "Environments",
      description: "Title for environments settings section",
    },
    worktrees: {
      id: "settings.nav.worktrees",
      defaultMessage: "Worktrees",
      description: "Title for worktrees settings section",
    },
    environments: {
      id: "settings.nav.environments",
      defaultMessage: "Cloud Environments",
      description: "Title for environments settings section",
    },
    "mcp-settings": {
      id: "settings.nav.mcp-settings",
      defaultMessage: "MCP servers",
      description: "Title for MCP servers settings section",
    },
    "hooks-settings": {
      id: "settings.nav.hooks-settings",
      defaultMessage: "Hooks",
      description: "Title for hooks settings section",
    },
    connections: {
      id: "settings.nav.connections",
      defaultMessage: "Connections",
      description: "Title for connections settings section",
    },
    "plugins-settings": {
      id: "settings.nav.plugins-settings",
      defaultMessage: "Plugins",
      description: "Title for plugins settings section",
    },
    "skills-settings": {
      id: "settings.nav.skills-settings",
      defaultMessage: "Skills",
      description: "Title for skills settings section",
    },
  });
export function getNavLabel(slug: SettingsNavSlug): MessageDescriptor {
  return NAV_LABELS[slug];
}
