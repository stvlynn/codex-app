import json
import re
from pathlib import Path
from collections import Counter

ROOT = Path("/Users/stvlynn/code/codex-reverse")
MANIFEST_PATH = ROOT / "restored/.deobfuscate-javascript/_full/manifest.json"
PLAN_PATH = ROOT / "restored/.deobfuscate-javascript/_full/organize-plan.json"
IMPORT_MAP_PATH = ROOT / "restored/IMPORT_MAP.json"


def kebab(s: str) -> str:
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", s)
    s = re.sub(r"[_.]+", "-", s)
    return s.lower().strip("-")


def strip_hash(basename: str) -> str:
    return re.sub(r"-[A-Za-z0-9_-]{8,12}$", "", basename)


def is_app_chunk(basename: str) -> bool:
    lower = basename.lower()
    app_prefixes = [
        "app-main", "app-shell", "app-prefetch", "app-preloader", "app-root",
        "app-server", "appgen", "automation", "automations", "browser-sidebar",
        "browser-use", "composer", "conversation", "local-conversation", "mcp",
        "native-app", "native-apps", "pets-settings", "plugin", "plugins",
        "project", "projects", "review", "settings", "thread",
    ]
    if any(lower.startswith(p) for p in app_prefixes):
        return True
    if re.search(r"(?:^|[-_])(?:page|panel|view|dialog)(?:[-_]|$)", lower):
        return True
    return False


def app_domain(basename: str) -> str:
    lower = basename.lower()
    if lower.startswith("app-main") or lower.startswith("app-server") or lower.startswith("app-prefetch") or lower.startswith("app-preloader"):
        return "app"
    if lower.startswith("app-shell") or lower.startswith("browser-sidebar") or lower.startswith("browser-use") or lower.startswith("hotkey-window") or lower.startswith("window-"):
        return "app-shell"
    if lower.startswith("composer"):
        return "composer"
    if lower.startswith("thread"):
        return "threads"
    if lower.startswith("conversation") or lower.startswith("local-conversation"):
        return "conversations"
    if lower.startswith("settings") or lower.startswith("pets-settings") or lower.startswith("cloud-environments") or lower.startswith("local-environments"):
        return "settings"
    if lower.startswith("review"):
        return "review"
    if lower.startswith("mcp"):
        return "mcp"
    if lower.startswith("plugin") or lower.startswith("plugins"):
        return "plugins"
    if lower.startswith("appgen"):
        return "appgen"
    if lower.startswith("automation") or lower.startswith("automations"):
        return "automations"
    if lower.startswith("project") or lower.startswith("projects"):
        return "app"
    if lower.startswith("remote-connections"):
        return "remote-connections"
    if lower.startswith("worktree") or lower.startswith("worktrees"):
        return "worktrees"
    if lower.startswith("diff"):
        return "diff"
    if lower.startswith("pull-request"):
        return "pull-request"
    if lower.startswith(("onboarding", "codex-mobile", "avatar-overlay", "feedback", "global-dictation",
                          "image-preview", "loading", "new-thread", "new-chat", "notebook-preview",
                          "open-", "pdf-preview", "pending-request", "plan-summary", "pricing-plan",
                          "select-workspace", "setup-codex", "skills", "summary-panel", "upgrade-plan")):
        return "app"
    return "app"


LOOKUP_NAMES = {
    "_baseeach": "base-each",
    "_basefor": "base-for",
    "_baseorderby": "base-order-by",
    "_basepickby": "base-pick-by",
    "_baseuniq": "base-uniq",
    "_defineproperty": "define-property",
    "isempty": "is-empty",
    "isarraylikeobject": "is-array-like-object",
    "isequal": "is-equal",
    "sumby": "sum-by",
    "zipobject": "zip-object",
}


