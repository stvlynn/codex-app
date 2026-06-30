// Restored from ref/webview/assets/app-shell-state-QDRlZ5bT.js
// App shell state — sidebar state actions.

import {
  sidebarOpen$,
  sidebarFocused$,
  sidebarHoverDisabled$,
  sidebarAnimating$,
  sidebarSpring$,
  bottomPanelLauncherVisible$,
} from "./atoms";
export interface SidebarOptions {
  animate?: boolean;
  suppressHoverOpen?: boolean;
}
export function setSidebarOpen(
  scope: {
    get: <T>(key: unknown) => T;
    set: <T>(key: unknown, value: T) => void;
  },
  open: boolean,
  options: SidebarOptions = {},
): void {
  const spring = scope.get(sidebarSpring$) as {
    get: () => number;
    stop: () => void;
    set: (v: number) => void;
  };
  const targetValue = open ? 1 : 0;
  const suppressHover = !open && options.suppressHoverOpen !== false;
  if (scope.get(sidebarOpen$) === open && spring.get() === targetValue) {
    scope.set(sidebarFocused$, false);
    scope.set(sidebarHoverDisabled$, suppressHover);
    scope.set(sidebarAnimating$, false);
    return;
  }
  scope.set(sidebarFocused$, false);
  scope.set(sidebarHoverDisabled$, suppressHover);
  scope.set(sidebarAnimating$, options.animate !== false);
  scope.set(sidebarOpen$, open);
  spring.stop();
  spring.set(targetValue);
}
export function setBottomPanelLauncherVisible(
  scope: {
    set: <T>(key: unknown, value: T) => void;
  },
  visible: boolean,
): void {
  scope.set(bottomPanelLauncherVisible$, visible);
}
export function resetBottomPanelLauncher(): void {
  const stored = localStorage.getItem(
    "app-shell-bottom-panel-launcher-visible",
  );
  if (stored === null) {
    localStorage.setItem("app-shell-bottom-panel-launcher-visible", "false");
  }
}
