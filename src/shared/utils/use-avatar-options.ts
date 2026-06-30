// Restored from ref/webview/assets/use-avatar-options-CgrFoUM_.js
// Hook that returns the list of avatar options for the user picker.
import { S as useQuery } from "../boundaries/tanstack-query";
import {
  customAvatarsQuery,
  mergeAvatarsWithDefaults,
} from "../utils/custom-avatars-query";
export interface UseAvatarOptionsResult {
  avatarDirectory: string | null;
  avatarOptions: import("../utils/custom-avatars-query").CustomAvatar[];
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
}
export function useAvatarOptions(): UseAvatarOptionsResult {
  const { data, isError, isFetching, isLoading } = useQuery(customAvatarsQuery);
  const avatarDirectory = data?.avatarDirectory ?? null;
  const avatars = data?.avatars;
  const avatarOptions = mergeAvatarsWithDefaults(avatars);
  return {
    avatarDirectory,
    avatarOptions,
    isError,
    isFetching,
    isLoading,
  };
}
