// Restored from ref/webview/assets/tabs-kToUPTsC.js
import React from "react";
import clsx from "clsx";

function XIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export interface TabItem {
  key: string;
  name: React.ReactNode;
  icon?: React.ReactNode;
  panelId?: string;
  onClose?: () => void;
  closeLabel?: string;
}

interface TabsProps {
  tabs: TabItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  className?: string;
  scrollable?: boolean;
  tabListRef?: React.Ref<HTMLDivElement>;
  variant?: "segmented" | "toolbar" | "underline";
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function Tabs({
  tabs,
  selectedKey,
  onSelect,
  className,
  scrollable = false,
  tabListRef,
  variant = "segmented",
  ariaLabel,
  ariaLabelledBy,
}: TabsProps): JSX.Element {
  const isToolbar = variant === "toolbar";
  const isUnderline = variant === "underline";

  const containerClasses = clsx(
    "bg-token-surface-secondary border-token-border flex items-center rounded-lg border",
    isToolbar && "flex min-w-0 items-center gap-0.5",
    isUnderline &&
      "border-token-border flex min-w-0 items-start gap-8 border-b",
    scrollable && "hide-scrollbar overflow-x-auto overflow-y-hidden",
    className,
  );

  const handleWheel = scrollable
    ? (event: React.WheelEvent<HTMLDivElement>) => {
        const delta = event.deltaX || event.deltaY;
        if (delta !== 0) {
          event.currentTarget.scrollLeft =
            event.currentTarget.scrollLeft + delta;
        }
      }
    : undefined;

  const renderTab = (tab: TabItem, index: number) => {
    const isSelected = tab.key === selectedKey;
    const isFirst = index === 0;
    const isLast = index === tabs.length - 1;

    const buttonClasses = clsx(
      "cursor-interaction items-center text-sm font-medium",
      isSelected ? "text-token-text-primary" : "text-token-text-secondary",
      isToolbar
        ? "flex min-w-0 gap-1.5 rounded-md px-2 py-1"
        : isUnderline
          ? "flex min-w-0 gap-1.5"
          : "relative flex-1 rounded-none px-4 py-1.5",
      !isToolbar && !isUnderline && isFirst && "rounded-l-md",
      !isToolbar && !isUnderline && isLast && "rounded-r-md",
      isSelected &&
        (isToolbar
          ? "bg-token-bg-primary"
          : isUnderline
            ? ""
            : "bg-token-radio-active-foreground/25 text-token-text-primary"),
      !isSelected &&
        (isToolbar
          ? "hover:bg-token-bg-primary"
          : isUnderline
            ? "hover:text-token-text-primary"
            : "hover:bg-token-radio-active-foreground/5"),
    );

    return (
      <div
        key={tab.key}
        className={clsx(
          "relative flex min-w-0 items-center",
          isToolbar || isUnderline ? "shrink-0" : "flex-1",
          isUnderline && "pb-2",
          tab.onClose != null && "group/tab",
        )}
      >
        <button
          type="button"
          role="tab"
          aria-controls={tab.panelId}
          aria-selected={isSelected}
          aria-pressed={isSelected}
          className={buttonClasses}
          onClick={() => {
            if (!isSelected) onSelect(tab.key);
          }}
        >
          {tab.icon != null && (
            <span
              aria-hidden="true"
              className="icon-xs flex shrink-0 items-center justify-center"
            >
              {tab.icon}
            </span>
          )}
          {tab.name}
        </button>
        {isUnderline && isSelected && (
          <div className="absolute inset-x-0 bottom-[-1px] h-px bg-token-text-primary" />
        )}
        {tab.onClose != null && (
          <button
            type="button"
            aria-label={tab.closeLabel}
            className={clsx(
              "cursor-interaction text-token-text-tertiary hover:text-token-text-primary",
              isToolbar ? "flex h-7 w-5 items-center justify-center" : "px-1",
            )}
            onClick={tab.onClose}
          >
            <XIcon className="icon-2xs" />
          </button>
        )}
        {!isToolbar && !isUnderline && !isLast && (
          <div className="h-full w-px self-stretch bg-token-border" />
        )}
      </div>
    );
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={containerClasses}
      onWheel={handleWheel}
    >
      {tabs.map(renderTab)}
    </div>
  );
}

export default Tabs;
