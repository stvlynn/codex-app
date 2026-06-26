// Restored from ref/webview/assets/web-search-favicon-icon-B_3yd7Lz.js
import React from "react";
import clsx from "clsx";
import { GlobeIcon } from "../icons/globe-icon";
export interface Tool {
  name: string;
  enabled: boolean;
}

/**
 * Checks whether workspace dependencies are enabled in the tool list.
 */
export function hasWorkspaceDependenciesEnabled(
  tools: Tool[] | undefined,
): boolean {
  return (
    tools?.some(
      (tool) => tool.name === "workspace_dependencies" && tool.enabled === true,
    ) ?? false
  );
}
export interface WebSearchFaviconIconProps {
  /** URL of the favicon image. */
  src: string;
  /** Additional CSS classes for the wrapper. */
  className?: string;
  /** Whether to show the globe fallback while the image is loading. */
  showFallbackWhileLoading?: boolean;
}

/**
 * Renders a favicon icon with a fallback globe icon while loading or on error.
 * The image fades in once loaded, and the globe icon is shown as a placeholder.
 */
export function WebSearchFaviconIcon({
  src,
  className,
  showFallbackWhileLoading = true,
}: WebSearchFaviconIconProps): React.ReactElement {
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const [errorSrc, setErrorSrc] = React.useState<string | null>(null);
  const wrapperClass = clsx(
    "relative flex shrink-0 items-center justify-center",
    className,
  );
  const showFallback =
    errorSrc === src || (showFallbackWhileLoading && loadedSrc !== src);
  return (
    <span className={wrapperClass}>
      {showFallback && (
        <GlobeIcon aria-hidden={true} className="h-full w-full" />
      )}
      {errorSrc !== src && (
        <img
          alt=""
          className={clsx(
            "absolute h-full w-full rounded-2xs object-contain",
            loadedSrc === src ? "opacity-100" : "opacity-0",
          )}
          decoding="async"
          draggable={false}
          onError={() => setErrorSrc(src)}
          onLoad={() => setLoadedSrc(src)}
          referrerPolicy="no-referrer"
          src={src}
        />
      )}
    </span>
  );
}
