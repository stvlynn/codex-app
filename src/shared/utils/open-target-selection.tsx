// Restored from ref/webview/assets/open-target-selection-D_PPYsC7.js
// Open-target selection utilities restored from the Codex webview bundle.

export interface OpenTarget {
  target: string;
  appPath?: string | null;
  kind?: string;
  hidden?: boolean;
}

export interface FilterTargetsOptions {
  targets: OpenTarget[];
  availableTargets: string[];
  includeHiddenTargets?: boolean;
  mode?: "editor" | "native";
}

export interface ResolveTargetOptions {
  preferredTarget?: string | null;
  targets: OpenTarget[];
  availableTargets: string[];
  includeHiddenTargets?: boolean;
  mode?: "editor" | "native";
}

function filterTargets({
  targets,
  availableTargets,
  includeHiddenTargets = false,
  mode = "editor",
}: FilterTargetsOptions): OpenTarget[] {
  const withAppPath = targets.filter((t) => t.appPath != null);
  if (withAppPath.length > 0) return withAppPath;

  if (mode === "native") {
    return targets.filter(
      (t) => t.target === "systemDefault" || t.target === "fileManager",
    );
  }

  const availableSet = new Set(availableTargets);
  return targets.filter(
    (t) => availableSet.has(t.target) && (includeHiddenTargets || !t.hidden),
  );
}

export function resolveTarget({
  preferredTarget,
  targets,
  availableTargets,
  includeHiddenTargets = true,
  mode = "editor",
}: ResolveTargetOptions): OpenTarget | null {
  const eligible = filterTargets({
    targets,
    availableTargets,
    includeHiddenTargets,
    mode,
  });
  if (eligible.length === 0) return null;
  if (preferredTarget) {
    return (
      eligible.find((t) => t.target === preferredTarget) ?? eligible[0] ?? null
    );
  }
  return eligible[0] ?? null;
}

export function isEditorTarget(target: OpenTarget): boolean {
  return target.appPath == null && target.kind === "editor";
}

export { filterTargets };
