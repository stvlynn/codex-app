// Restored from ref/webview/assets/use-media-query-_Pl2VYyH.js
// use-media-query-_Pl2VYyH chunk restored from the Codex webview bundle.
import { useState, useEffect } from "react";

/**
 * Hook that returns whether the given CSS media query currently matches.
 * Falls back to `false` during SSR or when `window.matchMedia` is unavailable.
 */
export function useMediaQuery(query: string): boolean {
  const getInitialValue = () => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia(query).matches;
  };
  const [matches, setMatches] = useState<boolean>(getInitialValue);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => {
        mediaQueryList.removeEventListener("change", handleChange);
      };
    } else {
      // Legacy API for older browsers
      mediaQueryList.addListener(handleChange as any);
      return () => {
        mediaQueryList.removeListener(handleChange as any);
      };
    }
  }, [query]);
  return matches;
}
