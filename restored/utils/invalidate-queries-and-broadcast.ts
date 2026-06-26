// Restored from ref/webview/assets/invalidate-queries-and-broadcast-DTx8Xm8g.js
// invalidate-queries-and-broadcast-DTx8Xm8g chunk restored from the Codex webview bundle.
import { a, f } from "../boundaries/vscode-api";

async function invalidateQueriesAndBroadcast(
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown }) => Promise<unknown>;
  },
  queryKey: unknown,
) {
  await queryClient.invalidateQueries({ queryKey });
  broadcastQueryCacheInvalidation(queryKey);
}

export function useInvalidateQueriesAndBroadcast() {
  const queryClient = a();
  return async (queryKey: unknown) => {
    await invalidateQueriesAndBroadcast(queryClient, queryKey);
  };
}

function broadcastQueryCacheInvalidation(queryKey: unknown) {
  f.dispatchMessage("query-cache-invalidate", {
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey])],
  });
}
