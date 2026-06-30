// Restored from ref/webview/assets/local-environment-create-route-DWRBzOzJ.js

import { z } from "zod";

export const LOCAL_ENVIRONMENT_CREATE_PATH = `local-environments/create`;
export const LOCAL_ENVIRONMENT_CREATE_ROUTE = `/settings/${LOCAL_ENVIRONMENT_CREATE_PATH}`;

const searchParamsSchema = z.object({
  hostId: z.string().min(1),
  returnTo: z
    .string()
    .startsWith("/")
    .refine((val) => !val.startsWith("//")),
});

const bodyParamsSchema = z.object({
  configPath: z.string().min(1).nullable(),
  workspaceRoot: z.string().min(1),
});

export interface LocalEnvironmentCreateParams {
  hostId: string;
  returnTo: string;
  configPath: string | null;
  workspaceRoot: string;
}

export function buildLocalEnvironmentCreateUrl({
  configPath,
  workspaceRoot,
}: {
  configPath: string | null;
  workspaceRoot: string;
}): string {
  const params = new URLSearchParams({ workspaceRoot });
  if (configPath != null) {
    params.set("configPath", configPath);
  }
  return `${LOCAL_ENVIRONMENT_CREATE_ROUTE}?${params.toString()}`;
}

export function parseLocalEnvironmentCreateParams(
  searchParams: URLSearchParams,
  bodyParams: URLSearchParams,
): LocalEnvironmentCreateParams | null {
  const searchResult = searchParamsSchema.safeParse({
    hostId: searchParams.get("hostId"),
    returnTo: searchParams.get("returnTo"),
  });
  const bodyResult = bodyParamsSchema.safeParse({
    configPath: bodyParams.get("configPath"),
    workspaceRoot: bodyParams.get("workspaceRoot"),
  });

  if (!searchResult.success || !bodyResult.success) {
    return null;
  }

  return {
    ...searchResult.data,
    ...bodyResult.data,
  };
}

export {
  LOCAL_ENVIRONMENT_CREATE_PATH as path,
  LOCAL_ENVIRONMENT_CREATE_ROUTE as route,
  buildLocalEnvironmentCreateUrl as buildUrl,
  parseLocalEnvironmentCreateParams as parseParams,
};
