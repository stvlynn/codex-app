// Restored from ref/webview/assets/get-default-branch-name-3z9A9Y_n.js
// GetDefaultBranchName chunk restored from the Codex webview bundle.

const MAX_BRANCH_NAME_WORDS = 5;

export interface BranchNameOptions {
  branchPrefix?: string;
  conversationTitle?: string;
}

/**
 * Generates a default branch name from a conversation title and optional prefix.
 * Sanitizes the title to kebab-case, limiting to a maximum number of words.
 */
export function getDefaultBranchName(options: BranchNameOptions): string {
  const prefix = options.branchPrefix?.trim() ?? "";
  const sanitizedTitle = sanitizeConversationTitle(options.conversationTitle);
  return sanitizedTitle.length === 0 ? prefix : `${prefix}${sanitizedTitle}`;
}

function sanitizeConversationTitle(title: string | undefined): string {
  if (!title) {
    return "";
  }
  return title
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .slice(0, MAX_BRANCH_NAME_WORDS)
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter((word) => word.length > 0)
    .join("-");
}
