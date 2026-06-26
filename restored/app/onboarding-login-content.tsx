// Restored from ref/webview/assets/onboarding-login-content-BYCq-uLw.js
//
// Onboarding login helpers and content component for the desktop app.

import type { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  l as useIntl,
  s as FormattedMessage,
} from "../boundaries/intl-messageformat";
import {
  Bt as performHostLoginAction,
  r as LOCAL_HOST_ID,
} from "../boundaries/host-config";
import { _ as statsigModule, t as statsigClientKey } from "@statsig/js-client";
const DESKTOP_AUTH_PATH = "/codex/desktop-auth";
const DESKTOP_AUTH_BASE_URL = `https://chatgpt.com${DESKTOP_AUTH_PATH}`;
const SOURCE_SURFACE_STABLE_ID_PARAM = "source_surface_stable_id";
const CODEX_ORIGIN_STABLE_ID_PARAM = "codex_origin_stable_id";
const STREAMLINED_LOGIN_PARAM = "codex_streamlined_login";
export interface InitiateChatGptLoginOptions {
  hostId?: string;
  signal?: AbortSignal;
  useStreamlinedLogin?: boolean;
}
export async function initiateChatGptLogin({
  hostId = LOCAL_HOST_ID,
  signal,
  useStreamlinedLogin,
}: InitiateChatGptLoginOptions): Promise<void> {
  const abortController = deriveAbortController(signal);
  if (hostId === "local") {
    return performHostLoginAction("login-with-chatgpt", {
      abortController,
      useStreamlinedLogin,
    });
  }
  return performHostLoginAction("login-with-chatgpt-for-host", {
    abortController,
    hostId,
    useStreamlinedLogin,
  });
}
export interface InitiateDeviceCodeLoginOptions {
  signal?: AbortSignal;
}
export function initiateChatGptDeviceCodeLogin({
  signal,
}: InitiateDeviceCodeLoginOptions = {}): Promise<void> {
  return performHostLoginAction("login-with-chatgpt-device-code", {
    abortController: deriveAbortController(signal),
  });
}
function deriveAbortController(signal?: AbortSignal): AbortController {
  const controller = new AbortController();
  if (signal == null) {
    return controller;
  }
  if (signal.aborted) {
    controller.abort();
    return controller;
  }
  signal.addEventListener("abort", () => controller.abort(), {
    once: true,
  });
  return controller;
}
export interface BuildOnboardingAuthUrlOptions {
  authUrl: string;
  sourceSurfaceStableId?: string | null;
  includeCodexOriginStableId?: boolean;
  useDesktopAuth?: boolean;
  useStreamlinedLoginUx?: boolean;
}
export function buildOnboardingAuthUrl({
  authUrl,
  sourceSurfaceStableId = (statsigModule() as StatsigModule).StableID.get(
    statsigClientKey,
  ),
  includeCodexOriginStableId = false,
  useDesktopAuth = false,
  useStreamlinedLoginUx = false,
}: BuildOnboardingAuthUrlOptions): string {
  if (!sourceSurfaceStableId && !useDesktopAuth && !useStreamlinedLoginUx) {
    return authUrl;
  }
  try {
    const url = new URL(authUrl);
    if (url.pathname === DESKTOP_AUTH_PATH) {
      const authorizeUrl = url.searchParams.get("authorize_url");
      if (sourceSurfaceStableId && authorizeUrl) {
        const wrapped = new URL(authorizeUrl);
        setStableIdParams(
          wrapped,
          sourceSurfaceStableId,
          includeCodexOriginStableId,
        );
        url.searchParams.set("authorize_url", wrapped.toString());
      }
      if (useStreamlinedLoginUx) {
        url.searchParams.set(STREAMLINED_LOGIN_PARAM, "true");
      }
      return url.toString();
    }
    if (sourceSurfaceStableId) {
      setStableIdParams(url, sourceSurfaceStableId, includeCodexOriginStableId);
    }
    if (useStreamlinedLoginUx) {
      url.searchParams.set(STREAMLINED_LOGIN_PARAM, "true");
    }
    if (!useDesktopAuth) {
      return url.toString();
    }
    const desktopAuthUrl = new URL(DESKTOP_AUTH_BASE_URL);
    desktopAuthUrl.searchParams.set("authorize_url", url.toString());
    if (useStreamlinedLoginUx) {
      desktopAuthUrl.searchParams.set(STREAMLINED_LOGIN_PARAM, "true");
    }
    return desktopAuthUrl.toString();
  } catch {
    return authUrl;
  }
}
function setStableIdParams(
  url: URL,
  sourceSurfaceStableId: string,
  includeCodexOriginStableId: boolean,
): void {
  url.searchParams.set(SOURCE_SURFACE_STABLE_ID_PARAM, sourceSurfaceStableId);
  if (includeCodexOriginStableId) {
    url.searchParams.set(CODEX_ORIGIN_STABLE_ID_PARAM, sourceSurfaceStableId);
  }
}
interface StatsigModule {
  StableID: {
    get(key: string): string;
  };
}
export interface OnboardingLoginContentProps {
  apiKeyValue: string;
  isApiKeyEntryVisible: boolean;
  isApiKeySignInPending: boolean;
  isChatGptSignInPending: boolean;
  onApiKeySecondaryAction: () => void;
  onApiKeySubmit: () => void;
  onApiKeyValueChange: (value: string) => void;
  onChatGptSignIn: () => void;
  onShowApiKeyEntry: () => void;
  apiKeySecondaryActionLabel: ReactNode;
}
export function OnboardingLoginContent({
  apiKeyValue,
  isApiKeyEntryVisible,
  isApiKeySignInPending,
  isChatGptSignInPending,
  onApiKeySecondaryAction,
  onApiKeySubmit,
  onApiKeyValueChange,
  onChatGptSignIn,
  onShowApiKeyEntry,
  apiKeySecondaryActionLabel,
}: OnboardingLoginContentProps): JSX.Element {
  const intl = useIntl();
  if (isApiKeyEntryVisible) {
    const placeholder = intl.formatMessage({
      id: "electron.onboarding.login.apikey.placeholder",
      defaultMessage: "sk-…",
      description: "Placeholder for API key input on desktop onboarding",
    });
    const isSubmitDisabled =
      apiKeyValue.trim().length === 0 || isApiKeySignInPending;
    return (
      <div className="flex w-full flex-col gap-3">
        <label className="text-base font-medium text-token-foreground">
          <FormattedMessage
            id="electron.onboarding.login.apikey.label"
            defaultMessage="OpenAI API key"
            description="Label for API key input on desktop onboarding"
          />
          <input
            autoFocus
            className="mt-2 w-full rounded-xl border border-token-border bg-token-input-background px-4 py-2.5 focus:ring-2 focus:ring-black/15 focus:outline-none"
            placeholder={placeholder}
            value={apiKeyValue}
            onChange={(event) => onApiKeyValueChange(event.target.value)}
          />
        </label>
        <div className="flex items-center gap-2">
          <Button
            color="secondary"
            className="flex flex-1 justify-center py-2"
            onClick={onApiKeySecondaryAction}
          >
            {apiKeySecondaryActionLabel}
          </Button>
          <Button
            className="flex flex-1 justify-center py-2"
            onClick={onApiKeySubmit}
            disabled={isSubmitDisabled}
            loading={isApiKeySignInPending}
          >
            <FormattedMessage
              id="electron.onboarding.login.apikey.continue"
              defaultMessage="Continue"
              description="Continue button label for API key sign-in on desktop onboarding"
            />
          </Button>
        </div>
      </div>
    );
  }
  const chatGptButtonLabel = isChatGptSignInPending ? (
    <FormattedMessage
      id="electron.onboarding.login.chatgpt.cancel"
      defaultMessage="Cancel sign-in"
      description="Cancel button label while ChatGPT sign-in is in progress on desktop onboarding"
    />
  ) : (
    <FormattedMessage
      id="electron.onboarding.login.chatgpt.continue"
      defaultMessage="Continue with ChatGPT"
      description="Button label to sign in with ChatGPT on desktop onboarding"
    />
  );
  return (
    <div className="flex w-full max-w-[200px] flex-col gap-3">
      <Button
        color="primary"
        className="w-full justify-center py-2.5"
        onClick={onChatGptSignIn}
      >
        {chatGptButtonLabel}
      </Button>
      {!isChatGptSignInPending && (
        <Button
          color="outline"
          className="w-full justify-center py-2.5"
          onClick={onShowApiKeyEntry}
        >
          <FormattedMessage
            id="electron.onboarding.login.apikey.open"
            defaultMessage="Enter API key"
            description="Button label to open API key entry on desktop onboarding"
          />
        </Button>
      )}
    </div>
  );
}
