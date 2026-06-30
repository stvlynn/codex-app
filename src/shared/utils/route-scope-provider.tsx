// Restored from ref/webview/assets/route-scope-provider-DTX8-kkG.js
// route-scope-provider-DTX8-kkG chunk restored from the Codex webview bundle.
import type { ReactNode } from "react";
import {
  A as atomWithDefault,
  G as atom,
  R as Provider,
  T as rootStore,
} from "../boundaries/tanstack-query/vscode.ts";
import {
  B as routeScopeAtom,
  F as routeFamily,
  G as routeContextAtom,
  V as clientThreadIdFamily,
} from "./persisted-signal.tsx";
export interface RouteImportState {
  status: "idle" | "importing" | "success" | "error";
  startedAtMs?: number;
  completedAtMs?: number;
}
const routeImportStateAtom = atom(rootStore, {
  status: "idle" as RouteImportState["status"],
});
export async function loadRouteAsync(
  store: typeof rootStore,
  loader: () => Promise<void>,
): Promise<void> {
  store.set(routeImportStateAtom, {
    status: "importing",
    startedAtMs: Date.now(),
  });
  try {
    await loader();
    store.set(routeImportStateAtom, {
      status: "success",
      completedAtMs: Date.now(),
    });
  } catch (error) {
    store.set(routeImportStateAtom, {
      status: "error",
      completedAtMs: Date.now(),
    });
    throw error;
  }
}
export interface RouteScopeProviderProps {
  children: ReactNode;
  route: string;
}
export function RouteScopeProvider({
  children,
  route,
}: RouteScopeProviderProps): ReactNode {
  const routeAtom = atomWithDefault(clientThreadIdFamily, route);
  const routeContext = {
    clientThreadId: routeAtom,
  };
  return (
    <Provider scope={routeContextAtom} value={routeContext}>
      <Provider scope={routeScopeAtom} value={route}>
        {children}
      </Provider>
    </Provider>
  );
}
export { routeImportStateAtom };
