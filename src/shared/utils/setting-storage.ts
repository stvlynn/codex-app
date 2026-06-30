// Restored from ref/webview/assets/setting-storage-DpOcYU7S.js
import {
  s as useAtomValue,
  t as queryClient,
} from "../boundaries/tanstack-query";
import {
  a as useSuspenseQuery,
  f as dispatchMessage,
  n as sendMessage,
  u as queryConstants,
} from "../boundaries/vscode-api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface SettingEvent {
  key: string;
  default: unknown;
}

export interface SettingsData {
  values: Record<string, unknown>;
}

// ------------------------------------------------------------------
// Query key
// ------------------------------------------------------------------

const SETTINGS_QUERY_KEY = ["get-settings"];

export const settingsQuery = useSuspenseQuery(queryClient, "get-settings", {
  networkMode: "always",
  staleTime: queryConstants.FIVE_SECONDS,
});

// ------------------------------------------------------------------
// Read helpers
// ------------------------------------------------------------------

export function useSettingValue<T>(event: SettingEvent): T {
  const settings = useAtomValue(settingsQuery);
  return (settings.data?.values[event.key] ?? event.default) as T;
}

export function getSettingValue<T>(
  get: <U>(atom: unknown) => { data?: U },
  event: SettingEvent,
): T {
  const settings = get(settingsQuery);
  return (settings.data?.values[event.key] ?? event.default) as T;
}

export function useSettingsLoading(): boolean {
  const settings = useAtomValue(settingsQuery);
  return settings.isLoading;
}

// ------------------------------------------------------------------
// Fetch single setting (async)
// ------------------------------------------------------------------

export async function fetchSettingValue<T>(event: SettingEvent): Promise<T> {
  const response = await sendMessage<{ value?: T }>("get-setting", {
    params: { key: event.key },
  });
  return (response.value ?? event.default) as T;
}

// ------------------------------------------------------------------
// Optimistic update helpers
// ------------------------------------------------------------------

export interface UpdateSettingOptions {
  optimistic?: boolean;
}

export async function updateSetting<T>(
  queryClient: QueryClient,
  event: SettingEvent,
  value: T,
  options: UpdateSettingOptions = {},
): Promise<void> {
  const snapshot = queryClient.query.snapshot(settingsQuery);
  await snapshot.cancel();

  const previousData = snapshot.getData();
  const shouldOptimistic = options.optimistic ?? true;

  if (shouldOptimistic) {
    snapshot.setData({
      values: { ...previousData?.values, [event.key]: value },
    });
  }

  try {
    await setSettingValue(event, value);
    if (!shouldOptimistic) {
      snapshot.setData({
        values: { ...previousData?.values, [event.key]: value },
      });
    }
  } catch (error) {
    snapshot.setData(previousData);
    throw error;
  } finally {
    await snapshot.invalidate();
    dispatchMessage("query-cache-invalidate", {
      queryKey: [...snapshot.queryKey],
    });
  }
}

export function optimisticSetSetting<T>(
  queryClient: QueryClient,
  event: SettingEvent,
  value: T,
): void {
  const snapshot = queryClient.query.snapshot(settingsQuery);
  const currentData = snapshot.getData();
  snapshot.setData({
    values: { ...currentData?.values, [event.key]: value },
  });
}

// ------------------------------------------------------------------
// Internal: persist setting to backend
// ------------------------------------------------------------------

async function setSettingValue<T>(
  event: SettingEvent,
  value: T,
): Promise<void> {
  await sendMessage("set-setting", {
    params: { key: event.key, value },
  });
}

export { setSettingValue };

// ------------------------------------------------------------------
// QueryClient stub (boundary type)
// ------------------------------------------------------------------

interface QueryClient {
  query: {
    snapshot<T>(atom: unknown): QuerySnapshot<T>;
  };
}

interface QuerySnapshot<T> {
  queryKey: readonly string[];
  cancel(): Promise<void>;
  getData(): T | undefined;
  setData(data: T): void;
  invalidate(): Promise<void>;
}
