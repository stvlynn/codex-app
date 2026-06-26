// Restored from ref/webview/assets/thread-resource-card-1r6t8CDV.js
import React from "react";
import clsx from "clsx";

function ChevronIcon({ className }: { className?: string }): JSX.Element {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface ThreadResourceCardProps {
  as?: "div" | "span";
  children?: React.ReactNode;
  className?: string;
}

export function ThreadResourceCard({
  as: Component = "div",
  children,
  className,
}: ThreadResourceCardProps): JSX.Element {
  const classes = clsx(
    "flex max-w-full flex-col overflow-hidden rounded-lg border border-token-border bg-token-dropdown-background/50 text-token-foreground shadow-sm extension:bg-token-input-background/50",
    className,
  );

  if (Component === "span") {
    return <span className={classes}>{children}</span>;
  }

  return <div className={classes}>{children}</div>;
}

interface ThreadResourceCardItemProps {
  className?: string;
  icon?: React.ReactNode;
  padding?: "default" | "compact" | "extraCompact";
  reserveTrailingSpace?: boolean;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
  titleTooltip?: string;
  trailing?: React.ReactNode;
}

const PADDING_CONFIG = {
  default: { inner: "px-4 py-3", outer: "py-3 pr-10 pl-4" },
  compact: { inner: "p-2", outer: "py-2 pr-8 pl-2" },
  extraCompact: { inner: "p-1.5", outer: "py-1.5 pr-10 pl-1.5" },
};

export function ThreadResourceCardItem({
  className,
  icon,
  padding = "default",
  reserveTrailingSpace,
  subtitle,
  title,
  titleTooltip,
  trailing,
}: ThreadResourceCardItemProps): JSX.Element {
  const paddingClasses = reserveTrailingSpace
    ? PADDING_CONFIG[padding].outer
    : PADDING_CONFIG[padding].inner;

  const itemClasses = clsx("flex min-w-0 items-center gap-2.5 text-left", paddingClasses, className);

  return (
    <span className={itemClasses}>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className="text-size-chat truncate font-medium text-token-foreground"
          title={titleTooltip}
        >
          {title}
        </span>
        {subtitle != null && (
          <span className="text-size-chat-sm truncate text-token-text-secondary">
            {subtitle}
          </span>
        )}
      </span>
      {trailing}
    </span>
  );
}

interface ThreadResourceCardTriggerProps {
  label?: React.ReactNode;
  matchDropdownWidth?: boolean;
  matchDropdownWidthLabel?: React.ReactNode;
  size?: "default" | "medium" | "toolbar";
  showChevron?: boolean;
}

const SIZE_CLASSES = {
  default: "text-size-chat-sm",
  medium: "text-base",
  toolbar: "h-token-button-composer text-base leading-[18px]",
};

const TRIGGER_PADDING = {
  default: "px-2 py-1",
  medium: "px-4 py-1.5",
  toolbar: "px-2 py-0",
};

export function ThreadResourceCardTrigger({
  label,
  matchDropdownWidth = false,
  matchDropdownWidthLabel,
  size = "default",
  showChevron = false,
}: ThreadResourceCardTriggerProps): JSX.Element {
  const sizeClass = SIZE_CLASSES[size];

  const triggerClasses = clsx(
    "flex shrink-0 items-center overflow-hidden rounded-lg border border-token-border text-token-foreground",
    sizeClass,
  );

  const labelContent = matchDropdownWidth ? (
    <span className={clsx("grid", TRIGGER_PADDING[size])}>
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 flex items-center gap-1"
      >
        {matchDropdownWidthLabel ?? label}
        <ChevronIcon className="icon-2xs shrink-0" />
      </span>
      <span className="col-start-1 row-start-1 flex items-center justify-center">
        {label}
      </span>
    </span>
  ) : (
    <span className={clsx("flex items-center font-medium", TRIGGER_PADDING[size])}>
      {label}
    </span>
  );

  const chevron = showChevron ? (
    <span className="flex self-stretch border-l border-token-border px-1.5">
      <ChevronIcon className="icon-2xs self-center text-token-text-tertiary" />
    </span>
  ) : null;

  return (
    <span className={triggerClasses}>
      {labelContent}
      {chevron}
    </span>
  );
}

interface ThreadResourceCardExpandButtonProps {
  children?: React.ReactNode;
  isExpanded?: boolean;
  onClick?: () => void;
}

export function ThreadResourceCardExpandButton({
  children,
  isExpanded,
  onClick,
}: ThreadResourceCardExpandButtonProps): JSX.Element {
  const chevronClass = clsx("icon-xs", isExpanded && "rotate-180");

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      className="text-size-chat flex h-10 cursor-interaction items-center justify-center gap-1 text-token-text-tertiary hover:bg-token-list-hover-background/30 focus-visible:ring-1 focus-visible:ring-token-focus-border focus-visible:outline-none focus-visible:ring-inset"
      onClick={onClick}
    >
      {children}
      <ChevronIcon className={chevronClass} />
    </button>
  );
}

export {
  ThreadResourceCardItem,
  ThreadResourceCardExpandButton,
  ThreadResourceCardTrigger,
  ThreadResourceCard,
};
