// Restored from ref/webview/assets/above-composer-panel-row-B4ykE4a7.js
// AboveComposerPanelRow chunk restored from the Codex webview bundle.
import * as React from "react";
import clsx from "clsx";
import { ComposerTopMenuChromePanel } from "../../widgets/composer/composer-top-menu-chrome.tsx";
import { St as isHostConfigAnnotationAttachment } from "../boundaries/host-config";
import {
  Jt as isZodAnnotationAttachmentA,
  R as isZodAnnotationAttachmentB,
} from "../boundaries/zod";
export interface AboveComposerPanelRowProps {
  children: React.ReactNode;
  className?: string;
  expandedTopTray?: boolean;
}
export interface AboveComposerPanelRowContentProps {
  children: React.ReactNode;
  className?: string;
}
export interface AboveComposerPanelRowHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
  title: React.ReactNode;
  titleClassName?: string;
  trailing?: React.ReactNode;
}
interface AboveComposerPanelRowContextValue {
  expandedTopTray: boolean;
}
const AboveComposerPanelRowContext =
  React.createContext<AboveComposerPanelRowContextValue>({
    expandedTopTray: false,
  });
export function AboveComposerPanelRow({
  children,
  className,
  expandedTopTray = false,
}: AboveComposerPanelRowProps) {
  const content = (
    <div className={clsx("order-2 flex min-w-0 flex-col", className)}>
      {children}
    </div>
  );
  const wrappedContent = expandedTopTray ? (
    <ComposerTopMenuChromePanel expandedTopTray inFlow>
      {content}
    </ComposerTopMenuChromePanel>
  ) : (
    content
  );
  return (
    <AboveComposerPanelRowContext.Provider
      value={{
        expandedTopTray,
      }}
    >
      {wrappedContent}
    </AboveComposerPanelRowContext.Provider>
  );
}
export function AboveComposerPanelRowContent({
  children,
  className,
}: AboveComposerPanelRowContentProps) {
  const { expandedTopTray } = React.useContext(AboveComposerPanelRowContext);
  return (
    <div
      className={clsx(
        "relative min-w-0 overflow-clip text-token-foreground",
        !expandedTopTray &&
          "bg-token-input-background/70 border-token-border/80 border-x border-t backdrop-blur-sm",
        !expandedTopTray && "first:rounded-t-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
export interface CommentAttachment {
  localBrowserDesignChange?: unknown;
}
export interface CategorizedAttachments {
  annotationCommentAttachments: CommentAttachment[];
  designTweakCommentAttachments: CommentAttachment[];
  diffCommentAttachments: CommentAttachment[];
}
function isAnnotationAttachment(attachment: CommentAttachment): boolean {
  return (
    isZodAnnotationAttachmentB(attachment) ||
    isHostConfigAnnotationAttachment(attachment) ||
    isZodAnnotationAttachmentA(attachment)
  );
}
export function categorizeAttachments(
  attachments: CommentAttachment[],
): CategorizedAttachments {
  const annotationCommentAttachments: CommentAttachment[] = [];
  const designTweakCommentAttachments: CommentAttachment[] = [];
  const diffCommentAttachments: CommentAttachment[] = [];
  for (const attachment of attachments) {
    if (attachment.localBrowserDesignChange != null) {
      designTweakCommentAttachments.push(attachment);
      continue;
    }
    if (isAnnotationAttachment(attachment)) {
      annotationCommentAttachments.push(attachment);
    } else {
      diffCommentAttachments.push(attachment);
    }
  }
  return {
    annotationCommentAttachments,
    designTweakCommentAttachments,
    diffCommentAttachments,
  };
}
export function getDiffCommentAttachments(
  attachments: CommentAttachment[],
): CommentAttachment[] {
  return categorizeAttachments(attachments).diffCommentAttachments;
}
export function getAnnotationAndDesignTweakCommentAttachments(
  attachments: CommentAttachment[],
): CommentAttachment[] {
  const { annotationCommentAttachments, designTweakCommentAttachments } =
    categorizeAttachments(attachments);
  return [...annotationCommentAttachments, ...designTweakCommentAttachments];
}
export function AboveComposerPanelRowHeader({
  actions,
  className,
  icon,
  meta,
  title,
  titleClassName,
  trailing,
  ...rest
}: AboveComposerPanelRowHeaderProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "group flex min-w-0 items-center justify-between gap-2 py-0.5 text-sm",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {icon != null ? (
          <span className="flex h-4 shrink-0 items-center justify-center">
            {icon}
          </span>
        ) : null}
        <div className={clsx("min-w-0 flex-1 leading-4", titleClassName)}>
          {title}
          {meta != null ? (
            <span className="ml-1 text-token-description-foreground">
              {meta}
            </span>
          ) : null}
        </div>
      </div>
      {trailing != null || actions != null ? (
        <div className="flex shrink-0 items-center gap-1">
          {trailing}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
