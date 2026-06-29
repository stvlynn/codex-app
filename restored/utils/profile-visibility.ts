// Restored from ref/webview/assets/profile-visibility-xdIEz8NE.js
// Profile visibility helpers restored from the Codex webview bundle.
import {
  l as getDynamicConfig,
  o as checkStatsigGate,
  u as useStatsigUser,
} from "@statsig/js-client";
import { t as useAuth } from "../boundaries/use-auth";
export interface ProfileVisibilityResult {
  isProfileVisibilityLoading: boolean;
  isProfileVisible: boolean;
}
export function useProfileVisibility(): ProfileVisibilityResult {
  const { authMethod, isLoading } = useAuth();
  const isUserLoaded = useStatsigUser();
  const isVisibleGate = checkStatsigGate("2478676115");
  const isLoadingState =
    isLoading || (authMethod === "chatgpt" && isUserLoaded);
  const isVisible = authMethod === "chatgpt" && isVisibleGate;
  return {
    isProfileVisibilityLoading: isLoadingState,
    isProfileVisible: isVisible,
  };
}
export function useCanShowProfileVisibility(): boolean {
  const { authMethod } = useAuth();
  const isVisibleGate = checkStatsigGate("2478676115");
  const dynamicConfig = getDynamicConfig("3503973010");
  if (authMethod !== "chatgpt") return false;
  return isVisibleGate && dynamicConfig.get("show_dropdown_entry_point", false);
}
