// Restored from ref/webview/assets/profile-queries-BWvaDOFi.js
// ProfileQueries usage-stats helpers.

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface DailyUsageEntry {
  credits: number;
  date: string;
}
export interface UsageStatsResult {
  dailyUsage: DailyUsageEntry[];
  todayIso: string;
}
export interface UsageStatsView {
  dailyUsage: DailyUsageEntry[];
  todayIso: string;
  view: "cumulative" | "daily" | "weekly";
}

// ------------------------------------------------------------------
// Date helpers
// ------------------------------------------------------------------

function getWeekStartIso(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}
function addDaysToIso(dateIso: string, days: number): string {
  const date = new Date(`${dateIso}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function getWeekColumnCount(todayIso: string): number {
  const todayTime = new Date(
    `${getWeekStartIso(todayIso)}T00:00:00.000Z`,
  ).getTime();
  const epochTime = new Date("2025-07-13T00:00:00.000Z").getTime();
  const weeksSinceEpoch = Math.floor((todayTime - epochTime) / 604800000);
  return Math.min(52, Math.max(1, weeksSinceEpoch + 1));
}
function getStartDateIso(todayIso: string): string {
  const columnCount = getWeekColumnCount(todayIso);
  return addDaysToIso(getWeekStartIso(todayIso), -(columnCount - 1) * 7);
}

// ------------------------------------------------------------------
// Usage computation
// ------------------------------------------------------------------

function buildDailyUsageMap(entries: DailyUsageEntry[]): Map<string, number> {
  return entries.reduce((map, entry) => {
    map.set(
      entry.date,
      (map.get(entry.date) ?? 0) + Math.max(0, entry.credits),
    );
    return map;
  }, new Map<string, number>());
}
function expandDailyUsage({
  columnCount,
  dailyUsage,
  startDateIso,
  todayIso,
}: {
  columnCount: number;
  dailyUsage: DailyUsageEntry[];
  startDateIso: string;
  todayIso: string;
}): number[] {
  const usageMap = buildDailyUsageMap(
    dailyUsage.filter((entry) => entry.date <= todayIso),
  );
  return Array.from(
    {
      length: columnCount * 7,
    },
    (_, index) => usageMap.get(addDaysToIso(startDateIso, index)) ?? 0,
  );
}
function bucketToWeekly(daily: number[]): number[] {
  return Array.from(
    {
      length: Math.ceil(daily.length / 7),
    },
    (_, weekIndex) =>
      daily
        .slice(weekIndex * 7, weekIndex * 7 + 7)
        .reduce((sum, val) => sum + val, 0),
  );
}
function cumulativeSum(values: number[]): number[] {
  return values.reduce((acc, current) => {
    acc.push((acc.at(-1) ?? 0) + current);
    return acc;
  }, [] as number[]);
}
function normalizeToLevels(values: number[]): (number | null)[] {
  const maxValue = values.reduce((max, val) => Math.max(max, val), 0);
  return values.map((val) =>
    maxValue <= 0 || val <= 0
      ? 0
      : Math.max(1, Math.ceil((val / maxValue) * 7)),
  );
}
function mapToIntensityLevels(values: number[]): number[] {
  const maxValue = values.reduce((max, val) => Math.max(max, val), 0);
  return values.map((val) => {
    if (val <= 0 || maxValue <= 0) return 0;
    const ratio = val / maxValue;
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
  });
}
function getUsageStats({ dailyUsage, todayIso }: UsageStatsResult): number[] {
  return expandDailyUsage({
    columnCount: getWeekColumnCount(todayIso),
    dailyUsage,
    startDateIso: getStartDateIso(todayIso),
    todayIso,
  });
}

// ------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------

export function getDailyUsageStats({
  dailyUsage,
  todayIso,
}: UsageStatsResult): (number | null)[] {
  return mapToIntensityLevels(
    getUsageStats({
      dailyUsage,
      todayIso,
    }),
  );
}
export function getWeeklyUsageStats({
  dailyUsage,
  todayIso,
}: UsageStatsResult): number[] {
  return normalizeToLevels(
    bucketToWeekly(
      getUsageStats({
        dailyUsage,
        todayIso,
      }),
    ),
  );
}
export function getCumulativeUsageStats({
  dailyUsage,
  todayIso,
}: UsageStatsResult): number[] {
  return normalizeToLevels(
    cumulativeSum(
      bucketToWeekly(
        getUsageStats({
          dailyUsage,
          todayIso,
        }),
      ),
    ),
  );
}
export function getUsageStatsForView({
  dailyUsage,
  todayIso,
  view,
}: UsageStatsView): (number | null)[] | number[] {
  switch (view) {
    case "cumulative":
      return getCumulativeUsageStats({
        dailyUsage,
        todayIso,
      });
    case "daily":
      return getDailyUsageStats({
        dailyUsage,
        todayIso,
      });
    case "weekly":
      return getWeeklyUsageStats({
        dailyUsage,
        todayIso,
      });
  }
}
export function getCompactWeeklyUsageStats({
  dailyUsage,
  todayIso,
}: UsageStatsResult): (number | null)[] {
  const startDate = addDaysToIso(getWeekStartIso(todayIso), -175);
  const daily = expandDailyUsage({
    columnCount: 26,
    dailyUsage,
    startDateIso: startDate,
    todayIso,
  });
  return mapToIntensityLevels(daily).map((level, index) =>
    addDaysToIso(startDate, index) > todayIso ? null : level,
  );
}
export function getWeeklyUsageStatsRaw({
  dailyUsage,
  todayIso,
}: UsageStatsResult): number[] {
  return getUsageStats({
    dailyUsage,
    todayIso,
  });
}
export function getDateForWeekIndex(
  todayIso: string,
  weekIndex: number,
): string {
  return addDaysToIso(getStartDateIso(todayIso), weekIndex);
}
export function formatDateToIso(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
