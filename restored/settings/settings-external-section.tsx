// Restored from ref/webview/assets/settings-external-section-j-RLbjnz.js
// Section page for external settings that open in the browser during Alpha.

import { FormattedMessage } from "react-intl";
import { SettingsContentLayout } from "./settings-content-layout";
import { SettingsSectionTitle } from "./settings-shared";
export function SettingsExternalSection(): JSX.Element {
  return (
    <SettingsContentLayout
      title={<SettingsSectionTitle slug="environments" />}
      subtitle={
        <FormattedMessage
          id="settings.section.external"
          defaultMessage="Opens in your browser during Alpha"
          description="Subtitle for settings sections that open in a browser during the Alpha build"
        />
      }
    />
  );
}
