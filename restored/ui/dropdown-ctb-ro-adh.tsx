// Restored from ref/webview/assets/dropdown-CTBRoADH.js
// dropdown-CTBRoADH chunk restored from the Codex webview bundle.
import React from "react";
import type { ReactNode, ComponentPropsWithoutRef, Ref } from "react";
import clsx from "clsx";
import {
  a as DropdownMenuRoot,
  c as DropdownMenuSubContent,
  d as DropdownMenuRadioItem,
  i as DropdownMenuPortal,
  l as DropdownMenuSubTrigger,
  m as DropdownMenuSub,
  n as DropdownMenuArrow,
  o as DropdownMenuItem,
  p as DropdownMenuSeparator,
  r as DropdownMenuCheckboxItem,
  s as DropdownMenuItemIndicator,
  t as DropdownMenuTrigger,
  u as DropdownMenuRadioGroup,
} from "../../boundaries/dist-uq8yzy-fr";
import {
  d as DropdownMenuContent,
  i as DropdownMenuGroup,
  s as DropdownMenuLabel,
  t as DropdownMenuTriggerPrimitive,
  u as DropdownMenuPortalPrimitive,
} from "../../boundaries/react-modal-dist";
import { windowZoomContextN } from "../../app-shell/window-zoom-context";
import { ChevronRightIcon } from "../../icons/chevron-right-icon";
import { t as Tooltip } from "../../ui/tooltip-b";
import { tooltipDismissN } from "../../ui/tooltip-dismiss";

const styles = {
  content: "flex w-full items-center gap-1.5",
  contentWithIconAndSubText: "flex w-full items-center gap-3",
  icon: "shrink-0 opacity-75 group-focus:opacity-100 group-hover:opacity-100",
  itemBase:
    "text-token-foreground outline-hidden rounded-lg px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm",
  itemInteractive:
    "group hover:bg-token-list-hover-background focus:bg-token-list-hover-background cursor-interaction",
};

const sectionStyles = {
  sectionLabel:
    "px-[var(--padding-row-x)] py-1 text-sm text-token-description-foreground",
  messageBase: "px-[var(--padding-row-x)] text-sm",
};

const iconSizes = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon-md",
};

function getSurfaceClass(surface: string): string | undefined {
  if (surface === "panel") return "rounded-2xl p-4 shadow-2xl backdrop-blur-lg";
}

function getWidthClass(width: string): string | undefined {
  if (width === "icon") return "min-w-[120px]";
  if (width === "xs") return "min-w-[160px]";
  if (width === "sm") return "min-w-[180px]";
  if (width === "menuNarrow") return "w-52";
  if (width === "menu") return "min-w-[220px]";
  if (width === "menuFixed") return "w-[220px]";
  if (width === "menuBounded") return "min-w-[200px] max-w-[320px]";
  if (width === "menuWide") return "w-[240px]";
  if (width === "sidebar") return "min-w-[172px] max-w-[240px]";
  if (width === "workspace") return "min-w-[260px]";
  if (width === "panel") return "w-[280px]";
  if (width === "panelWide") return "w-[360px]";
}

function getMaxHeightClass(maxHeight: string): string | undefined {
  if (maxHeight === "list") return "max-h-[250px]";
  if (maxHeight === "tall") return "max-h-[350px]";
}

export function SearchIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.33057 1.98535C10.2484 1.98535 12.6136 4.3508 12.6138 7.26855C12.6138 8.58031 12.1346 9.77942 11.3433 10.7031L13.9897 13.3496C14.1655 13.5253 14.1655 13.8106 13.9897 13.9863C13.814 14.1621 13.5288 14.1621 13.353 13.9863L10.7017 11.335C9.78678 12.0942 8.61243 12.5518 7.33057 12.5518C4.41281 12.5516 2.04736 10.1864 2.04736 7.26855C2.04754 4.35091 4.41292 1.98553 7.33057 1.98535ZM7.33057 2.88574C4.90998 2.88592 2.94793 4.84796 2.94775 7.26855C2.94775 9.68929 4.90987 11.6522 7.33057 11.6523C9.75141 11.6523 11.7144 9.6894 11.7144 7.26855C11.7142 4.84786 9.75131 2.88574 7.33057 2.88574Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface DropdownTriggerProps extends ComponentPropsWithoutRef<"button"> {
  ref?: Ref<HTMLButtonElement>;
  disabled?: boolean;
}

