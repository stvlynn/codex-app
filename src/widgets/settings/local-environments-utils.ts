// Restored from ref/webview/assets/local-environments-utils-BZSdDG8Z.js

import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";
import { SettingsCogIcon } from "../../shared/icons/settings-cog-icon.tsx";
import { BugIcon } from "../../shared/icons/bug-icon.tsx";
import { PlayOutlineIcon } from "../../shared/icons/play-outline-icon.tsx";
const PLATFORM_IDS = [`darwin`, `linux`, `win32`];
const DEFAULT_SETUP_SCRIPT = `cd "$CODEX_WORKTREE_PATH"
pip install -r requirements.txt
npm install
./run/setup.sh`;
const DEFAULT_RUN_COMMAND = `npm run dev`;
const DEFAULT_CLEANUP_SCRIPT = `docker compose down --remove-orphans
rm -rf .cache/tmp`;
const actionIconMessages = defineMessages({
  tool: {
    id: `settings.localEnvironments.actions.icon.tool`,
    defaultMessage: `Tool`,
    description: `Tool icon label for local environment actions`
  },
  run: {
    id: `settings.localEnvironments.actions.icon.run`,
    defaultMessage: `Run`,
    description: `Run icon label for local environment actions`
  },
  debug: {
    id: `settings.localEnvironments.actions.icon.debug`,
    defaultMessage: `Debug`,
    description: `Debug icon label for local environment actions`
  },
  test: {
    id: `settings.localEnvironments.actions.icon.test`,
    defaultMessage: `Test`,
    description: `Test icon label for local environment actions`
  }
});
const ICON_MAP = {
  tool: SettingsCogIcon,
  run: PlayOutlineIcon,
  debug: BugIcon,
  test: TestIcon
};
function TestIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16.0013 14.4404C16.0012 13.9504 15.8514 13.4739 15.5736 13.0742L15.4467 12.9082L15.0121 12.3877C13.8615 12.8911 12.9154 13.1121 12.0619 13.1562C11.1476 13.2035 10.3805 13.0475 9.66541 12.8857C8.9421 12.7221 8.28162 12.5562 7.47302 12.5146C6.70041 12.475 5.77589 12.5504 4.56873 12.8887L4.5531 12.9082C4.19469 13.3383 3.99852 13.8806 3.99841 14.4404C3.99841 15.7627 5.07071 16.835 6.39294 16.835H13.6078C14.9299 16.8349 16.0013 15.7626 16.0013 14.4404ZM11.8353 3.16504H8.16541V7.72949C8.16541 8.20671 8.01889 8.6713 7.74841 9.06055L7.62439 9.22266L5.93396 11.25C6.52127 11.1756 7.05057 11.1614 7.54041 11.1865C8.48678 11.2351 9.2693 11.432 9.95837 11.5879C10.6557 11.7456 11.272 11.8653 11.9926 11.8281C12.5792 11.7978 13.2617 11.6591 14.1215 11.3184L12.3754 9.22266C12.0262 8.80363 11.8353 8.27494 11.8353 7.72949V3.16504ZM13.1654 7.72949C13.1654 7.96372 13.247 8.19111 13.3969 8.37109L16.4681 12.0566L16.6654 12.3154C17.0976 12.9371 17.3313 13.6782 17.3314 14.4404C17.3314 16.4971 15.6645 18.1649 13.6078 18.165H6.39294C4.33617 18.165 2.66833 16.4972 2.66833 14.4404C2.66844 13.5694 2.97398 12.7258 3.53162 12.0566L6.60291 8.37109L6.65564 8.30176C6.77198 8.13447 6.83533 7.93464 6.83533 7.72949V3.16504H6.66638C6.29926 3.16486 6.00134 2.86716 6.00134 2.5C6.00134 2.13284 6.29926 1.83514 6.66638 1.83496H13.3334L13.4672 1.84863C13.7703 1.91057 13.9984 2.17857 13.9984 2.5C13.9984 2.82143 13.7703 3.08943 13.4672 3.15137L13.3334 3.16504H13.1654V7.72949Z" fill="currentColor" />
    </svg>;
}
export interface LocalEnvironmentAction {
  id: string;
  name: string;
  icon: "tool" | "run" | "debug" | "test";
  command: string;
  platform: string | null;
}
export interface LocalEnvironmentConfig {
  version: string;
  name: string;
  setupScript: string;
  setupPlatformScripts?: Record<string, string>;
  cleanupScript: string;
  cleanupPlatformScripts?: Record<string, string>;
  actions: LocalEnvironmentAction[];
}
export function getActionIconOptions(): {
  value: string;
  message: {
    id: string;
    defaultMessage: string;
    description: string;
  };
}[] {
  return [{
    value: "tool",
    message: actionIconMessages.tool
  }, {
    value: "run",
    message: actionIconMessages.run
  }, {
    value: "debug",
    message: actionIconMessages.debug
  }, {
    value: "test",
    message: actionIconMessages.test
  }];
}
export function getSupportedPlatforms(): string[] {
  return [...PLATFORM_IDS];
}
export function getDefaultSetupScript(): string {
  return DEFAULT_SETUP_SCRIPT;
}
export function getDefaultRunCommand(): string {
  return DEFAULT_RUN_COMMAND;
}
export function getDefaultCleanupScript(): string {
  return DEFAULT_CLEANUP_SCRIPT;
}
export function createEmptyAction(name: string): LocalEnvironmentAction {
  return {
    id: crypto.randomUUID(),
    name,
    icon: "tool",
    command: "",
    platform: null
  };
}
export function sanitizeActions(actions: LocalEnvironmentAction[]): LocalEnvironmentAction[] {
  return actions.map(action => ({
    ...action,
    id: action.id || crypto.randomUUID(),
    platform: action.platform ?? null
  })).filter(action => action.name.trim().length > 0 && action.command.trim().length > 0);
}
export function getPlatformScripts(scripts?: Record<string, string>): {
  platform: string;
  script: string;
}[] {
  if (!scripts) return [];
  return PLATFORM_IDS.map(platform => ({
    platform,
    script: scripts[platform]
  })).filter(({
    script
  }) => script && script.length > 0);
}
export function serializeEnvironmentConfig({
  version,
  name,
  setupScript,
  setupPlatformScripts,
  cleanupScript,
  cleanupPlatformScripts,
  actions
}: LocalEnvironmentConfig): string {
  const lines: string[] = [];
  const sanitizedActions = sanitizeActions(actions);
  const setupPlatforms = getPlatformScripts(setupPlatformScripts);
  const cleanupPlatforms = getPlatformScripts(cleanupPlatformScripts);
  const trimmedCleanup = cleanupScript.trim();
  lines.push("# THIS IS AUTOGENERATED. DO NOT EDIT MANUALLY");
  lines.push(`version = ${version}`);
  lines.push(`name = ${escapeTomlValue(name)}`);
  appendScriptSection(lines, "setup", setupScript, setupPlatforms);
  appendScriptSection(lines, "cleanup", trimmedCleanup, cleanupPlatforms);
  if (sanitizedActions.length > 0) {
    lines.push("");
  }
  for (const action of sanitizedActions) {
    lines.push("[[actions]]");
    lines.push(`name = ${escapeTomlValue(action.name)}`);
    if (action.icon) lines.push(`icon = ${escapeTomlValue(action.icon)}`);
    lines.push(`command = ${escapeTomlValue(action.command)}`);
    if (action.platform) lines.push(`platform = ${escapeTomlValue(action.platform)}`);
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
function appendScriptSection(lines: string[], sectionName: string, script: string, platformScripts: {
  platform: string;
  script: string;
}[]): void {
  if (sectionName === "setup" || script.length > 0 || platformScripts.length > 0) {
    lines.push("");
    lines.push(`[${sectionName}]`);
    lines.push(`script = ${escapeTomlValue(script)}`);
  }
  if (platformScripts.length > 0) {
    lines.push("");
    for (const [index, {
      platform,
      script
    }] of platformScripts.entries()) {
      lines.push(`[${sectionName}.${platform}]`);
      lines.push(`script = ${escapeTomlValue(script)}`);
      if (index < platformScripts.length - 1) {
        lines.push("");
      }
    }
  }
}
function escapeTomlValue(value: string): string {
  const normalized = value.replace(/\r\n/g, "\n");
  if (normalized.includes("\n")) {
    if (normalized.includes("'''")) {
      return `"""\n${normalized.replace(/\\/g, "\\\\").replace(/"""/g, "\\\"\"\"")}\n"""`;
    }
    return `'''\n${normalized}\n'''`;
  }
  return JSON.stringify(normalized);
}
export function extractPlatformScripts(scripts?: Record<string, string>): Record<string, string> {
  return {
    darwin: scripts?.darwin ?? "",
    linux: scripts?.linux ?? "",
    win32: scripts?.win32 ?? ""
  };
}
export async function selectEnvironment({
  codexWorktree,
  configPath,
  gitRoot,
  refreshEnvironments,
  selectForWorkspace,
  selectForWorktree
}: {
  codexWorktree: boolean;
  configPath: string;
  gitRoot: string | null;
  refreshEnvironments: () => Promise<void>;
  selectForWorkspace: (configPath: string) => void;
  selectForWorktree: (gitRoot: string, configPath: string) => boolean;
}): Promise<boolean> {
  await refreshEnvironments();
  if (codexWorktree) {
    return gitRoot != null ? selectForWorktree(gitRoot, configPath) : false;
  }
  selectForWorkspace(configPath);
  return true;
}