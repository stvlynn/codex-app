// Restored from ref/webview/assets/automation-shared-g-EMxEEn.js
// Automation shared directive mode resolution.

/**
 * Determine the panel mode from directive and permission flags.
 */
export function resolveDirectiveMode({
  directiveMode,
  canCreate,
  canUpdate,
  isViewMode,
  forceOpen = false,
}: {
  directiveMode: "view" | "edit" | "create";
  canCreate: boolean;
  canUpdate: boolean;
  isViewMode: boolean;
  forceOpen?: boolean;
}): "open" | "create" | "update" | null {
  if (forceOpen) return "open";
  if (directiveMode === "view") {
    return isViewMode ? "open" : null;
  }
  if (canUpdate) return "update";
  if (canCreate) return "create";
  if (isViewMode) return "open";
  return null;
}
