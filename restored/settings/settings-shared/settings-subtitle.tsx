// Restored from ref/webview/assets/settings-shared-B8obOSL1.js
import { FormattedMessage } from "react-intl";
import { CODEX_MCP_URL } from "../../utils/links-bd-mmkun-d";
import type { SettingsNavSlug } from "./settings-nav-labels";
export interface SettingsSectionSubtitleProps {
  slug: SettingsNavSlug;
}
export function SettingsSectionSubtitle({
  slug,
}: SettingsSectionSubtitleProps): JSX.Element | null {
  if (slug !== "mcp-settings") {
    return null;
  }
  return (
    <div>
      <FormattedMessage
        id="settings.section.mcp-settings.subtitle"
        defaultMessage="Connect external tools and data sources. "
        description="Subtitle for MCP settings section"
      />
      <a
        className="inline-flex items-center gap-1 text-base text-token-text-link-foreground"
        href={CODEX_MCP_URL}
        target="_blank"
        rel="noreferrer"
      >
        <FormattedMessage
          id="settings.section.mcp-settings.learnMore"
          defaultMessage="Learn more."
          description="Label for MCP docs link"
        />
      </a>
    </div>
  );
}
