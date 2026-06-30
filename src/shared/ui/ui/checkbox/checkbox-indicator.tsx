// Restored from ref/webview/assets/checkbox-CrhGhZh2.js
// Checkbox indicator sub-component

import React, { forwardRef } from "react";
import { Presence } from "@radix-ui/react-presence";
import * as Slot from "@radix-ui/react-slot";
import { useCheckboxContext, getDataState } from "./checkbox-context";
export interface CheckboxIndicatorProps extends React.ComponentPropsWithoutRef<"span"> {
  __scopeCheckbox?: string;
  forceMount?: boolean;
}
const INDICATOR_NAME = "CheckboxIndicator";
export const CheckboxIndicator = forwardRef<
  HTMLSpanElement,
  CheckboxIndicatorProps
>(({ __scopeCheckbox, forceMount, ...props }, forwardedRef) => {
  const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
  return (
    <Presence
      present={
        forceMount ||
        isIndeterminate(context.checked) ||
        context.checked === true
      }
    >
      <Slot.Root
        asChild
        {...props}
        ref={forwardedRef}
        data-state={getDataState(context.checked)}
        data-disabled={context.disabled ? "" : undefined}
        style={{
          pointerEvents: "none",
          ...props.style,
        }}
      >
        <span />
      </Slot.Root>
    </Presence>
  );
});
CheckboxIndicator.displayName = INDICATOR_NAME;
function isIndeterminate(value: boolean | "indeterminate"): boolean {
  return value === "indeterminate";
}
