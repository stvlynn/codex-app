// Restored from ref/webview/assets/request-user-input-auto-resolution-1nt2rAu4.js
// request-user-input-auto-resolution-1nt2rAu4 chunk restored from the Codex webview bundle.
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

export interface UserInputResolutionKey {
  conversationId: string;
  hostId: string;
}

export interface UserInputResolution {
  requestId: string;
  resolutionState: string;
}

export type UserInputResolutionEvent =
  | {
      kind: "removed";
      conversationId: string;
      hostId: string;
      requestId: string;
    }
  | {
      kind: "updated";
      conversationId: string;
      hostId: string;
      requestId: string;
      resolutionState: string;
    };

export function createResolutionKey(params: {
  conversationId: string;
  hostId: string;
}): string {
  return JSON.stringify([params.hostId, params.conversationId]);
}

export const userInputResolutionAtom = atom<
  Record<string, UserInputResolution | null>
>({});

export function useUserInputAutoResolution(): {
  resolutionMap: Record<string, UserInputResolution | null>;
  handleResolutionEvent: (event: UserInputResolutionEvent) => void;
} {
  const [resolutionMap, setResolutionMap] = useAtom(userInputResolutionAtom);

  const handleResolutionEvent = useCallback(
    (event: UserInputResolutionEvent) => {
      const key = createResolutionKey({
        conversationId: event.conversationId,
        hostId: event.hostId,
      });

      switch (event.kind) {
        case "removed": {
          setResolutionMap((prev) => {
            const current = prev[key];
            if (current?.requestId === event.requestId) {
              return { ...prev, [key]: null };
            }
            return prev;
          });
          break;
        }
        case "updated": {
          setResolutionMap((prev) => ({
            ...prev,
            [key]: {
              requestId: event.requestId,
              resolutionState: event.resolutionState,
            },
          }));
          break;
        }
      }
    },
    [setResolutionMap],
  );

  return {
    resolutionMap,
    handleResolutionEvent,
  };
}

export function updateUserInputResolution(
  scope: {
    get: (
      atom: unknown,
      key: UserInputResolutionKey,
    ) => UserInputResolution | null | undefined;
    set: (
      atom: unknown,
      key: UserInputResolutionKey,
      value: UserInputResolution | null,
    ) => void;
  },
  hostId: string,
  event: UserInputResolutionEvent,
): void {
  const key = { conversationId: event.conversationId, hostId };
  switch (event.kind) {
    case "removed": {
      const current = scope.get(userInputResolutionAtom, key);
      if (current?.requestId === event.requestId) {
        scope.set(userInputResolutionAtom, key, null);
      }
      break;
    }
    case "updated": {
      scope.set(userInputResolutionAtom, key, {
        requestId: event.requestId,
        resolutionState: event.resolutionState,
      });
      break;
    }
  }
}
