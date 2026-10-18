"""Promote the reviewed read-only entry-result wire draft; never overwrite a seal."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root / 'v0.41.0')
parser.add_argument('--seal', action='store_true')
args = parser.parse_args()
target = args.output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
for source in (root / 'v0.40.0').iterdir():
    if source.name not in ('README.md', 'SHA256SUMS', 'p1.schema.json'):
        shutil.copyfile(source, target / source.name)
draft = root / 'drafts/entry-result-view'
wire = json.loads((draft / 'wire.schema.json').read_text())
wire['$id'] = 'urn:flowark:contracts:0.41.0:entry-result-view:1.0'
wire['title'] = 'Read-only saved entry result view 1.0'
wire['$defs']['Unavailable']['properties']['reason']['enum'].append('privacy-unavailable')
(target / 'entry-result-view.schema.json').write_text(json.dumps(wire, ensure_ascii=False, indent=2) + '\n')
cases = json.loads((draft / 'examples.json').read_text())
privacy = json.loads(json.dumps(next(item for item in cases if item['value'].get('viewStatus') == 'unavailable')))
privacy['id'] = 'privacy-projection-unavailable'
privacy['expected'] = 'valid'
privacy['value']['reason'] = 'privacy-unavailable'
privacy.pop('expectedSource', None)
body = {key: value for key, value in privacy['value'].items() if key != 'readStamp'}
privacy['value']['readStamp'] = hashlib.sha256(json.dumps(body, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
cases.append(privacy)
(target / 'entry-result-view.cases.json').write_text(json.dumps(cases, ensure_ascii=False, indent=2) + '\n')
shutil.copyfile(draft / 'boundaries.json', target / 'entry-result-view.boundaries.json')
source = (draft / 'reference.mjs').read_text().replace(
    '/** Unpublished protocol reference only. No Store, UI, network, or application imports. */',
    '/** Wire relationships only. Does not prove Store ownership, privacy or historical provenance. */')
(target / 'entry-result-view.mjs').write_text(source)
(target / 'entry-result-view.d.mts').write_text('''/** Types for the wire reference only; p1.schema.json is authoritative. */
export function canonical(value: unknown): string;
export function digest(value: unknown): string;
export function bytes(value: unknown): number;
export function assertWireBudget(value: unknown): void;
export function seal<T extends object>(body: T): T & { readStamp: string };
export function verify<T>(response: T, expectedRun: unknown, expectedSource?: unknown): T;
''')
schema = json.loads((root / 'v0.40.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.41.0/p1.schema.json'
def renamed(value):
    if isinstance(value, list):
        return [renamed(item) for item in value]
    if isinstance(value, dict):
        return {key: ('#/$defs/EntryResult' + item.removeprefix('#/$defs/'))
                if key == '$ref' and item.startswith('#/$defs/') else renamed(item)
                for key, item in value.items()}
    return value
for name, value in wire['$defs'].items():
    schema['$defs']['EntryResult' + name] = renamed(value)
schema['$defs']['EntryResultView'] = {'$ref': '#/$defs/EntryResultResponse'}
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
maintained = root / 'v0.41.0'
if target.resolve() != maintained.resolve():
    shutil.copyfile(maintained / 'README.md', target / 'README.md')
if args.seal:
    if not (target / 'README.md').exists():
        raise SystemExit('Normative README required before sealing')
    files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
    (target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed', len(files), 'machine files; candidate is not a published tag.')
else:
    print('Generated unsealed candidate; review and verify before --seal.')
