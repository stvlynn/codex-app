// Restored from ref/webview/assets/plugin-prefill-prompt-Ba9YzNzQ.js
// PluginPrefillPrompt chunk restored from the Codex webview bundle.
import { buildPluginUrl } from "../../../widgets/composer/mention-item/build-subagent-plugin-url.ts";
import { l as parseDirectiveL } from "../../boundaries/mermaid/parse-directives";

/**
 * Extract the first non-empty prompt from an array of prompt strings.
 */
export function getFirstNonEmptyPrompt(prompts: string[]): string | null {
  return (
    prompts
      ?.map((prompt) => prompt.trim())
      .find((trimmed) => trimmed.length > 0) ?? null
  );
}
export interface PluginPrefillPromptOptions {
  defaultPrompt: string | null;
  pluginDisplayName: string;
  pluginId: string;
}

/**
 * Build a prefill prompt string that includes a plugin mention and the default prompt.
 */
export function buildPluginPrefillPrompt({
  defaultPrompt,
  pluginDisplayName,
  pluginId,
}: PluginPrefillPromptOptions): string {
  return `${`[@${pluginDisplayName}](${parseDirectiveL(buildPluginUrl(pluginId))})`} ${defaultPrompt?.trim() ?? ""}`;
}
