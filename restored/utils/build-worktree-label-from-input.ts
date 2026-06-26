// Restored from ref/webview/assets/build-worktree-label-from-input-CHMnzmbR.js
// Derives a short worktree label from the first text item in a composer input.

import { Vt as sanitizeInputText } from "../boundaries/host-config";

export interface ComposerInputItem {
  type: string;
  text: string;
}

const DEFAULT_WORKTREE_LABEL = "Codex Task";
const MAX_LABEL_LENGTH = 80;

export function buildWorktreeLabelFromInput(
  inputItems: ComposerInputItem[],
): string {
  const textItem = inputItems.find((item) => item.type === "text");
  if (!textItem) return DEFAULT_WORKTREE_LABEL;

  const sanitized = sanitizeInputText(textItem.text).trim();
  if (sanitized.length === 0) return DEFAULT_WORKTREE_LABEL;

  const normalized = sanitized.replace(/\s+/g, " ").trim();
  if (normalized.length === 0) return DEFAULT_WORKTREE_LABEL;
  if (normalized.length <= MAX_LABEL_LENGTH) return normalized;

  return `${normalized.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`;
}
