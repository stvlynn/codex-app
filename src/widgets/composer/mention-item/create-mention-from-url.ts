// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
import type { Mention } from "./types";
import { getMentionKindFromHref } from "./get-mention-kind-from-href";
import { parseMcpResource } from "./parse-sites-mcp";
import { parseSitesProjectId } from "./parse-sites-mcp";
import { parseChatgptConversationId } from "./is-plugin-parse-chatgpt";
import { parsePluginIdFromUrl } from "./parse-plugin-id";
import { createAgentMention } from "./create-agent-mention";
import { createSubagentMention } from "./create-subagent-mention";
import { createThreadMention } from "./create-thread-mention";
import { createMcpResourceMention } from "./create-mcp-resource-mention";
import { createSitesProjectMention } from "./create-sites-project-mention";
import { createChatgptConversationMention } from "./create-chatgpt-conversation-mention";
import { createAppMention } from "./create-app-mention";
import { createPluginMention } from "./create-plugin-mention";
import { createSkillMention } from "./create-skill-mention";
import { getDefaultMentionLabels } from "./mention-labels";
export function createMentionFromUrl({
  url,
  displayName,
}: {
  url: string;
  displayName: string;
}): Mention | null {
  const kind = getMentionKindFromHref({
    href: url,
    label: displayName,
  });
  switch (kind) {
    case "agent":
      return createAgentMention({
        conversationId: url,
        displayName,
      });
    case "subagent":
      return createSubagentMention({
        subagentId: url,
        displayName,
      });
    case "thread":
      return createThreadMention({
        threadId: url,
        displayName,
      });
    case "mcp-resource": {
      const r = parseMcpResource(url);
      return r
        ? createMcpResourceMention({
            ...r,
            displayName,
          })
        : null;
    }
    case "sites-project": {
      const id = parseSitesProjectId(url);
      return id
        ? createSitesProjectMention({
            projectId: id,
            displayName,
          })
        : null;
    }
    case "chatgpt-conversation": {
      const id = parseChatgptConversationId(url);
      return id
        ? createChatgptConversationMention({
            conversationId: id,
            displayName,
          })
        : null;
    }
    case "app":
      return createAppMention({
        name: displayName,
        id: url,
      });
    case "plugin": {
      const pluginId = parsePluginIdFromUrl(url);
      return pluginId
        ? createPluginMention(
            {
              plugin: {
                name: displayName,
                id: pluginId,
              },
            },
            getDefaultMentionLabels(),
          )
        : null;
    }
    case "skill":
      return createSkillMention({
        name: displayName,
        path: url,
      });
    case "text":
      return {
        kind: "text",
        name: displayName,
        displayName,
        path: url,
        description: "",
        iconSmall: "",
      };
    default:
      return null;
  }
}
