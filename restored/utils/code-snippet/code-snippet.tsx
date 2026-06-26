// Restored from ref/webview/assets/code-snippet-5cGi4tCG.js

import { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Button } from "../../ui/button";
import { CopyButton } from "../../utils/copy-button";
import { t as Tooltip } from "../../ui/tooltip-b";
import { copyToClipboard } from "../../utils/copy-to-clipboard";
import { highlightCode } from "../../boundaries/highlight-code";
import { HtmlSpan, SvgImage, UnwrapIcon, WordWrapIcon } from "./icons";
import { CodeBlock } from "./code-block";
import { isSvgLikeContent, memoize } from "./utils";
const loadHighlighter = memoize(async () => {
  const mod = await import("../../boundaries/highlight-code");
  return mod as {
    highlightCode: typeof highlightCode;
  };
});
export interface CodeSnippetProps {
  wrapperClassName?: string;
  codeClassName?: string;
  language?: string;
  content: string;
  shouldWrapCode?: boolean;
  removeTopBorderRadius?: boolean;
  showActionBar?: boolean;
  showStickyRightContent?: boolean;
  codeContainerClassName?: string;
  title?: string;
  copyButtonText?: string;
  onToggleWrapCode?: () => void;
}
interface HighlightResult {
  code: string;
  html: string;
}
interface HighlighterState {
  disposed: boolean;
  latestContent: string;
  latestLanguage: string;
  lastStartedAtMs: number | null;
  timeoutHandle: ReturnType<typeof setTimeout> | null;
}
export function CodeSnippet({
  wrapperClassName,
  codeClassName,
  language,
  content,
  shouldWrapCode = false,
  removeTopBorderRadius,
  showActionBar = true,
  showStickyRightContent = true,
  codeContainerClassName,
  title,
  copyButtonText,
  onToggleWrapCode,
}: CodeSnippetProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { formatMessage } = useIntl();
  const handleCopy = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      copyToClipboard(content, event);
    },
    [content],
  );
  const wrapLabel = shouldWrapCode
    ? formatMessage({
        id: "codeSnippet.wrap.disable",
        defaultMessage: "Disable word wrap",
        description: "Button to disable word wrap for a code snippet",
      })
    : formatMessage({
        id: "codeSnippet.wrap.enable",
        defaultMessage: "Enable word wrap",
        description: "Button to enable word wrap for a code snippet",
      });
  const WrapIcon = shouldWrapCode ? UnwrapIcon : WordWrapIcon;
  const [highlightResult, setHighlightResult] =
    useState<HighlightResult | null>(null);
  const stateRef = useRef<HighlighterState>({
    disposed: false,
    latestContent: content,
    latestLanguage: language ?? "",
    lastStartedAtMs: null,
    timeoutHandle: null,
  });
  const scheduleHighlight = useCallback(() => {
    const state = stateRef.current;
    state.latestContent = content;
    state.latestLanguage = language ?? "";
    if (state.timeoutHandle != null) {
      return;
    }
    const now = performance.now();
    const elapsed =
      state.lastStartedAtMs == null ? 0 : now - state.lastStartedAtMs;
    const delay = Math.max(0, 120 - elapsed);
    const runHighlight = () => {
      state.timeoutHandle = null;
      if (state.disposed) return;
      const latestContent = state.latestContent;
      const latestLanguage = state.latestLanguage;
      state.lastStartedAtMs = performance.now();
      loadHighlighter().then((highlighter) => {
        if (state.disposed || highlighter == null) return;
        try {
          setHighlightResult(
            highlighter.highlightCode(latestContent, latestLanguage),
          );
        } catch (error) {
          if (
            error instanceof Error &&
            /Unknown language/i.test(error.message)
          ) {
            return;
          }
          throw error;
        }
      });
    };
    if (delay === 0) {
      runHighlight();
    } else {
      state.timeoutHandle = setTimeout(runHighlight, delay);
    }
  }, [content, language]);
  useEffect(scheduleHighlight, [scheduleHighlight]);
  useEffect(() => {
    const state = stateRef.current;
    state.disposed = false;
    return () => {
      state.disposed = true;
      if (state.timeoutHandle != null) {
        clearTimeout(state.timeoutHandle);
        state.timeoutHandle = null;
      }
    };
  }, []);
  const isSvgLanguage =
    language === "svg" ||
    ((language === "xml" || language === "html") && isSvgLikeContent(content));
  const trimmedResult =
    highlightResult != null && content.startsWith(highlightResult.code)
      ? highlightResult
      : null;
  const trailingContent =
    trimmedResult == null ? content : content.slice(trimmedResult.code.length);
  const renderedContent = isSvgLanguage ? (
    <SvgImage svgString={content} className="max-h-96 w-full" />
  ) : trimmedResult == null ? (
    <span>{content}</span>
  ) : (
    <span>
      {trimmedResult.html.split("\n").map((line, index, lines) => (
        <>
          <HtmlSpan key={index} html={line} />
          {index < lines.length - 1 ? "\n" : null}
        </>
      ))}
      {trailingContent ? <span>{trailingContent}</span> : null}
    </span>
  );
  const displayTitle = title ?? language;
  const copyText = isSvgLanguage ? content : undefined;
  const stickyRightContent = showStickyRightContent && (
    <div className="flex items-center gap-px">
      {onToggleWrapCode != null ? (
        <Tooltip tooltipContent={wrapLabel}>
          <Button
            aria-label={wrapLabel}
            aria-pressed={shouldWrapCode}
            color="ghost"
            size="icon"
            className={
              shouldWrapCode ? "hover:text-token-foreground" : undefined
            }
            onClick={onToggleWrapCode}
          >
            <WrapIcon className="icon-2xs" />
          </Button>
        </Tooltip>
      ) : null}
      <CopyButton
        iconClassName="icon-xs"
        iconOnly
        buttonText={
          copyButtonText ??
          formatMessage({
            id: "copyButton.copyCode",
            defaultMessage: "Copy code",
            description:
              "Button to copy the contents of the code snippet to the clipboard",
          })
        }
        onCopy={handleCopy}
      />
    </div>
  );
  return (
    <CodeBlock
      ref={containerRef}
      title={displayTitle}
      codeCopyText={copyText}
      shouldWrapCode={shouldWrapCode}
      stickyTitleRightContent={stickyRightContent}
      codeClassName={codeClassName}
      codeContainerClassName={codeContainerClassName}
      onCopy={handleCopy}
      className={wrapperClassName}
      removeTopBorderRadius={removeTopBorderRadius}
      showActionBar={showActionBar}
    >
      {renderedContent}
    </CodeBlock>
  );
}
