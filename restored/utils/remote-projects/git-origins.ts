// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js
import {
  p as createQueryAtom,
  t as appStoreAtom,
} from "../../boundaries/app-scope";
import {
  n as callVscodeApi,
  r as buildVscodeQueryKey,
  u as vscodeQueryConfig,
} from "../../boundaries/tanstack-query/vscode";
import * as codexRuntime from "../../boundaries/src";
import type { GitOriginsParams, GitOriginsResult } from "./types";
const gitOriginsParamsSchema = codexRuntime.Ta({
  dirs: codexRuntime.pa(codexRuntime.Aa()).optional(),
  hostId: codexRuntime.Aa().optional(),
});
export const gitOriginsQueryAtom = createQueryAtom(
  appStoreAtom,
  (
    {
      params,
      source,
    }: {
      params: GitOriginsParams;
      source: string;
    },
    { queryClient },
  ) => ({
    enabled: params.dirs == null || params.dirs.length > 0,
    meta: {
      gitOrigins: {
        dirs: params.dirs,
        hostId: params.hostId,
      },
    },
    placeholderData: () => findCachedGitOriginsData(queryClient, params),
    queryFn: () =>
      callVscodeApi("git-origins", {
        params,
        source,
      }) as Promise<GitOriginsResult>,
    queryKey: buildVscodeQueryKey("git-origins", params),
    staleTime: vscodeQueryConfig.FIVE_SECONDS,
  }),
);
export function findCachedGitOriginsData(
  queryClient: {
    getQueryCache: () => {
      findAll: (filter: { queryKey: unknown[] }) => Array<{
        meta?: {
          gitOrigins?: GitOriginsParams;
        };
        queryKey: unknown[];
      }>;
    };
    getQueryData: (queryKey: unknown[]) => GitOriginsResult | undefined;
  },
  params: GitOriginsParams,
): GitOriginsResult | undefined {
  if (params.dirs == null || params.dirs.length === 0) {
    return undefined;
  }
  for (const cachedQuery of queryClient.getQueryCache().findAll({
    queryKey: buildVscodeQueryKey("git-origins"),
  })) {
    const parsed = gitOriginsParamsSchema.safeParse(
      cachedQuery.meta?.gitOrigins,
    );
    if (
      !parsed.success ||
      parsed.data.hostId !== params.hostId ||
      parsed.data.dirs == null
    ) {
      continue;
    }
    const cachedDirs = new Set(parsed.data.dirs);
    if (!params.dirs.every((dir) => cachedDirs.has(dir))) {
      continue;
    }
    const cachedData = queryClient.getQueryData(cachedQuery.queryKey);
    if (cachedData != null) {
      return cachedData;
    }
  }
  return undefined;
}
