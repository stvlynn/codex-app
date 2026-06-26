// Restored from ref/webview/assets/get-file-icon-CWBPd1m7.js
// get-file-icon-CWBPd1m7 chunk restored from the Codex webview bundle.
import type { ComponentProps, ReactNode } from "react";
import { t as MimeTypes } from "../../utils/mime-types.ts";
import { FileIcon } from "../../icons/file-icon.tsx";
import { TerminalIcon } from "../../icons/terminal-icon.tsx";
import { CodeIcon } from "../../icons/code-icon.tsx";
import { FolderIcon } from "../../icons/folder-icon.tsx";
import { JsonIcon } from "../../icons/json-icon.tsx";
import { NotebookIcon } from "../../icons/notebook-icon.tsx";
import { SettingsCogIcon } from "../../icons/settings-cog-icon.tsx";
import { SkillsIcon } from "../../icons/skills-icon.tsx";
import {
  ArtifactDocumentIcon,
  CPlusPlusIcon,
  CssIcon,
  DocumentIcon,
  HashesIcon,
  HtmlIcon,
  ImageIcon,
  JavaIcon,
  JavaScriptIcon,
  PdfIcon,
  PhpIcon,
  PresentationIcon,
  PythonIcon,
  ReactIcon,
  RustIcon,
  ShellIcon,
  SpreadsheetIcon,
  BuildIcon,
  TypeScriptIcon,
} from "./file-type-icons.tsx";
export type FileIconKey =
  | "artifactDocument"
  | "code"
  | "document"
  | "file"
  | "css"
  | "cplusplus"
  | "folder"
  | "html"
  | "java"
  | "javascript"
  | "image"
  | "yaml"
  | "json"
  | "notebook"
  | "pdf"
  | "php"
  | "python"
  | "react"
  | "rust"
  | "shell"
  | "skill"
  | "spreadsheet"
  | "build"
  | "presentation"
  | "hashes"
  | "terminal"
  | "typescript"
  | "toml";
const FILE_TYPE_ICONS: Record<
  FileIconKey,
  (props: ComponentProps<"svg">) => ReactNode
