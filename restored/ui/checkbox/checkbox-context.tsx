// Restored from ref/webview/assets/checkbox-CrhGhZh2.js
// Checkbox context and root component

import React, { useState, useRef } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
export type CheckboxState = boolean | "indeterminate";
export interface CheckboxContextValue {
  checked: CheckboxState;
  disabled: boolean | undefined;
  setChecked: (value: CheckboxState) => void;
  control: HTMLButtonElement | null;
  setControl: (el: HTMLButtonElement | null) => void;
  name: string | undefined;
  form: string | undefined;
  value: string;
  hasConsumerStoppedPropagationRef: React.RefObject<boolean>;
  required: boolean | undefined;
  defaultChecked: CheckboxState;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: (el: HTMLInputElement | null) => void;
}
export interface CheckboxProps {
  __scopeCheckbox?: string;
  checked?: CheckboxState;
  children?: React.ReactNode;
  defaultChecked?: CheckboxState;
  disabled?: boolean;
  form?: string;
  name?: string;
  onCheckedChange?: (value: CheckboxState) => void;
  required?: boolean;
  value?: string;
  internal_do_not_use_render?: (ctx: CheckboxContextValue) => React.ReactNode;
}
const CheckboxContext = React.createContext<CheckboxContextValue | null>(null);
export function useCheckboxContext(
  name: string,
  scope?: string,
): CheckboxContextValue {
  const ctx = React.useContext(CheckboxContext);
  if (!ctx) {
    throw new Error(`${name} must be used within a Checkbox`);
  }
  return ctx;
}
export function Checkbox({
  __scopeCheckbox,
  checked,
  children,
  defaultChecked,
  disabled,
  form,
  name,
  onCheckedChange,
  required,
  value = "on",
  internal_do_not_use_render,
}: CheckboxProps): JSX.Element {
  const [control, setControl] = useState<HTMLButtonElement | null>(null);
  const [bubbleInput, setBubbleInput] = useState<HTMLInputElement | null>(null);
  const hasConsumerStoppedPropagationRef = useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : true;
  const [checkedState, setCheckedState] = useControllableState({
    prop: checked,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  });
  const contextValue: CheckboxContextValue = {
    checked: checkedState,
    disabled,
    setChecked: setCheckedState,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked)
      ? false
      : (defaultChecked ?? false),
    isFormControl,
    bubbleInput,
    setBubbleInput,
  };
  return (
    <CheckboxContext.Provider value={contextValue}>
      {internal_do_not_use_render
        ? internal_do_not_use_render(contextValue)
        : children}
    </CheckboxContext.Provider>
  );
}
function isIndeterminate(value: CheckboxState | undefined): boolean {
  return value === "indeterminate";
}
export function getDataState(value: CheckboxState): string {
  return isIndeterminate(value)
    ? "indeterminate"
    : value
      ? "checked"
      : "unchecked";
}
