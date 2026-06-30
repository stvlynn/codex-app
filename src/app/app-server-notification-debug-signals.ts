// Restored from ref/webview/assets/app-server-notification-debug-signals-DCt-THUZ.js
// In-memory debug log for app-server notifications and RPC messages.

import { useSyncExternalStore } from "react";
import { appScopeG, appScopeT } from "../shared/boundaries/app-scope.ts";
import { ya as previewThreadContextInput } from "./thread-context-inputs";
import * as zod from "../shared/boundaries/src.ts";
const MAX_DEBUG_LOG_ENTRIES = 100;
const STORAGE_KEY =
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : "product-event-debug-log";
const subscribers = new Set<() => void>();
let logEntries: NotificationDebugEntry[] = [];
let sequenceNumber = 0;
export interface NotificationDebugEntry {
  id: string;
  hostId: string;
  method: string;
  params: unknown;
  paramsPreview: string;
  receivedAtMs: number;
  severity: "default" | "noisy" | "error";
  isNoisy: boolean;
  threadId: string | null;
  status?: string;
  reason?: string;
  timestampMs: number;
  updatedTimestampMs: number;
}
export interface RecordNotificationParams {
  hostId: string;
  method: string;
  params: unknown;
}
export function useNotificationDebugLog(): NotificationDebugEntry[] {
  return useSyncExternalStore(subscribeToLog, getLogSnapshot);
}
function getLogSnapshot(): NotificationDebugEntry[] {
  return logEntries;
}
function subscribeToLog(onChange: () => void): () => void {
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
  };
}
function notifySubscribers(): void {
  subscribers.forEach((callback) => callback());
}
export interface AppendDebugEventParams {
  event: string;
  status: string;
  reason?: string;
}
export function appendDebugEvent({
  event,
  status,
  reason,
}: AppendDebugEventParams): string {
  const entry = createDebugEntry({
    event,
    status,
    reason,
  });
  logEntries = [...logEntries, entry].slice(-MAX_DEBUG_LOG_ENTRIES);
  notifySubscribers();
  return entry.id;
}
export interface UpdateDebugEventParams {
  id: string;
  status: string;
  reason?: string;
}
export function updateDebugEvent({
  id,
  status,
  reason,
}: UpdateDebugEventParams): void {
  const existingEntry = logEntries.find((entry) => entry.id === id);
  if (existingEntry == null) return;
  const updatedEntry: NotificationDebugEntry = {
    ...existingEntry,
    status,
    updatedTimestampMs: Date.now(),
    ...(reason === undefined
      ? {}
      : {
          reason,
        }),
  };
  logEntries = logEntries
    .filter((entry) => entry.id !== id)
    .concat(updatedEntry);
  notifySubscribers();
}
function createDebugEntry(
  params: Omit<AppendDebugEventParams, "event"> & {
    event: string;
  },
): NotificationDebugEntry {
  const id = `${STORAGE_KEY}:${String(sequenceNumber).padStart(10, "0")}`;
  sequenceNumber += 1;
  const now = Date.now();
  return {
    id,
    event: params.event,
    status: params.status,
    reason: params.reason,
    timestampMs: now,
    updatedTimestampMs: now,
  } as NotificationDebugEntry;
}
const threadIdSchema = zod.srcTa({
  threadId: zod.srcAa().optional(),
});
function buildLogEntry(params: {
  hostId: string;
  id: string;
  method: string;
  params: unknown;
  receivedAtMs: number;
}): NotificationDebugEntry {
  const paramsPreview = previewThreadContextInput(params.params);
  const isNoisy = isNoisyMethod(params.method);
  return {
    hostId: params.hostId,
    id: params.id,
    isNoisy,
    method: params.method,
    params: params.params,
    paramsPreview,
    receivedAtMs: params.receivedAtMs,
    severity: deriveSeverity(params.method, isNoisy),
    threadId: extractThreadId(params.params),
  } as NotificationDebugEntry;
}
function extractThreadId(params: unknown): string | null {
  const result = threadIdSchema.safeParse(params);
  return result.success ? (result.data.threadId ?? null) : null;
}
function deriveSeverity(
  method: string,
  isNoisy: boolean,
): "default" | "noisy" | "error" {
  if (
    method === "error" ||
    method.includes("/error") ||
    method.includes("failed")
  ) {
    return "error";
  }
  return isNoisy ? "noisy" : "default";
}
function isNoisyMethod(method: string): boolean {
  return (
    method.includes("/delta") ||
    method.includes("Delta") ||
    method.endsWith("/output")
  );
}
const debugLogEnabledAtom = appScopeG(appScopeT, false);
const debugLogEntriesAtom = appScopeG(appScopeT, () => [], {
  onMount: (_get, set) => {
    set(debugLogEnabledAtom, true);
    return () => {
      set(debugLogEnabledAtom, false);
    };
  },
});
const debugLogSequenceAtom = appScopeG(appScopeT, 0);
export function recordNotification(
  store: {
    get: (atom: unknown) => unknown;
    set: (atom: unknown, value: unknown) => void;
  },
  { hostId, method, params }: RecordNotificationParams,
): void {
  if (!store.get(debugLogEnabledAtom)) return;
  const receivedAtMs = Date.now();
  const currentSequence = store.get(debugLogSequenceAtom) as number;
  const entry = buildLogEntry({
    hostId,
    id: `${receivedAtMs}:${currentSequence}`,
    method,
    params,
    receivedAtMs,
  });
  store.set(debugLogSequenceAtom, currentSequence + 1);
  store.set(debugLogEntriesAtom, (previousEntries: NotificationDebugEntry[]) =>
    [entry, ...previousEntries].slice(0, 300),
  );
}
export function clearNotificationsByHost(
  store: {
    set: (atom: unknown, value: unknown) => void;
  },
  hostId: string,
): void {
  store.set(debugLogEntriesAtom, (previousEntries: NotificationDebugEntry[]) =>
    previousEntries.filter((entry) => entry.hostId !== hostId),
  );
}
export { debugLogEntriesAtom as notificationDebugLogAtom };
