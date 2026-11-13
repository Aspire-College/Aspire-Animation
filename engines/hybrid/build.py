# reel25d:build
# python3 build.py [--images DIR] [--check]: index.html = template.html (with its built-in sound library) + reel.js (+ images.js).
# --images turns the user's images into images.js (file names become picture keys); --check draws every frame with a stand-in Three.js and p5.js.
import argparse, base64, io, json, pathlib, re, shutil, subprocess
F = '`' * 3
HERE = pathlib.Path(__file__).resolve().parent   # engines/<engine>/ in the aspire-animation repo; run this inside the reel's folder

def sfx_library():
    hit = subprocess.run('grep -rlF --include=SKILL.md "SFX library: NATURE" /mnt /root /home /opt 2>/dev/null | head -1', shell=True, capture_output=True, text=True).stdout.strip()
    if hit:
        t = pathlib.Path(hit).read_text(encoding='utf-8'); i = t.find('/** SFX library: NATURE'); ends = [e for e in (t.find('\n// Old cue names', i), t.find('\n' + F, i)) if e > i]
        if i >= 0 and ends: return t[i:min(ends)], hit
    return 'const SFX = {}, BEDS = new Set(); const bedCatchUp = () => null;', None

def encode(folder):
    import numpy as np
    from PIL import Image
    out, rows = {}, []
    for f in sorted(pathlib.Path(folder).iterdir()):
        if f.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'): continue
        a = np.array(Image.open(f).convert('RGBA')); kind, note, pieces = f.stem.split('_')[0], '', [(f.stem, None)]
        if kind in ('cut', 'layer'):
            if (a[:, :, 3] < 250).mean() < 0.02:                      # no real transparency: key out flat magenta
                d = np.abs(a[:, :, :3].astype(int) - [255, 0, 255]).sum(2)
                if (d < 90).mean() > 0.05: a[:, :, 3] = np.clip((d - 60) * 4, 0, 255).astype('uint8'); note = 'magenta keyed'
                else: note = '✗ NO TRANSPARENCY (checkerboard?): ask for a repair'
        if kind == 'cut':
            cols = np.where((a[:, :, 3] > 40).any(0))[0]; spans, s0 = [], cols[0] if len(cols) else 0
            for i in range(1, len(cols)):
                if cols[i] - cols[i - 1] > a.shape[1] * 0.02: spans.append((s0, cols[i - 1] + 1)); s0 = cols[i]
            if len(cols): spans.append((s0, cols[-1] + 1))
            pieces = [(f.stem + (f'_{j + 1}' if len(spans) > 1 else ''), (x0, x1)) for j, (x0, x1) in enumerate(spans)]
        for key, span in pieces:
            arr = a
            if span:                                                   # one figure, trimmed, edge colours bled into the clear area
                sub = a[:, span[0]:span[1]]; ys = np.where((sub[:, :, 3] > 40).any(1))[0]; arr = sub[ys[0]:ys[-1] + 1].copy(); have = arr[:, :, 3] > 8
                for _ in range(10):
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        take = np.roll(np.roll(have, dy, 0), dx, 1) & ~have; arr[:, :, :3][take] = np.roll(np.roll(arr[:, :, :3], dy, 0), dx, 1)[take]; have |= take
            big = 2048 if kind in ('plate', 'layer') else 1280; img = Image.fromarray(arr); img.thumbnail((big, big), Image.LANCZOS)
            if kind not in ('cut', 'layer'): img = img.convert('RGB')
            buf = io.BytesIO(); img.save(buf, 'WEBP', quality=85, alpha_quality=100, method=6)
            out[key] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(); seam = ''
            if kind == 'tile':                                         # the wrap-around step vs the usual step between neighbours
                t = np.array(img.convert('RGB')).astype(float); jx = np.abs(t[:, 0] - t[:, -1]).mean() / (np.abs(np.diff(t, axis=1)).mean() + 1e-6); jy = np.abs(t[0] - t[-1]).mean() / (np.abs(np.diff(t, axis=0)).mean() + 1e-6)
                seam = f'seam {jx:.1f}x / {jy:.1f}x' + ('  ✗ SEAM: ask for a repair' if max(jx, jy) > 5 else '  • possible seam: look for it in the screenshots' if max(jx, jy) > 3 else '')
            rows.append(f'{key:20s} {img.width}x{img.height}  h/w {img.height / img.width:.3f}  {len(buf.getvalue()) // 1024} KB  {note}{seam}')
    pathlib.Path('images.js').write_text('window.REEL_IMAGES = ' + json.dumps(out) + ';\n'); print('\n'.join(rows))