def is_lodash_chunk(basename: str, note: str = "") -> bool:
    lower = basename.lower()
    stem = strip_hash(lower)
    text = f"{stem} {note.lower()}"
    if "lodash" in text:
        return True
    if stem.startswith("_base") or stem.startswith("_define"):
        return True
    lodash_stems = [
        "clone", "flatten", "is-empty", "is-equal", "is-array-like-object",
        "merge", "reduce", "sort-by", "sum-by", "union", "uniq", "zip-object",
    ]
    if any(stem == s or stem.startswith(f"{s}-") for s in lodash_stems):
        return True
    return False


def is_mermaid_chunk(basename: str, note: str = "") -> bool:
    lower = basename.lower()
    text = f"{lower} {note.lower()}"
    if "mermaid" in text:
        return True
    diagram_stems = [
        "c4diagram", "flowdiagram", "erdiagram", "gitgraphdiagram", "ganttdiagram",
        "infodiagram", "piediagram", "quadrantdiagram", "xychartdiagram",
        "requirementdiagram", "sequencediagram", "classdiagram", "blockdiagram",
        "architecturediagram", "statediagram", "journeydiagram", "mindmap",
        "timeline", "gitgraph", "sankey",
    ]
    stem = strip_hash(lower)
    return any(stem.startswith(d) for d in diagram_stems)


def is_d3_chunk(basename: str, note: str = "") -> bool:
    lower = basename.lower()
    stem = strip_hash(lower)
    text = f"{stem} {note.lower()}"
    if "d3" in text:
        return True
    d3_stems = ["arc", "line", "treemap", "tableau10", "cube", "sankey", "ribbon"]
    return any(stem == s or stem.startswith(f"{s}-") for s in d3_stems)


def is_framer_motion_chunk(basename: str, note: str = "") -> bool:
    stem = strip_hash(basename.lower())
    text = f"{stem} {note.lower()}"
    return "framer" in text or "motion" in text


def is_pierre_chunk(basename: str, note: str = "") -> bool:
    text = f"{basename.lower()} {note.lower()}"
    return ("pierre" in text or
            "file-tree" in text or
            "file-diff" in text or
            "parsepatchfiles" in text or
            "parse-patch" in text or
            basename.lower().startswith(("iconresolver", "score-query-match", "store-")))


def vendor_subfolder(basename: str, note: str) -> str | None:
    lower = basename.lower()
    note_lower = note.lower()
    if is_lodash_chunk(basename, note):
        return "lodash"
    if is_mermaid_chunk(basename, note):
        return "mermaid"
    if is_d3_chunk(basename, note):
        return "d3"
    if is_framer_motion_chunk(basename, note):
        return "framer-motion"
    if "dnd" in lower or "dnd-kit" in note_lower:
        return "dnd-kit"
    if "iconify" in note_lower:
        return "iconify"
    if "hast-util" in note_lower or "hast" in lower:
        return "hast-util"
    if "mdast-util" in note_lower or "mdast" in lower:
        return "mdast-util"
    if "segment" in note_lower or basename.lower().startswith(("client-", "middleware-")):
        return "segment-analytics"
    if "statsig" in note_lower:
        return "statsig"
    if "tanstack" in note_lower or lower.startswith(("usequeries", "usequery")):
        return "tanstack-query"
    if "react-router" in note_lower:
        return None  # flat
    if "vscode" in note_lower:
        return None  # flat
    if "zod" in note_lower or lower == "src":
        return None  # flat
    if "protobufjs" in note_lower or lower.startswith("presentation-"):
        return "protobufjs"
    if "stylis" in note_lower or lower.startswith("serializer-"):
        return "stylis"
    if "sanitize-url" in note_lower:
        return "sanitize-url"
    if "react-colorful" in note_lower:
        return "react-colorful"
    if "codemirror" in note_lower:
        return "codemirror"
    if "prosemirror" in note_lower:
        return "prosemirror"
    if "xterm" in note_lower:
        return "xterm"
    if "rrule" in note_lower:
        return "rrule"
    if is_pierre_chunk(basename, note):
        return "pierre"
    return None


def _has_prefix(basename: str, prefix: str) -> bool:
    return basename == prefix or basename.startswith(f"{prefix}-")


