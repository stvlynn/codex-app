import json
import os

m=json.load(open("src/.deobfuscate-javascript/_full/manifest.json"))
im=json.load(open('src/IMPORT_MAP.json'))
missing=[]
for k,v in im.get('chunks',{}).items():
    if v.get('status') != 'done':
        continue
    if not v.get("path"):
        continue
    if os.path.exists('src/'+v["path"]):
        continue
    info=m['files'].get(k,{})
    org=info.get('organization',{})
    cls=org.get('classification','?')
    if cls in ('icon','button','single-util'):
        missing.append((k,cls,v["path"]))
print('missing icon/button/single-util:', len(missing))
for b,c,p in missing[:30]:
    print(b,'|',c,'|',p)
