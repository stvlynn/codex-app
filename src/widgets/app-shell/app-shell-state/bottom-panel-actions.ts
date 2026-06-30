// Restored from ref/webview/assets/app-shell-state-QDRlZ5bT.js
// App shell state — bottom panel state actions.

import {
  bottomPanelOpen$,
  bottomPanelSpring$,
  bottomPanelMaximized$,
  bottomPanelMaximizedSpring$,
  bottomPanelWasMaximized$,
  bottomPanelFullWidthOnNextOpen$,
  bottomPanelOverlayVisible$,
  sidebarWidthSpring$,
} from "./atoms";
export interface BottomPanelOptions {
  restoreFullWidthOnNextOpen?: boolean;
  animate?: boolean;
}
export interface WidthOptions {
  animate?: boolean;
}
export function setBottomPanelOpen(
  scope: {
    get: <T>(key: unknown) => T;
    set: <T>(key: unknown, value: T) => void;
  },
  open: boolean,
): void {
  scope.set(bottomPanelOpen$, open);
  const spring = scope.get(bottomPanelSpring$) as {
    stop: () => void;
    set: (v: number) => void;
  };
  spring.stop();
  spring.set(open ? 1 : 0);
}
export function setBottomPanelMaximized(
  scope: {
    get: <T>(key: unknown) => T;
    set: <T>(key: unknown, value: T) => void;
  },
  maximized: boolean,
  options: BottomPanelOptions = {},
): void {
  scope.set(bottomPanelMaximized$, maximized);
  const spring = scope.get(bottomPanelMaximizedSpring$) as {
    stop: () => void;
    set: (v: number) => void;
  };
  spring.stop();
  spring.set(maximized ? 1 : 0);
  if (maximized) {
    if (scope.get(bottomPanelWasMaximized$)) {
      scope.set(bottomPanelFullWidthOnNextOpen$, true);
      scope.set(bottomPanelWasMaximized$, false);
    }
    return;
  }
  scope.set(bottomPanelOverlayVisible$, false);
  scope.set(
    bottomPanelWasMaximized$,
    options.restoreFullWidthOnNextOpen === true &&
      scope.get(bottomPanelFullWidthOnNextOpen$),
  );
  scope.set(bottomPanelFullWidthOnNextOpen$, false);
}
export function setBottomPanelOverlayVisible(
  scope: {
    get: <T>(key: unknown) => T;
    set: <T>(key: unknown, value: T) => void;
  },
  visible: boolean,
): void {
  if (visible) {
    scope.set(bottomPanelOverlayVisible$, true);
    setBottomPanelMaximized(scope, true);
    return;
  }
  setBottomPanelMaximized(scope, false);
}
export function setBottomPanelFullWidth(
  scope: {
    get: <T>(key: unknown) => T;
    set: <T>(key: unknown, value: T) => void;
  },
  fullWidth: boolean,
  options: WidthOptions = {},
): void {
  scope.set(bottomPanelFullWidthOnNextOpen$, fullWidth);
  const spring = scope.get(sidebarWidthSpring$) as {
    stop: () => void;
    set: (v: number) => void;
  };
  spring.stop();
  spring.set(fullWidth ? 1 : 0);
}
