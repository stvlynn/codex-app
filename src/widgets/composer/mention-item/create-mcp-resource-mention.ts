// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
import { buildMcpResourceUrl } from "./build-mcp-resource-url";
export function createMcpResourceMention({
  resourceUri,
  server,
  displayName,
}: {
  resourceUri: string;
  server: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "mcp-resource",
    name: slugifyName(displayName),
    displayName,
    path: buildMcpResourceUrl({
      resourceUri,
      server,
    }),
    description: "",
    iconSmall: "",
  };
}
