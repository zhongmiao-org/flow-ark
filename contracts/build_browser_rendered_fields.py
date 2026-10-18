"""Build bounded rendered-field contracts from immutable 0.38.0; never rewrite a seal."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
maintained = root / 'v0.39.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=maintained)
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
changed = ('README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts')
for source in (root / 'v0.38.0').iterdir():
    if source.name not in changed:
        shutil.copyfile(source, target / source.name)
added = ('browser-rendered-fields.ts', 'browser-rendered-fields.cases.json', 'example.browser-rendered-fields.json', 'README.md')
if target.resolve() != maintained.resolve():
    for name in added:
        shutil.copyfile(maintained / name, target / name)
schema = json.loads((root / 'v0.38.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.39.0/p1.schema.json'
d = schema['$defs']
field = copy.deepcopy(d['BrowserField'])
field['properties']['operation']['enum'].append('rendered-text')
field['allOf'][0]['if']['properties']['operation'] = {'enum': ['text', 'rendered-text']}
d['BrowserRenderedField'] = field
node = copy.deepcopy(d['BrowserFieldsNode'])
node['properties']['version'] = {'const': 6}
node['properties']['fields']['items'] = {'$ref': '#/$defs/BrowserRenderedField'}
d['BrowserRenderedFieldsNode'] = node
d['Node']['oneOf'].append(copy.deepcopy(node))
rf = copy.deepcopy(d['BrowserFieldResult'])
rf['properties']['operation']['enum'].append('rendered-text')
rf['properties']['status']['enum'] += ['hidden', 'clipped', 'unsupported']
rf['properties']['value']['maxLength'] = 65536
rf['properties']['issues'] = {'type': 'array', 'maxItems': 7, 'uniqueItems': True, 'items': {'enum': ['hidden-target', 'hidden-descendant', 'line-clamp', 'overflow-clip', 'unsupported-layout', 'embedded-content', 'generated-content']}}
rf['required'].append('issues')
d['BrowserRenderedFieldResult'] = rf
result = copy.deepcopy(d['BrowserFieldsResult'])
result['properties']['version'] = {'const': 2}
result['properties']['renderPolicy'] = {'const': 'bounded-rendered-text-v1'}
result['required'].append('renderPolicy')
result['properties']['fields']['items'] = {'$ref': '#/$defs/BrowserRenderedFieldResult'}
d['BrowserRenderedFieldsResult'] = result
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    text = (root / 'v0.38.0' / name).read_text()
    text = "import { assertBrowserRenderedFieldsCapabilities } from './browser-rendered-fields';\n" + text
    if name == 'package-format.ts':
        text = text.replace('  assertBrowserFieldsCapabilities(n,flow.requiredCapabilities,manifest,entry);',
                            '  assertBrowserRenderedFieldsCapabilities(n,flow.requiredCapabilities,manifest,entry);\n  assertBrowserFieldsCapabilities(n,flow.requiredCapabilities,manifest,entry);')
    else:
        text = text.replace('      assertBrowserFieldsCapabilities(node, entry.flow.requiredCapabilities, d, { resources: entry.resourceIds });',
                            '      assertBrowserRenderedFieldsCapabilities(node, entry.flow.requiredCapabilities, d, { resources: entry.resourceIds });\n      assertBrowserFieldsCapabilities(node, entry.flow.requiredCapabilities, d, { resources: entry.resourceIds });')
    (target / name).write_text(text)
if all((target / name).exists() for name in added):
    files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
    (target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed', len(files), 'candidate machine files.')
else:
    print('Schema generated; normative reference, cases and README still required.')
