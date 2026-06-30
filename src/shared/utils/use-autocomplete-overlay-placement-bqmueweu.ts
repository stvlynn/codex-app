// Restored from ref/webview/assets/use-autocomplete-overlay-placement-BQMUEWEU.js
import { useRef, useSyncExternalStore } from "react";
function getPlacement(anchorElement: Element | null): "top" | "bottom" {
  if (typeof window === "undefined" || anchorElement == null) {
    return "bottom";
  }
  const rect = anchorElement.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  return spaceBelow < 240 && spaceAbove > spaceBelow ? "top" : "bottom";
}
function noopSubscribe(): () => void {
  return () => {};
}
function createEventSubscribe(
  isActive: boolean,
): (callback: () => void) => () => void {
  return (callback) => {
    if (!isActive || typeof window === "undefined") {
      return noopSubscribe();
    }
    window.addEventListener("resize", callback);
    window.addEventListener("scroll", callback, true);
    return () => {
      window.removeEventListener("resize", callback);
      window.removeEventListener("scroll", callback, true);
    };
  };
}
interface UseAutocompleteOverlayPlacementOptions {
  anchorRef: React.RefObject<Element | null>;
  isActive: boolean;
}
export function useAutocompleteOverlayPlacement({
  anchorRef,
  isActive,
}: UseAutocompleteOverlayPlacementOptions): "top" | "bottom" {
  const subscribe = createEventSubscribe(isActive);
  const getSnapshot = () => getPlacement(anchorRef.current);
  const getServerSnapshot = () => "bottom" as const;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
export default useAutocompleteOverlayPlacement;
