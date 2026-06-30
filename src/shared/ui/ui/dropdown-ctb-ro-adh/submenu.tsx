// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import {
  c as DropdownMenuSubContent,
  i as DropdownMenuPortal,
  l as DropdownMenuSubTrigger,
  m as DropdownMenuSub,
} from "../../boundaries/dist-uq8yzy-fr";
import { windowZoomContextN } from "../../../../widgets/app-shell/window-zoom-context.tsx";
import { ChevronRightIcon } from "../../../icons/chevron-right-icon.tsx";
import { t as Tooltip } from "../tooltip-b";
import { DropdownItem } from "./item";
interface SubmenuItemProps {
  trigger: React.ReactElement<React.ComponentProps<typeof DropdownItem>>;
  children: ReactNode;
  isDefaultOpen?: boolean;
}
export function SubmenuItem({
  trigger,
  children,
  isDefaultOpen = false,
}: SubmenuItemProps) {
  const isDisabled = trigger.props.disabled ?? false;
  const [isOpen, setIsOpen] = React.useState(
    isDisabled ? false : isDefaultOpen,
  );
  const isExpanded = isOpen && !isDisabled;
  const handleSelect = (event: Event) => {
    trigger.props.onSelect?.(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      !isDisabled && setIsOpen((prev) => !prev);
    }
  };
  const rotation = isExpanded ? 90 : 0;
  const chevronClass = clsx(
    trigger.props.rightIconClassName ?? "icon-xs",
    "shrink-0 opacity-75 group-focus:opacity-100 group-hover:opacity-100",
  );
  const chevron = <ChevronRightIcon className={chevronClass} />;
  const clonedTrigger = React.cloneElement(trigger, {
    onSelect: handleSelect,
    rightIcon: (
      <span
        aria-hidden
        className="inline-flex items-center justify-center text-token-input-placeholder-foreground"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {chevron}
      </span>
    ),
  });
  const content = isExpanded ? (
    <div className="overflow-hidden">{children}</div>
  ) : null;
  return (
    <div className="flex flex-col" data-state={isExpanded ? "open" : "closed"}>
      {clonedTrigger}
      {content}
    </div>
  );
}
interface FlyoutSubmenuItemProps {
  label?: string;
  children: ReactNode;
  LeftIcon?: React.ComponentType<{
    className?: string;
  }>;
  leftIconClassName?: string;
  className?: string;
  disabled?: boolean;
  alignToParentBottom?: boolean;
  contentClassName?: string;
  contentSurface?: string;
  onSelect?: () => void;
  triggerContent?: ReactNode;
  tooltipText?: ReactNode;
  tooltipDisabled?: boolean;
  tooltipTextClassName?: string;
  tooltipSide?: string;
  tooltipAlign?: string;
  tooltipOpenWhen?: string;
  onOpenChange?: (open: boolean) => void;
}
export function FlyoutSubmenuItem({
  label,
  children,
  LeftIcon,
  leftIconClassName,
  className,
  disabled = false,
  alignToParentBottom,
  contentClassName,
  contentSurface = "menu",
  onSelect,
  triggerContent,
  tooltipText,
  tooltipDisabled,
  tooltipTextClassName,
  tooltipSide,
  tooltipAlign,
  tooltipOpenWhen,
  onOpenChange,
}: FlyoutSubmenuItemProps) {
  const zoom = windowZoomContextN();
  const contentClass =
    contentSurface === "bare"
      ? clsx(
          "z-50 m-0 flex min-w-[180px] select-none flex-col overflow-y-auto p-0",
        )
      : clsx(
          "bg-token-dropdown-background/90 text-token-foreground ring-token-border z-50 m-px flex min-w-[180px] select-none flex-col overflow-y-auto rounded-xl px-1 py-1 shadow-xl-spread ring-[0.5px] backdrop-blur-sm",
        );
  const disabledClass = disabled
    ? "cursor-default opacity-50"
    : "group hover:bg-token-list-hover-background focus:bg-token-list-hover-background cursor-interaction";
  const triggerClass = clsx(
    "text-token-foreground outline-hidden rounded-lg px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm",
    "flex w-full items-center",
    disabledClass,
    className,
  );
  const handleClick = (event: React.MouseEvent) => {
    if (!disabled && onSelect != null) {
      event.preventDefault();
      event.stopPropagation();
      onSelect();
    }
  };
  const defaultTrigger = triggerContent ?? (
    <div className="flex w-full items-center gap-1.5">
      {LeftIcon ? (
        <LeftIcon
          className={clsx(
            leftIconClassName ?? "icon-xs",
            "shrink-0 opacity-75 group-focus:opacity-100 group-hover:opacity-100",
          )}
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRightIcon
        className={clsx(
          "icon-xs text-token-input-placeholder-foreground",
          "shrink-0 opacity-75 group-focus:opacity-100 group-hover:opacity-100",
        )}
      />
    </div>
  );
  const trigger = (
    <DropdownMenuSubTrigger
      className={triggerClass}
      disabled={disabled}
      onClick={handleClick}
    >
      {defaultTrigger}
    </DropdownMenuSubTrigger>
  );
  const wrappedTrigger = (
    <Tooltip
      tooltipText={tooltipText}
      tooltipDisabled={tooltipDisabled}
      tooltipTextClassName={tooltipTextClassName}
      tooltipSide={tooltipSide}
      tooltipAlign={tooltipAlign}
      tooltipOpenWhen={tooltipOpenWhen}
    >
      {trigger}
    </Tooltip>
  );
  const avoidCollisions = !alignToParentBottom;
  const maxSize = alignToParentBottom
    ? {
        maxHeight: "calc(100vh - 16px)",
      }
    : {
        maxWidth:
          "min(var(--radix-dropdown-menu-content-available-width), calc(100vw - 16px))",
        maxHeight:
          "min(var(--radix-dropdown-menu-content-available-height), calc(100vh - 16px))",
      };
  const finalStyle = {
    ...maxSize,
    zoom: alignToParentBottom ? undefined : zoom === 1 ? undefined : zoom,
  };
  const subContent = (
    <DropdownMenuSubContent
      className={clsx(
        contentClass,
        alignToParentBottom && "parent-bottom-aligned",
        contentClassName,
      )}
      collisionPadding={6}
      avoidCollisions={avoidCollisions}
      sideOffset={4}
      alignOffset={-4}
      style={finalStyle}
    >
      <div dir="ltr">{children}</div>
    </DropdownMenuSubContent>
  );
  return (
    <DropdownMenuSub onOpenChange={onOpenChange}>
      {wrappedTrigger}
      <DropdownMenuPortal>{subContent}</DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
