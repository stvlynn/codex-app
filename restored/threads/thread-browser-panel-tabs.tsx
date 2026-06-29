// Restored from ref/webview/assets/thread-browser-panel-tabs-xnatAPyu.js

import { persistedSignalL } from "../utils/persisted-signal";
import {
  threadPanelStateIState,
  threadPanelStateTState,
} from "./thread-panel-state";
export type ThreadPanelTarget = string;
export type BrowserPanelHostKind = "bottom-panel" | "right-panel";
export type BrowserPanelSide = "bottom" | "right";
export interface BrowserPanelTabRef {
  browserTabId: string;
  controller: unknown;
  tab: unknown;
  target: ThreadPanelTarget;
}
export interface SignalStore {
  get(signal: unknown): unknown;
}
export interface BrowserPanelState {
  bottom: unknown;
  right: unknown;
}
export interface BrowserPanelRequestedState {
  bottom: boolean;
  right: boolean;
}
export function getBrowserPanelTabs(
  store: SignalStore,
  conversationId: string,
): BrowserPanelTabRef[] {
  return threadPanelStateTState.flatMap((target) => {
    const controller = threadPanelStateIState(target);
    return store.get(controller.tabs$).flatMap((tab) => {
      const browserTabId = persistedSignalL(tab, conversationId);
      return browserTabId == null
        ? []
        : [
            {
              browserTabId,
              controller,
              tab,
              target,
            },
          ];
    });
  });
}
export function findBrowserPanelTab(
  store: SignalStore,
  conversationId: string,
  browserTabId: string,
  target?: ThreadPanelTarget | null,
): BrowserPanelTabRef | null {
  const tabs = getBrowserPanelTabs(store, conversationId);
  if (target != null) {
    const exact = tabs.find(
      (tab) => tab.browserTabId === browserTabId && tab.target === target,
    );
    if (exact != null) return exact;
  }
  return tabs.find((tab) => tab.browserTabId === browserTabId) ?? null;
}
export function getBrowserTabControllerSignalKey(
  store: SignalStore,
  hostKind: BrowserPanelHostKind,
  state: BrowserPanelState,
  requested?: BrowserPanelRequestedState | null,
): BrowserPanelSide | null {
  const side =
    requested != null
      ? resolvePreferredPanelFromRequested(store, hostKind, state, requested)
      : resolvePreferredPanelFromState(store, hostKind, state);
  return side;
}
export function resolvePreferredPanelFromState(
  store: SignalStore,
  hostKind: BrowserPanelHostKind,
  state: BrowserPanelState,
): BrowserPanelSide | null {
  const resolved = {
    bottom: persistedSignalL(state.bottom, store) as string | null | undefined,
    right: persistedSignalL(state.right, store) as string | null | undefined,
  };
  if (hostKind === "bottom-panel" && resolved.bottom != null) return "bottom";
  if (
    (hostKind === "right-panel" && resolved.right != null) ||
    resolved.right != null
  )
    return "right";
  return resolved.bottom == null ? null : "bottom";
}
export function resolvePreferredPanelFromRequested(
  store: SignalStore,
  hostKind: BrowserPanelHostKind,
  state: BrowserPanelState,
  requested: BrowserPanelRequestedState,
): BrowserPanelSide | null {
  return resolvePreferredPanelFromState(store, hostKind, {
    bottom: requested.bottom ? state.bottom : null,
    right: requested.right ? state.right : null,
  });
}
export function resolveActivePanelFromHostKind(
  hostKind: BrowserPanelHostKind,
  requested: BrowserPanelRequestedState,
): BrowserPanelSide | null {
  if (hostKind === "bottom-panel" && requested.bottom) return "bottom";
  if ((hostKind === "right-panel" && requested.right) || requested.right)
    return "right";
  return requested.bottom ? "bottom" : null;
}
export function getActiveBrowserTabIdsForTargets(
  conversationId: string,
  state: BrowserPanelState,
  targets: Record<ThreadPanelTarget, boolean>,
): string[] {
  const ids: string[] = [];
  for (const target of threadPanelStateTState) {
    if (!targets[target]) continue;
    const id = persistedSignalL(state[target], conversationId) as
      | string
      | null
      | undefined;
    if (id != null) ids.push(id);
  }
  return ids;
}
