// Restored from ref/webview/assets/checkbox-CrhGhZh2.js
// Checkbox bubble input sub-component

import React, { forwardRef, useRef, useEffect } from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";
import { usePrevious } from "@radix-ui/react-use-previous";
import { useCheckboxContext } from "./checkbox-context";
export interface CheckboxBubbleInputProps extends React.ComponentPropsWithoutRef<"input"> {
  __scopeCheckbox?: string;
}
const BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
export const CheckboxBubbleInput = forwardRef<
  HTMLInputElement,
  CheckboxBubbleInputProps
>(({ __scopeCheckbox, ...props }, forwardedRef) => {
  const {
    hasConsumerStoppedPropagationRef,
    checked,
    defaultChecked,
    required,
    disabled,
    name,
    value,
    form,
    bubbleInput,
    setBubbleInput,
  } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
  const composedRef = composeRefs(forwardedRef, setBubbleInput);
  const prevChecked = usePrevious(checked);
  useEffect(() => {
    const input = bubbleInput;
    if (!input) return;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, "checked");
    const setter = descriptor?.set;
    if (prevChecked !== checked && setter) {
      const event = new Event("click", {
        bubbles: !hasConsumerStoppedPropagationRef.current,
      });
      input.indeterminate = isIndeterminate(checked);
      setter.call(input, isIndeterminate(checked) ? false : checked);
      input.dispatchEvent(event);
    }
  }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
  const initialCheckedRef = useRef(isIndeterminate(checked) ? false : checked);
  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={defaultChecked ?? initialCheckedRef.current}
      required={required}
      disabled={disabled}
      name={name}
      value={value}
      form={form}
      {...props}
      tabIndex={-1}
      ref={composedRef}
      style={{
        ...props.style,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
        transform: "translateX(-100%)",
      }}
    />
  );
});
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isIndeterminate(value: boolean | "indeterminate"): boolean {
  return value === "indeterminate";
}
