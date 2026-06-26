// Restored from ref/webview/assets/scroll-to-bottom-buton-Bc3ZL53H.js
// scroll-to-bottom-buton-Bc3ZL53H chunk restored from the Codex webview bundle.
import { useMemoCache as useReactMemoCache } from "react";
import { clsx } from "clsx";
import { ArrowUpIcon } from "../icons/arrow-up-icon";
export interface ScrollToBottomButtonProps {
  className?: string;
  label?: string;
  onClick?: () => void;
  show: boolean;
  showWorkingDots?: boolean;
}
export function ScrollToBottomButton(
  props: ScrollToBottomButtonProps,
): JSX.Element {
  const { className, label, onClick, show, showWorkingDots = false } = props;
  const t = useReactMemoCache(12);
  const visibilityClass = show
    ? "opacity-100"
    : "pointer-events-none opacity-0";
  let classNameResult: string;
  if (t[0] !== className || t[1] !== visibilityClass) {
    classNameResult = clsx(
      "cursor-interaction absolute z-30 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border border-token-border-default bg-token-main-surface-primary bg-clip-padding text-token-text-secondary transition-opacity duration-150 ease-in-out end-1/2 print:hidden",
      visibilityClass,
      className,
    );
    t[0] = className;
    t[1] = visibilityClass;
    t[2] = classNameResult;
  } else {
    classNameResult = t[2];
  }
  const isHidden = !show;
  const tabIndex = show ? undefined : -1;
  const handleClick = show ? onClick : undefined;
  let iconContent: JSX.Element;
  if (t[3] === showWorkingDots) {
    iconContent = t[4];
  } else {
    iconContent = showWorkingDots ? (
      <span aria-hidden className="flex items-center justify-center gap-1">
        <span className="h-1 w-1 rounded-full bg-token-text-primary/70 _waveDot_1y69c_22" />
        <span className="h-1 w-1 rounded-full bg-token-text-primary/70 _waveDot_1y69c_22" />
        <span className="h-1 w-1 rounded-full bg-token-text-primary/70 _waveDot_1y69c_22" />
      </span>
    ) : (
      <ArrowUpIcon className="icon rotate-180 text-token-text-primary" />
    );
    t[3] = showWorkingDots;
    t[4] = iconContent;
  }
  let result: JSX.Element;
  if (
    t[5] !== label ||
    t[6] !== classNameResult ||
    t[7] !== isHidden ||
    t[8] !== tabIndex ||
    t[9] !== handleClick ||
    t[10] !== iconContent
  ) {
    result = (
      <button
        className={classNameResult}
        aria-hidden={isHidden}
        aria-label={label}
        tabIndex={tabIndex}
        type="button"
        onClick={handleClick}
      >
        {iconContent}
      </button>
    );
    t[5] = label;
    t[6] = classNameResult;
    t[7] = isHidden;
    t[8] = tabIndex;
    t[9] = handleClick;
    t[10] = iconContent;
    t[11] = result;
  } else {
    result = t[11];
  }
  return result;
}
