// Restored from ref/webview/assets/get-project-name-C44mbjEu.js
// GetProjectName chunk restored from the Codex webview bundle.

const MAX_PROJECT_NAME_WORDS = 3;

/**
 * Derives a concise project name from a file path or an explicit name.
 * Falls back to the last segment of the path if no explicit name is provided.
 * Limits the result to a maximum number of words.
 */
export function getProjectName(
  filePath: string | undefined,
  explicitName: string | undefined,
): string | null {
  if (explicitName && explicitName.trim().length > 0) {
    return truncateProjectName(explicitName);
  }
  if (!filePath) {
    return null;
  }
  const trimmedPath = filePath.trim();
  if (!trimmedPath) {
    return null;
  }
  const pathSegments = trimmedPath.split(/[/\\]+/).filter(Boolean);
  const projectName = pathSegments[pathSegments.length - 1] ?? trimmedPath;
  return truncateProjectName(projectName);
}

function truncateProjectName(name: string): string {
  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/).filter(Boolean);
  return words.length <= MAX_PROJECT_NAME_WORDS
    ? trimmedName
    : words.slice(0, MAX_PROJECT_NAME_WORDS).join(" ");
}
