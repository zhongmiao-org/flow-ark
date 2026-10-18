"""Build visual effect nodes from immutable 0.39.0; never overwrite a seal."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
maintained = root / 'v0.40.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=maintained)
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
changed = ('README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts')
for source in (root / 'v0.39.0').iterdir():
    if source.name not in changed:
        shutil.copyfile(source, target / source.name)
added = ('effect-node.ts', 'effect-node.cases.json', 'example.effect-node.json', 'README.md')
if target.resolve() != maintained.resolve():
    for name in added:
        shutil.copyfile(maintained / name, target / name)
schema = json.loads((root / 'v0.39.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.40.0/p1.schema.json'
d = schema['$defs']
ref = {'type': 'object', 'additionalProperties': False,
       'required': ['$ref'], 'properties': {'$ref': {'type': 'string', 'minLength': 1, 'maxLength': 2000}}}
def text_value(minimum, maximum, nonblank=False):
    literal = {'type': 'string', 'minLength': minimum, 'maxLength': maximum}
    if nonblank:
        literal['pattern'] = r'\S'
    return {'anyOf': [literal, copy.deepcopy(ref)]}
base = {
    'id': {'type': 'string', 'pattern': '^[a-zA-Z0-9_-]{1,100}$'},
    'type': {'const': 'effect'}, 'version': {'const': 1},
    'name': {'type': 'string', 'maxLength': 1000},
    'timeoutMs': {'type': 'integer', 'minimum': 100, 'maximum': 3600000},
}
action = {'type': 'string', 'pattern': '^[a-z][a-z0-9-]{0,99}$'}
review = {'type': 'object', 'additionalProperties': False,
          'required': ['version', 'target', 'content'], 'properties': {
              'version': {'const': 1}, 'target': text_value(1, 4096, True),
              'content': text_value(0, 100000)}}
prepare = {'type': 'object', 'additionalProperties': False,
           'properties': {**copy.deepcopy(base), 'operation': {'const': 'prepare'},
                          'action': action, 'key': text_value(1, 1000, True),
                          'description': text_value(0, 1000),
                          'review': {'anyOf': [{'type': 'null'}, review]}},
           'required': ['id', 'type', 'version', 'operation', 'action', 'key']}
resolve = {'type': 'object', 'additionalProperties': False,
           'properties': {**copy.deepcopy(base), 'operation': {'const': 'resolve'},
                          'receipt': {'$ref': '#/$defs/Value'},
                          'state': {'enum': ['confirmed', 'failed', 'unknown']},
                          'evidence': {'$ref': '#/$defs/Value'}},
           'required': ['id', 'type', 'version', 'operation', 'receipt', 'state']}
d['EffectPrepareNode'] = prepare
d['EffectResolveNode'] = resolve
d['EffectNode'] = {'oneOf': [{'$ref': '#/$defs/EffectPrepareNode'}, {'$ref': '#/$defs/EffectResolveNode'}]}
d['Node']['oneOf'] += [copy.deepcopy(prepare), copy.deepcopy(resolve)]
receipt = {'type': 'object', 'additionalProperties': False,
           'required': ['version', 'operation', 'id', 'action', 'key', 'runId', 'execute', 'state'],
           'properties': {'version': {'const': 1}, 'operation': {'const': 'prepare'},
                          'id': {'type': 'string', 'pattern': '^[a-f0-9]{64}$'},
                          'action': copy.deepcopy(action),
                          'key': {'type': 'string', 'minLength': 1, 'maxLength': 1000, 'pattern': r'\S'},
                          'runId': {'type': 'string', 'minLength': 1, 'maxLength': 100},
                          'execute': {'type': 'boolean'},
                          'state': {'enum': ['submitting', 'confirmed', 'failed', 'unknown']}},
           'allOf': [{'if': {'properties': {'execute': {'const': True}}},
                      'then': {'properties': {'state': {'const': 'submitting'}}}}]}
d['EffectPrepareResult'] = receipt
d['EffectResolveResult'] = {'type': 'object', 'additionalProperties': False,
                            'required': ['version', 'operation', 'id', 'state'],
                            'properties': {'version': {'const': 1}, 'operation': {'const': 'resolve'},
                                           'id': copy.deepcopy(receipt['properties']['id']),
                                           'state': {'enum': ['confirmed', 'failed', 'unknown']}}}
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    value = (root / 'v0.39.0' / name).read_text()
    value = "import { assertEffectNodeCapabilities } from './effect-node';\n" + value
    if name == 'package-format.ts':
        old = '  assertBrowserRenderedFieldsCapabilities(n,flow.requiredCapabilities,manifest,entry);'
        new = '  assertEffectNodeCapabilities(n,flow.requiredCapabilities,manifest,entry);\n' + old
    else:
        old = '      assertBrowserRenderedFieldsCapabilities(node, entry.flow.requiredCapabilities, d, { resources: entry.resourceIds });'
        new = '      assertEffectNodeCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: entry.flow.requiredCapabilities, actions: entry.actionIds });\n' + old
    assert value.count(old) == 1
    (target / name).write_text(value.replace(old, new))
if all((target / name).exists() for name in added):
    files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
    (target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed', len(files), 'candidate machine files.')
else:
    print('Schema generated; normative reference, cases and README still required.')
