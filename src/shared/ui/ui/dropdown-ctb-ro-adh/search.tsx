// Restored from ref/webview/assets/dropdown-CTBRoADH.js
import React from "react";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
export function SearchIcon(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.33057 1.98535C10.2484 1.98535 12.6136 4.3508 12.6138 7.26855C12.6138 8.58031 12.1346 9.77942 11.3433 10.7031L13.9897 13.3496C14.1655 13.5253 14.1655 13.8106 13.9897 13.9863C13.814 14.1621 13.5288 14.1621 13.353 13.9863L10.7017 11.335C9.78678 12.0942 8.61243 12.5518 7.33057 12.5518C4.41281 12.5516 2.04736 10.1864 2.04736 7.26855C2.04754 4.35091 4.41292 1.98553 7.33057 1.98535ZM7.33057 2.88574C4.90998 2.88592 2.94793 4.84796 2.94775 7.26855C2.94775 9.68929 4.90987 11.6522 7.33057 11.6523C9.75141 11.6523 11.7144 9.6894 11.7144 7.26855C11.7142 4.84786 9.75131 2.88574 7.33057 2.88574Z"
        fill="currentColor"
      />
    </svg>
  );
}
interface InputProps extends ComponentPropsWithoutRef<"input"> {
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
export function Input({ onKeyDown, className, ...rest }: InputProps) {
  const finalClass = clsx(
    "w-full min-w-0 rounded-sm border border-none px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm !outline-none",
    className,
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      event.currentTarget.select();
      return;
    }
    onKeyDown?.(event);
  };
  return (
    <input
      className={finalClass}
      autoFocus
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}
interface SearchInputProps extends ComponentPropsWithoutRef<"input"> {
  className?: string;
  inputClassName?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  trailingContent?: ReactNode;
}
export function SearchInput({
  className,
  inputClassName,
  onKeyDown,
  trailingContent,
  ...rest
}: SearchInputProps) {
  const wrapperClass = clsx(
    "flex w-full items-center gap-1.5",
    "px-[var(--padding-row-x)] py-[var(--padding-row-y)]",
    className,
  );
  const searchIcon = (
    <SearchIcon className="icon-2xs shrink-0 text-token-text-tertiary" />
  );
  const inputClass = clsx(
    "!w-auto flex-1 appearance-none !rounded-none !border-none bg-transparent !px-0 !py-0 text-token-foreground placeholder:text-token-input-placeholder-foreground",
    inputClassName,
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (
      !event.defaultPrevented &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      const direction = event.key === "ArrowDown" ? "next" : "previous";
      if (focusNextMenuItem(event.currentTarget, direction)) {
        event.preventDefault();
      }
    }
  };
  const trailing = trailingContent ? (
    <div className="shrink-0">{trailingContent}</div>
  ) : null;
  return (
    <div className={wrapperClass}>
      {searchIcon}
      <Input className={inputClass} onKeyDown={handleKeyDown} {...rest} />
      {trailing}
    </div>
  );
}
function focusNextMenuItem(
  element: HTMLElement,
  direction: "next" | "previous",
): boolean {
  const menu = element.closest('[role="menu"]');
  if (menu == null) return false;
  const items = Array.from(menu.querySelectorAll('input, [role="menuitem"]'));
  const nextItems = items
    .slice(items.indexOf(element) + 1)
    .filter(
      (item) =>
        item.getAttribute("role") === "menuitem" &&
        !item.hasAttribute("data-disabled") &&
        item.getAttribute("aria-disabled") !== "true",
    );
  const target =
    direction === "next" ? nextItems[0] : nextItems[nextItems.length - 1];
  target?.focus();
  return target != null;
}
