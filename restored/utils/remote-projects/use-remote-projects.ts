// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js
import React from "react";
import {
  o as useSetAppStore,
  t as appStoreAtom,
} from "../../boundaries/app-scope";
import {
  Br as threadContextInputKeys,
  ta as writeThreadContextInput,
} from "../../app/thread-context-inputs";
import { useGlobalState } from "../../hooks/use-global-state";
import type { RemoteProject, UseRemoteProjectsResult } from "./types";
export function setActiveRemoteProjectId(
  store: ReturnType<typeof useSetAppStore>,
  projectId: string | null | undefined,
): void {
  writeThreadContextInput(
    store,
    threadContextInputKeys.ACTIVE_REMOTE_PROJECT_ID,
    projectId ?? undefined,
  );
}
export function setRemoteProjects(
  store: ReturnType<typeof useSetAppStore>,
  projects: RemoteProject[] | undefined,
): void {
  writeThreadContextInput(
    store,
    threadContextInputKeys.REMOTE_PROJECTS,
    projects,
  );
}
export function useRemoteProjects(): UseRemoteProjectsResult {
  const store = useSetAppStore(appStoreAtom);
  const { data: remoteProjectsData, isLoading } = useGlobalState<
    RemoteProject[]
  >(threadContextInputKeys.REMOTE_PROJECTS);
  const { data: activeProjectIdData } = useGlobalState<string | null>(
    threadContextInputKeys.ACTIVE_REMOTE_PROJECT_ID,
  );
  const remoteProjects = React.useMemo(
    () => remoteProjectsData ?? [],
    [remoteProjectsData],
  );
  const selectedRemoteProject = React.useMemo(
    () =>
      remoteProjects.find((project) => project.id === activeProjectIdData) ??
      null,
    [remoteProjects, activeProjectIdData],
  );
  const activeProjectId = activeProjectIdData ?? null;
  React.useEffect(() => {
    if (
      !isLoading &&
      activeProjectId != null &&
      selectedRemoteProject == null
    ) {
      setActiveRemoteProjectId(store, undefined);
    }
  }, [isLoading, store, selectedRemoteProject, activeProjectId]);
  const selectProjectId = React.useCallback(
    (projectId: string | null) => {
      setActiveRemoteProjectId(store, projectId);
    },
    [store],
  );
  const updateRemoteProjects = React.useCallback(
    (projects: RemoteProject[]) => {
      setRemoteProjects(store, projects);
    },
    [store],
  );
  return {
    selectedRemoteProject,
    selectedRemoteProjectId: activeProjectId,
    setSelectedRemoteProjectId: selectProjectId,
    remoteProjects,
    setRemoteProjects: updateRemoteProjects,
  };
}
