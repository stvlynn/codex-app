// Restored from ref/webview/assets/use-git-config-value-Bnyud4Db.js
// Git config value query hook restored from the Codex webview bundle.
import { a as useAppQuery } from "../boundaries/app-scope";
import { Un as buildGitContext } from "../../app/thread-context-inputs";
import { fromCwd as gitConfigValueQuery } from "../utils/git-config-value-query";
export interface GitConfigValueInput {
  cwd: string | null;
  hostConfig?: unknown;
  key: string;
  operationSource?: string;
  scope?: string;
  [key: string]: unknown;
}
export function useGitConfigValue(
  cwd?: string | null,
  hostConfig?: unknown,
  key?: string,
  scope?: string,
  operationSource?: string,
  contextParams?: unknown,
): unknown {
  const resolvedCwd = cwd ?? null;
  const gitContext = buildGitContext(contextParams, null);
  return useAppQuery(gitConfigValueQuery, {
    cwd: resolvedCwd,
    hostConfig,
    key,
    operationSource,
    scope,
    ...gitContext,
  } as GitConfigValueInput);
}
