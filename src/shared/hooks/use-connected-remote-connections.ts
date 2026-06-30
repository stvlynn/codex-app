// Restored from ref/webview/assets/use-connected-remote-connections-BhOWSTjG.js
// Connected remote-connections signal hook restored from the Codex webview bundle.
import { chunkS as sortByKey } from "../boundaries/esbuild-runtime/helpers";
import {
  a as readScope,
  l as createScopeAtom,
  t as scopeAtomValue,
} from "../boundaries/app-scope";
import { m as getHostStatus } from "../../app/thread-context-inputs";
import { t as sortBy } from "../boundaries/lodash/sort-by";
export interface RemoteConnection {
  hostId: string;
  [key: string]: unknown;
}
const defaultSortBy = sortByKey(sortBy(), 1);
const hostStatusAtom = createScopeAtom(
  scopeAtomValue,
  (hostIds: string[] | null | undefined, { get }) => {
    if (hostIds == null) return undefined;
    return Object.fromEntries(
      hostIds.map((hostId) => [hostId, get(getHostStatus, hostId)]),
    );
  },
);
function extractHostId(connection: RemoteConnection): string {
  return connection.hostId;
}
export function useConnectedRemoteConnectionsLookup(
  connections?: RemoteConnection[],
): Record<string, unknown> | undefined {
  const sortedHostIds =
    connections == null
      ? undefined
      : defaultSortBy(connections.map(extractHostId));
  return readScope(hostStatusAtom, sortedHostIds);
}
export function useConnectedRemoteConnections(
  connections?: RemoteConnection[],
): RemoteConnection[] | undefined {
  const statusLookup = useConnectedRemoteConnectionsLookup(connections);
  if (connections == null || statusLookup == null) return undefined;
  return connections.filter(
    (connection) => statusLookup[connection.hostId] === "connected",
  );
}
