// Restored from ref/webview/assets/setup-codex-wizard-step-view-BQ0iTw_T.js
// Setup Codex wizard step view component restored from the Codex webview bundle.
import { useEffect, useRef } from "react";
import {
  o as useAtomValue,
  t as useAtomCallback,
} from "../shared/boundaries/app-scope.ts";
import { vi as reportOnboardingEvent } from "./thread-context-inputs";
import { Ln as ProductLoggerConstants } from "../shared/utils/product-logger.tsx";
export interface SetupCodexWizardStepViewProps {
  stepName?: string;
  isActive?: boolean;
}
export function SetupCodexWizardStepView(
  props: SetupCodexWizardStepViewProps,
): null {
  const { stepName, isActive = true } = props;
  const getScopeValue = useAtomCallback();
  const previousStepRef = useRef<string | null>(null);
  const scope = useAtomValue();
  useEffect(() => {
    if (isActive && previousStepRef.current !== stepName) {
      previousStepRef.current = stepName ?? null;
      reportOnboardingEvent(
        scope,
        stepName,
        ProductLoggerConstants.CODEX_ONBOARDING_WIZARD_ACTION_VIEWED,
      );
    }
  }, [isActive, stepName, scope]);
  return null;
}
