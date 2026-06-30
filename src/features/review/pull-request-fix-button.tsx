// Restored from ref/webview/assets/pull-request-fix-button-D5HTDG4t.js
// pull-request-fix-button-D5HTDG4t chunk restored from the Codex webview bundle.
import { Button } from "ui/button";
import { Tooltip } from "ui/tooltip-b";
import {
  productLoggerBn,
  productLoggerHn,
  productLoggerT,
  productLoggerVn,
} from "utils/product-logger";
interface PullRequestItem {
  state: string;
  isAuthor: boolean;
}
interface PullRequestFixButtonProps {
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  tooltipContent?: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
}
export function logPullRequestFixButtonClick(
  logger: unknown,
  {
    action,
    item,
    surface,
  }: {
    action: string;
    item: PullRequestItem;
    surface: string;
  },
) {
  productLoggerT(logger, productLoggerBn, {
    action,
    surface,
    state: item.state,
    isAuthor: item.isAuthor,
  });
}
export function logPullRequestFixButtonImpression(
  logger: unknown,
  {
    item,
    surface,
  }: {
    item: PullRequestItem;
    surface: string;
  },
) {
  productLoggerT(logger, productLoggerHn, {
    surface,
    state: item.state,
    isAuthor: item.isAuthor,
  });
}
export function logPullRequestFixButtonRender(
  logger: unknown,
  {
    kind,
    surface,
  }: {
    kind: string;
    surface: string;
  },
) {
  productLoggerT(logger, productLoggerVn, {
    kind,
    surface,
  });
}
export function PullRequestFixButton({
  children,
  color,
  disabled,
  tooltipContent,
  onClick,
}: PullRequestFixButtonProps) {
  const buttonColor = disabled
    ? "ghost"
    : color === undefined
      ? "ghostMuted"
      : color;
  const textClass = disabled ? "text-token-text-secondary" : undefined;
  const button = (
    <span className="-me-1.5 inline-flex">
      <Button
        className={textClass}
        color={buttonColor}
        disabled={disabled}
        size="composerSm"
        onClick={onClick}
      >
        {children}
      </Button>
    </span>
  );
  if (!disabled) return button;
  return <Tooltip tooltipContent={tooltipContent}>{button}</Tooltip>;
}
