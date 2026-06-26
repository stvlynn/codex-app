// Restored from ref/webview/assets/browser-DKmdu5pM.js
// Browser chunk restored from the Codex webview bundle.

import { chunkT } from "./esbuild-runtime-helpers";
interface ProcessEnv {
  [key: string]: string | undefined;
}
interface BrowserProcess {
  title: string;
  browser: boolean;
  env: ProcessEnv;
  argv: string[];
  version: string;
  versions: Record<string, string>;
  nextTick: (
    callback: (...args: unknown[]) => void,
    ...args: unknown[]
  ) => void;
  on: () => void;
  addListener: () => void;
  once: () => void;
  off: () => void;
  removeListener: () => void;
  removeAllListeners: () => void;
  emit: () => void;
  prependListener: () => void;
  prependOnceListener: () => void;
  listeners: (event: string) => unknown[];
  binding: (module: string) => never;
  cwd: () => string;
  chdir: (directory: string) => never;
  umask: () => number;
}
interface DeferredTask {
  fun: (...args: unknown[]) => void;
  array: unknown[];
  run: () => void;
}
let cachedSetTimeout: typeof setTimeout | undefined;
let cachedClearTimeout: typeof clearTimeout | undefined;
const taskQueue: DeferredTask[] = [];
let isProcessingQueue = false;
let currentQueue: DeferredTask[] | null = null;
let queueIndex = -1;
function throwSetTimeoutUndefined(): never {
  throw new Error("setTimeout has not been defined");
}
function throwClearTimeoutUndefined(): never {
  throw new Error("clearTimeout has not been defined");
}
function initializeTimers(): void {
  try {
    cachedSetTimeout =
      typeof setTimeout === "function" ? setTimeout : throwSetTimeoutUndefined;
  } catch {
    cachedSetTimeout = throwSetTimeoutUndefined;
  }
  try {
    cachedClearTimeout =
      typeof clearTimeout === "function"
        ? clearTimeout
        : throwClearTimeoutUndefined;
  } catch {
    cachedClearTimeout = throwClearTimeoutUndefined;
  }
}
function safeSetTimeout(
  callback: () => void,
  delay: number,
): ReturnType<typeof setTimeout> {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(callback, delay);
  }
  if (
    (cachedSetTimeout === throwSetTimeoutUndefined || !cachedSetTimeout) &&
    typeof setTimeout === "function"
  ) {
    cachedSetTimeout = setTimeout;
    return setTimeout(callback, delay);
  }
  try {
    return cachedSetTimeout(callback, delay);
  } catch {
    try {
      return cachedSetTimeout.call(null, callback, delay);
    } catch {
      return cachedSetTimeout.call(undefined, callback, delay);
    }
  }
}
function safeClearTimeout(handle: ReturnType<typeof setTimeout>): void {
  if (cachedClearTimeout === clearTimeout) {
    clearTimeout(handle);
    return;
  }
  if (
    (cachedClearTimeout === throwClearTimeoutUndefined ||
      !cachedClearTimeout) &&
    typeof clearTimeout === "function"
  ) {
    cachedClearTimeout = clearTimeout;
    clearTimeout(handle);
    return;
  }
  try {
    cachedClearTimeout(handle);
  } catch {
    try {
      cachedClearTimeout.call(null, handle);
    } catch {
      cachedClearTimeout.call(undefined, handle);
    }
  }
}
function drainQueue(): void {
  if (!isProcessingQueue || !currentQueue) {
    return;
  }
  isProcessingQueue = false;
  if (currentQueue.length) {
    taskQueue.unshift(...currentQueue);
  } else {
    queueIndex = -1;
  }
  if (taskQueue.length) {
    processQueue();
  }
}
function processQueue(): void {
  if (isProcessingQueue) {
    return;
  }
  const timeoutHandle = safeSetTimeout(drainQueue, 0);
  isProcessingQueue = true;
  let remainingTasks = taskQueue.length;
  while (remainingTasks) {
    currentQueue = taskQueue;
    taskQueue.length = 0;
    while (++queueIndex < remainingTasks) {
      if (currentQueue[queueIndex]) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    remainingTasks = taskQueue.length;
  }
  currentQueue = null;
  isProcessingQueue = false;
  safeClearTimeout(timeoutHandle);
}
function createDeferredTask(
  callback: (...args: unknown[]) => void,
  args: unknown[],
): DeferredTask {
  return {
    fun: callback,
    array: args,
    run(): void {
      this.fun.apply(null, this.array);
    },
  };
}
function noop(): void {
  // Intentionally empty
}
function createBrowserProcess(): BrowserProcess {
  return {
    title: "browser",
    browser: true,
    env: {},
    argv: [],
    version: "",
    versions: {},
    nextTick(callback: (...args: unknown[]) => void, ...args: unknown[]): void {
      taskQueue.push(createDeferredTask(callback, args));
      if (taskQueue.length === 1 && !isProcessingQueue) {
        safeSetTimeout(processQueue, 0);
      }
    },
    on: noop,
    addListener: noop,
    once: noop,
    off: noop,
    removeListener: noop,
    removeAllListeners: noop,
    emit: noop,
    prependListener: noop,
    prependOnceListener: noop,
    listeners(): unknown[] {
      return [];
    },
    binding(module: string): never {
      throw new Error("process.binding is not supported");
    },
    cwd(): string {
      return "/";
    },
    chdir(directory: string): never {
      throw new Error("process.chdir is not supported");
    },
    umask(): number {
      return 0;
    },
  };
}
const browserProcessFactory = chunkT(
  (
    _exports: {
      exports: BrowserProcess;
    },
    _module: {
      exports: BrowserProcess;
    },
  ) => {
    initializeTimers();
    _module.exports = createBrowserProcess();
  },
);
export default browserProcessFactory();
