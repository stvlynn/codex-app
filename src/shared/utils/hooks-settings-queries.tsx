// Restored from ref/webview/assets/hooks-settings-queries-5zPGjvwa.js
// Hooks settings query and mutation options restored from the Codex webview bundle.
import { appScopeD, appScopeP, appScopeT } from "../boundaries/app-scope";
import { useHostConfigBt } from "../boundaries/host-config";
import { threadContextInputsKa } from "../../app/thread-context-inputs";
import { vscodeApiF, vscodeApiU } from "../boundaries/tanstack-query/vscode";

const HOOKS_QUERY_KEY_PREFIX = ["hooks"];

interface HookEdit {
  key: string;
  enabled?: boolean;
  trustedHash?: string | null;
}

interface HookEntry {
  key: string;
  enabled?: boolean;
  trustStatus?: string;
  currentHash?: string;
  [key: string]: unknown;
}

interface HookGroup {
  hooks: HookEntry[];
  [key: string]: unknown;
}

interface HooksListResponse {
  data: HookGroup[];
  [key: string]: unknown;
}

export const hooksSettingsQueriesR = appScopeP(
  appScopeT,
  ({ hostId, cwds }: { hostId: string; cwds: string[] | null | undefined }) => ({
    queryKey: [...HOOKS_QUERY_KEY_PREFIX, hostId, cwds],
    queryFn: () => {
      if (cwds == null || cwds.length === 0) {
        throw new Error("Cannot list hooks without project roots");
      }
      return useHostConfigBt("list-hooks-for-host", {
        hostId,
        cwds,
      });
    },
    staleTime: vscodeApiU.FIVE_MINUTES,
    enabled: cwds != null && cwds.length > 0,
  }),
);

export const hooksSettingsQueriesN = appScopeP(
  appScopeT,
  ({ hostId, cwd }: { hostId: string; cwd: string | null | undefined }) => ({
    queryKey: [...HOOKS_QUERY_KEY_PREFIX, hostId, cwd],
    queryFn: () => {
      if (cwd == null) throw new Error("Cannot list hooks without a project root");
      return useHostConfigBt("list-hooks-for-host", {
        hostId,
        cwds: [cwd],
      });
    },
    staleTime: vscodeApiU.FIVE_MINUTES,
    refetchOnWindowFocus: "always",
    enabled: cwd != null,
  }),
);

async function invalidateHooksQueries(
  queryClient: {
    invalidateQueries: (options: {
      predicate: (query: { queryKey: unknown[] }) => boolean;
      refetchType?: string;
    }) => Promise<unknown>;
  },
  hostId: string,
  options: { broadcast?: boolean; refetchType?: string } = {},
): Promise<void> {
  const { broadcast = false, refetchType } = options;
  await queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] === HOOKS_QUERY_KEY_PREFIX[0] && queryKey[1] === hostId,
    refetchType,
  });
  if (broadcast) {
    vscodeApiF.dispatchMessage("query-cache-invalidate", {
      queryKey: HOOKS_QUERY_KEY_PREFIX,
    });
  }
}

export const hooksSettingsQueriesA = appScopeD(
  appScopeT,
  (hostId: string) => ({
    mutationFn: (edits: HookEdit[]) =>
      useHostConfigBt("batch-write-config-value", {
        hostId,
        edits: [
          {
            keyPath: "hooks.state",
            value: Object.fromEntries(
              edits.map(({ key, enabled, trustedHash }) => [
                key,
                {
                  ...(enabled == null ? {} : { enabled }),
                  ...(trustedHash == null ? {} : { trusted_hash: trustedHash }),
                },
              ]),
            ),
            mergeStrategy: "upsert",
          },
        ],
        filePath: null,
        expectedVersion: null,
        reloadUserConfig: true,
      }),
    onMutate: async (
      edits: HookEdit[],
      { client }: { client: {
        cancelQueries: (options: {
          predicate: (query: { queryKey: unknown[] }) => boolean;
        }) => Promise<unknown>;
        getQueriesData: (options: {
          predicate: (query: { queryKey: unknown[] }) => boolean;
        }) => [unknown, HooksListResponse | undefined][];
        setQueriesData: (
          options: {
            predicate: (query: { queryKey: unknown[] }) => boolean;
          },
          updater: (data: HooksListResponse | undefined) => HooksListResponse | undefined,
        ) => unknown;
      } },
    ) => {
      await client.cancelQueries({
        predicate: ({ queryKey }) => matchesHooksQuery(queryKey, hostId),
      });
      const previousResponses = client.getQueriesData({
        predicate: ({ queryKey }) => matchesHooksQuery(queryKey, hostId),
      });
      client.setQueriesData(
        {
          predicate: ({ queryKey }) => matchesHooksQuery(queryKey, hostId),
        },
        (data) => applyOptimisticHookEdits(data, edits),
      );
      return { previousResponses };
    },
    onError: (
      _error: unknown,
      _variables: unknown,
      context: { previousResponses?: [unknown, HooksListResponse | undefined][] } | undefined,
      { client }: { client: {
        setQueryData: (key: unknown, data: HooksListResponse | undefined) => void;
      } },
    ) => {
      context?.previousResponses?.forEach(([queryKey, data]) => {
        client.setQueryData(queryKey, data);
      });
    },
    onSettled: async (
      _data: unknown,
      _error: unknown,
      _variables: unknown,
      _context: unknown,
      { client }: { client: {
        invalidateQueries: (options: {
          predicate: (query: { queryKey: unknown[] }) => boolean;
        }) => Promise<unknown>;
      } },
    ) => {
      await invalidateHooksQueries(client, hostId, { broadcast: true });
    },
  }),
);

function matchesHooksQuery(
  queryKey: unknown[],
  hostId: string,
): boolean {
  return queryKey[0] === HOOKS_QUERY_KEY_PREFIX[0] && queryKey[1] === hostId;
}

function applyOptimisticHookEdits(
  data: HooksListResponse | undefined,
  edits: HookEdit[],
): HooksListResponse | undefined {
  if (data == null) return data;
  const editsByKey = new Map(edits.map((item) => [item.key, item]));
  return threadContextInputsKa(
    data,
    (draft: { data: HookGroup[] }) => {
      for (const group of draft.data) {
        for (const hook of group.hooks) {
          const edit = editsByKey.get(hook.key);
          if (edit == null) continue;
          if (edit.enabled != null) {
            hook.enabled = edit.enabled;
          }
          if (
            edit.trustedHash != null &&
            edit.trustedHash === hook.currentHash
          ) {
            hook.trustStatus = "trusted";
          }
        }
      }
    },
  ) as HooksListResponse;
}

export { invalidateHooksQueries as hooksSettingsQueriesI, HOOKS_QUERY_KEY_PREFIX as hooksSettingsQueriesT };
