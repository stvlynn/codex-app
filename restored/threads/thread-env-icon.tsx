// Restored from ref/webview/assets/thread-env-icon-DQJ4XJ-k.js
//
// Environment icons shown for a conversation thread (local, cloud, remote, worktree).

import clsx from "clsx";
import type { ReactNode } from "react";
import { s as FormattedMessage } from "../boundaries/intl-messageformat";
import { a as useHosts, n as useHostConfig } from "../boundaries/host-config";
import { t as Tooltip } from "../ui/tooltip-b";
import { RemoteHostGlobeIcon } from "../remote-connections/remote-host-globe-icon";
import { CloudIcon } from "../icons/cloud-icon";
import { MacbookIcon } from "../icons/macbook-icon";
import { WorktreeIcon } from "../icons/worktree-icon";
export interface RemoteEnvIconProps {
  className?: string;
  disableTooltip?: boolean;
  hostId: string;
}
export function RemoteEnvIcon({
  className,
  disableTooltip = false,
  hostId,
}: RemoteEnvIconProps): JSX.Element {
  const iconClassName = clsx("icon-2xs no-drag shrink-0", className);
  const hosts = useHosts();
  const hostConfig = useHostConfig(hostId);
  const hostIdsForColorAssignment = hosts.map(getHostId);
  const icon = (
    <span className="inline-flex shrink-0">
      <RemoteHostGlobeIcon
        className={iconClassName}
        hostId={hostId}
        hostIdsForColorAssignment={hostIdsForColorAssignment}
      />
    </span>
  );
  return maybeWrapWithTooltip({
    disableTooltip,
    icon,
    tooltipContent: hostConfig.display_name,
  });
}
export interface CombinedRemoteWorktreeEnvIconProps {
  className?: string;
  disableTooltip?: boolean;
  hostId: string;
}
export function CombinedRemoteWorktreeEnvIcon({
  className,
  disableTooltip = false,
  hostId,
}: CombinedRemoteWorktreeEnvIconProps): JSX.Element {
  const hostConfig = useHostConfig(hostId);
  const hosts = useHosts();
  const hostIdsForColorAssignment = hosts.map(getHostId);
  const remoteIconClassName = clsx("icon-2xs no-drag shrink-0", className);
  const remoteIcon = (
    <RemoteHostGlobeIcon
      className={remoteIconClassName}
      hostId={hostId}
      hostIdsForColorAssignment={hostIdsForColorAssignment}
    />
  );
  const worktreeIconClassName = clsx(
    "icon-2xs text-token-description-foreground no-drag shrink-0",
    className,
  );
  const worktreeIcon = <WorktreeIcon className={worktreeIconClassName} />;
  const icon = (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      {remoteIcon}
      {worktreeIcon}
    </span>
  );
  return maybeWrapWithTooltip({
    disableTooltip,
    icon,
    tooltipContent: hostConfig.display_name,
  });
}
export interface WorktreeEnvIconProps {
  className?: string;
  disableTooltip?: boolean;
}
export function WorktreeEnvIcon({
  className,
  disableTooltip = false,
}: WorktreeEnvIconProps): JSX.Element {
  const iconClassName = clsx(
    "icon-2xs text-token-description-foreground no-drag shrink-0",
    className,
  );
  const icon = (
    <span className="inline-flex shrink-0">
      <WorktreeIcon className={iconClassName} />
    </span>
  );
  const tooltipContent = (
    <FormattedMessage
      id="threadEnvIcon.worktreeTooltip"
      defaultMessage="This conversation is running in a local git worktree."
      description="Tooltip content for worktree environment icon"
    />
  );
  return maybeWrapWithTooltip({
    disableTooltip,
    icon,
    tooltipContent,
  });
}
export interface CloudEnvIconProps {
  className?: string;
  disableTooltip?: boolean;
}
export function CloudEnvIcon({
  className,
  disableTooltip = false,
}: CloudEnvIconProps): JSX.Element {
  const iconClassName = clsx(
    "icon-2xs translate-x-px text-token-description-foreground no-drag shrink-0",
    className,
  );
  const icon = (
    <span className="inline-flex shrink-0">
      <CloudIcon className={iconClassName} />
    </span>
  );
  const tooltipContent = (
    <FormattedMessage
      id="threadEnvIcon.cloudTooltip"
      defaultMessage="This conversation is running in Codex Cloud."
      description="Tooltip content for cloud environment icon"
    />
  );
  return maybeWrapWithTooltip({
    disableTooltip,
    icon,
    tooltipContent,
  });
}
export interface LocalEnvIconProps {
  className?: string;
  disableTooltip?: boolean;
}
export function LocalEnvIcon({
  className,
  disableTooltip = false,
}: LocalEnvIconProps): JSX.Element {
  const iconClassName = clsx(
    "icon-2xs text-token-description-foreground no-drag shrink-0",
    className,
  );
  const icon = (
    <span className="inline-flex shrink-0">
      <MacbookIcon className={iconClassName} />
    </span>
  );
  const tooltipContent = (
    <FormattedMessage
      id="threadEnvIcon.localTooltip"
      defaultMessage="This conversation is running locally."
      description="Tooltip content for local environment icon"
    />
  );
  return maybeWrapWithTooltip({
    disableTooltip,
    icon,
    tooltipContent,
  });
}
interface TooltipWrapperProps {
  disableTooltip: boolean;
  icon: ReactNode;
  tooltipContent: ReactNode;
}
function maybeWrapWithTooltip({
  disableTooltip,
  icon,
  tooltipContent,
}: TooltipWrapperProps): JSX.Element {
  if (disableTooltip) {
    return <>{icon}</>;
  }
  return <Tooltip tooltipContent={tooltipContent}>{icon}</Tooltip>;
}
function getHostId(host: { hostId: string }): string {
  return host.hostId;
}
