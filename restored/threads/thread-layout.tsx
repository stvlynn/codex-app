// Restored from ref/webview/assets/thread-layout-4YZWZt2v.js

import { useCallback, type Ref, type ReactNode } from "react";
import clsx from "clsx";
export interface ThreadLayoutProps {
  header?: ReactNode;
  banner?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  containerRef?: Ref<HTMLDivElement>;
  tabIndex?: number;
}
const contentWrapperClass = clsx(
  "mx-auto w-full max-w-(--thread-content-max-width)",
  "px-toolbar",
);
export function ThreadLayout({
  header,
  banner,
  children,
  className,
  bodyClassName,
  containerRef,
  tabIndex = 0,
  ...rest
}: ThreadLayoutProps): JSX.Element {
  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (typeof containerRef === "function") {
        containerRef(element);
        return;
      }
      if (containerRef != null) {
        (
          containerRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = element;
      }
    },
    [containerRef],
  );
  return (
    <div
      ref={setRef}
      className={clsx("relative flex h-full flex-col", className)}
      tabIndex={tabIndex}
      {...rest}
    >
      <div className="sticky top-0 z-10">{header}</div>
      <div className={clsx("flex min-h-0 flex-1 flex-col", bodyClassName)}>
        <div className={contentWrapperClass}>
          {banner}
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
