// Restored from ref/webview/assets/use-git-current-branch-Nkmrrr5P.js
// Git current branch query hook restored from the Codex webview bundle.
import { a as useAppQuery } from "../boundaries/app-scope";
import { Un as buildGitContext } from "../../app/thread-context-inputs";
import { n as gitCurrentBranchQuery } from "../utils/git-current-branch-query";
export interface GitCurrentBranchInput {
  cwd: string | null;
  hostConfig?: unknown;
  operationSource?: string;
  [key: string]: unknown;
}
export function useGitCurrentBranch(
  cwd?: string | null,
  hostConfig?: unknown,
  operationSource?: string,
  contextParams?: unknown,
): unknown {
  const resolvedCwd = cwd ?? null;
  const gitContext = buildGitContext(contextParams, null);
  return useAppQuery(gitCurrentBranchQuery, {
    cwd: resolvedCwd,
    hostConfig,
    operationSource,
    ...gitContext,
  } as GitCurrentBranchInput);
}
