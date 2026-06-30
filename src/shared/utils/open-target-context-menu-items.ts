// Restored from ref/webview/assets/open-target-context-menu-items-ClwD6vw2.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/open-target-context-menu-items-ClwD6vw2.js
 *   Chunk: open-target-context-menu-items-ClwD6vw2
 *   Classification: single-util
 *   Domain: utils
 *   Semantic path: utils/open-target-context-menu-items.ts
 */

export interface TargetInfo {
  id: string;
  label: string;
  icon?: React.ReactNode;
  target: string;
  appPath?: string;
}

export interface OpenTargetMessages {
  openInTarget: string;
  openIn: string;
  openInTargetSubmenu: string;
}

export interface ContextMenuItem {
  id: string;
  message: string;
  messageValues?: Record<string, string>;
  icon?: React.ReactNode;
  onSelect: () => void;
  submenu?: ContextMenuItem[];
}

export interface OpenTargetContextMenuOptions {
  idPrefix: string;
  messages: OpenTargetMessages;
  onOpenInTarget: (target: string, appPath?: string) => void;
  primaryTarget: TargetInfo | null;
  visibleTargets: TargetInfo[];
}

/**
 * Builds context menu items for opening a resource in a target application.
 * Returns an empty array if no primary target is provided.
 */
export function buildOpenTargetContextMenuItems({
  idPrefix,
  messages,
  onOpenInTarget,
  primaryTarget,
  visibleTargets,
}: OpenTargetContextMenuOptions): ContextMenuItem[] {
  if (primaryTarget == null) {
    return [];
  }

  return [
    {
      id: `${idPrefix}-primary`,
      message: messages.openInTarget,
      messageValues: {
        target: primaryTarget.label,
      },
      icon: primaryTarget.icon,
      onSelect: () =>
        onOpenInTarget(primaryTarget.target, primaryTarget.appPath),
    },
    {
      id: `${idPrefix}-targets`,
      message: messages.openIn,
      submenu: visibleTargets.map((target) => ({
        id: `${idPrefix}-target-${target.id}`,
        message: messages.openInTargetSubmenu,
        messageValues: {
          target: target.label,
        },
        icon: target.icon,
        onSelect: () => onOpenInTarget(target.target, target.appPath),
      })),
    },
  ];
}
