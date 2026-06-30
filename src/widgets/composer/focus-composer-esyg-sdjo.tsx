// Restored from ref/webview/assets/focus-composer-esygSDJO.js
// focus-composer-esygSDJO chunk restored from the Codex webview bundle.
import { f } from "../boundaries/vscode-api";

const OPEN_OVERLAY_SELECTORS = [
  '[role="dialog"][data-state="open"]',
  '[role="menu"][data-state="open"]',
  '[role="listbox"][data-state="open"]',
].join(", ");

const COMPOSER_CONTAINER_SELECTORS = [
  "[data-codex-terminal]",
  "dil-renderer",
].join(", ");

const registeredComposers = new Map<
  HTMLElement,
  { composerId: string; isPrimaryComposer: boolean }
>();

const keydownHandlers = new Map<
  HTMLElement,
  Set<(event: KeyboardEvent) => void>
>();

const pasteHandlers = new Set<HTMLElement>();

const messageHandlers = new Map<
  string,
  {
    handlersByComposerInput: Map<HTMLElement, Set<(message: unknown) => void>>;
    unsubscribe: () => void;
  }
>();

let lastFocusedComposer: HTMLElement | null = null;

export function focusActiveComposer() {
  const composer = findActiveComposer();
  if (composer) {
    requestAnimationFrame(() => {
      composer.focus();
    });
  }
}

export function registerComposer(
  element: HTMLElement,
  {
    composerId,
    isPrimaryComposer,
  }: { composerId: string; isPrimaryComposer: boolean },
) {
  const handleFocus = () => {
    lastFocusedComposer = element;
  };

  registeredComposers.set(element, { composerId, isPrimaryComposer });
  element.addEventListener("focus", handleFocus);
  if (document.activeElement === element) {
    lastFocusedComposer = element;
  }

  return () => {
    registeredComposers.delete(element);
    element.removeEventListener("focus", handleFocus);
    if (lastFocusedComposer === element) {
      lastFocusedComposer = null;
    }
  };
}

export function registerKeydownHandler(
  composerElement: HTMLElement,
  handler: (event: KeyboardEvent) => void,
) {
  const handlers = keydownHandlers.get(composerElement) ?? new Set();
  if (keydownHandlers.size === 0) {
    window.addEventListener("keydown", handleGlobalKeydown, true);
  }
  handlers.add(handler);
  keydownHandlers.set(composerElement, handlers);

  return () => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      keydownHandlers.delete(composerElement);
    }
    if (keydownHandlers.size === 0) {
      window.removeEventListener("keydown", handleGlobalKeydown, true);
    }
  };
}

export function registerPasteHandler(composerElement: HTMLElement) {
  if (pasteHandlers.size === 0) {
    window.addEventListener("paste", handleGlobalPaste, true);
  }
  pasteHandlers.add(composerElement);

  return () => {
    pasteHandlers.delete(composerElement);
    if (pasteHandlers.size === 0) {
      window.removeEventListener("paste", handleGlobalPaste, true);
    }
  };
}

export function subscribeToComposerMessages(
  messageType: string,
  composerInput: HTMLElement,
  handler: (message: unknown) => void,
) {
  let messageHandler = messageHandlers.get(messageType);
  if (messageHandler == null) {
    const handlersByComposerInput = new Map<
      HTMLElement,
      Set<(message: unknown) => void>
    >();
    messageHandler = {
      handlersByComposerInput,
      unsubscribe: f.subscribe(messageType, (message: unknown) => {
        const activeComposer = findActiveComposer();
        if (activeComposer != null) {
          const handlers = handlersByComposerInput.get(activeComposer) ?? [];
          for (const h of handlers) {
            h(message);
          }
        }
      }),
    };
    messageHandlers.set(messageType, messageHandler);
  }

  const handlers =
    messageHandler.handlersByComposerInput.get(composerInput) ?? new Set();
  handlers.add(handler);
  messageHandler.handlersByComposerInput.set(composerInput, handlers);

  return () => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      messageHandler!.handlersByComposerInput.delete(composerInput);
    }
    if (messageHandler!.handlersByComposerInput.size === 0) {
      messageHandler!.unsubscribe();
      messageHandlers.delete(messageType);
    }
  };
}

export function isComposerFocused(element: HTMLElement): boolean {
  return findActiveComposer() === element;
}

export function isComposerActive(composerId: string): boolean {
  const activeComposer = findActiveComposer();
  return (
    activeComposer != null &&
    registeredComposers.get(activeComposer)?.composerId === composerId
  );
}

export function focusTerminalComposer(
  scope: Document | HTMLElement = document,
) {
  scope
    .querySelector("[data-codex-terminal]")
    ?.querySelector("textarea")
    ?.focus();
}

export function handleComposerKeydown({
  composerController,
  event,
}: {
  composerController: {
    focus: () => void;
    insertTextAtSelection: (text: string) => void;
  };
  event: KeyboardEvent;
}) {
  if (isValidComposerKeydown(event)) {
    if (isFocusBlocked(event)) {
      return;
    }
    event.preventDefault();
    composerController.focus();
    composerController.insertTextAtSelection(event.key);
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (document.querySelector(OPEN_OVERLAY_SELECTORS) != null) return;
  const activeComposer = findActiveComposer();
  if (activeComposer != null) {
    const handlers = keydownHandlers.get(activeComposer) ?? [];
    for (const handler of handlers) {
      handler(event);
    }
  }
}

function handleGlobalPaste(event: ClipboardEvent) {
  if (event.defaultPrevented || isFocusBlocked(event)) return;
  const activeComposer = findActiveComposer();
  if (activeComposer == null || !pasteHandlers.has(activeComposer)) return;

  event.preventDefault();
  activeComposer.focus();

  const pasteEvent = new Event("paste", {
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  Object.defineProperty(pasteEvent, "clipboardData", {
    value: event.clipboardData,
  });
  activeComposer.dispatchEvent(pasteEvent);
}

function findActiveComposer(): HTMLElement | null {
  if (
    lastFocusedComposer != null &&
    lastFocusedComposer.isConnected &&
    registeredComposers.has(lastFocusedComposer)
  ) {
    return lastFocusedComposer;
  }
  lastFocusedComposer = null;

  for (const [element, { isPrimaryComposer }] of registeredComposers) {
    if (isPrimaryComposer && element.isConnected) {
      return element;
    }
  }

  for (const element of registeredComposers.keys()) {
    if (element.isConnected) {
      return element;
    }
  }

  return document.querySelector("[data-codex-composer]") as HTMLElement | null;
}

function isValidComposerKeydown(event: KeyboardEvent): boolean {
  return (
    !event.defaultPrevented &&
    !event.isComposing &&
    !event.metaKey &&
    !event.ctrlKey &&
    event.key !== " " &&
    event.key !== "\xA0" &&
    event.key.length === 1
  );
}

function isFocusBlocked(event: Event): boolean {
  return (
    event
      .composedPath()
      .some(
        (item) =>
          item instanceof HTMLElement &&
          (isContentEditableElement(item) ||
            item.closest(COMPOSER_CONTAINER_SELECTORS) != null),
      ) || document.querySelector(OPEN_OVERLAY_SELECTORS) != null
  );
}

function isContentEditableElement(element: HTMLElement | null): boolean {
  if (element == null) return false;
  if (element.isContentEditable) return true;
  const tagName = element.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }
  return element.closest("[contenteditable='true']") != null;
}
