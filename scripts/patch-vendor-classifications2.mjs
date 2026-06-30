import fs from "node:fs";

const MANIFEST = "src/.deobfuscate-javascript/_full/manifest.json";
const LEDGER = "src/.deobfuscate-javascript/_full/ledger.json";

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const ledger = JSON.parse(fs.readFileSync(LEDGER, "utf8"));

// d3 internal modules (bundler split them out)
const d3Internals = [
  "array-hqvMvHot", "arc-D3MQZVTw", "defaultLocale-gPb_B8uX", "init-B2r4ykR3",
  "math-BO6C2O78", "min-BVs4UoI0", "monotone-DKOUTWfZ", "path-BiIEs4Yy",
  "sankeyLinkHorizontal-DCfEjaVP", "string-CKccV857", "invert-D9sJN2p1",
  "line-DIsP-Yv_", "linear-C3CxBvdt", "ordinal-jw163_Ud", "pie-ChHHloNp",
  "step-K6tEdR0Q", "channel-ykMIcoPi",
];

// lodash internal modules
const lodashInternals = ["isArrayLikeObject-1Hrr5Oll", "isEmpty-CTfqpukK", "isEqual-DoHfXEc2"];

// small standalone npm utilities
const npmUtils = ["ccount-BaJjvBGW", "callback-BhdA_NIt"];

// bundler/runtime shims
const runtimeHelpers = ["chunk-Cq_f4orQ", "chunk-AGHRB4JF-Bxy73eEy", "chunk-AGHRB4JF-DNCNxfKz", "__vite-browser-external-EPeb3y57"];

// analytics / segment packages
const analytics = ["auto-track-CVxnO46V", "browser-BQH2qCja", "client-C1mrATqU", "core-CpC1jq0N"];

// graph layout libraries
const graphLayout = ["cytoscape-cose-bilkent-3yd98erd", "cytoscape-fcose-CYmUq-SS"];

// third-party UI / preview libraries
const thirdPartyUI = ["docx-preview-Mi4H0G1I", "dist-eWHzKSsV", "index.umd-CqGTwgME"];

// Pierre packages (forked or clean re-export)
const pierre = ["parsePatchFiles-Dm7PKlLE", "store-489E8Cj_", "iconResolver-DrMXO_qJ", "score-query-match-DS2pZf_b"];

const vendorRuntime = new Set([
  ...d3Internals, ...lodashInternals, ...npmUtils, ...runtimeHelpers,
  ...analytics, ...graphLayout, ...thirdPartyUI,
]);

const boundary = new Set([...pierre]);

const semanticPaths = {
  // d3
  "array-hqvMvHot": "shared/utils/d3-array-helper.tsx",
  "arc-D3MQZVTw": "shared/utils/d3-shape-arc.tsx",
  "defaultLocale-gPb_B8uX": "shared/utils/d3-format-default-locale.tsx",
  "init-B2r4ykR3": "shared/utils/d3-scale-init.tsx",
  "math-BO6C2O78": "shared/utils/d3-shape-math.tsx",
  "min-BVs4UoI0": "shared/utils/d3-array-min.tsx",
  "monotone-DKOUTWfZ": "shared/utils/d3-shape-monotone-curve.tsx",
  "path-BiIEs4Yy": "shared/utils/d3-path.tsx",
  "sankeyLinkHorizontal-DCfEjaVP": "shared/utils/d3-sankey-link-horizontal.tsx",
  "string-CKccV857": "shared/utils/d3-color-string.tsx",
  "invert-D9sJN2p1": "shared/utils/d3-color-invert.tsx",
  "line-DIsP-Yv_": "shared/utils/d3-shape-line.tsx",
  "linear-C3CxBvdt": "shared/utils/d3-scale-linear.tsx",
  "ordinal-jw163_Ud": "shared/utils/d3-scale-ordinal.tsx",
  "pie-ChHHloNp": "shared/utils/d3-shape-pie.tsx",
  "step-K6tEdR0Q": "shared/utils/d3-shape-step-curve.tsx",
  "channel-ykMIcoPi": "shared/utils/d3-color-channel.tsx",
  // lodash
  "isArrayLikeObject-1Hrr5Oll": "shared/utils/lodash-is-array-like-object.tsx",
  "isEmpty-CTfqpukK": "shared/utils/lodash-is-empty.tsx",
  "isEqual-DoHfXEc2": "shared/utils/lodash-is-equal.tsx",
  // npm utils
  "ccount-BaJjvBGW": "shared/utils/ccount.tsx",
  "callback-BhdA_NIt": "shared/utils/p-timeout.tsx",
  // runtime
  "chunk-Cq_f4orQ": "shared/utils/esbuild-runtime-helpers.tsx",
  "chunk-AGHRB4JF-Bxy73eEy": "shared/utils/esbuild-runtime-umd-a.tsx",
  "chunk-AGHRB4JF-DNCNxfKz": "shared/utils/esbuild-runtime-umd-b.tsx",
  "__vite-browser-external-EPeb3y57": "shared/utils/vite-browser-external-shim.tsx",
  // analytics
  "auto-track-CVxnO46V": "shared/utils/segment-auto-track.tsx",
  "browser-BQH2qCja": "shared/utils/segment-analytics-browser.tsx",
  "client-C1mrATqU": "shared/utils/segment-analytics-client.tsx",
  "core-CpC1jq0N": "shared/utils/segment-analytics-core.tsx",
  // graph layout
  "cytoscape-cose-bilkent-3yd98erd": "shared/utils/cytoscape-cose-bilkent.tsx",
  "cytoscape-fcose-CYmUq-SS": "shared/utils/cytoscape-fcose.tsx",
  // third-party UI
  "docx-preview-Mi4H0G1I": "shared/utils/docx-preview.tsx",
  "dist-eWHzKSsV": "shared/utils/react-modal-dist.tsx",
  "index.umd-CqGTwgME": "shared/utils/umd-package-index.tsx",
  // pierre boundaries
  "parsePatchFiles-Dm7PKlLE": "shared/boundaries/parse-patch-files.tsx",
  "store-489E8Cj_": "shared/boundaries/pierre-trees-store.tsx",
  "iconResolver-DrMXO_qJ": "shared/boundaries/pierre-trees-icon-resolver.tsx",
  "score-query-match-DS2pZf_b": "shared/boundaries/pierre-trees-score-query-match.tsx",
};

let changed = 0;
for (const [basename, file] of Object.entries(manifest.files)) {
  if (vendorRuntime.has(basename)) {
    file.organization = file.organization ?? {};
    file.organization.classification = "vendor-runtime";
    const sp = semanticPaths[basename];
    if (sp) {
      file.organization.semanticPath = sp;
      file.organization.domain = sp.split("/")[0];
    }
    changed++;
  } else if (boundary.has(basename)) {
    file.organization = file.organization ?? {};
    file.organization.classification = "boundary";
    const sp = semanticPaths[basename];
    if (sp) {
      file.organization.semanticPath = sp;
      file.organization.domain = "boundaries";
    }
    changed++;
  }
}

for (const [basename, entry] of Object.entries(ledger.files ?? {})) {
  if (vendorRuntime.has(basename)) entry.classification = "vendor-runtime";
  else if (boundary.has(basename)) entry.classification = "boundary";
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2));
console.log(`Reclassified ${changed} chunks`);
