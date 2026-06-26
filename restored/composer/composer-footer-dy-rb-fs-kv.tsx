// Restored from ref/webview/assets/composer-footer-DyRbFsKV.js
// Composer footer components for the chat composer UI.

import clsx from "clsx";
const styles = {
  footer: "_footer_1s82e_2",
  labelSm: "_labelSm_1s82e_2",
  labelXs: "_labelXs_1s82e_2",
  secondaryLabel: "_secondaryLabel_1s82e_2",
  secondaryChevron: "_secondaryChevron_1s82e_2",
};
export interface ComposerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  responsive?: boolean;
}
export function ComposerFooter(props: ComposerFooterProps): JSX.Element {
  const { className, responsive = true, ...rest } = props;
  const footerClass = clsx(
    "select-none",
    responsive && styles.footer,
    className,
  );
  return <div className={footerClass} {...rest} />;
}
export type LabelSize = "sm" | "xs" | "secondary";
export interface ComposerLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  collapse?: LabelSize;
}
export function ComposerLabel(props: ComposerLabelProps): JSX.Element {
  const { className, collapse, ...rest } = props;
  let sizeClass: string | undefined;
  switch (collapse) {
    case "sm":
      sizeClass = styles.labelSm;
      break;
    case "xs":
      sizeClass = styles.labelXs;
      break;
    case "secondary":
      sizeClass = clsx(styles.labelSm, styles.secondaryLabel);
      break;
  }
  const labelClass = clsx(sizeClass, className);
  return <span className={labelClass} {...rest} />;
}
export interface ComposerChevronProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}
export function ComposerChevron(props: ComposerChevronProps): JSX.Element {
  const { className, ...rest } = props;
  const chevronClass = clsx(styles.secondaryChevron, "inline-flex", className);
  return <span className={chevronClass} {...rest} />;
}
