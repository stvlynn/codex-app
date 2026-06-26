// Settings navigation helpers: nav labels, section titles, nav button, subtitles.

import type { ReactNode } from "react";
import clsx from "clsx";
import { Button } from "../../ui/button";
import { ChevronIcon } from "../../icons/chevron-icon";
import { FormattedMessage } from "../../boundaries/intl-messageformat";
import { MCP_LEARN_MORE_URL } from "../../utils/links-bd-mmkun-d";

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

const NAV_LABELS: Record<
  SettingsNavSlug,
  { id: string; defaultMessage: string; description: string }
> = {
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
};

export function getSettingsNavLabel(slug: SettingsNavSlug) {
  return NAV_LABELS[slug];
}

export interface SettingsNavButtonProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  chevronClassName?: string;
  color?: "secondary" | string;
  [key: string]: unknown;
}

export function SettingsNavButton({
  children,
  className,
  contentClassName,
  chevronClassName,
  color = "secondary",
  ...rest
}: SettingsNavButtonProps) {
  return (
    <Button
      color={color}
      size="toolbar"
      className={clsx("w-[240px] justify-between", className)}
      {...rest}
    >
      <span
        className={clsx(
          "flex min-w-0 flex-1 items-center gap-1.5",
          contentClassName,
        )}
      >
        {children}
      </span>
      <ChevronIcon
        className={clsx(
          "icon-2xs shrink-0 text-token-input-placeholder-foreground",
          chevronClassName,
        )}
      />
    </Button>
  );
}

export interface SettingsSectionLabelProps {
  slug: SettingsNavSlug;
}

export function SettingsSectionLabel({ slug }: SettingsSectionLabelProps) {
  const label = getSettingsNavLabel(slug);
  return <FormattedMessage {...label} />;
}

export interface SettingsSectionTitleProps {
  slug: SettingsNavSlug;
}

export function SettingsSectionTitle({ slug }: SettingsSectionTitleProps) {
  switch (slug) {
    case "appshots":
      return (
        <FormattedMessage
          id="settings.section.appshots"
          defaultMessage="Appshots"
          description="Title for appshots settings section"
        />
      );
    case "appearance":
      return (
        <FormattedMessage
          id="settings.section.appearance"
          defaultMessage="Appearance"
          description="Title for appearance settings section"
        />
      );
    case "pets":
      return (
        <FormattedMessage
          id="settings.section.pets"
          defaultMessage="Pets"
          description="Title for pets settings section"
        />
      );
    case "general-settings":
      return (
        <FormattedMessage
          id="settings.section.general-settings"
          defaultMessage="General"
          description="Title for general settings section"
        />
      );
    case "profile":
      return (
        <FormattedMessage
          id="settings.section.profile"
          defaultMessage="Profile"
          description="Title for profile section"
        />
      );
    case "keyboard-shortcuts":
      return (
        <FormattedMessage
          id="settings.section.keyboard-shortcuts"
          defaultMessage="Keyboard shortcuts"
          description="Title for keyboard shortcuts settings section"
        />
      );
    case "codex-micro":
      return (
        <FormattedMessage
          id="settings.section.codex-micro"
          defaultMessage="Codex Micro"
          description="Title for Codex Micro settings section"
        />
      );
    case "agent":
      return (
        <FormattedMessage
          id="settings.section.agent"
          defaultMessage="Configuration"
          description="Title for configuration settings section"
        />
      );
    case "git-settings":
      return (
        <FormattedMessage
          id="settings.section.git-settings"
          defaultMessage="Git"
          description="Title for git settings section"
        />
      );
    case "data-controls":
      return (
        <FormattedMessage
          id="settings.section.data-controls"
          defaultMessage="Archived chats"
          description="Title for archived threads settings section"
        />
      );
    case "code-review":
      return (
        <FormattedMessage
          id="settings.section.codeReview"
          defaultMessage="Code review"
          description="Title for code review settings section"
        />
      );
    case "cloud-settings":
      return (
        <FormattedMessage
          id="settings.section.cloudSettings"
          defaultMessage="Cloud preferences"
          description="Title for cloud settings section"
        />
      );
    case "cloud-environments":
      return (
        <FormattedMessage
          id="settings.section.cloudEnvironments"
          defaultMessage="Cloud environments"
          description="Title for cloud environments settings section"
        />
      );
    case "personalization":
      return (
        <FormattedMessage
          id="settings.section.personalization"
          defaultMessage="Personalization"
          description="Title for personalization settings section"
        />
      );
    case "usage":
      return (
        <FormattedMessage
          id="settings.section.usage"
          defaultMessage="Usage & billing"
          description="Title for usage and billing settings section"
        />
      );
    case "computer-use":
      return (
        <FormattedMessage
          id="computerUse.label"
          defaultMessage="Computer use"
          description="Label for the Computer Use feature"
        />
      );
    case "browser-use":
      return (
        <FormattedMessage
          id="settings.section.browser-use"
          defaultMessage="Browser"
          description="Title for in-app browser settings section"
        />
      );
    case "local-environments":
      return (
        <FormattedMessage
          id="settings.section.local-environments"
          defaultMessage="Environments"
          description="Title for environments settings section"
        />
      );
    case "worktrees":
      return (
        <FormattedMessage
          id="settings.section.worktrees"
          defaultMessage="Worktrees"
          description="Title for worktrees settings section"
        />
      );
    case "environments":
      return (
        <FormattedMessage
          id="settings.section.environments"
          defaultMessage="Cloud Environments"
          description="Title for environments settings section"
        />
      );
    case "mcp-settings":
      return (
        <FormattedMessage
          id="settings.section.mcp-settings"
          defaultMessage="MCP servers"
          description="Title for MCP servers settings section"
        />
      );
    case "hooks-settings":
      return (
        <FormattedMessage
          id="settings.section.hooks-settings"
          defaultMessage="Hooks"
          description="Title for hooks settings section"
        />
      );
    case "connections":
      return (
        <FormattedMessage
          id="settings.section.connections"
          defaultMessage="Connections"
          description="Title for connections settings section"
        />
      );
    case "plugins-settings":
      return (
        <FormattedMessage
          id="settings.section.plugins-settings"
          defaultMessage="Plugins"
          description="Title for plugins settings section"
        />
      );
    case "skills-settings":
      return (
        <FormattedMessage
          id="settings.section.skills-settings"
          defaultMessage="Skills"
          description="Title for skills settings section"
        />
      );
  }
}

export interface SettingsSectionSubtitleProps {
  slug: SettingsNavSlug;
}

export function SettingsSectionSubtitle({
  slug,
}: SettingsSectionSubtitleProps) {
  if (slug === "mcp-settings") {
    return (
      <div>
        <FormattedMessage
          id="settings.section.mcp-settings.subtitle"
          defaultMessage="Connect external tools and data sources. "
          description="Subtitle for MCP settings section"
        />
        <a
          className="inline-flex items-center gap-1 text-base text-token-text-link-foreground"
          href={MCP_LEARN_MORE_URL}
          target="_blank"
          rel="noreferrer"
        >
          <FormattedMessage
            id="settings.section.mcp-settings.learnMore"
            defaultMessage="Learn more."
            description="Label for MCP docs link"
          />
        </a>
      </div>
    );
  }
  return null;
}
