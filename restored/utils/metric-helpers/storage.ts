// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
import { middlewareA as PluginEvent } from "../../boundaries/segment-analytics/middleware";
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
function createNoopStorage(): StorageAdapter {
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}
export const safeStorage: StorageAdapter = (() => {
  try {
    if (typeof window !== "undefined" && window.localStorage != null) {
      return window.localStorage;
    }
  } catch (error) {
    console.warn(`Unable to access localStorage`, error);
  }
  return createNoopStorage();
})();
export function loadQueueItems(key: string): PluginEvent[] {
  const raw = safeStorage.getItem(itemsKey(key));
  if (!raw) return [];
  return (
    JSON.parse(raw) as Array<{
      event: unknown;
      id: string;
    }>
  ).map((item) => new PluginEvent(item.event, item.id));
}
export function saveQueueItems(key: string, items: PluginEvent[]): void {
  const existing = loadQueueItems(key);
  const merged = [...items, ...existing].reduce<Record<string, PluginEvent>>(
    (accumulator, current) => {
      accumulator[current.id] = current;
      return accumulator;
    },
    {},
  );
  safeStorage.setItem(itemsKey(key), JSON.stringify(Object.values(merged)));
}
export function loadSeenMap(key: string): Record<string, number> {
  const raw = safeStorage.getItem(seenKey(key));
  return raw ? (JSON.parse(raw) as Record<string, number>) : {};
}
export function saveSeenMap(key: string, seen: Record<string, number>): void {
  safeStorage.setItem(
    seenKey(key),
    JSON.stringify({
      ...loadSeenMap(key),
      ...seen,
    }),
  );
}
export function clearStorageKeys(key: string): void {
  safeStorage.removeItem(itemsKey(key));
  safeStorage.removeItem(seenKey(key));
}
export function itemsKey(key: string): string {
  return `persisted-queue:v1:${key}:items`;
}
export function seenKey(key: string): string {
  return `persisted-queue:v1:${key}:seen`;
}
const LOCK_TTL_MS = 50;
const LOCK_RETRY_LIMIT = 3;
const LOCK_RETRY_DELAY_MS = 50;
export function withStorageLock(
  key: string,
  operation: () => void,
  attempt: number = 0,
): void {
  const lockKey = `persisted-queue:v1:${key}:lock`;
  const isExpired = (timestamp: number) => Date.now() > timestamp;
  const rawLock = safeStorage.getItem(lockKey);
  const lockTimestamp = rawLock ? (JSON.parse(rawLock) as number) : null;
  if (lockTimestamp === null || isExpired(lockTimestamp)) {
    safeStorage.setItem(lockKey, JSON.stringify(Date.now() + LOCK_TTL_MS));
    operation();
    safeStorage.removeItem(lockKey);
    return;
  }
  if (attempt < LOCK_RETRY_LIMIT) {
    setTimeout(() => {
      withStorageLock(key, operation, attempt + 1);
    }, LOCK_RETRY_DELAY_MS);
    return;
  }
  console.error(`Unable to retrieve lock`);
}
