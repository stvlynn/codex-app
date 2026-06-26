// Restored from ref/webview/assets/preload-helper-BmHspSiq.js

const PRELOAD_REL = "modulepreload";
const preloadCache = new Map<string, boolean>();

function resolveUrl(url: string, baseUrl: string): string {
  return new URL(url, baseUrl).href;
}

interface PreloadResult {
  status: "fulfilled" | "rejected";
  value?: unknown;
  reason?: unknown;
}

function settleAll<T>(promises: Promise<T>[]): Promise<PreloadResult[]> {
  return Promise.all(
    promises.map((promise) =>
      Promise.resolve(promise).then(
        (value) => ({ status: "fulfilled", value }) as PreloadResult,
        (reason) => ({ status: "rejected", reason }) as PreloadResult,
      ),
    ),
  );
}

function dispatchPreloadError(error: unknown): void {
  const event = new Event("vite:preloadError", { cancelable: true });
  (event as Event & { payload?: unknown }).payload = error;
  if (!window.dispatchEvent(event)) {
    return;
  }
  throw error;
}

export function preload(
  importFn: () => Promise<unknown>,
  modules: string[],
  baseUrl: string,
): Promise<unknown> {
  let preloadPromise: Promise<PreloadResult[]> = Promise.resolve([]);

  if (modules.length > 0) {
    const existingLinks = document.getElementsByTagName("link");
    const nonceMeta = document.querySelector(
      "meta[property=csp-nonce]",
    ) as HTMLMetaElement | null;
    const cspNonce = nonceMeta?.nonce || nonceMeta?.getAttribute("nonce");

    const preloadRequests = modules.map((moduleUrl) => {
      const resolvedUrl = resolveUrl(moduleUrl, baseUrl);
      if (preloadCache.has(resolvedUrl)) return;
      preloadCache.set(resolvedUrl, true);

      const isCss = resolvedUrl.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";

      if (baseUrl) {
        for (let i = existingLinks.length - 1; i >= 0; i -= 1) {
          const link = existingLinks[i];
          if (
            link.href === resolvedUrl &&
            (!isCss || link.rel === "stylesheet")
          ) {
            return;
          }
        }
      } else if (
        document.querySelector(`link[href="${resolvedUrl}"]${cssSelector}`)
      ) {
        return;
      }

      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : PRELOAD_REL;
      if (!isCss) {
        link.as = "script";
      }
      link.crossOrigin = "";
      link.href = resolvedUrl;
      if (cspNonce) {
        link.setAttribute("nonce", cspNonce);
      }
      document.head.appendChild(link);

      if (isCss) {
        return new Promise<void>((resolve, reject) => {
          link.addEventListener("load", () => resolve());
          link.addEventListener("error", () =>
            reject(new Error(`Unable to preload CSS for ${resolvedUrl}`)),
          );
        });
      }
    });

    preloadPromise = settleAll(
      preloadRequests.filter((p): p is Promise<unknown> => p != null),
    );
  }

  return preloadPromise.then((results) => {
    for (const result of results ?? []) {
      if (result.status === "rejected") {
        dispatchPreloadError(result.reason);
      }
    }
    return importFn().catch(dispatchPreloadError);
  });
}
