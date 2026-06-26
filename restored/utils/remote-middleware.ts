// Restored from ref/webview/assets/remote-middleware-DRFk97G2.js

import { __awaiter, __generator } from "tslib";
import { getSegmentCdn, loadScript, isServer } from "./load-script";
export interface RemoteMiddlewareLogger {
  log(level: "error" | "warn" | "info", message: unknown): void;
}
export interface RemoteMiddlewareStats {
  increment(metric: string): void;
}
export interface RemoteMiddlewareContext {
  log: RemoteMiddlewareLogger;
  stats: RemoteMiddlewareStats;
}
export interface RemoteMiddlewareOptions {
  enabledMiddleware?: Record<string, boolean>;
}
export interface RemoteMiddlewareDefinition {
  (payload: unknown): unknown;
}
function fetchRemoteMiddleware(
  ctx: RemoteMiddlewareContext,
  middlewareName: string,
  baseUrl: string,
  encodeName: boolean,
): Promise<RemoteMiddlewareDefinition | undefined> {
  return __awaiter(this, void 0, void 0, function () {
    var scriptName, scriptPath, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          scriptName = middlewareName.replace("@segment/", "");
          scriptPath = encodeName
            ? `${baseUrl}/middleware/${btoa(scriptName).replace(/=/g, "")}/latest/${scriptName}.js.gz`
            : `${baseUrl}/middleware/${scriptName}/latest/${scriptName}.js.gz`;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4, loadScript(scriptPath)];
        case 2:
          _a.sent();
          return [
            2,
            (window as Record<string, unknown>)[
              `${scriptName}Middleware`
            ] as RemoteMiddlewareDefinition,
          ];
        case 3:
          error_1 = _a.sent();
          ctx.log("error", error_1);
          ctx.stats.increment("failed_remote_middleware");
          return [3, 4];
        case 4:
          return [2, undefined];
      }
    });
  });
}
export function remoteMiddlewares(
  ctx: RemoteMiddlewareContext,
  options: RemoteMiddlewareOptions,
  encodeName: boolean,
): Promise<RemoteMiddlewareDefinition[]> {
  return __awaiter(this, void 0, void 0, function () {
    var baseUrl, enabledEntries, enabledNames, results;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (isServer()) {
            return [2, []];
          }
          baseUrl = getSegmentCdn();
          enabledEntries = Object.entries(
            options.enabledMiddleware ?? {},
          ).filter(([, enabled]) => enabled);
          enabledNames = enabledEntries.map(([name]) => name);
          return [
            4,
            Promise.all(
              enabledNames.map((name) =>
                fetchRemoteMiddleware(ctx, name, baseUrl, encodeName),
              ),
            ),
          ];
        case 1:
          results = _a.sent();
          return [
            2,
            results.filter(
              (mw): mw is RemoteMiddlewareDefinition => mw != null,
            ),
          ];
      }
    });
  });
}
