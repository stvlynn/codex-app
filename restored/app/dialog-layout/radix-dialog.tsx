// Restored from ref/webview/assets/dialog-layout-BUsOXjxz.js
// Low-level Radix Dialog primitives used by the dialog layout system.

import * as React from "react";
import { c as useComposedRefs, d as composeEventHandlers, i as Primitive, l as createContext, n as Presence, o as Slot, t as useControllableState, u as createContextScope } from "../../boundaries/radix-ui/primitive";
import { combinationA, combinationI, combinationN, combinationO, combinationR, combinationS, combinationT } from "../../boundaries/radix-ui-combination";
import type { DialogCloseProps, DialogContentImplProps, DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, DialogRootProps, DialogTitleProps, DialogTriggerProps, FocusOutsideEvent, InteractOutsideEvent, PointerDownOutsideEvent } from "./types";
import { getOpenState } from "./constants";
const DIALOG_NAME = "Dialog";
const [createDialogContext] = createContextScope(DIALOG_NAME);
interface DialogContextValue {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenToggle: () => void;
  modal: boolean;
}
const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME);
export function DialogRoot({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = true
}: DialogRootProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return <DialogProvider triggerRef={triggerRef} contentRef={contentRef} contentId={combinationI()} titleId={combinationI()} descriptionId={combinationI()} open={isOpen} onOpenChange={setIsOpen} onOpenToggle={React.useCallback(() => setIsOpen(prev => !prev), [setIsOpen])} modal={modal}>
      {children}
    </DialogProvider>;
}
DialogRoot.displayName = DIALOG_NAME;
export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(({
  asChild = false,
  ...props
}, forwardedRef) => {
  const context = useDialogContext("DialogTrigger");
  const composedRef = useComposedRefs(forwardedRef, context.triggerRef);
  return <Primitive.button type="button" aria-haspopup="dialog" aria-expanded={context.open} aria-controls={context.contentId} data-state={getOpenState(context.open)} {...props} ref={composedRef} onClick={composeEventHandlers(props.onClick, context.onOpenToggle)} />;
});
DialogTrigger.displayName = "DialogTrigger";
interface DialogPortalContextValue {
  forceMount?: boolean;
}
const [DialogPortalProvider, useDialogPortalContext] = createContext<DialogPortalContextValue>("DialogPortal", {
  forceMount: undefined
});
export function DialogPortal({
  children,
  forceMount,
  container
}: DialogPortalProps) {
  const context = useDialogContext("DialogPortal");
  return <DialogPortalProvider forceMount={forceMount}>
      {React.Children.map(children, child => <Presence present={forceMount || context.open}>
          <combinationR asChild container={container}>
            {child}
          </combinationR>
        </Presence>)}
    </DialogPortalProvider>;
}
DialogPortal.displayName = "DialogPortal";
const DialogOverlaySlot = Slot("DialogOverlay.RemoveScroll");
export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(({
  forceMount,
  ...props
}, forwardedRef) => {
  const portalContext = useDialogPortalContext("DialogOverlay");
  const context = useDialogContext("DialogOverlay");
  const effectiveForceMount = forceMount ?? portalContext.forceMount;
  if (!context.modal) return null;
  return <Presence present={effectiveForceMount || context.open}>
      <DialogOverlayImpl {...props} ref={forwardedRef} />
    </Presence>;
});
DialogOverlay.displayName = "DialogOverlay";
const DialogOverlayImpl = React.forwardRef<HTMLDivElement, DialogOverlayProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogOverlay");
  return <combinationT as={DialogOverlaySlot} allowPinchZoom shards={[context.contentRef]}>
      <Primitive.div data-state={getOpenState(context.open)} {...props} ref={forwardedRef} style={{
      pointerEvents: "auto",
      ...props.style
    }} />
    </combinationT>;
});
DialogOverlayImpl.displayName = "DialogOverlayImpl";
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({
  forceMount,
  ...props
}, forwardedRef) => {
  const portalContext = useDialogPortalContext("DialogContent");
  const context = useDialogContext("DialogContent");
  const effectiveForceMount = forceMount ?? portalContext.forceMount;
  return <Presence present={effectiveForceMount || context.open}>
      {context.modal ? <DialogContentModal {...props} ref={forwardedRef} /> : <DialogContentNonModal {...props} ref={forwardedRef} />}
    </Presence>;
});
DialogContent.displayName = "DialogContent";
const DialogContentModal = React.forwardRef<HTMLDivElement, DialogContentProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogContent");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, context.contentRef, contentRef);
  React.useEffect(() => {
    const node = contentRef.current;
    if (node) return combinationN(node);
  }, []);
  return <DialogContentImpl {...props} ref={composedRef} trapFocus={context.open} disableOutsidePointerEvents onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event: Event) => {
    event.preventDefault();
    context.triggerRef.current?.focus();
  })} onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event: PointerDownOutsideEvent) => {
    const originalEvent = event.detail.originalEvent;
    const isRightClickOrCtrlLeft = originalEvent.button === 2 || originalEvent.button === 0 && originalEvent.ctrlKey;
    if (isRightClickOrCtrlLeft) event.preventDefault();
  })} onFocusOutside={composeEventHandlers(props.onFocusOutside, (event: FocusOutsideEvent) => event.preventDefault())} />;
});
DialogContentModal.displayName = "DialogContentModal";
const DialogContentNonModal = React.forwardRef<HTMLDivElement, DialogContentProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogContent");
  const skipAutoFocusRef = React.useRef(false);
  const wasPointerDownOutsideRef = React.useRef(false);
  return <DialogContentImpl {...props} ref={forwardedRef} trapFocus={false} disableOutsidePointerEvents={false} onCloseAutoFocus={(event: Event) => {
    props.onCloseAutoFocus?.(event);
    if (!event.defaultPrevented) {
      if (!skipAutoFocusRef.current) {
        context.triggerRef.current?.focus();
      }
      event.preventDefault();
    }
    skipAutoFocusRef.current = false;
    wasPointerDownOutsideRef.current = false;
  }} onInteractOutside={(event: InteractOutsideEvent) => {
    props.onInteractOutside?.(event);
    if (!event.defaultPrevented) {
      skipAutoFocusRef.current = true;
      if (event.detail.originalEvent.type === "pointerdown") {
        wasPointerDownOutsideRef.current = true;
      }
    }
    const target = event.target as Node;
    if (context.triggerRef.current?.contains(target)) {
      event.preventDefault();
    }
    if (event.detail.originalEvent.type === "focusin" && wasPointerDownOutsideRef.current) {
      event.preventDefault();
    }
  }} />;
});
DialogContentNonModal.displayName = "DialogContentNonModal";
const DialogContentImpl = React.forwardRef<HTMLDivElement, DialogContentImplProps>(({
  trapFocus,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}, forwardedRef) => {
  const context = useDialogContext("DialogContent");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, contentRef);
  combinationO();
  return <>
        <combinationA asChild loop trapped={trapFocus} onMountAutoFocus={onOpenAutoFocus} onUnmountAutoFocus={onCloseAutoFocus}>
          <combinationS role="dialog" id={context.contentId} aria-describedby={context.descriptionId} aria-labelledby={context.titleId} data-state={getOpenState(context.open)} {...props} ref={composedRef} onDismiss={() => context.onOpenChange(false)} />
        </combinationA>
        <>
          <TitleWarning titleId={context.titleId} />
          <DescriptionWarning contentRef={contentRef} descriptionId={context.descriptionId} />
        </>
      </>;
});
DialogContentImpl.displayName = "DialogContentImpl";
export const DialogTitlePrimitive = React.forwardRef<HTMLHeadingElement, DialogTitleProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogTitle");
  return <Primitive.h2 id={context.titleId} {...props} ref={forwardedRef} />;
});
DialogTitlePrimitive.displayName = "DialogTitle";
export const DialogDescriptionPrimitive = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogDescription");
  return <Primitive.p id={context.descriptionId} {...props} ref={forwardedRef} />;
});
DialogDescriptionPrimitive.displayName = "DialogDescription";
export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>((props, forwardedRef) => {
  const context = useDialogContext("DialogClose");
  return <Primitive.button type="button" {...props} ref={forwardedRef} onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))} />;
});
DialogClose.displayName = "DialogClose";
interface WarningContextValue {
  contentName: string;
  titleName: string;
  docsSlug: string;
}
const [WarningProvider, useWarningContext] = createContext("DialogTitleWarning", {
  contentName: "DialogContent",
  titleName: "DialogTitle",
  docsSlug: "dialog"
});
export { WarningProvider };
function TitleWarning({
  titleId
}: {
  titleId: string;
}) {
  const warning = useWarningContext("DialogTitleWarning");
  const message = `\`${warning.contentName}\` requires a \`${warning.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${warning.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${warning.docsSlug}`;
  React.useEffect(() => {
    if (titleId && !document.getElementById(titleId)) {
      console.error(message);
    }
  }, [message, titleId]);
  return null;
}
function DescriptionWarning({
  contentRef,
  descriptionId
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
  descriptionId: string;
}) {
  const warning = useWarningContext("DialogDescriptionWarning");
  const message = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${warning.contentName}}.`;
  React.useEffect(() => {
    const describedBy = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedBy && !document.getElementById(descriptionId)) {
      console.warn(message);
    }
  }, [message, contentRef, descriptionId]);
  return null;
}