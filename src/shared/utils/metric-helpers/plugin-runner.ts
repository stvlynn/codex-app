// Restored from ref/webview/assets/metric-helpers-BidZZeRm.js
// metric-helpers-BidZZeRm chunk restored from the Codex webview bundle.
import {
  middlewareA as PluginEvent,
  middlewareF as PluginError,
  middlewareP as PluginCancellation,
} from "../../boundaries/segment-analytics/middleware";
export interface PluginLike {
  name: string;
  [eventType: string]:
    | ((ctx: PluginContext) => PluginContext | Promise<PluginContext>)
    | unknown;
}
export interface PluginContext {
  event: PluginEvent;
  log: (level: string, message: string, meta?: Record<string, unknown>) => void;
  stats: {
    gauge: (name: string, value: number, tags: string[]) => void;
    increment: (name: string, value?: number, tags?: string[]) => void;
  };
  cancel: (reason?: unknown) => void;
}
async function tryInvoke(
  fn: () => Promise<PluginContext>,
): Promise<PluginContext> {
  try {
    return await fn();
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function invokePlugin(
  ctx: PluginContext,
  plugin: PluginLike,
): Promise<PluginContext | Error> {
  ctx.log(`debug`, `plugin`, {
    plugin: plugin.name,
  });
  const startTime = Date.now();
  const handler = plugin[ctx.event.type] as
    | ((ctx: PluginContext) => PluginContext | Promise<PluginContext>)
    | undefined;
  if (handler === undefined) {
    return Promise.resolve(ctx);
  }
  return tryInvoke(() => Promise.resolve(handler.call(plugin, ctx)))
    .then((value) => {
      const duration = Date.now() - startTime;
      value.stats.gauge(`plugin_time`, duration, [`plugin:${plugin.name}`]);
      return value;
    })
    .catch((error: unknown) => {
      if (
        error instanceof PluginError &&
        error.type === `middleware_cancellation`
      ) {
        throw error;
      }
      if (error instanceof PluginError) {
        ctx.log(`warn`, error.type, {
          plugin: plugin.name,
          error,
        });
        return error;
      }
      ctx.log(`error`, `plugin Error`, {
        plugin: plugin.name,
        error,
      });
      ctx.stats.increment(`plugin_error`, 1, [`plugin:${plugin.name}`]);
      return error as Error;
    });
}
export async function dispatchPlugin(
  ctx: PluginContext,
  plugin: PluginLike,
): Promise<PluginCancellation | undefined> {
  const result = await invokePlugin(ctx, plugin);
  if (result instanceof PluginCancellation) {
    return result;
  }
  ctx.log(`debug`, `Context canceled`);
  ctx.stats.increment(`context_canceled`);
  ctx.cancel(result);
}
