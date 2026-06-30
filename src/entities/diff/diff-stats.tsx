// Restored from ref/webview/assets/diff-stats-BELN7TEd.js
// Diff statistics components showing lines added/removed with animated digit counters.

import { useMemo } from "react";
import clsx from "clsx";
import { useIntl, FormattedMessage } from "react-intl";
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const digitStackClasses: Record<string, string> = {
  "0": "diff-stat-digit-stack-0",
  "1": "diff-stat-digit-stack-1",
  "2": "diff-stat-digit-stack-2",
  "3": "diff-stat-digit-stack-3",
  "4": "diff-stat-digit-stack-4",
  "5": "diff-stat-digit-stack-5",
  "6": "diff-stat-digit-stack-6",
  "7": "diff-stat-digit-stack-7",
  "8": "diff-stat-digit-stack-8",
  "9": "diff-stat-digit-stack-9",
};
export type DiffStatVariant = "color" | "monochrome";
export interface DiffStatsProps {
  linesAdded: number;
  linesRemoved: number;
  variant?: DiffStatVariant;
  className?: string;
}
export function DiffStats(props: DiffStatsProps): JSX.Element {
  const { linesAdded, linesRemoved, variant = "color", className } = props;
  const intl = useIntl();
  const containerClass = clsx(
    "inline-flex items-center gap-1 disambiguated-digits tabular-nums tracking-tight",
    className,
  );
  const addedColorClass =
    variant === "monochrome"
      ? "text-token-input-placeholder-foreground"
      : "text-token-git-decoration-added-resource-foreground";
  const addedClass = clsx("flex shrink-0 items-center", addedColorClass);
  const removedColorClass =
    variant === "monochrome"
      ? "text-token-input-placeholder-foreground"
      : "text-token-git-decoration-deleted-resource-foreground";
  const removedClass = clsx("flex shrink-0 items-center", removedColorClass);
  return (
    <span data-thread-find-skip className={containerClass}>
      <span className={addedClass}>
        <FormattedMessage
          id="wham.message.modal.repoAndDiffStats.linesAdded"
          defaultMessage="+{linesAdded}"
          description="Number of lines added"
          values={{
            linesAdded: intl.formatNumber(linesAdded),
          }}
        />
      </span>
      <span className={removedClass}>
        <FormattedMessage
          id="wham.message.modal.repoAndDiffStats.linesRemoved"
          defaultMessage="-{linesRemoved}"
          description="Number of lines removed"
          values={{
            linesRemoved: intl.formatNumber(linesRemoved),
          }}
        />
      </span>
    </span>
  );
}
export interface AnimatedDiffStatsProps {
  linesAdded: number;
  linesRemoved: number;
  variant?: DiffStatVariant;
  className?: string;
}
export function AnimatedDiffStats(props: AnimatedDiffStatsProps): JSX.Element {
  const { linesAdded, linesRemoved, variant = "color", className } = props;
  const containerClass = clsx(
    "inline-flex items-center gap-1 disambiguated-digits tabular-nums tracking-tight",
    className,
  );
  const addedColorClass =
    variant === "monochrome"
      ? "text-token-input-placeholder-foreground"
      : "text-token-git-decoration-added-resource-foreground";
  const addedClass = clsx("flex shrink-0 items-center", addedColorClass);
  const removedColorClass =
    variant === "monochrome"
      ? "text-token-input-placeholder-foreground"
      : "text-token-git-decoration-deleted-resource-foreground";
  const removedClass = clsx("flex shrink-0 items-center", removedColorClass);
  return (
    <span data-thread-find-skip className={containerClass}>
      <span className={addedClass}>
        <FormattedMessage
          id="wham.message.modal.repoAndDiffStats.linesAdded"
          defaultMessage="+{linesAdded}"
          description="Number of lines added"
          values={{
            linesAdded: (
              <DigitStack
                value={linesAdded}
                variant="diff-stat"
                key="linesAdded"
              />
            ),
          }}
        />
      </span>
      <span className={removedClass}>
        <FormattedMessage
          id="wham.message.modal.repoAndDiffStats.linesRemoved"
          defaultMessage="-{linesRemoved}"
          description="Number of lines removed"
          values={{
            linesRemoved: (
              <DigitStack
                value={linesRemoved}
                variant="diff-stat"
                key="linesRemoved"
              />
            ),
          }}
        />
      </span>
    </span>
  );
}
export interface DigitStackProps {
  value: number;
  variant?: string;
}
export function DigitStack(props: DigitStackProps): JSX.Element {
  const { value, variant = "diff-stat" } = props;
  const formatted = value.toString();
  const chars = Array.from(formatted);
  let digitCount = chars.filter(isDigit).length;
  return (
    <span aria-label={formatted} className="diff-stat-rolling-number">
      {chars.map((char, index) =>
        isDigit(char) ? (
          <DigitColumn
            digit={char}
            variant={variant}
            key={`digit-${--digitCount}`}
          />
        ) : (
          <span
            aria-hidden="true"
            className="diff-stat-number-separator"
            key={`separator-${index}`}
          >
            {char}
          </span>
        ),
      )}
    </span>
  );
}
export interface DigitColumnProps {
  digit: string;
  variant?: string;
}
export function DigitColumn(props: DigitColumnProps): JSX.Element {
  const { digit, variant } = props;
  const stackClass = digitStackClasses[digit];
  const className = clsx("diff-stat-digit-stack", stackClass);
  const digits = DIGITS.map((d) => <span key={d}>{d}</span>);
  const stackSpan = <span className={className}>{digits}</span>;
  const inlineClass = variant === "inline" && "diff-stat-digit-column-inline";
  const columnClass = clsx("diff-stat-digit-column", inlineClass);
  const clipSpan = <span className="diff-stat-digit-clip">{stackSpan}</span>;
  return (
    <span aria-hidden="true" className={columnClass}>
      {clipSpan}
    </span>
  );
}
function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}
