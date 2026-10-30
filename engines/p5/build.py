# reel-p5:build
# python3 ../../engines/p5/build.py [--images DIR] [--check]   (run inside the reel's folder)
# index.html = engines/p5/template.html + reel.js (+ the kits it includes) (+ images.js).
#
# reel.js directives:
#   // @fonts Libre+Baskerville:wght@700 Amiri+Quran      one Google Fonts <link> per family (default: Poppins:wght@800)
#   /*@@include realism-kit@@*/                            pastes engines/p5/realism-kit.js (or engines/shared/<name>.js) on that line
# --images turns a folder of images into images.js (file names become labels, read with loadAssets(window.REEL_IMAGES)).
# --check renders a contact sheet and lists scenes, captions and cues with engines/p5/check_reel.py (needs Playwright).
import argparse, base64, io, json, pathlib, re, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
SHARED = HERE.parent / 'shared'
INCLUDE = re.compile(r'^[ \t]*/\*@@include ([\w-]+)@@\*/[ \t]*$', re.M)

def include(m):
    name = m.group(1)
    for d in (HERE, SHARED):
        f = d / f'{name}.js'
        if f.exists():
            return f'// ── {name}.js (engines/{d.name}/, pasted by build.py: edit it there, not here) ──\n' + f.read_text(encoding='utf-8').rstrip()
    sys.exit(f'✗ /*@@include {name}@@*/: no engines/p5/{name}.js or engines/shared/{name}.js')

def fonts(src):
    fams = []
    for line in re.findall(r'^//\s*@fonts\s+(.+)$', src, re.M):
        fams += line.split()
    fams = fams or ['Poppins:wght@800']
    return '\n'.join(f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={f}&display=block" />' for f in fams)

def encode(folder):
    from PIL import Image
    out, rows = {}, []
    for f in sorted(pathlib.Path(folder).iterdir()):
        if f.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        img = Image.open(f); alpha = img.mode in ('RGBA', 'LA', 'P') and img.convert('RGBA').getextrema()[3][0] < 250
        img = img.convert('RGBA' if alpha else 'RGB'); img.thumbnail((2048, 2048), Image.LANCZOS)
        buf = io.BytesIO(); img.save(buf, 'WEBP', quality=85, alpha_quality=100, method=6)
        out[f.stem] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
        rows.append(f'{f.stem:24s} {img.width}x{img.height}  {"alpha" if alpha else "opaque"}  {len(buf.getvalue()) // 1024} KB')
    pathlib.Path('images.js').write_text('window.REEL_IMAGES = ' + json.dumps(out) + ';\n')
    print('\n'.join(rows) or '(no images found)')

def source_block():   # the reel's own files inside index.html, so a downloaded page can be unpacked later (tools/unpack-reel.js)
    files = {n: pathlib.Path(n).read_text(encoding='utf-8') for n in ('reel.js', 'script.md', 'reel.json') if pathlib.Path(n).exists()}
    return '<script type="application/json" id="reel-source">' + base64.b64encode(json.dumps(files).encode()).decode() + '</script>\n'

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--images'); ap.add_argument('--check', action='store_true'); a = ap.parse_args()
    if a.images:
        encode(a.images)
    reel = pathlib.Path('reel.js')
    if not reel.exists():
        sys.exit('✗ no reel.js here: run this inside the reel folder (reels/<date>-<topic>/)')
    src = reel.read_text(encoding='utf-8')
    code = INCLUDE.sub(include, src)
    imgs = f'<script>\n{pathlib.Path("images.js").read_text()}</script>' if pathlib.Path('images.js').exists() else ''
    tpl = (HERE / 'template.html').read_text(encoding='utf-8')
    html = tpl.replace('<!--@@FONTS@@-->', fonts(src)).replace('<!--@@IMAGES@@-->', imgs).replace('/*@@REEL@@*/', code)
    i = html.rindex('</body>'); html = html[:i] + source_block() + html[i:]
    pathlib.Path('index.html').write_text(html, encoding='utf-8')
    kits = INCLUDE.findall(src)
    print(f'index.html {len(html) // 1024} KB · kits: {", ".join(kits) or "none"} · fonts: {fonts(src).count("<link")}')
    if a.check:
        sys.exit(subprocess.call([sys.executable, str(HERE / 'check_reel.py'), 'index.html', '--out', '.check']))
