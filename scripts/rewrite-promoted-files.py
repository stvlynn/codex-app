import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESTORED_DIR = ROOT / "src"
IMPORT_MAP_PATH = RESTORED_DIR / "IMPORT_MAP.json"

def load_json(path: Path):
    return json.load(open(path))

def target_export_names(entry: dict, file_path: Path) -> set[str]:
    names = set((entry.get("exports") or {}).values())
    if not file_path.exists():
        return names
    src = file_path.read_text()
    for m in re.finditer(
        r"\bexport\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([A-Za-z0-9_$]+)",
        src,
    ):
        names.add(m.group(1))
    for m in re.finditer(r"\bexport\s*\{([^}]+)\}", src):
        for part in m.group(1).split(","):
            part = part.strip()
            if not part:
                continue
            names.add(part.split(" as ")[-1].strip())
    return names

def main():
    im = load_json(IMPORT_MAP_PATH)
    # Build reverse map: public path -> basename
    path_to_basename: dict[str, str] = {}
    for basename, entry in im.get("chunks", {}).items():
        public_path = entry.get("path")
        if public_path:
            path_to_basename[public_path] = basename

    fixed_files = 0
    fixed_imports = 0

    for file_path in RESTORED_DIR.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in (".ts", ".tsx", ".js", ".jsx"):
            continue
        if ".deobfuscate-javascript" in file_path.parts:
            continue
        src = file_path.read_text()
        new_src = src
        changed = False
        for m in re.finditer(
            r'import\s+\{([^}]+)\}\s+from\s+(["\'])([^"\']+)\2',
            src,
        ):
            source = m.group(3)
            if not source.startswith("."):
                continue
            # Resolve source relative to this file to a public path
            from_dir = file_path.parent
            try:
                resolved_abs = (from_dir / source).resolve()
                resolved = resolved_abs.relative_to(RESTORED_DIR.resolve())
            except (ValueError, FileNotFoundError, RuntimeError):
                continue
            # Try exact file, then index.ts, then with .tsx/.ts
            candidates = [str(resolved)]
            base = str(resolved)
            for ext in [".ts", ".tsx", ".js", ".jsx"]:
                candidates.append(base + ext)
            candidates.append(base + "/index.ts")
            candidates.append(base + "/index.tsx")
            basename = None
            for cand in candidates:
                basename = path_to_basename.get(cand)
                if basename:
                    break
            if not basename:
                continue
            entry = im["chunks"][basename]
            exports_map = entry.get("exports") or {}
            target_names = target_export_names(entry, RESTORED_DIR / entry["path"])
            names_str = m.group(1)
            new_names_parts = []
            part_changed = False
            for part in names_str.split(","):
                part = part.strip()
                if not part:
                    continue
                imported = part.split(" as ")[0].strip()
                alias = part.split(" as ")[1].strip() if " as " in part else imported
                if imported in target_names:
                    new_names_parts.append(part)
                    continue
                replacement = exports_map.get(imported)
                if replacement and replacement in target_names:
                    if alias == imported:
                        new_names_parts.append(replacement)
                    else:
                        new_names_parts.append(f"{replacement} as {alias}")
                    part_changed = True
                    fixed_imports += 1
                else:
                    new_names_parts.append(part)
            if part_changed:
                new_names = ", ".join(new_names_parts)
                old_decl = m.group(0)
                new_decl = f'import {{ {new_names} }} from {m.group(2)}{source}{m.group(2)}'
                new_src = new_src.replace(old_decl, new_decl, 1)
                changed = True
        if changed:
            file_path.write_text(new_src)
            fixed_files += 1

    print(f"Rewrote {fixed_imports} imports in {fixed_files} promoted files.")

if __name__ == "__main__":
    main()
