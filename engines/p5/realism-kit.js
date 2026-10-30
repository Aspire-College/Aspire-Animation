// wallTop/wallBot = wall, wain = darker wainscot, rail = the light rail between them. Wood and ceramics are shared.
const ROOMS = {
  brick: { wallTop: '#6E3F34', wallBot: '#7D4A3C', wain: '#4A2A24', rail: '#C9A38F' },
  sage:  { wallTop: '#41605A', wallBot: '#4F6F66', wain: '#2E4640', rail: '#9DB0A2' },
  ochre: { wallTop: '#7B6A3A', wallBot: '#8B7843', wain: '#55482A', rail: '#CDBE8B' },
  dusk:  { wallTop: '#3C5370', wallBot: '#486285', wain: '#2B3A50', rail: '#9DB0C8' },
  olive: { wallTop: '#505C36', wallBot: '#5F6C41', wain: '#38422A', rail: '#A9B58A' },
  slate: { wallTop: '#4A4A5E', wallBot: '#585870', wain: '#34344A', rail: '#A9A9C0' },
  plum:  { wallTop: '#5A3A4A', wallBot: '#6A4757', wain: '#3F2733', rail: '#C4A3B4' },
};
const AR = {
  wallTop: '', wallBot: '', wain: '', rail: '',
  wood0: '#7B4F2D', wood1: '#A47445',
  cream: '#EFE8D4', shade: '#8B8068', coffee: '#2E1B12', ink: '#14181A', mustard: '#E9B44C',
  morning: '#F4E4A6', afternoon: '#F0C777', evening: '#E0884F', noon: '#FFF3C9',
};
const STYLE = {
  element: 'coffee',        // the one thing the script is about (a noun)
  room: 'sage',             // key of ROOMS, picked from the element's candidates (see SKILL.md)
  style: 'american-realism',
  font: 'Libre Baskerville',
  paper: AR.cream, ink: AR.ink, accent: '#B9722F',   // bg and palette (blinds transition) are set from the room
  line: 0, grain: 0, boil: 0,
};

// ════════════════════════════════════════════════════════════════════
//  3. CAPTIONS — one caption per script line, in the upper safe area
// ════════════════════════════════════════════════════════════════════
const CAPTIONS = {
  show: true,
  y: 0.25,
  size: 72,
  maxWidth: 860,
  maxLines: 3,
  maxWords: 7,
  color: '#F6EEDA',         // warm cream
  emphasis: AR.mustard,     // *word* in mustard
  box: '',
  padX: 30,
  radius: 24,
  outline: 8,               // dark halo so the caption holds over the light patches
  outlineColor: '#12171A',
};

// ════════════════════════════════════════════════════════════════════
//  3b. AMERICAN-REALISM KIT — room, window light, shaded objects, texture
// ════════════════════════════════════════════════════════════════════
function applyRoom(name) {
  const key = ROOMS[name] ? name : 'sage', r = ROOMS[key];
  Object.assign(AR, r); STYLE.room = key; STYLE.bg = r.wallTop; STYLE.palette = [r.wain, r.wallTop, AR.wood0, '#14181A'];
}
applyRoom(STYLE.room);
STYLE.post = arPost;       // engine hook: painted-canvas texture + vignette over the scene
const CT = 1160, CF = 1262;  // counter: back edge y, front edge y. Objects sit on it at y ≈ 1215.
const AR_TAU = Math.PI * 2;
function arRGBA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function arMixHex(a, b, k) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), f = (s) => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k);
  return '#' + [16, 8, 0].map(s => f(s).toString(16).padStart(2, '0')).join('');
}
const arLightAt = p => p < 0.5 ? arMixHex(AR.morning, AR.afternoon, p * 2) : arMixHex(AR.afternoon, AR.evening, (p - 0.5) * 2);   // p: 0 morning → 1 evening

