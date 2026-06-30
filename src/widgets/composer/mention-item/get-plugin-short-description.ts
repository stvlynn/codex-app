// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export function getPluginShortDescription(plugin: {
  interface?: {
    shortDescription?: string;
  };
  short_description?: string;
  shortDescription?: string;
  description?: string;
}): string {
  return (
    plugin.interface?.shortDescription?.trim() ||
    plugin.short_description ||
    plugin.shortDescription ||
    plugin.description ||
    ""
  );
}
