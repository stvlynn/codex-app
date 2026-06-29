// Restored from ref/webview/assets/use-is-dictation-supported-BVXWfQC0.js
// Dictation support hook restored from the Codex webview bundle.
import { o as checkStatsigGate, u as useStatsigUser } from "@statsig/js-client";
import { n as useAuthAccount } from "../boundaries/use-auth";
function isDictationEnvironmentSupported(): boolean {
  switch ("electron") {
    case "electron":
    case "chrome-extension":
    case "browser":
      return true;
    case "extension":
      return false;
    default:
      return false;
  }
}
export function useIsDictationSupported(hostId?: string): boolean | null {
  const authAccount = useAuthAccount(hostId);
  const gateEnabled = checkStatsigGate("4100906017");
  const userLoaded = useStatsigUser();
  if (
    !isDictationEnvironmentSupported() ||
    !navigator?.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined"
  ) {
    return false;
  }
  if (authAccount == null || authAccount.isLoading || userLoaded) {
    return null;
  }
  return gateEnabled && authAccount.authMethod === "chatgpt";
}
