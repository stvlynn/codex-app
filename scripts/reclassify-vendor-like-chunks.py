import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "restored" / "IMPORT_MAP.json"

def kebab(s):
    s = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', s)
    s = re.sub(r'[_.]+', '-', s)
    return s.lower().strip('-')

# Basename regex patterns -> (vendor family, semantic path template)
PATTERNS = [
    (r'^diagram-.*', 'mermaid', 'boundaries/mermaid/{base}.ts'),
    (r'^wardleyDiagram-.*', 'mermaid', 'boundaries/mermaid/{base}.ts'),
    (r'^graphlib-.*', 'dagre', 'boundaries/dagre/{base}.ts'),
    (r'^isArrayLikeObject-.*', 'lodash', 'boundaries/lodash/is-array-like-object.ts'),
    (r'^isEmpty-.*', 'lodash', 'boundaries/lodash/is-empty.ts'),
    (r'^workbook-from-markdown-.*', 'mermaid', 'boundaries/mermaid/workbook-from-markdown.ts'),
    (r'^spreadsheet-C5mWVSPz$', 'xlsx', 'boundaries/xlsx/spreadsheet.ts'),
    (r'^chunk-AGHRB4JF-.*', 'esbuild-runtime', 'boundaries/esbuild-runtime/{base}.ts'),
    (r'^chunk-CVBHYZKI-.*', 'esbuild-runtime', 'boundaries/esbuild-runtime/{base}.ts'),
    (r'^chunk-FMBD7UC4-.*', 'esbuild-runtime', 'boundaries/esbuild-runtime/{base}.ts'),
    (r'^chunk-KS23V3DP-.*', 'esbuild-runtime', 'boundaries/esbuild-runtime/{base}.ts'),
    (r'^chunk-YZCP3GAM-.*', 'esbuild-runtime', 'boundaries/esbuild-runtime/{base}.ts'),
    (r'^chunk-Cq_f4orQ$', 'esbuild-runtime', 'boundaries/esbuild-runtime/helpers.ts'),
]

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

reclassified = []
for b, info in sorted(m["files"].items()):
    if info.get("kind") != "local":
        continue
    org = info.get("organization", {})
    if org.get("classification") != "app-feature":
        continue
    for regex, family, path_template in PATTERNS:
        if re.match(regex, b):
            base = kebab(b.split('-')[0] if 'chunk-' not in b else b)
            new_path = path_template.format(base=base)
            # Avoid collisions by appending hash suffix if needed
            if new_path in [x[2] for x in reclassified]:
                parts = b.rsplit('-', 1)
                suffix = kebab(parts[-1]) if len(parts) > 1 else ''
                stem = new_path[:-3]
                new_path = f"{stem}-{suffix}.ts"
            m["files"][b]["organization"] = {
                "domain": "boundaries",
                "semanticPath": new_path,
                "classification": "vendor",
                "recipe": "manual",
                "source": "agent-reclassify",
            }
            im["chunks"][b]["restored"] = new_path
            im["chunks"][b]["vendor"] = family
            im["chunks"][b]["dependencyBoundary"] = True
            reclassified.append((b, family, new_path))
            break

json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)

print(f"Reclassified {len(reclassified)} app-feature chunks to vendor:")
for b, family, new_path in reclassified:
    print(f"  {b} -> {new_path} ({family})")
