// Restored from ref/webview/assets/selectable-remote-connections-signal-DIsHsJK7.js
// Selectable remote-connections signal helpers restored from the Codex webview bundle.
import { appScopeC, appScopeT } from "../boundaries/app-scope";
import { useHostConfigS } from "../boundaries/host-config";
import { threadContextInputsQi } from "../../app/thread-context-inputs";

const ADDED_REMOTE_CONTROL_ENV_IDS = "added-remote-control-env-ids";

interface RemoteConnection {
  envId: string;
  installationId?: string | null;
  clientType?: string;
  [key: string]: unknown;
}

function deduplicateRemoteControlConnections(
  remoteControlConnections: RemoteConnection[],
): RemoteConnection[] {
  const byInstallationId = new Map<string, RemoteConnection>();
  const withoutInstallationId: RemoteConnection[] = [];
  for (const connection of remoteControlConnections) {
    if (connection.installationId == null) {
      withoutInstallationId.push(connection);
      continue;
    }
    const existing = byInstallationId.get(connection.installationId);
    if (
      existing == null ||
      (existing.clientType !== "CODEX_DESKTOP_APP" &&
        connection.clientType === "CODEX_DESKTOP_APP")
    ) {
      byInstallationId.set(connection.installationId, connection);
    }
  }
  return [...byInstallationId.values(), ...withoutInstallationId];
}

function buildSelectableConnections({
  addedRemoteControlEnvIds,
  remoteControlConnections,
  remoteSshConnections,
  remoteWslConnections,
}: {
  addedRemoteControlEnvIds: string[];
  remoteControlConnections: RemoteConnection[];
  remoteSshConnections: RemoteConnection[];
  remoteWslConnections: RemoteConnection[];
}): RemoteConnection[] {
  return [
    ...remoteSshConnections,
    ...remoteWslConnections,
    ...filterAddedRemoteControlConnections({
      addedRemoteControlEnvIds,
      remoteControlConnections,
    }),
  ];
}

export function filterAddedRemoteControlConnections({
  addedRemoteControlEnvIds,
  remoteControlConnections,
}: {
  addedRemoteControlEnvIds: string[];
  remoteControlConnections: RemoteConnection[];
}): RemoteConnection[] {
  const addedEnvIds = new Set(addedRemoteControlEnvIds);
  const addedInstallationIds = new Set(
    remoteControlConnections.flatMap((item) =>
      addedEnvIds.has(item.envId) && item.installationId != null
        ? [item.installationId]
        : [],
    ),
  );
  return deduplicateRemoteControlConnections(remoteControlConnections).filter(
    (item) =>
      addedEnvIds.has(item.envId) ||
      (item.installationId != null &&
        addedInstallationIds.has(item.installationId)),
  );
}

export function selectableRemoteConnectionsSignalR({
  addedRemoteControlEnvIds,
  remoteControlConnections,
}: {
  addedRemoteControlEnvIds: string[];
  remoteControlConnections: RemoteConnection[];
}): RemoteConnection[] {
  const addedConnections = filterAddedRemoteControlConnections({
    addedRemoteControlEnvIds,
    remoteControlConnections,
  });
  const addedEnvIds = new Set(addedConnections.map((item) => item.envId));
  const addedInstallationIds = new Set(
    addedConnections.flatMap((item) =>
      item.installationId == null ? [] : [item.installationId],
    ),
  );
  return deduplicateRemoteControlConnections(remoteControlConnections).filter(
    (item) =>
      !addedEnvIds.has(item.envId) &&
      (item.installationId == null ||
        !addedInstallationIds.has(item.installationId)),
  );
}

export const selectableRemoteConnectionsSignalT = appScopeC(
  appScopeT,
  ({ get }: { get: (atom: unknown) => unknown }) =>
    useHostConfigS(get, "remote_ssh_connections") == null ||
    useHostConfigS(get, "remote_control_connections") == null,
);

export const selectableRemoteConnectionsSignalN = appScopeC(
  appScopeT,
  ({ get }: { get: (atom: unknown) => unknown }) => {
    const remoteSshConnections = useHostConfigS(
      get,
      "remote_ssh_connections",
    ) as RemoteConnection[] | null | undefined;
    const remoteWslConnections = useHostConfigS(
      get,
      "remote_wsl_connections",
    ) as RemoteConnection[] | null | undefined;
    if (remoteSshConnections == null) return undefined;
    return buildSelectableConnections({
      addedRemoteControlEnvIds: threadContextInputsQi(
        get,
        ADDED_REMOTE_CONTROL_ENV_IDS,
      ) as string[],
      remoteSshConnections: remoteSshConnections ?? [],
      remoteWslConnections: remoteWslConnections ?? [],
      remoteControlConnections:
        (useHostConfigS(get, "remote_control_connections") as
          | RemoteConnection[]
          | null
          | undefined) ?? [],
    });
  },
);
