// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { slugifyName } from "./slugify-name";
import { buildSitesProjectUrl } from "./build-sites-thread-url";
export function createSitesProjectMention({
  projectId,
  displayName,
}: {
  projectId: string;
  displayName: string;
}): BaseMention {
  return {
    kind: "sites-project",
    name: slugifyName(displayName),
    displayName,
    path: buildSitesProjectUrl(projectId),
    description: "",
    iconSmall: "",
  };
}
