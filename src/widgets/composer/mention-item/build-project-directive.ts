// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { m as parseDirective } from "../../boundaries/mermaid/parse-directives";
import { buildSitesProjectUrl } from "./build-sites-thread-url";
export function buildProjectDirective({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}): string {
  return parseDirective(title, buildSitesProjectUrl(projectId));
}
