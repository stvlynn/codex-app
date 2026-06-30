// Restored from ref/webview/assets/checkbox-CrhGhZh2.js
// Styled checkbox component

import React from "react";
import clsx from "clsx";
import { CheckMdIcon } from "../../../icons/check-md-icon.tsx";
import { MinusIcon } from "../../../icons/minus-icon.tsx";
import { Checkbox, CheckboxState } from "./checkbox-context";
import { CheckboxTrigger } from "./checkbox-trigger";
import { CheckboxIndicator } from "./checkbox-indicator";
import { CheckboxBubbleInput } from "./checkbox-bubble-input";
export interface StyledCheckboxProps extends React.ComponentPropsWithoutRef<"button"> {
  className?: string;
  checked?: CheckboxState;
  defaultChecked?: CheckboxState;
  onCheckedChange?: (value: CheckboxState) => void;
  disabled?: boolean;
}
export function StyledCheckbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}: StyledCheckboxProps): JSX.Element {
  const isDisabled = disabled ?? false;
  const hoverClass = !isDisabled
    ? "hover:bg-token-editor-background"
    : undefined;
  const checkboxClassName = clsx(
    "border-token-border peer",
    "data-[state=checked]:bg-token-checkbox-background data-[state=checked]:text-token-checkbox-foreground",
    "data-[state=checked]:border-token-border",
    "data-[state=indeterminate]:bg-token-checkbox-background data-[state=indeterminate]:text-token-checkbox-foreground",
    "data-[state=indeterminate]:border-token-border",
    "focus-visible:border-token-border focus-visible:ring-token-checkbox-background/50 focus-visible:ring-1",
    "aria-invalid:ring-2 aria-invalid:ring-token-error-foreground/20",
    "aria-invalid:border-token-error-foreground",
    "icon-2xs rounded-xs shrink-0 border shadow-sm outline-none transition-[background-color,border-color,box-shadow]",
    "disabled:cursor-not-allowed",
    hoverClass,
    className,
  );
  const handleCheckedChange = (value: CheckboxState) => {
    onCheckedChange?.(value === "indeterminate" ? true : value);
  };
  const indicator = (
    <CheckboxIndicator className="flex h-full w-full items-center justify-center text-current">
      {checked === "indeterminate" ? (
        <MinusIcon className="icon-2xs flex-shrink-0" />
      ) : (
        <CheckMdIcon className="icon-xxs flex-shrink-0" />
      )}
    </CheckboxIndicator>
  );
  return (
    <Checkbox
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={isDisabled}
      onCheckedChange={handleCheckedChange}
      internal_do_not_use_render={({ isFormControl }) => (
        <>
          <CheckboxTrigger {...props} className={checkboxClassName} />
          {indicator}
          {isFormControl && <CheckboxBubbleInput />}
        </>
      )}
    />
  );
}
