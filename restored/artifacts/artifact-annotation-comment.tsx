// Restored from ref/webview/assets/artifact-annotation-comment-BkpjMf2c.js

import { z } from "zod";

export interface ArtifactAnnotationTarget {
  type:
    | "presentation-element-selection"
    | "presentation-region"
    | "workbook-floating-element"
    | "workbook-range";
}

export interface ArtifactAnnotationPayload {
  annotationId: string;
  artifactKind: string;
  body: string;
  label: string;
  target: ArtifactAnnotationTarget;
}

export interface ArtifactAnnotationContext {
  annotationId: string;
  path: string;
}

export interface CommentItem {
  localArtifactAnnotationContext?: ArtifactAnnotationContext;
  position: { line: number };
}

export interface CreateAnnotationCommentInput {
  line: number;
  path: string;
  payload: ArtifactAnnotationPayload;
  title: string;
}

export function createAnnotationComment({
  line,
  path,
  payload,
  title,
}: CreateAnnotationCommentInput): Record<string, unknown> {
  switch (payload.target.type) {
    case "presentation-element-selection":
    case "presentation-region":
    case "workbook-floating-element":
    case "workbook-range":
      return {
        annotationId: payload.annotationId,
        artifactKind: payload.artifactKind,
        body: payload.body,
        label: payload.label,
        line,
        metadata: { target: payload.target },
        path,
        title,
      };
  }
  return {};
}

export function filterCommentsByPath(
  comments: CommentItem[],
  path: string,
): CommentItem[] {
  return comments.filter(
    (comment) => comment.localArtifactAnnotationContext?.path === path,
  );
}

export function findRemovedAnnotationIds({
  currentComments,
  path,
  previousComments,
}: {
  currentComments: CommentItem[];
  path: string;
  previousComments: CommentItem[];
}): string[] {
  const currentIds = new Set<string>();
  for (const comment of filterCommentsByPath(currentComments, path)) {
    const id = comment.localArtifactAnnotationContext?.annotationId;
    if (id != null) {
      currentIds.add(id);
    }
  }

  const removed: string[] = [];
  for (const comment of filterCommentsByPath(previousComments, path)) {
    const id = comment.localArtifactAnnotationContext?.annotationId;
    if (id != null && !currentIds.has(id)) {
      removed.push(id);
    }
  }
  return removed;
}

export function removeCommentsByPath(
  comments: CommentItem[],
  path: string,
): CommentItem[] {
  const filtered = comments.filter(
    (comment) => comment.localArtifactAnnotationContext?.path !== path,
  );
  return filtered.length === comments.length ? comments : filtered;
}

export function getNextLineNumber(
  comments: Array<{ position: { line: number } }>,
): number {
  return Math.max(0, ...comments.map((c) => c.position.line)) + 1;
}
