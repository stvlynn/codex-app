// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
import { RetryQueue } from "./retry-queue";
import {
  clearStorageKeys,
  loadQueueItems,
  loadSeenMap,
  saveQueueItems,
  saveSeenMap,
  withStorageLock,
} from "./storage";
export class PersistedRetryQueue extends RetryQueue {
  public readonly key: string;
  constructor(maxAttempts: number, key: string) {
    super(maxAttempts, [], {});
    this.key = key;
    const storageKey = key;
    withStorageLock(storageKey, () => {
      try {
        this.queue = [...loadQueueItems(storageKey), ...this.queue];
        this.seen = {
          ...loadSeenMap(storageKey),
          ...this.seen,
        };
        clearStorageKeys(storageKey);
      } catch (error) {
        console.error(error);
      }
    });
    if (typeof window !== "undefined") {
      window.addEventListener(`pagehide`, () => {
        if (this.todo <= 0) return;
        const itemsToPersist = [...this.queue, ...this.future];
        try {
          withStorageLock(storageKey, () => {
            saveQueueItems(storageKey, itemsToPersist);
            saveSeenMap(storageKey, this.seen);
          });
        } catch (error) {
          console.error(error);
        }
      });
    }
  }
}
