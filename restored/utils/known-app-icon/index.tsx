// Restored from ref/webview/assets/known-app-icon-CXoFtnBV.js
// Known app icon registry: exports SVG icon components and lookup utilities.

// Icons imported from sibling chunks
import { BranchIcon } from "../../icons/branch-icon";
import { GithubMarkIcon } from "../../icons/github-mark-icon";
import { GoogleDriveIcon } from "../../icons/google-drive-icon";

// Inline icon components
import { FigmaIcon } from "./icons/figma";
import { FileCsvIcon } from "./icons/file-csv";
import { FilePdfIcon } from "./icons/file-pdf";
import { FilePresentationIcon } from "./icons/file-presentation";
import { FileSpreadsheetIcon } from "./icons/file-spreadsheet";
import { FileWordDocumentIcon } from "./icons/file-word-document";
import { GoogleCalendarIcon } from "./icons/google-calendar";
import { GoogleDocsIcon } from "./icons/google-docs";
import { GoogleSheetsIcon } from "./icons/google-sheets";
import { GoogleSlidesIcon } from "./icons/google-slides";
import { GmailIcon } from "./icons/gmail";
import { LinearIcon } from "./icons/linear";
import { NotionIcon } from "./icons/notion";
import { SlackIcon } from "./icons/slack";

// Registry and lookup functions
import {
  appIconRegistry,
  getAppIconByName,
  getAppIconForConnector,
} from "./registry";

// Populate the registry with all known app icons
Object.assign(appIconRegistry, {
  figma: FigmaIcon,
  "file-csv": FileCsvIcon,
  "file-pdf": FilePdfIcon,
  "file-presentation": FilePresentationIcon,
  "file-spreadsheet": FileSpreadsheetIcon,
  "file-word-document": FileWordDocumentIcon,
  git: BranchIcon,
  gmail: GmailIcon,
  "google-calendar": GoogleCalendarIcon,
  "google-docs": GoogleDocsIcon,
  "google-drive": GoogleDriveIcon,
  "google-sheets": GoogleSheetsIcon,
  "google-slides": GoogleSlidesIcon,
  github: GithubMarkIcon,
  linear: LinearIcon,
  notion: NotionIcon,
  slack: SlackIcon,
});
export {
  FileWordDocumentIcon,
  FilePdfIcon,
  GoogleDocsIcon,
  LinearIcon,
  GoogleSlidesIcon,
  getAppIconForConnector,
  FileSpreadsheetIcon,
  NotionIcon,
  FilePresentationIcon,
  getAppIconByName,
  GoogleSheetsIcon,
};
export type { ConnectorIconLookup } from "./registry";
