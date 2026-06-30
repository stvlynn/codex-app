// Restored from ref/webview/assets/dropdown-CTBRoADH.js
export const styles = {
  content: "flex w-full items-center gap-1.5",
  contentWithIconAndSubText: "flex w-full items-center gap-3",
  icon: "shrink-0 opacity-75 group-focus:opacity-100 group-hover:opacity-100",
  itemBase:
    "text-token-foreground outline-hidden rounded-lg px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm",
  itemInteractive:
    "group hover:bg-token-list-hover-background focus:bg-token-list-hover-background cursor-interaction",
};
export const sectionStyles = {
  sectionLabel:
    "px-[var(--padding-row-x)] py-1 text-sm text-token-description-foreground",
  messageBase: "px-[var(--padding-row-x)] text-sm",
};
export const iconSizes = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon-md",
};
export function getSurfaceClass(surface: string): string | undefined {
  if (surface === "panel") return "rounded-2xl p-4 shadow-2xl backdrop-blur-lg";
}
export function getWidthClass(width: string): string | undefined {
  if (width === "icon") return "min-w-[120px]";
  if (width === "xs") return "min-w-[160px]";
  if (width === "sm") return "min-w-[180px]";
  if (width === "menuNarrow") return "w-52";
  if (width === "menu") return "min-w-[220px]";
  if (width === "menuFixed") return "w-[220px]";
  if (width === "menuBounded") return "min-w-[200px] max-w-[320px]";
  if (width === "menuWide") return "w-[240px]";
  if (width === "sidebar") return "min-w-[172px] max-w-[240px]";
  if (width === "workspace") return "min-w-[260px]";
  if (width === "panel") return "w-[280px]";
  if (width === "panelWide") return "w-[360px]";
}
export function getMaxHeightClass(maxHeight: string): string | undefined {
  if (maxHeight === "list") return "max-h-[250px]";
  if (maxHeight === "tall") return "max-h-[350px]";
}
