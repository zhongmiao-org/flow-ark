"""Language-neutral directory resource-extension shapes; no host or business code."""
import json
from pathlib import Path
root = Path(__file__).parent

def obj(p):
    return {'type': 'object', 'properties': p, 'required': list(p), 'additionalProperties': False}
def ref(n):
    return {'$ref': '#/$defs/' + n}
def arr(v, maximum):
    return {'type': 'array', 'items': v, 'minItems': 1, 'maxItems': maximum, 'uniqueItems': True}
logical = {'type': 'string', 'pattern': '^[a-z][a-z0-9-]{0,99}$'}
identity = {'type': 'string', 'pattern': '^[a-zA-Z0-9_-]{1,100}$'}
sha = {'type': 'string', 'pattern': '^[a-f0-9]{64}$'}
version = {'type': 'string', 'pattern': r'^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[a-zA-Z0-9.-]+)?$'}
d = {}
d['Package'] = obj({'id': logical, 'version': version, 'digest': sha})
d['Directory'] = obj({'id': logical, 'name': {'type': 'string', 'minLength': 1, 'maxLength': 200}, 'kind': {'const': 'directory'}, 'access': {'enum': ['write', 'readwrite']}, 'required': {'type': 'boolean'}})
d['EntryAddition'] = obj({'entryId': logical, 'resourceIds': arr(logical, 100)})
common = {'version': {'const': 1}, 'instanceId': identity, 'expectedRevision': sha, 'basePackage': ref('Package'), 'extensionPackage': ref('Package')}
d['PreviewRequest'] = obj(common)
d['ApplyRequest'] = obj({**common, 'requestId': identity})
d['Receipt'] = obj({'version': {'const': 1}, 'requestId': identity, 'requestSha256': sha, 'instanceId': identity, 'previousRevision': sha, 'basePackage': ref('Package'), 'extensionPackage': ref('Package'), 'resources': arr(ref('Directory'), 100), 'entries': arr(ref('EntryAddition'), 50), 'appliedAt': {'type': 'string', 'pattern': r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$'}, 'receiptSha256': sha})
d['PreviewResponse'] = {'oneOf': [obj({**common, 'status': {'const': 'compatible'}, 'resources': arr(ref('Directory'), 100), 'entries': arr(ref('EntryAddition'), 50)}), obj({**common, 'status': {'enum': ['incompatible', 'blocked']}, 'reason': {'type': 'string', 'minLength': 1, 'maxLength': 2000}}), obj({**common, 'status': {'const': 'already-applied'}, 'receipt': ref('Receipt')})]}
d['ApplyResponse'] = obj({'version': {'const': 1}, 'receipt': ref('Receipt')})
s = {'$schema': 'https://json-schema.org/draft/2020-12/schema', '$id': 'urn:flowark:drafts:template-resource-extension:1', 'title': 'Unpublished directory resource extension shapes', '$defs': d, 'anyOf': [ref('PreviewRequest'), ref('PreviewResponse'), ref('ApplyRequest'), ref('ApplyResponse'), ref('Receipt')]}
(root / 'wire.schema.json').write_text(json.dumps(s, ensure_ascii=False, indent=2) + '\n')
