import json
import os
import re

m=json.load(open("src/.deobfuscate-javascript/_full/manifest.json"))
im=json.load(open('src/IMPORT_MAP.json'))

SHIMS = [
    'workbook-BEO_aVXz',
    'info-NVLQJR56-CJGElsQG',
    'packet-BFZMPI3H-C976HVjn',
    'pie-7BOR55EZ-Cel_tNJ1',
    'architecture-U656AL7Q-Ccsrjk_f',
    'radar-NHE76QYJ-8GggBqpZ',
    'info-OMHHGYJF-VpsoNmpd',
    'packet-4T2RLAQJ-Cps_a8kh',
    'pie-ZZUOXDRM-CTCvZluc',
    'treeView-SZITEDCU-CQ3h0-LJ',
    'architecture-YZFGNWBL-hfWpxWZF',
    'radar-PYXPWWZC-DenUZrCa',
    'wardley-RL74JXVD-DX26H2Am',
]

def kebab(s):
    s = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', s)
    s = re.sub(r'[_.]+', '-', s)
    return s.lower().strip('-')

for b in SHIMS:
    cp='.deobfuscate-javascript/_full/checkpoints/'+b+'.tsx'
    if not os.path.exists(cp):
        cp='.deobfuscate-javascript/_full/checkpoints/'+b+'.ts'
    deps=re.findall(r"from\s+['\"]([^'\"]+)['\"]", open(cp).read())
    dep = [d for d in deps if d.startswith('./')][0].lstrip('./')
    dep_entry = im['chunks'].get(dep,{})
    family = dep_entry.get('vendor','mermaid')
    base = kebab(b)
    new_path = f'shared/boundaries/{family}/{base}.ts'
    m['files'][b]['organization']={
        'domain':'boundaries',
        'semanticPath':new_path,
        'classification':'vendor',
        'recipe':'manual',
        'source':'agent-reclassify'
    }
    m['files'][b]['stages']['faced']=True
    m['files'][b]['stages']['promoted']=False
    im['chunks'][b]["path"]=new_path
    im['chunks'][b]['dependencyBoundary']=True
    im['chunks'][b]['vendor']=family
    print(b,'->',new_path,'family=',family)

json.dump(m, open("src/.deobfuscate-javascript/_full/manifest.json",'w'), indent=2)
json.dump(im, open('src/IMPORT_MAP.json','w'), indent=2)
