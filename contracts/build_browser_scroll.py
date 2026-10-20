"""Build independent bounded scroll contracts from sealed 0.48.0; never rewrite a seal."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
draft = root / 'drafts/browser-region-scroll'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root / 'v0.49.0')
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
for line in (root / 'v0.48.0/SHA256SUMS').read_text().splitlines():
    digest, name = line.split('  ', 1)
    if hashlib.sha256((root / 'v0.48.0' / name).read_bytes()).hexdigest() != digest:
        raise SystemExit('Inherited snapshot digest mismatch: ' + name)
target.mkdir(parents=True, exist_ok=True)
changed = {'README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts'}
for source in (root / 'v0.48.0').iterdir():
    if source.is_file() and source.name not in changed:
        shutil.copyfile(source, target / source.name)
schema = json.loads((root / 'v0.48.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.49.0/p1.schema.json'
wire = json.loads((draft / 'wire.schema.json').read_text())['$defs']
for name, definition in wire.items():
    if name in schema['$defs']:
        assert schema['$defs'][name] == definition
    else:
        schema['$defs'][name] = copy.deepcopy(definition)
schema['$defs']['Node']['oneOf'].append(copy.deepcopy(wire['BrowserScrollNode']))
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    body = (root / 'v0.48.0' / name).read_text()
    body = "import { assertBrowserScrollCapabilities } from './browser-scroll';\n" + body
    if name == 'package-format.ts':
        anchor = '  assertBrowserTargetCapabilities(n,flow.requiredCapabilities,manifest,entry);'
        replacement = anchor + '\n  assertBrowserScrollCapabilities(n,flow.requiredCapabilities,manifest,entry);'
    else:
        anchor = '      assertBrowserTargetCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: [...entry.flow.requiredCapabilities, ...entry.capabilities], resources: entry.resourceIds, actions: entry.actionIds });'
        replacement = anchor + '\n      assertBrowserScrollCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: [...entry.flow.requiredCapabilities, ...entry.capabilities], resources: entry.resourceIds });'
    assert body.count(anchor) == 1
    (target / name).write_text(body.replace(anchor, replacement))
for name in ('browser-scroll.ts', 'browser-scroll.cases.json', 'example.browser-scroll.json'):
    shutil.copyfile(draft / name, target / name)
shutil.copyfile(draft / 'snapshot-README.md', target / 'README.md')
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
(target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
print('Sealed', len(files), 'candidate machine files at', target)
