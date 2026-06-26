// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import { getSkillPromptWithMention } from "../../utils/skill-utils";
import { getPluginShortDescription } from "./get-plugin-short-description";
export function buildSkillMention(skill: {
  name: string;
  path: string;
  description?: string;
}): {
  name: string;
  displayName: string;
  path: string;
  description: string;
  iconSmall: string;
} {
  return {
    name: skill.name,
    displayName: getSkillPromptWithMention(skill),
    path: skill.path,
    description: getPluginShortDescription(skill),
    iconSmall: skill.description ?? "",
  };
}
