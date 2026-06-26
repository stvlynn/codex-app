// Restored from ref/webview/assets/keyboard-modifier-state-BqolqSr9.js

import { atom, selector } from "jotai";

const altKeyAtom = atom(false);
const ctrlKeyAtom = atom(false);
const metaKeyAtom = atom(false);
const shiftKeyAtom = atom(false);

const anyModifierAtom = selector((get) => get(metaKeyAtom) || get(ctrlKeyAtom));

interface ModifierState {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

function resetModifierState(store: any): void {
  store.set(altKeyAtom, false);
  store.set(ctrlKeyAtom, false);
  store.set(metaKeyAtom, false);
  store.set(shiftKeyAtom, false);
}

function updateModifierState(
  store: any,
  { altKey, ctrlKey, metaKey, shiftKey }: ModifierState,
): void {
  store.set(altKeyAtom, altKey);
  store.set(ctrlKeyAtom, ctrlKey);
  store.set(metaKeyAtom, metaKey);
  store.set(shiftKeyAtom, shiftKey);
}

export {
  updateModifierState as applyModifierState,
  metaKeyAtom as isMetaKeyPressed,
  altKeyAtom as isAltKeyPressed,
  anyModifierAtom as isAnyModifierPressed,
  resetModifierState as resetModifierState,
};
