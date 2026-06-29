// Restored from ref/webview/assets/codex-analytics-attribution-CQbubOx-.js
// CodexAnalyticsAttribution chunk restored from the Codex webview bundle.
import { appScopeC } from "../boundaries/app-scope";
import { St } from "../app/thread-context-inputs";
import { persistedSignalF } from "./persisted-signal";
export const codexAnalyticsAttribution = appScopeC(
  persistedSignalF,
  ({ get, scope }) => {
    if (scope.value.routeKind !== "local-thread") return null;
    let _codexAnalyticsAttribution = get(
      St,
      scope.value.conversationId,
    );
    return _codexAnalyticsAttribution?.turnId == null
      ? null
      : {
          threadId: scope.value.conversationId,
          turnId: _codexAnalyticsAttribution.turnId,
        };
  },
);
