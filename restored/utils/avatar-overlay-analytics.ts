// Restored from ref/webview/assets/avatar-overlay-analytics-Ene8S7OJ.js
// avatar-overlay-analytics-Ene8S7OJ chunk restored from the Codex webview bundle.
import { J as PetKind, q as NotificationSource } from "./product-logger.tsx";
export interface AvatarOverlayAnalyticsParams {
  action: string;
  hasRunningCloudSession?: boolean;
  hasRunningLocalSession?: boolean;
  isNotificationTrayOpen?: boolean;
  notification?: {
    source: "cloud" | "local";
  } | null;
  notificationCount?: number | null;
  selectedAvatar: {
    id: string;
  };
  source: string;
}
export interface AvatarOverlayAnalyticsEvent {
  action: string;
  source: string;
  petKind: string;
  builtInPetId?: string;
  notificationCount?: number;
  notificationSource?: string;
  hasRunningLocalSession?: boolean;
  hasRunningCloudSession?: boolean;
  isNotificationTrayOpen?: boolean;
}
export function buildAvatarOverlayAnalyticsEvent({
  action,
  hasRunningCloudSession,
  hasRunningLocalSession,
  isNotificationTrayOpen,
  notification,
  notificationCount,
  selectedAvatar,
  source,
}: AvatarOverlayAnalyticsParams): AvatarOverlayAnalyticsEvent {
  const event: AvatarOverlayAnalyticsEvent = {
    action,
    source,
    petKind: selectedAvatar.id.startsWith("custom:")
      ? PetKind.CODEX_AVATAR_OVERLAY_PET_KIND_CUSTOM
      : PetKind.CODEX_AVATAR_OVERLAY_PET_KIND_BUILT_IN,
  };
  if (!selectedAvatar.id.startsWith("custom:")) {
    event.builtInPetId = selectedAvatar.id;
  }
  if (notificationCount != null) {
    event.notificationCount = notificationCount;
  }
  if (notification != null) {
    event.notificationSource =
      notification.source === "cloud"
        ? NotificationSource.CODEX_AVATAR_OVERLAY_NOTIFICATION_SOURCE_CLOUD
        : NotificationSource.CODEX_AVATAR_OVERLAY_NOTIFICATION_SOURCE_LOCAL;
  }
  if (hasRunningLocalSession != null) {
    event.hasRunningLocalSession = hasRunningLocalSession;
  }
  if (hasRunningCloudSession != null) {
    event.hasRunningCloudSession = hasRunningCloudSession;
  }
  if (isNotificationTrayOpen != null) {
    event.isNotificationTrayOpen = isNotificationTrayOpen;
  }
  return event;
}
