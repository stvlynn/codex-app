// Restored from ref/webview/assets/external-link-favicon-QeoIWTbH.js
// ExternalLinkFavicon component that fetches and displays a website's favicon.

import { useState, useCallback } from "react";
import clsx from "clsx";
import { GlobeIcon } from "../icons/globe-icon";
function getFaviconUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return `${url.origin}/favicon.ico`;
  } catch {
    return null;
  }
}
export interface ExternalLinkFaviconProps {
  href: string;
  className?: string;
}
export function ExternalLinkFavicon(
  props: ExternalLinkFaviconProps,
): JSX.Element | null {
  const { href, className } = props;
  const faviconUrl = getFaviconUrl(href);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const containerClass = clsx("relative inline-block shrink-0", className);
  const handleError = useCallback(() => {
    if (faviconUrl) setFailedUrl(faviconUrl);
  }, [faviconUrl]);
  const handleLoad = useCallback(() => {
    if (faviconUrl) setLoadedUrl(faviconUrl);
  }, [faviconUrl]);
  const showFallback =
    faviconUrl == null || failedUrl === faviconUrl || loadedUrl !== faviconUrl;
  const showImage = faviconUrl != null && failedUrl !== faviconUrl;
  return (
    <span className={containerClass}>
      {showFallback && (
        <GlobeIcon aria-hidden={true} className="h-full w-full" />
      )}
      {showImage && (
        <img
          alt=""
          className={clsx(
            "absolute inset-0 h-full w-full rounded-2xs object-contain",
            loadedUrl === faviconUrl ? "opacity-100" : "opacity-0",
          )}
          decoding="async"
          draggable={false}
          onError={handleError}
          onLoad={handleLoad}
          referrerPolicy="no-referrer"
          src={faviconUrl}
        />
      )}
    </span>
  );
}
