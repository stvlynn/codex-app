import json
import os
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "src" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "src" / "IMPORT_MAP.json"
MAKE_FACADE = ROOT / ".agents" / "skills" / "deobfuscate-javascript" / "scripts" / "make-facade.ts"
REF_DIR = ROOT / "ref" / "webview" / "assets"
RESTORED_DIR = ROOT / "src"

STAGES = ["extracted", "renamed", "polished", "finalized", "organized", "promoted"]

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

# Find all local vendor/vendor-runtime/boundary chunks.
vendor_chunks = []
for basename, entry in im.get("chunks", {}).items():
    if entry.get("status") != "done":
        continue
    restored = entry.get("path")
    if not restored:
        continue
    info = m["files"].get(basename, {})
    org = info.get("organization", {})
    cls = org.get("classification")
    if cls in ("vendor", "vendor-runtime", "boundary"):
        vendor_chunks.append((basename, restored, cls, entry.get("vendor", "runtime")))

missing = [(b, r, c, f) for b, r, c, f in vendor_chunks if not (RESTORED_DIR / r).exists()]
already_present = [(b, r, c, f) for b, r, c, f in vendor_chunks if (RESTORED_DIR / r).exists()]

print(f"Found {len(vendor_chunks)} vendor/vendor-runtime/boundary chunks: {len(missing)} missing facades, {len(already_present)} already on disk.")

for basename, restored, cls, family in missing + already_present:
    out_file = RESTORED_DIR / restored
    if not out_file.exists():
        ref_file = REF_DIR / f"{basename}.js"
        if not ref_file.exists():
            print(f"  ✗ {basename}: ref file not found")
            continue
        out_file.parent.mkdir(parents=True, exist_ok=True)
        provenance = f"ref/webview/assets/{basename}.js"
        result = subprocess.run(
            ["bun", str(MAKE_FACADE), str(ref_file), "--out", str(out_file), "--provenance", provenance],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print(f"  ✗ {basename}: make-facade failed: {result.stderr.strip() or result.stdout.strip()}")
            continue

    # Mark all ledger stages done for terminal vendor boundaries.
    info = m["files"][basename]
    if "stages" not in info:
        info["stages"] = {}
    for stage in STAGES:
        info["stages"][stage] = True
    info["lastUpdated"] = subprocess.run(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], capture_output=True, text=True).stdout.strip()

    # Ensure IMPORT_MAP entry is consistent.
    im["chunks"][basename]["status"] = "done"
    im["chunks"][basename]["dependencyBoundary"] = True
    if not im["chunks"][basename].get("vendor"):
        im["chunks"][basename]["vendor"] = family

    print(f"✓ {basename} -> {restored}")

m["updatedAt"] = subprocess.run(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], capture_output=True, text=True).stdout.strip()
json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)
print(f"\nDone: ensured {len(vendor_chunks)} vendor boundaries are facaded and marked promoted.")
