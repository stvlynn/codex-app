// Restored from ref/webview/assets/use-debounced-value-DhB_g6ub.js
import { useState, useEffect } from "react";
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMs]);
  return debouncedValue;
}
export default useDebouncedValue;
