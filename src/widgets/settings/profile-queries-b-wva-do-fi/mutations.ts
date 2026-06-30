// Restored from ref/webview/assets/profile-queries-BWvaDOFi.js
// ProfileQueries mutation helpers.
import { A, _ } from "../../boundaries/vscode-api";
import { uploadProfilePhoto, updateProfileFields } from "./queries";
import type { ProfileData } from "./queries";
import { sanitizeUsernameInput, validateUsername } from "./formatting";
import { UsernameValidationError } from "./queries";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface ProfileMutationConfig {
  mutationFn: (input: {
    displayName?: string;
    photo?: File;
  }) => Promise<unknown>;
  onSuccess: (response: unknown) => void;
}
export interface UsernameMutationConfig {
  mutationFn: (username: string) => Promise<unknown>;
  onSuccess: (response: unknown, variables: string) => void;
}
export interface PhotoMutationConfig {
  mutationFn: (file: File) => Promise<unknown>;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function updateProfileCache(
  queryClient: ReturnType<typeof A>,
  queryKey: (string | null)[],
  updater: (data: ProfileData) => Partial<ProfileData>,
): void {
  const existing = queryClient.getQueryData<ProfileData>(queryKey);
  if (existing != null) {
    queryClient.setQueryData(queryKey, {
      ...existing,
      ...updater(existing),
    });
  }
}
function buildProfileQueryKey({
  accountId,
  userId,
}: {
  accountId?: string | null;
  userId?: string | null;
}): (string | null)[] {
  return ["profile", "usage", userId ?? null, accountId ?? null];
}

// ------------------------------------------------------------------
// Mutations
// ------------------------------------------------------------------

export function useUpdateProfileMutation(options: {
  accountId?: string | null;
  userId?: string | null;
}): ProfileMutationConfig {
  const { accountId, userId } = options;
  const queryClient = A();
  const queryKey = buildProfileQueryKey({
    accountId,
    userId,
  });
  return _({
    mutationFn: async (input: { displayName?: string; photo?: File }) => {
      const fields: Record<string, unknown> = {};
      if (input.displayName != null) {
        fields.display_name = input.displayName;
      }
      if (input.photo != null) {
        fields.profile_asset_pointer = await uploadProfilePhoto(input.photo);
      }
      return updateProfileFields(fields);
    },
    onSuccess: (response: unknown) => {
      const responseData = response as {
        profile?: {
          display_name?: string;
          profile_picture_url?: string;
        };
        stats?: Record<string, unknown>;
        metadata?: {
          stats_error?: string;
        };
      };
      updateProfileCache(queryClient, queryKey, (existing) => ({
        activityInsights: responseData.stats
          ? {
              ...existing.activityInsights,
            }
          : existing.activityInsights,
        displayName: responseData.profile?.display_name?.trim() || null,
        hasStatsError: !!responseData.metadata?.stats_error?.trim(),
        imageUrl: responseData.profile?.profile_picture_url?.trim() || null,
      }));
    },
  });
}
export function useUpdateUsernameMutation(options: {
  accountId?: string | null;
  userId?: string | null;
}): UsernameMutationConfig {
  const { accountId, userId } = options;
  const queryClient = A();
  const queryKey = buildProfileQueryKey({
    accountId,
    userId,
  });
  return _({
    mutationFn: async (username: string) => {
      const validation = validateUsername(username);
      if (!validation.ok) {
        throw new UsernameValidationError(validation.reason);
      }
      await updateProfileFields({
        username: validation.username,
      });
    },
    onSuccess: (_response: unknown, username: string) => {
      const existing = queryClient.getQueryData<ProfileData>(queryKey);
      if (existing != null) {
        queryClient.setQueryData(queryKey, {
          ...existing,
          username: sanitizeUsernameInput(username) || null,
        });
      }
    },
  });
}
export function useUpdatePhotoMutation(options: {
  accountId?: string | null;
  userId?: string | null;
}): PhotoMutationConfig {
  const { accountId, userId } = options;
  const queryClient = A();
  const queryKey = buildProfileQueryKey({
    accountId,
    userId,
  });
  return _({
    mutationFn: async (file: File) => {
      const imageUrl = await uploadProfilePhoto(file);
      const existing = queryClient.getQueryData<ProfileData>(queryKey);
      if (existing != null) {
        queryClient.setQueryData(queryKey, {
          ...existing,
          imageUrl,
        });
      }
    },
  });
}
