// Restored from ref/webview/assets/control-group-D6VRtZJR.js
// ControlGroup component for grouping related controls with consistent spacing.

import clsx from "clsx";
export interface ControlGroupProps {
  children?: React.ReactNode;
  className?: string;
}
export function ControlGroup(props: ControlGroupProps): JSX.Element {
  const { children, className } = props;
  const classNames = clsx("flex items-center gap-2", className);
  return <div className={classNames}>{children}</div>;
}
