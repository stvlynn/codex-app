// Restored from ref/webview/assets/infinite-scroll-pagination-spinner-iQsEdPrJ.js
// InfiniteScrollPaginationSpinner chunk restored from the Codex webview bundle.

import { useRef, useEffect, type JSX } from "react";
import { Spinner } from "./spinner-dh-bmwxtt";
export interface InfiniteScrollPaginationSpinnerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadNextPage: () => void;
}
export function InfiniteScrollPaginationSpinner({
  hasNextPage,
  isFetchingNextPage,
  onLoadNextPage,
}: InfiniteScrollPaginationSpinnerProps): JSX.Element | null {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const triggerLoad = () => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadNextPage();
    }
  };
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel == null || !hasNextPage || isFetchingNextPage) {
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      triggerLoad();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        triggerLoad();
      }
    });
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onLoadNextPage]);
  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }
  return (
    <div ref={sentinelRef} className="flex justify-center py-3">
      <Spinner className="icon-xs text-token-text-secondary" />
    </div>
  );
}
