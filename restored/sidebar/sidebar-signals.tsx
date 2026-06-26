// Restored from ref/webview/assets/sidebar-signals-CPMTa_tq.js
// sidebar-signals-CPMTa_tq chunk restored from the Codex webview bundle.
import {
  C as atomSelector,
  G as atom,
  L as atomSelectorFamily,
  T as rootStore,
} from "../boundaries/tanstack-query.ts";
import { J as persistedSignal } from "../utils/persisted-signal.tsx";
const SORT_KEY_UPDATED_AT = "updated_at";
const DEFAULT_ORGANIZE_MODE = "project";
const DEFAULT_SIDEBAR_MODE = "codex";
const EMPTY_COLLAPSED_GROUPS: Record<string, boolean> = {};
const DEFAULT_COLLAPSED_SECTIONS = {
  chats: false,
  cloud: false,
  pinned: false,
  threads: false,
};
const organizeModeSignal = persistedSignal(
  "sidebar-organize-mode-v1",
  DEFAULT_ORGANIZE_MODE,
);
const keepProjectsInRecentSignal = persistedSignal(
  "sidebar-keep-projects-in-recent-v1",
  true,
);
const projectlessChatsFirstSignal = persistedSignal(
  "projectless-sidebar-chats-first-v1",
  false,
);
const sidebarModeSignal = persistedSignal(
  "electron-sidebar-mode-v1",
  DEFAULT_SIDEBAR_MODE,
);
const threadSortKeySignal = persistedSignal(
  "thread-sort-key",
  SORT_KEY_UPDATED_AT,
);
const collapsedGroupsSignal = persistedSignal(
  "sidebar-collapsed-groups",
  EMPTY_COLLAPSED_GROUPS,
);
const collapsedSectionsSignal = persistedSignal(
  "sidebar-collapsed-sections-v1",
  DEFAULT_COLLAPSED_SECTIONS,
);
export const collapsedGroupsSelector = atomSelector(
  rootStore,
  ({ get }) => get(collapsedGroupsSignal) ?? EMPTY_COLLAPSED_GROUPS,
);
export const collapsedSectionsSelector = atomSelector(rootStore, ({ get }) => {
  const saved = get(collapsedSectionsSignal);
  return saved == null
    ? DEFAULT_COLLAPSED_SECTIONS
    : {
        ...DEFAULT_COLLAPSED_SECTIONS,
        ...saved,
      };
});
export const sidebarOrganizeModeAtom = atom(rootStore, []);
export const activeThreadKeyAtom = atom(rootStore, null);
export const activeThreadLocationAtom = atom(rootStore, null);
export const expandedItemIdsAtom = atom(rootStore, {});
export const isGroupCollapsedSelector = atomSelectorFamily(
  rootStore,
  (groupId: string, { get }) => get(collapsedGroupsSelector)[groupId] === true,
);
export const sidebarOrganizeMode = atomSelector(
  rootStore,
  ({ get }) => get(organizeModeSignal) ?? DEFAULT_ORGANIZE_MODE,
);
export const isThreadActiveSelector = atomSelectorFamily(
  rootStore,
  (
    {
      locationId,
      threadKey,
    }: {
      locationId: string;
      threadKey: string;
    },
    { get },
  ) => {
    if (get(activeThreadKeyAtom) !== threadKey) return false;
    const activeLocation = get(activeThreadLocationAtom);
    return (
      activeLocation == null ||
      locationId == null ||
      activeLocation === locationId
    );
  },
);
export const sidebarVersionAtom = atom(rootStore, 0);
export const projectlessChatsFirst = atomSelector(
  rootStore,
  ({ get }) => get(projectlessChatsFirstSignal) ?? false,
);
export const keepProjectsInRecent = atomSelector(
  rootStore,
  ({ get }) => get(keepProjectsInRecentSignal) ?? true,
);
export const sidebarMode = atomSelector(
  rootStore,
  ({ get }) => get(sidebarModeSignal) ?? DEFAULT_SIDEBAR_MODE,
);
export const isItemExpandedSelector = atomSelectorFamily(
  rootStore,
  (itemId: string, { get }) => get(expandedItemIdsAtom)[itemId] === true,
);
export const isSectionCollapsedSelector = atomSelectorFamily(
  rootStore,
  (sectionId: string, { get }) => get(collapsedSectionsSelector)[sectionId],
);
export const threadSortKey = atomSelector(
  rootStore,
  ({ get }) => get(threadSortKeySignal) ?? SORT_KEY_UPDATED_AT,
);
export const isThreadKeyActiveSelector = atomSelectorFamily(
  rootStore,
  (threadKey: string, { get }) => get(activeThreadKeyAtom) === threadKey,
);
export function setOrganizeMode(
  store: {
    set: (typeof organizeModeSignal)["write"];
  },
  mode: string,
): void {
  store.set(organizeModeSignal, mode);
}
export function setKeepProjectsInRecent(
  store: {
    set: (typeof keepProjectsInRecentSignal)["write"];
  },
  value: boolean,
): void {
  store.set(keepProjectsInRecentSignal, value);
}
export function setProjectlessChatsFirst(
  store: {
    set: (typeof projectlessChatsFirstSignal)["write"];
  },
  value: boolean,
): void {
  store.set(projectlessChatsFirstSignal, value);
}
export function setThreadSortKey(
  store: {
    set: (typeof threadSortKeySignal)["write"];
  },
  key: string,
): void {
  store.set(threadSortKeySignal, key);
}
export function setActiveThread(
  store: {
    get: (typeof activeThreadKeyAtom)["read"];
    set: (typeof activeThreadKeyAtom)["write"];
  },
  threadKey: string,
  locationId: string | null = null,
): void {
  if (
    store.get(activeThreadKeyAtom) === threadKey &&
    store.get(activeThreadLocationAtom) === locationId
  ) {
    return;
  }
  store.set(activeThreadKeyAtom, threadKey);
  store.set(activeThreadLocationAtom, locationId);
}
export function setSectionCollapsed(
  store: {
    set: (typeof collapsedSectionsSignal)["write"];
    get: (typeof collapsedSectionsSignal)["read"];
  },
  sectionId: string,
  collapsed: boolean,
): void {
  store.set(collapsedSectionsSignal, {
    ...store.get(collapsedSectionsSignal),
    [sectionId]: collapsed,
  });
}
export function setCollapsedGroups(
  store: {
    set: (typeof collapsedGroupsSignal)["write"];
  },
  groups: Record<string, boolean>,
  version: number,
): void {
  store.set(collapsedGroupsSignal, groups);
  store.set(sidebarVersionAtom, version);
}
function resetCollapsedGroups(
  store: {
    set: (typeof collapsedGroupsSignal)["write"];
  },
  groups: Record<string, boolean>,
): void {
  store.set(collapsedGroupsSignal, groups);
  store.set(sidebarVersionAtom, []);
}
export function toggleGroupCollapsed(
  store: {
    get: (typeof collapsedGroupsSignal)["read"];
    set: (typeof collapsedGroupsSignal)["write"];
  },
  groupId: string,
): void {
  const current = store.get(collapsedGroupsSelector);
  const next = {
    ...current,
  };
  if (current[groupId] === true) {
    delete next[groupId];
  } else {
    next[groupId] = true;
  }
  resetCollapsedGroups(store, next);
}
export function mergeCollapsedGroupsWithImports({
  collapsedGroups,
  importedProjectRoots,
}: {
  collapsedGroups: Record<string, boolean>;
  importedProjectRoots: string[];
}): Record<string, boolean> {
  if (importedProjectRoots.length === 0) return collapsedGroups;
  const next = {
    ...collapsedGroups,
  };
  const [first, ...rest] = importedProjectRoots;
  delete next[first];
  for (const root of rest) {
    next[root] = true;
  }
  return next;
}
export function setItemExpanded(
  store: {
    get: (typeof expandedItemIdsAtom)["read"];
    set: (typeof expandedItemIdsAtom)["write"];
  },
  itemId: string,
  expanded: boolean,
): void {
  const current = store.get(expandedItemIdsAtom);
  if (expanded === !!current[itemId]) return;
  if (expanded) {
    store.set(expandedItemIdsAtom, {
      ...current,
      [itemId]: true,
    });
    return;
  }
  const next = {
    ...current,
  };
  delete next[itemId];
  store.set(expandedItemIdsAtom, next);
}
export {
  SORT_KEY_UPDATED_AT as threadSortKeyUpdatedAt,
  sidebarOrganizeModeAtom,
  expandedItemIdsAtom,
  activeThreadLocationAtom,
  resetCollapsedGroups,
  activeThreadKeyAtom,
  collapsedGroupsSelector,
};
