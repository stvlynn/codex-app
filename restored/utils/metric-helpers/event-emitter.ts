// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
export type EventHandler = (...args: unknown[]) => void;
export class EventEmitter {
  private callbacks: Record<string, EventHandler[]> = {};
  private warned = false;
  constructor(private maxListeners = 10) {}
  on(event: string, handler: EventHandler): this {
    if (this.callbacks[event]) {
      this.callbacks[event].push(handler);
      this.warnIfPossibleMemoryLeak(event);
    } else {
      this.callbacks[event] = [handler];
    }
    return this;
  }
  once(event: string, handler: EventHandler): this {
    const wrapped: EventHandler = (...args) => {
      this.off(event, wrapped);
      handler.apply(this, args);
    };
    return this.on(event, wrapped);
  }
  off(event: string, handler: EventHandler): this {
    this.callbacks[event] = (this.callbacks[event] ?? []).filter(
      (item) => item !== handler,
    );
    return this;
  }
  emit(event: string, ...args: unknown[]): this {
    (this.callbacks[event] ?? []).forEach((handler) => {
      handler.apply(this, args);
    });
    return this;
  }
  private warnIfPossibleMemoryLeak(event: string): void {
    if (
      !this.warned &&
      this.maxListeners &&
      this.callbacks[event].length > this.maxListeners
    ) {
      console.warn(
        `Event Emitter: Possible memory leak detected; ${String(event)} has exceeded ${this.maxListeners} listeners.`,
      );
      this.warned = true;
    }
  }
}
