import fs from "node:fs";
import path from "node:path";

const MANIFEST = "restored/.deobfuscate-javascript/_full/manifest.json";
const LEDGER = "restored/.deobfuscate-javascript/_full/ledger.json";

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));

const vendorRuntime = new Set([
  // d3 internal helpers
  "array-hqvMvHot",
  "defaultLocale-gPb_B8uX",
  "init-B2r4ykR3",
  "math-BO6C2O78",
  "min-BVs4UoI0",
  "monotone-DKOUTWfZ",
  "path-BiIEs4Yy",
  "sankeyLinkHorizontal-DCfEjaVP",
  "string-CKccV857",
  "invert-D9sJN2p1",
  // lodash internal helper
  "isArrayLikeObject-1Hrr5Oll",
  // small npm utilities
  "ccount-BaJjvBGW",
  "callback-BhdA_NIt",
  // esbuild/tslib runtime re-export helper
  "chunk-Cq_f4orQ",
]);

const boundary = new Set([
  // @pierre/diffs clean bare import leaf
  "parsePatchFiles-Dm7PKlLE",
  // @pierre/trees forked internals
  "store-489E8Cj_",
  "iconResolver-DrMXO_qJ",
  "score-query-match-DS2pZf_b",
]);

const boundaryPaths = {
  "parsePatchFiles-Dm7PKlLE": "boundaries/parse-patch-files.tsx",
  "store-489E8Cj_": "boundaries/pierre-trees-store.tsx",
  "iconResolver-DrMXO_qJ": "boundaries/pierre-trees-icon-resolver.tsx",
  "score-query-match-DS2pZf_b": "boundaries/pierre-trees-score-query-match.tsx",
};

const vendorPaths = {
  "array-hqvMvHot": "utils/d3-array-helper.tsx",
  "defaultLocale-gPb_B8uX": "utils/d3-format-default-locale.tsx",
  "init-B2r4ykR3": "utils/d3-scale-init.tsx",
  "math-BO6C2O78": "utils/d3-shape-math.tsx",
  "min-BVs4UoI0": "utils/d3-array-min.tsx",
  "monotone-DKOUTWfZ": "utils/d3-shape-monotone-curve.tsx",
  "path-BiIEs4Yy": "utils/d3-path.tsx",
  "sankeyLinkHorizontal-DCfEjaVP": "utils/d3-sankey-link-horizontal.tsx",
  "string-CKccV857": "utils/d3-color-string.tsx",
  "invert-D9sJN2p1": "utils/d3-color-invert.tsx",
  "isArrayLikeObject-1Hrr5Oll": "utils/lodash-is-array-like-object.tsx",
  "ccount-BaJjvBGW": "utils/ccount.tsx",
  "callback-BhdA_NIt": "utils/p-timeout.tsx",
  "chunk-Cq_f4orQ": "utils/esbuild-runtime-helpers.tsx",
};

let changed = 0;
for (const [basename, file] of Object.entries(manifest.files)) {
  if (vendorRuntime.has(basename)) {
    file.organization = file.organization ?? {};
    file.organization.classification = "vendor-runtime";
    file.organization.semanticPath = vendorPaths[basename] ?? file.organization.semanticPath;
    file.organization.domain = vendorPaths[basename]?.split("/")[0] ?? file.organization.domain;
    changed++;
  } else if (boundary.has(basename)) {
    file.organization = file.organization ?? {};
    file.organization.classification = "boundary";
    file.organization.semanticPath = boundaryPaths[basename] ?? `boundaries/${basename.replace(/-[A-Za-z0-9_-]{8}$/, "").replace(/-[A-Za-z0-9_-]{10,12}$/, "")}.tsx`;
    file.organization.domain = "boundaries";
    changed++;
  }
}

// Update ledger stage classification for consistency
for (const [basename, entry] of Object.entries(ledger.files ?? {})) {
  if (vendorRuntime.has(basename)) {
    entry.classification = "vendor-runtime";
  } else if (boundary.has(basename)) {
    entry.classification = "boundary";
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
console.log(`Reclassified ${changed} chunks (${vendorRuntime.size} vendor-runtime + ${boundary.size} boundary)`);
