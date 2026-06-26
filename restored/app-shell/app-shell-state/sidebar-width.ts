// Restored from ref/webview/assets/app-shell-state-QDRlZ5bT.js
// App shell state — sidebar width constants and helpers.

const MAX_SIDEBAR_WIDTH = 520;
const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_SIDEBAR_WIDTH = 300;
const MIN_SIDEBAR_WIDTH = 240;
export function clampSidebarWidth(width: number): number {
  return Number.isFinite(width)
    ? Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH)
    : DEFAULT_SIDEBAR_WIDTH;
}
export function getSidebarWidth(): number {
  const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
  const parsed = stored ? parseInt(stored, 10) : DEFAULT_SIDEBAR_WIDTH;
  return clampSidebarWidth(parsed);
}
export function setSidebarWidth(width: number): void {
  localStorage.setItem(SIDEBAR_WIDTH_KEY, String(clampSidebarWidth(width)));
}
