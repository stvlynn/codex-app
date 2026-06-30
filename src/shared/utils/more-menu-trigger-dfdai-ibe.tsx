// Restored from ref/webview/assets/more-menu-trigger-DFDAIIbe.js
// more-menu-trigger-DFDAIIbe chunk restored from the Codex webview bundle.
import { Button } from "ui/button";
import { ThreeDotsIcon } from "icons/three-dots-icon";
interface MoreMenuTriggerProps {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  size?:
    | "default"
    | "toolbar"
    | "composerSm"
    | "icon"
    | "composer"
    | "composerLg";
  iconClassName?: string;
  uniform?: boolean;
  [key: string]: unknown;
}
export function MoreMenuTrigger({
  label,
  onClick,
  size = "toolbar",
  iconClassName = "icon-xs",
  uniform = true,
  ...rest
}: MoreMenuTriggerProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick?.(event);
  };
  const icon = <ThreeDotsIcon className={iconClassName} />;
  return (
    <Button
      color="ghost"
      size={size}
      uniform={uniform}
      aria-label={label}
      {...rest}
      onClick={handleClick}
    >
      {icon}
    </Button>
  );
}
