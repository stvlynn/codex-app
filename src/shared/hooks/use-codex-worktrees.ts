// Restored from ref/webview/assets/use-codex-worktrees-Zr-sRUtW.js
// Codex worktrees query hook restored from the Codex webview bundle.
import {
  Zn as buildWorktreeContext,
  er as createGitRequester,
} from "../../app/thread-context-inputs";
import {
  u as vscodeApiU,
  v as vscodeApiV,
} from "../boundaries/tanstack-query/vscode";
import { getWorktreeSnapshotRefQueryKey } from "../../widgets/worktrees/worktree-query-keys.tsx";
export interface CodexWorktreesInput {
  hostConfig?: unknown;
  operationSource?: string;
}
export interface WorktreeQueryOptions {
  queryKey: unknown;
  queryFn: (context: { signal?: AbortSignal }) => Promise<unknown>;
  staleTime: number;
  gcTime: number;
}
export function useCodexWorktrees(
  hostConfig?: unknown,
  operationSource?: string,
): unknown {
  const worktreeContext = buildWorktreeContext(hostConfig);
  const queryClient = vscodeApiV;
  const queryKey = getWorktreeSnapshotRefQueryKey(worktreeContext);
  const gitRequester = createGitRequester("git");
  const queryOptions: WorktreeQueryOptions = {
    queryKey,
    queryFn: ({ signal }: { signal?: AbortSignal }) =>
      gitRequester.request({
        method: "codex-worktrees",
        params: {
          hostConfig,
          operationSource,
        },
        signal,
      }),
    staleTime: vscodeApiU.INFINITE,
    gcTime: 18e5,
  };
  return queryClient(queryOptions);
}
