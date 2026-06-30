// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js
// Helper functions for onboarding plugin suggestions.

import {
  welcomeV2SuggestionsByRole,
  connectAppsRowMessage,
} from "./welcome-v2-data.ts";
function normalizeRole(suggestionsParam: string) {
  return suggestionsParam === "default"
    ? "engineering"
    : suggestionsParam in welcomeV2SuggestionsByRole
      ? suggestionsParam
      : "something_else";
}
function getUniqueRoles(rolesParam: string[]) {
  let normalizedRoles = rolesParam.length > 0 ? rolesParam : ["something_else"];
  return Array.from(new Set(normalizedRoles.map(normalizeRole)));
}
export function getOnboardingSuggestionSummary({ roles }: { roles: string[] }) {
  return {
    connectAppsRowMessage: connectAppsRowMessage,
    role: normalizeRole(roles[0] ?? "something_else"),
    suggestionPrompts: getSuggestionPrompts({
      roles,
      promptsByRole: welcomeV2SuggestionsByRole,
    }),
  };
}
function getSuggestionPrompts({
  roles,
  promptsByRole,
  limit: plan = 3,
}: {
  roles: string[];
  promptsByRole: Record<string, unknown[]>;
  limit?: number;
}) {
  let roleSuggestions = getUniqueRoles(roles).map(
      (item) => promptsByRole[item],
    ),
    roleIndices = roleSuggestions.map(() => 0),
    result: unknown[] = [],
    seen = new Set();
  for (let [roleIdx, roleItems] of roleSuggestions.entries()) {
    let item = roleItems[roleIndices[roleIdx]];
    if (
      ((roleIndices[roleIdx] += 1),
      !(!item || seen.has(item)) &&
        (seen.add(item), result.push(item), result.length >= plan))
    )
      return result;
  }
  for (; result.length < plan; ) {
    let found = false;
    for (let i = 0; i < roleSuggestions.length; i += 1) {
      let nextItem = roleSuggestions[i][roleIndices[i]];
      if (
        ((roleIndices[i] += 1),
        !(!nextItem || seen.has(nextItem)) &&
          (seen.add(nextItem),
          result.push(nextItem),
          (found = true),
          result.length >= plan))
      )
        break;
    }
    if (!found) break;
  }
  return result;
}
export { normalizeRole, getUniqueRoles, getSuggestionPrompts };
