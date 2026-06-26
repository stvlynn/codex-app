// Restored from ref/webview/assets/projectless-thread-BKzpAc6P.js
import { n as sendMessage } from "../boundaries/vscode-api";
import { tt as buildWorkspaceRoots } from "../boundaries/zod";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface ProjectlessThreadResult {
  cwd: string | null;
  projectlessOutputDirectory: string | null;
  workspaceRoots: string[];
  generatedWorkspace?: {
    cwd: string;
    outputDirectory: string | null;
    workspaceRoot: string;
  };
}

export interface ProjectlessThreadOptions {
  directoryName?: string;
  prompt?: string | null;
}

export interface ProjectThreadInput {
  projectId: string;
  projectWritableRoots: string[];
  legacyRoot?: string;
  prompt?: string | null;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function isProjectlessPath(paths: string[]): boolean {
  return paths.length === 0 || (paths.length === 1 && paths[0] === "~");
}

// ------------------------------------------------------------------
// Resolve projectless thread CWD
// ------------------------------------------------------------------

export async function resolveProjectlessThread(
  workspacePaths: string[],
  options: ProjectlessThreadOptions = {},
): Promise<ProjectlessThreadResult> {
  if (!isProjectlessPath(workspacePaths)) {
    return {
      cwd: workspacePaths[0] ?? null,
      projectlessOutputDirectory: null,
      workspaceRoots: workspacePaths,
    };
  }

  const { cwd, outputDirectory, workspaceRoot } = await sendMessage<{
    cwd: string;
    outputDirectory: string | null;
    workspaceRoot: string;
  }>("projectless-thread-cwd", {
    params: {
      ...(options.directoryName == null
        ? {}
        : { directoryName: options.directoryName }),
      prompt: options.prompt ?? null,
    },
  });

  return {
    cwd,
    projectlessOutputDirectory: outputDirectory,
    workspaceRoots: [workspaceRoot],
  };
}

// ------------------------------------------------------------------
// Resolve project thread with generated workspace
// ------------------------------------------------------------------

export async function resolveProjectThread({
  projectId,
  projectWritableRoots,
  legacyRoot = projectId,
  prompt,
}: ProjectThreadInput): Promise<ProjectlessThreadResult> {
  const writableRoots = buildWorkspaceRoots({
    projectId,
    projectWritableRoots,
    legacyRoot,
  });

  if (writableRoots.length === 1) {
    return {
      cwd: writableRoots[0],
      workspaceRoots: writableRoots,
    };
  }

  const generated = await sendMessage<{
    cwd: string;
    workspaceRoot: string;
  }>("projectless-thread-cwd", {
    params: {
      prompt: prompt ?? null,
    },
  });

  return {
    cwd: generated.cwd,
    workspaceRoots: [generated.workspaceRoot, ...writableRoots],
    generatedWorkspace: {
      cwd: generated.cwd,
      outputDirectory: null,
      workspaceRoot: generated.workspaceRoot,
    },
  };
}

export { isProjectlessPath };
