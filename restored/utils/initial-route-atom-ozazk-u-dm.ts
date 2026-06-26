// Restored from ref/webview/assets/initial-route-atom-ozazkUDm.js
// InitialRouteAtom chunk restored from the Codex webview bundle.

function readInitialRoute(): string | null {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="initial-route"]',
  );
  if (meta?.content?.trim()) return meta.content.trim();
  const fromUrl = new URL(window.location.href).searchParams.get(
    "initialRoute",
  );
  return fromUrl ? fromUrl.trim() : null;
}

export const initialRouteAtom = readInitialRoute();
