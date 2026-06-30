// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
import { EventEmitter } from "./event-emitter";
export const ON_REMOVE_FROM_FUTURE = `onRemoveFromFuture`;
export interface QueueItem {
  id: string;
  [key: string]: unknown;
}
interface BackoffOptions {
  attempt: number;
  minTimeout?: number;
  factor?: number;
  maxTimeout?: number;
}
function computeBackoff(options: BackoffOptions): number {
  const jitter = Math.random() + 1;
  const minTimeout = options.minTimeout ?? 500;
  const factor = options.factor ?? 2;
  const maxTimeout = options.maxTimeout ?? Infinity;
  return Math.min(
    jitter * minTimeout * factor ** Math.max(0, options.attempt),
    maxTimeout,
  );
}
export class RetryQueue extends EventEmitter {
  future: QueueItem[] = [];
  queue: QueueItem[] = [];
  seen: Record<string, number> = {};
  constructor(
    public maxAttempts: number,
    initialQueue: QueueItem[] = [],
    initialSeen: Record<string, number> = {},
  ) {
    super();
    this.queue = initialQueue;
    this.seen = initialSeen;
  }
  push(...items: QueueItem[]): boolean[] {
    const results = items.map((item) => {
      if (this.updateAttempts(item) > this.maxAttempts || this.includes(item)) {
        return false;
      }
      this.queue.push(item);
      return true;
    });
    this.queue = this.queue.sort(
      (a, b) => this.getAttempts(a) - this.getAttempts(b),
    );
    return results;
  }
  pushWithBackoff(item: QueueItem, minDelay = 0): boolean {
    if (minDelay === 0 && this.getAttempts(item) === 0) {
      return this.push(item)[0] ?? false;
    }
    const attempts = this.updateAttempts(item);
    if (attempts > this.maxAttempts || this.includes(item)) {
      return false;
    }
    let delay = computeBackoff({
      attempt: attempts - 1,
    });
    if (minDelay > 0 && delay < minDelay) {
      delay = minDelay;
    }
    setTimeout(() => {
      this.queue.push(item);
      this.future = this.future.filter((future) => future.id !== item.id);
      this.emit(ON_REMOVE_FROM_FUTURE);
    }, delay);
    this.future.push(item);
    return true;
  }
  getAttempts(item: QueueItem): number {
    return this.seen[item.id] ?? 0;
  }
  updateAttempts(item: QueueItem): number {
    this.seen[item.id] = this.getAttempts(item) + 1;
    return this.getAttempts(item);
  }
  includes(item: QueueItem): boolean {
    return (
      this.queue.includes(item) ||
      this.future.includes(item) ||
      !!this.queue.find((queued) => queued.id === item.id) ||
      !!this.future.find((future) => future.id === item.id)
    );
  }
  pop(): QueueItem | undefined {
    return this.queue.shift();
  }
  get length(): number {
    return this.queue.length;
  }
  get todo(): number {
    return this.queue.length + this.future.length;
  }
}
