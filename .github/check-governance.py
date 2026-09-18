"""Read-only governance checks; no application checkout or dependencies required."""
import hashlib
import json
import re
import subprocess
from pathlib import Path
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
tracked = subprocess.check_output(['git', 'ls-files'], cwd=root, text=True).splitlines()
assert not any(p.startswith(('flow-ark-client/', 'flow-ark-server/', 'flow-ark-admin/')) for p in tracked)
assert not (root / '.gitmodules').exists()
for name in ['flow-ark-client', 'flow-ark-server', 'flow-ark-admin']:
    subprocess.run(['git', 'check-ignore', '--no-index', name + '/probe'], cwd=root, check=True, stdout=subprocess.DEVNULL)
for manifest in sorted((root / 'contracts').glob('v*/SHA256SUMS')):
    for line in manifest.read_text().splitlines():
        checksum, filename = line.split('  ', 1)
        file = manifest.parent / filename
        assert hashlib.sha256(file.read_bytes()).hexdigest() == checksum, file
        json.loads(file.read_text())
for name in tracked:
    if not name.endswith('.md'):
        continue
    file = root / name
    for target in re.findall(r'\]\(([^\s)]+)', file.read_text()):
        if ':' in target or target.startswith(('#', '/')):
            continue
        target = unquote(target.split('#')[0])
        assert (file.parent / target).exists(), f'{name}: missing {target}'
print('Governance links, repository boundaries and contract checksums passed.')
