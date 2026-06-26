import json, os, re

m=json.load(open('restored/.deobfuscate-javascript/_full/manifest.json'))
im=json.load(open('restored/IMPORT_MAP.json'))

# Revert basenames that were wrongly turned into vendor boundaries.
wrong = [
    'get-skill-icon-BdVrkuXU',
    'pull-request-code-review-comments-BJSQHV-3',
    'pull-requests-page-DDwwua2d',
    'first-run-Db14L1Gy',
    'split-items-into-render-groups-DSulUsUG',
]

for b in wrong:
    if b not in im['chunks']:
        continue
    low = b.lower()
    if low.startswith('pull-request'):
        if 'comments' in low:
            domain='pull-request'
            path='pull-request/pull-request-code-review-comments.tsx'
        else:
            domain='pull-request'
            path='pull-request/pull-requests-page.tsx'
    elif low.startswith('get-skill-icon'):
        domain='utils'
        path='utils/get-skill-icon.ts'
    elif low.startswith('first-run'):
        domain='utils'
        path='utils/first-run.tsx'
    elif low.startswith('split-items'):
        domain='utils'
        path='utils/split-items-into-render-groups.ts'
    else:
        domain='utils'
        path='utils/'+re.sub(r'([A-Z])',r'-\1',b.split('-')[0]).lower().strip('-')+'.ts'
    m['files'][b]['organization']={
        'domain':domain,
        'semanticPath':path,
        'classification':'app-feature',
        'recipe':'manual',
        'source':'agent-reclassify'
    }
    m['files'][b]['stages']['faced']=False
    im['chunks'][b]['restored']=path
    im['chunks'][b].pop('dependencyBoundary',None)
    im['chunks'][b].pop('vendor',None)
    print('reverted',b,'->',path)

json.dump(m, open('restored/.deobfuscate-javascript/_full/manifest.json','w'), indent=2)
json.dump(im, open('restored/IMPORT_MAP.json','w'), indent=2)
