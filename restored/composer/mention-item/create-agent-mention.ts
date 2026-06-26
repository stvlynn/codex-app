// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
import { buildAgentUrl } from "./build-app-agent-url";
export function createAgentMention({
  conversationId,
  displayName,
}: {
  conversationId: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "agent",
    name: slugifyName(displayName),
    displayName,
    path: buildAgentUrl(conversationId),
    description: "",
    iconSmall: "",
  };
}
