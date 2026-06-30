// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { buildPluginUrl } from "./build-subagent-plugin-url";
function getPluginIconSmall(plugin: {
  composerIconPath?: string;
  logoPath?: string;
}): string {
  return plugin.composerIconPath ?? plugin.logoPath ?? "";
}
export function buildPluginMention(
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
): {
  name: string;
  displayName: string;
  path: string;
  description: string;
  iconSmall: string;
  brandColor?: string;
} {
  const pluginName = plugin.plugin.name;
  let displayName = plugin.displayName ?? pluginName;
  let name = pluginName;
  if (pluginName === "browser") {
    displayName = labels.browserUse;
    name = displayName;
  } else if (pluginName === "computer-use") {
    displayName = labels.computerUse;
    name = displayName;
  }
  return {
    name,
    displayName,
    path: buildPluginUrl(plugin.plugin.id),
    description: plugin.description ?? "",
    iconSmall: getPluginIconSmall(plugin),
    brandColor: plugin.plugin.interface?.brandColor,
  };
}
