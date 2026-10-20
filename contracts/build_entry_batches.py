"""Build the independent batch-session candidate; never change an existing seal."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
draft = root / 'drafts/entry-batches'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root / 'v0.50.0')
target = parser.parse_args().output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
source = root / 'v0.49.0'
for line in (source / 'SHA256SUMS').read_text().splitlines():
    checksum, name = line.split('  ', 1)
    if hashlib.sha256((source / name).read_bytes()).hexdigest() != checksum:
        raise SystemExit('Inherited snapshot digest mismatch: ' + name)
target.mkdir(parents=True, exist_ok=True)
changed = {'README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts'}
for item in source.iterdir():
    if item.is_file() and item.name not in changed:
        shutil.copyfile(item, target / item.name)
schema = json.loads((source / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.50.0/p1.schema.json'
definitions = json.loads((draft / 'wire.schema.json').read_text())['$defs']
for name, definition in definitions.items():
    if name in schema['$defs']:
        assert schema['$defs'][name] == definition, name
    else:
        schema['$defs'][name] = copy.deepcopy(definition)
author = schema['$defs']['TemplateAuthorEntry']
archive = schema['$defs']['TemplateArchiveManifest']['properties']['entries']['items']
for entry in [author, archive]:
    assert 'batching' not in entry['properties']
    entry['properties']['batching'] = {'$ref': '#/$defs/BatchDeclaration'}
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')

for name in ['package-format.ts', 'template-authoring.ts']:
    body = (source / name).read_text()
    body = "import { assertEntryBatching } from './entry-batches';\n" + body
    if name == 'package-format.ts':
        old = 'export type Entry = { id:string;'
        assert body.count(old) == 1
        body = body.replace(old, "export type Entry = { batching?:import('./entry-batch-decision.mjs').BatchDeclaration; id:string;")
        old = ' for(const entry of manifest.entries){\n'
        new = old + '  assertEntryBatching(entry,jsonFile(files,entry.resultSchema));\n'
    else:
        old = '    localSchema(entry.resultSchema);'
        new = old + '\n    assertEntryBatching(entry, entry.resultSchema);'
    assert body.count(old) == 1, name
    (target / name).write_text(body.replace(old, new))

for name in ['entry-batch-decision.mjs', 'entry-batch-decision.d.mts', 'entry-batches.ts']:
    shutil.copyfile(draft / name, target / name)
shutil.copyfile(draft / 'snapshot-README.md', target / 'README.md')
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in {'README.md', 'SHA256SUMS'})
(target / 'SHA256SUMS').write_text(''.join(
    hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files
))
print('Sealed', len(files), 'candidate machine files at', target)
