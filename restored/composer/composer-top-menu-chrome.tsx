// Restored from ref/webview/assets/composer-top-menu-chrome-DbsJIjHi.js
// ComposerTopMenuChrome component restored from the Codex webview bundle.
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
const styles = {
  expandedTopTrayShell: "_expandedTopTrayShell_ly16b_1",
  expandedTopTrayInFlowShell: "_expandedTopTrayInFlowShell_ly16b_9",
  expandedTopTrayPanel: "_expandedTopTrayPanel_ly16b_14",
  paddedBodyExpandedTopTrayPanel: "_paddedBodyExpandedTopTrayPanel_ly16b_49",
  embeddedExpandedTopTrayPanel: "_embeddedExpandedTopTrayPanel_ly16b_53",
};
export interface ComposerTopMenuChromeShellProps {
  className?: string;
  expandedTopTray?: boolean;
  inFlow?: boolean;
}
export function ComposerTopMenuChromeShell({
  className,
  expandedTopTray = false,
  inFlow = false,
  ...rest
}: ComposerTopMenuChromeShellProps & React.HTMLAttributes<HTMLDivElement>) {
  const expandedClass = expandedTopTray && styles.expandedTopTrayShell;
  const inFlowClass =
    expandedTopTray && inFlow && styles.expandedTopTrayInFlowShell;
  const combinedClassName = clsx(expandedClass, inFlowClass, className);
  return <div {...rest} className={combinedClassName} />;
}
export interface ComposerTopMenuChromePanelProps {
  children: React.ReactNode;
  className?: string;
  containerRef?: React.Ref<HTMLDivElement>;
  embedded?: boolean;
  expandedTopTray?: boolean;
  paddedBody?: boolean;
}
export function ComposerTopMenuChromePanel({
  children,
  className,
  containerRef,
  embedded = false,
  expandedTopTray = false,
  paddedBody = false,
}: ComposerTopMenuChromePanelProps) {
  const expandedClass = expandedTopTray && styles.expandedTopTrayPanel;
  const embeddedClass =
    expandedTopTray && embedded && styles.embeddedExpandedTopTrayPanel;
  const paddedClass =
    expandedTopTray && paddedBody && styles.paddedBodyExpandedTopTrayPanel;
  const combinedClassName = clsx(
    expandedClass,
    embeddedClass,
    paddedClass,
    className,
  );
  return (
    <div ref={containerRef} className={combinedClassName}>
      {children}
    </div>
  );
}
export interface ComposerTopMenuChromeDialogProps {
  className?: string;
  contentClassName?: string;
  expandedTopTray?: boolean;
}
export function ComposerTopMenuChromeDialog({
  className,
  contentClassName,
  expandedTopTray = false,
  ...rest
}: ComposerTopMenuChromeDialogProps & Dialog.DialogProps) {
  const panelClass = expandedTopTray && styles.expandedTopTrayPanel;
  const shellClass = expandedTopTray && styles.expandedTopTrayShell;
  const combinedClassName = clsx(panelClass, className);
  const combinedContentClassName = clsx(shellClass, contentClassName);
  return (
    <Dialog.Root {...rest}>
      <Dialog.Trigger asChild>
        <button className={combinedClassName} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className={combinedContentClassName} />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
