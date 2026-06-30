// Restored from ref/webview/assets/use-active-conversation-id-CAmguZaf.js
import { useParams } from "react-router-dom";

function normalizeConversationId(id: string): string {
  return id;
}

export function useActiveConversationId(): string | null {
  const localRoute = useParams<{ conversationId: string }>(
    "/local/:conversationId",
  );
  const remoteRoute = useParams<{ conversationId: string }>(
    "/remote/:conversationId",
  );
  const hotkeyRoute = useParams<{ conversationId: string }>(
    "/hotkey-window/thread/:conversationId",
  );

  const conversationId =
    localRoute?.params.conversationId ??
    remoteRoute?.params.conversationId ??
    hotkeyRoute?.params.conversationId;

  return conversationId ? normalizeConversationId(conversationId) : null;
}

export default useActiveConversationId;
