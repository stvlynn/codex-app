// Restored from ref/webview/assets/persisted-signal-Djfqb095.js
// Thread routing and location utilities for conversation management.

export interface RouteParams {
  pathname: string;
  routeTemplate: string;
  search?: string;
}
export interface RouteInfo {
  pathname: string;
  routeKind: string;
  routeTemplate: string;
  search: string;
  conversationId?: string;
  taskId?: string;
  projectContext?: {
    hostId: string | null;
    projectId: string;
  } | null;
  clientThreadId?: string;
}
export type ThreadLocationId = string;
const NEW_CONVERSATION_ID = "new-conversation";
const PANEL_NEW_CONVERSATION_ID = "panel-new-conversation";
const CLIENT_NEW_THREAD_PREFIX = "client-new-thread:";
const LOCAL_PREFIX = "local:";
const REMOTE_PREFIX = "remote:";
const ROUTE_PREFIX = "route:";
export function getNewThreadLocationId(
  entrypoint: "home" | "panel",
): ThreadLocationId {
  return entrypoint === "home"
    ? NEW_CONVERSATION_ID
    : PANEL_NEW_CONVERSATION_ID;
}
export function isNewThreadLocationId(id: ThreadLocationId): boolean {
  return id === NEW_CONVERSATION_ID || id === PANEL_NEW_CONVERSATION_ID;
}
export function createClientThreadId(): string {
  return `${CLIENT_NEW_THREAD_PREFIX}${crypto.randomUUID()}`;
}
export function createLocalThreadId(conversationId: string): string {
  return `${LOCAL_PREFIX}${conversationId}`;
}
export function createRemoteThreadId(taskId: string): string {
  return `${REMOTE_PREFIX}${taskId}`;
}
export function isClientThreadId(threadId: string): boolean {
  return threadId.startsWith(CLIENT_NEW_THREAD_PREFIX);
}
export function getConversationIdFromRoute(route: RouteInfo): string | null {
  return route.routeKind === "local-thread"
    ? (route.conversationId ?? null)
    : null;
}
export function getThreadIdFromRoute(route: RouteInfo): string | null {
  switch (route.routeKind) {
    case "home":
      return getNewThreadLocationId("home");
    case "new-thread-panel":
      return getNewThreadLocationId("panel");
    case "local-thread":
      return route.conversationId ?? null;
    case "chatgpt-thread":
      return route.conversationId ?? null;
    case "remote-thread":
      return route.taskId ?? null;
    case "other":
      return null;
    default:
      return null;
  }
}
export function parseRoute(params: RouteParams): RouteInfo {
  const { pathname, routeTemplate, search = "" } = params;
  const conversationId = extractConversationId(pathname);
  if (conversationId != null) {
    const projectContext = parseProjectContext(search);
    return {
      pathname,
      conversationId,
      projectContext,
      routeKind: "local-thread",
      routeTemplate,
      search,
    };
  }
  const taskId = extractTaskId(pathname);
  if (taskId != null) {
    return {
      pathname,
      routeKind: "remote-thread",
      routeTemplate,
      search,
      taskId,
    };
  }
  if (pathname === "/projects") {
    const projectContext = parseProjectContext(search);
    if (projectContext != null) {
      return {
        pathname,
        projectContext,
        routeKind: "home",
        routeTemplate,
        search,
      };
    }
  }
  if (pathname === "/" || pathname === "/hotkey-window") {
    return {
      pathname,
      projectContext: null,
      routeKind: "home",
      routeTemplate,
      search,
    };
  }
  if (pathname === "/extension/panel/new") {
    return {
      pathname,
      routeKind: "new-thread-panel",
      routeTemplate,
      search,
    };
  }
  return {
    pathname,
    routeKind: "other",
    routeTemplate,
    search,
  };
}
function extractConversationId(pathname: string): string | undefined {
  const match = pathname.match(/\/c\/([^/]+)/);
  return match?.[1];
}
function extractTaskId(pathname: string): string | undefined {
  const match = pathname.match(/\/task\/([^/]+)/);
  return match?.[1];
}
function parseProjectContext(search: string): {
  hostId: string | null;
  projectId: string;
} | null {
  const params = new URLSearchParams(search);
  const projectId = params.get("projectId");
  if (projectId == null) return null;
  return {
    hostId: params.get("hostId"),
    projectId,
  };
}
export type TabType = "browser" | "diff" | "mcp-app" | "sandbox" | "timeline";
export const TAB_TYPES: Record<string, TabType> = {
  BROWSER: "browser",
  DIFF: "diff",
  MCP_APP: "mcp-app",
  SANDBOX: "sandbox",
  TIMELINE: "timeline",
};
export function getActiveThreadId(
  _scope: unknown,
  route: RouteInfo,
): string | null {
  const threadId = getThreadIdFromRoute(route);
  if (threadId == null) return null;
  if (isClientThreadId(route.clientThreadId ?? "")) {
    return route.clientThreadId ?? threadId;
  }
  return threadId;
}
export function resolveThreadId(
  _scope: unknown,
  conversationId: string,
): string {
  if (isClientThreadId(conversationId)) return conversationId;
  return conversationId;
}
export function createLegacyTabId(tabId: string): string {
  return `${tabId}:legacy`;
}
export function getTabTypeFromContext(
  context: unknown | null,
  tabId: string | null,
): string | null {
  if (context == null) return null;
  const id = (
    context as {
      tabId?: string;
    }
  ).tabId;
  if (id === TAB_TYPES.BROWSER) {
    return tabId == null ? null : createLegacyTabId(tabId);
  }
  return id === TAB_TYPES.BROWSER ? id : null;
}
export function isBrowserTab(context: unknown | null): boolean {
  if (context == null) return false;
  const kind = (
    context as {
      kind?: string;
    }
  ).kind;
  if (kind === TAB_TYPES.BROWSER) return true;
  const tabId = (
    context as {
      tabId?: string;
    }
  ).tabId;
  return tabId === TAB_TYPES.BROWSER || (tabId?.startsWith("browser") ?? false);
}

