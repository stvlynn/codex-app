// Restored from ref/webview/assets/use-environment-Bbzll0Wt.js
// use-environment-Bbzll0Wt chunk restored from the Codex webview bundle.
import React from "react";
import { T as persistedAtom } from "./persisted-atom";
export interface Environment {
  repos?: string[];
  repo_map?: Record<string, RepositoryInfo> | null;
}
export interface RepositoryInfo {
  name?: string;
  url?: string;
  branch?: string;
}
const environmentAtom = persistedAtom<Environment | null>("environment", null);
export function useEnvironment(): Environment | null {
  return React.useContext(
    environmentAtom as unknown as React.Context<Environment | null>,
  );
}
export function getPrimaryRepo(
  environment: Environment | null | undefined,
): string | undefined {
  if (Array.isArray(environment?.repos)) {
    return environment.repos[0];
  }
  return undefined;
}
export function getRepoInfo(
  environment: Environment | null | undefined,
): RepositoryInfo | null {
  if (environment == null) {
    return null;
  }
  const primaryRepo = getPrimaryRepo(environment);
  if (primaryRepo == null) {
    return null;
  }
  return (environment.repo_map ?? {})[primaryRepo] ?? null;
}
