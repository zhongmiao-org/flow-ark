"""Build the independent selection-text candidate from sealed 0.44.0; never rewrite a seal."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
maintained = root / 'v0.45.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=maintained)
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
changed = ('README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts')
for source in (root / 'v0.44.0').iterdir():
    if source.name not in changed:
        shutil.copyfile(source, target / source.name)
added = ('browser-selection-text.ts', 'browser-selection-text.cases.json',
         'check-browser-selection-text.ts', 'browser-selection-declarations.cases.json',
         'check-browser-selection-declarations.ts', 'example.browser-selection-text.json', 'README.md')
if target.resolve() != maintained.resolve():
    for name in added:
        shutil.copyfile(maintained / name, target / name)
schema = json.loads((root / 'v0.44.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.45.0/p1.schema.json'
draft = json.loads((root / 'drafts/browser-selection-text/wire.schema.json').read_text())['$defs']
for name, definition in draft.items():
    if name == 'FramePath':
        assert schema['$defs'][name] == definition
    else:
        assert name not in schema['$defs']
        schema['$defs'][name] = copy.deepcopy(definition)
schema['$defs']['Node']['oneOf'].append(copy.deepcopy(draft['BrowserSelectionTextFieldsNode']))
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    body = (root / 'v0.44.0' / name).read_text()
    body = "import { assertBrowserSelectionTextCapabilities } from './browser-selection-text';\n" + body
    if name == 'package-format.ts':
        anchor = '  assertBrowserTargetCapabilities(n,flow.requiredCapabilities,manifest,entry);'
        replacement = anchor + '\n  assertBrowserSelectionTextCapabilities(n,flow.requiredCapabilities,manifest,entry);'
    else:
        anchor = '      assertBrowserTargetCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: [...entry.flow.requiredCapabilities, ...entry.capabilities], resources: entry.resourceIds, actions: entry.actionIds });'
        replacement = anchor + '\n      assertBrowserSelectionTextCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: [...entry.flow.requiredCapabilities, ...entry.capabilities], resources: entry.resourceIds });'
    assert body.count(anchor) == 1
    (target / name).write_text(body.replace(anchor, replacement))
assert all((target / name).is_file() for name in added)
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
(target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
print('Sealed', len(files), 'candidate machine files.')
