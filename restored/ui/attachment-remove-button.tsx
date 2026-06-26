// Restored from ref/webview/assets/attachment-remove-button-DSovq5XM.js

import React from "react";
import clsx from "clsx";
import { XIcon } from "../icons/x-icon";
export interface AttachmentRemoveButtonProps {
  ariaLabel: string;
  className?: string;
  onRemove: () => void;
}
export function AttachmentRemoveButton({
  ariaLabel,
  className = "top-1 right-1",
  onRemove,
}: AttachmentRemoveButtonProps): JSX.Element {
  const handlePointerDown = (event: React.PointerEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleClick = (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    onRemove();
  };
  const buttonClassName = clsx(
    "absolute flex size-4 cursor-interaction items-center justify-center rounded-full bg-token-foreground text-token-dropdown-background shadow-sm",
    className,
  );
  return (
    <button
      type="button"
      className={buttonClassName}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <XIcon className="icon-xxs" />
    </button>
  );
}
