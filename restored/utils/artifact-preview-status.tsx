// Restored from ref/webview/assets/artifact-preview-status-Bjz9H-v7.js

import React from "react";
import { FormattedMessage } from "react-intl";
export type ArtifactPreviewState = "ready" | "loading" | "error";
export interface ArtifactPreviewStatusProps {
  state: ArtifactPreviewState;
}
export function ArtifactPreviewStatus({
  state,
}: ArtifactPreviewStatusProps): JSX.Element | null {
  if (state === "ready") {
    return null;
  }
  return (
    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-token-text-tertiary">
      {state === "loading" ? (
        <span className="loading-shimmer-pure-text font-medium">
          <FormattedMessage
            id="artifactTab.previewLoading"
            defaultMessage="Preparing preview…"
            description="Loading state shown while the artifact preview is loading"
          />
        </span>
      ) : (
        <FormattedMessage
          id="artifactTab.previewError"
          defaultMessage="Couldn’t load this preview"
          description="Error state shown when an artifact preview fails to load"
        />
      )}
    </div>
  );
}
