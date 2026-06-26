// Restored from ref/webview/assets/app-shell-state-QDRlZ5bT.js
// App shell state — reactive atom stubs for the app shell layout.
// NOTE: These are boundary facades; the original uses internal reactive primitives.

const DEFAULT_SIDEBAR_WIDTH = 300;
const createAtom = (value: unknown) => value;
export const sidebarOpen$ = createAtom(true);
export const sidebarFocused$ = createAtom(false);
export const sidebarHoverDisabled$ = createAtom(false);
export const sidebarAnimating$ = createAtom(false);
export const sidebarTransitionTick$ = createAtom(0);
export const sidebarSpring$ = createAtom({
  get: () => 1,
  stop: () => {},
  set: (v: number) => {},
});
export const bottomPanelLauncherVisible$ = createAtom(true);
export const bottomPanelOpen$ = createAtom(false);
export const bottomPanelSpring$ = createAtom({
  get: () => 0,
  stop: () => {},
  set: (v: number) => {},
});
export const bottomPanelMaximized$ = createAtom(false);
export const bottomPanelMaximizedSpring$ = createAtom({
  get: () => 0,
  stop: () => {},
  set: (v: number) => {},
});
export const bottomPanelWasMaximized$ = createAtom(false);
export const bottomPanelFullWidthOnNextOpen$ = createAtom(false);
export const bottomPanelOverlayVisible$ = createAtom(false);
export const sidebarWidth$ = createAtom(DEFAULT_SIDEBAR_WIDTH);
export const sidebarPinned$ = createAtom(false);
export const sidebarWidthSpring$ = createAtom(true);
