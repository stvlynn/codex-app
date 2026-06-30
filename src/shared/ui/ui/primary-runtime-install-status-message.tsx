// Restored from ref/webview/assets/primary-runtime-install-status-message-9X-UzhFS.js
// Install status message component for primary runtime setup UI.

import { FormattedMessage } from "react-intl";
export interface InstallStatus {
  phase:
    | "checking"
    | "downloading"
    | "verifying"
    | "extracting"
    | "validating"
    | "installed"
    | "configuring"
    | "ready"
    | "error";
  downloadedBytes?: number;
  totalBytes?: number;
}
export function getInstallProgressPercent(
  status: InstallStatus | null,
): number {
  if (status == null) return 0;
  switch (status.phase) {
    case "checking":
      return 0;
    case "downloading":
      return status.downloadedBytes == null || status.totalBytes == null
        ? 0
        : Math.floor(
            Math.min((status.downloadedBytes / status.totalBytes) * 100, 100),
          );
    case "verifying":
    case "extracting":
      return 98;
    case "validating":
    case "installed":
    case "configuring":
    case "ready":
      return 100;
    case "error":
      return 0;
  }
}
export function PrimaryRuntimeInstallStatusMessage(props: {
  status: InstallStatus | null | undefined;
  percent: number;
}): JSX.Element {
  const { status, percent } = props;
  switch (status?.phase) {
    case undefined:
    case "checking":
    case "downloading":
    case "error":
      return (
        <FormattedMessage
          id="localConversation.primaryRuntimeInstallStatus.downloading"
          defaultMessage="Setting up your workspace: {percent}%"
          description="Thread status shown while Codex downloads required local runtime tools before starting a response"
          values={{
            percent,
          }}
        />
      );
    case "extracting":
      return (
        <FormattedMessage
          id="localConversation.primaryRuntimeInstallStatus.extracting"
          defaultMessage="Preparing your workspace"
          description="Thread status shown while Codex extracts required local runtime tools before starting a response"
        />
      );
    case "verifying":
    case "validating":
    case "installed":
    case "configuring":
    case "ready":
      return (
        <FormattedMessage
          id="localConversation.primaryRuntimeInstallStatus.finalizing"
          defaultMessage="Finalizing your workspace"
          description="Thread status shown while Codex finalizes required local runtime tools before starting a response"
        />
      );
  }
}
