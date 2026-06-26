// Restored from ref/webview/assets/list-navigation-BZovQ6sO.js
// list-navigation-BZovQ6sO chunk restored from the Codex webview bundle.
import React from "react";
import { useStableCallback } from "./use-stable-callback";
export interface ListNavigationItem {
  id?: string;
  [key: string]: unknown;
}
export interface ListNavigationOptions<T extends ListNavigationItem> {
  items: T[] | null | undefined;
  isActive: boolean;
  onSelect: (item: T, index: number) => void;
  onHighlight?: (item: T | null, index: number) => void;
  onEscape?: () => void;
  autoHighlightFirst?: boolean;
  captureWindowKeydown?: boolean;
  keyboardEventTarget?: EventTarget | null;
  preserveHighlightOnItemsChange?: boolean;
}
export interface ListNavigationResult<T extends ListNavigationItem> {
  highlightedIndex: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  listRef: React.RefObject<HTMLDivElement | null>;
  handleKeyDown: (event: React.KeyboardEvent) => boolean;
  getInputProps: (
    props?: React.HTMLAttributes<HTMLInputElement>,
  ) => React.HTMLAttributes<HTMLInputElement>;
  getItemProps: (
    index: number,
    props?: React.HTMLAttributes<HTMLDivElement>,
  ) => React.HTMLAttributes<HTMLDivElement>;
}
function wrapIndex(index: number, length: number): number {
  if (length <= 0) {
    return -1;
  }
  const wrapped = index % length;
  return wrapped < 0 ? wrapped + length : wrapped;
}
export function useListNavigation<T extends ListNavigationItem>(
  options: ListNavigationOptions<T>,
): ListNavigationResult<T> {
  const {
    items,
    isActive,
    onSelect,
    onHighlight,
    onEscape,
    autoHighlightFirst = true,
    captureWindowKeydown = false,
    keyboardEventTarget,
    preserveHighlightOnItemsChange = false,
  } = options;
  const handleHighlight = useStableCallback((item: T | null, index: number) => {
    onHighlight?.(item, index);
  });
  const listRef = React.useRef<HTMLDivElement>(null);
  const previousItemsRef = React.useRef<T[] | null | undefined>(null);
  const itemCount = items == null ? 0 : items.length;
  const [highlightedIndex, setHighlightedIndex] = React.useState(() =>
    autoHighlightFirst && itemCount > 0 ? 0 : -1,
  );
  React.useEffect(() => {
    const previousItems = previousItemsRef.current;
    const itemsChanged =
      previousItems != null &&
      (items == null ||
        previousItems.length !== itemCount ||
        previousItems.some((item, index) => item !== items![index]));
    previousItemsRef.current = items;
    if (!isActive) {
      setHighlightedIndex(-1);
      return;
    }
    if (itemCount === 0) {
      setHighlightedIndex(-1);
      return;
    }
    setHighlightedIndex((prev) =>
      prev >= 0 &&
      prev < itemCount &&
      (preserveHighlightOnItemsChange || !itemsChanged)
        ? prev
        : autoHighlightFirst
          ? 0
          : -1,
    );
  }, [
    autoHighlightFirst,
    isActive,
    items,
    itemCount,
    preserveHighlightOnItemsChange,
  ]);
  React.useEffect(() => {
    if (!isActive || highlightedIndex < 0 || highlightedIndex >= itemCount) {
      handleHighlight(null, -1);
      return;
    }
    handleHighlight(items?.[highlightedIndex] ?? null, highlightedIndex);
  }, [highlightedIndex, isActive, items, itemCount, handleHighlight]);
  React.useEffect(() => {
    if (!isActive || highlightedIndex < 0 || highlightedIndex >= itemCount) {
      return;
    }
    const listElement = listRef.current;
    if (!listElement) {
      return;
    }
    listElement
      .querySelectorAll('[data-list-navigation-item="true"]')
      .item(highlightedIndex)
      ?.scrollIntoView({
        block: "nearest",
      });
  }, [highlightedIndex, isActive, itemCount]);
  const selectItem = useStableCallback((index: number) => {
    const item =
      items != null && index >= 0 && index < itemCount
        ? items[index]
        : undefined;
    if (item) {
      setHighlightedIndex(index);
      onSelect(item, index);
    }
  });
  const moveHighlight = React.useCallback(
    (delta: number) => {
      setHighlightedIndex((prev) =>
        itemCount === 0
          ? -1
          : prev < 0
            ? delta >= 0
              ? 0
              : itemCount - 1
            : wrapIndex(prev + delta, itemCount),
      );
    },
    [itemCount],
  );
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!isActive) {
        return false;
      }
      const { key } = event;
      if (itemCount === 0) {
        if (key === "Escape" && onEscape) {
          onEscape();
          preventAndStop(event);
          return true;
        }
        return false;
      }
      if (key === "ArrowDown") {
        moveHighlight(1);
        preventAndStop(event);
        return true;
      }
      if (key === "ArrowUp") {
        moveHighlight(-1);
        preventAndStop(event);
        return true;
      }
      if (key === "Enter") {
        const targetIndex =
          highlightedIndex >= 0
            ? highlightedIndex
            : autoHighlightFirst
              ? 0
              : -1;
        if (targetIndex >= 0 && targetIndex < itemCount) {
          selectItem(targetIndex);
          preventAndStop(event);
          return true;
        }
        return false;
      }
      if (key === "Escape" && onEscape) {
        onEscape();
        preventAndStop(event);
        return true;
      }
      return false;
    },
    [
      isActive,
      itemCount,
      highlightedIndex,
      autoHighlightFirst,
      onEscape,
      moveHighlight,
      selectItem,
    ],
  );
  React.useEffect(() => {
    if (!captureWindowKeydown || !isActive) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      handleKeyDown(event as unknown as React.KeyboardEvent);
    };
    const target = keyboardEventTarget ?? window;
    target.addEventListener("keydown", handler, true);
    return () => {
      target.removeEventListener("keydown", handler, true);
    };
  }, [captureWindowKeydown, handleKeyDown, isActive, keyboardEventTarget]);
  const getInputProps = React.useCallback(
    (props?: React.HTMLAttributes<HTMLInputElement>) => {
      const baseProps = props ?? {};
      return {
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
          const handled = handleKeyDown(event);
          if (!handled) {
            baseProps.onKeyDown?.(event);
          }
        },
      };
    },
    [handleKeyDown],
  );
  const getItemProps = React.useCallback(
    (
      index: number,
      props?: React.HTMLAttributes<HTMLDivElement>,
    ): React.HTMLAttributes<HTMLDivElement> => {
      const baseProps = props ?? {};
      return {
        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
          selectItem(index);
          baseProps.onClick?.(event);
        },
        onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => {
          if (isActive && index >= 0 && index < itemCount) {
            setHighlightedIndex(index);
          }
          baseProps.onMouseMove?.(event);
        },
        "data-list-navigation-item": "true",
      };
    },
    [isActive, itemCount, selectItem],
  );
  return {
    highlightedIndex,
    setHighlightedIndex,
    listRef,
    handleKeyDown,
    getInputProps,
    getItemProps,
  };
}
function preventAndStop(event: {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}) {
  if (typeof event.preventDefault === "function") {
    event.preventDefault();
  }
  if (typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }
}
