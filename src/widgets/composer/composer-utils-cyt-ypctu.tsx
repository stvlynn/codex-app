// Restored from ref/webview/assets/composer-utils-CytYpctu.js
// composer-utils-CytYpctu chunk restored from the Codex webview bundle.
import { h, n } from "../boundaries/vscode-api";

export const COMPOSER_CLOSED_AGENT_SEND_FAILED = `closed_agent_send_failed`;

export function appendTextTrimmed(
  existingText: string,
  newText: string,
): string {
  const trimmed = newText.trim();
  if (trimmed.length === 0) return existingText;
  if (existingText.length === 0 || /\s$/.test(existingText)) {
    return `${existingText}${trimmed}`;
  }
  return `${existingText} ${trimmed}`;
}

export async function fetchIdeContext(
  workspaceRoot: string | null | undefined,
  shouldFetch: boolean,
  workspaceRootPath: string | null | undefined,
): Promise<Record<string, unknown> | null> {
  if (!shouldFetch) return null;
  try {
    const response = (await n(`ide-context`, {
      params: workspaceRoot
        ? {
            workspaceRoot: workspaceRootPath,
          }
        : undefined,
    })) as { ideContext: Record<string, unknown> };
    return response.ideContext;
  } catch (error) {
    h.error(`[Composer] failed to fetch ide-context`, {
      safe: {},
      sensitive: {
        error,
      },
    });
    return null;
  }
}
