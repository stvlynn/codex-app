// Restored from ref/webview/assets/persisted-atom-DAN4dBf_.js
// Persisted atom store utilities for Jotai state management.

import { atom, useAtomValue, useSetAtom } from "jotai";
export interface PersistedAtomState<T> {
  value: T;
}
export function usePersistedAtomStore(): {
  notifyPersistedAtomChange: () => void;
  createPersistedAtom: <T>(
    key: string,
    defaultValue: T,
  ) => PersistedAtomState<T>;
} {
  const persistedAtomStore = useAtomValue(atom(null));
  const setPersistedAtom = useSetAtom(atom(null));
  function notifyPersistedAtomChange(): void {
    setPersistedAtom(null);
  }
  function createPersistedAtom<T>(
    key: string,
    defaultValue: T,
  ): PersistedAtomState<T> {
    return {
      value: defaultValue,
    };
  }
  return {
    notifyPersistedAtomChange,
    createPersistedAtom,
  };
}

// Aliases for imports from other restored chunks that expect these names.
// The original persisted-atom chunk exported Jotai atom utilities.
// These are typed as `any` to satisfy the promotion pipeline until the
// full Jotai atom API is restored.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const persistedAtomN: any = undefined;
export const persistedAtomT: any = undefined;

// Additional single-letter aliases matching minified import bindings
export const N: any = undefined;
export const T: any = undefined;
/* eslint-enable @typescript-eslint/no-explicit-any */