// Registry for persisted signals
const signalRegistry = new Map<
  string,
  {
    initialValue: unknown;
    key: string;
  }
>();
const signalSubscribers = new Set<(signals: unknown[]) => void>();
let isFlushScheduled = false;
export function subscribeToPersistedSignals(
  callback: (signals: unknown[]) => void,
): () => void {
  signalSubscribers.add(callback);
  callback(Array.from(signalRegistry.values()));
  return () => {
    signalSubscribers.delete(callback);
  };
}
export function registerPersistedSignal<T>(config: {
  initialValue: T;
  key: string;
}): void {
  if (!signalRegistry.has(config.key)) {
    signalRegistry.set(config.key, config);
    scheduleFlush();
  }
}
function scheduleFlush(): void {
  if (isFlushScheduled) return;
  isFlushScheduled = true;
  queueMicrotask(() => {
    isFlushScheduled = false;
    flushSignals();
  });
}
function flushSignals(): void {
  const signals = Array.from(signalRegistry.values());
  signalSubscribers.forEach((callback) => callback(signals));
}

// Aliases for imports from other restored chunks that expect these names.
// The original persisted-signal chunk also exported Jotai atom utilities.
// These are typed as `any` to satisfy the promotion pipeline until the
// full Jotai signal API is restored.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const persistedSignalH: any = undefined;
export const persistedSignalB: any = undefined;
export const persistedSignalF: any = undefined;
export const persistedSignalG: any = undefined;
export const persistedSignalT: any = undefined;
export const persistedSignalV: any = undefined;

// Additional single-letter aliases matching minified import bindings
export const B: any = undefined;
export const F: any = undefined;
export const G: any = undefined;
export const H: any = undefined;
export const J: any = undefined;
export const T: any = undefined;
export const V: any = undefined;
/* eslint-enable @typescript-eslint/no-explicit-any */
