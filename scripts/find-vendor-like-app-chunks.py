import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "src" / ".deobfuscate-javascript" / "_full" / "manifest.json"

m = json.load(open(MANIFEST_PATH))

vendor_prefixes = [
    "diagram-","ishikawadiagram","kanban-definition","venndiagram","wardleydiagram",
    "treemap-","gitgraph-","packet-","pie-","info-","radar-","architecture-","treeview-",
    "workbook-from-markdown","chunk-","_base","reduce-","flatten-","main-","clone-",
    "isarray","isempty","basefor","baseeach","graphlib","dagre-","mermaid-","d3-",
    "pdf-","markdown-to-search-text","statsig-","react-colorful","sanitize-url",
    "floating-ui","clsx-","zod-","jsx-runtime","dist-","src-","document-BvkTVHtx",
    "metric-helpers-","spreadsheet-"
]

matches = []
for b, info in sorted(m["files"].items()):
    if info.get("kind") != "local":
        continue
    org = info.get("organization", {})
    if org.get("classification") != "app-feature":
        continue
    low = b.lower()
    if any(low.startswith(p) or p in low for p in vendor_prefixes):
        matches.append((b, org.get("semanticPath", "?")))

print(f"Found {len(matches)} app-feature chunks that look like vendor/data:")
for b, p in matches[:60]:
    print(b, "|", p)
if len(matches) > 60:
    print(f"... and {len(matches) - 60} more")