/** The room: wall with a darker wainscot, wooden counter top, chrome edge, dark counter front. dim 0–1 darkens it (night). */
function arRoom(c, o = {}) {
  const wallTop = o.wallTop || AR.wallTop, wallBot = o.wallBot || AR.wallBot;
  let g = c.createLinearGradient(0, 0, 0, CT); g.addColorStop(0, wallTop); g.addColorStop(1, wallBot); c.fillStyle = g; c.fillRect(0, 0, W, CT);
  c.fillStyle = o.wain || AR.wain; c.fillRect(0, 930, W, CT - 930);
  c.fillStyle = arRGBA(AR.rail, 0.45); c.fillRect(0, 926, W, 6);
  g = c.createLinearGradient(0, CT, 0, CF); g.addColorStop(0, AR.wood0); g.addColorStop(1, AR.wood1); c.fillStyle = g; c.fillRect(0, CT, W, CF - CT);
  c.fillStyle = '#CFC9BC'; c.fillRect(0, CF, W, 8); c.fillStyle = 'rgba(255,255,255,0.55)'; c.fillRect(0, CF, W, 2);
  g = c.createLinearGradient(0, CF + 8, 0, H); g.addColorStop(0, '#2B2724'); g.addColorStop(1, '#141211'); c.fillStyle = g; c.fillRect(0, CF + 8, W, H - CF - 8);
  c.fillStyle = 'rgba(205,200,185,0.10)'; c.fillRect(0, 1590, W, 22);   // a chrome foot-rail catching a little light
  if (o.dim) { c.fillStyle = `rgba(7,10,18,${o.dim})`; c.fillRect(0, 0, W, H); }
}
/** Window light: a 2×3 grid of hard-edged panes on the wall (with a faint bloom) and its projection on the counter. */
function arWindowLight(c, o) {
  const gap = 20, pw = (o.w - gap) / 2, ph = (o.h - gap * 2) / 3, sk = o.shear;
  c.save(); c.globalCompositeOperation = 'screen';
  const pane = (px, py, e, a) => {
    const dx = sk * (py - o.y), x0 = px + dx - e, x1 = px + pw + dx + e, y0 = py - e, y1 = py + ph + e;
    c.fillStyle = arRGBA(o.col, a); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y0); c.lineTo(x1 + sk * (ph + 2 * e), y1); c.lineTo(x0 + sk * (ph + 2 * e), y1); c.closePath(); c.fill();
  };
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const px = o.x + k * (pw + gap), py = o.y + r * (ph + gap); pane(px, py, 14, o.a * 0.3); pane(px, py, 0, o.a * 1.15); }
  for (let k = 0; k < 2; k++) {   // on the counter, foreshortened
    const cx = o.x + o.cx + k * (pw + gap) * 0.9;
    c.fillStyle = arRGBA(o.col, o.a * 1.5); c.beginPath(); c.moveTo(cx, CT + 6); c.lineTo(cx + pw * 0.9, CT + 6); c.lineTo(cx + pw * 0.9 + 90 * sk * 3, CF - 6); c.lineTo(cx + 90 * sk * 3, CF - 6); c.closePath(); c.fill();
  }
  c.restore();
}
/** Dust motes floating in the light. */
function arMotes(c, T, n, seed, a) {
  const r = rng(seed); c.save();
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = 420 + r() * 740, sp = 4 + r() * 10, ph = r() * AR_TAU, rad = 1.2 + r() * 2.4;
    const y = 420 + ((((y0 - 420) - T * sp) % 740) + 740) % 740, x = x0 + Math.sin(T * 0.5 + ph) * 26;
    c.globalAlpha = a * (0.25 + 0.4 * (0.5 + 0.5 * Math.sin(T * 1.1 + ph))); c.fillStyle = '#FFF1C8'; c.beginPath(); c.arc(x, y, rad, 0, AR_TAU); c.fill();
  }
  c.restore();
}
/** A cup and saucer shaded in planes. Origin: centre of the cup's footprint, saucer at y+140 (so pass y ≈ 1075).
 *  o: { sd (-1…1: shadow side/length, light from the opposite side), steam 0–1, T, a, rot, sx, sy } */
