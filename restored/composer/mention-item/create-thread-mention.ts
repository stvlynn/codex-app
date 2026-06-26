// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
import { buildThreadUrl } from "./build-sites-thread-url";
export function createThreadMention({
  threadId,
  displayName,
}: {
  threadId: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "thread",
    name: slugifyName(displayName),
    displayName,
    path: buildThreadUrl(threadId),
    description: "",
    iconSmall: "",
  };
}
