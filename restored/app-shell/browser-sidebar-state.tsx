// Restored from ref/webview/assets/browser-sidebar-state-C7hH17Ps.js

import {
  St as isBrowserComment,
  xt as getBrowserTabId,
} from "../boundaries/host-config";
import { f as vscodeApi } from "../boundaries/vscode-api";
export type BrowserSidebarMode = "browse" | "comment";
export const BROWSER_SIDEBAR_MODES: Record<string, BrowserSidebarMode> = {
  BROWSE: "browse",
  COMMENT: "comment",
};
export interface BrowserComment {
  browserTabId?: string | null;
  [key: string]: unknown;
}
export interface ClearBrowserSidebarCommentsOptions {
  browserTabId?: string | null;
  browserConversationId?: string | null;
  fallbackBrowserConversationId?: string | null;
  comments: BrowserComment[];
  onCommentsChange: (comments: BrowserComment[]) => void;
}

/**
 * Clears browser sidebar comments for the current conversation.
 *
 * When comments reference browser tabs, a `browser-sidebar-command` message is
 * dispatched to each affected tab so the extension can clear the comments in
 * the browser view.
 */
export function clearBrowserSidebarComments({
  browserTabId,
  browserConversationId,
  fallbackBrowserConversationId,
  comments,
  onCommentsChange,
}: ClearBrowserSidebarCommentsOptions): boolean {
  const conversationId = browserConversationId ?? fallbackBrowserConversationId;
  if (conversationId == null || !comments.some(isBrowserComment)) {
    return false;
  }
  onCommentsChange([]);
  const browserComments = comments.filter(isBrowserComment);
  const tabIds = Array.from(
    new Set(
      browserComments
        .map(getBrowserTabId)
        .filter((id): id is string => id != null),
    ),
  );
  const hasCommentWithoutTabId = browserComments.some(
    (comment) => getBrowserTabId(comment) == null,
  );
  if (
    browserTabId != null &&
    hasCommentWithoutTabId &&
    !tabIds.includes(browserTabId)
  ) {
    tabIds.push(browserTabId);
  }
  if (tabIds.length === 0) {
    vscodeApi.dispatchMessage("browser-sidebar-command", {
      ...(browserTabId == null
        ? {}
        : {
            browserTabId,
          }),
      conversationId,
      command: {
        type: "clear-comments",
      },
    });
    return true;
  }
  for (const targetTabId of tabIds) {
    vscodeApi.dispatchMessage("browser-sidebar-command", {
      browserTabId: targetTabId,
      conversationId,
      command: {
        type: "clear-comments",
      },
    });
  }
  return true;
}
