// Restored from ref/webview/assets/browser-profile-import-query-BINiFkrA.js
// Browser profile import query utilities restored from the Codex webview bundle.

export interface BrowserProfile {
  name: string;
  profilePath: string;
  source: string;
  hasCookies: boolean;
  hasPasswords: boolean;
}
export interface BrowserProfileImportOptions {
  importCookies: boolean;
  importPasswords: boolean;
  source: string;
  profilePath: string;
}
export function filterImportableProfiles(
  profiles: BrowserProfile[],
): BrowserProfile[] {
  return profiles.filter(
    (profile) => profile.hasCookies || profile.hasPasswords,
  );
}
export interface BrowserProfileImportQueryOptions {
  enabled: boolean;
  queryKey?: string[];
  staleTime?: number;
  retry?: boolean;
}
export function createBrowserProfileImportQuery(
  api: {
    listImportableBrowserProfiles(): Promise<BrowserProfile[]>;
    importBrowserProfile(
      options: BrowserProfileImportOptions,
    ): Promise<unknown>;
  } | null,
  options: BrowserProfileImportQueryOptions,
) {
  const {
    enabled,
    queryKey = ["browser-profile-import-profiles"],
    staleTime = 30_000,
    retry = false,
  } = options;
  return {
    enabled: enabled && api != null,
    queryKey,
    queryFn: async () => {
      if (api == null) {
        throw new Error("Browser profile import is unavailable");
      }
      try {
        return await api.listImportableBrowserProfiles();
      } catch (error) {
        console.error("Failed to list importable browser profiles", error);
        throw error;
      }
    },
    retry,
    staleTime,
  };
}
export async function importBrowserProfile(
  api: {
    importBrowserProfile(
      options: BrowserProfileImportOptions,
    ): Promise<unknown>;
  } | null,
  options: BrowserProfileImportOptions,
): Promise<unknown> {
  if (api == null) {
    throw new Error("Browser profile import is unavailable");
  }
  try {
    return await api.importBrowserProfile(options);
  } catch (error) {
    console.error("Failed to import browser profile", error);
    throw error;
  }
}
