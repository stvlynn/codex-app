// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js

export interface GitOriginsParams {
  dirs?: string[];
  hostId?: string;
}
export interface GitOrigin {
  dir: string;
  originUrl: string;
  root?: string;
}
export interface GitOriginsResult {
  origins: GitOrigin[];
}
export interface RemoteProject {
  hostId: string;
  remotePath: string;
  id?: string;
}
export interface RemoteHost {
  hostId: string;
  display_name: string;
}
export interface RemoteProjectGroup {
  hostId: string;
  hostDisplayName: string;
  projects: RemoteProject[];
}
export interface ReadyRemoteProjectItem {
  status: "ready";
  hostDisplayName: string;
  hostId: string;
  project: RemoteProject;
}
export interface LoadingRemoteProjectItem {
  status: "loading";
  hostDisplayName: string;
  hostId: string;
}
export interface ErrorRemoteProjectItem {
  status: "error";
  hostDisplayName: string;
  hostId: string;
}
export type RemoteProjectItem =
  | ReadyRemoteProjectItem
  | LoadingRemoteProjectItem
  | ErrorRemoteProjectItem;
export interface UseRemoteProjectsResult {
  selectedRemoteProject: RemoteProject | null;
  selectedRemoteProjectId: string | null;
  setSelectedRemoteProjectId: (projectId: string | null) => void;
  remoteProjects: RemoteProject[];
  setRemoteProjects: (projects: RemoteProject[]) => void;
}
export interface OriginMatchParams {
  sourceWorkspaceRoot: string;
  sourceGitRoot: string;
  sourceGitOriginUrl: string | null;
  destinationWorkspaceRoot: string;
  destinationGitRoot: string | null;
  destinationGitOriginUrl: string | null;
}
export interface FindMatchingRemoteProjectPathParams {
  sourceWorkspaceRoot: string;
  sourceGitRoot: string;
  sourceGitOrigins: GitOrigin[] | undefined;
  destinationWorkspaceRoots: string[];
  destinationGitOrigins: GitOrigin[] | undefined;
}
export interface RemoteProjectsByHostParams {
  sourceHostId: string;
  sourceGitRoot: string | null;
  sourceWorkspaceRoot: string | null;
}
