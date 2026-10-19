"""Rebuild 0.45.1 from sealed 0.45.0 without modifying either seal."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
root = Path(__file__).parent
maintained = root / 'v0.45.1'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, required=True)
target = parser.parse_args().output
if target.exists():
    raise SystemExit('Refuse to overwrite an existing candidate')
target.mkdir(parents=True)
for source in (root / 'v0.45.0').iterdir():
    if source.name not in ['README.md', 'SHA256SUMS', 'p1.schema.json', 'browser-selection-text.cases.json']:
        shutil.copyfile(source, target / source.name)
for name in ['README.md', 'browser-selection-text.cases.json']:
    shutil.copyfile(maintained / name, target / name)
schema = json.loads((root / 'v0.45.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.45.1/p1.schema.json'
identity = schema['$defs']['BrowserSelectionTextFieldsInvocation']['properties']['nodeInstance']
assert identity['pattern'] == r'^[A-Za-z0-9_/-]+$'
identity.pop('pattern')
identity['maxLength'] = 2048
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ['README.md', 'SHA256SUMS'])
(target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
print('Rebuilt', len(files), 'candidate machine files.')
