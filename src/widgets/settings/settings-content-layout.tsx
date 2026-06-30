// Restored from ref/webview/assets/settings-content-layout-B9ZpDhiD.js
// Settings page content layout with navigation context provider.

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import clsx from "clsx";
export interface SettingsContentLayoutProps {
  title?: string;
  backSlot?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  fullWidth?: boolean;
  contentClassName?: string;
  subtitleClassName?: string;
  titleStackClassName?: string;
  action?: ReactNode;
  actionPlacement?: "header" | "subtitle";
  className?: string;
}
interface SettingsNavigationContextValue {
  navigationKey?: string;
  targetId?: string;
}
const SettingsNavigationContext =
  createContext<SettingsNavigationContextValue | null>(null);
export interface SettingsNavigationProviderProps {
  children: ReactNode;
  navigationKey?: string;
  targetId?: string;
}
export function SettingsNavigationProvider(
  props: SettingsNavigationProviderProps,
): JSX.Element {
  const { children, navigationKey, targetId } = props;
  const value =
    targetId == null
      ? null
      : {
          navigationKey,
          targetId,
        };
  return (
    <SettingsNavigationContext.Provider value={value}>
      {children}
    </SettingsNavigationContext.Provider>
  );
}
export function SettingsContentLayout(
  props: SettingsContentLayoutProps,
): JSX.Element {
  const {
    title,
    backSlot,
    subtitle,
    children,
    fullWidth = false,
    contentClassName,
    subtitleClassName,
    titleStackClassName,
    action,
    actionPlacement = "header",
    className,
    ...rest
  } = props;
  const context = useContext(SettingsNavigationContext);
  const targetId = context?.targetId ?? null;
  const navigationKey = context?.navigationKey ?? null;
  const scrollToTarget = () => {
    if (targetId != null) {
      document.getElementById(targetId)?.scrollIntoView?.({
        block: "center",
      });
    }
  };
  useLayoutEffect(scrollToTarget, [navigationKey, targetId]);
  const titleElement = title ? (
    <div className="electron:heading-lg heading-base truncate">{title}</div>
  ) : null;
  const subtitleElement = subtitle ? (
    <div
      className={clsx(
        "text-base text-token-text-secondary",
        subtitleClassName ?? "truncate",
      )}
    >
      {subtitle}
    </div>
  ) : null;
  let headerContent: JSX.Element | null = null;
  if (title || subtitle || action) {
    if (actionPlacement === "subtitle" && subtitleElement) {
      headerContent = (
        <div className="pb-panel">
          <div
            className={clsx(
              "flex min-w-0 flex-col",
              titleStackClassName ?? "gap-1.5 pb-panel",
            )}
          >
            {titleElement}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">{subtitleElement}</div>
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>
          </div>
        </div>
      );
    } else {
      headerContent = (
        <div className="flex items-center justify-between gap-3 pb-panel">
          <div
            className={clsx(
              "flex min-w-0 flex-1 flex-col",
              titleStackClassName ?? "gap-1.5 pb-panel",
            )}
          >
            {titleElement}
            {subtitleElement}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      );
    }
  }
  const containerClassName = clsx(
    "main-surface flex h-full min-h-0 flex-col",
    className,
  );
  const backSlotElement = backSlot ? (
    <div className="draggable flex items-center px-panel electron:h-toolbar extension:h-toolbar-sm">
      {backSlot}
    </div>
  ) : null;
  const maxWidthClass = fullWidth
    ? null
    : "max-w-2xl electron:min-w-[calc(320px*var(--codex-window-zoom))]";
  const contentClassNameResult = clsx(
    "mx-auto flex w-full flex-col",
    maxWidthClass,
    contentClassName,
  );
  const childrenElement = (
    <div className="flex flex-col gap-[var(--padding-panel)]">{children}</div>
  );
  const scrollableContent = (
    <div className="scrollbar-stable flex-1 overflow-y-auto p-panel">
      <div className={contentClassNameResult}>
        {headerContent}
        {childrenElement}
      </div>
    </div>
  );
  return (
    <div className={containerClassName} {...rest}>
      {backSlotElement}
      {scrollableContent}
    </div>
  );
}
