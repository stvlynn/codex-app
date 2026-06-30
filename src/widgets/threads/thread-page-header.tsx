// Restored from ref/webview/assets/thread-page-header-D_hZ50OA.js

import type { ReactNode } from "react";
import {
  CloudEnvIcon,
  LocalEnvIcon,
  RemoteEnvIcon,
  WorktreeEnvIcon,
} from "./thread-env-icon";
export interface ThreadPageHeaderProps {
  start?: ReactNode;
  startActions?: ReactNode;
  env?: "remote" | "worktree" | "cloud" | string;
  secondary?: ReactNode;
  trailing?: ReactNode;
  hostConfig?: {
    id: string;
  } | null;
}
export function ThreadPageHeader({
  start,
  startActions,
  env,
  secondary,
  trailing,
  hostConfig,
}: ThreadPageHeaderProps): JSX.Element {
  const envIcon =
    env === "remote" ? (
      hostConfig ? (
        <RemoteEnvIcon hostId={hostConfig.id} />
      ) : null
    ) : env === "worktree" ? (
      <WorktreeEnvIcon />
    ) : env === "cloud" ? (
      <CloudEnvIcon />
    ) : env ? (
      <LocalEnvIcon />
    ) : null;
  return (
    <div className="draggable grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 electron:h-toolbar extension:py-row-y">
      <div className="text-md flex min-w-0 items-center gap-2 truncate text-base electron:font-medium">
        {start ? (
          <div className="max-w-[320px] min-w-0 truncate">{start}</div>
        ) : null}
        {envIcon}
        {secondary ? (
          <div className="flex min-w-0 truncate leading-[18px] font-normal text-token-description-foreground">
            {secondary}
          </div>
        ) : null}
        {startActions}
      </div>
      <div className="flex items-center justify-end gap-1.5">{trailing}</div>
    </div>
  );
}
