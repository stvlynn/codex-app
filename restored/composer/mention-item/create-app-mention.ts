// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { buildAppMention } from "./build-app-mention";
export function createAppMention(app: {
  name: string;
  id: string;
  description?: string;
  logoUrl?: string;
  logoUrlDark?: string;
}): BaseMention {
  return {
    kind: "app",
    ...buildAppMention(app),
  };
}
