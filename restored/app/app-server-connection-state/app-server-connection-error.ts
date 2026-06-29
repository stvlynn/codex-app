// Restored from ref/webview/assets/app-server-connection-state-DiMba98f.js

import type { IntlShape } from "react-intl";
import { appServerConnectionMessages } from "./messages";
import type {
  AppServerConnectionAction,
  AppServerConnectionError,
  AppServerConnectionStatus,
  AppServerConnectionStatusInfo,
  AppServerConnectionSurface,
} from "./types";
export function formatAppServerConnectionErrorMessage(
  intl: IntlShape,
  error: AppServerConnectionError,
): string {
  switch (error.code) {
    case "remote-codex-not-found":
      return intl.formatMessage({
        id: "appServer.error.remoteCodexNotFound",
        defaultMessage: "Codex is not installed on this remote machine",
        description:
          "Error shown when an SSH remote connection is reachable but the Codex CLI is missing",
      });
    case "login-required":
      return intl.formatMessage({
        id: "appServer.error.loginRequired",
        defaultMessage: "You are currently logged out.",
        description:
          "Error shown when a remote app-server connection requires the user to authenticate",
      });
    case "restart-required":
      return error.currentVersion == null || error.installedVersion == null
        ? intl.formatMessage({
            id: "appServer.error.genericRestartRequired",
            defaultMessage:
              "Something went wrong connecting to Codex. Try restarting",
            description:
              "Generic error shown when an app-server connection requires restarting but exact version details are unavailable",
          })
        : intl.formatMessage(
            {
              id: "appServer.error.restartAvailable",
              defaultMessage:
                "Restart now to update to {installedVersion}. Currently running {currentVersion}",
              description:
                "Error shown when a remote Codex update has been installed and the remote app-server needs a restart",
            },
            {
              currentVersion: error.currentVersion,
              installedVersion: error.installedVersion,
            },
          );
    case "update-required":
      return intl.formatMessage(
        {
          id: "appServer.error.unsupportedVersion",
          defaultMessage:
            "Codex on this environment is out of date. Update to {minVersion} or newer. Current version: {currentVersion}",
          description:
            "Error shown when an app-server connection is rejected because the remote Codex version is too old",
        },
        {
          minVersion: error.minRequiredVersion,
          currentVersion: error.currentVersion,
        },
      );
    case "connection-failed":
      return error.message ?? "";
  }
}
const stateLabelMessages = {
  connecting: appServerConnectionMessages.connecting,
  restarting: appServerConnectionMessages.restarting,
  connected: appServerConnectionMessages.connected,
  disconnected: appServerConnectionMessages.disconnected,
  error: appServerConnectionMessages.error,
};
function getStatusLabelMessage(
  state: AppServerConnectionStatus,
  error: AppServerConnectionError | null | undefined,
) {
  if (state === "error" && error != null) {
    switch (error.code) {
      case "login-required":
        return appServerConnectionMessages["login-required"];
      case "remote-codex-not-found":
        return appServerConnectionMessages["remote-codex-not-found"];
      case "update-required":
        return appServerConnectionMessages["update-required"];
      case "restart-required":
        return appServerConnectionMessages["restart-required"];
      case "connection-failed":
        return appServerConnectionMessages.error;
    }
  }
  return stateLabelMessages[state];
}
export function getAppServerConnectionStatusInfo(
  intl: IntlShape,
  {
    canLogin,
    error,
    state,
    surface,
  }: {
    canLogin: boolean;
    error: AppServerConnectionError | null | undefined;
    state: AppServerConnectionStatus;
    surface: AppServerConnectionSurface;
  },
): AppServerConnectionStatusInfo {
  const label = intl.formatMessage(getStatusLabelMessage(state, error));
  if (state !== "error" || error == null) {
    return {
      action: null,
      label,
      message: label,
    };
  }
  const message = formatAppServerConnectionErrorMessage(intl, error);
  switch (error.code) {
    case "login-required":
      if (canLogin) {
        return {
          action: {
            kind: "login",
            label: intl.formatMessage(appServerConnectionMessages.login),
          },
          label,
          message,
        };
      }
      if (surface === "connection-status-badge") {
        const settingsLabel = intl.formatMessage(
          appServerConnectionMessages.goToSettings,
        );
        return {
          action: {
            kind: "settings",
            label: settingsLabel,
          },
          label,
          message: `${message} ${settingsLabel}`,
        };
      }
      return {
        action: null,
        label,
        message,
      };
    case "remote-codex-not-found":
      return {
        action: {
          kind: "install-codex",
          label: intl.formatMessage(appServerConnectionMessages.installCodex),
          loadingLabel: intl.formatMessage(
            appServerConnectionMessages.installingCodex,
          ),
        },
        label,
        message,
      };
    case "restart-required":
      return {
        action: {
          kind: "restart",
          label: intl.formatMessage(appServerConnectionMessages.restartNow),
          tooltipText: intl.formatMessage(
            appServerConnectionMessages.restartNowTooltip,
          ),
        },
        label,
        message,
      };
    case "update-required":
      if (surface === "connections-row") {
        return {
          action: {
            kind: "install-codex",
            label: intl.formatMessage(appServerConnectionMessages.updateCodex),
            loadingLabel: intl.formatMessage(
              appServerConnectionMessages.updatingCodex,
            ),
            tooltipText: intl.formatMessage(
              appServerConnectionMessages.restartNowTooltip,
            ),
          },
          label,
          message,
        };
      }
      return {
        action: {
          kind: "settings",
          label: intl.formatMessage(appServerConnectionMessages.goToSettings),
        },
        label,
        message,
      };
    case "connection-failed":
      return {
        action: null,
        label,
        message,
      };
  }
}
