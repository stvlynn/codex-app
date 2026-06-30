// Restored from ref/webview/assets/is-compact-window-context-CVCwwVNh.js

const AVATAR_OVERLAY_PATH = `/avatar-overlay`;

const COMPACT_WINDOW_PATHS = [
  `/global-dictation`,
  `/global-dictation/*`,
  `/hotkey-window`,
  `/hotkey-window/*`,
];

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

function isAvatarOverlayRoute({
  pathname,
  initialRoute,
}: WindowLocation): boolean {
  return (
    pathname === AVATAR_OVERLAY_PATH ||
    initialRoute?.split("?")[0] === AVATAR_OVERLAY_PATH
  );
}

function isAvatarOverlayCurrent(): boolean {
  return isAvatarOverlayRoute(getWindowLocation());
}

function matchPattern(pattern: string, path: string): boolean {
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -1);
    return path === prefix.slice(0, -1) || path.startsWith(prefix);
  }
  return path === pattern;
}

function isCompactWindowPath(path: string): boolean {
  if (!path) return false;
  return COMPACT_WINDOW_PATHS.some((pattern) => matchPattern(pattern, path));
}

function isCompactWindowRoute({
  pathname,
  initialRoute,
}: WindowLocation): boolean {
  if (!pathname) return false;
  return (
    isCompactWindowPath(pathname) || isCompactWindowPath(initialRoute ?? "")
  );
}

function isCompactWindowCurrent(): boolean {
  return isCompactWindowRoute(getWindowLocation());
}

function isCompactOrAvatarOverlay({
  pathname,
  initialRoute,
}: WindowLocation): boolean {
  return (
    isAvatarOverlayRoute({ pathname, initialRoute }) ||
    isCompactWindowRoute({ pathname, initialRoute })
  );
}

function isCompactOrAvatarOverlayCurrent(): boolean {
  return isCompactOrAvatarOverlay(getWindowLocation());
}

export {
  isCompactWindowCurrent as default,
  isCompactWindowPath,
  isCompactWindowRoute,
  isAvatarOverlayCurrent,
  isCompactOrAvatarOverlayCurrent,
};