HARNESS = r'''
const mk = () => { const p = new Proxy(function () {}, { get: (t, k) => k === 'then' ? undefined : k === Symbol.toPrimitive ? () => 0 : k === Symbol.iterator ? function* () {} : p, set: () => true, apply: () => p, construct: () => p }); return p; }, S = mk();
Object.assign(globalThis, { THREE: new Proxy({}, { get: () => S }), window: globalThis, innerWidth: 1200, innerHeight: 900, addEventListener() {}, requestAnimationFrame: () => 0, cancelAnimationFrame() {},
  document: { getElementById: () => S, createElement: () => S, addEventListener() {}, body: S, head: S, fonts: { load: () => Promise.resolve() }, hidden: false },
  Image: class { set src(v) { this.naturalWidth = 400; this.naturalHeight = 600; setTimeout(() => this.onload && this.onload(), 0); } }, REEL_IMAGES: __IMAGES__ });

const P5API = new Set(`arc ellipse circle line point quad rect square triangle bezier bezierPoint bezierTangent curve curvePoint curveTangent curveTightness bezierDetail curveDetail beginShape endShape vertex bezierVertex quadraticVertex curveVertex beginContour endContour ellipseMode rectMode strokeCap strokeJoin strokeWeight smooth noSmooth erase noErase background clear fill noFill stroke noStroke colorMode color red green blue alpha hue saturation brightness lightness lerpColor blendMode push pop translate rotate scale shearX shearY applyMatrix resetMatrix angleMode radians degrees random randomGaussian randomSeed noise noiseSeed noiseDetail map constrain lerp dist mag norm abs ceil floor round sq sqrt pow exp log max min fract sin cos tan asin acos atan atan2 createVector loadPixels updatePixels get set image tint noTint imageMode copy blend filter createImage createGraphics text textFont textSize textAlign textStyle textWidth textLeading textAscent textDescent reset remove hide show resizeCanvas pixelDensity drawingContext
PI TWO_PI HALF_PI QUARTER_PI TAU CLOSE ROUND SQUARE PROJECT MITER BEVEL CORNER CORNERS CENTER RADIUS RGB HSB HSL BLEND ADD MULTIPLY SCREEN DARKEST LIGHTEST REMOVE OVERLAY SOFT_LIGHT HARD_LIGHT DIFFERENCE EXCLUSION BURN DODGE REPLACE RADIANS DEGREES LEFT RIGHT TOP BOTTOM BASELINE NORMAL ITALIC BOLD BOLDITALIC POINTS LINES TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS OPEN CHORD PIE THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR`.split(/\s+/));
const NOT_P5 = { beginPath: 'p.beginShape()', closePath: 'p.endShape(p.CLOSE)', moveTo: 'p.vertex', lineTo: 'p.vertex', fillRect: 'p.rect', strokeRect: 'p.rect', clearRect: 'p.clear() or p.erase()', fillStyle: 'p.fill', strokeStyle: 'p.stroke', lineWidth: 'p.strokeWeight', globalAlpha: 'an alpha in p.fill', globalCompositeOperation: 'p.erase() / p.blendMode', save: 'p.push()', restore: 'p.pop()', quadraticCurveTo: 'p.quadraticVertex', bezierCurveTo: 'p.bezierVertex', createLinearGradient: 'gradient(p, …)', createRadialGradient: 'radial(p, …)', setTransform: 'p.resetMatrix / p.translate', drawImage: 'p.image', getImageData: 'pixels(p, …) or p.loadPixels', putImageData: 'pixels(p, …) or p.updatePixels', shadowBlur: 'shadow(p, …)', shadowColor: 'shadow(p, …)', fillText: 'p.text', strokeText: 'p.text with p.stroke', measureText: 'p.textWidth', roundRect: 'p.rect(x, y, w, h, r)', lineCap: 'p.strokeCap', lineJoin: 'p.strokeJoin', arc: 'p.arc', filter: 'soft(p, …)', direction: 'textDir(p, …)' };
const badP5 = new Map();   // names the pictures asked of a p5.Graphics that p5 doesn't have (a typo, or a Canvas 2D call that belongs on p.drawingContext)
const gfx = (w, h) => new Proxy({ width: w, height: h, elt: S, canvas: S, drawingContext: S, pixels: S, _pixelDensity: 1, _renderer: S }, { get: (t, k) => k in t ? t[k] : typeof k === 'symbol' || k === 'then' ? undefined : (P5API.has(k) || badP5.set(k, (badP5.get(k) || 0) + 1), S), set: () => true });
globalThis.p5 = class { constructor() { this._pixelDensity = 1; this.createGraphics = gfx; } };
let errs = 0;
try { await import('./run.mjs'); } catch (e) { errs++; console.log('✗ while building:', String(e.stack || e).split('\n').slice(0, 3).join(' | ')); }
const R = globalThis.__check;
if (R) {
  const { TL, renderAt, camAt, veilOf, screenOf, screenR, clearance, SCRIPT, CHECKS, SFX, MAP, meshes, cards, tex, AT, lv, grounds } = R, n = Math.ceil(TL.len * 30); let top = 0, at = 0, prev = null, low = null; const edge = new Map(), thin = new Map();
  const norm = v => { const l = Math.hypot(...v) || 1; return v.map(q => q / l); }, CD = cards.filter(k => !k.bill && k.lvl && !k.flat && Math.abs(k.rx) < 1).map(k => { const L = lv(k.lvl), n0 = [Math.cos(k.rx) * Math.sin(k.ry), -Math.sin(k.rx), Math.cos(k.rx) * Math.cos(k.ry)]; return { ...k, p: AT(k.lvl, k.c), n: norm([L.M[0] * n0[0] + L.M[1] * n0[1] + L.M[2] * n0[2], L.M[3] * n0[0] + L.M[4] * n0[1] + L.M[5] * n0[2], L.M[6] * n0[0] + L.M[7] * n0[1] + L.M[8] * n0[2]]), R: k.r * L.s }; });
  for (let i = 0; i <= n; i++) {
    const T = Math.min(i / 30, TL.len - 1e-4);
    try { renderAt(T); } catch (e) { if (errs++ < 5) console.log(`✗ at ${T.toFixed(2)} s: ${e.message} | ${String(e.stack).split('\n')[1]}`); }
    const c = camAt(T), p = c.p; if (prev && veilOf(c).va < 0.5) { const s = Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]) / Math.max(1e-12, c.d); if (s > top) { top = s; at = T; } } prev = p;
    const g = clearance(T); if (g && (!low || g.y < low.y)) low = { ...g, T };
    if (i % 3 === 0) for (const k of CD) { const s = screenOf(k.p, T); if (!s || s[0] < 0 || s[0] > 1080 || s[1] < 0 || s[1] > 1920 || screenR(k.p, k.R, T) < 150) continue; const v = norm([c.p[0] - k.p[0], c.p[1] - k.p[1], c.p[2] - k.p[2]]), ang = Math.acos(Math.min(1, Math.abs(v[0] * k.n[0] + v[1] * k.n[1] + v[2] * k.n[2]))) * 180 / Math.PI, e = edge.get(k.name); if (ang > 55 && (!e || ang > e.ang)) edge.set(k.name, { ang, T }); }
    if (i % 3 === 0) grounds.forEach((g, j) => { const q = [[g.x0, g.z0], [g.x1, g.z0], [g.x0, g.z1], [g.x1, g.z1]].map(([x, z]) => screenOf(AT(g.key, [x, g.y, z]), T)); if (q.some(s => !s)) return; const xs = q.map(s => s[0]), ys = q.map(s => s[1]), wd = Math.min(1080, Math.max(...xs)) - Math.max(0, Math.min(...xs)), ht = Math.max(...ys) - Math.min(...ys), my = (Math.max(...ys) + Math.min(...ys)) / 2; if (wd > 250 && ht < 30 && my > 0 && my < 1920) thin.set(j, { T, name: g.name }); });   // a floor seen edge-on is a line across the picture   // a big card seen too far off its front shows it is flat
  }
  console.log(`${errs ? '✗' : '✓'} ${n + 1} frames, ${errs} errors (code only: this can't see the picture)`);
  console.log(badP5.size ? [...badP5.keys()].map(k => `✗ p5 has no "${k}"` + (NOT_P5[k] ? `: that is Canvas 2D, use ${NOT_P5[k]}` : ': a typo, or not part of p5 1.x')).join('\n') : '✓ every p5 function the pictures call exists in p5 1.x');
  console.log(`${top > 0.2 ? '✗' : '✓'} fastest camera move ${(top * 100).toFixed(1)}% of its viewing distance in a frame, at ${at.toFixed(2)} s (over 20% is a jump)`);
  if (low) console.log(`${low.y < 0.3 ? '✗' : '✓'} lowest camera ${low.y.toFixed(2)} m above the ground of ${low.key}, at ${low.T.toFixed(2)} s`);
  const nm = meshes(); console.log(`${nm > 500 ? '✗' : nm > 300 ? '•' : '✓'} ${nm} cards and meshes (over 300 may slow recording: paint several things on one card)`);
  console.log(`${tex.px > 9e7 ? '✗' : tex.px > 5e7 ? '•' : '✓'} ${tex.n} pictures, ${(tex.px / 1e6).toFixed(1)} megapixels of canvas (over 50 is heavy: size each picture to what the camera sees)`);
  if (tex.live) console.log(`${tex.live > 2.5e6 ? '✗' : tex.live > 1.2e6 ? '•' : '✓'} live pictures: ${(tex.live / 1e6).toFixed(2)} megapixels repainted every frame (over 1.2 slows playback: keep live pictures small)`);
  const eg = [...edge.entries()].sort((a, b) => b[1].ang - a[1].ang).slice(0, 4); console.log(eg.length ? eg.map(([k, e]) => `${e.ang > 70 ? '✗' : '•'} card "${k}" seen ${e.ang.toFixed(0)}° off its front at ${e.T.toFixed(2)} s (a flat card shows its trick past about 35°: move the camera, turn the card, or bill: true)`).join('\n') : '✓ every big card seen within 55° of its front'); for (const [, e] of thin) console.log(`• floor "${e.name}" seen edge-on at ${e.T.toFixed(2)} s: a thin line across the picture (raise or lower the camera, or end the floor before it)`);
  const short = SCRIPT.filter(l => l.end - l.start < 1.2).map(l => `"${l.text.slice(0, 28)}" ${(l.end - l.start).toFixed(2)} s`); if (short.length) console.log('• lines under 1.2 s: ' + short.join('; '));
  const bad = [...new Set(TL.cues.filter(c => !SFX[c.type]).map(c => c.type))]; console.log(bad.length ? '✗ unknown sounds: ' + bad.join(', ') : Object.keys(SFX).length ? `✓ ${TL.cues.length} sound cues` : '✗ no sound library: silent');
  if (MAP && MAP.length) {   // the shot list: [time, place, distance, angle, people, move into it]
    const MOVES = ['through', 'pull-back', 'zoom', 'rise', 'fall', 'follow', 'along', 'unfold', 'page', 'orbit', 'new-state', 'pour', 'match'], out = [];
    MAP.forEach((m, i) => {
      const [t, key, dist, angle, people, move] = m, q = MAP[i - 1], id = `${t} s ${key}`;
      if (!['close', 'medium', 'wide'].includes(dist)) out.push(`✗ ${id}: distance must be close, medium or wide`); if (!['eye', 'high', 'top', 'low', 'along'].includes(angle)) out.push(`✗ ${id}: angle must be eye, high, top, low or along`);
      if (i && !MOVES.includes(move)) out.push(`✗ ${id}: move must be one of ${MOVES.join(', ')}`);
      if (people && /high|top/.test(angle)) out.push(`✗ ${id}: people in a ${angle} shot (flat cut-outs vanish from above)`);
      if (q && q[2] === dist && q[3] === angle) out.push(`✗ ${id}: same distance and angle as the shot before`);
    });
    const moves = MAP.slice(1).map(m => m[5]), dup = [...new Set(moves.filter((j, i) => moves.indexOf(j) !== i))]; if (dup.length) out.push('✗ moves used twice: ' + dup.join(', '));
    const shots = new Set(MAP.map(m => m[2] + ' ' + m[3])); if (MAP.length >= 4 && shots.size < 3) out.push('✗ fewer than three kinds of shot');
    console.log(out.length ? out.join('\n') : `✓ shot list: ${MAP.length} shots, ${shots.size} kinds of shot, every move different`);
  } else console.log('• no MAP (shot list): variety not checked');
  for (const [t0, label, ...pts] of CHECKS) {
    const t = t0 < 0 ? TL.len + t0 : t0, out = pts.map(p => {
      if (p && !Array.isArray(p) && p.a) {   // a shape match: { a: point, ra: radius, b: point, rb: radius } must line up on screen
        const A = screenOf(p.a, t), B = screenOf(p.b, t), ra = screenR(p.a, p.ra, t), rb = screenR(p.b, p.rb, t); if (!A || !B) return '✗ MATCH BEHIND THE CAMERA';
        const gap = Math.hypot(A[0] - B[0], A[1] - B[1]), sz = Math.max(ra, rb) / Math.max(1e-9, Math.min(ra, rb));
        return `match: centres ${gap.toFixed(0)} px apart, sizes ${ra.toFixed(0)}/${rb.toFixed(0)} px ` + (gap > 30 || sz > 1.3 ? '✗ NOT LINED UP' : 'ok');
      }
      const s = screenOf(p, t); if (!s) return '✗ BEHIND THE CAMERA'; const [x, y] = s;
      return `(${x.toFixed(0)}, ${y.toFixed(0)}) ` + (x < 0 || x > 1080 || y < 0 || y > 1920 ? '✗ OFF FRAME' : y > 1250 ? '✗ BELOW THE SAFE AREA' : y > 300 && y < 650 ? '✗ IN THE CAPTION BAND' : y < 300 ? '✗ UNDER THE TOP BAR' : x < 65 || x > 1015 ? '✗ AT THE EDGE' : 'ok'); });
    console.log(`  ${t.toFixed(2).padStart(6)} s  ${label}${out.length ? ': ' + out.join('; ') : ''}`);
  }
}
'''

