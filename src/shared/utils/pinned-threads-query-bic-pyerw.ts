// Restored from ref/webview/assets/pinned-threads-query-BicPYERW.js
// pinned-threads-query-BicPYERW chunk restored from the Codex webview bundle.
import { T } from "../boundaries/tanstack-query";
import { a, u } from "../boundaries/vscode-api";

export const pinnedThreadsQuery = a(T, "list-pinned-threads", {
  refetchOnWindowFocus: "always",
  staleTime: u.FIVE_SECONDS,
});