def is_vendor_chunk(basename: str, note: str = "") -> bool:
    lower = basename.lower()
    vendor_prefixes = [
        "react", "lodash", "framer-motion", "motion", "dnd-kit", "radix",
        "mermaid", "segment", "tanstack", "shiki", "zustand", "intl-messageformat",
        "stylis", "protobufjs", "pdfjs", "dagre", "d3", "iconify", "hast-util",
        "mdast-util", "markdown", "app-scope", "src", "statsig", "vscode-api", "zod",
        "codemirror", "prosemirror", "xterm", "rrule", "sanitize-url", "react-colorful",
    ]
    if any(_has_prefix(lower, p) for p in vendor_prefixes):
        return True
    if is_lodash_chunk(basename, note) or is_mermaid_chunk(basename, note) or is_d3_chunk(basename, note):
        return True
    if is_pierre_chunk(basename, note):
        return True
    if lower.startswith(("dist-", "esm-", "lib-", "index.umd-", "client-", "middleware-",
                          "serializer-", "presentation-", "single-value-", "reduced-motion-",
                          "modifiers.esm-")):
        return True
    return False


def is_icon_chunk(basename: str) -> bool:
    lower = basename.lower()
    return lower.endswith("-icon") or "-icon-" in lower


LOCALE_CODES = {
    "am", "ar", "bg", "bn", "bs", "ca", "cs", "da", "de", "el", "en",
    "es", "et", "fa", "fi", "fr", "gu", "he", "hi", "hr", "hu", "hy",
    "id", "is", "it", "ja", "ka", "kk", "kn", "ko", "lt", "lv", "mk",
    "ml", "mn", "mr", "ms", "my", "nb", "nl", "pa", "pl", "pt", "ro",
    "ru", "sk", "sl", "so", "sq", "sr", "sv", "sw", "ta", "te", "th",
    "tl", "tr", "uk", "ur", "vi", "zh",
}


def is_data_asset(basename: str) -> bool:
    lower = basename.lower()
    stem = strip_hash(lower)
    # Hooks/contexts are app code, not data assets.
    if stem.startswith("use-"):
        return False
    parts = stem.split("-")
    # Locale codes are at most two parts: lang or lang-region (e.g. bg-bg, es-419, zh-cn).
    if len(parts) <= 2 and parts[0] in LOCALE_CODES:
        return True
    if stem.endswith(("-light", "-dark", "-theme")) or stem == "themes":
        return True
    if "animation" in stem or stem == "animations":
        return True
    return False


def data_domain(basename: str) -> str:
    lower = basename.lower()
    stem = strip_hash(lower)
    parts = stem.split("-")
    if len(parts) <= 2 and parts[0] in LOCALE_CODES:
        return "locales"
    if stem.endswith(("-light", "-dark", "-theme")) or stem == "themes":
        return "themes"
    return "animations"


def ext_for(basename: str, classification: str, domain: str) -> str:
    lower = basename.lower()
    if domain == "icons" or "icon" in lower:
        return "tsx"
    if classification in ("app-feature", "ui-component"):
        if any(x in lower for x in ["popover", "panel", "page", "view", "dialog", "button", "alert", "spinner", "avatar", "badge", "checkbox", "dropdown", "tooltip"]):
            return "tsx"
    return "ts"


