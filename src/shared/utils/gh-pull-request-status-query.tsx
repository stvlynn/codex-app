// Restored from ref/webview/assets/gh-pull-request-status-query-CCiuBiO5.js
// gh-pull-request-status-query-CCiuBiO5 chunk restored from the Codex webview bundle.
import { G, L, P, T } from "../boundaries/tanstack-query";
import { i, n, r, u } from "../boundaries/vscode-api";
import { N as normalizePath } from "../boundaries/src-l0hb-m-z-p";

const ghCliStatusQuery = i(T, "gh-cli-status", (hostId: string) => ({
  gcTime: u.INFINITE,
  params: {
    hostId,
  },
  staleTime: (options: {
    state: { data?: { isInstalled: boolean; isAuthenticated: boolean } };
  }) =>
    options.state.data?.isInstalled === true &&
    options.state.data.isAuthenticated === true
      ? u.INFINITE
      : u.FIVE_SECONDS,
}));

const ghCliStatusAtom = L(T, (hostId: string, { get }) => {
  const query = get(ghCliStatusQuery, hostId);
  return query.isError
    ? "error"
    : query.data == null
      ? "loading"
      : query.data.isInstalled
        ? query.data.isAuthenticated
          ? "available"
          : "unauthenticated"
        : "missing";
});

export function invalidateGhCliStatus(
  queryClient: {
    invalidateQueries: (options: { queryKey: unknown }) => Promise<unknown>;
  },
  hostId: string,
) {
  queryClient.invalidateQueries(ghCliStatusQuery, hostId);
}

const ghPrStatusQuery = P(
  T,
  (
    params: {
      cwd: string | null | undefined;
      headBranch: string;
      hostId: string;
      operationSource: string;
    },
    { get },
  ) => ({
    enabled:
      params.cwd != null &&
      params.headBranch.length > 0 &&
      get(ghCliStatusAtom, params.hostId) === "available",
    queryFn: () =>
      n("gh-pr-status", {
        source: params.operationSource,
        params: {
          cwd: normalizePath(params.cwd ?? "/"),
          headBranch: params.headBranch,
          hostId: params.hostId,
        },
      }),
    queryKey: r("gh-pr-status", {
      cwd: normalizePath(params.cwd ?? "/"),
      headBranch: params.headBranch,
      hostId: params.hostId,
    }),
    staleTime: getStaleTime(params.operationSource),
    structuralSharing: mergePrStatusData,
  }),
);

export const hasOpenPullRequest = L(
  T,
  (
    params: {
      cwd: string | null | undefined;
      headBranch: string;
      hostId: string;
      operationSource: string;
    },
    { get },
  ) => {
    const query = get(ghPrStatusQuery, params);
    return query.data?.status === "success" && query.data.hasOpenPr;
  },
);

export const ghPullRequestStatus = L(
  T,
  (
    params: {
      cwd: string | null | undefined;
      headBranch: string;
      hostId: string;
      operationSource: string;
    },
    { get },
  ) => {
    const query = get(ghPrStatusQuery, params);
    return query.isError
      ? { type: "error" as const }
      : query.isLoading || query.data == null
        ? { type: "loading" as const }
        : query.data.status === "not-found"
          ? { type: "not-found" as const }
          : {
              type: "success" as const,
              data: query.data,
            };
  },
);

export const pullRequestUrl = L(
  T,
  (
    params: {
      cwd: string | null | undefined;
      headBranch: string;
      hostId: string;
      operationSource: string;
    },
    { get },
  ) => {
    const query = get(ghPrStatusQuery, params);
    return query.data?.status === "success" ? query.data.url : null;
  },
);

function mergePrStatusData(oldData: unknown, newData: unknown): unknown {
  if (
    isSuccessPrStatus(oldData) &&
    oldData.mergeBlocker === "conflicts" &&
    isSuccessPrStatus(newData) &&
    oldData.url != null &&
    oldData.url === newData.url &&
    newData.mergeBlocker === "unknown"
  ) {
    return G(oldData, {
      ...newData,
      mergeBlocker: "conflicts",
    });
  }
  return G(oldData, newData);
}

function isSuccessPrStatus(
  data: unknown,
): data is { status: "success"; mergeBlocker: string; url: string } {
  return (
    typeof data === "object" &&
    !!data &&
    "status" in data &&
    (data as { status: string }).status === "success" &&
    "mergeBlocker" in data &&
    "url" in data
  );
}

function getStaleTime(operationSource: string): number {
  return operationSource === "sidebar_task_pr_chip"
    ? u.ONE_MINUTE
    : operationSource === "local_conversation_git_summary"
      ? u.FIFTEEN_SECONDS
      : u.FIVE_SECONDS;
}

export { ghCliStatusAtom, ghPrStatusQuery };
