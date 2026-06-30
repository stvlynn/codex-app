// Restored from ref/webview/assets/context-menu-BlTZjoP-.js
// context-menu-BlTZjoP- chunk restored from the Codex webview bundle.
import React from "react";
import type { ReactNode } from "react";
import { l, s } from "../boundaries/intl-messageformat";
import clsx from "clsx";
import {
  a as ContextMenuRoot,
  c as ContextMenuSubContent,
  i as ContextMenuPortal,
  l as ContextMenuSubTrigger,
  n as ContextMenuContent,
  o as ContextMenuSeparator,
  r as ContextMenuItem,
  s as ContextMenuSub,
  t as ContextMenuCheckboxItem,
  u as ContextMenuTrigger,
} from "../boundaries/dist-dvb-keg-lw";
import { windowZoomContextN } from "../../widgets/app-shell/window-zoom-context.tsx";
import { CheckMdIcon } from "../icons/check-md-icon";
import { ChevronRightIcon } from "../icons/chevron-right-icon";
import { useStableCallback } from "../utils/use-stable-callback";
import { t as Tooltip } from "../ui/ui/tooltip-b.tsx";
interface ContextMenuItemBase {
  id: string;
  type?: "separator" | "checkbox" | "normal";
  enabled?: boolean;
  icon?: string;
  checked?: boolean;
  onSelect?: () => void;
  message?: {
    id: string;
    defaultMessage: string;
  };
  messageValues?: Record<string, unknown>;
  tooltipMessage?: {
    id: string;
    defaultMessage: string;
  };
  tooltipMessageValues?: Record<string, unknown>;
  submenu?: ContextMenuItem[];
}
interface ContextMenuSeparatorItem {
  id: string;
  type: "separator";
}
interface ContextMenuCheckboxItem extends ContextMenuItemBase {
  type: "checkbox";
  checked?: boolean;
}
interface ContextMenuNormalItem extends ContextMenuItemBase {
  type?: "normal";
}
type ContextMenuItem =
  | ContextMenuSeparatorItem
  | ContextMenuCheckboxItem
  | ContextMenuNormalItem;
