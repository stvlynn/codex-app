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

b = "thread-context-inputs-B6tQCr7t"
new_path = "app/thread-context-inputs/index.ts"
family = "runtime"

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))

# Remove wrong promoted files.
for wrong in ["app/thread-context-inputs/constants.ts", "app/thread-context-inputs/types.ts"]:
    p = RESTORED_DIR / wrong
    if p.exists():
        p.unlink()
        print("removed wrong file:", wrong)

# Reset stages.
info = m["files"][b]
info["stages"] = {
    "extracted": True,
    "renamed": False,
    "polished": False,
    "finalized": False,
    "organized": True,
    "promoted": False,
    "faced": False,
}
info["organization"] = {
    "domain": "app",
    "semanticPath": new_path,
    "classification": "vendor-runtime",
    "recipe": "manual",
    "source": "agent-facade-mispromotion",
}

# Create facade.
out_file = RESTORED_DIR / new_path
out_file.parent.mkdir(parents=True, exist_ok=True)
ref_file = REF_DIR / f"{b}.js"
provenance = f"ref/webview/assets/{b}.js"
result = subprocess.run(
    ["bun", str(MAKE_FACADE), str(ref_file), "--out", str(out_file), "--provenance", provenance],
    capture_output=True,
    text=True,
)
if result.returncode != 0:
    print(f"make-facade failed: {result.stderr.strip() or result.stdout.strip()}")
    raise SystemExit(1)

# Mark all stages done for this interim facade.
info["stages"] = {
    "extracted": True,
    "renamed": True,
    "polished": True,
    "finalized": True,
    "organized": True,
    "promoted": True,
    "faced": False,
}
info["lastUpdated"] = subprocess.run(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"], capture_output=True, text=True).stdout.strip()

# Update IMPORT_MAP.
im["chunks"][b]["path"] = new_path
im["chunks"][b]["vendor"] = family
im["chunks"][b]["dependencyBoundary"] = True
im["chunks"][b]["status"] = "done"

m["updatedAt"] = info["lastUpdated"]
json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
json.dump(im, open(IMPORT_MAP_PATH, "w"), indent=2)
print(f"✓ {b} facaded at {new_path}")
