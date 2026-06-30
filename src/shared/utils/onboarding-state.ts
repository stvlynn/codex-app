// Restored from ref/webview/assets/onboarding-state-Ddi1pOV8.js
// Onboarding state signals and computed atoms restored from the Codex webview bundle.
import { appScopeC, appScopeT, appScopeX } from "../boundaries/app-scope";
import { threadContextInputsF } from "../../app/thread-context-inputs";
import { appShellStateVState } from "../../widgets/app-shell/app-shell-state/atoms.ts";
import { persistedAtomT } from "./persisted-atom";
import { persistedSignalT } from "./persisted-signal";
const ONBOARDING_STATE_KEY = "last_completed_onboarding";
const PROJECTLESS_ONBOARDING_KEY = "electron:onboarding-projectless-completed";
const projectlessOnboardingCompletedSignal = persistedSignalT(
  PROJECTLESS_ONBOARDING_KEY,
  false,
);
const lastCompletedOnboardingAtom = persistedAtomT(ONBOARDING_STATE_KEY, null);
export const onboardingStateUState = persistedAtomT(
  PROJECTLESS_ONBOARDING_KEY,
  false,
);
export const onboardingStateTState = "welcomeV2Onboarding";
export const onboardingStateSState = persistedAtomT(
  "electron:onboarding-welcome-pending",
  false,
);
export const onboardingStateRState = persistedAtomT(
  "electron:onboarding-hide-first-new-thread-promos",
  false,
);
export const onboardingStateOState = persistedAtomT(
  "electron:onboarding-plugin-checklist-active",
  false,
);
export const onboardingStateNState = persistedAtomT(
  "electron:onboarding-force-home-tiles-visible",
  false,
);
export interface OnboardingReadiness {
  projectlessOnboardingCompleted: unknown;
  workspaceRootsCount: number;
  workspaceRootsIsLoading: boolean;
}
function resolveProjectlessOnboardingReady(
  input: OnboardingReadiness,
): boolean | null {
  const {
    projectlessOnboardingCompleted,
    workspaceRootsCount,
    workspaceRootsIsLoading,
  } = input;
  if (projectlessOnboardingCompleted == null) {
    return null;
  }
  if (projectlessOnboardingCompleted) {
    return true;
  }
  if (workspaceRootsIsLoading) {
    return null;
  }
  return workspaceRootsCount > 0;
}
export const onboardingStateMState = appScopeC(
  appScopeT,
  ({ get }: { get: (atom: unknown) => unknown }) => {
    const projectlessCompleted = get(projectlessOnboardingCompletedSignal);
    const workspaceRoots = get(threadContextInputsF);
    const workspaceRootsData = workspaceRoots as
      | {
          data?: {
            roots?: unknown[];
          };
          isLoading?: boolean;
        }
      | undefined;
    return resolveProjectlessOnboardingReady({
      projectlessOnboardingCompleted: projectlessCompleted,
      workspaceRootsCount: workspaceRootsData?.data?.roots?.length ?? 0,
      workspaceRootsIsLoading:
        workspaceRootsData?.data == null &&
        workspaceRootsData?.isLoading === true,
    });
  },
);
export const onboardingStateLState = persistedAtomT(
  "electron:onboarding-primary-runtime-install-requested",
  false,
);
export const onboardingStateIState = appScopeX(
  (read: (atom: unknown) => unknown) => read(lastCompletedOnboardingAtom),
  (
    _get: unknown,
    set: (atom: unknown, value: unknown) => void,
    nextValue: unknown,
  ) => {
    if (nextValue != null) {
      appShellStateVState();
    }
    set(lastCompletedOnboardingAtom, nextValue);
  },
);
export const onboardingStateCState = persistedAtomT(
  "electron:onboarding-primary-runtime-install-ready",
  false,
);
export const onboardingStateAState = persistedAtomT(
  "electron:onboarding-override",
  "auto",
);
export function onboardingStateHState({
  hideFirstNewThreadOnboardingPromos,
  pathname,
}: {
  hideFirstNewThreadOnboardingPromos: boolean;
  pathname: string;
}): boolean {
  return hideFirstNewThreadOnboardingPromos && pathname === "/";
}
const CUTOFF_TIMESTAMP_MS = new Date(2026, 3, 30).getTime();
export function onboardingStateGState(
  timestampSeconds: number | null | undefined,
): boolean {
  return (
    timestampSeconds == null || timestampSeconds * 1000 < CUTOFF_TIMESTAMP_MS
  );
}
export const onboardingStatePState = persistedAtomT(
  "electron:onboarding-workspace-experiment-assignment",
  null,
);
export const onboardingStateFState = persistedAtomT(
  "electron:onboarding-workspace-autolaunch-applied",
  false,
);
export interface OnboardingRoleState {
  roles: unknown[];
  personalizedSuggestionsEnabled: boolean;
  workMode: unknown;
}
export const onboardingStateDState = persistedAtomT<OnboardingRoleState>(
  "electron:onboarding-welcome-v2-role-state",
  {
    roles: [],
    personalizedSuggestionsEnabled: true,
    workMode: null,
  },
);
export {
  ONBOARDING_STATE_KEY as onboardingStateUnderscoreState,
  PROJECTLESS_ONBOARDING_KEY as onboardingStateVState,
};
