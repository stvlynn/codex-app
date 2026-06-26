// Restored from ref/webview/assets/image-preview-shortcuts-Bl8w6jhv.js

const listeners = new Set<() => void>();
let activeHandle: ((event: KeyboardEvent) => void) | null = null;
let activeCount = 0;

export function addImagePreviewShortcutListener(
  listener: () => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isImagePreviewShortcutActive(): boolean {
  return activeCount > 0;
}

export function activateImagePreviewShortcut(): () => void {
  let released = false;
  activeCount += 1;
  notifyListeners();
  return () => {
    if (released) return;
    released = true;
    activeCount = Math.max(0, activeCount - 1);
    notifyListeners();
  };
}

export function registerImagePreviewKeyHandler(
  handler: (event: KeyboardEvent) => void,
): () => void {
  activeHandle = handler;
  return () => {
    if (activeHandle === handler) {
      activeHandle = null;
    }
  };
}

export function dispatchImagePreviewKeyEvent(event: KeyboardEvent): void {
  activeHandle?.(event);
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}
