// Restored from ref/webview/assets/summary-panel-row-D3U8QDSL.js
import React from "react";
import clsx from "clsx";
interface SummaryPanelRowProps {
  "aria-expanded"?: boolean;
  ariaExpanded?: boolean;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  interactive?: boolean;
  label: React.ReactNode;
  labelClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
  actions?: React.ReactNode;
  actionsAlwaysFocusable?: boolean;
  actionsVisible?: boolean;
  trailing?: React.ReactNode;
  trailingVisible?: boolean;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
}
export function SummaryPanelRow({
  "aria-expanded": ariaExpandedProp,
  ariaExpanded,
  className,
  disabled = false,
  icon,
  interactive = false,
  label,
  labelClassName,
  ref,
  actions,
  actionsAlwaysFocusable = false,
  actionsVisible = false,
  trailing,
  trailingVisible = false,
  title,
  onClick,
  onKeyDown,
  onPointerDown,
  ...rest
}: SummaryPanelRowProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const hasClickHandler =
    onClick != null || onPointerDown != null || onKeyDown != null;
  const isClickable = !disabled && hasClickHandler;
  const isInteractive = !disabled && (interactive || hasClickHandler);
  const textClass = isInteractive
    ? "cursor-interaction text-token-foreground"
    : "text-token-text-secondary";
  const hoverClass =
    isInteractive &&
    "before:absolute before:inset-y-0 before:-inset-x-2 before:-z-10 before:rounded-sm before:content-[''] hover:before:bg-token-list-hover-background";
  const disabledClass = disabled && "cursor-not-allowed";
  const rowClasses = clsx(
    "group/summary-panel-row relative isolate flex h-7 w-full min-w-0 items-center gap-2 rounded-sm border-0 bg-transparent px-0 py-1 text-left",
    textClass,
    hoverClass,
    disabledClass,
    className,
  );
  const labelClasses = clsx("text-base", labelClassName ?? "truncate");
  const labelElement = <span className={labelClasses}>{label}</span>;
  const actionsElement =
    actions == null ? null : (
      <span
        className={clsx(
          "shrink-0 items-center",
          (actionsVisible || !actionsAlwaysFocusable) && "ms-auto",
          actionsVisible
            ? "flex"
            : actionsAlwaysFocusable
              ? "pointer-events-none absolute inset-y-0 end-0 flex opacity-0 group-focus-within/summary-panel-row:pointer-events-auto group-focus-within/summary-panel-row:opacity-100 group-hover/summary-panel-row:pointer-events-auto group-hover/summary-panel-row:opacity-100"
              : "hidden group-focus-within/summary-panel-row:flex group-hover/summary-panel-row:flex",
        )}
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        {actions}
      </span>
    );
  const trailingElement =
    trailing == null ? null : (
      <span
        className={clsx(
          "shrink-0 leading-none opacity-0 group-focus-visible/summary-panel-row:opacity-100 group-hover/summary-panel-row:opacity-100",
          (actions == null || !actionsVisible || trailingVisible) && "ms-auto",
          actions != null &&
            !actionsVisible &&
            "group-focus-within/summary-panel-row:ms-0 group-hover/summary-panel-row:ms-0",
          trailingVisible && "opacity-100",
        )}
      >
        {trailing}
      </span>
    );
  const content = (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      {labelElement}
      {actionsElement}
      {trailingElement}
    </span>
  );
  const children = icon ? (
    <>
      {icon}
      {content}
    </>
  ) : (
    content
  );
  const ariaDisabled = disabled || undefined;
  const expandedValue = ariaExpanded ?? ariaExpandedProp;
  const clickHandler = isClickable ? onClick : undefined;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    disabled || onKeyDown?.(event);
    if (
      isClickable &&
      onClick != null &&
      !event.defaultPrevented &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  const pointerDownHandler = isClickable ? onPointerDown : undefined;
  const role = hasClickHandler ? "button" : undefined;
  const tabIndex = isClickable ? 0 : undefined;
  return (
    <div
      {...rest}
      aria-disabled={ariaDisabled}
      aria-expanded={expandedValue}
      className={rowClasses}
      onClick={clickHandler}
      onKeyDown={handleKeyDown}
      onPointerDown={pointerDownHandler}
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      title={title}
    >
      {children}
    </div>
  );
}
function stopPropagation(event: React.SyntheticEvent): void {
  event.stopPropagation();
}
export default SummaryPanelRow;
