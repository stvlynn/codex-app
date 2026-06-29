import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "restored"
MANIFEST = json.load(open(TARGET / ".deobfuscate-javascript/_full/manifest.json"))
IM = json.load(open(TARGET / "IMPORT_MAP.json"))

def get_class(b):
    info = MANIFEST["files"].get(b, {})
    return info.get("organization", {}).get("classification")

def target_exports(restored_path):
    p = TARGET / restored_path
    if p.is_dir():
        for name in ("index.ts", "index.tsx", "index.js", "index.jsx"):
            cand = p / name
            if cand.exists():
                p = cand
                break
    if not p.exists() or p.is_dir():
        return set()
    src = p.read_text()
    names = set()
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
            if " as " in part:
                names.add(part.split(" as ")[-1].strip())
            else:
                names.add(part)
    if re.search(r"\bexport\s+default\b", src):
        names.add("default")
    return names

IMPORT_RE = re.compile(
    r"import\s+\{([^}]+)\}\s+from\s+(['\"])([^'\"]+)\2"
)

fixed_files = 0
fixed_imports = 0
for cp in sorted((TARGET / ".deobfuscate-javascript/_full/checkpoints").glob("*")):
    src = cp.read_text()
    new_src = src
    for names_str, quote, source in IMPORT_RE.findall(src):
        if not source.startswith("./"):
            continue
        base = source[2:].split("/")[0]
        if "-" not in base:
            continue
        cls = get_class(base)
        if cls not in ("app-feature", "ui-component"):
            continue
        entry = IM.get("chunks", {}).get(base)
        if not entry or entry.get("status") != "done" or not entry.get("restored"):
            continue
        exports = entry.get("exports", {})
        if not exports:
            continue
        t_exports = target_exports(entry["restored"])
        # Build reverse map: lowercase original -> semantic
        rev = {k.lower(): v for k, v in exports.items()}
        replacements = {}
        for name in names_str.split(","):
            name = name.strip()
            if not name:
                continue
            # support "A as B"
            parts = [p.strip() for p in name.split(" as ")]
            imported = parts[0]
            alias = parts[1] if len(parts) > 1 else None
            if imported in t_exports:
                continue
            # try exact match in export map values
            semantic = None
            if imported in exports.values():
                semantic = imported
            else:
                # suffix match (case-insensitive) on original keys
                low = imported.lower()
                for orig, sem in exports.items():
                    if low.endswith(orig.lower()) and sem in t_exports:
                        semantic = sem
                        break
            if not semantic:
                continue
            if alias:
                replacements[name] = f"{semantic} as {alias}"
            else:
                replacements[name] = semantic
        if not replacements:
            continue
        # rebuild the names block preserving order/spacing roughly
        new_names = names_str
        for old, new in replacements.items():
            # replace whole specifier (handle comma spacing)
            pat = r"(^|,)\s*" + re.escape(old) + r"\s*(?=,|$)"
            new_names = re.sub(pat, lambda m: (m.group(1) or "") + new, new_names)
        # remove leading/trailing comma artifacts
        new_names = re.sub(r"^,\s*", "", new_names)
        new_names = re.sub(r"\s*,$", "", new_names)
        old_decl = f"import {{{names_str}}} from {quote}{source}{quote}"
        new_decl = f"import {{{new_names}}} from {quote}{source}{quote}"
        new_src = new_src.replace(old_decl, new_decl, 1)
        fixed_imports += len(replacements)
    if new_src != src:
        cp.write_text(new_src)
        fixed_files += 1

print(f"Rewrote {fixed_imports} imports in {fixed_files} checkpoint files.")
