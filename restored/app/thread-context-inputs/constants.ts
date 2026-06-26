// Restored from ref/webview/assets/thread-context-inputs-B6tQCr7t.js
// Constants for thread-context-inputs

// ------------------------------------------------------------------
// Model constants
// ------------------------------------------------------------------

export const GPT_5_4 = "gpt-5.4";
export const CYBER_URL = "https://chatgpt.com/cyber";

// ------------------------------------------------------------------
// Service tier constants
// ------------------------------------------------------------------

export const PRIORITY_KEY = "priority";
export const DEFAULT_SERVICE_TIER = "fromConfig";

// ------------------------------------------------------------------
// Citation type constants
// ------------------------------------------------------------------

export const CITATION_TYPE_INLINE = "inline";
export const CITATION_TYPE_SOURCE = "source";

// ------------------------------------------------------------------
// File preview constants
// ------------------------------------------------------------------

export const IMAGE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "ico",
  "jpeg",
  "jpg",
  "png",
  "tif",
  "tiff",
  "webp",
]);
export const MARKDOWN_EXTENSIONS = new Set([
  "markdown",
  "md",
  "mdown",
  "mdx",
  "mkd",
]);
export const PREVIEWABLE_EXTENSIONS = new Set([
  "avif",
  "csv",
  "doc",
  "docx",
  "gif",
  "jpeg",
  "jpg",
  "pdf",
  "png",
  "ppt",
  "pptx",
  "tsv",
  "webp",
  "xls",
  "xlsm",
  "xlsx",
]);
export const RICH_PREVIEWABLE_EXTENSIONS = new Set([
  ...PREVIEWABLE_EXTENSIONS,
  "md",
  "mdx",
]);

// ------------------------------------------------------------------
// Git query constants
// ------------------------------------------------------------------

export const GIT_CHANGE_TYPE_HEAD = "head";
export const GIT_CHANGE_TYPE_INDEX = "index";
export const GIT_CHANGE_TYPE_WORKING_TREE = "working-tree";
export const GIT_CHANGE_TYPE_REMOTE_REFS = "remote-refs";
export const GIT_CHANGE_TYPE_SYNCED_BRANCH = "synced-branch";
export const GIT_QUERY_METHODS_BY_CHANGE_TYPE: Record<string, string[]> = {
  head: [
    "current-branch",
    "upstream-branch",
    "branch-ahead-count",
    "recent-branches",
    "branch-exists",
    "branch-commits",
    "search-branches",
    "nearest-ancestor-branch",
    "branch-metadata",
    "status-summary",
    "branch-diff-stats",
    "review-summary",
    "review-diff",
    "review-patch",
    "commit-message-diff",
    "index-info",
    "submodule-paths",
    "blame-file",
    "synced-branch",
  ],
  index: [
    "status-summary",
    "branch-diff-stats",
    "review-summary",
    "review-diff",
    "review-patch",
    "commit-message-diff",
    "index-info",
  ],
  "working-tree": [
    "status-summary",
    "branch-diff-stats",
    "review-summary",
    "review-diff",
    "review-patch",
    "commit-message-diff",
  ],
  "remote-refs": [
    "branch-ahead-count",
    "default-branch",
    "base-branch",
    "branch-commits",
    "search-branches",
    "nearest-ancestor-branch",
    "branch-metadata",
    "branch-diff-stats",
    "review-summary",
    "review-diff",
    "review-patch",
  ],
  "synced-branch": ["synced-branch", "synced-branch-state", "branch-exists"],
};

// ------------------------------------------------------------------
// Browser-use / chrome-extension policy constants
// ------------------------------------------------------------------

export const CHROME_EXTENSION_ALLOWED_ORIGINS: string[] = [
  "chrome-extension://*",
];
export const CHROME_EXTENSION_BLOCKED_ORIGINS: string[] = [];
export const CHROME_EXTENSION_ALLOWED_ACTIONS = [
  "readDom",
  "click",
  "type",
  "scroll",
  "navigate",
];

// ------------------------------------------------------------------
// Tab context asset lifecycle constants
// ------------------------------------------------------------------

export const TAB_LIFECYCLE_ACTIVE = "active";
export const TAB_LIFECYCLE_INACTIVE = "inactive";
export const TAB_LIFECYCLE_DISPOSED = "disposed";

// ------------------------------------------------------------------
// Memory settings constants
// ------------------------------------------------------------------

export const DEFAULT_MEMORY_MAX_TOKENS = 4096;
export const MEMORY_RETENTION_POLICY_STANDARD = "standard";
export const MEMORY_RETENTION_POLICY_EXTENDED = "extended";

// ------------------------------------------------------------------
// Analytics constants
// ------------------------------------------------------------------

export const ANALYTICS_STRUCTURED_EVENT_TYPE = "__protobuf_structured_event__";
export const ANALYTICS_CREDIT_PURCHASE_EVENT = {
  $type: "protobuf_analytics_events.v1.ChatgptCreditPurchaseButtonClicked",
};
export const ANALYTICS_SDK_TYPE = "web";
export const ANALYTICS_SDK_VERSION = "1.0.0";
export const ANALYTICS_TIMEOUT_MS = 5000;
export const AUTH_STATUS_LOGGED_OUT = "logged_out";
export const AUTH_STATUS_LOGGED_IN = "logged_in";

// ------------------------------------------------------------------
// Unread thread IDs persistence
// ------------------------------------------------------------------

export const UNREAD_THREAD_IDS_KEY = "unread-thread-ids-by-host-v1";

// ------------------------------------------------------------------
// URL regex patterns
// ------------------------------------------------------------------

export const URL_REGEX = /\bhttps?:\/\/[^\s<>"'`]+/gi;
export const TRAILING_PUNCTUATION_REGEX = /[.,;!?]+$/u;
export const URL_PARENTHESIS_REGEX = /[()[\]]/u;

// ------------------------------------------------------------------
// Misc constants
// ------------------------------------------------------------------

export const INT64_MIN = "-9223372036854775808";
export const INT64_MAX = "9223372036854775807";
export const PROTOBUF_FIXED_LENGTH = 19;
export const PUNCTUATION_CHARS = new Set(" !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");
