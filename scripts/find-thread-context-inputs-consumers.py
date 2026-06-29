import json
from pathlib import Path

m = json.load(open("restored/.deobfuscate-javascript/_full/manifest.json"))
target = "thread-context-inputs-B6tQCr7t"
consumers = []
for b, info in m["files"].items():
    if info.get("kind") != "local":
        continue
    for imp in info.get("imports", []):
        if imp.get("target") == target:
            consumers.append(b)
            break

print(f"{len(consumers)} consumers of thread-context-inputs:")
for b in consumers:
    info = m["files"].get(b, {})
    org = info.get("organization", {})
    print(b, "|", org.get("classification", "?"), "|", org.get("semanticPath", "?"))
