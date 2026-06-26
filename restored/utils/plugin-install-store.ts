// Restored from ref/webview/assets/plugin-install-store-BO7kpZzR.js
// Plugin install state management hook with app connection flow.

import { useState, useCallback } from "react";
export type PluginInstallPhase =
  | "closed"
  | "installing"
  | "details"
  | "needsApps"
  | "connectApp";
export interface PluginInstallApp {
  app: {
    id: string;
  };
  status: "pending" | "connected" | string;
}
export interface PluginInstallSession {
  kind: PluginInstallPhase;
  hostId?: string;
  plugin?: {
    plugin: {
      id: string;
    };
  };
  installStarted?: boolean;
  progressPercent?: number;
  app?: {
    id: string;
  };
  requiredApps?: PluginInstallApp[];
  requiredBrowserExtensions?: unknown[];
  origin?: string;
  postInstallComposerPrefill?: string;
  postInstallNewConversation?: boolean;
  tryInChatCwd?: string;
  telemetry?: unknown;
}
export interface PluginInstallActions {
  claimPluginInstall: (hostId: string, pluginId: string) => boolean;
  closePluginInstallAppConnect: () => void;
  closePluginInstall: () => void;
  markRequiredAppStatus: (params: { appId: string; status: string }) => void;
  openPluginInstallDetails: (plugin: {
    plugin: {
      id: string;
    };
  }) => void;
  openPluginInstall: (
    hostId: string,
    plugin: {
      plugin: {
        id: string;
      };
    },
    options?: Record<string, unknown>,
  ) => void;
  openRequiredAppConnect: (appId: string) => void;
  session: PluginInstallSession;
  setPluginInstallProgress: (percent: number) => void;
  setPluginInstallNeedsApps: (params: {
    apps: {
      id: string;
    }[];
    browserExtensions: unknown[];
    connectingAppId?: string;
    options?: Record<string, unknown>;
    plugin: {
      plugin: {
        id: string;
      };
    };
  }) => void;
}
export function usePluginInstallStore(): PluginInstallActions {
  const [session, setSession] = useState<PluginInstallSession>({
    kind: "closed",
  });
  const claimPluginInstall = useCallback(
    (hostId: string, pluginId: string) => {
      if (
        session.kind !== "installing" ||
        session.hostId !== hostId ||
        session.plugin?.plugin.id !== pluginId ||
        session.installStarted
      ) {
        return false;
      }
      setSession({
        ...session,
        installStarted: true,
      });
      return true;
    },
    [session],
  );
  const openPluginInstall = useCallback(
    (
      hostId: string,
      plugin: {
        plugin: {
          id: string;
        };
      },
      options?: Record<string, unknown>,
    ) => {
      const opts = options ?? {};
      setSession((prev) =>
        prev.kind === "installing"
          ? prev
          : {
              ...opts,
              kind: "installing",
              hostId,
              installStarted: false,
              plugin,
              progressPercent: 0,
            },
      );
    },
    [],
  );
  const openPluginInstallDetails = useCallback(
    (
      plugin: {
        plugin: {
          id: string;
        };
      },
      options?: Record<string, unknown>,
    ) => {
      const opts = options ?? {};
      setSession({
        ...opts,
        kind: "details",
        plugin,
      });
    },
    [],
  );
  const closePluginInstall = useCallback(() => {
    setSession({
      kind: "closed",
    });
  }, []);
  const setPluginInstallProgress = useCallback((percent: number) => {
    setSession((prev) =>
      prev.kind === "installing"
        ? {
            ...prev,
            progressPercent: percent,
          }
        : prev,
    );
  }, []);
  const setPluginInstallNeedsApps = useCallback(
    (params: {
      apps: {
        id: string;
      }[];
      browserExtensions: unknown[];
      connectingAppId?: string;
      options?: Record<string, unknown>;
      plugin: {
        plugin: {
          id: string;
        };
      };
    }) => {
      const { apps, browserExtensions, connectingAppId, options, plugin } =
        params;
      const mappedApps = apps.map((app) => ({
        app,
        status: "pending" as const,
      }));
      const connectedApp = mappedApps.find((a) => a.app.id === connectingAppId);
      if (connectedApp == null) {
        setSession({
          ...options,
          kind: "needsApps",
          plugin,
          requiredApps: mappedApps,
          requiredBrowserExtensions: browserExtensions,
        });
        return;
      }
      setSession({
        ...options,
        kind: "connectApp",
        plugin,
        app: connectedApp.app,
        requiredApps: mappedApps,
        requiredBrowserExtensions: browserExtensions,
      });
    },
    [],
  );
  const openRequiredAppConnect = useCallback((appId: string) => {
    setSession((prev) => {
      if (prev.kind !== "needsApps") return prev;
      const app = prev.requiredApps?.find((a) => a.app.id === appId);
      if (app == null) return prev;
      return {
        ...prev,
        kind: "connectApp",
        app: app.app,
      };
    });
  }, []);
  const closePluginInstallAppConnect = useCallback(() => {
    setSession((prev) => resetToNeedsApps(prev));
  }, []);
  const markRequiredAppStatus = useCallback(
    ({ appId, status }: { appId: string; status: string }) => {
      setSession((prev) => {
        if (prev.kind !== "needsApps" && prev.kind !== "connectApp")
          return prev;
        return {
          ...prev,
          requiredApps: prev.requiredApps?.map((a) =>
            a.app.id === appId
              ? {
                  ...a,
                  status,
                }
              : a,
          ),
        };
      });
    },
    [],
  );
  return {
    claimPluginInstall,
    closePluginInstallAppConnect,
    closePluginInstall,
    markRequiredAppStatus,
    openPluginInstallDetails,
    openPluginInstall,
    openRequiredAppConnect,
    session,
    setPluginInstallProgress,
    setPluginInstallNeedsApps,
  };
}
function resetToNeedsApps(session: PluginInstallSession): PluginInstallSession {
  if (session.kind !== "connectApp") return session;
  const isSingleApp =
    session.requiredApps?.length === 1 &&
    session.requiredBrowserExtensions?.length === 0 &&
    session.requiredApps?.[0]?.status !== "connected";
  if (isSingleApp) {
    return {
      kind: "closed",
    };
  }
  return {
    kind: "needsApps",
    origin: session.origin,
    postInstallComposerPrefill: session.postInstallComposerPrefill,
    postInstallNewConversation: session.postInstallNewConversation,
    plugin: session.plugin,
    requiredApps: session.requiredApps,
    requiredBrowserExtensions: session.requiredBrowserExtensions,
    tryInChatCwd: session.tryInChatCwd,
    telemetry: session.telemetry,
  };
}
