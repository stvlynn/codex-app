// Restored from ref/webview/assets/code-snippet-5cGi4tCG.js

import { type ReactNode } from "react";
import clsx from "clsx";
import { useIsDark } from "../../utils/use-is-dark";
export interface CodeBlockHeaderProps {
  className?: string;
  removeTopBorderRadius?: boolean;
  children?: ReactNode;
}
export function CodeBlockHeader({
  className,
  removeTopBorderRadius,
  ...rest
}: CodeBlockHeaderProps): JSX.Element {
  const roundedClass =
    removeTopBorderRadius === true ? undefined : "rounded-t-lg";
  const headerClassName = clsx(
    "flex items-center py-1 pe-2 ps-2 font-sans text-sm text-token-description-foreground select-none",
    roundedClass,
    className,
  );
  return (
    <div data-markdown-copy="exclude" className={headerClassName} {...rest} />
  );
}
export interface CodeContainerProps {
  children?: ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}
export function CodeContainer({
  children,
  className,
  ref,
}: CodeContainerProps): JSX.Element {
  const containerClassName = clsx(
    "text-size-chat overflow-auto p-2",
    className,
  );
  return (
    <div ref={ref} className={containerClassName} dir="ltr">
      {children}
    </div>
  );
}
export interface CodeElementProps {
  children?: ReactNode;
  className?: string;
  shouldWrap?: boolean;
  onCopy?: (event: React.MouseEvent<HTMLElement>) => void;
}
export function CodeElement({
  children,
  className,
  shouldWrap = false,
  ...rest
}: CodeElementProps): JSX.Element {
  const wrapClass = shouldWrap ? "whitespace-pre-wrap!" : "whitespace-pre!";
  const codeClassName = clsx(wrapClass, className);
  return (
    <code className={codeClassName} {...rest}>
      {children}
    </code>
  );
}
export interface CodeBlockProps {
  children?: ReactNode;
  title?: ReactNode;
  codeCopyText?: string;
  stickyTitleRightContent?: ReactNode;
  shouldWrapCode?: boolean;
  className?: string;
  codeContainerClassName?: string;
  codeClassName?: string;
  onCopy?: (event: React.MouseEvent<HTMLElement>) => void;
  ref?: React.Ref<HTMLDivElement>;
  removeTopBorderRadius?: boolean;
  showActionBar?: boolean;
}
export function CodeBlock({
  children,
  title,
  codeCopyText,
  stickyTitleRightContent,
  shouldWrapCode = false,
  className,
  codeContainerClassName,
  codeClassName,
  onCopy,
  ref,
  removeTopBorderRadius,
  showActionBar = true,
}: CodeBlockProps): JSX.Element {
  const isDark = useIsDark();
  const theme = isDark ? "dark" : "light";
  const blockClassName = clsx(
    "relative w-full min-w-0 overflow-clip rounded-lg border contain-inline-size",
    "bg-token-text-code-block-background border-token-input-background",
    theme,
    className,
  );
  const actionBar = showActionBar ? (
    <CodeBlockHeader removeTopBorderRadius={removeTopBorderRadius}>
      <div className="min-w-0 flex-1 truncate">{title}</div>
      <div className="ml-auto flex shrink-0 items-center">
        {stickyTitleRightContent}
      </div>
    </CodeBlockHeader>
  ) : null;
  const codeElement = (
    <CodeElement
      shouldWrap={shouldWrapCode}
      className={codeClassName}
      onCopy={onCopy}
    >
      {children}
    </CodeElement>
  );
  return (
    <div
      data-markdown-copy="code-block"
      data-markdown-copy-text={codeCopyText}
      className={blockClassName}
      data-theme={theme}
    >
      {actionBar}
      <CodeContainer ref={ref} className={codeContainerClassName}>
        {codeElement}
      </CodeContainer>
    </div>
  );
}