function arCup(c, x, y, k, o = {}) {
  const sd = o.sd === undefined ? 0.6 : o.sd, dir = sd >= 0 ? 1 : -1, a = o.a === undefined ? 1 : o.a, L = dir * (90 + 200 * Math.abs(sd));
  c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(k * (o.sx || 1), k * (o.sy || 1)); c.globalAlpha *= a;
  // cast shadow on the counter: two soft layers
  for (const [e, al] of [[18, 0.12], [0, 0.3]]) {
    c.fillStyle = `rgba(12,14,16,${al})`; c.beginPath();
    c.moveTo(-170 - e, 146); c.lineTo(170 + e, 146); c.lineTo(150 + L + e, 178 + e * 0.3); c.quadraticCurveTo(L, 200 + e * 0.4, -150 + L - e, 178 + e * 0.3); c.closePath(); c.fill();
  }
  // saucer: underside, top, well
  c.fillStyle = '#7C725C'; c.beginPath(); c.ellipse(0, 156, 190, 26, 0, 0, AR_TAU); c.fill();
  let g = c.createLinearGradient(-190 * dir, 0, 190 * dir, 0); g.addColorStop(0, '#F3ECD8'); g.addColorStop(0.55, '#DDD3B9'); g.addColorStop(1, '#A89D84');
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 143, 190, 25, 0, 0, AR_TAU); c.fill();
  c.fillStyle = 'rgba(120,108,84,0.35)'; c.beginPath(); c.ellipse(0, 138, 112, 13, 0, 0, AR_TAU); c.fill();
  // handle (in the shade side when the light is from the left)
  c.save(); c.scale(dir, 1); c.lineCap = 'round';
  c.strokeStyle = '#A59A80'; c.lineWidth = 26; c.beginPath(); c.arc(122, -18, 58, -1.2, 1.25); c.stroke();
  c.strokeStyle = '#E6DCC2'; c.lineWidth = 8; c.beginPath(); c.arc(122, -22, 54, -1.1, 0.2); c.stroke(); c.restore();
  // body: lit side → shade side in planes
  g = c.createLinearGradient(-125 * dir, 0, 125 * dir, 0);
  g.addColorStop(0, '#F5EEDA'); g.addColorStop(0.3, '#E9E0C8'); g.addColorStop(0.62, '#C4B99E'); g.addColorStop(1, '#8F846B');
  c.fillStyle = g; c.beginPath(); c.moveTo(-125, -105); c.lineTo(125, -105); c.lineTo(112, 40); c.quadraticCurveTo(104, 118, 40, 120); c.lineTo(-40, 120); c.quadraticCurveTo(-104, 118, -112, 40); c.closePath(); c.fill();
  g = c.createLinearGradient(0, -20, 0, 124); g.addColorStop(0, 'rgba(60,48,30,0)'); g.addColorStop(1, 'rgba(60,48,30,0.28)'); c.fillStyle = g; c.fill();
  c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.moveTo(-96 * dir, -92); c.lineTo(-78 * dir, -92); c.lineTo(-76 * dir, 30); c.lineTo(-92 * dir, 30); c.closePath(); c.fill();   // window highlight
  // rim and coffee
  c.fillStyle = '#F2EBD7'; c.beginPath(); c.ellipse(0, -105, 125, 21, 0, 0, AR_TAU); c.fill();
  c.fillStyle = AR.coffee; c.beginPath(); c.ellipse(0, -103, 108, 15, 0, 0, AR_TAU); c.fill();
  c.fillStyle = 'rgba(214,170,120,0.35)'; c.beginPath(); c.ellipse(-30 * dir, -106, 38, 4, 0, 0, AR_TAU); c.fill();
  // steam: soft painted wisps that fade as they rise
  if ((o.steam || 0) > 0.01) {
    const T = o.T || 0; const sg = c.createLinearGradient(0, -120, 0, -410); sg.addColorStop(0, `rgba(246,238,218,${0.55 * o.steam})`); sg.addColorStop(1, 'rgba(246,238,218,0)');
    c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = sg;
    for (let w = -1; w <= 1; w++) for (const lw of [34, 18, 8]) {
      c.lineWidth = lw; c.globalAlpha = a * (lw === 34 ? 0.25 : lw === 18 ? 0.5 : 0.9); c.beginPath();
      for (let i = 0; i <= 24; i++) { const f = i / 24, px = w * 46 + Math.sin(f * 5 + T * 1.4 + w * 2) * (10 + 24 * f), py = -122 - 280 * f; i ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.stroke();
    }
  }
  c.restore();
}
/** Shade ANY silhouette as a solid object standing on the counter, so other scripts' objects match the cup.
 *  shape: Path2D in local coords, base centre at (0,0), body extending upward (negative y), about w wide and h tall.
 *  o: { x, y, k, w, h, sd, a, rot, light, dark }. y is the base on the counter (≈ 1215). Draw the objects behind first. */
