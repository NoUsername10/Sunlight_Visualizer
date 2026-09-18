"""Build verified installation and GitHub ZIPs without publishing card source."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
integration = ROOT / 'custom_components/sunlight_visualizer'
version = json.loads((integration / 'manifest.json').read_text())['version']
# Development builds keep their source/version checks locally. The public
# repository can package and test the shipped integration without frontend/.
if (ROOT / 'frontend').exists():
    package = json.loads((ROOT / 'frontend/package.json').read_text())
    lock = json.loads((ROOT / 'frontend/package-lock.json').read_text())
    if package['version'] != version or lock['version'] != version:
        raise SystemExit('Integration/frontend version mismatch')
    if (integration/'www/sunlight-visualizer-card.js').read_bytes() != (ROOT/'dist/sunlight-visualizer-card.js').read_bytes():
        raise SystemExit('Integration/dist bundle mismatch')
if not (integration/'www/sunlight-visualizer-card.js').is_file():
    raise SystemExit('Packaged card bundle missing')
for required in [
    '.github/workflows/release-checks.yaml', 'scripts/validate-package.mjs',
    'scripts/validate-webgl-shaders.mjs', 'tests/test_backend_smoke.py',
]:
    if not (ROOT / required).is_file():
        raise SystemExit('Required release check file missing: ' + required)
if not (integration/'www/models/experimental-house.glb').is_file():
    raise SystemExit('Bundled model missing')

OUTPUT = ROOT/'release-artifacts'
OUTPUT.mkdir(exist_ok=True)
EXCLUDED = {'frontend', 'dist', 'node_modules', '__pycache__', '.git', '_archive', 'release-artifacts', 'releases', '.venv'}
def allowed(path):
    rel = path.relative_to(ROOT)
    if any(part in EXCLUDED for part in rel.parts):
        return False
    if path.is_symlink():
        return False
    if path.name.startswith('.env') or path.name == '.DS_Store' or path.suffix in {'.pyc', '.pyo', '.blend', '.afdesign', '.ts', '.tsx', '.map'}:
        return False
    if rel.parts[:2] in {('assets','Blender'), ('assets','Car'), ('assets','GLB')}:
        return False
    return path.is_file()

def write_archive(destination, files, prefix=''):
    inventory = {}
    with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for path in sorted(files):
            name = prefix + path.relative_to(ROOT).as_posix()
            data = path.read_bytes()
            info = zipfile.ZipInfo(name, (2026,1,1,0,0,0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100755 if path.stat().st_mode & 0o111 else 0o100644) << 16
            z.writestr(info,data)
            inventory[name] = hashlib.sha256(data).hexdigest()
    with zipfile.ZipFile(destination) as z:
        if z.testzip() is not None or set(z.namelist()) != set(inventory):
            raise SystemExit('ZIP verification failed')
        for name,digest in inventory.items():
            if hashlib.sha256(z.read(name)).hexdigest() != digest:
                raise SystemExit('ZIP content mismatch: '+name)
    print(f'Verified {destination.name}: {len(inventory)} files, {destination.stat().st_size} bytes')
    return inventory

installation = OUTPUT/f'sunlight_visualizer-{version}.zip'
files = [p for p in integration.rglob('*') if allowed(p)]
inventory = write_archive(installation,files)
(OUTPUT/'file-sha256.json').write_text(json.dumps(inventory,indent=2)+'\n')
github = OUTPUT/f'Sunlight_Visualizer-{version}-github.zip'
roots = ['.github','custom_components','tests','scripts','wiki','assets','Icons']
github_files = [p for name in roots for p in (ROOT/name).rglob('*') if allowed(p)]
github_files += [p for p in ROOT.iterdir() if allowed(p) and (p.suffix in {'.md','.json','.command'} or p.name in {'LICENSE','.gitignore'})]
write_archive(github,set(github_files),prefix='sunlight_visualizer/')
(OUTPUT/'SHA256SUMS').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}\n' for p in [github,installation]))
# Retire the old generated upload archive so it cannot publish card source by mistake.
legacy_source = OUTPUT/f'Sunlight_Visualizer-{version}-source.zip'
if legacy_source.exists():
    legacy_source.unlink()
print('Card source, build dependencies and authoring assets excluded. No Git or network access used.')
