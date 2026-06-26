// Restored from ref/webview/assets/model-list-filter-BOpqDcyc.js
/**
 * @provenance
 *   Restored from: /Users/stvlynn/code/codex-reverse/ref/webview/assets/model-list-filter-BOpqDcyc.js
 *   Chunk: model-list-filter-BOpqDcyc
 *   Classification: app-feature
 *   Domain: utils
 *   Semantic path: utils/model-list-filter.ts
 */

export interface ModelInfo {
  model: string;
  hidden?: boolean;
  isDefault?: boolean;
  supportedReasoningEfforts: Array<{
    reasoningEffort: string;
    description: string;
  }>;
}

export interface ModelListFilterOptions {
  authMethod: string;
  availableModels: Set<string>;
  defaultModel: string;
  models: ModelInfo[];
  useHiddenModels: boolean;
}

export interface ModelListFilterResult {
  models: ModelInfo[];
  defaultModel: ModelInfo | null;
}

const DEFAULT_REASONING_EFFORT = {
  reasoningEffort: "medium",
  description: "medium effort",
};

/**
 * Filters and enriches a list of AI models based on auth method and visibility settings.
 * For Copilot auth, only the "medium" reasoning effort is exposed.
 */
export function filterModelList({
  authMethod,
  availableModels,
  defaultModel,
  models,
  useHiddenModels,
}: ModelListFilterOptions): ModelListFilterResult {
  const filteredModels: ModelInfo[] = [];
  let resolvedDefault: ModelInfo | null = null;
  const shouldShowHidden = useHiddenModels && authMethod !== "amazonBedrock";

  for (const model of models) {
    const isVisible = shouldShowHidden
      ? availableModels.has(model.model)
      : !model.hidden;

    if (isVisible) {
      const reasoningEfforts =
        authMethod === "copilot"
          ? [
              model.supportedReasoningEfforts.find(
                (effort) => effort.reasoningEffort === "medium",
              ) ?? DEFAULT_REASONING_EFFORT,
            ]
          : [...model.supportedReasoningEfforts];

      filteredModels.push({
        ...model,
        supportedReasoningEfforts: reasoningEfforts,
      });

      if (model.isDefault) {
        resolvedDefault = model;
      }
    }
  }

  resolvedDefault ??=
    filteredModels.find((m) => m.model === defaultModel) ?? null;

  return {
    models: filteredModels,
    defaultModel: resolvedDefault,
  };
}
