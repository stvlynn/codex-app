// Restored from ref/webview/assets/spinner-DHBmwxtt.js
// Spinner chunk restored from the Codex webview bundle.

import React from "react";
export interface SpinnerProps {
  className?: string;
  size?: number;
  testId?: string;
}
export function Spinner({
  className,
  size = 16,
  testId = "spinner",
}: SpinnerProps): JSX.Element {
  return (
    <div
      className={className}
      data-testid={testId}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        animation: "spin 0.75s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
