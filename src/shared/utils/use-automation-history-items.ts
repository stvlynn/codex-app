// Restored from ref/webview/assets/use-automation-history-items-B6uja7Kv.js
import {
  s as useAtomValue,
  t as queryClient,
} from "../boundaries/tanstack-query";
import {
  a as useSuspenseQuery,
  f as dispatchMessage,
  r as queryKeyFor,
  u as queryConstants,
} from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface InboxItem {
  id: string;
  readAt: number | null;
  status: "PENDING_REVIEW" | "ACCEPTED" | "ARCHIVED" | string;
}

export interface InboxItemsResponse {
  items: InboxItem[];
  unreadRunCounts: {
    total: number;
    automationIds: string[];
  };
}

export interface AutomationHistoryResult {
  items: InboxItem[];
  isLoading: boolean;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
  unreadRunCounts: InboxItemsResponse["unreadRunCounts"] | undefined;
}

// ------------------------------------------------------------------
// Query configuration
// ------------------------------------------------------------------

const INBOX_ITEMS_LIMIT = 200;

const inboxItemsQuery = useSuspenseQuery(queryClient, "inbox-items", {
  enabled: true,
  params: { limit: INBOX_ITEMS_LIMIT },
  refetchInterval: queryConstants.ONE_MINUTE,
  staleTime: queryConstants.ONE_MINUTE,
});

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export function useAutomationHistoryItems(): AutomationHistoryResult {
  const queryClientInstance = useSuspenseQuery();
  const inboxData = useAtomValue(inboxItemsQuery);

  const markRead = (id: string) => {
    queryClientInstance.setQueryData(
      queryKeyFor("inbox-items", { limit: INBOX_ITEMS_LIMIT }),
      (oldData: InboxItemsResponse | null | undefined) =>
        oldData == null
          ? oldData
          : {
              ...oldData,
              items: oldData.items.map((item) =>
                item.id === id && item.readAt == null
                  ? { ...item, readAt: Date.now() }
                  : item,
              ),
            },
    );
    dispatchMessage("inbox-item-set-read-state", { id, isRead: true });
  };

  const markUnread = (id: string) => {
    queryClientInstance.setQueryData(
      queryKeyFor("inbox-items", { limit: INBOX_ITEMS_LIMIT }),
      (oldData: InboxItemsResponse | null | undefined) =>
        oldData == null
          ? oldData
          : {
              ...oldData,
              items: oldData.items.map((item) =>
                item.id === id && item.readAt != null
                  ? { ...item, readAt: null }
                  : item,
              ),
            },
    );
    dispatchMessage("inbox-item-set-read-state", { id, isRead: false });
  };

  const markAllRead = () => {
    const now = Date.now();
    queryClientInstance.setQueryData(
      queryKeyFor("inbox-items", { limit: INBOX_ITEMS_LIMIT }),
      (oldData: InboxItemsResponse | null | undefined) =>
        oldData == null
          ? oldData
          : {
              ...oldData,
              items: oldData.items.map((item) =>
                item.readAt == null &&
                (item.status === "PENDING_REVIEW" ||
                  item.status === "ACCEPTED" ||
                  item.status === "ARCHIVED")
                  ? { ...item, readAt: now }
                  : item,
              ),
              unreadRunCounts: { total: 0, automationIds: [] },
            },
    );
    dispatchMessage("inbox-automation-runs-mark-all-read", { readAt: now });
  };

  return {
    items: inboxData.data?.items ?? [],
    isLoading: inboxData.isLoading,
    markRead,
    markUnread,
    markAllRead,
    unreadRunCounts: inboxData.data?.unreadRunCounts,
  };
}
