// Restored from ref/webview/assets/local-conversation-title-signals-ChKPHE0E.js
// Local conversation title signals restored from the Codex webview bundle.
import { l as appScopeL, t as appScopeT } from "../boundaries/app-scope";
import {
  G as useHostConfigG,
  W as useHostConfigW,
} from "../boundaries/host-config";
import {
  Ft as titleQueryFactory,
  Ot as fallbackTitleQueryFactory,
  T as turnsQueryFactory,
  Zt as alternateTurnsQueryFactory,
} from "../app/thread-context-inputs";
export interface ConversationTitleData {
  id: string;
  title: unknown;
  turns: unknown;
}
const conversationTitleAtom = appScopeL(
  appScopeT,
  (conversationId: string | null | undefined, { get }) => {
    if (conversationId == null) return null;
    return useHostConfigW({
      id: conversationId,
      title: get(titleQueryFactory, conversationId),
      turns:
        get(turnsQueryFactory, conversationId) ??
        get(alternateTurnsQueryFactory, conversationId),
    });
  },
);
export const localConversationTitleSignal = appScopeL(
  appScopeT,
  (conversationId: string | null | undefined, { get }) => {
    if (conversationId == null) return null;
    const title = get(conversationTitleAtom, conversationId);
    if (title != null) return title;
    const fallbackConversationId = get(
      fallbackTitleQueryFactory,
      conversationId,
    );
    return useHostConfigG(
      conversationId,
      get(turnsQueryFactory, fallbackConversationId) ??
        get(alternateTurnsQueryFactory, fallbackConversationId),
    );
  },
);
export { conversationTitleAtom };
