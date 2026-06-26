// Restored from ref/webview/assets/computer-use-app-approvals-query-Dl5M_EB7.js
// computer-use-app-approvals-query-Dl5M_EB7 chunk restored from the Codex webview bundle.
import { T } from "../boundaries/tanstack-query";
import { a, i, n, u } from "../boundaries/vscode-api";

export const computerUseAppApprovalsQuery = a(
  T,
  "computer-use-app-approvals-read",
  {
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: u.ONE_MINUTE,
  },
);

export const computerUseBackgroundAuthQuery = a(
  T,
  "computer-use-background-auth-read",
  {
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: u.FIVE_SECONDS,
  },
);

export const computerUseAppApprovalsVisibilityQuery = a(
  T,
  "computer-use-app-approvals-visibility",
  {
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: u.FIVE_SECONDS,
  },
);

export const computerUseSoundModeQuery = a(T, "computer-use-sound-mode-read", {
  refetchOnMount: "always",
  refetchOnWindowFocus: "always",
  select: ({ value }: { value: unknown }) => value,
  staleTime: u.FIVE_SECONDS,
});

i(
  T,
  "chrome-extension-installed-read",
  (extensionId: string | null | undefined) => ({
    enabled: extensionId != null,
    params:
      extensionId == null
        ? undefined
        : {
            extensionId,
          },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: u.FIVE_SECONDS,
  }),
);

export async function removeComputerUseAppApproval(bundleIdentifier: string) {
  return n("computer-use-app-approval-remove", {
    params: {
      bundleIdentifier,
    },
  });
}

export async function setComputerUseSoundMode(value: unknown) {
  return (
    await n("computer-use-sound-mode-write", {
      params: {
        value,
      },
    })
  ).value;
}

export async function setComputerUseBackgroundAuth(enabled: boolean) {
  return (
    await n("computer-use-background-auth-write", {
      params: {
        enabled,
      },
    })
  ).enabled;
}
