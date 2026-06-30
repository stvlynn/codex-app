// Restored from ref/webview/assets/use-is-remote-host-CdAgT54v.js
// Remote host detection hook restored from the Codex webview bundle.
import { s as useScopeValue } from "../boundaries/app-scope";
import { n as useHostConfig } from "../boundaries/host-config";
import { M as defaultHostConfigInput } from "../../app/thread-context-inputs";
export interface HostConfig {
  kind?: string;
  [key: string]: unknown;
}
export function useIsRemoteHost(): boolean {
  const hostConfig = useHostConfig(useScopeValue(defaultHostConfigInput)) as
    | HostConfig
    | undefined;
  return hostConfig?.kind !== "local";
}
