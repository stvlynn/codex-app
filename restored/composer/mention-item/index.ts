// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export type { MentionKind, BaseMention, PluginMention, Mention } from "./types";
export {
  APP_URL_PREFIX,
  AGENT_URL_PREFIX,
  CHATGPT_CONVERSATION_URL_PREFIX,
  MCP_RESOURCE_URL_PREFIX,
  PLUGIN_URL_PREFIX,
  SITES_PROJECT_URL_PREFIX,
  SUBAGENT_URL_PREFIX,
  THREAD_URL_PREFIX,
  COMPUTER_USE_ID,
} from "./url-constants";
export { buildAppUrl, buildAgentUrl } from "./build-app-agent-url";
export { buildSubagentUrl, buildPluginUrl } from "./build-subagent-plugin-url";
export { buildSitesProjectUrl, buildThreadUrl } from "./build-sites-thread-url";
export { buildMcpResourceUrl } from "./build-mcp-resource-url";
export { buildProjectDirective } from "./build-project-directive";
export { isAppUrl, isAgentUrl } from "./is-app-agent-url";
export {
  isSubagentUrl,
  isChatgptConversationUrl,
} from "./is-subagent-chatgpt-url";
export {
  isPluginUrl,
  parseChatgptConversationId,
} from "./is-plugin-parse-chatgpt";
export { parseSitesProjectId, parseMcpResource } from "./parse-sites-mcp";
export { parseAgentIdFromUrl } from "./parse-agent-id";
export { parseThreadIdFromUrl } from "./parse-thread-id";
export { parseSubagentIdFromUrl } from "./parse-subagent-id";
export { parsePluginIdFromUrl } from "./parse-plugin-id";
export { getMentionTypeFromUrl } from "./get-mention-type-from-url";
export { getMentionKindFromHref } from "./get-mention-kind-from-href";
export { parseMentionText } from "./parse-mention-text";
export { mentionMessages, computerUseMessages } from "./mention-messages";
export { getPluginShortDescription } from "./get-plugin-short-description";
export { slugifyName } from "./slugify-name";
export { buildSkillMention } from "./build-skill-mention";
export { buildAppMention } from "./build-app-mention";
export { buildPluginMention } from "./build-plugin-mention";
export { getDefaultMentionLabels, createMentionLabels } from "./mention-labels";
export { createAgentMention } from "./create-agent-mention";
export { createSubagentMention } from "./create-subagent-mention";
export { createThreadMention } from "./create-thread-mention";
export { createMcpResourceMention } from "./create-mcp-resource-mention";
export { createSitesProjectMention } from "./create-sites-project-mention";
export { createChatgptConversationMention } from "./create-chatgpt-conversation-mention";
export { createAppMention } from "./create-app-mention";
export { createPluginMention } from "./create-plugin-mention";
export { createSkillMention } from "./create-skill-mention";
export { createMentionFromUrl } from "./create-mention-from-url";
export { getMentionDisplayName, getMentionName } from "./mention-name-getters";
export {
  getMentionPath,
  getMentionDescription,
} from "./mention-path-desc-getters";
export {
  getMentionIconSmall,
  getMentionBrandColor,
} from "./mention-icon-brand-getters";
export { isMentionOfKind, getMentionKind } from "./mention-kind-getters";
export {
  isValidMentionUrl,
  normalizeMentionUrl,
} from "./mention-url-validators";
export { getMentionUrlPrefix } from "./get-mention-url-prefix";
