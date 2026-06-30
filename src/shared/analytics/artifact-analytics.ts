// Restored from ref/webview/assets/artifact-analytics-FNBRBLp1.js
// ArtifactAnalytics chunk restored from the Codex webview bundle.
import {
  t as logProductEvent,
  T,
  C,
  D,
  E,
  K,
  O,
  S,
  W,
} from "../utils/product-logger";

export interface ArtifactAnalyticsContext {
  artifactTabId?: string;
  artifactType: string;
  importKind: string;
  threadId?: string;
}

export interface AnnotationStartOptions {
  annotationModeEnabled: boolean;
  startSource: string;
}

export interface AnnotationSubmitOptions {
  annotationModeEnabled: boolean;
  annotationTargetKind?: string;
  submitMode: string;
  submitSource: string;
}

function buildArtifactContext({
  artifactTabId,
  artifactType,
  importKind,
  threadId,
}: ArtifactAnalyticsContext) {
  return {
    artifactKind: mapArtifactType(artifactType),
    artifactImportKind: importKind,
    ...(artifactTabId == null ? {} : { artifactTabId }),
    ...(threadId == null ? {} : { threadId }),
  };
}

function mapArtifactType(artifactType: string) {
  switch (artifactType) {
    case "document":
      return O.CODEX_ARTIFACT_KIND_DOCUMENT;
    case "notebook":
      return O.CODEX_ARTIFACT_KIND_NOTEBOOK;
    case "pdf":
      return O.CODEX_ARTIFACT_KIND_PDF;
    case "slides":
      return O.CODEX_ARTIFACT_KIND_PRESENTATION;
    case "spreadsheet":
      return O.CODEX_ARTIFACT_KIND_SPREADSHEET;
  }
}

function mapStartSource(startSource: string) {
  switch (startSource) {
    case "annotation_mode_pointer":
      return C.CODEX_ARTIFACT_ANNOTATION_START_SOURCE_ANNOTATION_MODE_POINTER;
    case "ask_codex_button":
      return C.CODEX_ARTIFACT_ANNOTATION_START_SOURCE_ASK_CODEX_BUTTON;
    case "ask_codex_shortcut":
      return C.CODEX_ARTIFACT_ANNOTATION_START_SOURCE_ASK_CODEX_SHORTCUT;
  }
}

function mapSubmitMode(submitMode: string) {
  switch (submitMode) {
    case "direct":
      return T.CODEX_ARTIFACT_ANNOTATION_SUBMIT_MODE_DIRECT;
    case "saved":
      return T.CODEX_ARTIFACT_ANNOTATION_SUBMIT_MODE_SAVED;
  }
}

function mapSubmitSource(submitSource: string) {
  switch (submitSource) {
    case "button":
      return E.CODEX_ARTIFACT_ANNOTATION_SUBMIT_SOURCE_BUTTON;
    case "dictation":
      return E.CODEX_ARTIFACT_ANNOTATION_SUBMIT_SOURCE_DICTATION;
    case "keyboard":
      return E.CODEX_ARTIFACT_ANNOTATION_SUBMIT_SOURCE_KEYBOARD;
  }
}

// Export order must match the manifest: i, n, r, t
export function logAnnotationImpression(
  logger: unknown,
  context: ArtifactAnalyticsContext,
) {
  logProductEvent(logger, K, {
    ...buildArtifactContext(context),
  });
}

export function logAnnotationStart(
  logger: unknown,
  context: ArtifactAnalyticsContext,
  { annotationModeEnabled, startSource }: AnnotationStartOptions,
) {
  logProductEvent(logger, W, {
    ...buildArtifactContext(context),
    annotationModeEnabled,
    startSource: mapStartSource(startSource),
  });
}

export function logAnnotationSubmit(
  logger: unknown,
  context: ArtifactAnalyticsContext,
  {
    annotationModeEnabled,
    annotationTargetKind,
    submitMode,
    submitSource,
  }: AnnotationSubmitOptions,
) {
  logProductEvent(logger, D, {
    ...buildArtifactContext(context),
    annotationModeEnabled,
    ...(annotationTargetKind == null ? {} : { annotationTargetKind }),
    submitMode: mapSubmitMode(submitMode),
    submitSource: mapSubmitSource(submitSource),
  });
}

export function logAnnotationView(
  logger: unknown,
  context: ArtifactAnalyticsContext,
) {
  logProductEvent(logger, S, {
    ...buildArtifactContext(context),
  });
}
