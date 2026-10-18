"""Build candidate 0.37.0 from immutable 0.36.0. Never run against a published target."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SOURCE, MAINTAINED = ROOT / 'v0.36.0', ROOT / 'v0.37.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=MAINTAINED, help='Empty candidate destination; published snapshots must not be overwritten')
TARGET = parser.parse_args().output
if (TARGET / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot; choose an empty --output directory')
TARGET.mkdir(parents=True, exist_ok=True)
if TARGET.resolve() != MAINTAINED.resolve():
    for name in ('skill-update-review.ts', 'skill-update.cases.json', 'example.skill-update.json', 'README.md'):
        shutil.copyfile(MAINTAINED / name, TARGET / name)
for source in SOURCE.iterdir():
    if source.name not in {'README.md', 'SHA256SUMS', 'p1.schema.json', 'template-authoring.ts', 'package-format.ts'}:
        shutil.copyfile(source, TARGET / source.name)
schema = json.loads((SOURCE / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.37.0/p1.schema.json'
d = schema['$defs']
def ref(name): return {'$ref': '#/$defs/' + name}
def obj(props): return {'type': 'object', 'properties': props, 'required': list(props), 'additionalProperties': False}
def arr(item, max_items=100): return {'type': 'array', 'items': item, 'maxItems': max_items}
ID = {'type': 'string', 'pattern': '^[a-zA-Z0-9_-]{1,100}$'}
HASH = {'type': 'string', 'pattern': '^[a-f0-9]{64}$'}
REV = {'type': 'integer', 'minimum': 1, 'maximum': 9007199254740991}
TIME = {'type': 'string', 'pattern': r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$'}
BINDING = {'type': 'string', 'pattern': '^[a-z][a-z0-9-]{0,99}$'}
wire = json.loads((ROOT / 'drafts/skill-update-review/wire.schema.json').read_text())['$defs']
names = {k: ('Json' if k == 'Json' else 'SkillVersionRef' if k == 'VersionRef' else 'SkillUpdate' + k) for k in wire}
def translate(v):
    if isinstance(v, list): return [translate(x) for x in v]
    if isinstance(v, dict): return {k: ('#/$defs/' + names[x[8:]] if k == '$ref' and x.startswith('#/$defs/') else translate(x)) for k, x in v.items()}
    return v
for k, value in wire.items():
    if k not in {'Json', 'VersionRef'}: d[names[k]] = translate(value)
for k in ('createdAt', 'expiresAt'): d['SkillUpdateReview']['properties'][k] = TIME
review = d['SkillUpdateReview']
review['properties']['publishBase'] = ref('SkillVersionRef')
review['properties']['bundleSha256'] = HASH
review['required'].extend(['publishBase', 'bundleSha256'])
d['SkillUpdateOrigin'] = obj({'runId': ID, 'flowId': ID, 'nodeId': ID,
    'nodeInstance': {'type': 'string', 'minLength': 1, 'maxLength': 4000}, 'executionVersionId': HASH})
d['SkillUpdateBundle'] = obj({'version': {'const': 1}, 'proposalId': ID,
    'workspaceBinding': BINDING, 'origin': ref('SkillUpdateOrigin'), 'base': ref('SkillVersionRef'),
    'baseline': ref('SkillUpdateContent'), 'baselineEvidence': arr(ref('SkillEvidence')),
    'suggestion': ref('SkillDraft'), 'createdAt': TIME, 'sha256': HASH})
d['SkillUpdateInfo'] = obj({'version': {'const': 1}, 'mode': {'const': 'field-review'},
    'proposalId': ID, 'revision': REV, 'base': ref('SkillVersionRef'), 'bundleSha256': HASH,
    'baselineSha256': HASH, 'suggestionSha256': HASH})
input_props = copy.deepcopy(d['SkillDraft']['properties'])
d['SkillUpdateInput'] = obj({'base': ref('SkillVersionRef'), **input_props})
d['SkillUpdateProposalOutput'] = {'oneOf': [
    obj({'version': {'const': 1}, 'status': {'const': 'pending'}, 'base': ref('SkillVersionRef'), 'proposalId': ID, 'revision': REV}),
    obj({'version': {'const': 1}, 'status': {'const': 'confirmed'}, 'base': ref('SkillVersionRef'), 'proposalId': ID, 'revision': REV, 'ref': ref('SkillVersionRef')}),
    obj({'version': {'const': 1}, 'status': {'const': 'unchanged'}, 'base': ref('SkillVersionRef')})]}
node = obj({'id': ID, 'type': {'const': 'skill'}, 'version': {'const': 2},
    'operation': {'const': 'propose-update'}, 'binding': BINDING,
    **{k: ref('Value') for k in ['base', 'title', 'markdown', 'data', 'evidence']}})
node['properties'].update({'name': {'type': 'string', 'maxLength': 1000}, 'timeoutMs': {'type': 'integer', 'minimum': 100, 'maximum': 3600000}})
d['Node']['oneOf'].append(node)
(TARGET / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    text = (SOURCE / name).read_text()
    text = "import { assertSkillUpdateNode } from './skill-update-review';\n" + text
    if name == 'package-format.ts':
        needle = '  assertSourceReductionNode(n,flow.requiredCapabilities,manifest,entry);'
        replacement = needle + '\n  assertSkillUpdateNode(n,flow.requiredCapabilities,manifest,entry);'
    else:
        needle = '      assertSourceReductionNode(node, entry.flow.requiredCapabilities, d, { capabilities: entry.flow.requiredCapabilities, resources: entry.resourceIds });'
        replacement = needle + '\n      assertSkillUpdateNode(node, entry.flow.requiredCapabilities, d, { capabilities: entry.flow.requiredCapabilities, resources: entry.resourceIds });'
    assert text.count(needle) == 1
    (TARGET / name).write_text(text.replace(needle, replacement))
required = ['skill-update-review.ts', 'skill-update.cases.json', 'example.skill-update.json', 'README.md']
if all((TARGET / name).is_file() for name in required):
    files = sorted(p for p in TARGET.iterdir() if p.is_file() and p.name not in {'README.md', 'SHA256SUMS'})
    (TARGET / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed candidate 0.37.0 with', len(files), 'machine files; publication requires an actual merged tag.')
else:
    print('Generated candidate 0.37.0 schema; references, examples and README required before sealing.')
