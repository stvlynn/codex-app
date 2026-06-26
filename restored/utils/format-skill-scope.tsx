// Restored from ref/webview/assets/format-skill-scope-CChDxa0f.js
// Skill scope label formatting utilities for displaying skill ownership scopes.

import { defineMessages } from "react-intl";

export type SkillScope = "system" | "repo" | "user" | "admin";

const scopeMessages = defineMessages({
  system: {
    id: "skills.scope.system",
    defaultMessage: "System",
    description: "Indicates a system scoped skill",
  },
  repo: {
    id: "skills.scope.repo",
    defaultMessage: "Repo",
    description: "Indicates a skill scoped to the current repository",
  },
  user: {
    id: "skills.scope.user",
    defaultMessage: "User",
    description: "Indicates a skill scoped to the user",
  },
  admin: {
    id: "skills.scope.admin",
    defaultMessage: "Admin",
    description: "Indicates a skill scoped to the admin",
  },
});

export function getScopeLabel(
  intl: { formatMessage: (msg: typeof scopeMessages.system) => string },
  scope: SkillScope,
): string {
  const msg = scopeMessages[scope];
  return msg ? intl.formatMessage(msg) : scope;
}

export function getBasename(filePath: string): string {
  const trimmed = filePath.replace(/[\\/]+$/, "");
  const lastSlash = Math.max(
    trimmed.lastIndexOf("/"),
    trimmed.lastIndexOf("\\"),
  );
  return lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1);
}

const displayScopeMessages = defineMessages({
  system: {
    id: "skills.scope.builtIn",
    defaultMessage: "System",
    description: "Label for system skills",
  },
  repo: {
    id: "skills.scope.team",
    defaultMessage: "Team",
    description: "Label for team skills",
  },
  user: {
    id: "skills.scope.personal",
    defaultMessage: "Personal",
    description: "Label for personal skills",
  },
  admin: {
    id: "skills.scope.adminInstalled",
    defaultMessage: "Admin installed",
    description: "Label for admin installed skills",
  },
});

export interface FormatScopeLabelOptions {
  scope: SkillScope;
  intl: {
    formatMessage: (
      msg: typeof displayScopeMessages.system,
      values?: Record<string, unknown>,
    ) => string;
  };
  repoLabel?: string;
  adminLabel?: string;
}

export function formatScopeLabel(options: FormatScopeLabelOptions): string {
  const { scope, intl, repoLabel, adminLabel } = options;
  if (scope === "repo")
    return repoLabel ?? intl.formatMessage(displayScopeMessages.repo);
  if (scope === "admin")
    return adminLabel ?? intl.formatMessage(displayScopeMessages.admin);
  const msg = displayScopeMessages[scope];
  return msg ? intl.formatMessage(msg) : getScopeLabel(intl, scope);
}

export interface GetRepoLabelOptions {
  skillPath: string;
  roots: string[];
  fallbackLabel: string;
}

export function getRepoLabel(options: GetRepoLabelOptions): string {
  const { skillPath, roots, fallbackLabel } = options;
  const matchingRoot = roots.reduce<string | null>((best, root) => {
    if (skillPath.startsWith(root) && (!best || root.length > best.length)) {
      return root;
    }
    return best;
  }, null);
  if (!matchingRoot) return fallbackLabel;
  const basename = getBasename(matchingRoot);
  return basename.length > 0 ? basename : fallbackLabel;
}

export interface FormatSkillScopeOptions {
  skill: { scope: SkillScope; path: string };
  roots: string[];
  intl: {
    formatMessage: (
      msg: typeof displayScopeMessages.system,
      values?: Record<string, unknown>,
    ) => string;
  };
  fallbackRepoLabel?: string;
  adminLabel?: string;
}

export function formatSkillScope(options: FormatSkillScopeOptions): string {
  const { skill, roots, intl, fallbackRepoLabel, adminLabel } = options;
  return formatScopeLabel({
    scope: skill.scope,
    intl,
    repoLabel: getRepoLabel({
      skillPath: skill.path,
      roots,
      fallbackLabel:
        fallbackRepoLabel ?? formatScopeLabel({ scope: "repo", intl }),
    }),
    adminLabel,
  });
}
