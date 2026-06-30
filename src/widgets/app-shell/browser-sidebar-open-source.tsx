// Restored from ref/webview/assets/browser-sidebar-open-source-b3Nf5F2n.js
// Browser sidebar open-source state manager: tracks per-window browser tab sources, initiators, URLs, leases, and adoption state.

interface BrowserTabInfo {
  browserTabId: string;
}

interface OpenSourceState {
  source: string | null;
  initiator: string | null;
  initialUrl: string | null;
  adoptionLease: string | null;
  adoptedWebContentsId: string | null;
}

const sources = new Map<string, string>();
const initiators = new Map<string, string>();
const initialUrls = new Map<string, string>();
const adoptionLeases = new Map<string, string>();
const adoptedWebContentsIds = new Map<string, string>();
const browserTabsByWindow = new Map<string, BrowserTabInfo[]>();
const activeBrowserTabIds = new Map<string, Set<string>>();
const pendingAdoptions = new Map<string, Set<string>>();

function makeKey(windowId: string, tabId: string): string {
  return `${windowId}\0${tabId}`;
}

function clearMapEntry(
  map: Map<string, string>,
  windowId: string,
  tabId: string | null,
): void {
  if (tabId != null) {
    map.delete(makeKey(windowId, tabId));
    return;
  }
  const prefix = `${windowId}\0`;
  for (const key of map.keys()) {
    if (key.startsWith(prefix)) {
      map.delete(key);
    }
  }
}

function clearInitiator(windowId: string, tabId: string | null): void {
  clearMapEntry(initiators, windowId, tabId);
}

function clearSource(windowId: string, tabId: string | null): void {
  clearMapEntry(sources, windowId, tabId);
}

export function takeSource(windowId: string, tabId: string): string | null {
  const key = makeKey(windowId, tabId);
  const value = sources.get(key);
  if (value == null) return null;
  sources.delete(key);
  return value;
}

export function getSource(windowId: string, tabId: string): string | null {
  return sources.get(makeKey(windowId, tabId)) ?? null;
}

export function takeInitiator(windowId: string, tabId: string): string | null {
  const key = makeKey(windowId, tabId);
  const value = initiators.get(key);
  if (value == null) return null;
  initiators.delete(key);
  return value;
}

export function getInitiator(windowId: string, tabId: string): string | null {
  return initiators.get(makeKey(windowId, tabId)) ?? null;
}

function setSource(windowId: string, tabId: string, source: string): void {
  sources.set(makeKey(windowId, tabId), source);
}

function setInitiator(
  windowId: string,
  tabId: string,
  initiator: string,
): void {
  initiators.set(makeKey(windowId, tabId), initiator);
}

export function getInitialUrl(windowId: string, tabId: string): string | null {
  return initialUrls.get(makeKey(windowId, tabId)) ?? null;
}

function clearInitialUrl(windowId: string, tabId: string): void {
  clearMapEntry(initialUrls, windowId, tabId);
}

function setInitialUrl(windowId: string, tabId: string, url: string): void {
  initialUrls.set(makeKey(windowId, tabId), url);
}

export function getAdoptionLease(
  windowId: string,
  tabId: string,
): string | null {
  return adoptionLeases.get(makeKey(windowId, tabId)) ?? null;
}

export function getAdoptedWebContentsId(
  windowId: string,
  tabId: string,
): string | null {
  return adoptedWebContentsIds.get(makeKey(windowId, tabId)) ?? null;
}

function clearAdoptionLease(windowId: string, tabId: string): void {
  clearMapEntry(adoptionLeases, windowId, tabId);
}

function clearAdoptedWebContentsId(windowId: string, tabId: string): void {
  clearMapEntry(adoptedWebContentsIds, windowId, tabId);
}

function setAdoptionLease(
  windowId: string,
  tabId: string,
  lease: string,
): void {
  adoptionLeases.set(makeKey(windowId, tabId), lease);
}

function setAdoptedWebContentsId(
  windowId: string,
  tabId: string,
  id: string,
): void {
  adoptedWebContentsIds.set(makeKey(windowId, tabId), id);
}

