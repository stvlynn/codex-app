// Restored from ref/webview/assets/modal-controller-state-BN7B52no.js

import {
  atom,
  useAtomValue,
  useSetAtom,
  type WritableAtom,
  type Store,
} from "jotai";

interface ModalEntry {
  key: number;
  ModalComponent: React.ComponentType<any>;
  props: Record<string, unknown>;
}

interface ModalState {
  modals: ModalEntry[];
  nextKey: number;
}

const modalStateAtom = atom<ModalState>({ modals: [], nextKey: 1 });

export function useModalState(): ModalState {
  return useAtomValue(modalStateAtom);
}

export function registerModal(
  store: Store,
  ModalComponent: React.ComponentType<any>,
  props: Record<string, unknown>,
): void {
  store.set(modalStateAtom, (state) => {
    const existing = state.modals.find(
      (m) => m.ModalComponent === ModalComponent,
    );
    const entry: ModalEntry = {
      key: existing?.key ?? state.nextKey,
      ModalComponent,
      props,
    };
    return existing
      ? {
          ...state,
          modals: [
            ...state.modals.filter((m) => m.ModalComponent !== ModalComponent),
            entry,
          ],
        }
      : { modals: [...state.modals, entry], nextKey: state.nextKey + 1 };
  });
}

export function unregisterModal(
  store: Store,
  ModalComponent: React.ComponentType<any>,
): void {
  store.set(modalStateAtom, (state) => {
    const filtered = state.modals.filter(
      (m) => m.ModalComponent !== ModalComponent,
    );
    return filtered.length === state.modals.length
      ? state
      : { ...state, modals: filtered };
  });
}

export function isModalOpen(
  store: Store,
  ModalComponent: React.ComponentType<any>,
): boolean {
  return store
    .get(modalStateAtom)
    .modals.some((m) => m.ModalComponent === ModalComponent);
}
