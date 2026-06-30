// Restored from ref/webview/assets/app-server-connection-state-DiMba98f.js

import { defineMessages } from "react-intl";
export const appServerConnectionMessages = defineMessages({
  connecting: {
    id: "threadPage.remoteConnectionStatusBadge.connecting",
    defaultMessage: "Connecting",
    description: "Label shown when remote connection is in progress",
  },
  restarting: {
    id: "threadPage.remoteConnectionStatusBadge.restarting",
    defaultMessage: "Restarting",
    description:
      "Label shown when a remote connection is restarting after a user action",
  },
  "login-required": {
    id: "threadPage.remoteConnectionStatusBadge.unauthed",
    defaultMessage: "Login required",
    description: "Label shown when remote connection needs authentication",
  },
  "remote-codex-not-found": {
    id: "threadPage.remoteConnectionStatusBadge.remoteCodexNotFound",
    defaultMessage: "Codex not installed",
    description:
      "Label shown when the Codex CLI is missing from an SSH remote connection",
  },
  "update-required": {
    id: "threadPage.remoteConnectionStatusBadge.updateRequired",
    defaultMessage: "Update required",
    description:
      "Label shown when remote connection needs a newer Codex version",
  },
  "restart-required": {
    id: "threadPage.remoteConnectionStatusBadge.restartRequired",
    defaultMessage: "Restart required",
    description:
      "Label shown when remote connection needs a restart to use a newer Codex version",
  },
  restartNow: {
    id: "threadPage.remoteConnectionStatusBadge.restartNow",
    defaultMessage: "Restart now",
    description:
      "Action label shown when remote Codex has a newer installed version and can be restarted",
  },
  restartNowTooltip: {
    id: "threadPage.remoteConnectionStatusBadge.restartNowTooltip",
    defaultMessage:
      "Restarting will kill the currently running Codex process and stop any ongoing chats on this remote host",
    description: "Tooltip warning for a remote Codex restart action",
  },
  login: {
    id: "threadPage.remoteConnectionStatusBadge.login",
    defaultMessage: "Log in to Codex",
    description: "Action label shown when a remote connection needs login",
  },
  installCodex: {
    id: "threadPage.remoteConnectionStatusBadge.installCodex",
    defaultMessage: "Install Codex",
    description:
      "Action label shown when the Codex CLI is missing from an SSH remote connection",
  },
  installingCodex: {
    id: "threadPage.remoteConnectionStatusBadge.installingCodex",
    defaultMessage: "Installing…",
    description:
      "Action label shown while Codex is being installed on an SSH remote connection",
  },
  updateCodex: {
    id: "threadPage.remoteConnectionStatusBadge.updateCodex",
    defaultMessage: "Update Codex",
    description:
      "Action label shown when an SSH remote connection needs a newer Codex version",
  },
  updatingCodex: {
    id: "threadPage.remoteConnectionStatusBadge.updatingCodex",
    defaultMessage: "Updating…",
    description:
      "Action label shown while Codex is being updated on an SSH remote connection",
  },
  goToSettings: {
    id: "threadPage.remoteConnectionStatusBadge.goToSettings",
    defaultMessage: "See Settings to connect",
    description: "Label shown for a remote connection settings action",
  },
  connected: {
    id: "threadPage.remoteConnectionStatusBadge.connected",
    defaultMessage: "Connected",
    description: "Label shown when remote connection is established",
  },
  disconnected: {
    id: "threadPage.remoteConnectionStatusBadge.disconnected",
    defaultMessage: "Disconnected",
    description: "Label shown when remote connection is unavailable",
  },
  error: {
    id: "threadPage.remoteConnectionStatusBadge.error",
    defaultMessage: "Error",
    description: "Label shown when remote connection is in error",
  },
});
