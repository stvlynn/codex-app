// Restored from ref/webview/assets/format-model-display-name-CDASt7Bo.js
// FormatModelDisplayName chunk restored from the Codex webview bundle.

export function formatModelDisplayName(name: string): string {
  const trimmed = name.trimStart().toLowerCase();
  if (!trimmed.startsWith("gpt")) return name;

  return name
    .split(/(\s+)/)
    .map((segment) =>
      segment.trim().length === 0
        ? segment
        : segment
            .split("-")
            .map((part, index) => {
              const lower = part.toLowerCase();
              if (lower === "gpt") return "GPT";
              if (lower === "oai") return "OAI";
              if (index > 0 && part.length > 0) {
                return `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`;
              }
              return part;
            })
            .join("-"),
    )
    .join("");
}