function arSolid(c, shape, o) {
  const sd = o.sd === undefined ? 0.6 : o.sd, dir = sd >= 0 ? 1 : -1, w = o.w, h = o.h, a = o.a === undefined ? 1 : o.a;
  c.save(); c.translate(o.x, o.y); c.rotate(o.rot || 0); c.scale(o.k || 1, o.k || 1); c.globalAlpha *= a;
  for (const [e, al] of [[14, 0.12], [0, 0.3]]) {   // cast shadow: the silhouette flattened onto the counter and thrown away from the light
    c.save(); c.transform(1, 0, -sd * 0.9, -0.25, 0, 8); c.fillStyle = `rgba(12,14,16,${al})`; c.fill(shape, 'evenodd');
    if (e) { c.strokeStyle = `rgba(12,14,16,${al})`; c.lineWidth = e; c.lineJoin = 'round'; c.stroke(shape); } c.restore();
  }
  let g = c.createLinearGradient(-w / 2 * dir, 0, w / 2 * dir, 0); g.addColorStop(0, o.light || '#F0E8D2'); g.addColorStop(0.35, o.light || '#E4DAC0'); g.addColorStop(0.7, o.dark || '#A89C80'); g.addColorStop(1, '#6F6650');
  c.fillStyle = g; c.fill(shape, 'evenodd');
  g = c.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, 'rgba(40,32,20,0)'); g.addColorStop(1, 'rgba(40,32,20,0.3)'); c.fillStyle = g; c.fill(shape, 'evenodd');
  c.save(); c.clip(shape); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect((-w * 0.36 * dir) - w * 0.035, -h * 0.88, w * 0.07, h * 0.7); c.restore();   // window highlight
  c.restore();
}
const P_JAR = (() => { const p = new Path2D(); p.moveTo(-52, -118); p.lineTo(52, -118); p.lineTo(52, -92); p.lineTo(46, -92); p.quadraticCurveTo(70, -60, 66, -20); p.quadraticCurveTo(64, 0, 40, 0); p.lineTo(-40, 0); p.quadraticCurveTo(-64, 0, -66, -20); p.quadraticCurveTo(-70, -60, -46, -92); p.lineTo(-52, -92); p.closePath(); return p; })();
/** A coffee bean on the counter. */
function arBean(c, x, y, k, rot, sd = 0.6) {
  const dir = sd >= 0 ? 1 : -1; c.save(); c.translate(x, y); c.scale(k, k);
  c.fillStyle = 'rgba(12,14,16,0.3)'; c.beginPath(); c.ellipse(24 * dir, 14, 44, 11, 0, 0, AR_TAU); c.fill();
  c.rotate(rot); const g = c.createLinearGradient(-34 * dir, 0, 34 * dir, 0); g.addColorStop(0, '#7A4E2E'); g.addColorStop(0.6, '#4A2D18'); g.addColorStop(1, '#26150B');
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 36, 25, 0, 0, AR_TAU); c.fill();
  c.strokeStyle = '#150A04'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(-30, 0); c.bezierCurveTo(-10, -9, 10, 9, 30, 0); c.stroke();
  c.fillStyle = 'rgba(255,225,180,0.28)'; c.beginPath(); c.ellipse(-12 * dir, -12, 12, 4, -0.3, 0, AR_TAU); c.fill();
  c.restore();
}
/** A diner wall clock. hAng / mAng in radians (0 = 12 o'clock, clockwise). */
function arClock(c, x, y, r, hAng, mAng) {
  c.save(); c.translate(x, y);
  c.fillStyle = 'rgba(10,12,14,0.3)'; c.beginPath(); c.arc(10, 14, r + 8, 0, AR_TAU); c.fill();
  c.fillStyle = '#1D1F20'; c.beginPath(); c.arc(0, 0, r + 12, 0, AR_TAU); c.fill();
  const g = c.createLinearGradient(-r, -r, r, r); g.addColorStop(0, '#F1EBD9'); g.addColorStop(1, '#C9C0A8'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, AR_TAU); c.fill();
  c.strokeStyle = '#25282A'; c.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = i * AR_TAU / 12 - Math.PI / 2, l = i % 3 === 0 ? 24 : 12; c.lineWidth = i % 3 === 0 ? 7 : 4; c.beginPath(); c.moveTo(Math.cos(a) * (r - 10), Math.sin(a) * (r - 10)); c.lineTo(Math.cos(a) * (r - 10 - l), Math.sin(a) * (r - 10 - l)); c.stroke(); }
  const hand = (ang, len, w) => { const a = ang - Math.PI / 2; c.lineWidth = w; c.beginPath(); c.moveTo(-Math.cos(a) * 14, -Math.sin(a) * 14); c.lineTo(Math.cos(a) * len, Math.sin(a) * len); c.stroke(); };
  hand(hAng, r * 0.5, 11); hand(mAng, r * 0.78, 7);
  c.fillStyle = '#25282A'; c.beginPath(); c.arc(0, 0, 9, 0, AR_TAU); c.fill(); c.restore();
}
/** A pendant lamp and the cone of light it throws on the counter. Returns nothing; draw before the cup. */
function arLamp(c, x, topY, glow) {
  c.save();
  const cone = c.createLinearGradient(0, topY + 96, 0, CF); cone.addColorStop(0, `rgba(255,240,190,${0.34 * glow})`); cone.addColorStop(1, `rgba(255,232,170,${0.16 * glow})`);
  c.fillStyle = cone; c.beginPath(); c.moveTo(x - 66, topY + 96); c.lineTo(x + 66, topY + 96); c.lineTo(x + 330, CF - 4); c.lineTo(x - 330, CF - 4); c.closePath(); c.fill();
  c.fillStyle = `rgba(255,236,176,${0.42 * glow})`; c.beginPath(); c.ellipse(x, 1218, 340, 38, 0, 0, AR_TAU); c.fill();
  c.strokeStyle = '#101214'; c.lineWidth = 5; c.beginPath(); c.moveTo(x, -10); c.lineTo(x, topY); c.stroke();
  const g = c.createLinearGradient(x - 100, 0, x + 100, 0); g.addColorStop(0, '#3F6B5E'); g.addColorStop(0.55, '#24453B'); g.addColorStop(1, '#14281F');
  c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, topY); c.lineTo(x + 30, topY); c.lineTo(x + 104, topY + 96); c.lineTo(x - 104, topY + 96); c.closePath(); c.fill();
  c.fillStyle = `rgba(255,243,200,${0.95 * glow + 0.05})`; c.beginPath(); c.ellipse(x, topY + 98, 78, 13, 0, 0, AR_TAU); c.fill();
  c.restore();
}
/** Painted-canvas texture: brush strokes, a fine weave, and a vignette. Built once, drawn by STYLE.post. */
let ARC = null;
function arMakeTexture() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), r = rng(77);
  c.lineCap = 'round';
  for (let i = 0; i < 2400; i++) {
    const x = r() * W, y = r() * H, len = 50 + r() * 170, ang = -0.25 + r() * 0.35, w = 5 + r() * 13, light = r() < 0.5;
    c.strokeStyle = light ? `rgba(255,244,220,${0.008 + r() * 0.018})` : `rgba(10,12,14,${0.01 + r() * 0.022})`; c.lineWidth = w;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); c.stroke();
  }
  const wv = document.createElement('canvas'); wv.width = wv.height = 6; const w = wv.getContext('2d');
  w.fillStyle = 'rgba(255,255,255,0.04)'; w.fillRect(0, 0, 6, 1); w.fillRect(0, 0, 1, 6); w.fillStyle = 'rgba(0,0,0,0.06)'; w.fillRect(0, 3, 6, 1); w.fillRect(3, 0, 1, 6);
  c.fillStyle = c.createPattern(wv, 'repeat'); c.fillRect(0, 0, W, H);
  return cv;
}
function arPost(T) {
  if (!ARC) ARC = arMakeTexture();
  const c = drawingContext; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.drawImage(ARC, 0, 0);
  const v = c.createRadialGradient(W / 2, H / 2, 560, W / 2, H / 2, 1250); v.addColorStop(0, 'rgba(10,12,14,0)'); v.addColorStop(1, 'rgba(10,12,14,0.45)'); c.fillStyle = v; c.fillRect(0, 0, W, H);
  c.restore();
}
