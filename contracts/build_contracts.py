"""Reproducible P1 JSON Schema sources. Python stdlib only; no application code."""
import json
import hashlib
import argparse
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--version', choices=['0.1.0', '0.2.0', '0.3.0', '0.4.0'], default='0.4.0')
VERSION = parser.parse_args().version
ROOT = Path(__file__).parent / ('v' + VERSION)
ROOT.mkdir(exist_ok=True)
def obj(props, required=None):
    return {'type': 'object', 'properties': props, 'required': list(props) if required is None else required, 'additionalProperties': False}
def arr(item): return {'type': 'array', 'items': item, 'maxItems': 1000}
def enum(*values): return {'enum': list(values)}
def ref(name): return {'$ref': '#/$defs/' + name}
S = {'type': 'string', 'maxLength': 100000}
ID = {'type': 'string', 'pattern': '^[a-zA-Z0-9_-]{1,100}$'}
N = {'type': 'number'}
I = {'type': 'integer', 'minimum': 0}
B = {'type': 'boolean'}
J = ref('Json')
defs = {'Json': {'anyOf': [{'type': t} for t in ['string', 'number', 'boolean', 'null']] + [{'type': 'array', 'items': ref('Json')}, {'type': 'object', 'additionalProperties': ref('Json')}]}}
defs['Value'] = {'anyOf': [J, obj({'$ref': S})]}
V = ref('Value')
defs['CredentialRef'] = obj({'credentialId': ID})
defs['ArtifactRef'] = obj({'artifactId': ID, 'runId': ID})
nodes = []
def node(kind, props, version=1):
    nodes.append(obj({'id': ID, 'type': {'const': kind}, 'version': {'const': version}, 'name': S, 'timeoutMs': {'type': 'integer', 'minimum': 100, 'maximum': 3600000}, **props}, ['id', 'type', 'version', *props]))
node('value', {'value': V})
node('assert', {'actual': V, 'operator': enum('equals', 'notEquals', 'contains', 'gt', 'exists'), 'expected': V})
node('http', {'url': V, 'method': enum('GET', 'POST', 'PUT', 'DELETE'), 'headers': V, 'body': V})
node('script', {'language': enum('js', 'ts'), 'code': S, 'input': V, 'dependencies': arr(obj({'name': S, 'version': S}))})
node('file', {'operation': enum('read', 'write', 'copy'), 'binding': S, 'name': V, 'content': V})
node('excel', {'operation': enum('read', 'write'), 'binding': S, 'name': V, 'rows': V})
if VERSION in ['0.3.0', '0.4.0']:
    node('excel', {'operation': {'const': 'fill'}, 'binding': S, 'name': V, 'templateName': V, 'sheet': S, 'cells': V}, version=2)
    node('file', {'operation': {'const': 'archive'}, 'binding': S, 'name': V, 'files': V}, version=2)
node('browser', {'operation': enum('navigate', 'read', 'click', 'fill', 'wait', 'upload', 'screenshot', 'download'), 'selector': S, 'value': V})
node('human', {'message': S})
node('condition', {'actual': V, 'operator': enum('equals', 'notEquals', 'contains', 'gt', 'exists'), 'expected': V, 'then': arr(ref('Node')), 'else': arr(ref('Node'))})
node('loop', {'items': V, 'body': arr(ref('Node'))})
node('recruiting', {'platform': enum('boss', 'zhaopin'), 'batchLimit': {'type': 'integer', 'minimum': 1, 'maximum': 30}})
defs['Node'] = {'oneOf': nodes}
defs['FlowDefinition'] = obj({'formatVersion': {'const': '1.0'}, 'id': ID, 'name': {'type': 'string', 'minLength': 1, 'maxLength': 200}, 'description': S, 'parameters': {'type': 'object', 'additionalProperties': J}, 'steps': arr(ref('Node')), 'requiredCapabilities': arr(S), 'sourceTemplate': obj({'id': ID, 'version': S, 'digest': S})}, ['formatVersion', 'id', 'name', 'description', 'parameters', 'steps', 'requiredCapabilities'])
defs['RunState'] = enum('QUEUED', 'RUNNING', 'PAUSED', 'WAITING_INPUT', 'CANCELLING', 'CANCELLED', 'INTERRUPTED', 'SUCCEEDED', 'FAILED')
defs['RunRequest'] = obj({'flowId': ID, 'versionId': ID, 'parameters': J, 'source': enum('manual', 'schedule'), 'triggerId': S})
defs['RunSnapshot'] = obj({'runId': ID, 'versionId': ID, 'flow': ref('FlowDefinition'), 'parameters': J, 'createdAt': S})
if VERSION == '0.4.0':
    defs['ScriptBundle'] = obj({'nodeId': ID, 'sha256': {'type': 'string', 'pattern': '^[a-f0-9]{64}$'}, 'dependencies': arr(obj({'name': S, 'version': S}))})
    defs['RunSnapshot']['properties']['scriptBundles'] = arr(ref('ScriptBundle'))
