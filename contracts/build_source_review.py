"""Build the unpublished 0.36.0 snapshot from immutable 0.35.1. Stdlib only."""
import copy
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SOURCE = ROOT / 'v0.35.1'
TARGET = ROOT / 'v0.36.0'
TARGET.mkdir(exist_ok=True)
for source in SOURCE.iterdir():
    if source.name not in {'README.md', 'SHA256SUMS', 'p1.schema.json'}:
        shutil.copyfile(source, TARGET / source.name)

schema = json.loads((SOURCE / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.36.0/p1.schema.json'
d = schema['$defs']
def ref(name):
    return {'$ref': '#/$defs/' + name}
def obj(properties):
    return {'type': 'object', 'properties': properties,
            'required': list(properties), 'additionalProperties': False}
def nullable(value):
    return {'anyOf': [value, {'type': 'null'}]}
ID = {'type': 'string', 'pattern': '^[a-zA-Z0-9_-]{1,100}$'}
HASH = {'type': 'string', 'pattern': '^[a-f0-9]{64}$'}
COUNT = {'type': 'integer', 'minimum': 0, 'maximum': 9007199254740991}
POSITIVE = {**COUNT, 'minimum': 1}
TIME = {'type': 'string', 'minLength': 24, 'maxLength': 24,
        'pattern': r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$'}
TARGET_FIELDS = {'runId': ID, 'nodeId': ID,
                 'nodeInstance': {'type': 'string', 'minLength': 1, 'maxLength': 4000}}
d['SourceReductionReviewTarget'] = obj(TARGET_FIELDS)
d['SourceReductionReviewSelection'] = obj({
    'version': {'const': 1}, 'target': ref('SourceReductionReviewTarget'), 'jobId': ID,
})
d['SourceReductionReviewCheckpoint'] = obj({
    'revision': COUNT, 'sha256': HASH,
    'next': nullable(ref('ConversationSourceCursor')),
    'chunks': COUNT, 'records': COUNT, 'bytes': COUNT,
})
chunk = copy.deepcopy(d['ConversationSourceChunk']['properties'])
del chunk['text']
d['SourceReductionReviewFragment'] = obj(chunk)
d['SourceReductionReviewPending'] = obj({
    'attemptId': ID,
    'state': {'enum': ['prepared', 'response', 'failed', 'unknown']},
    'hasSavedResponse': {'type': 'boolean'},
})
d['SourceReductionRunReview'] = obj({
    'version': {'const': 1}, 'reviewId': ID, 'epoch': ID,
    'target': ref('SourceReductionReviewTarget'),
    'mode': {'const': 'snapshot'}, 'executionVersionId': HASH, 'snapshotSha256': HASH,
    'job': ref('SourceReductionRef'), 'jobRevision': POSITIVE,
    'checkpoint': ref('SourceReductionReviewCheckpoint'),
    'phase': {'enum': ['ready', 'attention', 'complete']},
    'operation': {'enum': ['continue-batch', 'retry-one', 'use-complete']},
    'pending': nullable(ref('SourceReductionReviewPending')),
    'fragment': nullable(ref('SourceReductionReviewFragment')),
    'batchLimit': {'type': 'integer', 'minimum': 1, 'maximum': 16},
    'requestLimit': {'type': 'integer', 'minimum': 0, 'maximum': 16},
    'requestScope': {'const': 'source-node-instance'},
    'runStartsAtFirstNode': {'const': True},
    'provider': {'enum': ['deepseek', 'openai-codex']},
    'model': {'type': 'string', 'minLength': 1, 'maxLength': 100,
              'pattern': '^[a-zA-Z0-9][a-zA-Z0-9._:/-]{0,99}$'},
    'configurationRevision': nullable({'type': 'string', 'minLength': 1, 'maxLength': 100}),
    'attempts': COUNT, 'reportedTotalTokens': COUNT, 'unknownUsageRequests': COUNT,
    'createdAt': TIME, 'expiresAt': TIME, 'sha256': HASH,
})
d['SourceReductionRunConfirmation'] = obj({
    'version': {'const': 1}, 'reviewId': ID, 'reviewSha256': HASH,
    'requestId': ID, 'reviewed': {'const': True},
})
d['SourceReductionRunReviewReceipt'] = obj({
    'version': {'const': 1}, 'requestId': ID, 'runId': ID,
    'review': ref('SourceReductionRunReview'), 'confirmedAt': TIME, 'sha256': HASH,
})
(TARGET / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
references = ['source-reduction-review.ts', 'example.source-reduction-review.json', 'README.md']
if all((TARGET / name).is_file() for name in references):
    files = sorted(p for p in TARGET.iterdir()
                   if p.is_file() and p.name not in {'README.md', 'SHA256SUMS'})
    (TARGET / 'SHA256SUMS').write_text(''.join(
        hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
    print('Generated unpublished contracts/v0.36.0 with', len(files), 'sealed machine files.')
else:
    print('Generated unpublished 0.36.0 schema; references/examples required before sealing.')
