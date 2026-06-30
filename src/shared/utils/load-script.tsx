// Restored from ref/webview/assets/load-script-CELRAn-0.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/load-script-CELRAn-0.js
 *   Chunk: load-script-CELRAn-0
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/load-script.tsx
 */

// --- Environment detection ---

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return !isBrowser();
}

// --- Analytics / Segment integration helpers ---

let analyticsGlobalKey = "analytics";

function getAnalyticsGlobal(): Record<string, unknown> | undefined {
  return (window as Record<string, unknown>)[analyticsGlobalKey] as
    | Record<string, unknown>
    | undefined;
}

export function setAnalyticsGlobalKey(key: string): void {
  analyticsGlobalKey = key;
}

export function setAnalyticsGlobal(value: Record<string, unknown>): void {
  (window as Record<string, unknown>)[analyticsGlobalKey] = value;
}

const SEGMENT_SCRIPT_PATTERN =
  /(https:\/\/.*)\/analytics\.js\/v1\/(?:.*?)\/(?:platform|analytics.*)?/;

function findSegmentCdnFromScripts(): string | undefined {
  let cdn: string | undefined;
  Array.prototype.slice
    .call(document.querySelectorAll("script"))
    .forEach((script: HTMLScriptElement) => {
      const src = script.getAttribute("src") ?? "";
      const match = SEGMENT_SCRIPT_PATTERN.exec(src);
      if (match?.[1]) {
        cdn = match[1];
      }
    });
  return cdn;
}

let overrideCdn: string | undefined;

function getCdnFromAnalytics(): string | undefined {
  return overrideCdn ?? (getAnalyticsGlobal()?._cdn as string | undefined);
}

export function setCdnOverride(cdn: string): void {
  const analytics = getAnalyticsGlobal();
  if (analytics) {
    analytics._cdn = cdn;
  }
  overrideCdn = cdn;
}

function getSegmentCdn(): string {
  return (
    getCdnFromAnalytics() ||
    findSegmentCdnFromScripts() ||
    "https://cdn.segment.com"
  );
}

export function getSegmentIntegrationsUrl(): string {
  return `${getSegmentCdn()}/next-integrations`;
}

// --- Script loading ---

function findScriptBySrc(src: string): HTMLScriptElement | undefined {
  return Array.prototype.slice
    .call(window.document.querySelectorAll("script"))
    .find((script: HTMLScriptElement) => script.src === src);
}

export function loadScript(
  src: string,
  attributes?: Record<string, string>,
): Promise<HTMLScriptElement> {
  const existing = findScriptBySrc(src);
  if (existing !== undefined) {
    const status = existing.getAttribute("status");
    if (status === "loaded") {
      return Promise.resolve(existing);
    }
    if (status === "loading") {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", () => resolve(existing));
        existing.addEventListener("error", (err) => reject(err));
      });
    }
  }

  return new Promise((resolve, reject) => {
    const script = window.document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    script.setAttribute("status", "loading");

    for (const [key, value] of Object.entries(attributes ?? {})) {
      script.setAttribute(key, value);
    }

    script.onload = () => {
      script.onerror = script.onload = null;
      script.setAttribute("status", "loaded");
      resolve(script);
    };

    script.onerror = () => {
      script.onerror = script.onload = null;
      script.setAttribute("status", "error");
      reject(new Error(`Failed to load ${src}`));
    };

    const firstScript = window.document.querySelector("script");
    if (firstScript) {
      firstScript.parentElement?.insertBefore(script, firstScript);
    } else {
      window.document.head.appendChild(script);
    }
  });
}

export function removeScript(src: string): Promise<void> {
  const script = findScriptBySrc(src);
  if (script !== undefined) {
    script.remove();
  }
  return Promise.resolve();
}

export { isBrowser, getAnalyticsGlobal, getSegmentCdn, loadScript as default };
