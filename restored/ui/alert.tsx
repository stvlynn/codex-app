// Restored from ref/webview/assets/alert-CuUy_SXy.js

import React from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { XIcon } from "../icons/x-icon";
export type AlertLevel = "info" | "success" | "warning" | "danger";
export interface AlertProps {
  className?: string;
  level?: AlertLevel;
  fullWidth?: boolean;
  children?: React.ReactNode;
  icon?: React.ComponentType<{
    className?: string;
  }>;
  onRemove?: () => void;
  testId?: string;
}
export function Alert({
  className,
  level = "info",
  fullWidth,
  children,
  icon: Icon,
  onRemove,
  testId,
}: AlertProps): JSX.Element {
  const intl = useIntl();
  const isInfo = level === "info";
  const isSuccess = level === "success";
  const isWarning = level === "warning";
  const isDanger = level === "danger";
  const rootClassName = clsx(
    "alert-root inline-flex flex-row items-start gap-1.5 rounded-2xl px-2 py-2 text-base leading-[1.4] pointer-events-auto box-shadow-lg border text-token-foreground",
    {
      flex: fullWidth,
      "border-token-border bg-token-dropdown-background": isInfo,
      "border-token-border bg-token-input-validation-info-background":
        isSuccess,
      "border-token-input-validation-warning-border bg-token-input-validation-warning-background":
        isWarning,
      "border-token-input-validation-error-border bg-token-input-validation-error-background":
        isDanger,
    },
    className,
  );
  const iconElement = Icon ? (
    <div className="shrink-0 grow-0">
      <Icon className="icon-sm" />
    </div>
  ) : null;
  const contentElement =
    typeof children === "string" ? (
      <div className="font-medium">{children}</div>
    ) : (
      children
    );
  const bodyElement = (
    <div className="flex-1 justify-center gap-2">{contentElement}</div>
  );
  const closeButton = onRemove ? (
    <button
      type="button"
      onClick={onRemove}
      aria-label={intl.formatMessage({
        id: "codex.alert.closeAriaLabel",
        defaultMessage: "Close",
        description:
          "Aria label for the close button on an alert/toast component",
      })}
      className="mt-0.5 flex shrink-0 grow-0 cursor-interaction rounded-full opacity-50 hover:bg-token-button-secondary-hover-background/5 hover:opacity-80"
    >
      <XIcon className="icon-xs" />
    </button>
  ) : null;
  return (
    <div className={rootClassName} role="alert" data-testid={testId}>
      {iconElement}
      {bodyElement}
      {closeButton}
    </div>
  );
}