export function setOpenSourceState(
  windowId: string,
  tabId: string,
  {
    adoptionLease,
    adoptedWebContentsId,
    initialUrl,
    initiator,
    source,
  }: Partial<OpenSourceState>,
): void {
  if (source != null) {
    setSource(windowId, tabId, source);
  }
  if (initiator != null) {
    setInitiator(windowId, tabId, initiator);
  }
  if (initialUrl == null) {
    clearInitialUrl(windowId, tabId);
  } else {
    setInitialUrl(windowId, tabId, initialUrl);
  }
  if (adoptionLease != null && adoptedWebContentsId != null) {
    setAdoptionLease(windowId, tabId, adoptionLease);
    setAdoptedWebContentsId(windowId, tabId, adoptedWebContentsId);
    return;
  }
  clearAdoptionLease(windowId, tabId);
  clearAdoptedWebContentsId(windowId, tabId);
}

export function takeBrowserTabs(windowId: string): BrowserTabInfo[] {
  const tabs = browserTabsByWindow.get(windowId) ?? [];
  browserTabsByWindow.delete(windowId);
  return tabs;
}

function clearBrowserTabs(windowId: string): void {
  browserTabsByWindow.delete(windowId);
}

export function getBrowserTabIds(windowId: string): string[] {
  return (
    browserTabsByWindow.get(windowId)?.map((tab) => tab.browserTabId) ?? []
  );
}

export function takeActiveBrowserTabIds(windowId: string): string[] {
  const ids = activeBrowserTabIds.get(windowId) ?? new Set();
  activeBrowserTabIds.delete(windowId);
  return [...ids];
}

export function addActiveBrowserTab(
  windowId: string,
  tab: BrowserTabInfo,
): void {
  clearInitiator(windowId, tab.browserTabId);
  clearSource(windowId, tab.browserTabId);
  clearInitialUrl(windowId, tab.browserTabId);
  const existing = activeBrowserTabIds.get(windowId);
  if (existing == null) {
    activeBrowserTabIds.set(windowId, new Set([tab.browserTabId]));
    return;
  }
  existing.add(tab.browserTabId);
}

export function removeActiveBrowserTab(
  windowId: string,
  tabId: string | null,
): void {
  clearInitiator(windowId, tabId);
  clearSource(windowId, tabId);
  clearInitialUrl(windowId, tabId);
  if (tabId == null) {
    clearBrowserTabs(windowId);
    activeBrowserTabIds.delete(windowId);
    return;
  }
  activeBrowserTabIds.get(windowId)?.delete(tabId);
  removeBrowserTab(windowId, tabId);
}

function removeBrowserTab(windowId: string, tabId: string): void {
  const tabs = browserTabsByWindow.get(windowId);
  if (tabs == null) return;
  const filtered = tabs.filter((tab) => tab.browserTabId !== tabId);
  if (filtered.length === 0) {
    browserTabsByWindow.delete(windowId);
    return;
  }
  browserTabsByWindow.set(windowId, filtered);
}

export function upsertBrowserTab(windowId: string, tab: BrowserTabInfo): void {
  activeBrowserTabIds.get(windowId)?.delete(tab.browserTabId);
  const tabs = browserTabsByWindow.get(windowId);
  if (tabs == null) {
    browserTabsByWindow.set(windowId, [tab]);
    return;
  }
  const index = tabs.findIndex((t) => t.browserTabId === tab.browserTabId);
  if (index === -1) {
    tabs.push(tab);
    return;
  }
  tabs[index] = tab;
}

export function addPendingAdoption(windowId: string, adoptionId: string): void {
  const set = pendingAdoptions.get(windowId);
  if (set == null) {
    pendingAdoptions.set(windowId, new Set([adoptionId]));
    return;
  }
  set.add(adoptionId);
}

export function takePendingAdoptions(windowId: string): string[] {
  const set = pendingAdoptions.get(windowId);
  return set == null ? [] : (pendingAdoptions.delete(windowId), [...set]);
}

export {
  clearAdoptionLease as clearAdoptionLeaseExport,
  clearAdoptedWebContentsId as clearAdoptedWebContentsIdExport,
  clearInitialUrl as clearInitialUrlExport,
};
