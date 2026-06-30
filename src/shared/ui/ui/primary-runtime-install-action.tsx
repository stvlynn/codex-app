// Restored from ref/webview/assets/primary-runtime-install-action-Cpk3XYUC.js
// Primary runtime install action helpers restored from the Codex webview bundle.
import { vscodeApiH } from "../../utils/vscode-lsp-types-impl.ts";
import {
  Cn as productLoggerCn,
  Dn as productLoggerDn,
  En as productLoggerEn,
  On as productLoggerOn,
  Tn as productLoggerTn,
} from "../../utils/product-logger.tsx";
import { primaryRuntimeInstallStateSState } from "./primary-runtime-install-state";

export const PRIMARY_RUNTIME_INSTALL_ID = "3026692602";
export const PRIMARY_RUNTIME_RESET_ID = "3502101112";

interface InstallResult {
  status: string;
  bundleVersion?: string | null;
}

interface InstallMetricsInput {
  bundleVersion: string | null;
  durationMs: number;
  release: string | null;
  status: string;
}

function buildInstallMetrics(input: InstallMetricsInput) {
  const { bundleVersion, durationMs, release, status } = input;
  return {
    durationMs,
    release: resolveReleaseMetric(release),
    status: resolveInstallStatusMetric(status),
    ...buildBundleVersionMetric(bundleVersion),
  };
}

export function buildDiagnoseMetrics({
  diagnostics,
  durationMs,
}: {
  diagnostics: {
    installed: boolean;
    problems: unknown[];
    bundleVersion?: string | null;
  };
  durationMs: number;
}) {
  return {
    durationMs,
    problemCount: diagnostics.problems.length,
    status: diagnostics.installed
      ? productLoggerCn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_DIAGNOSE_STATUS_OK
      : productLoggerCn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_DIAGNOSE_STATUS_PROBLEM,
    ...buildBundleVersionMetric(diagnostics.bundleVersion),
  };
}

export function buildFailedInstallMetrics({
  durationMs,
}: {
  durationMs: number;
}) {
  return {
    durationMs,
    status:
      productLoggerCn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_DIAGNOSE_STATUS_FAILED,
  };
}

export function buildResetMetrics({
  bundleVersion,
  durationMs,
  status,
}: {
  bundleVersion: string | null;
  durationMs: number;
  status: string;
}) {
  return {
    durationMs,
    status: resolveResetStatusMetric(status),
    ...buildBundleVersionMetric(bundleVersion),
  };
}

function resolveReleaseMetric(release: string | null): string | undefined {
  switch (release) {
    case "latest":
      return productLoggerOn.CODEX_PRIMARY_RUNTIME_RELEASE_LATEST;
    case "latest-alpha":
      return productLoggerOn.CODEX_PRIMARY_RUNTIME_RELEASE_LATEST_ALPHA;
  }
}

function resolveInstallStatusMetric(status: string): string | undefined {
  switch (status) {
    case "already-current":
      return productLoggerDn.CODEX_PRIMARY_RUNTIME_INSTALL_RESULT_STATUS_ALREADY_CURRENT;
    case "canceled":
      return productLoggerDn.CODEX_PRIMARY_RUNTIME_INSTALL_RESULT_STATUS_CANCELED;
    case "failed":
      return productLoggerDn.CODEX_PRIMARY_RUNTIME_INSTALL_RESULT_STATUS_FAILED;
    case "installed":
      return productLoggerDn.CODEX_PRIMARY_RUNTIME_INSTALL_RESULT_STATUS_INSTALLED;
  }
}

function resolveResetStatusMetric(status: string): string | undefined {
  switch (status) {
    case "already-current":
      return productLoggerTn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_RESET_STATUS_ALREADY_CURRENT;
    case "canceled":
      return productLoggerTn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_RESET_STATUS_CANCELED;
    case "failed":
      return productLoggerTn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_RESET_STATUS_FAILED;
    case "installed":
      return productLoggerTn.CODEX_PRIMARY_RUNTIME_DEPENDENCIES_RESET_STATUS_INSTALLED;
  }
}

