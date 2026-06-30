// Restored from ref/webview/assets/git-config-value-query-BKgFljZW.js
// Git config value query factory restored from the Codex webview bundle.
import { gitQuerySignal } from "./git-query-signal";
export interface GitConfigValueQueryParams {
  key: string;
  operationSource: string;
  root: string;
  scope?: string;
}
export interface GitConfigValueQueryOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}
export interface GitConfigValueResult {
  value: unknown;
}
const gitConfigValueQuery = gitQuerySignal({
  method: "config-value",
  getParams: (params: GitConfigValueQueryParams) => ({
    key: params.key,
    operationSource: params.operationSource,
    root: params.root,
    scope: params.scope,
  }),
  getOptions: (options: GitConfigValueQueryOptions) => ({
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    select: (result: GitConfigValueResult) => result.value,
    ...(options.staleTime == null
      ? {}
      : {
          staleTime: options.staleTime,
        }),
  }),
});
export const fromCwd = gitConfigValueQuery.fromCwd$;
export const queryByMetadata = gitConfigValueQuery.queryByMetadata$;
