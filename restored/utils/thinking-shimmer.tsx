// Restored from ref/webview/assets/thinking-shimmer-D6c2nHwp.js
import React, { useRef, useEffect } from "react";
import clsx from "clsx";

// FormattedMessage from react-intl (boundary: lib-BWT6A3Q0)
interface FormattedMessageProps {
  id: string;
  defaultMessage: string;
  description?: string;
}
function FormattedMessage({ id, defaultMessage, description }: FormattedMessageProps): JSX.Element {
  return <>{defaultMessage}</>;
}

// Statsig client hook (boundary: statsig-C09DmQ8J)
function useStatsigClient(): () => any {
  return () => ({
    getExperiment: () => ({
      get: () => null,
      groupName: null,
    }),
  });
}

const SHIMMER_ACTIVE_DURATION = 1000;
const SHIMMER_INTERVAL = 4000;
const SHIMMER_INITIAL_DELAY = 600;
const SHIMMER_VARIANT_LEGACY = "cadenced_legacy";

const styles = {
  cadencedShimmer: "_cadencedShimmer_1bpr9_1",
  cadencedShimmerSweep: "_cadencedShimmerSweep_1bpr9_12",
  cadencedShimmerHighlight: "_cadencedShimmerHighlight_1bpr9_35",
  cadencedShimmerActive: "_cadencedShimmerActive_1bpr9_44",
  cadencedLoadingShimmerSweep: "_cadencedLoadingShimmerSweep_1bpr9_1",
  cadencedLoadingShimmerHighlight: "_cadencedLoadingShimmerHighlight_1bpr9_1",
};

interface ShimmerProps {
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Shimmer({ active, className, children, ...rest }: ShimmerProps): JSX.Element {
  if (active === undefined || !active) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <ShimmerInner className={className} {...rest}>
      {children}
    </ShimmerInner>
  );
}

interface ShimmerInnerProps {
  className?: string;
  children?: React.ReactNode;
}

function ShimmerInner({ className, children, ...rest }: ShimmerInnerProps): JSX.Element {
  const statsigClient = useStatsigClient();
  const ref = useRef<HTMLSpanElement>(null);

  const isLegacyShimmer = (() => {
    const client = statsigClient();
    const experiment = client.getExperiment("1585730870");
    return (
      experiment.get("shimmer_variant", null) === SHIMMER_VARIANT_LEGACY ||
      experiment.groupName === SHIMMER_VARIANT_LEGACY
    );
  })();

  const isLegacy = isLegacyShimmer;

  useEffect(() => {
    if (!isLegacy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = ref.current;
    if (element == null) return;

    let activeTimeout: number | undefined;
    let intervalId: number | undefined;

    const clearActiveTimeout = () => {
      if (activeTimeout != null) {
        window.clearTimeout(activeTimeout);
        activeTimeout = undefined;
      }
    };

    const triggerShimmer = () => {
      clearActiveTimeout();
      element.classList.remove(styles.cadencedShimmerActive);
      element.classList.add(styles.cadencedShimmerActive);
      activeTimeout = window.setTimeout(() => {
        element.classList.remove(styles.cadencedShimmerActive);
        activeTimeout = undefined;
      }, SHIMMER_ACTIVE_DURATION);
    };

    const initialDelay = window.setTimeout(() => {
      triggerShimmer();
      intervalId = window.setInterval(triggerShimmer, SHIMMER_INTERVAL);
    }, SHIMMER_INITIAL_DELAY);

    return () => {
      clearActiveTimeout();
      window.clearTimeout(initialDelay);
      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
      element.classList.remove(styles.cadencedShimmerActive);
    };
  }, [isLegacy]);

  const shimmerRef = isLegacy ? ref : undefined;
  const shimmerClass = isLegacy && styles.cadencedShimmer;

  const classes = clsx("loading-shimmer-pure-text", shimmerClass, className);

  const shimmerOverlay = isLegacy ? (
    <span aria-hidden className={styles.cadencedShimmerSweep}>
      <span className={styles.cadencedShimmerHighlight}>{children}</span>
    </span>
  ) : null;

  return (
    <span ref={shimmerRef} className={classes} {...rest}>
      {children}
      {shimmerOverlay}
    </span>
  );
}

interface ThinkingShimmerProps {
  className?: string;
  message?: React.ReactNode;
}

export function ThinkingShimmer({ className, message, ...rest }: ThinkingShimmerProps): JSX.Element {
  const classes = clsx(
    "text-size-chat leading-[calc(var(--codex-chat-font-size)_+_8px)] select-none truncate",
    className,
  );

  const defaultMessage = (
    <FormattedMessage
      id="thinkingShimmer.default"
      defaultMessage="Thinking"
      description="Default placeholder shown while the assistant is thinking"
    />
  );

  const content = message ?? defaultMessage;

  return (
    <Shimmer className={classes} {...rest}>
      {content}
    </Shimmer>
  );
}

export { ThinkingShimmer, Shimmer };
