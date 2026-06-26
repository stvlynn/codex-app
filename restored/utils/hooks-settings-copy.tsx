// Restored from ref/webview/assets/hooks-settings-copy-Bu2W8gbZ.js

import { defineMessages, type IntlShape } from "react-intl";

export type HookEvent =
  | "preToolUse"
  | "permissionRequest"
  | "postToolUse"
  | "preCompact"
  | "postCompact"
  | "sessionStart"
  | "userPromptSubmit"
  | "subagentStart"
  | "subagentStop"
  | "stop";

const hookEventMessages = defineMessages({
  preToolUse: {
    id: "settings.hooks.event.preToolUse",
    defaultMessage: "PreToolUse",
    description: "Label for the pre tool use hook event",
  },
  permissionRequest: {
    id: "settings.hooks.event.permissionRequest",
    defaultMessage: "PermissionRequest",
    description: "Label for the permission request hook event",
  },
  postToolUse: {
    id: "settings.hooks.event.postToolUse",
    defaultMessage: "PostToolUse",
    description: "Label for the post tool use hook event",
  },
  preCompact: {
    id: "settings.hooks.event.preCompact",
    defaultMessage: "PreCompact",
    description: "Label for the pre compact hook event",
  },
  postCompact: {
    id: "settings.hooks.event.postCompact",
    defaultMessage: "PostCompact",
    description: "Label for the post compact hook event",
  },
  sessionStart: {
    id: "settings.hooks.event.sessionStart",
    defaultMessage: "SessionStart",
    description: "Label for the session start hook event",
  },
  userPromptSubmit: {
    id: "settings.hooks.event.userPromptSubmit",
    defaultMessage: "UserPromptSubmit",
    description: "Label for the user prompt submit hook event",
  },
  subagentStart: {
    id: "settings.hooks.event.subagentStart",
    defaultMessage: "SubagentStart",
    description: "Label for the subagent start hook event",
  },
  subagentStop: {
    id: "settings.hooks.event.subagentStop",
    defaultMessage: "SubagentStop",
    description: "Label for the subagent stop hook event",
  },
  stop: {
    id: "settings.hooks.event.stop",
    defaultMessage: "Stop",
    description: "Label for the stop hook event",
  },
});

const hookEventDescriptionMessages = defineMessages({
  preToolUse: {
    id: "settings.hooks.event.preToolUse.description",
    defaultMessage: "Before a tool executes",
    description: "Description for the pre tool use hook event",
  },
  permissionRequest: {
    id: "settings.hooks.event.permissionRequest.description",
    defaultMessage: "When permission is requested",
    description: "Description for the permission request hook event",
  },
  postToolUse: {
    id: "settings.hooks.event.postToolUse.description",
    defaultMessage: "After a tool executes",
    description: "Description for the post tool use hook event",
  },
  preCompact: {
    id: "settings.hooks.event.preCompact.description",
    defaultMessage: "Before Codex compacts the conversation",
    description: "Description for the pre compact hook event",
  },
  postCompact: {
    id: "settings.hooks.event.postCompact.description",
    defaultMessage: "After Codex compacts the conversation",
    description: "Description for the post compact hook event",
  },
  sessionStart: {
    id: "settings.hooks.event.sessionStart.description",
    defaultMessage: "When a new session starts",
    description: "Description for the session start hook event",
  },
  userPromptSubmit: {
    id: "settings.hooks.event.userPromptSubmit.description",
    defaultMessage: "When the user submits a prompt",
    description: "Description for the user prompt submit hook event",
  },
  subagentStart: {
    id: "settings.hooks.event.subagentStart.description",
    defaultMessage: "When a subagent starts",
    description: "Description for the subagent start hook event",
  },
  subagentStop: {
    id: "settings.hooks.event.subagentStop.description",
    defaultMessage: "When a subagent stops",
    description: "Description for the subagent stop hook event",
  },
  stop: {
    id: "settings.hooks.event.stop.description",
    defaultMessage: "Right before Codex ends its turn",
    description: "Description for the stop hook event",
  },
});

const fallbackHookTitle = defineMessages({
  fallbackHookTitle: {
    id: "settings.hooks.event.fallbackHookTitle",
    defaultMessage: "Hook {index}",
    description: "Fallback title for a hook row without a stronger label",
  },
});

export function getHookEventTitle(event: HookEvent, intl: IntlShape): string {
  return intl.formatMessage(hookEventMessages[event]);
}

export function getHookEventDescription(
  event: HookEvent,
  intl: IntlShape,
): string {
  return intl.formatMessage(hookEventDescriptionMessages[event]);
}

export function getFallbackHookTitle(index: number, intl: IntlShape): string {
  return intl.formatMessage(fallbackHookTitle.fallbackHookTitle, {
    index: index + 1,
  });
}

export function getHookSourceLabel(source: string | null): string | null {
  return source == null ? null : source.split("@")[0] || null;
}