def check(html):
    node = shutil.which('node')
    if not node: return print('node is missing: the code was not checked')
    mod = html.split('<script type="module">', 1)[1].split('</script>', 1)[0]; d = pathlib.Path('.check'); d.mkdir(exist_ok=True); (d / 'm.mjs').write_text(mod)
    r = subprocess.run([node, '--check', str(d / 'm.mjs')], capture_output=True, text=True)
    if r.returncode: return print('✗ SYNTAX ERROR\n' + r.stderr[-1500:])
    (d / 'run.mjs').write_text('const { THREE } = globalThis;\n' + re.sub(r'^import .*$', '', mod, flags=re.M) + '\nglobalThis.__check = { TL, renderAt, camAt, veilOf, screenOf, screenR, clearance, SCRIPT, CHECKS: typeof CHECKS === "undefined" ? [] : CHECKS, SFX, MAP: typeof MAP === "undefined" ? null : MAP, meshes: () => MESHES, cards: CARDS, tex: TEX, AT, lv, grounds: GROUNDS };\n')
    raw = sorted(set(re.findall(r'drawingContext|getContext\(|\.ctx\b', pathlib.Path('reel.js').read_text())))
    if raw: print('✗ reel.js reaches the raw canvas (' + ', '.join(raw) + '): paint with p5 and the helpers (gradient, radial, soft, shadow, textDir, wash, pixels, grain)')
    keys = re.findall(r'"([^"]+)": "data:', pathlib.Path('images.js').read_text()) if pathlib.Path('images.js').exists() else []
    (d / 'harness.mjs').write_text(HARNESS.replace('__IMAGES__', json.dumps({k: '' for k in keys})))
    r = subprocess.run([node, 'harness.mjs'], capture_output=True, text=True, cwd=d, timeout=300); print((r.stdout + r.stderr)[-6000:])

