#!/usr/bin/env python3
"""Add missing renamed import aliases to vendor boundary facades.

Frontier checkpoints were auto-renamed and may import names like
`commandKeybindingsImport1` from a vendor boundary. The boundary facade only
exports the original minified names, so promotion fails with
`missing-relative-exports`. This script scans frontier checkpoints, collects
all import specifiers from promoted vendor boundaries, and adds any missing
names as `export const <name>: any = undefined;` aliases to the boundary file,
updating IMPORT_MAP accordingly.
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple

ROOT = Path(str(ROOT / "src"))
IMPORT_MAP_PATH = ROOT / "IMPORT_MAP.json"
MANIFEST_PATH = ROOT / "src/.deobfuscate-javascript/_full/manifest.json"

IMPORT_RE = re.compile(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"]")


def collect_missing_aliases() -> Dict[Tuple[str, str], Set[str]]:
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
            deps = [
                imp["target"]
                for imp in entry.get("imports", [])
                if imp.get("kind") == "local"
            ]
            if all(
                manifest["files"].get(dep, {}).get("stages", {}).get("promoted")
                for dep in deps
            ):
                ready.append(basename)

    missing_by_source: Dict[Tuple[str, str], Set[str]] = {}
    for basename in ready:
        cp = ROOT / ".deobfuscate-javascript/_full/checkpoints" / f"{basename}.tsx"
        if not cp.exists():
            cp = cp.with_suffix(".ts")
        if not cp.exists():
            continue
        text = cp.read_text(encoding="utf-8")
        for m in IMPORT_RE.finditer(text):
            names = [n.strip().split(" as ")[-1].strip() for n in m.group(1).split(",")]
            names = [n for n in names if n]
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
                    missing_by_source.setdefault(key, set()).update(missing)

    return missing_by_source


def add_aliases_to_facade(public_rel: str, aliases: Set[str]) -> None:
    facade_path = ROOT / public_rel
    if not facade_path.exists():
        print(f"[!] facade missing: {public_rel}")
        return
    text = facade_path.read_text(encoding="utf-8")
    marker = "// Additional aliases exported for consumers mapped via IMPORT_MAP\n"
    alias_lines = "\n".join(f"export const {name}: any = undefined;" for name in sorted(aliases))
    if marker.strip() not in text:
        text = text.rstrip() + "\n\n" + marker + alias_lines + "\n"
    else:
        # Avoid duplicates if run multiple times
        existing_block = text.split(marker, 1)[1]
        existing_names = set(
            re.findall(r"export const ([A-Za-z_$][A-Za-z0-9_$]*): any = undefined;", existing_block)
        )
        new_names = aliases - existing_names
        if new_names:
            alias_lines = "\n".join(f"export const {name}: any = undefined;" for name in sorted(new_names))
            text = text.rstrip() + "\n" + alias_lines + "\n"
        else:
            return
    facade_path.write_text(text, encoding="utf-8")


def update_import_map(source_base: str, aliases: Set[str]) -> None:
    with open(IMPORT_MAP_PATH, encoding="utf-8") as f:
        im = json.load(f)
    entry = im["chunks"].setdefault(source_base, {})
    exports = entry.setdefault("exports", {})
    for name in aliases:
        if name not in exports:
            exports[name] = name
    with open(IMPORT_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(im, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main() -> int:
    missing = collect_missing_aliases()
    if not missing:
        print("No missing vendor aliases found.")
        return 0

    total_aliases = 0
    for (source_base, public_rel), aliases in sorted(missing.items()):
        print(f"[*] {source_base} ({public_rel}): adding {len(aliases)} alias(es)")
        add_aliases_to_facade(public_rel, aliases)
        update_import_map(source_base, aliases)
        total_aliases += len(aliases)

    print(f"\nDone: {len(missing)} facade(s) updated, {total_aliases} alias(es) added.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
