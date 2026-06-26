// Restored from ref/webview/assets/is-hotkey-window-context-BeMnvcLR.js

const HOTKEY_WINDOW_PATHS = [`/hotkey-window`, `/hotkey-window/*`];

interface WindowLocation {
  pathname: string;
  initialRoute: string | null;
}

function getWindowLocation(): WindowLocation {
  if (typeof window === "undefined") {
    return { pathname: "", initialRoute: null };
  }
  const url = new URL(window.location.href);
  return {
    pathname: url.pathname,
    initialRoute: url.searchParams.get("initialRoute"),
  };
}

function matchPattern(pattern: string, path: string): boolean {
  if (!path) return false;
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -1);
    return path === prefix.slice(0, -1) || path.startsWith(prefix);
  }
  return path === pattern;
}

function isHotkeyWindowPath(path: string | null): boolean {
  if (!path) return false;
  return HOTKEY_WINDOW_PATHS.some((pattern) => matchPattern(pattern, path));
}

function isHotkeyWindowRoute({
  pathname,
  initialRoute,
}: WindowLocation): boolean {
  return isHotkeyWindowPath(pathname) || isHotkeyWindowPath(initialRoute);
}

function isHotkeyWindowCurrent(): boolean {
  return isHotkeyWindowRoute(getWindowLocation());
}

export { isHotkeyWindowCurrent as default };
