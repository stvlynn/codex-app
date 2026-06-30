// Restored from ref/webview/assets/open-source-licenses-page-BeKIrKdc.js
// open-source-licenses-page-BeKIrKdc chunk restored from the Codex webview bundle.
import { useIntl } from "boundaries/intl-messageformat";
import { Button } from "ui/button";
import { ArrowLeftIcon } from "icons/arrow-left-icon";
import { SettingsContentLayout } from "settings/settings-content-layout";
import { SettingsSurface } from "components/settings/settings-surface";
import { SettingsGroup } from "components/settings/settings-group";
import { useVSCodeQuery } from "boundaries/vscode-api";
import { useNavigate, useLocation } from "boundaries/react-router-dom";
interface LicensesBackState {
  licensesBackPath?: string;
  [key: string]: unknown;
}
function getBackPath(state: unknown): string {
  if (
    typeof state === "object" &&
    state !== null &&
    !Array.isArray(state) &&
    "licensesBackPath" in state
  ) {
    const path = (state as LicensesBackState).licensesBackPath;
    if (typeof path === "string" && path.startsWith("/settings/")) {
      return path;
    }
  }
  return "/settings/general";
}
export function OpenSourceLicensesPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = getBackPath(location.state);
  const { data, isLoading } = useVSCodeQuery("third-party-notices", {
    enabled: true,
    staleTime: 60_000,
  });
  const handleBack = () => {
    navigate(backPath, {
      replace: true,
      state: location.state,
    });
  };
  const backButton = (
    <Button color="ghost" size="toolbar" onClick={handleBack}>
      <ArrowLeftIcon className="icon-xs" />
      {intl.formatMessage({
        id: "settings.openSourceLicenses.back",
        defaultMessage: "Back",
        description: "Button label to go back to the main settings page",
      })}
    </Button>
  );
  const title = intl.formatMessage({
    id: "settings.openSourceLicenses.title",
    defaultMessage: "Open source licenses",
    description: "Title for the open source licenses settings page",
  });
  const subtitle = intl.formatMessage({
    id: "settings.openSourceLicenses.subtitle",
    defaultMessage: "Third-party notices for dependencies included in this app",
    description: "Subtitle for the open source licenses settings page",
  });
  const content = (
    <SettingsGroup>
      <SettingsGroup.Content>
        <SettingsSurface>
          {isLoading ? (
            <div className="text-sm text-token-text-secondary">
              {intl.formatMessage({
                id: "settings.openSourceLicenses.loading",
                defaultMessage: "Loading…",
                description: "Loading label while fetching third-party notices",
              })}
            </div>
          ) : data?.text ? (
            <pre className="bg-token-surface-secondary rounded p-3 text-xs leading-relaxed break-words whitespace-pre-wrap text-token-text-primary">
              {data.text}
            </pre>
          ) : (
            <div className="text-sm text-token-text-secondary">
              {intl.formatMessage({
                id: "settings.openSourceLicenses.missing",
                defaultMessage: "No third-party notices were found.",
                description:
                  "Message shown when the third-party notices file is missing",
              })}
            </div>
          )}
        </SettingsSurface>
      </SettingsGroup.Content>
    </SettingsGroup>
  );
  return (
    <SettingsContentLayout
      backSlot={backButton}
      title={title}
      subtitle={subtitle}
    >
      {content}
    </SettingsContentLayout>
  );
}
