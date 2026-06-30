// Restored from ref/webview/assets/request-DmzCscWA.js
import {
  c as ApiError,
  h as log,
  l as getApiClient,
} from "../boundaries/vscode-api";
import {
  bn as attachAuthHeader,
  cn as attachIntegrityHeader,
  xn as headerCheck,
} from "../boundaries/zod";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type HttpMethod = "get" | "post" | "patch" | "delete";

export interface RequestParameters {
  parameters?: {
    query?: Record<string, unknown>;
    path?: Record<string, string | number>;
  };
  additionalHeaders?: Record<string, string>;
  requestBody?: unknown;
}

export interface RequestTarget {
  headers: Record<string, string>;
  url: string;
}

export interface StreamOptions {
  body?: unknown;
  format?: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  onEvent?: (event: unknown) => void;
}

export interface RequestDefaults {
  getAdditionalHeaders?(): Record<string, string>;
}

// ------------------------------------------------------------------
// Locale helper
// ------------------------------------------------------------------

let currentLocale = "en";

export function setRequestLocale(locale: string): void {
  currentLocale = locale;
}

function getRequestLocale(): string {
  return currentLocale;
}

// ------------------------------------------------------------------
// URL template expansion
// ------------------------------------------------------------------

function expandUrlTemplate(
  template: string,
  pathParams: Record<string, string | number>,
): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key) =>
    String(pathParams[key]),
  );
}

function buildQueryString(queryParams?: Record<string, unknown>): string {
  if (!queryParams) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, serializeQueryValue(item));
      }
    } else if (value != null) {
      params.append(key, serializeQueryValue(value));
    }
  }
  const query = params.toString();
  return query.length === 0 ? "" : `?${query}`;
}

function serializeQueryValue(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }
  return JSON.stringify(value) ?? "";
}

// ------------------------------------------------------------------
// Default headers
// ------------------------------------------------------------------

function buildDefaultHeaders(): Record<string, string> {
  return {
    "OAI-Language": getRequestLocale(),
    ...buildSecurityHeaders(),
  };
}

function buildSecurityHeaders(): Record<string, string> {
  return {
    [attachAuthHeader]: "1",
    [attachIntegrityHeader]: "1",
    originator: "Codex Desktop",
  };
}

export { buildSecurityHeaders };

// ------------------------------------------------------------------
// Request client
// ------------------------------------------------------------------

class ApiRequestClient {
  constructor(private readonly defaults: RequestDefaults = {}) {}

  private getRequestTarget(
    routePattern: string,
    params?: RequestParameters,
  ): RequestTarget {
    const queryParams =
      params?.parameters && "query" in params.parameters
        ? params.parameters.query
        : undefined;
    const pathParams =
      params?.parameters &&
      "path" in params.parameters &&
      params.parameters.path
        ? params.parameters.path
        : {};

    const url = `${expandUrlTemplate(routePattern, pathParams)}${buildQueryString(queryParams)}`;
    const headers = {
      ...this.defaults.getAdditionalHeaders?.(),
      ...params?.additionalHeaders,
    };

    return { headers, url };
  }

  private getRequestBody(params?: RequestParameters): string | undefined {
    return params && "requestBody" in params
      ? JSON.stringify(params.requestBody)
      : undefined;
  }

  async makeRequest<T>(
    method: HttpMethod,
    routePattern: string,
    params?: RequestParameters,
  ): Promise<T> {
    const { headers, url } = this.getRequestTarget(routePattern, params);
    const client = getApiClient().getInstance();

    try {
      switch (method) {
        case "get": {
          const getResponse = await client.get(url, headers);
          return getResponse.body as T;
        }
        case "post": {
          const body = this.getRequestBody(params);
          const postResponse = await client.post(url, body, headers);
          return postResponse.body as T;
        }
        case "patch": {
          const patchBody = this.getRequestBody(params);
          const patchResponse = await client.sendRequest("PATCH", url, {
            body: patchBody,
            headers,
          });
          return patchResponse.body as T;
        }
        case "delete": {
          const deleteResponse = await client.sendRequest("DELETE", url, {
            headers,
          });
          return (
            deleteResponse.status === 204 ? undefined : deleteResponse.body
          ) as T;
        }
      }
    } catch (error) {
      throw log.warning("sa_server_request_failed", {
        safe: {
          attachAuth: attachAuthHeader in headers,
          attachIntegrityState: attachIntegrityHeader in headers,
          errorCode: error instanceof ApiError ? error.errorCode : null,
          hasRequestBody: params != null && "requestBody" in params,
          method,
          requestHeaderNames: Object.keys(headers).sort(),
          status: error instanceof ApiError ? error.status : null,
        },
        sensitive: {
          error,
          routePattern,
          url,
        },
      });
    }
  }

  async safeGet<T>(
    routePattern: string,
    params?: RequestParameters,
  ): Promise<T> {
    return this.makeRequest<T>("get", routePattern, params);
  }

  async safePost<T>(
    routePattern: string,
    params?: RequestParameters,
  ): Promise<T> {
    return this.makeRequest<T>("post", routePattern, params);
  }

  async safePatch<T>(
    routePattern: string,
    params?: RequestParameters,
  ): Promise<T> {
    return this.makeRequest<T>("patch", routePattern, params);
  }

  async safeDelete<T>(
    routePattern: string,
    params?: RequestParameters,
  ): Promise<T> {
    return this.makeRequest<T>("delete", routePattern, params);
  }

  streamPost(
    routePattern: string,
    options: StreamOptions & { headers?: Record<string, string>; url?: string },
  ): unknown {
    const { headers, url } = this.getRequestTarget(routePattern, {
      additionalHeaders: options.headers,
    });
    const client = getApiClient().getInstance();
    return client.stream("POST", url, {
      body: options.body,
      format: options.format,
      headers,
      onComplete: options.onComplete,
      onError: options.onError,
      onEvent: options.onEvent,
    });
  }

  cancelStream(streamId: string): void {
    getApiClient().getInstance().cancelStream(streamId);
  }
}

// ------------------------------------------------------------------
// Singleton export
// ------------------------------------------------------------------

export const apiClient = new ApiRequestClient({
  getAdditionalHeaders: buildDefaultHeaders,
});
