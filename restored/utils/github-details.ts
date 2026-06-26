// Restored from ref/webview/assets/github-details-BuERSkr8.js
// GithubDetails chunk restored from the Codex webview bundle.

const DETAILS_REGEX = /<details(\s+open)?>([\s\S]*?)<\/details>/gi;
const FENCED_CODE_BLOCK_REGEX =
  /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
const ALERT_CALLOUT_REGEX =
  /(^|\n)(>[ \t]*)\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([ \t]*(?=\n|$))/gi;
const HTML_COMMENT_REGEX = /<!--[\s\S]*?-->/g;
const SUMMARY_CONTENT_REGEX =
  /^\s*<summary>([\s\S]*?)<\/summary>\s*([\s\S]*)$/i;
const HTML_TAG_REGEX = /<[^>]+>/g;
const FENCED_CODE_BLOCK_PLACEHOLDER = "@@CODEX_FENCED_CODE_BLOCK_";

export interface GithubDetailsResult {
  summary: string;
  content: string;
  open: boolean;
}

/**
 * Transforms GitHub-style `<details>` blocks in markdown into a custom
 * `:::github-details` directive format, preserving fenced code blocks.
 */
export function transformGithubDetails(markdown: string): string {
  const preservedCodeBlocks: string[] = [];
  const markdownWithPlaceholders = markdown.replace(
    FENCED_CODE_BLOCK_REGEX,
    (match) => {
      const placeholder = `${FENCED_CODE_BLOCK_PLACEHOLDER}${preservedCodeBlocks.length}@@`;
      preservedCodeBlocks.push(match);
      return placeholder;
    },
  );
  return restoreFencedCodeBlocks(
    processDetailsBlocks(markdownWithPlaceholders),
    preservedCodeBlocks,
  );
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripHtmlTags(text: string): string {
  return normalizeWhitespace(text.replace(HTML_TAG_REGEX, " "));
}

function processDetailsBlocks(markdown: string): string {
  return markdown
    .replace(HTML_COMMENT_REGEX, "")
    .replace(
      ALERT_CALLOUT_REGEX,
      (_match, leadingNewline, quotePrefix, alertType) =>
        `${leadingNewline}${quotePrefix}**${capitalizeFirstLetter(alertType)}**`,
    )
    .replace(DETAILS_REGEX, (match, openAttribute, innerContent) => {
      const summaryMatch = innerContent.match(SUMMARY_CONTENT_REGEX);
      if (summaryMatch == null) {
        return match;
      }
      const summaryText = stripHtmlTags(summaryMatch[1] ?? "");
      if (summaryText.length === 0) {
        return match;
      }
      const contentBody = (summaryMatch[2] ?? "").trim();
      const attributes = [`summary=${JSON.stringify(summaryText)}`];
      if (openAttribute != null) {
        attributes.push('open="true"');
      }
      return `:::github-details{${attributes.join(" ")}}\n${contentBody}\n:::`;
    })
    .replace(/\n{3,}/g, "\n\n");
}

function capitalizeFirstLetter(text: string): string {
  const lowercased = text.toLowerCase();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

function restoreFencedCodeBlocks(
  markdown: string,
  codeBlocks: string[],
): string {
  return markdown.replace(
    /@@CODEX_FENCED_CODE_BLOCK_(\d+)@@/g,
    (_match, index) => codeBlocks[Number(index)] ?? _match,
  );
}