export function DropdownTrigger({ ref, disabled, className, ...rest }: DropdownTriggerProps) {
  const disabledClass = disabled ? "cursor-default opacity-25" : "cursor-interaction";
  const finalClass = clsx("outline-hidden", disabledClass, className);
  return (
    <DropdownMenuTriggerPrimitive
      ref={ref}
      aria-disabled={disabled || undefined}
      className={finalClass}
      {...rest}
    />
  );
}

interface DropdownContentProps {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  surface?: string;
  ref?: Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function DropdownContent({
  children,
  className,
  align = "start",
  sideOffset = 1,
  surface = "menu",
  ref,
  style,
  ...rest
}: DropdownContentProps) {
  const surfaceClass = getSurfaceClass(surface);
  const finalClass = clsx(
    "no-drag bg-token-dropdown-background/90 text-token-foreground ring-token-border z-50 m-px flex select-none flex-col overflow-y-auto rounded-xl ring-[0.5px] px-1 py-1 shadow-xl-spread backdrop-blur-sm",
    surfaceClass,
    className,
  );
  const finalStyle = {
    maxWidth: "min(var(--radix-dropdown-menu-content-available-width), calc(100vw - 16px))",
    maxHeight: "min(var(--radix-dropdown-menu-content-available-height), calc(100vh - 16px))",
    ...style,
  };
  return (
    <DropdownMenuContent
      ref={ref}
      className={finalClass}
      align={align}
      collisionPadding={6}
      sideOffset={sideOffset}
      style={finalStyle}
      {...rest}
    >
      {children}
    </DropdownMenuContent>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  LeftIcon?: React.ComponentType<{ className?: string }>;
  keyboardShortcut?: string;
  leftIconClassName?: string;
  RightIcon?: React.ComponentType<{ className?: string }>;
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
    (RightIcon ? <RightIcon className={clsx(rightIconClassName, styles.icon)} /> : null);

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
          className={clsx("flex-1 min-w-0", allowWrap ? "whitespace-normal" : "truncate")}
        >
          {mainContent}
        </span>
        {rightContent}
      </div>
    ) : (
      <div className={leftIconEl == null ? styles.content : styles.contentWithIconAndSubText}>
        {leftIconEl}
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            data-tooltip-overflow-target={
              tooltipOpenWhen === "trigger-overflows" ? "" : undefined
            }
            className={clsx("min-w-0", allowWrap ? "whitespace-normal" : "truncate")}
          >
            {mainContent}
          </span>
          <span className={clsx("min-w-0", subTextAllowWrap ? "whitespace-normal" : "truncate")}>
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
          <div className={clsx("max-w-64 text-pretty", tooltipTextClassName)}>{tooltipText}</div>
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
  const sizeClass = size === undefined ? "icon-sm" : size === "xs" ? "icon-xs" : size === "md" ? "icon-md" : "icon-sm";
  const finalClass = clsx(
    "inline-flex items-center justify-center leading-none",
    sizeClass,
    styles.icon,
    className,
  );
  return <span className={finalClass}>{children}</span>;
}

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function Input({ onKeyDown, className, ...rest }: InputProps) {
  const finalClass = clsx(
    "w-full min-w-0 rounded-sm border border-none px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm !outline-none",
    className,
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      event.currentTarget.select();
      return;
    }
    onKeyDown?.(event);
  };
  return <input className={finalClass} autoFocus onKeyDown={handleKeyDown} {...rest} />;
}

interface SearchInputProps extends ComponentPropsWithoutRef<"input"> {
  className?: string;
  inputClassName?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  trailingContent?: ReactNode;
}

export function SearchInput({
  className,
  inputClassName,
  onKeyDown,
  trailingContent,
  ...rest
}: SearchInputProps) {
  const wrapperClass = clsx(
    styles.content,
    "px-[var(--padding-row-x)] py-[var(--padding-row-y)]",
    className,
  );
  const searchIcon = <SearchIcon className="icon-2xs shrink-0 text-token-text-tertiary" />;
  const inputClass = clsx(
    "!w-auto flex-1 appearance-none !rounded-none !border-none bg-transparent !px-0 !py-0 text-token-foreground placeholder:text-token-input-placeholder-foreground",
    inputClassName,
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (
      !event.defaultPrevented &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      const direction = event.key === "ArrowDown" ? "next" : "previous";
      if (focusNextMenuItem(event.currentTarget, direction)) {
        event.preventDefault();
      }
    }
  };
  const trailing = trailingContent ? <div className="shrink-0">{trailingContent}</div> : null;

  return (
    <div className={wrapperClass}>
      {searchIcon}
      <Input className={inputClass} onKeyDown={handleKeyDown} {...rest} />
      {trailing}
    </div>
  );
}

function focusNextMenuItem(
  element: HTMLElement,
  direction: "next" | "previous",
): boolean {
  const menu = element.closest('[role="menu"]');
  if (menu == null) return false;
  const items = Array.from(
    menu.querySelectorAll('input, [role="menuitem"]'),
  );
  const nextItems = items
    .slice(items.indexOf(element) + 1)
    .filter(
      (item) =>
        item.getAttribute("role") === "menuitem" &&
        !item.hasAttribute("data-disabled") &&
        item.getAttribute("aria-disabled") !== "true",
    );
  const target =
    direction === "next" ? nextItems[0] : nextItems[nextItems.length - 1];
  target?.focus();
  return target != null;
}

interface SeparatorProps {
  className?: string;
  paddingClassName?: string;
}

export function Separator({ className, paddingClassName = "py-1" }: SeparatorProps) {
  const finalClass = clsx("w-full px-[var(--padding-row-x)]", paddingClassName, className);
  return (
    <div className={finalClass}>
      <div className="h-[1px] w-full bg-token-menu-border" />
    </div>
  );
}

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  const finalClass = clsx(
    sectionStyles.sectionLabel,
    className,
  );
  return <div className={finalClass}>{children}</div>;
}

