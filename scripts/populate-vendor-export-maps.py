import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "restored" / "IMPORT_MAP.json"

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

fixed = 0
for basename, info in m["files"].items():
    cls = info.get("organization", {}).get("classification")
    if cls not in ("vendor", "vendor-runtime", "boundary"):
        continue
    entry = im["chunks"].get(basename)
    if not entry:
        continue
    exports = entry.get("exports") or {}
    if len(exports) > 0:
        continue  # already populated
    manifest_exports = info.get("exports", [])
    new_exports = {}
    for exp in manifest_exports:
        name = exp.get("exported")
        if name:
            new_exports[name] = name
    if new_exports:
        entry["exports"] = new_exports
        fixed += 1
        print(f"✓ {basename}: populated {len(new_exports)} exports")

json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)
print(f"\nFixed {fixed} vendor boundary export maps.")
