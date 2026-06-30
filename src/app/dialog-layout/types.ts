// Restored from ref/webview/assets/dialog-layout-BUsOXjxz.js
// Shared types for the dialog layout components.

import * as React from "react";
export type DialogSize = "default" | "narrow" | "feature" | "compact" | "wide" | "xwide" | "xxwide" | "editor";
export type DialogBodySize = "full" | "tall";
export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}
export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}
export interface DialogPortalProps {
  children?: React.ReactNode;
  forceMount?: boolean;
  container?: HTMLElement | null;
}
export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}
export interface PointerDownOutsideEvent extends CustomEvent {
  detail: {
    originalEvent: PointerEvent;
  };
}
export interface FocusOutsideEvent extends CustomEvent {
  detail: {
    originalEvent: FocusEvent;
  };
}
export interface InteractOutsideEvent extends CustomEvent {
  detail: {
    originalEvent: PointerEvent | FocusEvent;
  };
}
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  onFocusOutside?: (event: FocusOutsideEvent) => void;
  onInteractOutside?: (event: InteractOutsideEvent) => void;
}
export interface DialogContentImplProps extends DialogContentProps {
  trapFocus: boolean;
  disableOutsidePointerEvents: boolean;
}
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export interface DialogHeaderProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  iconBackgroundClassName?: string;
  titleSize?: "lg" | "base" | "sm" | "dialog";
  titleClassName?: string;
  subtitleSize?: "base" | "sm";
  subtitleClassName?: string;
}
export interface DialogBodyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "as"> {
  children?: React.ReactNode;
  className?: string;
  size?: DialogBodySize;
  as?: "div" | "form";
}
export interface DialogFooterProps {
  children?: React.ReactNode;
  className?: string;
  expandSingleButton?: boolean;
}
export interface DialogSectionProps {
  children?: React.ReactNode;
  className?: string;
}
export interface FormRowProps {
  children?: React.ReactNode;
  className?: string;
}
export interface FieldStackProps {
  children?: React.ReactNode;
  className?: string;
}
export interface DialogLayoutProps extends DialogRootProps {
  children?: React.ReactNode;
  triggerContent?: React.ReactNode;
  triggerAsChild?: boolean;
  triggerRef?: React.Ref<HTMLButtonElement>;
  contentClassName?: string;
  contentProps?: Omit<DialogContentProps, "className" | "style" | "onPointerDown" | "onPointerDownOutside">;
  dialogCloseClassName?: string;
  dialogCloseLabel?: string;
  overlayClassName?: string;
  portalContainer?: HTMLElement | null;
  showDialogClose?: boolean;
  shouldIgnoreClickOutside?: boolean;
  unstyledContent?: boolean;
  viewportSized?: boolean;
  size?: DialogSize;
}
export interface DialogContentWrapperProps extends DialogContentProps {
  contentClassName?: string;
  dialogCloseClassName?: string;
  dialogCloseLabel?: string;
  overlayClassName?: string;
  portalContainer?: HTMLElement | null;
  showDialogClose?: boolean;
  shouldIgnoreClickOutside?: boolean;
  unstyledContent?: boolean;
  viewportSized?: boolean;
  size?: DialogSize;
}
export interface DialogTriggerWrapperProps {
  asChild?: boolean;
  triggerRef?: React.Ref<HTMLButtonElement>;
  children?: React.ReactNode;
}