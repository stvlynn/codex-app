// Restored from ref/webview/assets/workspace-onboarding-experiment-C2rOtLv8.js
// Workspace onboarding experiment (Statsig) restored from the Codex webview bundle.

import { r as getStatsigExperiment } from "@statsig/js-client";
const EXPERIMENT_ID = `93537254`;
const EXPERIMENT_NAME = `t5_onboarding_v2`;
const ARM_PARAMETER = `arm`;
export const PLAYGROUND_GROUP_ID = `3150044490`;
export const PLAYGROUND_GROUP_NAME = `Playground`;
export const CONTROL_GROUP_ID = `1482884768`;
function normalizeExperimentArm(rawArm: string | null | undefined): string {
  switch (rawArm) {
    case `control`:
    case `t2_direct_folder_picker`:
    case `t3_auto_playground`:
    case `t4_modal_copy_cta_playground`:
    case EXPERIMENT_NAME:
      return rawArm;
    default:
      return `control`;
  }
}
function coerceT5ToControl(rawArm: string | null | undefined): string {
  const normalized = normalizeExperimentArm(rawArm);
  return normalized === `t5_onboarding_v2` ? `control` : normalized;
}
export function getOnboardingExperimentArm(userId: string): string {
  const experiment = getStatsigExperiment(userId, EXPERIMENT_ID);
  const rawArm = experiment.get(ARM_PARAMETER, null);
  const arm = coerceT5ToControl(rawArm);
  if (arm === `control`) {
    if (
      `getGroupName` in experiment &&
      typeof experiment.getGroupName === `function`
    ) {
      return coerceT5ToControl(experiment.getGroupName());
    }
    return `control`;
  }
  return arm;
}
export function isOnboardingExperiment(
  experiment:
    | {
        experimentName?: string;
      }
    | null
    | undefined,
): boolean {
  return experiment?.experimentName === EXPERIMENT_ID;
}
function isDirectFolderPickerArm(arm: string): boolean {
  return arm === `t2_direct_folder_picker`;
}
function isAutoPlaygroundArm(arm: string): boolean {
  return arm === `t3_auto_playground`;
}
function isModalCopyCtaPlaygroundArm(arm: string): boolean {
  return arm === `t4_modal_copy_cta_playground`;
}
export function isPlaygroundVariantArm(arm: string): boolean {
  return (
    isDirectFolderPickerArm(arm) ||
    isAutoPlaygroundArm(arm) ||
    isModalCopyCtaPlaygroundArm(arm)
  );
}
export {
  EXPERIMENT_NAME,
  isAutoPlaygroundArm,
  EXPERIMENT_ID as ONBOARDING_EXPERIMENT_ID,
  isDirectFolderPickerArm,
  CONTROL_GROUP_ID as PLAYGROUND_CONTROL_GROUP_ID,
  getOnboardingExperimentArm as resolveOnboardingExperimentArm,
  PLAYGROUND_GROUP_NAME,
  PLAYGROUND_GROUP_ID,
  isModalCopyCtaPlaygroundArm,
};
