// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js
import {
  l as createDerivedAtom,
  t as appStoreAtom,
} from "../../boundaries/app-scope";
import { t as getHostConfig } from "../../boundaries/host-config";
import {
  c as remoteProjectsAtom,
  s as remoteHostsAtom,
} from "../../../app/thread-context-inputs";
import { gitOriginsQueryAtom } from "./git-origins";
import { findMatchingRemoteProjectPath } from "./project-matching";
import type {
  RemoteProject,
  RemoteProjectGroup,
  RemoteProjectItem,
  RemoteProjectsByHostParams,
} from "./types";
export const remoteProjectsByHostAtom = createDerivedAtom(
  appStoreAtom,
  (
    {
      sourceHostId,
      sourceGitRoot,
      sourceWorkspaceRoot,
    }: RemoteProjectsByHostParams,
    { get },
  ) => {
    if (
      sourceHostId !== "local" ||
      sourceGitRoot == null ||
      sourceWorkspaceRoot == null
    ) {
      return [];
    }
    const hosts = get(remoteHostsAtom);
    const sourceGitOriginsQuery = get(gitOriginsQueryAtom, {
      params: {
        hostId: sourceHostId,
        dirs: [sourceWorkspaceRoot],
      },
      source: "local_remote_dropdown",
    });
    const projectsByHost = new Map<string, RemoteProjectGroup>();
    for (const project of get(remoteProjectsAtom)) {
      if (hosts.find((host) => host.hostId === project.hostId) == null) {
        continue;
      }
      const existingGroup = projectsByHost.get(project.hostId);
      if (existingGroup != null) {
        existingGroup.projects.push(project);
        continue;
      }
      projectsByHost.set(project.hostId, {
        hostId: project.hostId,
        hostDisplayName: getHostConfig(project.hostId, hosts).display_name,
        projects: [project],
      });
    }
    const result: RemoteProjectItem[] = [];
    for (const {
      hostDisplayName,
      hostId,
      projects,
    } of projectsByHost.values()) {
      const destinationGitOriginsQuery = get(gitOriginsQueryAtom, {
        params: {
          hostId,
          dirs: projects.map((project) => project.remotePath),
        },
        source: "local_remote_dropdown",
      });
      if (
        sourceGitOriginsQuery?.isPending ||
        destinationGitOriginsQuery?.isPending
      ) {
        result.push({
          status: "loading",
          hostDisplayName,
          hostId,
        });
        continue;
      }
      if (
        sourceGitOriginsQuery?.isError ||
        destinationGitOriginsQuery?.isError
      ) {
        result.push({
          status: "error",
          hostDisplayName,
          hostId,
        });
        continue;
      }
      const matchingPath = findMatchingRemoteProjectPath({
        sourceWorkspaceRoot,
        sourceGitRoot,
        sourceGitOrigins: sourceGitOriginsQuery?.data?.origins,
        destinationWorkspaceRoots: projects.map(
          (project) => project.remotePath,
        ),
        destinationGitOrigins: destinationGitOriginsQuery?.data?.origins,
      });
      const matchingProject = projects.find(
        ({ remotePath }) => remotePath === matchingPath,
      );
      if (matchingProject != null) {
        result.push({
          status: "ready",
          hostDisplayName,
          hostId,
          project: matchingProject,
        });
      }
    }
    return result;
  },
);
