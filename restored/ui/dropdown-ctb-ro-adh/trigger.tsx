// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ComponentPropsWithoutRef, Ref } from "react";
import clsx from "clsx";
import { t as DropdownMenuTriggerPrimitive } from "../../boundaries/react-modal-dist";
interface DropdownTriggerProps extends ComponentPropsWithoutRef<"button"> {
  ref?: Ref<HTMLButtonElement>;
  disabled?: boolean;
}
export function DropdownTrigger({
  ref,
  disabled,
  className,
  ...rest
}: DropdownTriggerProps) {
  const disabledClass = disabled
    ? "cursor-default opacity-25"
    : "cursor-interaction";
  const finalClass = clsx("outline-hidden", disabledClass, className);
  return (
    <DropdownMenuTriggerPrimitive
      ref={ref}
      aria-disabled={disabled || undefined}
      className={finalClass}
      {...rest}
    />
  );
}
