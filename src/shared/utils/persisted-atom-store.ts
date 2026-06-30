// Restored from ref/webview/assets/persisted-atom-store-CN8swCI1.js

const PERSISTED_ATOM_KEY_PREFIX = "codex:persisted-atom:";

type AtomValue = unknown;
type StorageCallback = (value: AtomValue) => void;

const values = new Map<string, AtomValue>();
const subscribers = new Map<
  string,
  Set<{ callback: StorageCallback; fallback: AtomValue }>
>();
let broadcast: ((key: string, value: AtomValue) => void) | null = null;

function ensureBroadcast(): (key: string, value: AtomValue) => void {
  if (broadcast == null) {
    throw new Error("Persisted atom store accessed before initialization");
  }
  return broadcast;
}

function notifySubscribers(key: string): void {
  const listeners = subscribers.get(key);
  if (!listeners) return;
  const hasValue = values.has(key);
  const currentValue = hasValue ? values.get(key) : undefined;
  listeners.forEach((listener) => {
    if (hasValue) {
      listener.callback(currentValue);
    } else {
      listener.callback(listener.fallback);
    }
  });
}

function setAtomValue(
  key: string,
  value: AtomValue,
  shouldBroadcast: boolean,
): void {
  ensureBroadcast();
  if (value === undefined) {
    values.delete(key);
  } else {
    values.set(key, value);
  }
  if (shouldBroadcast && broadcast) {
    broadcast(key, value);
  }
  notifySubscribers(key);
}

export function hydratePersistedAtoms(
  initialValues: Record<string, AtomValue>,
  broadcastFn: (key: string, value: AtomValue) => void,
): void {
  const changedKeys = new Set<string>([
    ...values.keys(),
    ...Object.keys(initialValues),
  ]);
  values.clear();
  Object.entries(initialValues).forEach(([key, value]) => {
    if (value !== undefined) {
      values.set(key, value);
    }
  });
  broadcast = broadcastFn;
  changedKeys.forEach((key) => notifySubscribers(key));
}

export interface PersistedAtomStore {
  getItem: <T>(key: string, fallback: T) => T;
  setItem: (key: string, value: AtomValue) => void;
  removeItem: (key: string) => void;
  subscribe: (
    key: string,
    callback: StorageCallback,
    fallback: AtomValue,
  ) => () => void;
}

export function getPersistedAtomStore(): PersistedAtomStore {
  return {
    getItem: <T>(key: string, fallback: T): T => {
      ensureBroadcast();
      return values.has(key) ? (values.get(key) as T) : fallback;
    },
    setItem: (key: string, value: AtomValue) => {
      ensureBroadcast();
      if (value === undefined) {
        setAtomValue(key, undefined, true);
        return;
      }
      setAtomValue(key, value, true);
    },
    removeItem: (key: string) => {
      ensureBroadcast();
      setAtomValue(key, undefined, true);
    },
    subscribe: (
      key: string,
      callback: StorageCallback,
      fallback: AtomValue,
    ) => {
      ensureBroadcast();
      const listener = { callback, fallback };
      const set = subscribers.get(key) ?? new Set();
      set.add(listener);
      subscribers.set(key, set);
      return () => {
        const current = subscribers.get(key);
        if (current) {
          current.delete(listener);
          if (current.size === 0) {
            subscribers.delete(key);
          }
        }
      };
    },
  };
}

export function getPersistedAtomItem<T>(key: string, fallback: T): T {
  return getPersistedAtomStore().getItem(key, fallback);
}

export function setPersistedAtomItem(key: string, value: AtomValue): void {
  getPersistedAtomStore().setItem(key, value);
}

export function subscribeToPersistedAtom(
  key: string,
  fallback: AtomValue,
  callback: StorageCallback,
): () => void {
  const store = getPersistedAtomStore();
  return store.subscribe(key, callback, fallback);
}

export function setPersistedAtomWithoutBroadcast(
  key: string,
  value: AtomValue,
): void {
  ensureBroadcast();
  setAtomValue(key, value, false);
}

export function clearPersistedAtoms(): void {
  ensureBroadcast();
  const keys = Array.from(values.keys());
  values.clear();
  const broadcastFn = broadcast;
  keys.forEach((key) => broadcastFn?.(key, undefined));
  keys.forEach((key) => notifySubscribers(key));
  clearLocalStoragePersistedAtoms();
}

export function loadPersistedAtomsFromLocalStorage(
  prefix: string,
): Record<string, AtomValue> {
  if (typeof window === "undefined" || !window.localStorage) return {};
  const result: Record<string, AtomValue> = {};
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const raw = window.localStorage.getItem(key);
    if (raw == null) continue;
    try {
      const value = JSON.parse(raw) as AtomValue;
      result[key.replace(prefix, "")] = value;
    } catch {
      window.localStorage.removeItem(key);
    }
  }
  return result;
}

export function clearLocalStoragePersistedAtoms(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(PERSISTED_ATOM_KEY_PREFIX)) {
      keys.push(key);
    }
  }
  keys.forEach((key) => window.localStorage.removeItem(key));
}

export { PERSISTED_ATOM_KEY_PREFIX as persistedAtomKeyPrefix };
