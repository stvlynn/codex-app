// Restored from ref/webview/assets/sidebar-onboarding-checklist-state-DcFn_T2V.js
// sidebar-onboarding-checklist-state-DcFn_T2V chunk restored from the Codex webview bundle.
import { T as persistedSignal } from "../utils/persisted-signal.tsx";
export interface OnboardingChecklistState {
  collapsed: boolean;
  completedItemIds: string[];
  dismissed?: boolean;
}
export type OnboardingChecklistStateByAccount = Record<
  string,
  OnboardingChecklistState
>;
const DEFAULT_STATE: OnboardingChecklistState = {
  collapsed: false,
  completedItemIds: [],
};
const EMPTY_STATE: OnboardingChecklistStateByAccount = {};
export const onboardingChecklistStateAtom =
  persistedSignal<OnboardingChecklistStateByAccount>(
    "sidebar-onboarding-checklist-state-by-account-id-v1",
    EMPTY_STATE,
  );
export const onboardingChecklistDebugEnabledAtom = persistedSignal<boolean>(
  "sidebar-onboarding-checklist-debug-enabled",
  false,
);
function getAccountState(
  stateByAccount: OnboardingChecklistStateByAccount | undefined,
  accountId: string,
): OnboardingChecklistState {
  return stateByAccount?.[accountId] ?? DEFAULT_STATE;
}
export function setOnboardingChecklistCollapsed(
  store: {
    set: (typeof onboardingChecklistStateAtom)["write"];
  },
  accountId: string,
  collapsed: boolean,
): void {
  store.set(onboardingChecklistStateAtom, (prev) => {
    const current = prev ?? EMPTY_STATE;
    const accountState = getAccountState(current, accountId);
    return {
      ...current,
      [accountId]: {
        ...accountState,
        collapsed,
      },
    };
  });
}
export function dismissOnboardingChecklist(
  store: {
    set: (typeof onboardingChecklistStateAtom)["write"];
  },
  accountId: string,
): void {
  store.set(onboardingChecklistStateAtom, (prev) => {
    const current = prev ?? EMPTY_STATE;
    const accountState = getAccountState(current, accountId);
    return {
      ...current,
      [accountId]: {
        ...accountState,
        dismissed: true,
      },
    };
  });
}
export function resetOnboardingChecklistState(store: {
  set: (typeof onboardingChecklistStateAtom)["write"];
}): void {
  store.set(onboardingChecklistStateAtom, EMPTY_STATE);
}
function isItemCompleted(
  state: OnboardingChecklistState,
  itemId: string,
): boolean {
  return state.completedItemIds.includes(itemId);
}
export function markOnboardingItemCompleted(
  store: {
    set: (typeof onboardingChecklistStateAtom)["write"];
  },
  accountId: string,
  itemId: string,
): void {
  store.set(onboardingChecklistStateAtom, (prev) => {
    const current = prev ?? EMPTY_STATE;
    const accountState = getAccountState(current, accountId);
    if (isItemCompleted(accountState, itemId)) {
      return current;
    }
    return {
      ...current,
      [accountId]: {
        ...accountState,
        completedItemIds: [...accountState.completedItemIds, itemId],
      },
    };
  });
}
export {
  getAccountState as getOnboardingChecklistAccountState,
  isItemCompleted as isOnboardingItemCompleted,
};
