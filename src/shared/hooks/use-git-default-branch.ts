// Restored from ref/webview/assets/use-git-default-branch-mDzZlpy3.js
// use-git-default-branch-mDzZlpy3 chunk restored from the Codex webview bundle.
import { A } from "../boundaries/app-scope";
import { Un } from "../../app/thread-context-inputs";
import { gitQuerySignal } from "../utils/git-query-signal";
export interface UseGitDefaultBranchOptions {
  refetchOnWindowFocus: boolean;
  staleTime?: number;
}
export interface UseGitDefaultBranchParams {
  operationSource: string;
  root: string;
}
export interface GitDefaultBranchResult {
  branch: string;
}
const defaultBranchQuery = gitQuerySignal({
  method: "default-branch",
  getParams: (params: UseGitDefaultBranchParams) => ({
    operationSource: params.operationSource,
    root: params.root,
  }),
  getOptions: (options: UseGitDefaultBranchOptions) => ({
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    select: (result: GitDefaultBranchResult) => result.branch,
    ...(options.staleTime == null
      ? {}
      : {
          staleTime: options.staleTime,
        }),
  }),
}).fromCwd$;
export function useGitDefaultBranch(
  cwd: string | null | undefined,
  hostConfig: unknown,
  operationSource: string,
  scope: unknown,
): unknown {
  const resolvedCwd = cwd ?? null;
  const context = Un(scope, null);
  return A(defaultBranchQuery, {
    cwd: resolvedCwd,
    hostConfig,
    operationSource,
    ...context,
  });
}
export { defaultBranchQuery as gitDefaultBranchQuery };