def semantic_path(basename: str, domain: str, classification: str, note: str = "") -> str:
    stem = strip_hash(basename)
    kb = kebab(stem)

    # Critical special cases
    if basename == "app-scope-CWE-zIhQ":
        return "boundaries/app-scope.ts"
    if basename == "index-4bSY0Qgs":
        return "boundaries/index.tsx"
    if basename == "modulepreload-polyfill-Cf3xff8G":
        return "boundaries/modulepreload-polyfill.ts"

    ext = ext_for(basename, classification, domain)

    # Vendor subdirectories
    if domain == "boundaries" and classification in ("vendor", "vendor-runtime", "boundary"):
        lower = stem.lower()
        sub = vendor_subfolder(basename, note)
        if sub:
            return f"boundaries/{sub}/{kb}.{ext}"
        if lower.startswith("react-router"):
            return "boundaries/react-router-dom.ts"
        if lower.startswith("tanstack") or lower.startswith("usequeries") or lower.startswith("usequery"):
            return f"boundaries/tanstack-query/{kb}.ts"
        if lower.startswith("segment") or lower == "client":
            return "boundaries/segment-analytics-client.ts"
        if lower.startswith("statsig"):
            return f"boundaries/statsig/{kb}.ts"
        if lower.startswith("vscode"):
            return "boundaries/vscode-api.ts"
        if lower.startswith("zod") or lower == "src":
            return f"boundaries/{kb}.ts"
        return f"boundaries/{kb}.{ext}"

    if domain == "icons":
        return f"icons/{kb}.tsx"
    if domain == "locales":
        return f"locales/{kb}.ts"
    if domain == "themes":
        return f"themes/{kb}.ts"
    if domain == "animations":
        return f"animations/{kb}.ts"

    return f"{domain}/{kb}.{ext}"


def classify_special_cases(basename: str, im_entry: dict):
    """Hard overrides for chunks whose identity is known regardless of plan/import hints."""
    lower = basename.lower()
    note_lower = (im_entry.get("note", "") if im_entry else "").lower()

    if basename == "app-scope-CWE-zIhQ":
        return "boundaries", "vendor-runtime", True
    if basename == "index-4bSY0Qgs":
        return "boundaries", "vendor-runtime", True
    if basename == "modulepreload-polyfill-Cf3xff8G":
        return "boundaries", "vendor-runtime", True
    if basename == "src-l0hbMZ-p" or lower == "src":
        return "boundaries", "vendor", False
    if lower.startswith("vscode-api") or "vscode api" in note_lower or "vscode-api" in note_lower:
        return "boundaries", "vendor-runtime", True
    if lower.startswith("statsig"):
        return "boundaries", "vendor-runtime", True
    if lower.startswith("zod"):
        return "boundaries", "vendor", False
    return None


def classify_by_import_map(basename: str, im_entry: dict):
    """Use IMPORT_MAP hints to classify vendored/runtime chunks."""
    special = classify_special_cases(basename, im_entry)
    if special:
        return special
    if not im_entry:
        return None
    boundary_type = im_entry.get("boundaryType", "")
    note = im_entry.get("note", "")
    vendor = im_entry.get("vendor", "")
    lower = basename.lower()
    note_lower = note.lower()

    if boundary_type == "vendored-library" or vendor:
        # Third-party vendored code → boundaries/vendor
        domain = "boundaries"
        classification = "vendor"
        return domain, classification, False

    if boundary_type == "runtime" or "runtime" in note_lower:
        domain = "boundaries"
        classification = "vendor-runtime"
        return domain, classification, True

    # Explicit terminal boundaries from note
    if any(k in note_lower for k in [
        "app-scope", "webview bridge", "host config", "host-config",
        "statsig", "react-dom runtime", "bundler runtime", "vite bundler"
    ]):
        domain = "boundaries"
        classification = "vendor-runtime"
        return domain, classification, True

    if is_vendor_chunk(basename, note):
        domain = "boundaries"
        classification = "vendor"
        return domain, classification, False

    return None


def classify_faced_chunk(basename: str, im_entry: dict | None):
    """Conservative classification for chunks not in the organize plan (originally faced)."""
    by_im = classify_by_import_map(basename, im_entry)
    if by_im:
        return by_im
    if is_vendor_chunk(basename):
        if basename.lower().startswith(("app-scope", "src-", "statsig", "vscode-api", "zod")):
            return "boundaries", "vendor-runtime", True
        return "boundaries", "vendor", True
    if is_icon_chunk(basename):
        return "icons", "icon", False
    if is_data_asset(basename):
        return data_domain(basename), "data-asset", False
    if is_app_chunk(basename):
        return app_domain(basename), "app-feature", False
    if basename.lower().startswith("use-"):
        return "hooks", "app-feature", False
    return "utils", "single-util", False


