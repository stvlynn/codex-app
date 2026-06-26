// Restored from ref/webview/assets/use-diff-comments-BCTn6pwz.js

import { o as useHostConfig } from "../boundaries/host-config";

export type DiffComment = unknown;

export interface DiffCommentsState {
  [path: string]: DiffComment[] | undefined;
}

export type SetDiffComments = (
  update: DiffComment[] | ((previous: DiffComment[]) => DiffComment[]),
) => void;

export function useDiffComments(
  path: string | null | undefined,
): [DiffComment[], SetDiffComments] {
  const [diffCommentsByPath, setDiffCommentsByPath] =
    useHostConfig<DiffCommentsState>("diff_comments");

  const comments = path ? (diffCommentsByPath?.[path] ?? []) : [];

  const setComments: SetDiffComments = (update) => {
    if (!path) return;
    setDiffCommentsByPath((previous) => {
      const next = { ...previous };
      const previousComments = next[path] ?? [];
      const nextComments =
        typeof update === "function" ? update(previousComments) : update;
      if (nextComments.length === 0) {
        delete next[path];
      } else {
        next[path] = nextComments;
      }
      return next;
    });
  };

  return [comments, setComments];
}
