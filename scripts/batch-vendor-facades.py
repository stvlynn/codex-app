#!/usr/bin/env python3
"""Batch-create typed boundary facades for missing vendor/vendor-runtime chunks.

This is part of Phase B of the deep restoration: every IMPORT_MAP entry that
points at a vendor boundary must exist on disk. The script:

1. Reads the manifest and IMPORT_MAP.
2. Finds vendor / vendor-runtime chunks whose `restored` target does not exist.
3. Runs make-facade.ts for each missing chunk.
4. Updates IMPORT_MAP entries with `dependencyBoundary: true` so the gate
   treats them as known terminal boundaries.
5. Writes the updated IMPORT_MAP atomically.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "restored" / "IMPORT_MAP.json"
SKILL_DIR = ROOT / ".agents" / "skills" / "deobfuscate-javascript" / "scripts"
MAKE_FACADE = SKILL_DIR / "make-facade.ts"
REF_DIR = ROOT / "ref" / "webview" / "assets"
RESTORED_DIR = ROOT / "restored"


def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data):
    tmp = path.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    tmp.replace(path)


def find_missing_vendor_chunks(manifest: dict, import_map: dict):
    files = manifest.get("files", {})
    chunks = import_map.get("chunks", {})
    missing = []
    for basename, entry in chunks.items():
        if entry.get("status") != "done":
            continue
        restored = entry.get("restored")
        if not restored:
            continue
        public_path = RESTORED_DIR / restored
        if public_path.exists():
            continue
        info = files.get(basename, {})
        org = info.get("organization", {})
        cls = org.get("classification")
        if cls in ("vendor", "vendor-runtime"):
            missing.append((basename, restored, cls, org.get("domain")))
    return missing


def make_facade(basename: str, restored: str):
    ref_file = REF_DIR / f"{basename}.js"
    if not ref_file.exists():
        return False, f"ref file not found: {ref_file}"
    out_file = RESTORED_DIR / restored
    out_file.parent.mkdir(parents=True, exist_ok=True)
    provenance = f"ref/webview/assets/{basename}.js"
    result = subprocess.run(
        ["bun", str(MAKE_FACADE), str(ref_file), "--out", str(out_file), "--provenance", provenance],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return False, f"exit {result.returncode}: {result.stderr.strip() or result.stdout.strip()}"
    return True, result.stdout.strip()


def main():
    manifest = load_json(MANIFEST_PATH)
    import_map = load_json(IMPORT_MAP_PATH)
    missing = find_missing_vendor_chunks(manifest, import_map)
    if not missing:
        print("No missing vendor chunks to facade.")
        return 0

    print(f"Found {len(missing)} missing vendor/vendor-runtime chunks.")
    ok = 0
    failed = []
    for basename, restored, cls, domain in missing:
        success, msg = make_facade(basename, restored)
        if success:
            ok += 1
            entry = import_map["chunks"][basename]
            entry["dependencyBoundary"] = True
            if not entry.get("vendor"):
                # Infer vendor family from target path for gate recognition.
                lower = restored.lower()
                if "mermaid" in lower:
                    entry["vendor"] = "mermaid"
                elif "lodash" in lower:
                    entry["vendor"] = "lodash"
                elif "d3" in lower:
                    entry["vendor"] = "d3"
                elif "react-colorful" in lower:
                    entry["vendor"] = "react-colorful"
                elif "pdf" in lower:
                    entry["vendor"] = "pdf"
                elif "markdown" in lower:
                    entry["vendor"] = "markdown"
                elif "statsig" in lower:
                    entry["vendor"] = "statsig"
                elif "tanstack-query" in lower or "vscode" in lower:
                    entry["vendor"] = "runtime"
                elif "pierre" in lower:
                    entry["vendor"] = "@pierre/trees"
                else:
                    entry["vendor"] = "runtime"
            print(f"  ✓ {basename} -> {restored}")
        else:
            failed.append((basename, msg))
            print(f"  ✗ {basename}: {msg}")

    save_json(IMPORT_MAP_PATH, import_map)
    print(f"\nDone: {ok} facaded, {len(failed)} failed.")
    if failed:
        print("Failures:")
        for basename, msg in failed:
            print(f"  {basename}: {msg}")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
