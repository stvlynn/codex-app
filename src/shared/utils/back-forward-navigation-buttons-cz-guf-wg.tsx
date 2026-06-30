// Restored from ref/webview/assets/back-forward-navigation-buttons-Cz-GufWg.js
// back-forward-navigation-buttons-Cz-GufWg chunk restored from the Codex webview bundle.
import { Button } from "ui/button";
import { Tooltip } from "ui/tooltip-b";
import { ArrowLeftIcon } from "icons/arrow-left-icon";
import { useIntl } from "boundaries/intl-messageformat";
interface BackForwardNavigationButtonsProps {
  backLabel: string;
  canGoBack: boolean;
  canGoForward: boolean;
  forwardLabel: string;
  onBack: () => void;
  onForward: () => void;
}
export function BackForwardNavigationButtons({
  backLabel,
  canGoBack,
  canGoForward,
  forwardLabel,
  onBack,
  onForward,
}: BackForwardNavigationButtonsProps) {
  const backDisabled = !canGoBack;
  const backIcon = <ArrowLeftIcon className="icon-xs" />;
  const backButton = (
    <Button
      aria-label={backLabel}
      color="ghost"
      disabled={backDisabled}
      onClick={onBack}
      size="toolbar"
      title={backLabel}
      uniform
    >
      {backIcon}
    </Button>
  );
  const forwardDisabled = !canGoForward;
  const forwardIcon = (
    <ArrowLeftIcon className="icon-xs -scale-x-100 transform" />
  );
  const forwardButton = (
    <Button
      aria-label={forwardLabel}
      color="ghost"
      disabled={forwardDisabled}
      onClick={onForward}
      size="toolbar"
      title={forwardLabel}
      uniform
    >
      {forwardIcon}
    </Button>
  );
  return (
    <>
      {backButton}
      {forwardButton}
    </>
  );
}
