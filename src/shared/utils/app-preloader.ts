// Restored from ref/webview/assets/app-preloader-C9cwS2Vy.js
// app-preloader-C9cwS2Vy chunk restored from the Codex webview bundle.
import type { ReactNode } from "react";
import { LoadingPage } from "../ui/ui/loading-page.tsx";
export interface AppPreloaderProps {
  debugName?: string;
}
export function AppPreloader({
  debugName
}: AppPreloaderProps): ReactNode {
  return <LoadingPage debugName={debugName} />;
}