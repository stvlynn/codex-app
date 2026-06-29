// Restored from ref/webview/assets/app-server-connection-state-DiMba98f.js

export type AppServerConnectionStatus =
  | "connecting"
  | "restarting"
  | "connected"
  | "disconnected"
  | "error";
export type AppServerConnectionErrorCode =
  | "remote-codex-not-found"
  | "login-required"
  | "restart-required"
  | "update-required"
  | "connection-failed";
export interface AppServerConnectionError {
  code: AppServerConnectionErrorCode;
  currentVersion?: string | null;
  installedVersion?: string | null;
  minRequiredVersion?: string | null;
  message?: string;
}
export type AppServerConnectionSurface =
  | "connection-status-badge"
  | "connections-row";
export type AppServerConnectionActionKind =
  | "login"
  | "install-codex"
  | "restart"
  | "settings";
export interface AppServerConnectionAction {
  kind: AppServerConnectionActionKind;
  label: string;
  loadingLabel?: string;
  tooltipText?: string;
}
export interface AppServerConnectionStatusInfo {
  action: AppServerConnectionAction | null;
  label: string;
  message: string;
}
export interface AppServerConnectionStatusBadgeProps {
  hostId: string | undefined;
  onLoginRequiredClick?: () => void;
}
