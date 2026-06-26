// Restored from ref/webview/assets/use-is-pull-request-merge-helper-enabled-CrfHuIjo.js
// use-is-pull-request-merge-helper-enabled-CrfHuIjo chunk restored from the Codex webview bundle.
import {
  _ as appScopeUnderscore,
  t as appScopeT,
  u as appScopeU,
} from "../boundaries/tanstack-query";
import { o as useStatsigGate } from "@statsig/js-client";
import { T as persistedSignal } from "./persisted-signal";
export interface PullRequestMergeHelperState {
  ciJobsFixed$: ReturnType<
    typeof import("../boundaries/tanstack-query").signal
  >;
  conversationId$: ReturnType<
    typeof import("../boundaries/tanstack-query").signal
  >;
  mergeConflictsResolved$: ReturnType<
    typeof import("../boundaries/tanstack-query").signal
  >;
  pendingWorktreeId$: ReturnType<
    typeof import("../boundaries/tanstack-query").signal
  >;
}
export interface StartMergeHelperOptions {
  pendingWorktreeId: string | null;
  pullRequestUrl: string;
}
export interface LinkConversationOptions {
  conversationId: string | null;
  pendingWorktreeId: string;
}
export interface ResolveMergeHelperOptions {
  ciJobsFixed: number;
  conversationId: string;
  mergeConflictsResolved: number;
}
const mergeHelperState = appScopeU(
  appScopeT,
  (
    _key: string,
    {
      signal,
    }: {
      signal: <T>(initial: T) => {
        set: (v: T) => void;
      };
    },
  ): PullRequestMergeHelperState => ({
    ciJobsFixed$: signal(0),
    conversationId$: signal(null),
    mergeConflictsResolved$: signal(0),
    pendingWorktreeId$: signal(null),
  }),
);
const pendingWorktreeToPrUrl = appScopeUnderscore(
  appScopeT,
  (_key: string) => null as string | null,
);
const conversationToPullRequestUrl = appScopeUnderscore(
  appScopeT,
  (_key: string) => null as string | null,
);
export const skipPullRequestMergeHelperConfirm = persistedSignal(
  "skip-pull-request-merge-helper-confirm",
  false,
);
export function startPullRequestMergeHelper(
  scope: Scope,
  { pendingWorktreeId, pullRequestUrl }: StartMergeHelperOptions,
): void {
  const state = scope.get(mergeHelperState, pullRequestUrl);
  state.pendingWorktreeId$.set(pendingWorktreeId);
  state.conversationId$.set(null);
  state.ciJobsFixed$.set(0);
  state.mergeConflictsResolved$.set(0);
  scope.set(pendingWorktreeToPrUrl, pendingWorktreeId, pullRequestUrl);
}
export function linkConversationToMergeHelper(
  scope: Scope,
  { conversationId, pendingWorktreeId }: LinkConversationOptions,
): void {
  const pullRequestUrl = scope.get(pendingWorktreeToPrUrl, pendingWorktreeId);
  if (pullRequestUrl == null) {
    return;
  }
  scope
    .get(mergeHelperState, pullRequestUrl)
    .conversationId$.set(conversationId);
  scope.set(conversationToPullRequestUrl, conversationId, pullRequestUrl);
}
export function unlinkConversationFromMergeHelper(
  scope: Scope,
  pendingWorktreeId: string,
): void {
  const pullRequestUrl = scope.get(pendingWorktreeToPrUrl, pendingWorktreeId);
  if (pullRequestUrl == null) {
    return;
  }
  scope.get(mergeHelperState, pullRequestUrl).pendingWorktreeId$.set(null);
}
export function resolveMergeHelperProgress(
  scope: Scope,
  {
    ciJobsFixed,
    conversationId,
    mergeConflictsResolved,
  }: ResolveMergeHelperOptions,
): void {
  const pullRequestUrl = scope.get(
    conversationToPullRequestUrl,
    conversationId,
  );
  if (pullRequestUrl == null) {
    return;
  }
  const state = scope.get(mergeHelperState, pullRequestUrl);
  if (ciJobsFixed > 0) {
    state.ciJobsFixed$.set((prev) => prev + ciJobsFixed);
  }
  if (mergeConflictsResolved > 0) {
    state.mergeConflictsResolved$.set((prev) => prev + mergeConflictsResolved);
  }
}
export function useIsPullRequestMergeHelperEnabled(): boolean {
  return useStatsigGate("896050304");
}
interface Scope {
  get: <T>(atom: unknown, key: string) => T;
  set: <T>(atom: unknown, key: string, value: T) => void;
}
export { mergeHelperState, conversationToPullRequestUrl };
