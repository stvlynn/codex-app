// Restored from ref/webview/assets/mention-icons-B52KM14d.js
// mention-icons-B52KM14d chunk restored from the Codex webview bundle.
import type { ComponentProps, ReactNode } from "react";
import { getFileIcon } from "../../shared/utils/get-file-icon";
import { SkillsIcon } from "../../shared/icons/skills-icon.tsx";
export function getMentionFileIcon({
  path,
  matchType,
}: {
  path: string;
  matchType: string;
}): (props: ComponentProps<"svg">) => ReactNode {
  return matchType === "directory" ? getFileIcon("folder/") : getFileIcon(path);
}
export function getMentionSkillsIcon(): typeof SkillsIcon {
  return SkillsIcon;
}
