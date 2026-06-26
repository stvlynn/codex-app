// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
import { buildSubagentUrl } from "./build-subagent-plugin-url";
export function createSubagentMention({
  subagentId,
  displayName,
}: {
  subagentId: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "subagent",
    name: slugifyName(displayName),
    displayName,
    path: buildSubagentUrl(subagentId),
    description: "",
    iconSmall: "",
  };
}
