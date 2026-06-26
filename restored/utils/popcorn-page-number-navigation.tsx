// Restored from ref/webview/assets/PopcornPageNumberNavigation-VRpKM1l8.js
// PopcornPageNumberNavigation chunk restored from the Codex webview bundle.

import React from "react";
const iconStyle: React.CSSProperties = {
  height: "18px",
  width: "18px",
};
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
export interface PopcornPageNumberNavigationProps {
  currentIndex: number;
  totalCount: number;
  itemLabel: string;
  onChangeIndex: (index: number) => void;
  disabled?: boolean;
  testId?: string;
}
export function PopcornPageNumberNavigation({
  currentIndex,
  totalCount,
  itemLabel,
  onChangeIndex,
  disabled = false,
  testId = "popcorn-page-number-navigation",
}: PopcornPageNumberNavigationProps): JSX.Element {
  const displayNumber = totalCount > 0 ? currentIndex + 1 : 0;
  const canGoPrevious = !disabled && totalCount > 0 && currentIndex > 0;
  const canGoNext =
    !disabled && totalCount > 0 && currentIndex < totalCount - 1;
  return (
    <div
      className="flex items-center gap-0.5 text-sm tabular-nums"
      data-testid={testId}
    >
      <button
        type="button"
        aria-label={`Go to previous ${itemLabel}`}
        data-testid={`${testId}-previous`}
        className="text-token-text-secondary inline-flex h-8 w-8 cursor-interaction items-center justify-center rounded-md border border-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-token-focus-border enabled:hover:bg-token-list-hover-background enabled:hover:text-token-text-primary disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoPrevious}
        onClick={() => onChangeIndex(currentIndex - 1)}
      >
        <ChevronLeftIcon style={iconStyle} />
      </button>
      <span
        className="min-w-12 px-1 text-center text-token-text-primary"
        data-testid={`${testId}-indicator`}
      >
        {displayNumber}
        {"/"}
        {Math.max(0, totalCount)}
      </span>
      <button
        type="button"
        aria-label={`Go to next ${itemLabel}`}
        data-testid={`${testId}-next`}
        className="text-token-text-secondary inline-flex h-8 w-8 cursor-interaction items-center justify-center rounded-md border border-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-token-focus-border enabled:hover:bg-token-list-hover-background enabled:hover:text-token-text-primary disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoNext}
        onClick={() => onChangeIndex(currentIndex + 1)}
      >
        <ChevronRightIcon style={iconStyle} />
      </button>
    </div>
  );
}