> = {
  artifactDocument: ArtifactDocumentIcon,
  code: CodeIcon,
  document: DocumentIcon,
  file: FileIcon,
  css: CssIcon,
  cplusplus: CPlusPlusIcon,
  folder: FolderIcon,
  html: HtmlIcon,
  java: JavaIcon,
  javascript: JavaScriptIcon,
  image: ImageIcon,
  yaml: FileIcon,
  json: JsonIcon,
  notebook: NotebookIcon,
  pdf: PdfIcon,
  php: PhpIcon,
  python: PythonIcon,
  react: ReactIcon,
  rust: RustIcon,
  shell: ShellIcon,
  skill: SkillsIcon,
  spreadsheet: SpreadsheetIcon,
  build: BuildIcon,
  presentation: PresentationIcon,
  hashes: HashesIcon,
  terminal: TerminalIcon,
  typescript: TypeScriptIcon,
  toml: SettingsCogIcon,
};
const FILENAME_OVERRIDES: Record<string, FileIconKey> = {
  "skill.md": "skill",
};
interface ExtensionMapping {
  key: FileIconKey;
  extensions: string[];
}
const EXTENSION_MAP: ExtensionMapping[] = [
  {
    key: "typescript",
    extensions: ["ts"],
  },
  {
    key: "react",
    extensions: ["tsx", "jsx"],
  },
  {
    key: "javascript",
    extensions: ["js", "mjs", "cjs", "hs"],
  },
  {
    key: "python",
    extensions: ["py"],
  },
  {
    key: "java",
    extensions: ["java"],
  },
  {
    key: "rust",
    extensions: ["rs"],
  },
  {
    key: "php",
    extensions: ["php"],
  },
  {
    key: "css",
    extensions: ["css", "scss", "less", "sass"],
  },
  {
    key: "cplusplus",
    extensions: ["cpp", "cxx", "cc", "c", "hpp", "hh", "h"],
  },
  {
    key: "code",
    extensions: ["rb", "go", "kt", "swift", "m", "mm", "cs", "sql"],
  },
  {
    key: "json",
    extensions: ["json", "jsonc"],
  },
  {
    key: "document",
    extensions: ["md", "mdx", "markdown", "mkd", "mdown"],
  },
  {
    key: "html",
    extensions: ["html", "htm"],
  },
  {
    key: "yaml",
    extensions: ["yaml", "yml"],
  },
  {
    key: "toml",
    extensions: ["toml"],
  },
  {
    key: "document",
    extensions: ["xml"],
  },
  {
    key: "spreadsheet",
    extensions: ["csv", "tsv", "xls", "xlsm", "xlsx"],
  },
  {
    key: "artifactDocument",
    extensions: ["doc", "docx"],
  },
  {
    key: "notebook",
    extensions: ["ipynb"],
  },
  {
    key: "presentation",
    extensions: ["ppt", "pptx"],
  },
  {
    key: "shell",
    extensions: ["sh", "bash", "zsh", "fish", "ps1"],
  },
  {
    key: "terminal",
    extensions: ["dockerfile"],
  },
  {
    key: "document",
    extensions: ["env", "dotenv", "gitignore", "lock"],
  },
  {
    key: "image",
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "ico"],
  },
  {
    key: "build",
    extensions: ["build", "bazel", "bzl", "ninja", "gradle", "mk", "makefile"],
  },
  {
    key: "hashes",
    extensions: ["sha", "sha1", "sha256", "md5", "checksum", "sum"],
  },
  {
    key: "pdf",
    extensions: ["pdf"],
  },
  {
    key: "folder",
    extensions: ["zip", "gz", "tgz", "tar"],
  },
];
const EXTENSION_TO_KEY = Object.fromEntries(
  EXTENSION_MAP.flatMap(({ key, extensions }) =>
    extensions.map((ext) => [ext, key]),
  ),
);
interface MimeTypeMapping {
  prefix: string;
  key: FileIconKey;
}
const MIME_TYPE_MAP: MimeTypeMapping[] = [
  {
    prefix: "image/",
    key: "image",
  },
  {
    prefix: "text/",
    key: "document",
  },
  {
    prefix: "application/pdf",
    key: "pdf",
  },
  {
    prefix: "application/zip",
    key: "folder",
  },
  {
    prefix: "application/gzip",
    key: "folder",
  },
];
const mimeTypes = MimeTypes();
function extractFilename(filepath: string): string | null {
  const lower = filepath.toLowerCase();
  const lastSlash = Math.max(lower.lastIndexOf("/"), lower.lastIndexOf("\\"));
  if (lastSlash >= 0) {
    return lower.slice(lastSlash + 1);
  }
  return lower;
}
function extractExtension(filename: string): string | null {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot > 0 && lastDot < filename.length - 1) {
    return filename.slice(lastDot + 1);
  }
  if (lastDot === 0 && filename.length > 1) {
    return filename.slice(1);
  }
  if (lastDot === -1) {
    return filename;
  }
  return null;
}
function resolveFileIconKey(
  filename?: string | null,
  mimeType?: string | null,
): FileIconKey {
  if (!filename && !mimeType) return "file";
  if (filename) {
    if (/[\\/]$/.test(filename)) return "folder";
    const override = FILENAME_OVERRIDES[filename];
    if (override) return override;
    const name = extractFilename(filename);
    if (name) {
      const overrideByName = FILENAME_OVERRIDES[name];
      if (overrideByName) return overrideByName;
    }
    const ext = extractExtension(filename);
    if (ext) {
      const key = EXTENSION_TO_KEY[ext];
      if (key) return key;
    }
  }
  const resolvedMime =
    mimeType ?? (filename ? mimeTypes.lookup(filename) : false);
  if (typeof resolvedMime === "string") {
    const mapping = MIME_TYPE_MAP.find(({ prefix }) =>
      resolvedMime.startsWith(prefix),
    );
    if (mapping) return mapping.key;
  }
  return "file";
}
export function getFileIcon(
  filename?: string | null,
  mimeType?: string | null,
): (props: ComponentProps<"svg">) => ReactNode {
  const key = resolveFileIconKey(filename, mimeType);
  return FILE_TYPE_ICONS[key];
}
export {
  extractExtension as getFileExtension,
  extractFilename as getFileBasename,
};
export type { FileIconKey };
