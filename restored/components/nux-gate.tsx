// Restored from ref/webview/assets/nux-gate-ncVyDQKh.js
// NUX gate component restored from the Codex webview bundle.
import type { ReactNode } from "react";
import { Navigate } from "../utils/chunk-lfpyn7-ly";
import { AppPreloader } from "../utils/app-preloader";
import { useNux } from "../hooks/use-nux";
export interface NuxGateProps {
  children?: ReactNode;
}
export function NuxGate(props: NuxGateProps): ReactNode | null {
  const nuxState = useNux();
  if (nuxState == null) {
    return <AppPreloader />;
  }
  if (nuxState !== "none") {
    return <Navigate to="/first-run" replace />;
  }
  return <>{props.children}</>;
}
