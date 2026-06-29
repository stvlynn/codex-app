// Restored from ref/webview/assets/use-codex-home-CG1itsCv.js
// Codex home query hook restored from the Codex webview bundle.
import { a as useAppQuery } from "../boundaries/app-scope";
import { r as codexHomeQueryFactory } from "../app/thread-context-inputs";
export interface CodexHome {
  [key: string]: unknown;
}
export interface CodexHomeQueryResult {
  data?: {
    codexHome?: CodexHome;
  };
  isLoading: boolean;
}
export function useCodexHome(hostId?: string): CodexHome | undefined {
  return useCodexHomeQuery(hostId).data?.codexHome;
}
export function useCodexHomeQuery(hostId?: string): CodexHomeQueryResult {
  return useAppQuery(
    codexHomeQueryFactory,
    hostId == null
      ? undefined
      : {
          hostId,
        },
  ) as CodexHomeQueryResult;
}