function buildBundleVersionMetric(
  bundleVersion: string | null | undefined,
): { bundleVersion: string } | Record<string, never> {
  return bundleVersion == null || bundleVersion.length === 0
    ? {}
    : { bundleVersion };
}

interface InstallPrimaryRuntimeOptions {
  formatMessage: (message: {
    id: string;
    defaultMessage: string;
    description?: string;
  }) => string;
  hostId: string;
  productLogger: {
    logProductEvent: (eventName: string, payload: unknown) => void;
  };
  release: string | null;
  toast: {
    info: (message: string, options?: { id?: string; duration?: number; hasCloseButton?: boolean }) => { close: () => void };
    success: (message: string, options?: { id?: string }) => void;
    danger: (message: string, options?: { id?: string }) => void;
  };
}

export async function installPrimaryRuntime({
  formatMessage,
  hostId,
  productLogger,
  release,
  toast,
}: InstallPrimaryRuntimeOptions): Promise<void> {
  const startTimeMs = Date.now();
  const progressToast = toast.info(
    formatMessage({
      id: "codex.command.installPrimaryRuntime.installing",
      defaultMessage: "Installing Codex runtime…",
      description: "Toast shown while the Codex runtime installer is running",
    }),
    {
      duration: 120,
      hasCloseButton: false,
      id: "install-primary-runtime",
    },
  );
  try {
    const result = (await primaryRuntimeInstallStateSState({
      hostId,
      release,
      request: "install",
    })) as InstallResult;
    productLogger.logProductEvent(
      productLoggerEn,
      buildInstallMetrics({
        bundleVersion: result.bundleVersion ?? null,
        durationMs: Date.now() - startTimeMs,
        release,
        status: result.status,
      }),
    );
    if (result.status === "already-current") {
      toast.info(
        formatMessage({
          id: "codex.command.installPrimaryRuntime.alreadyDownloaded",
          defaultMessage: "Latest Codex runtime is already downloaded",
          description:
            "Toast shown when the Codex runtime installer exits because the latest runtime is already downloaded",
        }),
        {
          id: "install-primary-runtime",
        },
      );
      return;
    }
    toast.success(
      formatMessage({
        id: "codex.command.installPrimaryRuntime.installed",
        defaultMessage: "Codex runtime installed",
        description: "Toast shown when the Codex runtime finishes installing",
      }),
      {
        id: "install-primary-runtime",
      },
    );
  } catch (error) {
    if (isAbortError(error)) {
      productLogger.logProductEvent(
        productLoggerEn,
        buildInstallMetrics({
          bundleVersion: null,
          durationMs: Date.now() - startTimeMs,
          release,
          status: "canceled",
        }),
      );
      toast.info(
        formatMessage({
          id: "codex.command.installPrimaryRuntime.canceled",
          defaultMessage: "Codex runtime install canceled",
          description: "Toast shown when the Codex runtime installer is canceled",
        }),
        {
          id: "install-primary-runtime",
        },
      );
      return;
    }
    vscodeApiH.error("Error installing primary runtime", {
      safe: {
        release,
      },
      sensitive: {
        error,
      },
    });
    productLogger.logProductEvent(
      productLoggerEn,
      buildInstallMetrics({
        bundleVersion: null,
        durationMs: Date.now() - startTimeMs,
        release,
        status: "failed",
      }),
    );
    toast.danger(
      formatMessage({
        id: "codex.command.installPrimaryRuntime.failed",
        defaultMessage: "Couldn’t install Codex runtime",
        description: "Toast shown when the Codex runtime installer fails",
      }),
      {
        id: "install-primary-runtime",
      },
    );
  } finally {
    progressToast.close();
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error || error instanceof DOMException
    ? error.name === "AbortError" ||
        error.message.toLowerCase().includes("aborted")
    : false;
}
