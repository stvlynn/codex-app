// Restored from ref/webview/assets/thread-scroll-controller-context-value-7UJOrKol.js

import { createContext, use, type Context } from "react";
export interface ThreadScrollController {
  // The original bundle typed this as an opaque context value.
  // Consumers cast or narrow this as needed for their specific controller shape.
  [key: string]: unknown;
}
export const ThreadScrollControllerContext: Context<ThreadScrollController | null> =
  createContext<ThreadScrollController | null>(null);
export function useThreadScrollController(): ThreadScrollController {
  const controller = use(ThreadScrollControllerContext);
  if (controller == null) {
    throw new Error(
      "useThreadScrollController must be used within ThreadScrollLayout",
    );
  }
  return controller;
}
