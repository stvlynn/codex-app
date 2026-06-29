// Restored from ref/webview/assets/app-server-connection-state-DiMba98f.js

import clsx from "clsx";
import type { MouseEvent } from "react";
import { useIntl } from "react-intl";
import { t as Tooltip } from "../../ui/tooltip-b";
import { AlertIcon } from "../../icons/alert-icon";
import { Spinner } from "../../ui/spinner-dh-bmwxtt";
import { useNavigate } from "../../utils/chunk-lfpyn7-ly";
import { useAppServerConnectionState } from "../../hooks/use-app-server-connection-state";
import { getAppServerConnectionStatusInfo } from "./app-server-connection-error";
import type { AppServerConnectionStatusBadgeProps } from "./types";
const STATUS_ICONS = {
  connecting: <Spinner />,
  restarting: <Spinner />,
  connected: (
    <span
      aria-hidden={true}
      className="block size-2 rounded-full bg-green-500"
    />
  ),
  disconnected: (
    <span
      aria-hidden={true}
      className="block size-2 rounded-full bg-gray-400"
    />
  ),
  error: <AlertIcon />,
};
const STATUS_STYLES = {
  connecting: {
    dotClassName: "text-token-description-foreground",
    iconClassName: "motion-safe:animate-spin",
  },
  restarting: {
    dotClassName: "text-token-charts-blue",
    iconClassName: "motion-safe:animate-spin text-token-charts-blue",
  },
  connected: {
    dotClassName: "text-token-charts-green",
  },
  disconnected: {
    dotClassName: "text-token-description-foreground",
  },
  error: {
    dotClassName: "text-token-charts-red",
    iconClassName: "text-token-charts-red",
  },
};
export function AppServerConnectionStatusBadge({
  hostId,
  onLoginRequiredClick,
}: AppServerConnectionStatusBadgeProps): JSX.Element | null {
  const intl = useIntl();
  const navigate = useNavigate();
  const { error, state } = useAppServerConnectionState(hostId);
  if (state == null) return null;
  const canOpenSettings =
    error?.code === "update-required" ||
    error?.code === "restart-required" ||
    (error?.code === "login-required" && onLoginRequiredClick == null);
  const canLogin =
    error?.code === "login-required" && onLoginRequiredClick != null;
  const { label, message } = getAppServerConnectionStatusInfo(intl, {
    canLogin,
    error,
    state,
    surface: "connection-status-badge",
  });
  const handleLoginClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onLoginRequiredClick?.();
  };
  const handleSettingsClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/settings/connections");
  };
  const statusStyle = STATUS_STYLES[state];
  const iconWrapperClassName = clsx(
    "icon-2xs inline-flex shrink-0 items-center justify-center",
    statusStyle.iconClassName,
  );
  const icon = (
    <span className={iconWrapperClassName}>{STATUS_ICONS[state]}</span>
  );
  if (canOpenSettings || canLogin) {
    const dotClassName = clsx(
      "no-drag icon-2xs inline-flex shrink-0 cursor-interaction items-center justify-center self-center overflow-hidden rounded-full border-0 bg-transparent p-0 text-current",
      statusStyle.dotClassName,
    );
    const handleClick = canLogin ? handleLoginClick : handleSettingsClick;
    const trigger = (
      <button
        type="button"
        className={dotClassName}
        aria-label={label}
        onClick={handleClick}
      >
        {icon}
      </button>
    );
    return <Tooltip tooltipContent={message}>{trigger}</Tooltip>;
  }
  const dotClassName = clsx(
    "no-drag icon-2xs inline-flex shrink-0 items-center justify-center self-center overflow-hidden rounded-full",
    statusStyle.dotClassName,
  );
  const statusIndicator = (
    <span className={dotClassName} aria-label={label} role="img">
      {icon}
    </span>
  );
  return <Tooltip tooltipContent={message}>{statusIndicator}</Tooltip>;
}
