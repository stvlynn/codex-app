// Restored from ref/webview/assets/use-git-recent-branches-Bf3U6kni.js
// use-git-recent-branches-Bf3U6kni chunk restored from the Codex webview bundle.
import { threadContextInputsVn } from "../app/thread-context-inputs";
export interface GitRecentBranchesOptions {
  limit?: number;
  [key: string]: unknown;
}
interface GitRecentBranchesVariables {
  operationSource: string;
  root: string;
  limit: number;
}
interface GitRecentBranchesResult {
  branches: unknown;
}
function selectBranches(result: GitRecentBranchesResult): unknown {
  return result.branches;
}
export function useGitRecentBranches(
  cwd: string | null | undefined,
  hostConfig: unknown,
  operationSource: string,
  options: GitRecentBranchesOptions = {},
): unknown {
  const { limit = 100, ...rest } = options;
  const getVariables = (params: {
    root: string;
  }): GitRecentBranchesVariables => ({
    operationSource,
    root: params.root,
    limit,
  });
  const queryOptions = {
    select: selectBranches,
    ...rest,
  };
  return threadContextInputsVn(
    cwd,
    hostConfig,
    "recent-branches",
    getVariables,
    operationSource,
    queryOptions,
  );
}