interface FormattedItem {
  id: string;
  type?: "separator" | "checkbox" | "normal";
  nativeLabel: string | ReactNode;
  nativeTooltip?: string | ReactNode;
  enabled?: boolean;
  icon?: string;
  checked?: boolean;
  onSelect?: () => void;
  submenu?: FormattedItem[];
}
interface NativeMenuItem {
  id: string;
  type?: "separator";
  label: string;
  icon?: string;
  enabled: boolean;
  toolTip?: string | ReactNode;
  submenu?: NativeMenuItem[];
}
function formatMenuItems(
  items: ContextMenuItem[],
  formatMessage: (
    msg: {
      id: string;
      defaultMessage: string;
    },
    values?: Record<string, unknown>,
  ) => string,
): FormattedItem[] {
  return items.map((item) => {
    if (item.type === "separator")
      return {
        ...item,
        nativeLabel: "",
        submenu: undefined,
      } as FormattedItem;
    const formattedSubmenu = item.submenu
      ? formatMenuItems(item.submenu, formatMessage)
      : undefined;
    const nativeLabel = item.message
      ? formatMessage(item.message, item.messageValues)
      : item.id;
    const nativeTooltip = item.tooltipMessage
      ? formatMessage(item.tooltipMessage, item.tooltipMessageValues)
      : undefined;
    return {
      ...item,
      nativeLabel,
      nativeTooltip,
      submenu: formattedSubmenu,
    };
  });
}
function toNativeMenuItems(items: FormattedItem[]): NativeMenuItem[] {
  return items.map((item) => ({
    id: item.id,
    type: item.type === "separator" ? "separator" : undefined,
    label:
      item.type === "separator"
        ? ""
        : item.type === "checkbox" && item.checked === true
          ? `\u2713 ${item.nativeLabel}`
          : (item.nativeLabel as string),
    icon: item.icon,
    enabled: item.enabled ?? true,
    toolTip: item.nativeTooltip,
    submenu: item.submenu ? toNativeMenuItems(item.submenu) : undefined,
  }));
}
function findItemById(
  items: FormattedItem[],
  id: string,
): FormattedItem | undefined {
  for (const item of items) {
    if (item.type !== "separator") {
      if (item.id === id) return item;
      if (item.submenu) {
        const found = findItemById(item.submenu, id);
        if (found) return found;
      }
    }
  }
}
function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
  return (
    value !== null &&
    typeof value === "object" &&
    "then" in value &&
    typeof (
      value as {
        then: unknown;
      }
    ).then === "function"
  );
}
interface ContextMenuProps {
  items?: ContextMenuItem[];
  getItems?: () => ContextMenuItem[] | Promise<ContextMenuItem[]>;
  children: React.ReactElement;
  disableNative?: boolean;
  awaitBeforeOpen?: boolean;
  onBeforeOpen?: () => void | Promise<void>;
}
export function ContextMenu({
  items = [],
  getItems,
  children,
  disableNative,
  awaitBeforeOpen: _awaitBeforeOpen = true,
  onBeforeOpen,
}: ContextMenuProps) {
  const intl = l();
  const zoom = windowZoomContextN();
  const useNative =
    !disableNative && window.electronBridge?.showContextMenu != null;
  const initialItems = formatMenuItems(items, intl.formatMessage);
  const [formattedItems, setFormattedItems] = React.useState(initialItems);
  const formatAndSet = (newItems: ContextMenuItem[]) => {
    const formatted = formatMenuItems(newItems, intl.formatMessage);
    setFormattedItems(formatted);
    return formatted;
  };
  const refreshItems = () => {
    const rawItems = getItems ? getItems() : (items ?? []);
    if (isPromiseLike(rawItems)) {
      setFormattedItems([]);
      rawItems.then(formatAndSet);
      return [];
    }
    return formatAndSet(rawItems);
  };
  const getItemsSync = () => {
    if (!_awaitBeforeOpen) {
      const result = refreshItems();
      const beforeOpenResult = onBeforeOpen?.();
      if (beforeOpenResult != null) {
        Promise.resolve(beforeOpenResult).then(refreshItems);
      }
      return result;
    }
    const beforeOpenResult = onBeforeOpen?.();
    if (beforeOpenResult != null) {
      Promise.resolve(beforeOpenResult).then(refreshItems);
    }
    return refreshItems();
  };
  const getItemsAsync = async () => {
    await onBeforeOpen?.();
    return formatAndSet(await (getItems ? getItems() : (items ?? [])));
  };
  React.useEffect(() => {
    if (!getItems) {
      setFormattedItems(formatMenuItems(items ?? [], intl.formatMessage));
    }
  }, [getItems, intl, items]);
  const handleSelect = (id: string, itemList?: FormattedItem[]) => {
    findItemById(
      itemList === undefined ? formattedItems : itemList,
      id,
    )?.onSelect?.();
  };
  const handleNativeContextMenu = async (event: React.MouseEvent) => {
    if (!useNative) return;
    event.preventDefault();
    document.dispatchEvent(new PointerEvent("pointercancel"));
    const menuItems = _awaitBeforeOpen ? await getItemsAsync() : getItemsSync();
    const selectedId = (
      await window.electronBridge?.showContextMenu?.(
        toNativeMenuItems(menuItems),
      )
    )?.id;
    if (selectedId) {
      handleSelect(selectedId, menuItems);
    }
  };
  const stableHandleNativeContextMenu = useStableCallback(
    handleNativeContextMenu,
  );
  const originalOnContextMenu = children.props.onContextMenu;
  const handleContextMenu = (event: React.MouseEvent) => {
    originalOnContextMenu?.(event);
    if (useNative) {
      stableHandleNativeContextMenu(event);
      return;
    }
    event.stopPropagation();
  };
  const stableHandleContextMenu = useStableCallback(handleContextMenu);
  const clonedChild = React.cloneElement(children, {
    onContextMenu: stableHandleContextMenu,
  });
  if (useNative) {
    return clonedChild;
  }
  const renderItem = (item: FormattedItem): ReactNode => {
    if (item.type === "separator")
      return (
        <ContextMenuSeparator
          key={item.id}
          className="mx-1 my-1 border-t border-token-border/60"
        />
      );
    if (item.type === "checkbox")
      return (
        <Tooltip
          key={item.id}
          tooltipContent={
            item.tooltipMessage ? (
              <s {...item.tooltipMessage} values={item.tooltipMessageValues} />
            ) : null
          }
        >
          <ContextMenuCheckboxItem
            checked={item.checked ?? false}
            className={clsx(
              "text-token-foreground outline-hidden rounded-lg p-1.5 text-sm cursor-interaction hover:bg-token-list-hover-background focus:bg-token-list-hover-background",
              item.enabled === false && "cursor-default opacity-50",
            )}
            disabled={item.enabled === false}
            onCheckedChange={() => {
              item.onSelect?.();
            }}
          >
            <MenuItemContent
              checked={item.checked === true}
              label={renderLabel(item)}
              showCheckbox
            />
          </ContextMenuCheckboxItem>
        </Tooltip>
      );
    if (item.submenu)
      return (
        <ContextMenuSub key={item.id}>
          <ContextMenuSubTrigger
            className="flex cursor-interaction items-center justify-between gap-1.5 rounded-lg p-1.5 text-sm text-token-foreground outline-hidden hover:bg-token-list-hover-background focus:bg-token-list-hover-background"
            disabled={item.enabled === false}
          >
            <MenuItemContent
              icon={item.icon}
              label={renderLabel(item)}
              showChevron
            />
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent
              className="z-50 m-px flex min-w-[200px] flex-col rounded-xl bg-token-dropdown-background/90 p-1 text-token-foreground shadow-lg ring-[0.5px] ring-token-border backdrop-blur-sm select-none"
              collisionPadding={6}
              style={{
                zoom: zoom === 1 ? undefined : zoom,
              }}
            >
              {item.submenu.map(renderItem)}
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
      );
    return (
      <Tooltip
        key={item.id}
        tooltipContent={
          item.tooltipMessage ? (
            <s {...item.tooltipMessage} values={item.tooltipMessageValues} />
          ) : null
        }
      >
        <ContextMenuItem
          className={clsx(
            "text-token-foreground outline-hidden rounded-lg p-1.5 text-sm cursor-interaction hover:bg-token-list-hover-background focus:bg-token-list-hover-background",
            item.enabled === false && "cursor-default opacity-50",
          )}
          onSelect={(event: Event) => {
            if (item.enabled === false) {
              event.preventDefault();
              return;
            }
            item.onSelect?.();
          }}
          aria-disabled={item.enabled === false}
        >
          <MenuItemContent icon={item.icon} label={renderLabel(item)} />
        </ContextMenuItem>
      </Tooltip>
    );
  };
  const handleOpenChange = (open: boolean) => {
    open && getItemsSync();
  };
  const content = (
    <ContextMenuContent
      className="z-50 m-px flex min-w-[180px] flex-col rounded-xl bg-token-dropdown-background/90 p-1 text-token-foreground shadow-lg ring-[0.5px] ring-token-border backdrop-blur-sm select-none"
      collisionPadding={6}
      style={{
        zoom: zoom === 1 ? undefined : zoom,
      }}
    >
      {formattedItems.map(renderItem)}
    </ContextMenuContent>
  );
  return (
    <ContextMenuRoot onOpenChange={handleOpenChange}>
      <ContextMenuTrigger asChild>{clonedChild}</ContextMenuTrigger>
      <ContextMenuPortal>{content}</ContextMenuPortal>
    </ContextMenuRoot>
  );
}
function renderLabel(item: FormattedItem): ReactNode {
  return item.message ? (
    <s {...item.message} values={item.messageValues} />
  ) : (
    item.id
  );
}
interface MenuItemContentProps {
  checked?: boolean;
  icon?: string;
  label: ReactNode;
  showCheckbox?: boolean;
  showChevron?: boolean;
}
function MenuItemContent({
  checked,
  icon,
  label,
  showCheckbox,
  showChevron,
}: MenuItemContentProps) {
  const checkbox = showCheckbox ? (
    <span className="icon-sm flex shrink-0 items-center justify-center">
      {checked ? <CheckMdIcon aria-hidden={true} className="icon-xs" /> : null}
    </span>
  ) : null;
  const iconEl = icon ? (
    <img
      alt={typeof label === "string" ? label : ""}
      src={icon}
      className="icon-sm"
    />
  ) : null;
  const labelEl = <span className="truncate">{label}</span>;
  const chevron = showChevron ? (
    <ChevronRightIcon className="icon-xs ml-auto opacity-50" />
  ) : null;
  return (
    <span className="flex w-full items-center gap-1.5">
      {checkbox}
      {iconEl}
      {labelEl}
      {chevron}
    </span>
  );
}
