import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "src" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "src" / "IMPORT_MAP.json"
MAKE_FACADE = ROOT / ".agents" / "skills" / "deobfuscate-javascript" / "src" / "infrastructure" / "make-facade.ts"
REF_DIR = ROOT / "ref" / "webview" / "assets"
RESTORED_DIR = ROOT / "src"

# Map basename -> (vendor family, unique semantic path under src/)
DISAMBIGUATION = {
    "dist-eWHzKSsV": ("radix-ui", "shared/boundaries/radix-ui/primitive.ts"),
    "dist-8ofUNnGK": ("radix-ui", "shared/boundaries/radix-ui/use-size.ts"),
    "dist-kMWsZQu4": ("radix-ui", "shared/boundaries/radix-ui/arrow.ts"),
    "dist-BLGenw3M": ("cmdk", "shared/boundaries/cmdk/dist.ts"),
    "dist-DvbKegLw": ("radix-ui", "shared/boundaries/radix-ui/context-menu.ts"),
    "dist-uq8yzYFr": ("radix-ui", "shared/boundaries/radix-ui/menu.ts"),
    "dist-hw5CqF55": ("radix-ui", "shared/boundaries/radix-ui/popover.ts"),
}

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

for b, (family, new_path) in DISAMBIGUATION.items():
    if b not in im["chunks"]:
        print("skip (not in import map):", b)
        continue

    old_path = im["chunks"][b].get("path")
    # Remove old facade file if it exists and is different
    if old_path and old_path != new_path:
        old_file = RESTORED_DIR / old_path
        if old_file.exists():
            old_file.unlink()
            print("removed old facade:", old_path)

    # Update manifest organization
    m["files"][b]["organization"] = {
        "domain": "boundaries",
        "semanticPath": new_path,
        "classification": "vendor",
        "recipe": "manual",
        "source": "agent-disambiguate",
    }

    # Update IMPORT_MAP
    im["chunks"][b]["path"] = new_path
    im["chunks"][b]["vendor"] = family
    im["chunks"][b]["dependencyBoundary"] = True

    # Recreate facade
    ref_file = REF_DIR / f"{b}.js"
    out_file = RESTORED_DIR / new_path
    out_file.parent.mkdir(parents=True, exist_ok=True)
    provenance = f"ref/webview/assets/{b}.js"
    result = subprocess.run(
        ["bun", str(MAKE_FACADE), str(ref_file), "--out", str(out_file), "--provenance", provenance],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"  ✗ {b}: {result.stderr.strip() or result.stdout.strip()}")
    else:
        print(f"✓ {b} -> {new_path} (family={family})")

json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)
print("Updated manifest and IMPORT_MAP.")
