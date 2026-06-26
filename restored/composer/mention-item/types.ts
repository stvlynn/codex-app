// Restored from ref/webview/assets/mention-item-Cs3Au6lU.js
// mention-item-Cs3Au6lU chunk restored from the Codex webview bundle.
export type MentionKind =
  | "agent"
  | "subagent"
  | "thread"
  | "mcp-resource"
  | "sites-project"
  | "chatgpt-conversation"
  | "app"
  | "plugin"
  | "skill"
  | "text";
export interface BaseMention {
  kind: MentionKind;
  name: string;
  displayName: string;
  path: string;
  description: string;
  iconSmall: string;
}
export interface PluginMention extends BaseMention {
  kind: "plugin";
  brandColor?: string;
}
export type Mention = BaseMention | PluginMention;
