// Restored from ref/webview/assets/use-fast-mode-personalized-estimate-BHhOBo0i.js
// use-fast-mode-personalized-estimate-BHhOBo0i chunk restored from the Codex webview bundle.
import React from "react";
import { useAtom } from "jotai";
import {
  defineMessages,
  useIntl,
  type IntlShape,
  type MessageDescriptor,
} from "react-intl";
import { vscodeApiN } from "../boundaries/tanstack-query/vscode";
import { persistedAtomT } from "../utils/persisted-atom";
import { useIsRemoteHost } from "./use-is-remote-host";
export interface FastModeEstimate {
  threadCountLabel: string;
  savedDuration: string;
}
export interface FastModePersonalizedEstimateResult {
  estimate: FastModeEstimate | null;
  estimateStatus: "idle" | "ready" | "failed";
  isEstimateFreshForAnnouncement: boolean;
}
interface FastModeRolloutMetrics {
  estimatedSavedMs: number;
  rolloutCountWithCompletedTurns: number;
}
interface PersistedFastModeEstimate extends FastModeRolloutMetrics {
  computedAtMs: number;
}
type EstimateStatus = "idle" | "ready" | "failed";
interface FastModeEstimateMessages {
  bodyPersonalized: MessageDescriptor;
  threadCountOne: MessageDescriptor;
  threadCountOther: MessageDescriptor;
  durationHoursLabel: MessageDescriptor;
  durationMinutesLabel: MessageDescriptor;
  durationHoursAndMinutes: MessageDescriptor;
}
export const fastModePersonalizedEstimateMessages: FastModeEstimateMessages =
  defineMessages({
    bodyPersonalized: {
      id: "codex.fastModeHomeBanner.body.personalized",
      defaultMessage:
        "Based on your work last week across {threadCountLabel}, Fast could have saved about {duration}. Increased plan usage.",
      description: "Personalized body shown in the Fast mode home banner",
    },
    threadCountOne: {
      id: "codex.fastModeHomeBanner.threadCount.one",
      defaultMessage: "{count} chat",
      description:
        "Thread count label used in the Fast mode home banner for a single thread",
    },
    threadCountOther: {
      id: "codex.fastModeHomeBanner.threadCount.other",
      defaultMessage: "{count} chats",
      description:
        "Thread count label used in the Fast mode home banner for multiple threads",
    },
    durationHoursLabel: {
      id: "codex.fastModeHomeBanner.duration.hoursLabel",
      defaultMessage: "{hours, plural, one {# hour} other {# hours}}",
      description: "Hours label used in the Fast mode home banner duration",
    },
    durationMinutesLabel: {
      id: "codex.fastModeHomeBanner.duration.minutesLabel",
      defaultMessage: "{minutes, plural, one {# minute} other {# minutes}}",
      description: "Minutes label used in the Fast mode home banner duration",
    },
    durationHoursAndMinutes: {
      id: "codex.fastModeHomeBanner.duration.hoursAndMinutes",
      defaultMessage: "{hoursLabel} {minutesLabel}",
      description:
        "Duration label used in the Fast mode home banner when hours and minutes are both present",
    },
  });
