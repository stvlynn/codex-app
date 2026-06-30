// Restored from ref/webview/assets/sectioned-page-OCNQDwEC.js
// sectioned-page-OCNQDwEC chunk restored from the Codex webview bundle.
import React from "react";
import clsx from "clsx";
import { Button } from "ui/button";
interface Section {
  id: string;
  title: string;
}
interface SectionedPageProps {
  ariaLabel?: string;
  sections: Section[];
  children: React.ReactNode;
  className?: string;
  contentInnerClassName?: string;
  disableScrollFade?: boolean;
  header?: React.ReactNode;
  navOrientation?: "vertical" | "horizontal";
  navAccessory?: React.ReactNode;
  navFooter?: React.ReactNode;
  navSections?: Section[];
  onSelectNavSection?: (sectionId: string) => void;
  showNav?: boolean;
}
interface SectionedPageContextValue {
  setSectionElement: (id: string, element: HTMLElement | null) => void;
}
const SectionedPageContext =
  React.createContext<SectionedPageContextValue | null>(null);
function useSectionedPageScroll(
  container: HTMLElement | null,
  sectionIds: string[],
) {
  const sectionElementsRef = React.useRef<Record<string, HTMLElement | null>>(
    {},
  );
  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (container == null) return () => {};
      const handler = () => callback();
      container.addEventListener("scroll", handler, {
        passive: true,
      });
      const resizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(handler)
          : null;
      if (resizeObserver != null) {
        resizeObserver.observe(container);
        for (const id of sectionIds) {
          const el = sectionElementsRef.current[id];
          if (el != null) resizeObserver.observe(el);
        }
      }
      return () => {
        container.removeEventListener("scroll", handler);
        resizeObserver?.disconnect();
      };
    },
    [container, sectionIds],
  );
  const getSnapshot = React.useCallback(() => {
    if (sectionIds.length === 0) return null;
    if (container == null) return sectionIds[0];
    const threshold = container.getBoundingClientRect().top + 96;
    let activeId = sectionIds[0];
    for (const id of sectionIds) {
      const el = sectionElementsRef.current[id];
      if (el != null) {
        if (el.getBoundingClientRect().top <= threshold) {
          activeId = id;
        } else {
          break;
        }
      }
    }
    return activeId;
  }, [container, sectionIds]);
  const activeSectionId = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
  const setSectionElement = React.useCallback(
    (id: string, element: HTMLElement | null) => {
      if (element == null) {
        delete sectionElementsRef.current[id];
        return;
      }
      sectionElementsRef.current[id] = element;
    },
    [],
  );
  const scrollToSection = React.useCallback((id: string) => {
    sectionElementsRef.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);
  return {
    activeSectionId,
    scrollToSection,
    setSectionElement,
  };
}
function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--thread-content-max-width)] flex-col gap-1 px-panel pt-panel">
      {children}
    </div>
  );
}
function SectionNav({
  activeSectionId,
  accessory,
  ariaLabel,
  footer,
  orientation,
  onSelectSection,
  sections,
}: {
  activeSectionId: string | null;
  accessory?: React.ReactNode;
  ariaLabel?: string;
  footer?: React.ReactNode;
  orientation: "vertical" | "horizontal";
  onSelectSection: (sectionId: string) => void;
  sections: Section[];
}) {
  const navClass =
    orientation === "vertical" ? "hidden lg:block lg:self-start" : "w-full";
  const content =
    orientation === "vertical" ? (
      <div className="flex flex-col gap-1">
        {sections.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={clsx(
              "text-left text-lg leading-6 transition-colors",
              activeSectionId === item.id
                ? "text-token-foreground"
                : "text-token-text-secondary hover:text-token-foreground",
            )}
            onClick={(event) => {
              event.preventDefault();
              onSelectSection(item.id);
            }}
          >
            {item.title}
          </a>
        ))}
      </div>
    ) : (
      <div className="flex w-full flex-col gap-8">
        <div className="mx-auto flex w-full flex-col gap-8 px-panel lg:max-w-none">
          {footer}
          <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3">
            {sections.map((item) => (
              <Button
                key={item.id}
                color={activeSectionId === item.id ? "secondary" : "ghost"}
                size="toolbar"
                onClick={() => onSelectSection(item.id)}
                aria-pressed={activeSectionId === item.id}
              >
                {item.title}
              </Button>
            ))}
            {accessory == null ? null : (
              <div className="flex items-center gap-3">
                <div className="h-6 w-px bg-token-border-light" />
                {accessory}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  return (
    <nav aria-label={ariaLabel} className={navClass}>
      {content}
    </nav>
  );
}
export function SectionedPage({
  ariaLabel,
  sections,
  children,
  className,
  contentInnerClassName,
  disableScrollFade = false,
  header,
  navOrientation = "vertical",
  navAccessory,
  navFooter,
  navSections,
  onSelectNavSection,
  showNav = true,
}: SectionedPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const handleContainerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (containerRef.current !== node) {
        containerRef.current = node;
        setContainer(node);
      }
    },
    [],
  );
  const sectionIds = sections.map((s) => s.id);
  const { activeSectionId, scrollToSection, setSectionElement } =
    useSectionedPageScroll(container, sectionIds);
  const effectiveNavSections = navSections ?? sections;
  const showNavigation = showNav && effectiveNavSections.length > 0;
  const wrapperClass = clsx(
    "flex min-h-0 w-full flex-1 flex-col gap-8 [--sectioned-page-leading-inset:0.5rem]",
    className,
  );
  const headerEl = header == null ? null : <PageHeader>{header}</PageHeader>;
  const layoutClass = showNavigation
    ? navOrientation === "vertical"
      ? "flex min-h-0 w-full flex-1 flex-col gap-8 lg:grid lg:grid-cols-[theme(spacing.32)_minmax(0,1fr)] lg:items-start lg:gap-10"
      : "flex min-h-0 w-full flex-1 flex-col gap-8"
    : "flex min-h-0 w-full flex-1 flex-col";
  const layoutClassName = clsx(layoutClass);
  const nav = showNavigation ? (
    <SectionNav
      activeSectionId={activeSectionId}
      accessory={navAccessory}
      ariaLabel={ariaLabel}
      footer={navFooter}
      orientation={navOrientation}
      onSelectSection={onSelectNavSection ?? scrollToSection}
      sections={effectiveNavSections}
    />
  ) : null;
  const scrollFadeClass =
    !disableScrollFade &&
    "vertical-scroll-fade-mask [--edge-fade-distance:1rem]";
  const scrollClass = clsx(
    "relative min-h-0 w-full flex-1 overflow-y-auto [scrollbar-gutter:stable] lg:h-full",
    scrollFadeClass,
  );
  const contentClass = clsx(
    "mx-auto w-full max-w-[var(--thread-content-max-width)]",
    contentInnerClassName,
  );
  const content = (
    <div className={scrollClass} ref={handleContainerRef}>
      <div className={contentClass}>{children}</div>
    </div>
  );
  return (
    <div className={wrapperClass}>
      {headerEl}
      <div className={layoutClassName}>
        {nav}
        <SectionedPageContext.Provider
          value={{
            setSectionElement,
          }}
        >
          {content}
        </SectionedPageContext.Provider>
      </div>
    </div>
  );
}
interface SectionedPageSectionProps {
  id: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  stickyHeader?: boolean;
  showDivider?: boolean;
  children: React.ReactNode;
}
export function SectionedPageSection({
  id,
  title,
  action,
  stickyHeader = false,
  showDivider = true,
  children,
}: SectionedPageSectionProps) {
  const context = React.useContext(SectionedPageContext);
  const handleRef = React.useCallback(
    (node: HTMLElement | null) => {
      context?.setSectionElement(id, node);
    },
    [context, id],
  );
  const stickyClass =
    stickyHeader &&
    "relative sticky top-0 z-10 bg-token-main-surface-primary after:pointer-events-none after:absolute after:-inset-x-3 after:top-full after:h-2 after:bg-token-main-surface-primary after:content-['']";
  const dividerClass = showDivider && "border-b border-token-border-light";
  const headerClass = clsx(
    "flex items-center justify-between gap-3 [padding-inline-start:var(--sectioned-page-leading-inset,0.5rem)] pr-0.5 pb-2",
    stickyClass,
    dividerClass,
  );
  const titleEl = (
    <div className="text-lg leading-6 font-medium text-token-foreground">
      {title}
    </div>
  );
  const actionEl = action ? <div className="shrink-0">{action}</div> : null;
  return (
    <section className="flex flex-col gap-4" id={id} ref={handleRef}>
      <div className={headerClass}>
        {titleEl}
        {actionEl}
      </div>
      {children}
    </section>
  );
}
