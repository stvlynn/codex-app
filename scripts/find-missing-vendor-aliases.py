#!/usr/bin/env python3
"""Find import aliases used in frontier checkpoints that are missing from vendor boundary exports."""

import json
import re
from pathlib import Path

ROOT = Path(str(ROOT / "src"))
IMPORT_MAP_PATH = ROOT / "IMPORT_MAP.json"
MANIFEST_PATH = ROOT / "src/.deobfuscate-javascript/_full/manifest.json"

IMPORT_RE = re.compile(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]")


def main():
    im = json.load(open(IMPORT_MAP_PATH, encoding="utf-8"))
    manifest = json.load(open(MANIFEST_PATH, encoding="utf-8"))

    locks_dir = ROOT / ".deobfuscate-javascript/_full/locks"
    locked = set()
    if locks_dir.exists():
        for f in locks_dir.iterdir():
            if f.name.endswith(".promote"):
                locked.add(f.name.replace(".promote", ""))

    ready = []
    for basename, entry in manifest["files"].items():
        if entry.get("kind") != "local":
            continue
        stages = entry.get("stages", {})
        if stages.get("organized") and not stages.get("promoted") and basename not in locked:
            deps = [imp["target"] for imp in entry.get("imports", []) if imp.get("kind") == "local"]
            if all(
                manifest["files"].get(dep, {}).get("stages", {}).get("promoted")
                for dep in deps
            ):
                ready.append(basename)

    missing_by_source = {}
    for basename in ready:
        cp = ROOT / ".deobfuscate-javascript/_full/checkpoints" / f"{basename}.tsx"
        if not cp.exists():
            cp = cp.with_suffix(".ts")
        if not cp.exists():
            continue
        text = cp.read_text(encoding="utf-8")
        for m in IMPORT_RE.finditer(text):
            names = [n.strip().split(" as ")[-1].strip() for n in m.group(1).split(",")]
            source = m.group(2)
            if not source.startswith("."):
                continue
            source_base = source.split("/")[-1].replace(".js", "").replace(".ts", "")
            src_entry = im["chunks"].get(source_base)
            if not src_entry:
                continue
            if src_entry.get("dependencyBoundary") or src_entry.get("vendor"):
                restored = src_entry.get("path")
                if not restored:
                    continue
                exports = set(src_entry.get("exports", {}).values())
                missing = [n for n in names if n not in exports]
                if missing:
                    key = (source_base, restored)
                    if key not in missing_by_source:
                        missing_by_source[key] = {"names": set(), "consumers": []}
                    missing_by_source[key]["names"].update(missing)
                    missing_by_source[key]["consumers"].append(basename)

    for (source_base, restored), info in sorted(missing_by_source.items()):
        consumers = ", ".join(sorted(set(info["consumers"]))[:5])
        if len(info["consumers"]) > 5:
            consumers += f" (+{len(info['consumers']) - 5} more)"
        print(f"{source_base} ({restored}):")
        for name in sorted(info["names"]):
            print(f"  - {name}")
        print(f"  consumers: {consumers}")
        print()


if __name__ == "__main__":
    main()
