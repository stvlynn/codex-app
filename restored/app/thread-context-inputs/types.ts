// Restored from ref/webview/assets/thread-context-inputs-B6tQCr7t.js
// Types and interfaces for thread-context-inputs

// ------------------------------------------------------------------
// Re-export types from boundaries
// ------------------------------------------------------------------

export type AppScope = import("../../boundaries/tanstack-query").AppScope;

// ------------------------------------------------------------------
// Core types
// ------------------------------------------------------------------

export interface ThreadContext {
  id: string;
  hostId: string;
  status: string;
  cwd: string | null;
  artifacts: {
    editedFilePaths: string[];
    referencedFilePaths: string[];
  };
}
export interface TurnState {
  status: "complete" | "in_progress" | "pending" | "error";
  cwd: string | null;
  params: {
    cwd?: string | null;
  };
  diff: unknown[] | null;
  turnId: string | null;
  items: TurnItem[];
}
export interface TurnItem {
  type: string;
  cwd?: string | null;
  status?: string;
  changes?: unknown[];
}
export interface ConversationManager {
  getHostId(): string;
  getConversation(id: string): unknown | null;
  getRecentConversations(): {
    id: string;
  }[];
  getThreadSummaries(): ThreadSummary[];
  addAnyConversationCallback(callback: () => void): () => void;
  addAnyConversationMetaCallback(
    callback: (
      items: {
        id: string;
      }[],
    ) => void,
  ): () => void;
  addConversationCallback(id: string, callback: () => void): () => void;
  addThreadSummariesCallback(
    callback: (summaries: ThreadSummary[]) => void,
  ): () => void;
  addStreamRoleCallback(
    id: string,
    callback: (role: unknown) => void,
  ): () => void;
  addNotificationCallback(
    type: string,
    callback: (data: unknown) => void,
  ): () => void;
  addTurnCompletedListener(callback: (data: unknown) => void): () => void;
  addMcpLoginCallback(callback: (data: unknown) => void): () => void;
  isConversationSuppressedAfterArchive(id: string): boolean;
  getStreamRole(id: string): unknown;
  refreshRecentConversations(): void;
  cleanupPendingPastedTextAttachments(): Promise<void>;
}
export interface ThreadSummary {
  conversationId: string;
  [key: string]: unknown;
}
export interface GitMetadata {
  commonDir: string;
  root: string;
}
export interface GitQueryParams {
  metadata: GitMetadata | null;
  method: string;
  params?: Record<string, unknown>;
  hostKey: string;
}
export interface HostConfig {
  id: string;
  hostId?: string;
  [key: string]: unknown;
}
export interface RemoteConnection {
  id: string;
  hostId: string;
  type: string;
}
export interface ServiceTier {
  id: string;
  name: string;
  description?: string;
  hidden?: boolean;
}
export interface ServiceTierOption {
  description: unknown;
  iconKind: string | null;
  label: unknown;
  tier: ServiceTier | null;
  value: string | null;
}
export interface AnalyticsLoggerOptions {
  appName: string;
  appVersion: string;
  deviceId: string;
  browserLocale: string;
  options: Record<string, unknown>;
  settings: Record<string, unknown>;
  instrumentation?: Instrumentation;
}
export interface Instrumentation {
  getPunchOut(): unknown;
  count(name: string, tags: Record<string, unknown>): void;
  addError(name: string, tags: Record<string, unknown>): void;
  addAction(name: string, tags: Record<string, unknown>): void;
}
export interface StructuredEvent {
  $type: string;
  [key: string]: unknown;
}
export interface EventEnvelope {
  eventId: string;
  eventCreatedAt: string;
  eventType: string;
  userParams?: Record<string, unknown>;
  deviceParams: Record<string, unknown>;
  statsigMetadataV2?: Record<string, unknown>;
  eventParams: Record<string, unknown>;
  punchOutInfoToken: unknown;
  clientMetadata: {
    name: string;
    version: string;
  };
}
export interface FilePreviewInfo {
  filePath: string;
  imagePreviewMode: "always" | "toggle" | "none";
  isDeletion: boolean;
  richPreviewEnabled: boolean;
}
export interface EndResource {
  type: "file" | "google-drive" | "appgen-app" | "website";
  path?: string;
  url?: string;
  target?: string;
}
export interface CitationResource {
  type: string;
  path?: string;
  url?: string;
  target?: string;
}
export interface AppServerState {
  state: string;
  error: unknown;
  appServerVersion: string | null;
  installedCodexVersion: string | null;
}
export interface AppServerManagerEntry {
  state$: {
    get(): string;
    set(value: string): void;
  };
  error$: {
    get(): unknown;
    set(value: unknown): void;
  };
  appServerVersion$: {
    get(): string | null;
    set(value: string | null): void;
  };
  installedCodexVersion$: {
    get(): string | null;
    set(value: string | null): void;
  };
}
export interface QueryStatus {
  fetchStatus: string;
  isEnabled: boolean;
  isFetching: boolean;
  isInitialLoading: boolean;
  isLoading: boolean;
  isPaused: boolean;
  isRefetching: boolean;
  refetch: (options?: unknown) => Promise<unknown>;
  data?: unknown;
  isError?: boolean;
  isLoadingError?: boolean;
  isRefetchError?: boolean;
  promise?: Promise<unknown>;
  status?: string;
}
export interface IpcBridge {
  registerBroadcastHandler(
    method: string,
    handler: (data: unknown) => void,
  ): () => void;
  request(method: string, params: unknown, options?: unknown): Promise<unknown>;
}
export interface ThreadManagerOptions {
  dispatchMessageFromView?: (type: string, data: unknown) => void;
  dispatchMessageToView?: (message: unknown) => void;
  hostFetch?: typeof fetch;
  ipcBridge?: IpcBridge;
  useTailHydration?: () => boolean;
}
export interface ThreadManagerConfig {
  supportsStateDbOnlyThreadList: boolean;
  getRecentConversationDiscoveryLimit(): number;
  onExpandedThreadHistoryLoaded(data: unknown): void;
  shouldPauseQueueAfterInterruptedTurn(): boolean;
  getThreadHasUnreadTurn(args: { hostId: string; threadId: string }): boolean;
  setThreadHasUnreadTurn(args: {
    hostId: string;
    threadId: string;
    hasUnreadTurn: boolean;
  }): void;
}
export interface StatsigClientWrapper {
  sdkType: string;
  canLogEvent(): boolean;
  getLogEventUrl(): string | undefined;
  getContext(): Record<string, unknown> | undefined;
  getEnvironmentTier(): string | undefined;
  validateStructuredEventOptions(options: unknown): void;
  logStructuredEvent(type: string, envelope: EventEnvelope): void;
}
export interface BrowserTabInfo {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
}
export interface OwlFeature {
  enabled: boolean;
  features: string[];
}
export interface ToolSurfaceItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}
export interface ToolSurfaceConfig {
  items: ToolSurfaceItem[];
  categories: string[];
}
export interface NativeAppMetadata {
  id: string;
  name: string;
  bundleId?: string;
  version?: string;
}
export interface MemorySettings {
  enabled: boolean;
  maxTokens: number;
  retentionPolicy: string;
}
export interface OnboardingStep {
  id: string;
  completed: boolean;
  order: number;
}
export interface OnboardingAnalyticsEvent {
  stepId: string;
  action: string;
  timestamp: number;
}
export interface ThreadGoal {
  id: string;
  description: string;
  status: "active" | "completed" | "cancelled";
}
export interface ThreadGoalState {
  goals: ThreadGoal[];
  currentGoalId: string | null;
}
export interface TurnStateUpdater {
  turnId: string;
  updates: Partial<TurnState>;
}
export interface TerminalSnapshotSchema {
  type: string;
  content: string;
  timestamp: number;
}
export interface TerminalSnapshotRunner {
  run(snapshot: TerminalSnapshotSchema): Promise<unknown>;
}
export interface RealtimeMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}
export interface RealtimeThreadMessaging {
  send(message: RealtimeMessage): void;
  subscribe(callback: (message: RealtimeMessage) => void): () => void;
}
export interface ChromeExtensionPolicy {
  allowedOrigins: string[];
  blockedOrigins: string[];
  allowedActions: string[];
}
export interface TabContextAsset {
  id: string;
  type: string;
  lifecycle: "active" | "inactive" | "disposed";
}
export interface WorktreeGitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  untracked: string[];
}
export interface WorktreeGitInvalidator {
  invalidate(
    queryClient: unknown,
    params: {
      commonDir: string;
      root: string;
    },
  ): Promise<void>;
}
export interface CitationType {
  type: string;
  source: string;
  label: string;
}
export interface PriorityConfig {
  level: "standard" | "fast" | "ultrafast";
  label: string;
  description: string;
}