const fastModeEstimateAtom = persistedAtomT(
  "fast-mode-personalized-estimate",
  null,
);
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;
const MS_PER_WEEK = 604800000;
const MIN_ESTIMATED_SAVED_MS = 2700000;
const fetchState: {
  failedAtMs: number | null;
  inFlight: Promise<void> | null;
  lastStartedBucket: number | null;
} = {
  failedAtMs: null,
  inFlight: null,
  lastStartedBucket: null,
};
function isEstimateFresh(
  computedAtMs: number,
  now: number = Date.now(),
): boolean {
  return now - computedAtMs <= MS_PER_DAY;
}
function getCurrentHourBucket(now: number = Date.now()): number {
  return Math.floor(now / MS_PER_HOUR);
}
function formatSavedDuration(
  intl: IntlShape,
  estimatedSavedMs: number,
): string {
  const totalMinutes = Math.max(1, Math.round(estimatedSavedMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hoursLabel = intl.formatMessage(
    fastModePersonalizedEstimateMessages.durationHoursLabel,
    {
      hours,
    },
  );
  const minutesLabel = intl.formatMessage(
    fastModePersonalizedEstimateMessages.durationMinutesLabel,
    {
      minutes,
    },
  );
  if (hours > 0 && minutes > 0) {
    return intl.formatMessage(
      fastModePersonalizedEstimateMessages.durationHoursAndMinutes,
      {
        hoursLabel,
        minutesLabel,
      },
    );
  }
  return hours > 0 ? hoursLabel : minutesLabel;
}
function formatThreadCountLabel(intl: IntlShape, count: number): string {
  return intl.formatMessage(
    count === 1
      ? fastModePersonalizedEstimateMessages.threadCountOne
      : fastModePersonalizedEstimateMessages.threadCountOther,
    {
      count,
    },
  );
}
export function useFastModePersonalizedEstimate(
  enabled: boolean,
): FastModePersonalizedEstimateResult {
  const intl = useIntl();
  const isRemoteHost = useIsRemoteHost();
  const [persistedEstimate, setPersistedEstimate] = useAtom(
    fastModeEstimateAtom,
  ) as [
    PersistedFastModeEstimate | null,
    (value: PersistedFastModeEstimate | null) => void,
  ];
  const [optimisticEstimate, setOptimisticEstimate] =
    React.useState<PersistedFastModeEstimate | null>(null);
  const [estimateStatus, setEstimateStatus] =
    React.useState<EstimateStatus>("idle");
  const persistedEstimateRef = React.useRef(persistedEstimate);
  React.useEffect(() => {
    persistedEstimateRef.current = persistedEstimate;
  }, [persistedEstimate]);
  React.useEffect(() => {
    if (!enabled || isRemoteHost) {
      setOptimisticEstimate(null);
      setEstimateStatus("idle");
      return;
    }
    const cachedEstimate = persistedEstimateRef.current;
    const hasCachedEstimate = cachedEstimate != null;
    setOptimisticEstimate(cachedEstimate);
    setEstimateStatus(hasCachedEstimate ? "ready" : "idle");
    const now = Date.now();
    const currentBucket = getCurrentHourBucket(now);
    if (
      fetchState.inFlight != null ||
      fetchState.lastStartedBucket === currentBucket ||
      (fetchState.failedAtMs != null &&
        now - fetchState.failedAtMs < MS_PER_HOUR)
    ) {
      return;
    }
    let isCancelled = false;
    fetchState.lastStartedBucket = currentBucket;
    fetchState.inFlight = (async () => {
      try {
        const metrics = (await vscodeApiN("fast-mode-rollout-metrics", {
          params: {
            startTimeMs: Date.now() - MS_PER_WEEK,
            maxRollouts: 128,
          },
        })) as FastModeRolloutMetrics | null;
        if (metrics == null) return;
        setPersistedEstimate({
          estimatedSavedMs: metrics.estimatedSavedMs,
          rolloutCountWithCompletedTurns:
            metrics.rolloutCountWithCompletedTurns,
          computedAtMs: Date.now(),
        });
        fetchState.failedAtMs = null;
      } catch {
        fetchState.failedAtMs = Date.now();
        if (!isCancelled && !hasCachedEstimate) {
          setEstimateStatus("failed");
        }
      } finally {
        fetchState.inFlight = null;
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [enabled, isRemoteHost, setPersistedEstimate]);
  const estimate = React.useMemo((): FastModeEstimate | null => {
    if (
      !enabled ||
      isRemoteHost ||
      optimisticEstimate == null ||
      optimisticEstimate.rolloutCountWithCompletedTurns < 1 ||
      optimisticEstimate.estimatedSavedMs < MIN_ESTIMATED_SAVED_MS
    ) {
      return null;
    }
    return {
      threadCountLabel: formatThreadCountLabel(
        intl,
        optimisticEstimate.rolloutCountWithCompletedTurns,
      ),
      savedDuration: formatSavedDuration(
        intl,
        optimisticEstimate.estimatedSavedMs,
      ),
    };
  }, [enabled, intl, isRemoteHost, optimisticEstimate]);
  if (!enabled || isRemoteHost) {
    return {
      estimate: null,
      estimateStatus,
      isEstimateFreshForAnnouncement: false,
    };
  }
  if (estimate == null || optimisticEstimate == null) {
    return {
      estimate: null,
      estimateStatus,
      isEstimateFreshForAnnouncement: false,
    };
  }
  return {
    estimate,
    estimateStatus,
    isEstimateFreshForAnnouncement: isEstimateFresh(
      optimisticEstimate.computedAtMs,
    ),
  };
}