defs['RunEvent'] = obj({'runId': ID, 'sequence': I, 'time': S, 'type': enum('state', 'node-start', 'node-end', 'log', 'progress', 'artifact', 'error'), 'nodeInstance': S, 'data': J})
actions = ['apply', 'resume', 'reply', 'requestWechat', 'acceptWechat', 'requestPhone', 'acceptPhone']
defs['RecruitingPolicy'] = obj({'platform': enum('boss', 'zhaopin'), 'account': S, 'keywords': arr(S), 'excludedCompanies': arr(S), 'allowedTargets': arr(S), 'resumeVersion': S, 'resumeBinding': S, 'facts': arr(obj({'id': ID, 'text': S})), 'actions': obj({a: enum('deny', 'confirm', 'auto') for a in actions}), 'dailyLimit': {'type': 'integer', 'minimum': 1, 'maximum': 500}, 'batchLimit': {'type': 'integer', 'minimum': 1, 'maximum': 30}, 'startHour': {'type': 'integer', 'minimum': 0, 'maximum': 23}, 'endHour': {'type': 'integer', 'minimum': 1, 'maximum': 24}, 'timezone': S, 'ownWechat': S, 'ownPhone': S, 'provider': enum('openai-codex', 'deepseek'), 'model': S, 'contextRevision': ID})
defs['AIReplyDraft'] = obj({'body': S, 'factIds': arr(ID), 'claims': arr(obj({'text': S, 'factId': ID})), 'containsContact': B, 'containsCommitment': B, 'needsHuman': arr(S)})
defs['AIReplyRequest'] = obj({'provider': enum('openai-codex', 'deepseek'), 'model': S, 'facts': arr(obj({'id': ID, 'text': S})), 'conversation': arr(obj({'role': enum('self', 'peer'), 'text': S})), 'job': S, 'contextHash': S, 'resumeVersion': S})
defs['AIReplyResult'] = obj({'provider': S, 'model': S, 'contextHash': S, 'resumeVersion': S, 'draft': ref('AIReplyDraft'), 'requestId': S, 'usage': J})
defs['RecruitingAction'] = obj({'id': ID, 'platform': enum('boss', 'zhaopin'), 'account': S, 'target': S, 'kind': enum(*actions), 'contextHash': S, 'contentHash': S, 'dedupeKey': S, 'state': enum('PENDING_CONFIRMATION', 'READY', 'SUBMITTING', 'CONFIRMED', 'WAITING_PEER', 'FAILED', 'UNKNOWN', 'BLOCKED'), 'evidence': S})
defs['ContactExchangeResult'] = obj({'platform': enum('boss', 'zhaopin'), 'account': S, 'target': S, 'company': S, 'job': S, 'contact': S, 'kind': enum('wechat', 'phone'), 'state': enum('requested', 'accepted', 'rejected', 'visible', 'needs-human'), 'value': S, 'source': S, 'owner': enum('peer', 'self', 'unknown'), 'time': S})
defs['UserAttentionItem'] = obj({'id': ID, 'kind': enum('contact', 'confirmation', 'unknown-result', 'limitation', 'login'), 'title': S, 'detail': J, 'dedupeKey': S, 'read': B, 'time': S})
defs['TemplateManifest'] = obj({'id': ID, 'version': S, 'source': S, 'digest': S, 'formatVersion': {'const': '1.0'}, 'parametersSchema': J, 'requiredCapabilities': arr(S), 'scripts': arr(S), 'dependencies': arr(obj({'name': S, 'version': S}))})
if VERSION in ['0.2.0', '0.3.0', '0.4.0']:
    defs['TemplateConfiguration'] = obj({'adapter': ID, 'schema': J})
    defs['TemplateManifest']['properties']['configuration'] = ref('TemplateConfiguration')
defs['TemplatePackage'] = obj({'manifest': ref('TemplateManifest'), 'flow': ref('FlowDefinition')})
schema = {'$schema': 'https://json-schema.org/draft/2020-12/schema', '$id': 'https://flowark.local/contracts/' + VERSION + '/p1.schema.json', 'title': 'FlowArkP1', '$defs': defs}
(ROOT / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
example = {'formatVersion': '1.0', 'id': 'hello', 'name': '第一个流程', 'description': '虚构数据回归', 'parameters': {}, 'requiredCapabilities': [], 'steps': [{'id': 'greeting', 'type': 'value', 'version': 1, 'value': {'message': '你好，序舟'}}, {'id': 'verify', 'type': 'assert', 'version': 1, 'actual': {'$ref': 'steps.greeting.message'}, 'operator': 'equals', 'expected': '你好，序舟'}]}
(ROOT / 'example.flow.json').write_text(json.dumps(example, ensure_ascii=False, indent=2) + '\n')
files = ['p1.schema.json', 'example.flow.json']
(ROOT / 'SHA256SUMS').write_text(''.join(hashlib.sha256((ROOT / f).read_bytes()).hexdigest() + '  ' + f + '\n' for f in files))
print('Generated contracts/v' + VERSION)
