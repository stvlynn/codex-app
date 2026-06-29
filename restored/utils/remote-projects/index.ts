// Restored from ref/webview/assets/remote-projects-Beixx8Gf.js
export type {
  GitOrigin,
  GitOriginsParams,
  GitOriginsResult,
  RemoteHost,
  RemoteProject,
  RemoteProjectGroup,
  RemoteProjectItem,
  UseRemoteProjectsResult,
} from "./types";
export { gitOriginsQueryAtom, findCachedGitOriginsData } from "./git-origins";
export {
  findMatchingRemoteProjectPath,
  findRemoteProjectByHostAndPath,
} from "./project-matching";
export { remoteProjectsByHostAtom } from "./remote-projects-by-host";
export {
  useRemoteProjects,
  setActiveRemoteProjectId,
  setRemoteProjects,
} from "./use-remote-projects";
