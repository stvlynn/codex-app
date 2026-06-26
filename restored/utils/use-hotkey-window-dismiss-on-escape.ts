// Restored from ref/webview/assets/use-hotkey-window-dismiss-on-escape-CATf2BNk.js

import { useEffect } from "react";
import { n as rpcN } from "../boundaries/rpc";
export function useHotkeyWindowDismissOnEscape(): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      event.preventDefault();
      event.stopPropagation();
      rpcN.hotkeyWindowHotkeys?.dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
