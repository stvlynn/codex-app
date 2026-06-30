// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function slugifyName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "app";
}
