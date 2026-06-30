// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { slugifyName } from "./slugify-name";
import { buildAppUrl } from "./build-app-agent-url";
export function buildAppMention(app: {
  name: string;
  id: string;
  description?: string;
  logoUrl?: string;
  logoUrlDark?: string;
}): {
  name: string;
  displayName: string;
  path: string;
  description: string;
  iconSmall: string;
} {
  return {
    name: slugifyName(app.name),
    displayName: app.name,
    path: buildAppUrl(app.id),
    description: app.description ?? "",
    iconSmall: app.logoUrl ?? app.logoUrlDark ?? "",
  };
}
