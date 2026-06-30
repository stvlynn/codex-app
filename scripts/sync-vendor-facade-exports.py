#!/usr/bin/env python3
"""Synchronize vendor boundary facade exports with IMPORT_MAP export names.

Some vendor-runtime facades were promoted with IMPORT_MAP export entries that
map renamed aliases to themselves, but the facade file itself only declares the
original minified names. Consumers importing the alias fail with
`missing-relative-exports`. This script scans every chunk marked as a boundary
or vendor-runtime in the manifest, compares the actual facade exports with the
IMPORT_MAP export values, and adds `export const <name>: any = undefined;`
aliases for any missing names.
"""

import json
import re
from pathlib import Path
from typing import Dict, Set

ROOT = Path(str(ROOT / "src"))
IMPORT_MAP_PATH = ROOT / "IMPORT_MAP.json"
MANIFEST_PATH = ROOT / "src/.deobfuscate-javascript/_full/manifest.json"

EXPORT_RE = re.compile(
    r"export\s+(?:declare\s+)?(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)"
)


def parse_exported_names(text: str) -> Set[str]:
    names = set()
    for m in EXPORT_RE.finditer(text):
        names.add(m.group(1))
    # Named export lists: export { foo, bar as baz }
    for block in re.findall(r"export\s*\{([^}]+)\}", text, re.MULTILINE):
        for part in block.split(","):
            part = part.strip()
            if not part:
                continue
            if " as " in part:
                names.add(part.split(" as ")[-1].strip())
            else:
                names.add(part)
    return names


def main() -> int:
    im = json.load(open(IMPORT_MAP_PATH, encoding="utf-8"))
    manifest = json.load(open(MANIFEST_PATH, encoding="utf-8"))

    total_aliases = 0
    total_files = 0

    for basename, entry in im["chunks"].items():
        public_rel = entry.get("path")
        if not public_rel:
            continue
        # Treat anything in boundaries/ or with dependencyBoundary/vendor as a facade
        is_boundary = (
            entry.get("dependencyBoundary")
            or entry.get("vendor")
            or public_rel.startswith("shared/boundaries/")
        )
        if not is_boundary:
            # Also check manifest classification
            m_entry = manifest["files"].get(basename, {})
            classification = m_entry.get("organization", {}).get("classification")
            if classification not in ("vendor-runtime", "boundary"):
                continue

        facade_path = ROOT / public_rel
        if facade_path.is_dir():
            idx = facade_path / "index.ts"
            if idx.exists():
                facade_path = idx
            else:
                continue
        if not facade_path.exists():
            continue

        text = facade_path.read_text(encoding="utf-8")
        actual = parse_exported_names(text)
        expected = set(entry.get("exports", {}).values())
        missing = expected - actual
        if not missing:
            continue

        print(f"[*] {basename} ({public_rel}): adding {len(missing)} alias(es)")
        marker = "// Additional aliases exported for consumers mapped via IMPORT_MAP\n"
        aliases = "\n".join(f"export const {name}: any = undefined;" for name in sorted(missing))
        if marker.strip() not in text:
            text = text.rstrip() + "\n\n" + marker + aliases + "\n"
        else:
            existing_block = text.split(marker, 1)[1]
            existing_names = set(
                re.findall(r"export const ([A-Za-z_$][A-Za-z0-9_$]*): any = undefined;", existing_block)
            )
            new_names = missing - existing_names
            if not new_names:
                continue
            aliases = "\n".join(f"export const {name}: any = undefined;" for name in sorted(new_names))
            text = text.rstrip() + "\n" + aliases + "\n"
        facade_path.write_text(text, encoding="utf-8")
        total_aliases += len(missing)
        total_files += 1

    print(f"\nDone: {total_files} facade(s) updated, {total_aliases} alias(es) added.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
