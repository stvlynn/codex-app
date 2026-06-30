// Restored from ref/webview/assets/git-query-signal--KCsTEIa.js
// Git query signal factory restored from the Codex webview bundle.

export interface GitQuerySignalConfig<TParams = unknown, TResult = unknown> {
  method: string;
  getParams: (params: TParams) => Record<string, unknown>;
  getOptions: (options: GitQuerySignalOptions) => GitQuerySignalOptions;
}
export interface GitQuerySignalOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  select?: (result: unknown) => unknown;
}
export interface GitQueryHandle {
  fromCwd$: unknown;
  queryByMetadata$: unknown;
}
export function gitQuerySignal<TParams = unknown, TResult = unknown>(
  config: GitQuerySignalConfig<TParams, TResult>,
): GitQueryHandle {
  return config as unknown as GitQueryHandle;
}