interface MessageProps {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "error";
  compact?: boolean;
  centered?: boolean;
}

export function Message({
  children,
  className,
  tone = "muted",
  compact = false,
  centered = false,
}: MessageProps) {
  const padding = compact ? "py-2" : "py-3";
  const colorClass =
    tone === "error" ? "text-token-error-foreground" : "text-token-description-foreground";
  const centerClass = centered && "self-center text-center";
  const finalClass = clsx(
    sectionStyles.messageBase,
    padding,
    colorClass,
    centerClass,
    className,
  );
  return <div className={finalClass}>{children}</div>;
}

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export function Title({ children, className }: TitleProps) {
  const finalClass = clsx(
    "text-token-description-foreground flex min-h-6 items-center truncate px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm leading-4",
    className,
  );
  return <div className={finalClass}>{children}</div>;
}

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  return <div className={className}>{children}</div>;
}

interface SubmenuItemProps {
  trigger: React.ReactElement<React.ComponentProps<typeof DropdownItem>>;
  children: ReactNode;
  isDefaultOpen?: boolean;
}

export function SubmenuItem({ trigger, children, isDefaultOpen = false }: SubmenuItemProps) {
  const isDisabled = trigger.props.disabled ?? false;
  const [isOpen, setIsOpen] = React.useState(isDisabled ? false : isDefaultOpen);
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
  const chevronClass = clsx(trigger.props.rightIconClassName ?? "icon-xs", styles.icon);
  const chevron = <ChevronRightIcon className={chevronClass} />;

  const clonedTrigger = React.cloneElement(trigger, {
    onSelect: handleSelect,
    rightIcon: (
      <span
        aria-hidden
        className="inline-flex items-center justify-center text-token-input-placeholder-foreground"
        style={{ transform: `rotate(${rotation}deg)` }}
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
  LeftIcon?: React.ComponentType<{ className?: string }>;
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

  const disabledClass = disabled ? "cursor-default opacity-50" : styles.itemInteractive;
  const triggerClass = clsx(
    styles.itemBase,
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
    <div className={styles.content}>
      {LeftIcon ? (
        <LeftIcon className={clsx(leftIconClassName ?? "icon-xs", styles.icon)} />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRightIcon
        className={clsx("icon-xs text-token-input-placeholder-foreground", styles.icon)}
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
    ? { maxHeight: "calc(100vh - 16px)" }
    : {
        maxWidth: "min(var(--radix-dropdown-menu-content-available-width), calc(100vw - 16px))",
        maxHeight: "min(var(--radix-dropdown-menu-content-available-height), calc(100vh - 16px))",
      };
  const finalStyle = {
    ...maxSize,
    zoom: alignToParentBottom ? undefined : zoom === 1 ? undefined : zoom,
  };

  const subContent = (
    <DropdownMenuSubContent
      className={clsx(contentClass, alignToParentBottom && "parent-bottom-aligned", contentClassName)}
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

interface DropdownProps {
  triggerButton: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: "ltr" | "rtl";
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onExitAnimationEnd?: () => void;
  contentClassName?: string;
  animateExit?: boolean;
  fadeExitAnimation?: boolean;
  surface?: string;
  contentWidth?: string;
  contentMaxHeight?: string;
  portalContainer?: HTMLElement | null;
}

export function Dropdown({
  triggerButton,
  disabled,
  children,
  open,
  onOpenChange,
  dir,
  side,
  align,
  sideOffset,
  alignOffset,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onExitAnimationEnd,
  contentClassName,
  animateExit = true,
  fadeExitAnimation = false,
  surface = "menu",
  contentWidth,
  contentMaxHeight,
  portalContainer,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const widthClass = getWidthClass(contentWidth ?? "");
  const heightClass = getMaxHeightClass(contentMaxHeight ?? "");
  const zoom = windowZoomContextN();

  const handleOpenChange = (value: boolean) => {
    value && tooltipDismissN();
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  const isOpen = open ?? internalOpen;

  const trigger = (
    <DropdownMenuTrigger asChild disabled={disabled}>
      {triggerButton}
    </DropdownMenuTrigger>
  );

  const content = !disabled ? (
    <DropdownMenuPortal container={portalContainer ?? undefined}>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        onCloseAutoFocus={onCloseAutoFocus}
        onEscapeKeyDown={onEscapeKeyDown}
        onAnimationEnd={(event: AnimationEvent) => {
          if (
            event.target === event.currentTarget &&
            event.currentTarget.dataset.state === "closed"
          ) {
            onExitAnimationEnd?.();
          }
        }}
        surface={surface}
        className={clsx(
          widthClass,
          heightClass,
          !animateExit && "no-exit-animation",
          fadeExitAnimation && "fade-exit-animation",
          contentClassName,
        )}
        style={{
          zoom:
            portalContainer == null && zoom !== 1 ? zoom : undefined,
        }}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenuPortal>
  ) : null;

  return (
    <DropdownMenuRoot dir={dir} modal={false} open={isOpen} onOpenChange={handleOpenChange}>
      {trigger}
      {content}
    </DropdownMenuRoot>
  );
}

export const DropdownComponents = {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  ItemIcon,
  Input,
  SearchInput,
  Separator,
  SectionLabel,
  Message,
  Title,
  SubmenuItem,
  FlyoutSubmenuItem,
  Section,
};
