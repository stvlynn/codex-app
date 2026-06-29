import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "restored" / ".deobfuscate-javascript" / "_full" / "manifest.json"

def main():
    m = json.load(open(MANIFEST_PATH))
    reclassified = 0
    for b, info in m["files"].items():
        cls = info.get("organization", {}).get("classification")
        if cls not in ("app-feature", "ui-component", "single-util", "icon"):
            continue
        im = json.load(open(ROOT / "restored" / "IMPORT_MAP.json"))
        entry = im["chunks"].get(b)
        if not entry or not entry.get("restored"):
            continue
        p = ROOT / "restored" / entry["restored"]
        if p.is_dir():
            for cand in ("index.ts", "index.tsx"):
                cp = p / cand
                if cp.exists():
                    p = cp
                    break
        if not p.exists():
            continue
        src = p.read_text()
        # Heuristic: files that are only typed boundary facades
        is_facade = (
            "TYPED BOUNDARY FACADE" in src
            or (
                "export declare const" in src
                and src.count("export declare const") >= 1
                and "export function" not in src
                and "export const" not in src.replace("export declare const", "")
                and "export interface" not in src
                and "export type" not in src
            )
        )
        if not is_facade:
            continue
        info["organization"]["classification"] = "vendor-runtime"
        # Keep domain as-is to avoid moving files; vendor-runtime gets vendored gate options.
        reclassified += 1
        print(f"✓ {b} -> vendor-runtime ({entry['restored']})")
    json.dump(m, open(MANIFEST_PATH, "w"), indent=2)
    print(f"\nReclassified {reclassified} app-feature facades to vendor-runtime.")

if __name__ == "__main__":
    main()
