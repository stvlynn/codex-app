// Restored from ref/webview/assets/progress-step-row-CUPOU6py.js
// ProgressStepRow chunk restored from the Codex webview bundle.

import type { ReactNode } from "react";
import clsx from "clsx";
import { s as FormattedMessage } from "../boundaries/lib-b-w-t6-a3-q0";
import { Spinner } from "./spinner-dh-bmwxtt";
import { CheckCircleIcon } from "../../icons/check-circle-icon.tsx";
import { XCircleIcon } from "../../icons/x-circle-icon.tsx";
import { UnselectedCircleIcon } from "../../icons/unselected-circle-icon.tsx";
export type ProgressStepStatus = "running" | "done" | "failed" | "pending";
export interface ProgressStepRowProps {
  children?: ReactNode;
  compact?: boolean;
  status: ProgressStepStatus;
}
export interface ProgressStepIconProps {
  status: ProgressStepStatus;
}
export interface ProgressStepLabelProps {
  status: ProgressStepStatus;
}
export function ProgressStepRow({
  children,
  compact = false,
  status,
}: ProgressStepRowProps): JSX.Element {
  const gapClass = compact ? "gap-2" : "gap-3";
  const rowClass = clsx("flex items-center", gapClass);
  const textClass = clsx(
    compact
      ? "text-size-chat text-token-conversation-summary-leading"
      : "text-base leading-6 tracking-[-0.13px]",
    !compact && {
      "font-medium text-token-foreground": status === "running",
      "text-token-foreground": status === "done",
      "text-token-editor-error-foreground": status === "failed",
      "text-token-description-foreground": status === "pending",
    },
  );
  return (
    <div className={rowClass}>
      <ProgressStepIcon status={status} />
      <div className={textClass}>
        <span className="sr-only">
          <ProgressStepLabel status={status} />
        </span>
        {children}
      </div>
    </div>
  );
}
export function ProgressStepIcon({
  status,
}: ProgressStepIconProps): JSX.Element {
  let icon: JSX.Element | null = null;
  switch (status) {
    case "running":
      icon = <Spinner className="icon-xs" />;
      break;
    case "done":
      icon = <CheckCircleIcon className="icon-xs" />;
      break;
    case "failed":
      icon = (
        <XCircleIcon className="icon-xs text-token-editor-error-foreground" />
      );
      break;
    case "pending":
      icon = <UnselectedCircleIcon className="icon-xs" />;
      break;
  }
  return (
    <span
      aria-hidden={true}
      className="flex h-4 w-4 shrink-0 items-center justify-center text-token-text-secondary"
    >
      {icon}
    </span>
  );
}
export function ProgressStepLabel({
  status,
}: ProgressStepLabelProps): JSX.Element {
  switch (status) {
    case "running":
      return (
        <FormattedMessage
          id="progressStep.status.running"
          defaultMessage="In progress:"
          description="Screen reader status for a progress step that is currently running"
        />
      );
    case "done":
      return (
        <FormattedMessage
          id="progressStep.status.done"
          defaultMessage="Completed:"
          description="Screen reader status for a completed progress step"
        />
      );
    case "failed":
      return (
        <FormattedMessage
          id="progressStep.status.failed"
          defaultMessage="Failed:"
          description="Screen reader status for a failed progress step"
        />
      );
    case "pending":
      return (
        <FormattedMessage
          id="progressStep.status.pending"
          defaultMessage="Pending:"
          description="Screen reader status for a progress step that has not started"
        />
      );
  }
}
