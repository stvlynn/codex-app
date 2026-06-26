// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { o as DropdownMenuItem } from "../../boundaries/dist-uq8yzy-fr";
import { t as Tooltip } from "../tooltip-b";
import { styles } from "./shared";
interface DropdownItemProps {
  children: ReactNode;
  LeftIcon?: React.ComponentType<{
    className?: string;
  }>;
  keyboardShortcut?: string;
  leftIconClassName?: string;
  RightIcon?: React.ComponentType<{
    className?: string;
  }>;
  rightIcon?: ReactNode;
  rightIconClassName?: string;
  className?: string;
  onClick?: () => void;
  onSelect?: (event: Event) => void;
  disabled?: boolean;
  href?: string;
  SubText?: ReactNode;
  tooltipText?: ReactNode;
  tooltipDisabled?: boolean;
  tooltipTextClassName?: string;
  tooltipInteractive?: boolean;
  tooltipSide?: string;
  tooltipAlign?: string;
  tooltipOpenWhen?: string;
  allowWrap?: boolean;
  subTextAllowWrap?: boolean;
}
export function DropdownItem({
  children,
  LeftIcon,
  keyboardShortcut,
  leftIconClassName,
  RightIcon,
  rightIcon,
  rightIconClassName = "icon-xs",
  className,
  onClick,
  onSelect,
  disabled,
  href,
  SubText,
  tooltipText,
  tooltipDisabled,
  tooltipTextClassName,
  tooltipInteractive,
  tooltipSide,
  tooltipAlign,
  tooltipOpenWhen,
  allowWrap = false,
  subTextAllowWrap = false,
  ...rest
}: DropdownItemProps) {
  const Tag = href ? "a" : "div";
  const isInteractive = !disabled && (!!href || !!onClick || !!onSelect);
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];
  const itemIcon =
    React.isValidElement(firstChild) && firstChild.type === ItemIcon
      ? firstChild
      : null;
  const mainContent = itemIcon ? childrenArray.slice(1) : children;
  const iconSize = SubText == null ? "icon-xs" : "icon-sm";
  const leftIconEl =
    itemIcon ??
    (LeftIcon ? (
      <LeftIcon className={clsx(leftIconClassName ?? iconSize, styles.icon)} />
    ) : null);
  const rightIconEl =
    rightIcon ??
    (RightIcon ? (
      <RightIcon className={clsx(rightIconClassName, styles.icon)} />
    ) : null);
  const rightContent =
    keyboardShortcut || rightIconEl ? (
      <>
        {keyboardShortcut ? (
          <span className="ml-2 shrink-0 text-xs text-token-description-foreground">
            {keyboardShortcut}
          </span>
        ) : null}
        {rightIconEl}
      </>
    ) : null;
  const content =
    SubText == null ? (
      <div className={styles.content}>
        {leftIconEl}
        <span
          data-tooltip-overflow-target={
            tooltipOpenWhen === "trigger-overflows" ? "" : undefined
          }
          className={clsx(
            "flex-1 min-w-0",
            allowWrap ? "whitespace-normal" : "truncate",
          )}
        >
          {mainContent}
        </span>
        {rightContent}
      </div>
    ) : (
      <div
        className={
          leftIconEl == null ? styles.content : styles.contentWithIconAndSubText
        }
      >
        {leftIconEl}
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            data-tooltip-overflow-target={
              tooltipOpenWhen === "trigger-overflows" ? "" : undefined
            }
            className={clsx(
              "min-w-0",
              allowWrap ? "whitespace-normal" : "truncate",
            )}
          >
            {mainContent}
          </span>
          <span
            className={clsx(
              "min-w-0",
              subTextAllowWrap ? "whitespace-normal" : "truncate",
            )}
          >
            {SubText}
          </span>
        </div>
        {rightContent}
      </div>
    );
  const disabledClass = disabled
    ? "cursor-default opacity-50"
    : isInteractive && styles.itemInteractive;
  const finalClass = clsx("no-drag", styles.itemBase, disabledClass, className);
  const handleClick = disabled ? undefined : onClick;
  const handleSelect = disabled ? undefined : onSelect;
  const linkClass = href && "!text-token-foreground focus:!outline-none";
  const wrapperClass = clsx(linkClass, "flex flex-col");
  const item = (
    <Tag href={href} className={wrapperClass}>
      {content}
    </Tag>
  );
  const menuItem = (
    <DropdownMenuItem
      asChild
      className={finalClass}
      onClick={handleClick}
      onSelect={handleSelect}
      disabled={disabled}
      {...rest}
    >
      {item}
    </DropdownMenuItem>
  );
  return (
    <Tooltip
      disabled={tooltipDisabled}
      tooltipContent={
        tooltipText ? (
          <div className={clsx("max-w-64 text-pretty", tooltipTextClassName)}>
            {tooltipText}
          </div>
        ) : null
      }
      closeOnTriggerBlur={!tooltipInteractive}
      interactive={tooltipInteractive}
      side={tooltipSide}
      align={tooltipAlign}
      openWhen={tooltipOpenWhen}
    >
      {menuItem}
    </Tooltip>
  );
}
interface ItemIconProps {
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md";
}
export function ItemIcon({ children, className, size }: ItemIconProps) {
  const sizeClass =
    size === undefined
      ? "icon-sm"
      : size === "xs"
        ? "icon-xs"
        : size === "md"
          ? "icon-md"
          : "icon-sm";
  const finalClass = clsx(
    "inline-flex items-center justify-center leading-none",
    sizeClass,
    styles.icon,
    className,
  );
  return <span className={finalClass}>{children}</span>;
}
