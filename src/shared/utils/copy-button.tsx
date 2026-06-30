// Restored from ref/webview/assets/copy-button-CRbl2OgP.js
// copy-button-CRbl2OgP chunk restored from the Codex webview bundle.
import React from "react";
import { useIntl, type IntlShape } from "boundaries/intl-messageformat";
import clsx from "clsx";
import { Button } from "ui/button";
import { CheckMdIcon } from "icons/check-md-icon";
import { CopyIcon } from "icons/copy-icon";
import { Tooltip } from "ui/tooltip-b";
function useIsMounted() {
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return () => mountedRef.current;
}
interface CopyButtonProps {
  buttonText?: React.ReactNode;
  iconClassName?: string;
  onCopy: (event: React.MouseEvent) => void;
  ariaLabel?: string;
  className?: string;
  iconOnly?: boolean;
}
export function CopyButton({
  buttonText,
  iconClassName = "icon-sm",
  onCopy,
  ariaLabel,
  className,
  iconOnly = false,
}: CopyButtonProps) {
  const intl = useIntl();
  const [copied, setCopied] = React.useState(false);
  const isMounted = useIsMounted();
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCopy(event);
    setCopied(true);
    setTimeout(() => {
      if (isMounted()) {
        setCopied(false);
      }
    }, 2000);
  };
  const copiedText = (
    <>
      {intl.formatMessage({
        id: "copyButton.copied",
        defaultMessage: "Copied",
        description: "Text displayed when the content has been copied",
      })}
    </>
  );
  let displayText: React.ReactNode = copied ? copiedText : buttonText;
  if (displayText === true) {
    displayText = (
      <>
        {intl.formatMessage({
          id: "copyButton.copy",
          defaultMessage: "Copy",
          description: "Text displayed when the content can be copied",
        })}
      </>
    );
  }
  const tooltipText = copied
    ? copiedText
    : (buttonText ?? (
        <>
          {intl.formatMessage({
            id: "CopyButton.copyTooltip",
            defaultMessage: "Copy",
            description: "Tooltip on copy message icon button",
          })}
        </>
      ));
  const showText = !iconOnly;
  const copiedClass = copied && "text-token-foreground";
  const buttonClass = clsx(copiedClass, className);
  const ariaLabelText = copied
    ? intl.formatMessage({
        id: "copyButton.copiedAriaLabel",
        defaultMessage: "Copied",
        description: "Aria label for a button state when text has been copied",
      })
    : (ariaLabel ??
      intl.formatMessage({
        id: "copyButton.copyAriaLabel",
        defaultMessage: "Copy",
        description: "Aria label for a button for content that can be copied",
      }));
  const clickHandler = copied ? undefined : handleClick;
  const icon = copied ? (
    <CheckMdIcon className={iconClassName} />
  ) : (
    <CopyIcon className={iconClassName} />
  );
  const textContent = !iconOnly && displayText;
  const button = (
    <Button
      className={buttonClass}
      aria-label={ariaLabelText}
      color="ghost"
      size="icon"
      onClick={clickHandler}
    >
      {icon}
      {textContent}
    </Button>
  );
  return (
    <Tooltip tooltipContent={tooltipText} disabled={showText}>
      {button}
    </Tooltip>
  );
}
export { useIsMounted };
