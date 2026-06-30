// Restored from ref/webview/assets/microphone-input-C25vVSUx.js
// MicrophoneInput chunk restored from the Codex webview bundle.
import { useSettingValue } from "../utils/setting-storage";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface AudioConstraints {
  channelCount?: number;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function buildAudioConstraints(
  deviceId: string | null,
  { channelCount }: AudioConstraints = {},
): MediaTrackConstraints {
  if (deviceId == null) {
    return channelCount == null
      ? {}
      : {
          channelCount,
        };
  }
  if (channelCount == null) {
    return {
      deviceId: {
        exact: deviceId,
      },
    };
  }
  return {
    channelCount,
    deviceId: {
      exact: deviceId,
    },
  };
}
function isDeviceNotFoundError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "NotFoundError" || error.name === "OverconstrainedError")
  );
}
async function getFallbackAudioStream(
  constraints: AudioConstraints = {},
): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: buildAudioConstraints(null, constraints),
    });
  } catch (error) {
    if (
      !(error instanceof DOMException) ||
      error.name !== "NotSupportedError"
    ) {
      throw error;
    }
    const fallbackDevice = (
      await navigator.mediaDevices.enumerateDevices()
    ).find(
      (device) =>
        device.kind === "audioinput" &&
        device.deviceId.length > 0 &&
        device.deviceId !== "default",
    );
    if (fallbackDevice == null) {
      throw error;
    }
    return navigator.mediaDevices.getUserMedia({
      audio: buildAudioConstraints(fallbackDevice.deviceId, constraints),
    });
  }
}

// ------------------------------------------------------------------
// Main API
// ------------------------------------------------------------------

/**
 * Requests microphone access, optionally using a preferred device ID from
 * settings. Falls back to any available audio input if the preferred device
 * is unavailable.
 */
export async function requestMicrophoneStream(
  constraints: AudioConstraints = {},
): Promise<MediaStream> {
  const preferredDeviceId = await useSettingValue<string | null>({
    key: "microphoneInputDeviceId",
    default: null,
  });
  if (preferredDeviceId == null) {
    return getFallbackAudioStream(constraints);
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: buildAudioConstraints(preferredDeviceId, constraints),
    });
  } catch (error) {
    if (!isDeviceNotFoundError(error)) {
      throw error;
    }
    return getFallbackAudioStream(constraints);
  }
}
