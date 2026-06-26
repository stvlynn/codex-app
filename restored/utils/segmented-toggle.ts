// Restored from ref/webview/assets/segmented-toggle-De13HuEU.js
// segmented-toggle-De13HuEU chunk restored from the Codex webview bundle.
import { Button } from "ui/button";
import { Tooltip } from "ui/tooltip-b";
import clsx from "clsx";
interface SegmentedToggleOption {
  id: string;
  label: React.ReactNode;
  tooltipContent?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}
interface SegmentedToggleProps {
  options?: SegmentedToggleOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  size?: "default" | "icon" | "toolbar" | "composerSm" | "composer" | "composerLg";
  className?: string;
  buttonClassName?: string;
  fullWidth?: boolean;
  uniform?: boolean;
  selectedColor?: "primary" | "secondary" | "ghost" | "ghostMuted" | "outline" | "danger";
  unselectedColor?: "primary" | "secondary" | "ghost" | "ghostMuted" | "outline" | "danger";
  ariaLabel?: string;
  ariaLabelledBy?: string;
}
export function SegmentedToggle({
  options = [],
  selectedId,
  onSelect,
  size = "default",
  className,
  buttonClassName,
  fullWidth = false,
  uniform,
  selectedColor = "secondary",
  unselectedColor = "ghost",
  ariaLabel,
  ariaLabelledBy
}: SegmentedToggleProps) {
  const effectiveUniform = uniform ?? (size === "icon" && options.length > 2);
  const containerClass = fullWidth ? "flex w-full" : "inline-flex";
  const wrapperClass = clsx(containerClass, "items-center gap-0.5", className);
  const optionButtons = options.map(option => {
    const isSelected = option.id === selectedId;
    const isDisabled = option.disabled ?? false;
    const handleClick = () => {
      if (!isDisabled) {
        onSelect(option.id);
      }
    };
    const button = <Button color={isSelected ? selectedColor : unselectedColor} size={size} onClick={handleClick} aria-pressed={isSelected} uniform={effectiveUniform} aria-label={option.ariaLabel} disabled={isDisabled} className={clsx(fullWidth ? "flex-1 justify-center" : undefined, buttonClassName)}>
        {option.label}
      </Button>;
    return option.tooltipContent ? <Tooltip key={option.id} tooltipContent={option.tooltipContent}>
        {button}
      </Tooltip> : button;
  });
  return <div className={wrapperClass} role="group" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {optionButtons}
    </div>;
}