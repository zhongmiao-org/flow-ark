"""Seal directory resource declarations from 0.52.0; never overwrite snapshots."""
import argparse
import copy
import hashlib
import json
import shutil
from pathlib import Path
root = Path(__file__).parent
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root / 'v0.53.0')
args = parser.parse_args()
source, target = root / 'v0.52.0', args.output
if target.exists():
    raise SystemExit('Refuse to overwrite a snapshot')
for line in (source / 'SHA256SUMS').read_text().splitlines():
    checksum, name = line.split('  ', 1)
    assert hashlib.sha256((source / name).read_bytes()).hexdigest() == checksum, name
shutil.copytree(source, target)
draft = root / 'drafts/template-resource-extension'
names = {'wire.schema.json': 'template-resource-extension.schema.json', 'reference.mjs': 'template-resource-extension.mjs', 'reference.d.mts': 'template-resource-extension.d.mts', 'README.md': 'template-resource-extension.md', 'example.request.json': 'example.template-resource-extension-request.json', 'example.receipt.json': 'example.template-resource-extension-receipt.json'}
for old, new in names.items():
    value = (draft / old).read_text().replace('urn:flowark:drafts:template-resource-extension:1', 'urn:flowark:contracts:0.53.0:template-resource-extension:1').replace('Unpublished directory resource extension shapes', 'Directory resource extension 1.0')
    (target / new).write_text(value)
wire = json.loads((target / names['wire.schema.json']).read_text())
schema = json.loads((source / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.53.0/p1.schema.json'
def renamed(value):
    if isinstance(value, list):
        return [renamed(v) for v in value]
    if isinstance(value, dict):
        return {k: '#/$defs/TemplateResourceExtension' + v.removeprefix('#/$defs/') if k == '$ref' and isinstance(v, str) and v.startswith('#/$defs/') else renamed(v) for k, v in value.items()}
    return value
for name, value in wire['$defs'].items():
    assert 'TemplateResourceExtension' + name not in schema['$defs']
    schema['$defs']['TemplateResourceExtension' + name] = renamed(value)
schema['$defs']['RunSnapshot']['properties']['templateResourceExtension'] = {'$ref': '#/$defs/TemplateResourceExtensionReceipt'}
(target / 'p1.schema.json').write_text(json.dumps(schema, ensure_ascii=False, indent=2) + '\n')
(target / 'README.md').write_text('# 0.53.0 目录资源声明扩展候选\n\n继承 0.52.0，仅追加目录声明预览/接入请求、不可变回执与 Run 固定字段。原模板包身份、业务字节、状态、来源 proof/index 和既有动作保持。详见 [规范](template-resource-extension.md)。当前未发布，尚无客户端采用、安装或业务验收；旧快照不改写，标准 ZIP/SDK 版本保持。\n')
files = sorted(p for p in target.iterdir() if p.is_file() and p.name not in {'README.md', 'SHA256SUMS'})
(target / 'SHA256SUMS').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in files))
print('Sealed', len(files), 'machine files in', target)
