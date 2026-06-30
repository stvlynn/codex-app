// Restored from ref/webview/assets/compound-button-CnDUF4co.js
// compound-button-CnDUF4co chunk restored from the Codex webview bundle.
import React from "react";
import clsx from "clsx";
import { Button, buttonRadiusMap } from "ui/button";
import { Tooltip } from "ui/tooltip-b";
import { ChevronIcon } from "icons/chevron-icon";
import { Dropdown } from "ui/dropdown-ctb-ro-adh";
interface CompoundButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  color?:
    | "primary"
    | "secondary"
    | "ghost"
    | "ghostMuted"
    | "outline"
    | "danger";
  size?:
    | "default"
    | "icon"
    | "toolbar"
    | "composerSm"
    | "composer"
    | "composerLg";
  disabled?: boolean;
  primaryDisabled?: boolean;
  dropdownDisabled?: boolean;
  loading?: boolean;
  className?: string;
  primaryClassName?: string;
  dropdownButtonClassName?: string;
  secondaryAriaLabel?: string;
  secondaryIcon?: React.ComponentType<{
    className?: string;
  }>;
  type?: "button" | "submit" | "reset";
  dropdownContent?: React.ReactNode;
  dropdownAlign?: "start" | "center" | "end";
  dropdownDir?: "ltr" | "rtl";
  dropdownSide?: "top" | "right" | "bottom" | "left";
  dropdownSurface?: "menu" | "popover" | "dialog";
  dropdownContentMaxHeight?: number;
  dropdownContentWidth?: number;
  dropdownContentLayout?: "menu" | "custom";
  dropdownContentClassName?: string;
  primaryAriaLabel?:
    | string
    | {
        id: string;
        defaultMessage: string;
        description?: string;
      };
  dropdownOpen?: boolean;
  onDropdownOpenChange?: (open: boolean) => void;
  tooltipContent?: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipAlign?: "start" | "center" | "end";
  tooltipSideOffset?: number;
  tooltipDelayOpen?: number;
  secondaryTooltipContent?: React.ReactNode;
  secondaryTooltipDisabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  [key: string]: unknown;
}
export function CompoundButton({
  children,
  onClick,
  color = "primary",
  size = "default",
  disabled = false,
  primaryDisabled,
  dropdownDisabled,
  loading = false,
  className,
  primaryClassName,
  dropdownButtonClassName,
  secondaryAriaLabel,
  secondaryIcon,
  type,
  dropdownContent,
  dropdownAlign = "start",
  dropdownDir,
  dropdownSide = "bottom",
  dropdownSurface = "menu",
  dropdownContentMaxHeight,
  dropdownContentWidth,
  dropdownContentLayout = "menu",
  dropdownContentClassName,
  primaryAriaLabel,
  dropdownOpen,
  onDropdownOpenChange,
  tooltipContent,
  tooltipSide,
  tooltipAlign,
  tooltipSideOffset,
  tooltipDelayOpen,
  secondaryTooltipContent,
  secondaryTooltipDisabled,
  ref,
  ...rest
}: CompoundButtonProps) {
  const SecondaryIcon =
    secondaryIcon === undefined ? ChevronIcon : secondaryIcon;
  const intl = useIntl();
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isDisabled = disabled || loading;
  const isPrimaryDisabled = isDisabled || primaryDisabled === true;
  const isDropdownDisabled = dropdownDisabled ?? isDisabled;
  const bothDisabled = isPrimaryDisabled && isDropdownDisabled;
  const isControlled = dropdownOpen !== undefined;
  const isOpen = isControlled ? dropdownOpen : internalOpen;
  const isOutlinePartiallyDisabled =
    color === "outline" && isPrimaryDisabled && !isDropdownDisabled;
  const defaultSecondaryAriaLabel =
    secondaryAriaLabel ??
    intl.formatMessage({
      id: "compoundButton.secondaryAction",
      defaultMessage: "Secondary action",
      description: "Aria label for the secondary target on the compound button",
    });
  let resolvedPrimaryAriaLabel: string | undefined;
  if (typeof primaryAriaLabel === "string") {
    resolvedPrimaryAriaLabel = primaryAriaLabel;
  } else if (primaryAriaLabel != null) {
    resolvedPrimaryAriaLabel = intl.formatMessage(primaryAriaLabel);
  }
  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onDropdownOpenChange?.(open);
  };
  const primaryOpacityClass =
    color === "outline" && isPrimaryDisabled && "disabled:opacity-100";
  const primaryChildOpacityClass =
    isOutlinePartiallyDisabled && "disabled:[&>*]:opacity-40";
  const primaryClass = clsx(
    "rounded-r-none border-r-0 pr-1",
    primaryOpacityClass,
    primaryChildOpacityClass,
    primaryClassName,
  );
  const handlePrimaryClick = (event: React.MouseEvent) => {
    if (!isPrimaryDisabled) {
      if (onClick) {
        onClick(event);
        return;
      }
      handleOpenChange(!isOpen);
    }
  };
  const primaryChildren =
    isOutlinePartiallyDisabled &&
    (typeof children === "string" || typeof children === "number") ? (
      <span>{children}</span>
    ) : (
      children
    );
  const primaryButton = (
    <Button
      color={color}
      size={size}
      disabled={isPrimaryDisabled}
      loading={loading}
      className={primaryClass}
      aria-label={resolvedPrimaryAriaLabel}
      onClick={handlePrimaryClick}
      type={type}
    >
      {primaryChildren}
    </Button>
  );
  const dropdownOpacityClass =
    color === "outline" && isDropdownDisabled && "disabled:opacity-100";
  const dropdownClass = clsx(
    "gap-0 rounded-l-none border-l-0 pl-0.5 pr-1.5",
    dropdownOpacityClass,
    dropdownButtonClassName,
  );
  const dropdownIconOpacityClass =
    color === "outline" && isDropdownDisabled && !isPrimaryDisabled
      ? "opacity-20"
      : "opacity-50";
  const dropdownIconClass = clsx("icon-2xs", dropdownIconOpacityClass);
  const dropdownIcon = <SecondaryIcon className={dropdownIconClass} />;
  const dropdownButton = (
    <Button
      aria-label={defaultSecondaryAriaLabel}
      color={color}
      size={size}
      disabled={isDropdownDisabled}
      className={dropdownClass}
      onMouseDown={preventDefault}
      type="button"
    >
      {dropdownIcon}
    </Button>
  );
  const radiusClass = buttonRadiusMap[size];
  const bothDisabledOpacityClass =
    color === "outline" && bothDisabled && "opacity-40";
  const wrapperClass = clsx(
    "inline-flex self-start items-stretch overflow-hidden",
    radiusClass,
    bothDisabledOpacityClass,
    className,
  );
  const primaryWithTooltip =
    tooltipContent == null ? (
      primaryButton
    ) : (
      <Tooltip
        tooltipContent={tooltipContent}
        side={tooltipSide}
        align={tooltipAlign}
        sideOffset={tooltipSideOffset}
        delayOpen={tooltipDelayOpen}
      >
        <span className="inline-flex min-w-0">{primaryButton}</span>
      </Tooltip>
    );
  const isDropdownOpen = isDropdownDisabled ? false : isOpen;
  const handleDropdownToggle = (open: boolean) => {
    if (!isDropdownDisabled) {
      handleOpenChange(open);
    }
  };
  const dropdownWithTooltip =
    secondaryTooltipContent == null || secondaryTooltipDisabled === true ? (
      dropdownButton
    ) : (
      <Tooltip
        tooltipContent={secondaryTooltipContent}
        delayOpen={tooltipDelayOpen}
      >
        <span className="inline-flex">{dropdownButton}</span>
      </Tooltip>
    );
  const dropdownBody =
    dropdownContentLayout === "menu" ? (
      <div className="flex min-w-[160px] flex-col gap-0.5">
        {dropdownContent}
      </div>
    ) : (
      dropdownContent
    );
  return (
    <div ref={ref} className={wrapperClass} {...rest}>
      {primaryWithTooltip}
      <Dropdown
        open={isDropdownOpen}
        onOpenChange={handleDropdownToggle}
        dir={dropdownDir}
        side={dropdownSide}
        align={dropdownAlign}
        surface={dropdownSurface}
        contentMaxHeight={dropdownContentMaxHeight}
        contentWidth={dropdownContentWidth}
        contentClassName={dropdownContentClassName}
        triggerButton={dropdownWithTooltip}
      >
        {dropdownBody}
      </Dropdown>
    </div>
  );
}
function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}
function useIntl() {
  // Placeholder for intl hook - in actual code this would come from react-intl
  return {
    formatMessage: (descriptor: {
      id: string;
      defaultMessage: string;
      description?: string;
    }) => descriptor.defaultMessage,
  };
}
