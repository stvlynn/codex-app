// Restored from ref/webview/assets/format-relative-date-time-DLmXX0fU.js
// Formatted relative date/time component showing compact time-ago strings.

import { useSyncExternalStore, createContext, useContext, useMemo } from "react";
import { useIntl } from "react-intl";
const ONE_MINUTE = 60000;
let currentTime = new Date();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
function tick(): void {
  currentTime = new Date();
  for (const listener of listeners) {
    listener();
  }
}
function startInterval(): void {
  if (intervalId != null || typeof window === "undefined") return;
  tick();
  intervalId = window.setInterval(tick, ONE_MINUTE);
}
function stopInterval(): void {
  if (intervalId != null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
}
function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  if (listeners.size === 1) startInterval();
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) stopInterval();
  };
}
function getServerSnapshot(): Date {
  return currentTime;
}
function useNow(): Date {
  return useSyncExternalStore(subscribe, getServerSnapshot, getServerSnapshot);
}
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;
const NowContext = createContext<string | null>(null);
function minutesBetween(now: Date, date: Date): number {
  return Math.floor((now.getTime() - date.getTime()) / 60000);
}
function daysBetween(now: Date, date: Date): number {
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((nowDay.getTime() - dateDay.getTime()) / 86400000);
}
export interface FormattedRelativeDateTimeProps {
  dateString: string;
}
export function FormattedRelativeDateTime(props: FormattedRelativeDateTimeProps): JSX.Element {
  const {
    dateString
  } = props;
  const contextNow = useContext(NowContext);
  if (contextNow != null) {
    const now = useMemo(() => new Date(contextNow), [contextNow]);
    return <RelativeTime dateString={dateString} now={now} />;
  }
  return <LiveRelativeTime dateString={dateString} />;
}
export interface LiveRelativeTimeProps {
  dateString: string;
}
function LiveRelativeTime(props: LiveRelativeTimeProps): JSX.Element {
  const {
    dateString
  } = props;
  const now = useNow();
  return <RelativeTime dateString={dateString} now={now} />;
}
export interface RelativeTimeProps {
  dateString: string;
  now: Date;
}
function RelativeTime(props: RelativeTimeProps): string {
  const {
    dateString,
    now
  } = props;
  const intl = useIntl();
  const date = new Date(dateString);
  const daysDiff = daysBetween(now, date);
  const minutesDiff = minutesBetween(now, date);
  const minutes = Math.max(1, minutesDiff);
  if (minutes < 60) {
    return intl.formatMessage({
      id: "wham.formattedRelativeDateTime.compactMinutesAgo",
      defaultMessage: "{value}m",
      description: "Compact minutes-ago format"
    }, {
      value: minutes
    });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return intl.formatMessage({
      id: "wham.formattedRelativeDateTime.compactHoursAgo",
      defaultMessage: "{value}h",
      description: "Compact hours-ago format"
    }, {
      value: hours
    });
  }
  const days = Math.max(1, daysDiff);
  if (days < DAYS_IN_WEEK) {
    return intl.formatMessage({
      id: "wham.formattedRelativeDateTime.compactDaysAgo",
      defaultMessage: "{value}d",
      description: "Compact days-ago format"
    }, {
      value: days
    });
  }
  if (days < DAYS_IN_MONTH) {
    const weeks = Math.floor(days / DAYS_IN_WEEK);
    return intl.formatMessage({
      id: "wham.formattedRelativeDateTime.compactWeeksAgo",
      defaultMessage: "{value}w",
      description: "Compact weeks-ago format"
    }, {
      value: weeks
    });
  }
  if (days < DAYS_IN_YEAR) {
    const months = Math.floor(days / DAYS_IN_MONTH);
    return intl.formatMessage({
      id: "wham.formattedRelativeDateTime.compactMonthsAgo",
      defaultMessage: "{value}mo",
      description: "Compact months-ago format"
    }, {
      value: months
    });
  }
  const years = Math.floor(days / DAYS_IN_YEAR);
  return intl.formatMessage({
    id: "wham.formattedRelativeDateTime.compactYearsAgo",
    defaultMessage: "{value}y",
    description: "Compact years-ago format"
  }, {
    value: years
  });
}