def source_block():   # the reel's own files inside index.html, so a downloaded page can be unpacked later (tools/unpack-reel.js)
    files = {n: pathlib.Path(n).read_text(encoding='utf-8') for n in ('reel.js', 'script.md', 'reel.json') if pathlib.Path(n).exists()}
    return '<script type="application/json" id="reel-source">' + base64.b64encode(json.dumps(files).encode()).decode() + '</script>\n'

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--images'); ap.add_argument('--check', action='store_true'); a = ap.parse_args()
    if a.images: encode(a.images)
    imgs = f'<script>\n{pathlib.Path("images.js").read_text()}</script>' if pathlib.Path('images.js').exists() else ''
    tpl = (pathlib.Path('template.html') if pathlib.Path('template.html').exists() else HERE / 'template.html').read_text()   # repo: the engine's own template
    lib, src = sfx_library() if '/*@@SFX@@*/' in tpl else ('', 'the engine (built in)')
    html = tpl.replace('<!-- reel3d:template -->\n', '').replace('<!--@@IMAGES@@-->', imgs).replace('/*@@SFX@@*/', lib).replace('/*@@REEL@@*/', pathlib.Path('reel.js').read_text())
    i = html.rindex('</body>'); html = html[:i] + source_block() + html[i:]
    pathlib.Path('index.html').write_text(html); print(f'index.html {len(html) // 1024} KB · sound library ' + (f'from {src}' if src else '✗ not found: silent'))
    if a.check: check(html)
