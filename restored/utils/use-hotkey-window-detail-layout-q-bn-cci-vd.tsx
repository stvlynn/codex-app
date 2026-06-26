// Restored from ref/webview/assets/use-hotkey-window-detail-layout-QBnCCIVd.js
import React, { createContext, useContext, useLayoutEffect } from "react";
export interface HotkeyWindowDetailLayoutContextValue {
  /** Register a detail layout element for hotkey handling. */
  (element: HTMLElement | null): void;
}
export const HotkeyWindowDetailLayoutContext =
  createContext<HotkeyWindowDetailLayoutContextValue | null>(null);
export interface UseHotkeyWindowDetailLayoutOptions {
  /** The element to register with the detail layout context. */
  element: HTMLElement | null;
}

/**
 * Hook that registers an element with the hotkey window detail layout context.
 * When the element is provided, it calls the context's register function and
 * unregisters on cleanup.
 */
export function useHotkeyWindowDetailLayout({
  element,
}: UseHotkeyWindowDetailLayoutOptions): void {
  const register = useContext(HotkeyWindowDetailLayoutContext);
  useLayoutEffect(() => {
    if (register == null) return;
    register(element);
    return () => {
      register(null);
    };
  }, [element, register]);
}
