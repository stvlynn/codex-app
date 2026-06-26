// Restored from ref/webview/assets/banner-NiedSf5B.js
// banner-NiedSf5B chunk restored from the Codex webview bundle.
import clsx from "clsx";
import { Button } from "ui/button";
interface BannerProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  customCtas?: React.ReactNode;
  onPrimaryCtaClick?: () => void;
  primaryCtaText?: string;
  primaryCtaColor?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  secondaryCtaColor?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  onSecondaryCtaClick?: () => void;
  onDangerCtaClick?: () => void;
  secondaryCtaText?: string;
  dangerCtaText?: string;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
  iconClassName?: string;
  isPrimaryCtaDisabled?: boolean;
  isSecondaryCtaDisabled?: boolean;
  isDangerCtaDisabled?: boolean;
  type?: "normal" | "error" | "info" | "infoAccent";
  className?: string;
  layout?: "horizontal" | "vertical" | "verticalIcon";
  stackOnNarrow?: boolean;
}
export function Banner({
  title,
  content,
  customCtas,
  onPrimaryCtaClick,
  primaryCtaText,
  primaryCtaColor,
  secondaryCtaColor,
  onSecondaryCtaClick,
  onDangerCtaClick,
  secondaryCtaText,
  dangerCtaText,
  Icon,
  iconClassName,
  isPrimaryCtaDisabled = false,
  isSecondaryCtaDisabled = false,
  isDangerCtaDisabled = false,
  type = "normal",
  className,
  layout = "horizontal",
  stackOnNarrow = false,
}: BannerProps) {
  const isVertical = layout === "vertical";
  const isVerticalIcon = layout === "verticalIcon";
  const isHorizontalStack = layout === "horizontal" && stackOnNarrow;
  const ctaWrapperClass = isVertical ? "w-full justify-end pt-0" : "shrink-0";
  const narrowCtaClass =
    isHorizontalStack &&
    "max-[400px]:w-full max-[400px]:shrink max-[400px]:justify-center";
  const ctaClass = clsx("flex gap-2 pb-0", ctaWrapperClass, narrowCtaClass);
  const ctaButtons = customCtas ? (
    <div className={ctaClass}>{customCtas}</div>
  ) : (
    (primaryCtaText || secondaryCtaText || dangerCtaText) && (
      <div className={ctaClass}>
        {primaryCtaText && (
          <Button
            onClick={onPrimaryCtaClick}
            color={primaryCtaColor ?? "outline"}
            className="shrink-0"
            disabled={isPrimaryCtaDisabled}
          >
            {primaryCtaText}
          </Button>
        )}
        {secondaryCtaText && (
          <Button
            onClick={onSecondaryCtaClick}
            color={secondaryCtaColor ?? "ghost"}
            className="shrink-0"
            disabled={isSecondaryCtaDisabled}
          >
            {secondaryCtaText}
          </Button>
        )}
        {dangerCtaText && (
          <Button
            onClick={onDangerCtaClick}
            color="danger"
            className="shrink-0"
            disabled={isDangerCtaDisabled}
          >
            {dangerCtaText}
          </Button>
        )}
      </div>
    )
  );
  const typeClass = {
    error:
      "border-token-error-foreground/20 text-token-error-foreground bg-token-input-validation-error-background/20",
    info: "border-token-border bg-token-input-background text-token-foreground",
    infoAccent:
      "border-token-text-link-foreground/40 bg-token-input-background text-token-foreground",
    normal:
      "border-token-border bg-token-input-background text-token-foreground",
  }[type];
  const iconClass = clsx(
    "icon-sm shrink-0",
    type === "infoAccent" && "text-token-text-link-foreground",
    iconClassName,
  );
  const TitleBlock = () => (
    <div className="flex items-center gap-1">
      {Icon && <Icon className={iconClass} />}
      {title && (
        <h3 className="text-pretty electron:text-base electron:font-semibold extension:text-sm extension:font-bold">
          {title}
        </h3>
      )}
    </div>
  );
  const ContentBlock = ({ gapClass }: { gapClass?: string }) => (
    <div className={clsx("flex min-w-0 flex-1 flex-col", gapClass)}>
      <div
        className={clsx(
          "electron:leading-relaxed min-w-0 flex-1 text-pretty",
          title
            ? type === "error"
              ? "text-token-error-foreground"
              : "text-token-description-foreground"
            : "",
        )}
      >
        {content}
      </div>
    </div>
  );
  if (isVertical) {
    const asideClass = clsx(
      "flex w-full flex-col gap-1.5 rounded-3xl border py-2 pl-3 pr-2 text-sm lg:mx-auto dark:border-transparent",
      typeClass,
      className,
    );
    const header = (Icon || title) && <TitleBlock />;
    const body = <ContentBlock gapClass="gap-1.5" />;
    return (
      <div className="rounded-3xl bg-token-side-bar-background opacity-100">
        <aside className={asideClass}>
          {header}
          {body}
          {ctaButtons}
        </aside>
      </div>
    );
  }
  if (isVerticalIcon) {
    const asideClass = clsx(
      "flex w-full gap-3 rounded-3xl border py-2 pl-3 pr-2 text-sm lg:mx-auto dark:border-transparent",
      typeClass,
      className,
    );
    const titleEl = title ? (
      <h3 className="text-pretty electron:text-base electron:font-semibold extension:text-sm extension:font-bold">
        {title}
      </h3>
    ) : null;
    return (
      <div className="rounded-3xl bg-token-side-bar-background opacity-100">
        <aside className={asideClass}>
          {Icon ? (
            <div className="flex items-center self-center">
              <Icon className={iconClass} />
            </div>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {titleEl}
            <ContentBlock />
            {ctaButtons}
          </div>
        </aside>
      </div>
    );
  }

  // Horizontal layout
  const outerClass = "rounded-3xl bg-token-side-bar-background opacity-100";
  const asideClass = clsx(
    "flex w-full items-center gap-4 rounded-3xl border py-2 pl-3 pr-2 text-sm lg:mx-auto dark:border-transparent",
    isHorizontalStack && "max-[400px]:items-start max-[400px]:gap-2",
    typeClass,
    className,
  );
  const innerWrapperClass = clsx(
    "flex h-full w-full items-center gap-2",
    isHorizontalStack && "max-[400px]:items-start",
  );
  const iconEl = Icon && (
    <Icon
      className={clsx(iconClass, isHorizontalStack && "max-[400px]:hidden")}
    />
  );
  const narrowStackClass =
    isHorizontalStack &&
    "max-[400px]:flex-col max-[400px]:items-stretch max-[400px]:gap-2";
  const contentWrapperClass = clsx(
    "flex min-w-0 grow flex-row items-center justify-between gap-2",
    narrowStackClass,
  );
  const titleEl = title && (
    <h3 className="text-sm font-bold text-pretty">{title}</h3>
  );
  return (
    <div className={outerClass}>
      <aside className={asideClass}>
        <div className={innerWrapperClass}>
          {iconEl}
          <div className={contentWrapperClass}>
            {titleEl}
            <ContentBlock />
            {ctaButtons}
          </div>
        </div>
      </aside>
    </div>
  );
}
