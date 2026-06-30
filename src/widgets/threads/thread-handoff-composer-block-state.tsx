// Restored from ref/webview/assets/thread-handoff-composer-block-state-C7-ef4-4.js

// App-scope atom primitives (boundary: app-scope-CWE-zIhQ)
function atom<T>(get: any, initial: T): any {
  return { key: Symbol(), get, initial };
}
function getAtom(store: any, atom: any, key?: string): any {
  return store.get(atom, key);
}
function setAtom(store: any, atom: any, ...args: any[]): void {
  store.set(atom, ...args);
}

export const threadHandoffComposerBlockStateAtom = atom(getAtom, () => 0);

export function incrementThreadHandoffComposerBlockState(
  store: any,
  key: string,
  delta: number,
): void {
  if (key != null) {
    store.set(
      threadHandoffComposerBlockStateAtom,
      key,
      store.get(threadHandoffComposerBlockStateAtom, key) + delta,
    );
  }
}

export type ThreadHandoffComposerBlockState =
  | "pending-pasted-text-attachments"
  | "loading-queued-follow-ups"
  | "unavailable-queued-follow-ups"
  | "queued-follow-ups"
  | null;

export interface ThreadHandoffComposerBlockStateInput {
  pendingPastedTextAttachmentCount: number;
  queuedFollowUpsError: boolean;
  queuedFollowUpsLoading: boolean;
  queuedFollowUpCount: number;
}

export function resolveThreadHandoffComposerBlockState(
  input: ThreadHandoffComposerBlockStateInput,
): ThreadHandoffComposerBlockState {
  const {
    pendingPastedTextAttachmentCount,
    queuedFollowUpsError,
    queuedFollowUpsLoading,
    queuedFollowUpCount,
  } = input;

  if (pendingPastedTextAttachmentCount > 0) {
    return "pending-pasted-text-attachments";
  }
  if (queuedFollowUpsLoading) {
    return "loading-queued-follow-ups";
  }
  if (queuedFollowUpsError) {
    return "unavailable-queued-follow-ups";
  }
  if (queuedFollowUpCount > 0) {
    return "queued-follow-ups";
  }
  return null;
}

export {
  resolveThreadHandoffComposerBlockState,
  threadHandoffComposerBlockStateAtom,
  incrementThreadHandoffComposerBlockState,
};
