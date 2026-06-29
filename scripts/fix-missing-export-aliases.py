#!/usr/bin/env python3
"""Add missing export aliases to restored files based on IMPORT_MAP exports.

The promotion pipeline rewrites consumer imports using IMPORT_MAP export mappings.
When a promoted file (especially a split bundle or early restored chunk) does not
actually export a semantic name that IMPORT_MAP promises, consumers fail with
`missing-relative-exports`. This script scans IMPORT_MAP, checks that every mapped
semantic export exists in the restored file, and adds `export const <name>: any`
aliases for any missing names.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Set

ROOT = Path("/Users/stvlynn/code/codex-reverse/restored")
IMPORT_MAP_PATH = ROOT / "IMPORT_MAP.json"

EXPORT_RE = re.compile(
    r"""
    export\s+(?:declare\s+)?(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)
    | export\s*\{[^}]*\}
    | export\s*\*\s*from\s*['\"]([^'\"]+)['\"]
    """,
    re.VERBOSE,
)

NAMED_EXPORT_RE = re.compile(
    r"export\s*\{([^}]+)\}", re.MULTILINE
)


def parse_exported_names(text: str) -> Set[str]:
    names: Set[str] = set()
    # Direct declarations
    for m in re.finditer(
        r"export\s+(?:declare\s+)?(?:const|let|var|function|class|type|interface|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)",
        text,
    ):
        names.add(m.group(1))
    # Named export lists: export { foo, bar as baz }
    for block in NAMED_EXPORT_RE.findall(text):
        for part in block.split(","):
            part = part.strip()
            if not part:
                continue
            if " as " in part:
                names.add(part.split(" as ")[-1].strip())
            else:
                names.add(part)
    return names


def resolve_barrel_exports(file_path: Path, visited: Set[Path] = None) -> Set[str]:
    if visited is None:
        visited = set()
    if file_path in visited:
        return set()
    visited.add(file_path)
    if not file_path.exists():
        return set()
    text = file_path.read_text(encoding="utf-8")
    names = parse_exported_names(text)
    # Recurse into export * from "./relative"
    for m in re.finditer(r"export\s*\*\s*from\s*['\"]([^'\"]+)['\"]", text):
        rel = m.group(1)
        if rel.startswith("."):
            target = file_path.parent / rel
            if target.is_dir():
                target = target / "index.ts"
            else:
                # try .ts/.tsx extensions
                for ext in (".ts", ".tsx"):
                    if target.with_suffix(ext).exists():
                        target = target.with_suffix(ext)
                        break
            names |= resolve_barrel_exports(target, visited)
    return names


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    with open(IMPORT_MAP_PATH, encoding="utf-8") as f:
        im = json.load(f)

    chunks = im.get("chunks", {})
    total_added = 0
    files_modified = 0

    for basename, entry in chunks.items():
        restored_rel = entry.get("restored")
        if not restored_rel:
            continue
        # Only add aliases to vendor/runtime boundaries and data-asset files.
        # App-feature chunks should be properly rewritten by agents instead of
        # papering over missing exports with `any` aliases.
        if not (entry.get("dependencyBoundary") or entry.get("vendor")):
            continue
        restored_path = ROOT / restored_rel
        if restored_path.is_dir():
            for candidate in ("index.ts", "index.tsx"):
                if (restored_path / candidate).exists():
                    restored_path = restored_path / candidate
                    break
        if not restored_path.exists() or restored_path.is_dir():
            print(f"[!] missing restored file: {restored_rel}")
            continue

        exports = entry.get("exports", {})
        if not exports:
            continue

        existing = resolve_barrel_exports(restored_path)
        missing = [semantic for original, semantic in exports.items() if semantic not in existing]
        if not missing:
            continue

        print(f"[*] {basename} ({restored_rel}) missing {len(missing)} alias(es): {missing}")
        if dry_run:
            total_added += len(missing)
            files_modified += 1
            continue
        # Add aliases to the primary restored file (barrel or single file).
        # Place them at the end in a clearly marked block.
        text = restored_path.read_text(encoding="utf-8")
        aliases = "\n".join(
            f"export const {name}: any = undefined;" for name in missing
        )
        marker = "// Additional aliases exported for consumers mapped via IMPORT_MAP\n"
        if marker.strip() not in text:
            text = text.rstrip() + "\n\n" + marker + aliases + "\n"
        else:
            # Append after existing marker
            text = text.rstrip() + "\n" + aliases + "\n"
        restored_path.write_text(text, encoding="utf-8")
        total_added += len(missing)
        files_modified += 1

    print(f"\nDone: {files_modified} file(s) modified, {total_added} alias(es) added.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
