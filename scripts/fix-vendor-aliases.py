import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = ROOT / "restored" / "IMPORT_MAP.json"
CHECKPOINTS_DIR = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "checkpoints"
RESTORED_DIR = ROOT / "restored"

def load_json(path):
    return json.load(open(path))

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def exported_names(src: str) -> set[str]:
    names = set()
    for m in re.finditer(r"\bexport\s+declare\s+const\s+([A-Za-z0-9_$]+)\b", src):
        names.add(m.group(1))
    for m in re.finditer(r"\bexport\s+\{\s*([^}]+)\s*\}", src):
        for part in m.group(1).split(","):
            part = part.strip()
            if not part:
                continue
            if " as " in part:
                names.add(part.split(" as ")[1].strip())
            else:
                names.add(part)
    for m in re.finditer(r"\bexport\s+const\s+([A-Za-z0-9_$]+)\b", src):
        names.add(m.group(1))
    return names

def is_vendor(manifest_entry: dict) -> bool:
    cls = manifest_entry.get("organization", {}).get("classification")
    return cls in ("vendor", "vendor-runtime", "boundary")

def main():
    m = load_json(MANIFEST_PATH)
    im = load_json(IMPORT_MAP_PATH)

    # Collect imported aliases from checkpoints per producer
    producer_aliases: dict[str, set[str]] = {}
    for cp in CHECKPOINTS_DIR.glob("*"):
        if cp.suffix not in (".tsx", ".ts"):
            continue
        src = cp.read_text()
        for mch in re.finditer(
            r'import\s+\{([^}]+)\}\s+from\s+["\']\.\/([A-Za-z0-9_-]+?)(?:\.js)?["\']',
            src,
        ):
            names_str = mch.group(1)
            basename = mch.group(2)
            manifest_entry = m["files"].get(basename)
            if not manifest_entry or not is_vendor(manifest_entry):
                continue
            names = set()
            for part in names_str.split(","):
                part = part.strip()
                if not part:
                    continue
                names.add(part.split(" as ")[0].strip())
            producer_aliases.setdefault(basename, set()).update(names)

    fixed_files = 0
    added_aliases = 0
    updated_maps = 0

    for basename, aliases in producer_aliases.items():
        manifest_entry = m["files"].get(basename)
        if not manifest_entry or not is_vendor(manifest_entry):
            continue
        im_entry = im["chunks"].get(basename)
        if not im_entry or not im_entry.get("restored"):
            continue
        restored_rel = im_entry["restored"]
        restored_path = RESTORED_DIR / restored_rel
        if restored_path.is_dir():
            for cand in ("index.ts", "index.tsx"):
                cand_path = restored_path / cand
                if cand_path.exists():
                    restored_path = cand_path
                    break
        if not restored_path.exists():
            continue
        src = restored_path.read_text()
        existing = exported_names(src)
        original_tokens = {e["exported"] for e in manifest_entry.get("exports", []) if e.get("exported")}

        # Determine missing aliases that are not original tokens
        missing = sorted(aliases - existing - original_tokens)
        if missing:
            block = "\n".join(f"export declare const {alias}: any;" for alias in missing)
            if "/* eslint-enable @typescript-eslint/no-explicit-any */" in src:
                src = src.replace(
                    "/* eslint-enable @typescript-eslint/no-explicit-any */",
                    f"{block}\n/* eslint-enable @typescript-eslint/no-explicit-any */",
                )
            else:
                src = src.rstrip() + "\n\n// Aliases used by consumer checkpoints\n" + block + "\n"
            restored_path.write_text(src)
            fixed_files += 1
            added_aliases += len(missing)
            print(f"  + {basename}: added {len(missing)} aliases to {restored_rel}")

        # Update IMPORT_MAP exports: identity for aliases, keep original token mappings
        exports_map = dict(im_entry.get("exports") or {})
        changed = False
        for alias in sorted(aliases):
            if alias in original_tokens:
                # Original token should map to itself
                if exports_map.get(alias) != alias:
                    exports_map[alias] = alias
                    changed = True
            else:
                # Alias maps to itself (identity) so local binding is preserved
                if exports_map.get(alias) != alias:
                    exports_map[alias] = alias
                    changed = True
        # Also ensure all existing alias exports in file are identity
        for name in sorted(existing):
            if name not in original_tokens:
                if exports_map.get(name) != name:
                    exports_map[name] = name
                    changed = True
        if changed:
            im_entry["exports"] = exports_map
            updated_maps += 1
            print(f"✓ {basename}: updated export map")

    save_json(IMPORT_MAP_PATH, im)
    print(f"\nFixed {fixed_files} files, added {added_aliases} aliases, updated {updated_maps} export maps.")

if __name__ == "__main__":
    main()
