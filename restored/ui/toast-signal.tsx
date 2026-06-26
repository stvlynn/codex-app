// Restored from ref/webview/assets/toast-signal-D5jJGQGW.js

// App-scope atom primitives (boundary: app-scope-CWE-zIhQ)
function atom<T>(get: any, initial: T): any {
  return { key: Symbol(), get, initial };
}
function getAtom(store: any, atom: any, key?: string): any {
  return store.get(atom, key);
}
function setAtom(store: any, atom: any, ...args: any[]): void {
  store.set(atom, ...args);
}

const DEFAULT_DURATION = 5;
const DEFAULT_TOAST_ID = 1;

interface ToastConfig {
  duration: number;
  hasCloseButton: boolean;
  isShown: boolean;
  level: ToastLevel;
  title: string | null;
}

type ToastLevel = "info" | "success" | "warning" | "danger";

interface ToastState {
  content?: (props: { close: () => void; level: ToastLevel }) => React.ReactNode;
  description?: string;
  duration: number;
  hasCloseButton: boolean;
  isShown: boolean;
  level: ToastLevel;
  testId?: string;
  title: string | null;
}

interface ToastOptions {
  id?: string;
  content?: (props: { close: () => void; level: ToastLevel }) => React.ReactNode;
  description?: string;
  duration?: number;
  hasCloseButton?: boolean;
  testId?: string;
  onRemove?: () => void;
}

interface ToastApi {
  info(title: string | null, options?: ToastOptions): { close: () => void };
  success(title: string | null, options?: ToastOptions): { close: () => void };
  warning(title: string | null, options?: ToastOptions): { close: () => void };
  danger(title: string | null, options?: ToastOptions): { close: () => void };
  custom(options: ToastOptions & { level?: ToastLevel }): { close: () => void };
  closeAll(): void;
}

const defaultToastConfig: ToastConfig = {
  duration: DEFAULT_DURATION,
  hasCloseButton: true,
  isShown: true,
  level: "info",
  title: null,
};

const noopClose = { close: () => {} };

const noopApi: ToastApi = {
  info: () => noopClose,
  success: () => noopClose,
  warning: () => noopClose,
  danger: () => noopClose,
  custom: () => noopClose,
  closeAll: () => {},
};

export const toastApiAtom = atom(getAtom, noopApi);
export const toastOrderAtom = atom(getAtom, [] as string[]);
export const toastIdCounterAtom = atom(getAtom, DEFAULT_TOAST_ID);
export const toastStateMapAtom = atom(getAtom, () => defaultToastConfig);

const removeCallbacks = new Map<string, () => void>();

function addToast(store: any, payload: { customId?: string; id: string; toast: ToastState }): void {
  const order = store.get(toastOrderAtom);

  if (payload.customId != null) {
    const prefix = `${payload.customId}-`;
    for (const existingId of order) {
      if (existingId.startsWith(prefix)) {
        store.set(toastStateMapAtom, existingId, (prev: ToastState) => ({
          ...prev,
          isShown: false,
        }));
      }
    }
  }

  store.set(toastIdCounterAtom, (prev: number) => prev + 1);
  store.set(toastStateMapAtom, payload.id, payload.toast);
  store.set(toastOrderAtom, [payload.id, ...order.filter((id) => id !== payload.id)]);
}

function hideToast(store: any, id: string): void {
  store.set(toastStateMapAtom, id, (prev: ToastState) => ({ ...prev, isShown: false }));
}

export function removeToast(store: any, id: string): void {
  removeCallbacks.get(id)?.();
  removeCallbacks.delete(id);
  store.set(toastOrderAtom, (prev: string[]) => prev.filter((existingId) => existingId !== id));
}

function closeAllToasts(store: any): void {
  for (const id of store.get(toastOrderAtom)) {
    hideToast(store, id);
  }
}

export function createToastApi(store: any): ToastApi {
  return {
    info(title, options) {
      return showToast(store, title, options, "info");
    },
    success(title, options) {
      return showToast(store, title, options, "success");
    },
    warning(title, options) {
      return showToast(store, title, options, "warning");
    },
    danger(title, options) {
      return showToast(store, title, options, "danger");
    },
    custom(options) {
      return showToast(store, null, options, options.level ?? "info");
    },
    closeAll() {
      closeAllToasts(store);
    },
  };
}

function showToast(
  store: any,
  title: string | null,
  options: ToastOptions | undefined,
  level: ToastLevel,
): { close: () => void } {
  const counter = store.get(toastIdCounterAtom);
  const id = options?.id == null ? `${counter}` : `${options.id}-${counter}`;

  const close = () => {
    hideToast(store, id);
  };

  if (options?.onRemove != null) {
    removeCallbacks.set(id, options.onRemove);
  }

  addToast(store, {
    customId: options?.id,
    id,
    toast: {
      content:
        options != null && "content" in options
          ? options.content?.({ close, level })
          : undefined,
      description: options?.description,
      duration: options?.duration ?? DEFAULT_DURATION,
      hasCloseButton: options?.hasCloseButton ?? true,
      isShown: true,
      level,
      testId: options?.testId,
      title,
    },
  });

  return { close };
}

export {
  toastOrderAtom,
  toastStateMapAtom,
  removeToast,
  toastApiAtom,
  createToastApi,
};
