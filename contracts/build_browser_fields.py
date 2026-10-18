"""Build browser associated-field contracts from immutable 0.37.1."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
maintained = root / 'v0.38.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=maintained)
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
for source in (root / 'v0.37.1').iterdir():
    if source.name not in ('README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts'):
        shutil.copyfile(source, target / source.name)
if target.resolve() != maintained.resolve():
    for name in ('browser-fields.ts', 'browser-fields.cases.json', 'example.browser-fields.json', 'README.md'):
        shutil.copyfile(maintained / name, target / name)

schema = json.loads((root / 'v0.37.1/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.38.0/p1.schema.json'
d = schema['$defs']

def ref(name): return {'$ref': '#/$defs/' + name}
def obj(properties, required=None):
    return {'type': 'object', 'properties': properties,
            'required': list(properties) if required is None else required,
            'additionalProperties': False}

reference = obj({'$ref': {'type': 'string', 'minLength': 1, 'maxLength': 2000}})
selector = {'type': 'string', 'minLength': 1, 'maxLength': 2000, 'pattern': r'\S'}
attribute = {'type': 'string', 'minLength': 1, 'maxLength': 128, 'pattern': r'^[A-Za-z_:][A-Za-z0-9_.:-]*$'}
key = {'type': 'string', 'minLength': 1, 'maxLength': 64, 'pattern': r'^[A-Za-z_][A-Za-z0-9_-]*$'}
def dynamic(value): return {'anyOf': [value, reference]}
field = obj({'key': key, 'selector': dynamic(selector), 'operation': {'enum': ['text', 'attribute']},
             'attribute': {'anyOf': [attribute, reference, {'type': 'null'}]}, 'required': {'type': 'boolean'}})
field['allOf'] = [
    {'if': {'properties': {'operation': {'const': 'text'}}}, 'then': {'properties': {'attribute': {'type': 'null'}}}},
    {'if': {'properties': {'operation': {'const': 'attribute'}}}, 'then': {'properties': {'attribute': dynamic(attribute)}}},
]
d['BrowserField'] = field
base = copy.deepcopy(d['BrowserInspectionNode']['properties'])
base.update({'version': {'const': 5}, 'operation': {'const': 'collect'}, 'selector': dynamic(selector),
             'fields': {'type': 'array', 'minItems': 1, 'maxItems': 20, 'items': ref('BrowserField')}})
del base['value']
d['BrowserFieldsNode'] = obj(base, ['id', 'type', 'version', 'operation', 'selector', 'framePath', 'fields'])
d['Node']['oneOf'].append(copy.deepcopy(d['BrowserFieldsNode']))
result_field = obj({'key': key, 'selector': selector, 'operation': {'enum': ['text', 'attribute']},
                    'attribute': {'anyOf': [attribute, {'type': 'null'}]}, 'required': {'type': 'boolean'},
                    'count': {'type': 'integer', 'minimum': 0, 'maximum': 9007199254740991},
                    'status': {'enum': ['ok', 'missing', 'ambiguous', 'missing-attribute', 'empty']},
                    'value': {'type': ['string', 'null'], 'maxLength': 8192}})
d['BrowserFieldResult'] = result_field
d['BrowserFieldsResult'] = obj({'version': {'const': 1}, 'operation': {'const': 'collect'},
                               'url': {'type': 'string', 'minLength': 1, 'maxLength': 16384},
                               'documentUrl': {'type': 'string', 'minLength': 1, 'maxLength': 16384},
                               'selector': selector, 'framePath': ref('FramePath'), 'complete': {'type': 'boolean'},
                               'fields': {'type': 'array', 'minItems': 1, 'maxItems': 20, 'items': ref('BrowserFieldResult')}})
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    text = (root / 'v0.37.1' / name).read_text()
    text = "import { assertBrowserFieldsCapabilities } from './browser-fields';\n" + text
    if name == 'package-format.ts':
        text = text.replace('  assertAIOutcomeCapabilities(n,flow.requiredCapabilities);',
                            '  assertBrowserFieldsCapabilities(n,flow.requiredCapabilities,manifest,entry);\n  assertAIOutcomeCapabilities(n,flow.requiredCapabilities);')
    else:
        text = text.replace('      assertAIOutcomeCapabilities(node, entry.flow.requiredCapabilities);',
                            '      assertBrowserFieldsCapabilities(node, entry.flow.requiredCapabilities, d, { resources: entry.resourceIds });\n      assertAIOutcomeCapabilities(node, entry.flow.requiredCapabilities);')
    (target / name).write_text(text)
names = ('browser-fields.ts', 'browser-fields.cases.json', 'example.browser-fields.json', 'README.md')
if all((target / name).exists() for name in names):
    files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
    (target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed', len(files), 'candidate machine files.')
else:
    print('Schema generated; normative reference, cases and README still required.')
