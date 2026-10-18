"""Build explicit result resources from sealed 0.41.0; refuse all sealed overwrites."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path

root = Path(__file__).parent
maintained = root / 'v0.42.0'
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=maintained)
parser.add_argument('--seal', action='store_true')
args = parser.parse_args()
target = args.output
if (target / 'SHA256SUMS').exists():
    raise SystemExit('Refuse to overwrite a sealed snapshot')
target.mkdir(parents=True, exist_ok=True)
for source in (root / 'v0.41.0').iterdir():
    if source.name not in ('README.md', 'SHA256SUMS', 'p1.schema.json', 'package-format.ts', 'template-authoring.ts'):
        shutil.copyfile(source, target / source.name)
draft = root / 'drafts/run-result-binding'
names = {
    'wire.schema.json': 'run-result-binding.schema.json',
    'reference.mjs': 'run-result-binding.mjs',
    'credentials.mjs': 'run-result-credentials.mjs',
    'declarations.ts': 'run-result-binding.ts',
    'examples.json': 'run-result-binding.cases.json',
    'semantic.cases.json': 'run-result-binding.semantic.json',
    'credentials.cases.json': 'run-result-credentials.cases.json',
    'check-examples.mjs': 'check-run-result-binding.mjs',
    'check-declarations.ts': 'check-run-result-declarations.ts',
    'declarations.cases.json': 'run-result-declarations.cases.json',
}
for source, name in names.items():
    value = (draft / source).read_text()
    for old, new in names.items():
        value = value.replace("'./" + old + "'", "'./" + new + "'")
        value = value.replace("read('" + old + "')", "read('" + new + "')")
    value = value.replace('../../v0.41.0/entry-result-view.mjs', './entry-result-view.mjs')
    value = value.replace('urn:flowark:drafts:run-result-binding:1.0', 'urn:flowark:contracts:0.42.0:run-result-binding:1.0')
    value = value.replace('Unpublished run result binding shapes only', 'Explicit saved run result binding 1.0')
    (target / name).write_text(value)
wire = json.loads((target / names['wire.schema.json']).read_text())
schema = json.loads((root / 'v0.41.0/p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.42.0/p1.schema.json'
def renamed(value):
    if isinstance(value, list):
        return [renamed(x) for x in value]
    if isinstance(value, dict):
        return {k: '#/$defs/RunResult' + v.removeprefix('#/$defs/')
                if k == '$ref' and v.startswith('#/$defs/') else renamed(v) for k, v in value.items()}
    return value
d = schema['$defs']
for name, value in wire['$defs'].items():
    d['RunResult' + name] = renamed(value)
d['RunResultWire'] = renamed({'anyOf': wire['anyOf']})
d['Node']['oneOf'].append({'$ref': '#/$defs/RunResultNode'})
d['RunSnapshot']['properties']['resultSources'] = {'$ref': '#/$defs/RunResultPreparedSources'}
for resource in [d['TemplateAuthorResource'], d['TemplateArchiveManifest']['properties']['resources']['items']]:
    resource['properties']['kind']['enum'].append('run-result')
    resource['properties']['sourceEntries'] = copy.deepcopy(wire['$defs']['Resource']['properties']['sourceEntries'])
    resource['properties']['sourceEntries']['items'] = {'type': 'string', 'pattern': '^[a-z][a-z0-9-]{0,99}$'}
    resource['allOf'].append({'if': {'properties': {'kind': {'const': 'run-result'}}},
                             'then': {'required': ['sourceEntries'], 'properties': {'access': {'const': 'read'}, 'name': {'minLength': 1}}},
                             'else': {'not': {'required': ['sourceEntries']}}})
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
for name in ('package-format.ts', 'template-authoring.ts'):
    value = (root / 'v0.41.0' / name).read_text()
    value = "import { assertRunResultNode, assertRunResultResources } from './run-result-binding';\n" + value
    if name == 'package-format.ts':
        value = value.replace("|'conversation-source';access:", "|'conversation-source'|'run-result';sourceEntries?:string[];access:")
        value = value.replace("['skill','conversation-source'].includes", "['skill','conversation-source','run-result'].includes")
        value = value.replace(' assertDirectoryDefaults(manifest.resources);', ' assertDirectoryDefaults(manifest.resources);\n assertRunResultResources(manifest);')
        old = '  assertEffectNodeCapabilities(n,flow.requiredCapabilities,manifest,entry);'
        new = '  assertRunResultNode(n,flow.requiredCapabilities,manifest,entry);\n' + old
    else:
        value = value.replace("  shape('TemplateAuthorDefinition', value);", "  shape('TemplateAuthorDefinition', value);\n  assertRunResultResources(value);")
        old = '      assertEffectNodeCapabilities(node, entry.flow.requiredCapabilities, d, { capabilities: entry.flow.requiredCapabilities, actions: entry.actionIds });'
        new = '      assertRunResultNode(node, entry.flow.requiredCapabilities, d, { capabilities: entry.capabilities, resources: entry.resourceIds });\n' + old
    assert value.count(old) == 1
    (target / name).write_text(value.replace(old, new))
(target / 'run-result-binding.d.mts').write_text('''/** Pure reference types only; p1.schema.json is authoritative. */
export function canonical(value: unknown): string;
export function digest(value: unknown): string;
export function bytes(value: unknown): number;
export function verifyReference<T>(ref: T, owner: unknown, resource: unknown): T;
export function verifyRead<T>(value: T, owner: unknown, resource: unknown): T;
export function verifyResponse<T>(response: T, request: unknown, owner?: unknown, resource?: unknown): T;
export function verifyProof<T>(proof: T, owner: unknown, resource: unknown): T;
export function verifyCursor<T>(cursor: T, expected: unknown): T;
export function verifyLease<T>(lease: T, now: number, expected: unknown): T;
export function verifyPrepared<T>(sources: T, consumerRunId: string): T;
export function assertDeclaration<T>(definition: T): T;
''')
(target / 'run-result-credentials.d.mts').write_text('''/** Pure transform only; no storage, Schema validation or permission. */
export function credentialField(key: string): boolean;
export function credentialPolicy(known: string[]): {
  text(input: string): string;
  value(input: unknown): { value: unknown; dataChanged: boolean; dataSha256: string; dataBytes: number };
};
''')
if target.resolve() != maintained.resolve():
    shutil.copyfile(maintained / 'README.md', target / 'README.md')
if args.seal:
    if not (target / 'README.md').exists():
        raise SystemExit('Normative README required before sealing')
    files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in ('README.md', 'SHA256SUMS'))
    (target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Sealed', len(files), 'candidate machine files; publication requires actual PR/tag.')
else:
    print('Generated unsealed candidate; review before --seal.')
