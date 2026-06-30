// Restored from ref/webview/assets/cloud-preferences-DDzA-ZMw.js
// cloud-preferences-DDzA-ZMw chunk restored from the Codex webview bundle.
import {
  A as useQueryClient,
  _ as useMutation,
  u as queryConstants,
  v as useQuery,
} from "../boundaries/vscode-api";
import { apiClient } from "../../shared/utils/request-client.ts";
const CLOUD_USER_PREFERENCES_QUERY_KEY = ["cloud-user-preferences"];
const CLOUD_PREFERENCES_CONFIG_QUERY_KEY = ["cloud-preferences-config"];
export interface CloudPreferenceVariable {
  value: string;
  example: string;
  char_count: number;
}
export interface CloudPreferencesResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export type ValidationResult =
  | "bracket-mismatch"
  | "missing-pattern"
  | "invalid-pattern"
  | "too-long"
  | "leading-slash"
  | "invalid-characters"
  | null;
async function fetchCloudUserPreferences(): Promise<CloudPreferencesResponse> {
  return apiClient.safeGet("/wham/settings/user");
}
async function fetchCloudPreferencesConfig(): Promise<CloudPreferencesResponse> {
  return apiClient.safeGet("/wham/settings/configs/user-preferences");
}
async function updateCloudPreferences(
  preferences: CloudPreferencesResponse,
): Promise<CloudPreferencesResponse> {
  return apiClient.safePatch("/wham/settings/user", {
    requestBody: preferences,
  });
}
export function useCloudPreferencesQuery() {
  return useQuery({
    queryKey: CLOUD_USER_PREFERENCES_QUERY_KEY,
    queryFn: fetchCloudUserPreferences,
    retry: false,
    staleTime: queryConstants.FIVE_MINUTES,
  });
}
export function useCloudPreferencesConfigQuery() {
  return useQuery({
    queryKey: CLOUD_PREFERENCES_CONFIG_QUERY_KEY,
    queryFn: fetchCloudPreferencesConfig,
    retry: false,
    staleTime: queryConstants.FIVE_MINUTES,
  });
}
export function useUpdateCloudPreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCloudPreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(CLOUD_USER_PREFERENCES_QUERY_KEY, data);
    },
  });
}
function replaceVariables(
  pattern: string,
  variables: CloudPreferenceVariable[],
  replacer: (variable: CloudPreferenceVariable) => string,
): string {
  let result = pattern;
  for (const variable of variables) {
    result = result.replaceAll(variable.value, replacer(variable));
  }
  return result;
}
export function validateCloudPreferencePattern(
  pattern: string,
  maxLength: number,
  variables: CloudPreferenceVariable[],
): ValidationResult {
  const openBrackets = (pattern.match(/{/g) ?? []).length;
  if (openBrackets !== (pattern.match(/}/g) ?? []).length) {
    return "bracket-mismatch";
  }
  if (openBrackets === 0) {
    return "missing-pattern";
  }
  const variableValues = variables.map((item) => item.value);
  const usedVariables = pattern.match(/{([^}]+)}/g) ?? [];
  if (usedVariables.some((item) => !variableValues.includes(item))) {
    return "invalid-pattern";
  }
  const resolved = replaceVariables(pattern, variables, (variable) =>
    "x".repeat(variable.char_count),
  );
  if (resolved.length > maxLength) {
    return "too-long";
  }
  if (resolved.startsWith("/")) {
    return "leading-slash";
  }
  if (/^[a-zA-Z0-9.\-_]+$/.test(resolved)) {
    return null;
  }
  return "invalid-characters";
}
export function formatCloudPreferencePattern(
  pattern: string,
  variables: CloudPreferenceVariable[],
): string {
  return replaceVariables(pattern, variables, (variable) => variable.example);
}
