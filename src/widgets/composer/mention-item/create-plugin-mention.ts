// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { PluginMention } from "./types";
import { buildPluginMention } from "./build-plugin-mention";
export function createPluginMention(
  plugin: {
    plugin: {
      name: string;
      id: string;
      interface?: {
        brandColor?: string;
      };
    };
    displayName?: string;
    description?: string;
    composerIconPath?: string;
    logoPath?: string;
  },
  labels: {
    browserUse: string;
    computerUse: string;
  },
): PluginMention {
  return {
    kind: "plugin",
    ...buildPluginMention(plugin, labels),
  };
}
