// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
export function createChatgptConversationMention({
  conversationId,
  displayName,
}: {
  conversationId: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "chatgpt-conversation",
    name: slugifyName(displayName),
    displayName,
    path: `chatgpt-conversation://${conversationId}`,
    description: "",
    iconSmall: "",
  };
}
