// Restored from ref/webview/assets/known-app-icon-CXoFtnBV.js
import type { ComponentType, SVGProps } from "react";

/**
 * Registry of known app icon components keyed by normalized app name.
 */
export const appIconRegistry: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {};

/**
 * Normalize an app name by trimming, lowercasing, and converting non-alphanumeric
 * characters to hyphens.
 */
function normalizeAppName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((segment) => segment.length > 0)
    .join("-");
}

/**
 * Look up an icon component by its normalized name, with fallback logic for
 * connector-prefixed and -mcp-server-suffixed names.
 */
function lookupIcon(
  normalizedName: string,
): ComponentType<SVGProps<SVGSVGElement>> | null {
  const withoutConnectorPrefix = normalizedName.replace(/^connector-/u, "");
  return (
    appIconRegistry[normalizedName] ??
    appIconRegistry[withoutConnectorPrefix] ??
    appIconRegistry[withoutConnectorPrefix.replace(/-mcp-server$/u, "")] ??
    null
  );
}

/**
 * Get an app icon component by a raw app name string.
 *
 * @param name - The raw app name (e.g. "Google Docs", "connector-figma-mcp-server")
 * @returns The matching icon component, or null if not found.
 */
export function getAppIconByName(
  name: string,
): ComponentType<SVGProps<SVGSVGElement>> | null {
  return lookupIcon(normalizeAppName(name));
}

/**
 * Connector info used to look up an icon for a specific connector.
 */
export interface ConnectorIconLookup {
  /** Connector ID */
  id: string;
  /** Connector display name */
  name: string;
  /** Plugin display names for fallback lookup */
  pluginDisplayNames: string[];
}

/**
 * Get an app icon component for a connector, trying the name, id, and plugin
 * display names in order.
 *
 * @param connector - Connector information for icon lookup
 * @returns The matching icon component, or null if not found.
 */
export function getAppIconForConnector(
  connector: ConnectorIconLookup,
): ComponentType<SVGProps<SVGSVGElement>> | null {
  const candidates = [
    connector.name,
    connector.id,
    ...connector.pluginDisplayNames,
  ].map(normalizeAppName);
  for (const candidate of candidates) {
    const icon = lookupIcon(candidate);
    if (icon != null) return icon;
  }
  return null;
}
