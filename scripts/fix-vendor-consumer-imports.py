import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "restored" / "IMPORT_MAP.json"
CHECKPOINTS_DIR = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "checkpoints"

def load_json(path: Path):
    return json.load(open(path))

def save_json(path: Path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def exported_tokens(manifest_entry: dict) -> list[str]:
    return [e["exported"] for e in manifest_entry.get("exports", []) if e.get("exported")]

def target_exports_set(import_map_entry: dict, promoted_src: str | None) -> set[str]:
    names = set((import_map_entry.get("exports") or {}).values())
    if promoted_src:
        for m in re.finditer(
            r"\bexport\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([A-Za-z0-9_$]+)",
            promoted_src,
        ):
            names.add(m.group(1))
        for m in re.finditer(r"\bexport\s*\{([^}]+)\}", promoted_src):
            for part in m.group(1).split(","):
                part = part.strip()
                if not part:
                    continue
                names.add(part.split(" as ")[-1].strip())
    return names

def is_facade(manifest_entry: dict, restored_path: str) -> bool:
    cls = manifest_entry.get("organization", {}).get("classification")
    if cls in ("vendor", "vendor-runtime", "boundary"):
        return True
    # thread-context-inputs was hand-facaded under app/
    if restored_path.endswith("thread-context-inputs/index.ts"):
        return True
    return False

def find_suffix_token(name: str, tokens: list[str]) -> str | None:
    # case-sensitive exact suffix
    for token in tokens:
        if name.endswith(token):
            return token
    # case-insensitive fallback, prefer longest match
    low = name.lower()
    matches = []
    for token in tokens:
        if low.endswith(token.lower()):
            matches.append(token)
    if matches:
        return max(matches, key=len)
    return None

def add_alias_to_file(file_path: Path, alias: str):
    src = file_path.read_text()
    if re.search(rf"\bexport\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+{re.escape(alias)}\b", src):
        return False
    # Insert before the final eslint-enable if present, else append at end.
    block = f"export {'declare ' if 'export declare const' in src else ''}const {alias}: any"
    if "export declare const" in src:
        block += ";\n"
    else:
        block += " = undefined;\n"
    if "/* eslint-enable @typescript-eslint/no-explicit-any */" in src:
        src = src.replace(
            "/* eslint-enable @typescript-eslint/no-explicit-any */",
            f"{block}/* eslint-enable @typescript-eslint/no-explicit-any */",
        )
    else:
        src = src.rstrip() + "\n" + block
    file_path.write_text(src)
    return True

def main():
    m = load_json(MANIFEST_PATH)
    im = load_json(IMPORT_MAP_PATH)

    # Collect imported names per producer from checkpoints
    producer_imports: dict[str, set[str]] = {}
    for cp in CHECKPOINTS_DIR.glob("*.tsx"):
        src = cp.read_text()
        for mch in re.finditer(
            r'import\s+\{([^}]+)\}\s+from\s+["\']\.\/([A-Za-z0-9_-]+?)(?:\.js)?["\']',
            src,
        ):
            names_str = mch.group(1)
            basename = mch.group(2)
            names = set()
            for part in names_str.split(","):
                part = part.strip()
                if not part:
                    continue
                names.add(part.split(" as ")[0].strip())
            producer_imports.setdefault(basename, set()).update(names)

    fixed_entries = 0
    added_aliases = 0
    added_mappings = 0

    for basename, imported_names in producer_imports.items():
        manifest_entry = m["files"].get(basename)
        if not manifest_entry:
            continue
        cls = manifest_entry.get("organization", {}).get("classification")
        # Only touch vendor/runtime/boundary facades and a few known runtime modules
        # that were promoted with aliases.
        RUNTIME_ALIAS_MODULES = {
            "persisted-signal-Djfqb095",
            "thread-context-inputs-B6tQCr7t",
        }
        if cls not in ("vendor", "vendor-runtime", "boundary") and basename not in RUNTIME_ALIAS_MODULES:
            continue
        im_entry = im["chunks"].get(basename)
        if not im_entry or not im_entry.get("restored"):
            continue
        restored_rel = im_entry["restored"]
        restored_path = ROOT / "restored" / restored_rel
        # For directory entries, look at index file
        if restored_path.is_dir():
            for cand in ("index.ts", "index.tsx", "index.js", "index.jsx"):
                cand_path = restored_path / cand
                if cand_path.exists():
                    restored_path = cand_path
                    break
        if not restored_path.exists():
            continue
        promoted_src = restored_path.read_text()
        tokens = exported_tokens(manifest_entry)
        exports_map = dict(im_entry.get("exports") or {})
        target_set = target_exports_set(im_entry, promoted_src)

        facade = is_facade(manifest_entry, restored_rel) or basename not in RUNTIME_ALIAS_MODULES
        new_mappings = {}

        for name in imported_names:
            if not name or name in target_set:
                # Already available; ensure identity mapping if not present
                if name and name not in exports_map:
                    new_mappings[name] = name
                continue
            if facade:
                token = find_suffix_token(name, tokens)
                if token:
                    semantic = exports_map.get(token, token)
                    new_mappings[name] = semantic
                    continue
            # Fallback: add the alias to the promoted file and map identity
            if add_alias_to_file(restored_path, name):
                added_aliases += 1
                print(f"  + {basename}: added alias {name} in {restored_rel}")
            new_mappings[name] = name

        if new_mappings:
            exports_map.update(new_mappings)
            im_entry["exports"] = exports_map
            fixed_entries += 1
            added_mappings += len(new_mappings)
            print(f"✓ {basename}: added {len(new_mappings)} alias mappings")

    save_json(IMPORT_MAP_PATH, im)
    print(
        f"\nFixed {fixed_entries} entries, added {added_mappings} mappings, added {added_aliases} file aliases."
    )

if __name__ == "__main__":
    main()
