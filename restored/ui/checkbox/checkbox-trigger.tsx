// Restored from ref/webview/assets/checkbox-CrhGhZh2.js
// Checkbox trigger sub-component

import React, { forwardRef, useRef, useEffect } from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import * as Slot from "@radix-ui/react-slot";
import {
  useCheckboxContext,
  getDataState,
  CheckboxState,
} from "./checkbox-context";
export interface CheckboxTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  __scopeCheckbox?: string;
}
const TRIGGER_NAME = "CheckboxTrigger";
export const CheckboxTrigger = forwardRef<
  HTMLButtonElement,
  CheckboxTriggerProps
>(({ __scopeCheckbox, onKeyDown, onClick, ...props }, forwardedRef) => {
  const {
    control,
    value,
    disabled,
    checked,
    required,
    setControl,
    setChecked,
    hasConsumerStoppedPropagationRef,
    isFormControl,
    bubbleInput,
  } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
  const composedRef = composeRefs(forwardedRef, setControl);
  const prevCheckedRef = useRef(checked);
  useEffect(() => {
    const formEl = control?.form;
    if (!formEl) return;
    const handleReset = () => setChecked(prevCheckedRef.current);
    formEl.addEventListener("reset", handleReset);
    return () => formEl.removeEventListener("reset", handleReset);
  }, [control, setChecked]);
  return (
    <Slot.Root
      asChild
      {...props}
      ref={composedRef}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      })}
      onClick={composeEventHandlers(onClick, (event) => {
        setChecked((prev: CheckboxState) =>
          isIndeterminate(prev) ? true : !prev,
        );
        if (bubbleInput && isFormControl) {
          hasConsumerStoppedPropagationRef.current =
            event.isPropagationStopped();
          if (!hasConsumerStoppedPropagationRef.current) {
            event.stopPropagation();
          }
        }
      })}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate(checked) ? "mixed" : checked}
        aria-required={required}
        data-state={getDataState(checked)}
        data-disabled={disabled ? "" : undefined}
        disabled={disabled}
        value={value}
      />
    </Slot.Root>
  );
});
CheckboxTrigger.displayName = TRIGGER_NAME;
function isIndeterminate(value: CheckboxState): boolean {
  return value === "indeterminate";
}
function composeEventHandlers<E extends React.SyntheticEvent>(
  original: ((event: E) => void) | undefined,
  handler: (event: E) => void,
): (event: E) => void {
  return (event) => {
    original?.(event);
    if (!event.defaultPrevented) {
      handler(event);
    }
  };
}
