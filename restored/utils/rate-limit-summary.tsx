// Restored from ref/webview/assets/rate-limit-summary-BUSuPbw3.js
// RateLimitSummary chunk restored from the Codex webview bundle.

import React from "react";
import type { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import clsx from "clsx";
import { BulletSeparator } from "./bullet-separator";
import { Spinner } from "../ui/spinner-dh-bmwxtt";
import { ChevronRightIcon } from "../icons/chevron-right-icon";
import { LinkExternalIcon } from "../icons/link-external-icon";
import { SpeedometerIcon } from "../icons/speedometer-icon";
import {
  formatPercent,
  parseTimestamp,
  getSecondsUntilReset,
  computeRemainingPercent,
} from "./rate-limit-status-cj-a-yp-g-eg";
import { useRateLimitR, useRateLimitL } from "./use-rate-limit-df-bgd-y-gx";
import { Dropdown, DropdownItem } from "../ui/dropdown-ctb-ro-adh";
interface RateLimitBucket {
  usedPercent?: number;
  resetsAt?: string;
  windowDurationMins?: number;
}
interface RateLimit {
  limitName?: string;
  snapshot?: {
    primary?: RateLimitBucket;
    secondary?: RateLimitBucket;
  };
}
interface RateLimitSummaryProps {
  rateLimits: RateLimit[];
  activeLimitName?: string;
  planType?: string;
  suppressUpsell?: boolean;
  selectedModel?: string;
  availableRateLimitResetCount?: number;
  onRateLimitResetClick?: () => void;
  onPlanUpgradeClick?: () => void;
  onRequestLimitIncreaseClick?: () => void;
  isLoading?: boolean;
  showLearnMore?: boolean;
  layout?: "default" | "compact";
}
function RateLimitWindowLabel({
  minutes,
  variant,
}: {
  minutes: number | null;
  variant?: string;
}) {
  const intl = useIntl();
  return (
    <>
      {intl.formatMessage(
        {
          id: "composer.mode.rateLimit.windowLabel",
          defaultMessage: "{minutes} min",
          description: "Rate limit window duration label",
        },
        {
          minutes,
        },
      )}
    </>
  );
}
export function RateLimitSummary({
  rateLimits,
  activeLimitName,
  planType,
  suppressUpsell,
  selectedModel,
  availableRateLimitResetCount = 0,
  onRateLimitResetClick,
  onPlanUpgradeClick,
  onRequestLimitIncreaseClick,
  isLoading = false,
  showLearnMore = true,
  layout = "default",
}: RateLimitSummaryProps) {
  const intl = useIntl();
  if (
    !isLoading &&
    rateLimits.length === 0 &&
    availableRateLimitResetCount === 0
  )
    return null;
  const rateLimitInfo = useRateLimitR(rateLimits, {
    activeLimitName,
    selectedModel,
  });
  const showUpsell = suppressUpsell ?? !useRateLimitL(activeLimitName);
  const isCompact = layout === "compact";
  const DropdownMenu = Dropdown;
  const promoTooltip = undefined; // Statsig feature flag check removed

  const heading = (
    <span className="flex items-center gap-1">
      {intl.formatMessage({
        id: "composer.mode.rateLimit.heading",
        defaultMessage: "Usage remaining",
        description: "Rate limit summary heading",
      })}
      {rateLimitInfo && (
        <span className="whitespace-nowrap text-token-input-placeholder-foreground opacity-60">
          {formatPercent(rateLimitInfo.remainingPercent)}
        </span>
      )}
    </span>
  );
  const trigger = (
    <DropdownItem
      LeftIcon={SpeedometerIcon}
      RightIcon={ChevronRightIcon}
      tooltipText={promoTooltip}
      tooltipSide="left"
    >
      {heading}
    </DropdownItem>
  );
  const content = (
    <div className="flex flex-col text-sm">
      {isLoading ? (
        <DropdownItem
          LeftIcon={Spinner}
          className={clsx(
            isCompact &&
              "pl-[calc(var(--padding-row-x)+1.25rem)] pr-[var(--padding-row-x)]",
          )}
          disabled
        >
          {intl.formatMessage({
            id: "composer.mode.rateLimit.loading",
            defaultMessage: "Loading usage…",
            description: "Loading state for the rate limit summary submenu",
          })}
        </DropdownItem>
      ) : (
        <>
          <div
            className={clsx(
              "grid items-center gap-y-1.5 py-1",
              isCompact
                ? "grid-cols-[minmax(0,1fr)_auto] gap-x-3 pl-[calc(var(--padding-row-x)+1.25rem)] pr-[var(--padding-row-x)]"
                : "grid-cols-[auto_1fr] gap-x-16 px-[var(--padding-row-x)]",
            )}
          >
            {rateLimits.map((item, index) => {
              const limitName = useRateLimitL(item.limitName)
                ? null
                : item.limitName;
              return (
                <RateLimitRow
                  key={`${item.limitName ?? "default"}-${index}`}
                  rateLimit={item.snapshot}
                  limitName={limitName}
                  compact={isCompact}
                />
              );
            })}
          </div>
          {!showUpsell && (
            <RateLimitUpsell
              planType={planType}
              className={clsx(
                isCompact &&
                  "pl-[calc(var(--padding-row-x)+1.25rem)] pr-[var(--padding-row-x)]",
              )}
              onPlanUpgradeClick={onPlanUpgradeClick}
              onRequestLimitIncreaseClick={onRequestLimitIncreaseClick}
            />
          )}
          {availableRateLimitResetCount > 0 && (
            <DropdownItem
              RightIcon={ChevronRightIcon}
              className={clsx(
                isCompact &&
                  "pl-[calc(var(--padding-row-x)+1.25rem)] pr-[var(--padding-row-x)]",
              )}
              onClick={onRateLimitResetClick}
            >
              {intl.formatMessage(
                {
                  id: "composer.mode.rateLimit.resetsAvailable",
                  defaultMessage:
                    "{availableRateLimitResetCount, plural, one {# reset available} other {# resets available}}",
                  description:
                    "Menu item for opening available rate limit resets",
                },
                {
                  availableRateLimitResetCount,
                },
              )}
            </DropdownItem>
          )}
          {showLearnMore && (
            <DropdownItem
              RightIcon={LinkExternalIcon}
              rightIconClassName={
                isCompact
                  ? "icon-xs text-token-description-foreground"
                  : undefined
              }
              className={clsx(
                isCompact &&
                  "pl-[calc(var(--padding-row-x)+1.25rem)] pr-[var(--padding-row-x)]",
              )}
              href="https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan#h_8dd84c836b"
            >
              <span
                className={clsx(
                  isCompact
                    ? "text-token-foreground"
                    : "text-token-description-foreground",
                )}
              >
                {intl.formatMessage({
                  id: "composer.mode.local.learnMore",
                  defaultMessage: "Learn more",
                  description: "Learn more about rate limits",
                })}
              </span>
            </DropdownItem>
          )}
        </>
      )}
    </div>
  );
  return <DropdownMenu trigger={trigger}>{content}</DropdownMenu>;
}
interface RateLimitRowProps {
  rateLimit?: {
    primary?: RateLimitBucket;
    secondary?: RateLimitBucket;
  };
  limitName?: string | null;
  compact?: boolean;
}
function RateLimitRow({ rateLimit, limitName, compact }: RateLimitRowProps) {
  const intl = useIntl();
  const primary = rateLimit?.primary;
  const secondary = rateLimit?.secondary;
  const hasPrimary = primary && primary.usedPercent !== undefined;
  const hasSecondary = secondary && secondary.usedPercent !== undefined;
  if (!hasPrimary && !hasSecondary) return null;
  const limitNameEl =
    limitName != null ? (
      <span
        title={formatLimitName(limitName)}
        className={clsx(
          "text-token-foreground col-span-2 min-w-0 truncate font-medium",
          compact ? "mt-1" : "mt-2",
        )}
      >
        {intl.formatMessage(
          {
            id: "composer.mode.rateLimit.modelSectionLabel",
            defaultMessage: "{modelName} limit:",
            description:
              "Section label shown before model-specific rate limit windows in summaries",
          },
          {
            modelName: formatLimitName(limitName),
          },
        )}
      </span>
    ) : null;
  return (
    <>
      {limitNameEl}
      {hasPrimary && (
        <RateLimitBucketRow bucket={primary ?? null} compact={compact} />
      )}
      {hasSecondary && (
        <RateLimitBucketRow bucket={secondary ?? null} compact={compact} />
      )}
    </>
  );
}
interface RateLimitBucketRowProps {
  bucket: RateLimitBucket | null;
  compact?: boolean;
}
function RateLimitBucketRow({ bucket, compact }: RateLimitBucketRowProps) {
  if (!bucket || bucket.usedPercent === undefined) return null;
  const intl = useIntl();
  const resetTimestamp = parseTimestamp(bucket.resetsAt ?? null);
  const secondsUntilReset = resetTimestamp
    ? getSecondsUntilReset(resetTimestamp)
    : null;
  const resetText = secondsUntilReset
    ? formatDuration(secondsUntilReset)
    : null;
  const usedPercent = computeRemainingPercent(bucket.usedPercent ?? 0);
  const compactClass = compact && "flex min-w-0 items-center gap-1";
  const labelClass = clsx("text-token-foreground font-medium", compactClass);
  const shrinkClass = compact && "shrink-0";
  const shrinkClassName = clsx(shrinkClass);
  const windowMinutes = bucket.windowDurationMins ?? null;
  const windowLabel = <RateLimitWindowLabel minutes={windowMinutes} />;
  const label = (
    <span className={labelClass}>
      <span className={shrinkClassName}>{windowLabel}</span>
    </span>
  );
  const rightClass = compact
    ? "min-w-0 items-center justify-end"
    : "w-full min-w-0 items-center justify-end overflow-hidden";
  const rightClassName = clsx(
    "text-token-description-foreground flex gap-1 text-end",
    rightClass,
  );
  const percentText = formatPercent(usedPercent);
  return (
    <>
      {label}
      <span className={rightClassName}>
        <span className="shrink-0">{percentText}</span>
        {resetText && (
          <>
            <span className="shrink-0">
              <BulletSeparator />
            </span>
            <span
              title={resetText}
              className={clsx(
                "text-token-description-foreground flex items-center gap-1",
                "min-w-0 truncate text-right",
              )}
            >
              {resetText}
            </span>
          </>
        )}
      </span>
    </>
  );
}
function formatLimitName(name: string): string {
  return name.replace(/_/g, "-");
}
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
}
interface RateLimitUpsellProps {
  planType?: string;
  className?: string;
  onPlanUpgradeClick?: () => void;
  onRequestLimitIncreaseClick?: () => void;
}
function RateLimitUpsell({
  planType,
  className,
  onPlanUpgradeClick,
  onRequestLimitIncreaseClick,
}: RateLimitUpsellProps) {
  const intl = useIntl();
  if (onRequestLimitIncreaseClick != null) {
    return (
      <DropdownItem className={className} onClick={onRequestLimitIncreaseClick}>
        {intl.formatMessage({
          id: "settings.usage.limits.requestIncrease",
          defaultMessage: "Request limit increase",
          description:
            "Button to request a workspace monthly usage limit increase",
        })}
      </DropdownItem>
    );
  }
  switch (planType) {
    case "free":
    case "go": {
      return (
        <DropdownItem
          RightIcon={LinkExternalIcon}
          className={className}
          href="https://openai.com/chatgpt/pricing"
          onClick={onPlanUpgradeClick}
        >
          {intl.formatMessage({
            id: "composer.mode.upgradeToPlus",
            defaultMessage: "Upgrade to Plus",
            description: "Upgrade to Plus message for free plan",
          })}
        </DropdownItem>
      );
    }
    case "plus": {
      return (
        <DropdownItem
          RightIcon={LinkExternalIcon}
          className={className}
          href="https://openai.com/chatgpt/pricing"
          onClick={onPlanUpgradeClick}
        >
          {intl.formatMessage({
            id: "composer.mode.upgradeToPro",
            defaultMessage: "Upgrade to Pro",
            description: "Upgrade to Pro",
          })}
        </DropdownItem>
      );
    }
    case "prolite": {
      return (
        <DropdownItem
          RightIcon={LinkExternalIcon}
          className={className}
          href="https://openai.com/chatgpt/pricing"
          onClick={onPlanUpgradeClick}
        >
          {intl.formatMessage({
            id: "composer.mode.upgradeForMoreUsage",
            defaultMessage: "Upgrade for more usage",
            description: "Upgrade for more usage",
          })}
        </DropdownItem>
      );
    }
    case "team":
    case "self_serve_business_usage_based":
    case "business":
    case "enterprise_cbp_usage_based":
    case "education":
    case "quorum":
    case "sci":
    case "enterprise":
    case "edu":
    case "hc":
    case "finserv": {
      return (
        <DropdownItem className={className} allowWrap>
          <span className="text-token-description-foreground">
            {intl.formatMessage({
              id: "composer.mode.contactAdmin",
              defaultMessage: "To get more access, contact your admin",
              description: "Suggest contacting admin for increased access",
            })}
          </span>
        </DropdownItem>
      );
    }
    case "pro":
    case "free_workspace":
    case "guest":
    case "k12":
    case undefined:
      return null;
    default:
      return null;
  }
}
