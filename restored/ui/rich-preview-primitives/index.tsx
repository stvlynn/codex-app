// Restored from ref/webview/assets/rich-preview-primitives-C3E5AsLr.js
// RichPreviewPrimitives chunk restored from the Codex webview bundle.

import type { ReactNode } from "react";
import clsx from "clsx";
import { s as FormattedMessage } from "../../boundaries/lib-b-w-t6-a3-q0";
import { Spinner } from "../spinner-dh-bmwxtt";
export interface RichPreviewLoadingProps {
  className?: string;
}
export function RichPreviewLoading({
  className,
}: RichPreviewLoadingProps): JSX.Element {
  const classNames = clsx(
    "text-token-text-secondary flex items-center gap-2",
    className,
  );
  return (
    <div className={classNames}>
      <Spinner className="icon-xs text-token-input-placeholder-foreground" />
      <FormattedMessage
        id="codex.diffView.richPreviewLoading"
        defaultMessage="Loading preview…"
        description="Loading label while rich preview renders in the diff view"
      />
    </div>
  );
}
export interface RichPreviewCaptionProps {
  className?: string;
  children?: ReactNode;
}
export function RichPreviewCaption({
  className,
  children,
}: RichPreviewCaptionProps): JSX.Element {
  const classNames = clsx("text-token-text-secondary text-xs", className);
  return <span className={classNames}>{children}</span>;
}
export interface RichPreviewContentProps {
  children?: ReactNode;
}
export function RichPreviewContent({
  children,
}: RichPreviewContentProps): JSX.Element {
  return (
    <div className="flex min-h-40 flex-col">
      <div className="flex flex-1 items-center justify-center overflow-auto p-3 text-sm">
        {children}
      </div>
    </div>
  );
}
