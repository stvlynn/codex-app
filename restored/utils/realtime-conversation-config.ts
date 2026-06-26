// Restored from ref/webview/assets/realtime-conversation-config-ldDeUVCM.js
import {
  s as useAtomValue,
  t as queryClient,
} from "../boundaries/tanstack-query";
import {
  a as useSuspenseQuery,
  u as queryConstants,
} from "../boundaries/vscode-api";
import {
  aa as zodAny,
  ma as zodObject,
  oa as zodOptional,
} from "../boundaries/zod";
import { getPersistedAtomItem } from "../utils/persisted-atom-store";
import { a as useGateValue } from "../boundaries/statsig";
import { persistedSignalT } from "../utils/persisted-signal";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface RealtimeVoiceConfigOverride {
  enabled: boolean;
  config: string;
}
export interface RealtimeConversationConfig {
  /* Full config shape from Statsig */
}
export interface ResolvedRealtimeConfig {
  error: string | null;
  source: "statsig" | "local-override";
  value: RealtimeConversationConfig;
  canUseLocalOverride: boolean;
  isReady: boolean;
  override: RealtimeVoiceConfigOverride;
  statsigValue: RealtimeConversationConfig;
}

// ------------------------------------------------------------------
// Default override state
// ------------------------------------------------------------------

const DEFAULT_OVERRIDE: RealtimeVoiceConfigOverride = {
  enabled: false,
  config: "",
};
export const realtimeVoiceConfigOverrideSignal = persistedSignalT(
  "realtime-voice-config-override",
  DEFAULT_OVERRIDE,
);

// ------------------------------------------------------------------
// Zod schema for local override validation
// ------------------------------------------------------------------

const localOverrideSchema = zodObject({
  /* schema fields from src-l0hbMZ-p */
});

// ------------------------------------------------------------------
// Main config hook
// ------------------------------------------------------------------

export function useRealtimeConversationConfig(): ResolvedRealtimeConfig {
  const statsigValue = useGateValue("1193530394");
  const { data: isPackaged } = useSuspenseQuery<{
    enabled: boolean;
  }>({
    queryKey: ["is-packaged"],
    staleTime: queryConstants.FIVE_SECONDS,
  });
  const override =
    useAtomValue(realtimeVoiceConfigOverrideSignal) ??
    getPersistedAtomItem("realtime-voice-config-override", DEFAULT_OVERRIDE);
  const canUseLocalOverride = false; // disabled in production

  const resolved = resolveConfig(statsigValue, {
    canUseLocalOverride,
    override,
  });
  return {
    ...resolved,
    canUseLocalOverride,
    isReady: true,
    override,
    statsigValue,
  };
}

// ------------------------------------------------------------------
// Config resolution logic
// ------------------------------------------------------------------

function resolveConfig(
  statsigConfig: RealtimeConversationConfig,
  options: {
    canUseLocalOverride: boolean;
    override: RealtimeVoiceConfigOverride;
  },
): {
  error: string | null;
  source: "statsig" | "local-override";
  value: RealtimeConversationConfig;
} {
  if (!options.canUseLocalOverride || !options.override.enabled) {
    return {
      error: null,
      source: "statsig",
      value: statsigConfig,
    };
  }
  const parsed = parseLocalOverride(options.override.config);
  if (parsed == null) {
    return {
      error: "Local realtime config override must be a valid JSON object.",
      source: "statsig",
      value: statsigConfig,
    };
  }
  return {
    error: null,
    source: "local-override",
    value: {
      ...statsigConfig,
      ...parsed,
    },
  };
}
function parseLocalOverride(
  configJson: string,
): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(configJson);
    const result = localOverrideSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