def main():
    manifest = json.loads(MANIFEST_PATH.read_text())
    plan = json.loads(PLAN_PATH.read_text())
    import_map = json.loads(IMPORT_MAP_PATH.read_text())

    chunks = manifest["files"]
    plan_entries = plan["entries"]

    changes = []

    for basename, file in chunks.items():
        if file.get("kind") != "local":
            continue

        im_entry = import_map.get("chunks", {}).get(basename, {})
        note = im_entry.get("note", "")

        old_domain = file.get("organization", {}).get("domain", "")
        old_cls = file.get("organization", {}).get("classification", "")
        old_path = file.get("organization", {}).get("semanticPath", "")
        old_faced = file["stages"].get("faced", False)

        # Decide classification: IMPORT_MAP hint wins, then plan, then heuristic.
        by_im = classify_by_import_map(basename, im_entry)

        if by_im:
            domain, classification, faced = by_im
            semantic = semantic_path(basename, domain, classification, note)
        elif basename in plan_entries:
            # Restore from plan, but fix obvious issues
            entry = plan_entries[basename]
            domain = entry["domain"]
            classification = entry["classification"]
            semantic = entry["semanticPath"]
            faced = False

            # Force data assets to data-asset classification regardless of plan
            if is_data_asset(basename):
                domain = data_domain(basename)
                classification = "data-asset"
                semantic = semantic_path(basename, domain, classification, note)
            # Fix app-feature chunks wrongly placed in boundaries
            elif classification == "app-feature" and domain == "boundaries":
                if is_vendor_chunk(basename, note):
                    classification = "vendor"
                elif is_icon_chunk(basename):
                    domain = "icons"
                    classification = "icon"
                elif is_data_asset(basename):
                    domain = data_domain(basename)
                    classification = "data-asset"
                elif is_app_chunk(basename):
                    domain = app_domain(basename)
                elif basename.lower().startswith("use-"):
                    domain = "hooks"
                else:
                    domain = "utils"
                semantic = semantic_path(basename, domain, classification, note)

            # Fix app-scope misnaming
            if basename == "app-scope-CWE-zIhQ":
                domain = "boundaries"
                classification = "vendor-runtime"
                semantic = "boundaries/app-scope.ts"
                faced = True

            # Keep vendor-runtime boundaries faced
            if classification in ("vendor-runtime", "boundary"):
                faced = True
        else:
            # Not in plan: originally faced, apply conservative heuristic
            domain, classification, faced = classify_faced_chunk(basename, im_entry)
            semantic = semantic_path(basename, domain, classification, note)

        file["organization"] = {
            "domain": domain,
            "semanticPath": semantic,
            "classification": classification,
            "recipe": "manual",
            "source": "agent-reclassify",
        }
        file["stages"]["faced"] = faced

        if old_path != semantic or old_domain != domain or old_cls != classification or old_faced != faced:
            changes.append((basename, old_domain, old_path, domain, semantic, classification, faced))

        # Update IMPORT_MAP if promoted
        entry = import_map.get("chunks", {}).get(basename)
        if entry and entry.get("status") == "done":
            entry["restored"] = semantic

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2))
    IMPORT_MAP_PATH.write_text(json.dumps(import_map, indent=2))

    print(f"Updated {len(changes)} chunks")
    print("\nSample changes:")
    for c in changes[:40]:
        print(f"  {c[0]}: {c[1]}/{c[2]} ({'faced' if c[6] else 'unfaced'}) -> {c[3]}/{c[4]} ({c[5]})")

    domains = Counter(v.get("organization", {}).get("domain", "") for v in chunks.values() if v.get("kind") == "local")
    cls = Counter(v.get("organization", {}).get("classification", "") for v in chunks.values() if v.get("kind") == "local")
    faced = sum(1 for v in chunks.values() if v.get("kind") == "local" and v["stages"].get("faced"))
    print(f"\nDomains: {dict(domains.most_common())}")
    print(f"Classifications: {dict(cls.most_common())}")
    print(f"Faced: {faced}")


if __name__ == "__main__":
    main()
