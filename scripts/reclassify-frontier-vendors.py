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

# Basename -> (vendor family, semantic path relative to restored/)
RECLASSIFY = {
    "graphlib-Dk1ocXNC": ("dagre", "boundaries/dagre/graphlib.ts"),
    "ishikawaDiagram-UXIWVN3A-C0OZiin8": ("mermaid", "boundaries/mermaid/ishikawa-diagram.ts"),
    "kanban-definition-6JOO6SKY-cHI15BWA": ("mermaid", "boundaries/mermaid/kanban-definition.ts"),
    "vennDiagram-DHZGUBPP-DQ5AHg0F": ("mermaid", "boundaries/mermaid/venn-diagram.ts"),
    "kanban-definition-3W4ZIXB7-DvB9N6my": ("mermaid", "boundaries/mermaid/kanban-definition-v2.ts"),
    "main-BDm-p1LA": ("lodash", "boundaries/lodash/main.ts"),
}

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

for b, (family, new_path) in RECLASSIFY.items():
    if b not in im["chunks"]:
        print("skip (not in import map):", b)
        continue
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
    print(f"✓ {b} -> {new_path} (family={family})")

json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)
print("Updated manifest and IMPORT_MAP.")
