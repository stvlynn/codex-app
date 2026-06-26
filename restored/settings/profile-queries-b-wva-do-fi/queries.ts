// Restored from ref/webview/assets/profile-queries-BWvaDOFi.js
// ProfileQueries query configuration and data fetching.
import { C, h, l, v } from "../../boundaries/vscode-api";
import { Sn } from "../../boundaries/zod";
import { c as useStatsigClient } from "@statsig/js-client";
import { encodeBytesToBase64 } from "../../utils/base64";
import { apiClient } from "../../utils/request-client";
import type { DailyUsageEntry } from "./usage-stats";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface ProfileUsageOptions {
  accountId?: string | null;
  userId?: string | null;
  enabled?: boolean;
}
export interface ActivityInsights {
  fastModePercent: number | null;
  invocations: unknown[] | null;
  reasoningEffort: string | null;
  reasoningEffortPercent: number | null;
  skillsExplored: number | null;
  totalSkillsUsed: number | null;
  totalThreads: number | null;
}
export interface ProfileSummary {
  currentStreakDays: number | null;
  longestStreakDays: number | null;
  longestTaskDurationMs: number | null;
  peakTokens: number | null;
  totalTextTokens: number | null;
}
export interface ProfileData {
  activityInsights: ActivityInsights | null;
  dailyUsage: DailyUsageEntry[] | null;
  displayName: string | null;
  hasStatsError: boolean;
  imageUrl: string | null;
  summary: ProfileSummary | null;
  username: string | null;
}
export interface ProfileUsageQueryConfig {
  queryKey: (string | null)[];
  enabled: boolean;
  queryFn: () => Promise<ProfileData>;
  staleTime: number;
}
export class PhotoUploadError extends Error {
  constructor(public readonly uploadError: unknown) {
    super("Profile photo upload failed");
  }
}
export class UsernameValidationError extends Error {
  public readonly reason: string;
  constructor(reason: string) {
    super(reason);
    this.reason = reason;
  }
}

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const PROFILE_USAGE_STALE_TIME_KEY = "profile_usage_query_stale_time_ms";
const PROFILE_USAGE_WARM_FETCH_KEY = "profile_usage_warm_fetch_enabled";

// ------------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------------

function buildProfileQueryKey({
  accountId,
  userId,
}: {
  accountId?: string | null;
  userId?: string | null;
}): (string | null)[] {
  return ["profile", "usage", userId ?? null, accountId ?? null];
}
function parseActivityInsights(
  stats: Record<string, unknown>,
): ActivityInsights | null {
  if (!stats) return null;
  return {
    fastModePercent: (stats.fast_mode_usage_percentage as number) ?? null,
    invocations: (stats.top_invocations as unknown[]) ?? null,
    reasoningEffort: (stats.most_used_reasoning_effort as string) ?? null,
    reasoningEffortPercent:
      (stats.most_used_reasoning_effort_percentage as number) ?? null,
    skillsExplored: (stats.unique_skills_used as number) ?? null,
    totalSkillsUsed: (stats.total_skills_used as number) ?? null,
    totalThreads: (stats.total_threads as number) ?? null,
  };
}
async function fetchProfileData(): Promise<ProfileData> {
  const response = await apiClient.safeGet<{
    profile: {
      display_name?: string;
      username?: string;
      profile_picture_url?: string;
    };
    stats: Record<string, unknown>;
    metadata: {
      stats_error?: string;
    };
    daily_usage_buckets?: {
      tokens: number;
      start_date: string;
    }[];
  }>("/wham/profiles/me");
  return {
    activityInsights: parseActivityInsights(response.stats),
    dailyUsage:
      response.daily_usage_buckets == null
        ? null
        : response.daily_usage_buckets.map((item) => ({
            credits: item.tokens,
            date: item.start_date,
          })),
    displayName: response.profile.display_name?.trim() || null,
    hasStatsError: !!response.metadata.stats_error?.trim(),
    imageUrl: response.profile.profile_picture_url?.trim() || null,
    summary: {
      currentStreakDays: (response.stats.current_streak_days as number) ?? null,
      longestStreakDays: (response.stats.longest_streak_days as number) ?? null,
      longestTaskDurationMs:
        response.stats.longest_running_turn_sec == null
          ? null
          : (response.stats.longest_running_turn_sec as number) * 1000,
      peakTokens: (response.stats.peak_daily_tokens as number) ?? null,
      totalTextTokens: (response.stats.lifetime_tokens as number) ?? null,
    },
    username: response.profile.username?.trim() || null,
  };
}
function generateMultipartBoundary(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `----codex-profile-photo-${crypto.randomUUID()}`
    : `----codex-profile-photo-${Math.random().toString(36).slice(2)}`;
}
async function encodePhotoForUpload(
  file: File,
  boundary: string,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const contentType = file.type.trim() || "application/octet-stream";
  const filename = file.name.trim().replace(/[\r\n"]/g, "") || "profile-photo";
  const parts = [
    encoder.encode(`--${boundary}\r\n`),
    encoder.encode(
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`,
    ),
    encoder.encode(`Content-Type: ${contentType}\r\n\r\n`),
    fileBytes,
    encoder.encode(`\r\n--${boundary}--\r\n`),
  ];
  const totalLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.byteLength;
  }
  return result;
}
export async function uploadProfilePhoto(file: File): Promise<string> {
  const boundary = generateMultipartBoundary();
  const encoded = await encodePhotoForUpload(file, boundary);
  const response = await l
    .getInstance()
    .post("/wham/profiles/me/photo", encodeBytesToBase64(encoded), {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      [Sn]: "1",
    });
  return response.body.asset_pointer as string;
}
export async function updateProfileFields(
  fields: Record<string, unknown>,
): Promise<unknown> {
  return apiClient.safePatch("/wham/profiles/me", {
    requestBody: fields,
  });
}

// ------------------------------------------------------------------
// Query config
// ------------------------------------------------------------------

export function useProfileUsageQuery(
  options: ProfileUsageOptions,
): ProfileUsageQueryConfig {
  const { accountId, userId, enabled = true } = options;
  const statsigClient = useStatsigClient("3503973010");
  const staleTime = statsigClient.get(
    PROFILE_USAGE_STALE_TIME_KEY,
    SIX_HOURS_MS,
  );
  const queryKey = buildProfileQueryKey({
    accountId,
    userId,
  });
  const queryFn = async (): Promise<ProfileData> => {
    const hasAccountId = accountId != null;
    const hasUserId = userId != null;
    if (!hasAccountId || !hasUserId) {
      h("profile_usage_query_started_without_identity", {
        safe: {
          hasAccountId,
          hasUserId,
        },
        sensitive: {},
      });
    }
    try {
      return await fetchProfileData();
    } catch (error) {
      const safeError = error instanceof C ? error : null;
      h("profile_usage_query_failed", {
        safe: {
          errorCode: safeError?.errorCode ?? null,
          hasAccountId,
          hasUserId,
          status: safeError?.status ?? null,
        },
        sensitive: {},
      });
      throw error;
    }
  };
  return v({
    queryKey,
    enabled: enabled && true,
    queryFn,
    staleTime,
  });
}
export function useProfileUsageWarmFetchEnabled(): boolean {
  const statsigClient = useStatsigClient("3503973010");
  return statsigClient.get(PROFILE_USAGE_WARM_FETCH_KEY, true);
}
