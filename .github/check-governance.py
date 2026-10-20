"""Read-only governance checks; no application checkout or dependencies required."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
tracked = subprocess.check_output(['git', 'ls-files'], cwd=root, text=True).splitlines()
assert not any(p.startswith(('flow-ark-client/', 'flow-ark-server/', 'flow-ark-admin/', 'flow-ark-templates/')) for p in tracked)
assert not (root / '.gitmodules').exists()
for name in ['flow-ark-client', 'flow-ark-server', 'flow-ark-admin', 'flow-ark-templates']:
    subprocess.run(['git', 'check-ignore', '--no-index', name + '/probe'], cwd=root, check=True, stdout=subprocess.DEVNULL)
for manifest in sorted((root / 'contracts').glob('v*/SHA256SUMS')):
    for line in manifest.read_text().splitlines():
        checksum, filename = line.split('  ', 1)
        file = manifest.parent / filename
        assert hashlib.sha256(file.read_bytes()).hexdigest() == checksum, file
        if file.suffix == '.json':
            json.loads(file.read_text())
for name in tracked:
    if not name.endswith('.md'):
        continue
    file = root / name
    link_base = file.parent
    if file.name == 'snapshot-README.md' and file.parent.parent == root / 'contracts/drafts':
        originals = [p for p in (root / 'contracts').glob('v*/README.md')
                     if p.read_bytes() == file.read_bytes()]
        assert len(originals) == 1, f'{name}: snapshot must match one published README'
        link_base = originals[0].parent
    for target in re.findall(r'\]\(([^\s)]+)', file.read_text()):
        if ':' in target or target.startswith(('#', '/')):
            continue
        target = unquote(target.split('#')[0])
        assert (link_base / target).exists(), f'{name}: missing {target}'
print('Governance links, repository boundaries and contract checksums passed.')
