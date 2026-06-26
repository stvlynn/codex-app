// Restored from ref/webview/assets/bullet-separator-BJK3jgEi.js

import React from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
export interface BulletSeparatorProps {
  className?: string;
}
export function BulletSeparator({
  className,
}: BulletSeparatorProps): JSX.Element {
  const separatorClassName = clsx("last:hidden", className);
  return (
    <span aria-hidden className={separatorClassName}>
      <FormattedMessage
        id="codex.ui.bulletSeparator"
        defaultMessage="·"
        description="Middle dot separator used between inline items"
      />
    </span>
  );
}
