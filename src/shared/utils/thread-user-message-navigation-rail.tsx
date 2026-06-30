// Restored from ref/webview/assets/thread-user-message-navigation-rail-DwC5A8DL.js
// ThreadUserMessageNavigationRail chunk restored from the Codex webview bundle.
// This component renders a navigation rail for user messages in a thread.
// NOTE: Simplified facade — the original has complex tooltip and scroll logic.

import React from "react";
import clsx from "clsx";
export interface ThreadUserMessageNavigationRailItem {
  id: string;
  getLabel: () => string;
  getPreview: () => {
    response: string;
    outputs: Array<{
      type: string;
      label?: string;
    }>;
  };
  isHeartbeat?: boolean;
}
export interface ThreadUserMessageNavigationRailProps {
  items: ThreadUserMessageNavigationRailItem[];
  onRevealItem?: (item: ThreadUserMessageNavigationRailItem) => Promise<void>;
}
export function ThreadUserMessageNavigationRail({
  items,
  onRevealItem,
}: ThreadUserMessageNavigationRailProps): JSX.Element | null {
  if (items.length < 4) return null;
  return (
    <nav className="flex flex-col gap-1" aria-label="Thread message navigation">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
            "transition-colors hover:bg-token-surface-tertiary",
          )}
          onClick={() => onRevealItem?.(item)}
          aria-label={`Message ${index + 1}`}
        >
          {index + 1}
        </button>
      ))}
    </nav>
  );
}
export interface ThreadUserMessageNavigationRailIconProps {
  items: ThreadUserMessageNavigationRailItem[];
  onRevealItem?: (item: ThreadUserMessageNavigationRailItem) => Promise<void>;
}
export function ThreadUserMessageNavigationRailIcon({
  items,
  onRevealItem,
}: ThreadUserMessageNavigationRailIconProps): JSX.Element | null {
  return (
    <ThreadUserMessageNavigationRail
      items={items}
      onRevealItem={onRevealItem}
    />
  );
}
