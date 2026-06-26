// Restored from ref/webview/assets/page-search-input-BoNxWh4n.js
// page-search-input-BoNxWh4n chunk restored from the Codex webview bundle.
import { l as useIntl } from "../boundaries/intl-messageformat";
import clsx from "clsx";
import { XCircleIcon } from "../icons/x-circle-icon";
import { SearchIcon } from "./dropdown-ctb-ro-adh";
export interface PageSearchInputProps {
  autoFocus?: boolean;
  id: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
  label: string;
  maxLength?: number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onSearchQueryChange: (query: string) => void;
  placeholder?: string;
  searchQuery: string;
  variant?: "default" | "composer";
}
export function PageSearchInput({
  autoFocus,
  id,
  inputRef,
  className,
  label,
  maxLength,
  onKeyDown,
  onSearchQueryChange,
  placeholder,
  searchQuery,
  variant = "default",
}: PageSearchInputProps) {
  const intl = useIntl();
  const containerClasses =
    variant === "composer"
      ? "h-9 rounded-full bg-token-input-background/90 electron:dark:bg-token-dropdown-background"
      : "h-token-button-composer rounded-lg bg-token-input-background/75 shadow-sm";
  const wrapperClassName = clsx(
    "no-drag flex items-center gap-2 border border-token-input-border px-2.5 py-0 text-base leading-[18px] backdrop-blur-sm",
    containerClasses,
    className,
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(event.target.value);
  };
  return (
    <div className={wrapperClassName}>
      <SearchIcon className="icon-sm text-token-text-secondary" />
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        autoFocus={autoFocus}
        id={id}
        ref={inputRef}
        className="min-w-0 flex-1 bg-transparent text-base leading-[18px] text-token-input-foreground outline-none select-text placeholder:text-token-input-placeholder-foreground [&::placeholder]:select-none"
        maxLength={maxLength}
        type="text"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      {searchQuery.length > 0 && (
        <button
          aria-label={intl.formatMessage({
            id: "skills.pageSearchInput.clear",
            defaultMessage: "Clear search",
            description: "Accessible label for clearing a search field",
          })}
          className="flex shrink-0 cursor-interaction text-token-text-secondary hover:text-token-foreground"
          type="button"
          onClick={() => onSearchQueryChange("")}
        >
          <XCircleIcon className="icon-sm" />
        </button>
      )}
    </div>
  );
}
