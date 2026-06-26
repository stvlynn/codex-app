// Restored from ref/webview/assets/query-string-FsVg0saL.js

import { isPlainObject } from "./type-helpers";
import { gracefulDecodeURIComponent } from "./graceful-decode-uri-component";
interface QueryStringOptions {
  useQueryString?: {
    aid?: RegExp;
    uid?: RegExp;
  };
}
interface AnalyticsApi {
  options: QueryStringOptions;
  setAnonymousId(id: string): void;
  identify(userId: string, traits?: Record<string, unknown>): Promise<unknown>;
  track(event: string, properties?: Record<string, unknown>): Promise<unknown>;
}
function extractPrefixedParams(
  prefix: string,
  params: Record<string, unknown>,
): Record<string, unknown> {
  return Object.keys(params).reduce<Record<string, unknown>>((acc, key) => {
    if (key.startsWith(prefix)) {
      const name = key.slice(prefix.length);
      acc[name] = params[key];
    }
    return acc;
  }, {});
}
export function queryString(
  analytics: AnalyticsApi,
  url: string,
): Promise<unknown[]> {
  const anchor = document.createElement("a");
  anchor.href = url;
  const params = anchor.search
    .slice(1)
    .split("&")
    .reduce<Record<string, unknown>>((acc, pair) => {
      const [rawKey, rawValue] = pair.split("=");
      const key = rawKey ?? "";
      const value = rawValue ?? "";
      acc[key] = gracefulDecodeURIComponent(value);
      return acc;
    }, {});
  const promises: Promise<unknown>[] = [];
  const anonymousId = params.ajs_aid;
  const userId = params.ajs_uid;
  const event = params.ajs_event;
  const useQueryString = isPlainObject(analytics.options.useQueryString)
    ? analytics.options.useQueryString
    : {};
  const anonymousIdPattern = useQueryString.aid ?? /.+/;
  const userIdPattern = useQueryString.uid ?? /.+/;
  if (anonymousId) {
    const raw = Array.isArray(anonymousId) ? anonymousId[0] : anonymousId;
    const value = String(raw);
    if (anonymousIdPattern.test(value)) {
      analytics.setAnonymousId(value);
    }
  }
  if (userId) {
    const raw = Array.isArray(userId) ? userId[0] : userId;
    const value = String(raw);
    if (userIdPattern.test(value)) {
      const traits = extractPrefixedParams("ajs_trait_", params);
      promises.push(analytics.identify(value, traits));
    }
  }
  if (event) {
    const raw = Array.isArray(event) ? event[0] : event;
    const eventName = String(raw);
    const properties = extractPrefixedParams("ajs_prop_", params);
    promises.push(analytics.track(eventName, properties));
  }
  return Promise.all(promises);
}
