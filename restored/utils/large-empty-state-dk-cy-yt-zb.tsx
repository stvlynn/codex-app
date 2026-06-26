// Restored from ref/webview/assets/large-empty-state-DKCyYtZB.js

import { clsx } from "clsx";
interface LargeEmptyStateProps {
  className?: string;
  contentClassName?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  illustration?: React.ReactNode;
  illustrationSize?: "default" | "hero";
  spacing?: "default" | "compact";
  titleSize?: "default" | "lg";
  tone?: "default" | "faded";
}
export function LargeEmptyState({
  className,
  contentClassName,
  title,
  description,
  actions,
  illustration,
  illustrationSize = "default",
  spacing = "default",
  titleSize = "default",
  tone = "default",
}: LargeEmptyStateProps): JSX.Element {
  const wrapperClass = clsx(
    "flex w-full flex-col items-center justify-center px-3 py-6",
    className,
  );
  const gapClass = spacing === "compact" ? "gap-2" : "gap-6";
  const toneClass = tone === "faded" ? "opacity-60" : undefined;
  const contentClass = clsx(
    "flex w-full max-w-xl flex-col items-center justify-center text-center",
    gapClass,
    toneClass,
    contentClassName,
  );
  const illustrationElement = illustration ? (
    <div
      className={clsx(
        "pointer-events-none text-token-input-placeholder-foreground",
        illustrationSize === "hero" &&
          "relative h-32 w-[30rem] max-w-full overflow-visible",
      )}
    >
      {illustrationSize === "hero" ? (
        <div className="absolute top-1/2 left-1/2 size-[30rem] max-h-[55vh] max-w-full -translate-x-1/2 -translate-y-1/2">
          {illustration}
        </div>
      ) : (
        illustration
      )}
    </div>
  ) : null;
  const textElement =
    title != null || description != null ? (
      <div className="flex flex-col items-center gap-2">
        {title != null ? (
          <div
            className={clsx(
              "font-medium",
              titleSize === "lg" ? "text-lg" : "text-base",
            )}
          >
            {title}
          </div>
        ) : null}
        {description ? (
          <div className="text-base text-token-description-foreground">
            {description}
          </div>
        ) : null}
      </div>
    ) : null;
  const actionsElement = actions ? (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {actions}
    </div>
  ) : null;
  return (
    <div className={wrapperClass}>
      <div className={contentClass}>
        {illustrationElement}
        {textElement}
        {actionsElement}
      </div>
    </div>
  );
}
