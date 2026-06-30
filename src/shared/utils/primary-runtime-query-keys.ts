// Restored from ref/webview/assets/primary-runtime-query-keys-BCEaoICN.js
import { f as dispatchMessage, h as log } from "../boundaries/vscode-api";
import {
  f as runtimeConfigKey,
  i as defaultRuntimeConfig,
  l as zodSchema,
} from "../boundaries/zod";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface RuntimeInstallConfig {
  /* Parsed by zod schema below */
}

export interface RuntimeConfigResult {
  source: "default" | "statsig-layer";
  value: RuntimeInstallConfig;
}

// ------------------------------------------------------------------
// Query keys
// ------------------------------------------------------------------

export const PRIMARY_RUNTIME_QUERY_KEYS = [
  "app-host",
  "primary-runtime",
  "update-status",
] as const;

export function buildDiagnosticsQueryKey(
  conversationId: string,
): [string, string, string, string] {
  return ["app-host", "primary-runtime", "diagnostics", conversationId];
}

// ------------------------------------------------------------------
// Statsig runtime config refresh
// ------------------------------------------------------------------

export async function refreshCodexRuntimeConfig(
  statsigClient: StatsigClient,
): Promise<void> {
  try {
    const updateResult = await statsigClient.updateUserAsync(
      statsigClient.getContext().user,
    );
    if (!updateResult.success) {
      log.warning("Failed to refresh Codex runtime config from Statsig", {
        safe: {},
        sensitive: { updateDetails: updateResult },
      });
    }
  } catch (error) {
    log.warning("Failed to refresh Codex runtime config from Statsig", {
      safe: {},
      sensitive: { error },
    });
  }

  const config = selectRuntimeConfig(statsigClient);
  logRuntimeConfigSelected(config);
}

// ------------------------------------------------------------------
// Runtime config selection
// ------------------------------------------------------------------

export function selectRuntimeConfig(
  statsigClient: StatsigClient,
): RuntimeConfigResult {
  const rawConfig = statsigClient
    .getLayer("2096615506")
    .get(runtimeConfigKey, defaultRuntimeConfig);
  const parseResult = zodSchema.safeParse(rawConfig);

  if (!parseResult.success) {
    log.info("Invalid Codex runtime install config; using default runtime", {
      safe: {},
      sensitive: {
        runtimeInstallConfig: rawConfig,
        error: parseResult.error,
      },
    });
  }

  return {
    source: rawConfig === defaultRuntimeConfig ? "default" : "statsig-layer",
    value: parseResult.success ? parseResult.data : defaultRuntimeConfig,
  };
}

// ------------------------------------------------------------------
// Logging
// ------------------------------------------------------------------

export function logRuntimeConfigSelected(result: RuntimeConfigResult): void {
  log.info("Codex runtime config selected", {
    safe: {
      artifact: runtimeConfigKey,
      source: result.source,
    },
    sensitive: {
      runtimeInstallConfig: result.value,
    },
  });

  dispatchMessage("codex-runtimes-config-changed", {
    config: wrapRuntimeConfig(result.value),
  });
}

function wrapRuntimeConfig(config: RuntimeInstallConfig): {
  runtimes: Record<string, RuntimeInstallConfig>;
} {
  return {
    runtimes: {
      [runtimeConfigKey]: config,
    },
  };
}

// ------------------------------------------------------------------
// Statsig client stub (boundary type)
// ------------------------------------------------------------------

interface StatsigClient {
  updateUserAsync(user: unknown): Promise<{ success: boolean }>;
  getContext(): { user: unknown };
  getLayer(layerName: string): {
    get<T>(key: string, fallback: T): T;
  };
}
