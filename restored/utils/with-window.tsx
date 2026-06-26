// Restored from ref/webview/assets/with-window-B85Yfj4i.js
// with-window-B85Yfj4i chunk restored from the Codex webview bundle.
import React from "react";
export interface WithWindowProps {
  /** Browser window API (unused, kept for interface compatibility). */
  browser?: unknown;
  /** Chrome extension API (unused, kept for interface compatibility). */
  chromeExtension?: unknown;
  /** Children to render when the condition is met. */
  children: React.ReactNode;
  /** VS Code extension API (unused, kept for interface compatibility). */
  extension?: unknown;
  /** When `true`, children are rendered. */
  electron?: boolean;
}

/**
 * Conditionally renders children only when running in an Electron environment.
 * Returns `null` otherwise.
 */
export function WithWindow({
  electron,
  children,
}: WithWindowProps): React.ReactNode {
  if (!(electron !== undefined && electron)) {
    return null;
  }
  return <>{children}</>;
}
