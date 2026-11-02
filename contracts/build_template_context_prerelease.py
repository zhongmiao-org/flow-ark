"""Align context package versions with the existing archive version grammar."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).parent
source = root / 'v0.53.1'
target = root / 'v0.53.2'
target.mkdir(exist_ok=True)
for line in (source / 'SHA256SUMS').read_text().splitlines():
    expected, name = line.split('  ', 1)
    content = (source / name).read_bytes()
    assert hashlib.sha256(content).hexdigest() == expected, name
    (target / name).write_bytes(content)
schema = json.loads((target / 'p1.schema.json').read_text())
schema['$id'] = 'https://flowark.local/contracts/0.53.2/p1.schema.json'
owner = schema['$defs']['TemplateDataOwner']['oneOf'][0]
owner['properties']['package']['properties']['version'] = dict(
    schema['$defs']['TemplateArchiveManifest']['properties']['version']
)
(target / 'p1.schema.json').write_text(
    json.dumps(schema, ensure_ascii=False, indent=2) + '\n'
)
(target / 'README.md').write_text(
    '# 0.53.2 模板配置上下文版本校验修正\n\n'
    '配置与状态上下文沿用标准模板 ZIP 已有的版本语法，允许 '
    '`0.2.67-rc.1` 等候选版本。此前包安装允许候选版本，配置节点却在运行前拒绝同一版本；'
    '本修正统一两处校验，保留实际完整版本字符串、包摘要、实例及入口身份。\n\n'
    '不增加包格式、SDK、能力或授权；写入范围、修订、归属、取消和外发去重规则保持。'
    '历史快照不改写。由 `../build_template_context_prerelease.py` 重建；'
    '发布、客户端采用与真实运行分别核对。\n'
)
names = [line.split('  ', 1)[1] for line in (source / 'SHA256SUMS').read_text().splitlines()]
(target / 'SHA256SUMS').write_text(''.join(
    hashlib.sha256((target / name).read_bytes()).hexdigest() + '  ' + name + '\n'
    for name in names
))
print('Rebuilt', len(names), 'files; only context version grammar and schema identity changed.')
