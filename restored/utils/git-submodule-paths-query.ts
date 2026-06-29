// Restored from ref/webview/assets/git-submodule-paths-query-DIo47mr-.js
// Git submodule paths query factory restored from the Codex webview bundle.
import { l as appScopeL, t as appScopeT } from "../boundaries/app-scope";
import { gitQuerySignal } from "./git-query-signal";
export interface GitSubmodulePathsParams {
  operationSource: string;
  root: string;
}
export interface GitSubmodulePathsOptions {
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}
export interface GitSubmodulePathsResult {
  paths: string[];
}
const submodulePathsQuery = gitQuerySignal({
  method: "submodule-paths",
  getParams: (params: GitSubmodulePathsParams) => ({
    operationSource: params.operationSource,
    root: params.root,
  }),
  getOptions: (options: GitSubmodulePathsOptions) => ({
    refetchOnWindowFocus: options.refetchOnWindowFocus,
    select: (result: GitSubmodulePathsResult) => result.paths,
    staleTime: options.staleTime,
  }),
}).fromCwd$;
export const submodulePathsAtom = appScopeL(
  appScopeT,
  (
    params: GitSubmodulePathsParams,
    {
      get,
    }: {
      get: <T>(
        atom: unknown,
        params: GitSubmodulePathsParams,
      ) => {
        data?: T;
      };
    },
  ) => get(submodulePathsQuery, params).data ?? null,
);
export { submodulePathsQuery };
