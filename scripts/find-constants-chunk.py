import json

m = json.load(open("src/.deobfuscate-javascript/_full/manifest.json"))
for b, info in m["files"].items():
    if info.get("kind") != "local":
        continue
    exports = [e.get("exported", "") for e in info.get("exports", [])]
    if "GPT_5_4" in exports or "CYBER_URL" in exports:
        print(b, "|", info.get("organization", {}).get("semanticPath", "?"))
