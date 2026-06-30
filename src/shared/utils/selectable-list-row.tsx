// Restored from ref/webview/assets/selectable-list-row-QBnMjnV3.js
// Accessible selectable list row component with keyboard support.

import { useCallback } from "react";
import clsx from "clsx";
export interface SelectableListRowProps {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  className?: string;
  hasInteractiveContent?: boolean;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  rightText?: React.ReactNode;
  secondaryTitle?: React.ReactNode;
  secondLine?: React.ReactNode;
  secondLineRightText?: React.ReactNode;
  title: React.ReactNode;
}
interface UseSelectableRowOptions {
  onSelect?: () => void;
  isDisabled?: boolean;
}
interface UseSelectableRowResult {
  role: "button";
  tabIndex: number;
  "aria-disabled": boolean;
  onClick: (event: React.MouseEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}
export function useSelectableRow(
  options: UseSelectableRowOptions,
): UseSelectableRowResult {
  const { onSelect, isDisabled = false } = options;
  const isInactive = isDisabled || onSelect == null;
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (isInactive || event.defaultPrevented) return;
      onSelect?.();
    },
    [isInactive, onSelect],
  );
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isInactive || event.defaultPrevented) return;
      if (
        event.currentTarget === event.target &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        onSelect?.();
      }
    },
    [isInactive, onSelect],
  );
  return {
    role: "button",
    tabIndex: isInactive ? -1 : 0,
    "aria-disabled": isInactive,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };
}
export function SelectableListRow(props: SelectableListRowProps): JSX.Element {
  const {
    ariaDescribedBy,
    ariaLabel,
    className,
    hasInteractiveContent = false,
    icon,
    isSelected,
    onSelect,
    onContextMenu,
    rightText,
    secondaryTitle,
    secondLine,
    secondLineRightText,
    title,
  } = props;
  const selectOptions: UseSelectableRowOptions = {
    onSelect,
  };
  const rowProps = useSelectableRow(selectOptions);
  const iconElement = icon ? (
    <span className="flex min-h-6 shrink-0 items-center">{icon}</span>
  ) : null;
  const titleElement = (
    <span className="min-w-0 truncate text-token-foreground">{title}</span>
  );
  const secondaryTitleElement =
    secondaryTitle == null ? null : (
      <span className="max-w-48 shrink-0 truncate text-token-description-foreground">
        {secondaryTitle}
      </span>
    );
  const titleRow = (
    <div className="flex min-w-0 flex-1 items-baseline gap-2 text-base leading-6">
      {titleElement}
      {secondaryTitleElement}
    </div>
  );
  const rightTextElement =
    rightText == null ? null : (
      <div className="flex min-h-6 shrink-0 items-center text-base text-token-description-foreground">
        {rightText}
      </div>
    );
  const titleRowWithRight = (
    <div className="flex min-w-0 items-baseline gap-3">
      {titleRow}
      {rightTextElement}
    </div>
  );
  const secondLineElement = secondLine ? (
    <div className="flex min-w-0 items-center justify-between gap-3 text-sm leading-[22px] text-token-description-foreground">
      <div className="min-w-0 flex-1">{secondLine}</div>
      {secondLineRightText && (
        <div className="flex min-h-[22px] shrink-0 items-center">
          {secondLineRightText}
        </div>
      )}
    </div>
  ) : null;
  const contentColumn = (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      {titleRowWithRight}
      {secondLineElement}
    </div>
  );
  const rowContent = (
    <div className="flex min-w-0 items-start gap-2">
      {iconElement}
      {contentColumn}
    </div>
  );
  const containerClassName = clsx(
    "group min-h-10 w-full cursor-interaction rounded-lg px-3 py-3 text-left text-base",
    isSelected
      ? "bg-token-list-active-selection-background"
      : "hover:bg-token-list-active-selection-background",
    className,
  );
  if (hasInteractiveContent) {
    return (
      <div
        className={clsx("relative", containerClassName)}
        onContextMenu={onContextMenu}
      >
        <button
          type="button"
          className="focus-visible:ring-token-border-focus absolute inset-0 cursor-interaction rounded-lg outline-none focus-visible:ring-2"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          onClick={onSelect}
        />
        <div className="pointer-events-none relative">{rowContent}</div>
      </div>
    );
  }
  return (
    <div
      aria-label={ariaLabel}
      className={containerClassName}
      onContextMenu={onContextMenu}
      {...rowProps}
    >
      {rowContent}
    </div>
  );
}
