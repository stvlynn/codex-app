// Restored from ref/webview/assets/hooks-settings-navigation-BjQMYS8c.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/hooks-settings-navigation-BjQMYS8c.js
 *   Chunk: hooks-settings-navigation-BjQMYS8c
 *   Classification: single-util
 *   Domain: utils
 *   Semantic path: utils/hooks-settings-navigation.ts
 */

export interface NavigateSettingsOptions {
  hostId: string;
  navigate: (path: string) => void;
  section: string;
  setSelectedHostId: (hostId: string) => void;
}

/**
 * Navigates to a settings section and updates the selected host ID.
 */
export function navigateToSettingsSection({
  hostId,
  navigate,
  section,
  setSelectedHostId,
}: NavigateSettingsOptions): void {
  setSelectedHostId(hostId);
  navigate(`/settings/${section}`);
}
