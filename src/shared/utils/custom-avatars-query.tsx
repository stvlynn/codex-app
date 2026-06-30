// Restored from ref/webview/assets/custom-avatars-query-CtItijR_.js
// CustomAvatarsQuery chunk restored from the Codex webview bundle.
import {
  M as createQuery,
  O as getQueryClient,
  P as createSuspenseQuery,
  T as queryClient,
} from "../boundaries/tanstack-query";
import { u as queryConstants } from "../boundaries/vscode-api";
import { X as avatarSettingsSchema } from "../boundaries/zod";
import { getSettingValue, updateSetting } from "./setting-storage";
import { N as customAvatarsRpc } from "../../entities/host/rpc-app-services.ts";
export interface CustomAvatar {
  assetRef: string;
  description?: string;
  displayName: string;
  id: string;
  spritesheetUrl?: string;
}
export const DEFAULT_AVATARS: CustomAvatar[] = [
  {
    assetRef: "codex",
    description: "The original Codex companion.",
    displayName: "Codex",
    id: "codex",
  },
  {
    assetRef: "dewey",
    description: "A tidy duck for calm workspace days.",
    displayName: "Dewey",
    id: "dewey",
  },
  {
    assetRef: "fireball",
    description: "Hot path energy for fast iteration.",
    displayName: "Fireball",
    id: "fireball",
  },
  {
    assetRef: "hoots",
    description: "A sharp-eyed owl for polished work in a blink.",
    displayName: "Hoots",
    id: "hoots",
  },
  {
    assetRef: "rocky",
    description: "A steady rock when the diff gets large.",
    displayName: "Rocky",
    id: "rocky",
  },
  {
    assetRef: "seedy",
    description: "Small green shoots for new ideas.",
    displayName: "Seedy",
    id: "seedy",
  },
  {
    assetRef: "stacky",
    description: "A balanced stack for deep work.",
    displayName: "Stacky",
    id: "stacky",
  },
  {
    assetRef: "bsod",
    description: "A tiny blue-screen gremlin.",
    displayName: "BSOD",
    id: "bsod",
  },
  {
    assetRef: "null-signal",
    description: "Quiet signal from the void.",
    displayName: "Null Signal",
    id: "null-signal",
  },
];
export function mergeAvatarsWithDefaults(
  customAvatars: CustomAvatar[] | null | undefined,
): CustomAvatar[] {
  if (customAvatars == null || customAvatars.length === 0) {
    return DEFAULT_AVATARS;
  }
  return [
    ...DEFAULT_AVATARS,
    ...customAvatars.map((avatar) => ({
      assetRef: "codex",
      description: avatar.description,
      displayName: avatar.displayName,
      id: avatar.id,
      spritesheetUrl: avatar.spritesheetUrl,
    })),
  ];
}
function findAvatarById(
  avatarId: string,
  avatars: CustomAvatar[] = DEFAULT_AVATARS,
): CustomAvatar {
  return (
    avatars.find((avatar) => avatar.id === avatarId) ??
    avatars.find((avatar) => avatar.id === "codex") ??
    avatars[0] ??
    DEFAULT_AVATARS[0]
  );
}
export function isCustomAvatarId(
  selectedAvatar: CustomAvatar,
  avatarId: string,
): boolean {
  return (
    avatarId.startsWith("custom:") === true && selectedAvatar.id !== avatarId
  );
}
export interface UseSelectedAvatarResult {
  selectedAvatar: CustomAvatar;
  selectedAvatarId: string;
  setSelectedAvatarId: (avatarId: string) => void;
}
export function useSelectedAvatar(
  avatars?: CustomAvatar[],
): UseSelectedAvatarResult {
  const client = getQueryClient(queryClient);
  const selectedAvatarId = getSettingValue<string>(
    avatarSettingsSchema.selectedAvatarId,
  );
  const selectedAvatar = findAvatarById(selectedAvatarId, avatars);
  const setSelectedAvatarId = (avatarId: string): void => {
    updateSetting(client, avatarSettingsSchema.selectedAvatarId, avatarId);
  };
  return {
    selectedAvatar,
    selectedAvatarId,
    setSelectedAvatarId,
  };
}
export const CUSTOM_AVATARS_QUERY_KEY = ["custom-avatars"];
export const customAvatarsQuery = createQuery(queryClient, () => ({
  queryKey: CUSTOM_AVATARS_QUERY_KEY,
  queryFn: () => customAvatarsRpc.customAvatars.load(),
  enabled: true,
  networkMode: "always",
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  staleTime: queryConstants.INFINITE,
}));
export const selectCustomAvatarQuery = createSuspenseQuery(
  queryClient,
  (
    avatarId: string,
    {
      get,
      scope,
    }: {
      get: (query: unknown) => {
        data?: {
          avatars: CustomAvatar[];
        };
      };
      scope: {
        query: {
          invalidate: (query: unknown, options: unknown) => Promise<unknown>;
          fetch: (query: unknown) => Promise<unknown>;
        };
      };
    },
  ) => ({
    queryKey: [...CUSTOM_AVATARS_QUERY_KEY, "selected", avatarId],
    queryFn: async () => {
      await scope.query.invalidate(customAvatarsQuery, {
        exact: true,
        refetchType: "none",
      });
      return scope.query.fetch(customAvatarsQuery);
    },
    enabled:
      avatarId.startsWith("custom:") &&
      get(customAvatarsQuery).data?.avatars.some(
        ({ id }) => id === avatarId,
      ) !== true,
    gcTime: 0,
    networkMode: "always",
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: queryConstants.INFINITE,
  }),
);
