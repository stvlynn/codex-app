import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "src"
MANIFEST_PATH = ROOT / "src" / ".deobfuscate-javascript" / "_full" / "manifest.json"
IMPORT_MAP_PATH = TARGET / "IMPORT_MAP.json"
CHECKPOINTS_DIR = ROOT / "src" / ".deobfuscate-javascript" / "_full" / "checkpoints"

m = json.load(open(MANIFEST_PATH))
im = json.load(open(IMPORT_MAP_PATH))


def existing_exports(path: Path) -> set:
    src = path.read_text()
    names = set()
    for match in re.finditer(
        r"\bexport\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+([A-Za-z0-9_$]+)",
        src,
    ):
        names.add(match.group(1))
    for match in re.finditer(r"\bexport\s*\{([^}]+)\}", src):
        for part in match.group(1).split(","):
            part = part.strip()
            if not part:
                continue
            if " as " in part:
                names.add(part.split(" as ")[-1].strip())
            else:
                names.add(part)
    if re.search(r"\bexport\s+default\b", src):
        names.add("default")
    return names


IMPORT_RE = re.compile(r"import\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"]")

needed: dict[str, set[str]] = {}
for cp in CHECKPOINTS_DIR.glob("*"):
    src = cp.read_text()
    for names_str, source in IMPORT_RE.findall(src):
        if not source.startswith("./"):
            continue
        base = source[2:].split("/")[0]
        if "-" not in base:
            continue
        info = m["files"].get(base)
        if not info:
            continue
        cls = info.get("organization", {}).get("classification")
        if cls not in ("vendor", "vendor-runtime", "boundary"):
            continue
        entry = im.get("chunks", {}).get(base)
        if not entry or not entry.get("path"):
            continue
        target_path = TARGET / entry["path"]
        if not target_path.exists():
            continue
        exports = existing_exports(target_path)
        for name in names_str.split(","):
            name = name.strip().split(" as ")[0].strip()
            if not name or name in exports:
                continue
            needed.setdefault(base, set()).add(name)

added_total = 0
files_changed = 0
for base in sorted(needed):
    entry = im["chunks"][base]
    target_path = TARGET / entry["path"]
    exports = existing_exports(target_path)
    missing = sorted(needed[base] - exports)
    if not missing:
        continue
    files_changed += 1
    added_total += len(missing)
    lines = [f"export declare const {name}: any;" for name in missing]
    # Append after the existing eslint-disable block / header, just before EOF.
    text = target_path.read_text()
    if not text.endswith("\n"):
        text += "\n"
    text += "\n// Aliases used by consumer checkpoints\n" + "\n".join(lines) + "\n"
    target_path.write_text(text)
    print(f"✓ {base}: +{len(missing)} aliases -> {entry["path"]}")

print(f"\nUpdated {files_changed} vendor boundary files with {added_total} aliases.")
