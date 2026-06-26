// Restored from ref/webview/assets/use-navigate-to-local-conversation-iv7hbMgu.js
// use-navigate-to-local-conversation-iv7hbMgu chunk restored from the Codex webview bundle.
import { chunkI as chunkS } from "./esbuild-runtime-helpers";
import { ai, pt } from "../boundaries/zod";
import ReactDOM from "react-dom";
import { useStableCallback } from "./use-stable-callback";
import { useNavigate } from "../boundaries/react-router-dom";
const flushSyncWrapper = chunkS(ReactDOM, 1);
export function useNavigateToLocalConversation(): (
  conversationId: string,
) => void {
  const navigate = useNavigate();
  const navigateToConversation = (conversationId: string): void => {
    const transformedId = pt(ai(conversationId));
    flushSyncWrapper.flushSync(() => {
      navigate(transformedId);
    });
  };
  return useStableCallback(navigateToConversation);
}
