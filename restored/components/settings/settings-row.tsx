// Restored from ref/webview/assets/settings-row-FLzCWFCC.js
import React from "react";
import clsx from "clsx";

interface SettingsRowProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  control?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "nested";
}

export function SettingsRow({
  label,
  description,
  control,
  icon,
  className,
  id,
  variant = "default",
}: SettingsRowProps): JSX.Element {
  const hasContent = label != null || description != null || icon != null;

  const rowClasses = clsx(
    variant === "nested"
      ? "flex min-h-10 items-center justify-between gap-3 px-4 py-0.5 max-sm:min-h-0 max-sm:flex-col max-sm:items-stretch"
      : "flex items-center justify-between gap-4 p-3",
    className,
  );

  return (
    <div id={id} className={rowClasses}>
      {hasContent && (
        <div className="flex min-w-0 items-center gap-3">
          {icon != null && <span className="shrink-0">{icon}</span>}
          <div className="flex min-w-0 flex-col gap-1">
            {label != null && (
              <div className="min-w-0 text-sm text-token-text-primary">
                {label}
              </div>
            )}
            {description != null && (
              <div
                className={clsx(
                  "text-token-text-secondary min-w-0",
                  variant === "nested" ? "text-xs" : "text-sm",
                )}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={
          variant === "nested"
            ? "flex min-w-0 flex-1 items-center justify-end max-sm:justify-stretch"
            : "flex shrink-0 items-center gap-2"
        }
      >
        {control}
      </div>
    </div>
  );
}

interface SettingsRowButtonProps {
  actions?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
}

export function SettingsRowButton({
  actions,
  ariaLabel,
  className,
  description,
  disabled = false,
  icon,
  label,
  onClick,
}: SettingsRowButtonProps): JSX.Element {
  const hoverClass =
    !disabled &&
    "hover:bg-token-list-hover-background focus-within:bg-token-list-hover-background";

  const containerClasses = clsx("group flex w-full items-center", hoverClass);
  const buttonClasses = clsx(
    "focus-visible:outline-token-focus flex min-w-0 flex-1 cursor-interaction items-center gap-4 p-3 text-left disabled:cursor-default disabled:opacity-60",
    className,
  );

  return (
    <div className={containerClasses}>
      <button
        aria-label={ariaLabel}
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon != null && <span className="shrink-0">{icon}</span>}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="min-w-0 text-sm text-token-text-primary">
              {label}
            </div>
            {description != null && (
              <div className="min-w-0 text-sm text-token-text-secondary">
                {description}
              </div>
            )}
          </div>
        </div>
      </button>
      {!disabled && actions != null && (
        <div className="flex shrink-0 items-center gap-1 pr-3">{actions}</div>
      )}
    </div>
  );
}

interface SettingsRowValueProps {
  children?: React.ReactNode;
  compactLabelInset?: boolean;
  label: React.ReactNode;
  valueAlignment?: "start" | "end";
  variant?: "default" | "compact";
}

export function SettingsRowValue({
  children,
  compactLabelInset = true,
  label,
  valueAlignment = "start",
  variant = "default",
}: SettingsRowValueProps): JSX.Element {
  const containerClasses = clsx(
    "grid items-center",
    variant === "compact"
      ? "h-[1.875rem] w-full grid-cols-[auto_minmax(0,1fr)] gap-x-6 overflow-x-hidden rounded-lg text-base leading-[18px] text-token-foreground electron:opacity-75"
      : "min-h-14 gap-1 px-4 py-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6",
  );

  const labelClasses = clsx(
    "min-w-0",
    variant === "compact"
      ? clsx("flex items-center pr-2 text-left", compactLabelInset && "pl-1")
      : "text-sm text-token-text-secondary",
  );

  const valueClasses = clsx(
    "min-w-0",
    variant === "compact"
      ? "flex items-center justify-end justify-self-stretch overflow-hidden"
      : clsx(
          "break-words whitespace-normal text-sm text-token-text-primary",
          valueAlignment === "end" && "text-right",
        ),
  );

  return (
    <div className={containerClasses}>
      <div className={labelClasses}>{label}</div>
      <div className={valueClasses}>{children}</div>
    </div>
  );
}

export { SettingsRowValue, SettingsRow, SettingsRowButton };
