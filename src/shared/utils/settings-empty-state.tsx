// Restored from ref/webview/assets/settings-empty-state-BJurZrU4.js
// settings-empty-state-BJurZrU4 chunk restored from the Codex webview bundle.
import { useMemoCache as useReactMemoCache } from "react";
import { clsx } from "clsx";
export interface SettingsEmptyStateProps {
  children?: React.ReactNode;
  className?: string;
}
export function SettingsEmptyState(
  props: SettingsEmptyStateProps,
): JSX.Element {
  const { children, className } = props;
  const t = useReactMemoCache(5);
  let classNameResult: string;
  if (t[0] === className) {
    classNameResult = t[1];
  } else {
    classNameResult = clsx(
      "flex min-h-[62px] items-center justify-center px-4 text-center text-sm text-token-text-secondary",
      className,
    );
    t[0] = className;
    t[1] = classNameResult;
  }
  let result: JSX.Element;
  if (t[2] !== children || t[3] !== classNameResult) {
    result = <div className={classNameResult}>{children}</div>;
    t[2] = children;
    t[3] = classNameResult;
    t[4] = result;
  } else {
    result = t[4];
  }
  return result;
}
