// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { BaseMention } from "./types";
import { buildSkillMention } from "./build-skill-mention";
export function createSkillMention(skill: {
  name: string;
  path: string;
  description?: string;
}): BaseMention {
  return {
    kind: "skill",
    ...buildSkillMention(skill),
  };
}
