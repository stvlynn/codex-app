// Restored from ref/webview/assets/use-home-directory-CVo0R7Wz.js
// Home directory query hook restored from the Codex webview bundle.
import { a as useAppQuery } from "../boundaries/app-scope";
import { a as homeDirectoryQueryFactory } from "../app/thread-context-inputs";
export interface HomeDirectoryQueryResult {
  data?: {
    homeDirectory?: string;
  };
  isLoading: boolean;
}
export function useHomeDirectory(hostId?: string): string | undefined {
  return useHomeDirectoryQuery(hostId).data?.homeDirectory;
}
export function useHomeDirectoryQuery(
  hostId?: string,
): HomeDirectoryQueryResult {
  return useAppQuery(
    homeDirectoryQueryFactory,
    hostId == null
      ? undefined
      : {
          hostId,
        },
  ) as HomeDirectoryQueryResult;
}
