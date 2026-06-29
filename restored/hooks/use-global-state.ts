// Restored from ref/webview/assets/use-global-state-C0LjG8WG.js
// Global persistent state hook restored from the Codex webview bundle.
import { a as useAppQuery } from "../boundaries/app-scope";
import { ea as globalStateQueryFactory } from "../app/thread-context-inputs";
export interface GlobalStateResult<T = unknown> {
  data?: T;
  isLoading: boolean;
}
export function useGlobalState<T = unknown>(key: string): GlobalStateResult<T> {
  return useAppQuery(globalStateQueryFactory, key) as GlobalStateResult<T>;
}
