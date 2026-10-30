// ════════════════════════════════════════════════════════════════════
//  SCENE CHANGES: an element of each scene takes us into the next one (no cuts, wipes, fades or flashes)
//  Every SCRIPT line gets scene: 'reel'. SCENES.reel draws one scene, or the MOVE that carries one scene into the next.
//  A scene is a plain function of its own time s.t and may span several lines (one place, several beats).
// ════════════════════════════════════════════════════════════════════
// reel.js defines SEG (scene order) and MOVES (one move per change), and CAMS (each scene's slow push) — the include does not.
// Shape of the three, from the tested original (the names skyStrip, chatBubble, WIN, windowBars, DOOR, towerBg stand for your own drawing):
// const SEG = [                                      // scene order; a scene starts at the timestamp of its first SCRIPT line (example)
//   { key: 'stranger', line: 4 }, { key: 'school', line: 5 }, { key: 'home', line: 6 }, { key: 'hall', line: 9 }, { key: 'garden', line: 10 },
// ];
// const MOVES = [                                    // MOVES[j] carries SEG[j] into SEG[j + 1], each a different action. Examples:
//   { D: 0.7, draw: (p, m) => travel(p, WORLD_DX, 0, m, { world: skyStrip, el: (k, ox, oy) => {     // follow: the chat bubble flies right across one sky
//       const e = Ease.inOutCubic(clamp01(p * 1.12)), x = mix(835, WORLD_DX + 545, e) + ox, y = mix(990, 700, e) - Math.sin(Math.PI * e) * 90 + oy;
//       chatBubble(x, y, e);                         // it ends exactly where the school scene draws its own bubble
//     } }) },
//   { D: 0.7, draw: (p, m) => portal(1 - p, onScreenFrame('home', m.tB, WIN), () => m.B({ noView: true }), () => m.A(),   // pull back: the school becomes the view in the home window
//       { open: true, over: () => { camPush('home', m.tB); windowBars(WIN); pop(); } }) },
//   { D: 0.8, draw: (p, m) => portal(p, onScreenFrame('home', m.tA, DOOR), () => m.A(), () => m.B(), { open: false }) },   // go in through the door
//   { D: 0.7, draw: (p, m) => travel(p, 0, -H * 1.4, m, { world: towerBg }) },                                                // rise into the scene above, in one tall world
// ];
// The scenes' side of these moves (examples):
//   SCENES.school: if (!s.bare) { push(); translate(-WORLD_DX, 0); skyStrip(); pop(); }  …  if (!s.moving) chatBubble(545, 700, 1);
//   SCENES.home:   camPush('home', s.t); …  if (!s.noView) drawIn(WIN, () => drawSceneAt('school', s.T)); windowBars(WIN); …  pop();
//   A morph:       const k = tw(s.t, 0.4, 1.2, Ease.inOutCubic); smoothShape(c, morphPts(ptsCircle(540, 1000, 200), HOOD_POINTS, k)); c.fill();
const MOVE_POST = 0.1;                             // a move starts D s before the next line and ends 0.1 s after it starts
const sst = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };

/** Scene j at scene time tl. o goes to the scene: { bare: skip your own background, noView: skip a view drawn in a frame, … } */
function drawSeg(j, tl, total, o = {}) {
  const seg = SEG[j], line = SCRIPT[seg.line], next = SEG[j + 1], t = Math.max(0, tl);
  SCENES[seg.key]({ t, u: 0, d: next ? SCRIPT[next.line].start - line.start : total - line.start, T: line.start + t, i: seg.line, seed: seg.line * 7919 + 13, line, ...o });
}
/** Scene `key` at script time Ts (for example the view through a window, drawn by the scene that frames it). */
function drawSceneAt(key, Ts, o = {}) { const j = SEG.findIndex(g => g.key === key); drawSeg(j, Ts - SCRIPT[SEG[j].line].start, TL.len / TL.k, o); }
SCENES.reel = function (s) {
  const Ts = s.T / TL.k, total = TL.len / TL.k;    // script time, so Stretch mode keeps working
  for (let j = 0; j < MOVES.length; j++) {
    const Tb = SCRIPT[SEG[j + 1].line].start, mv = MOVES[j];
    if (Ts >= Tb - mv.D && Ts < Tb + MOVE_POST) {
      const p = clamp01((Ts - (Tb - mv.D)) / (mv.D + MOVE_POST)), tA = Ts - SCRIPT[SEG[j].line].start, tB = Ts - Tb;
      return mv.draw(p, { tA, tB, A: o => drawSeg(j, tA, total, o), B: o => drawSeg(j + 1, tB, total, o) });
    }
  }
  let j = 0; while (j + 1 < SEG.length && Ts >= SCRIPT[SEG[j + 1].line].start) j++;
  drawSeg(j, Ts - SCRIPT[SEG[j].line].start, total);
};

// ── Camera: each scene's own slow push. A scene calls camPush(key, s.t) first and pop() last. ──
// const CAMS = { home: { d: 2.95, z1: 1.05, fx: 540, fy: 1100 } };  // reel.js: per scene: d s, end zoom, focus point
const camZoom = (key, t) => { const m = CAMS[key]; return m ? mix(1, m.z1, Ease.inOutQuad(clamp01(t / m.d))) : 1; };
function camPush(key, t) { const m = CAMS[key] || { fx: 0, fy: 0 }; push(); translate(m.fx, m.fy); scale(camZoom(key, t)); translate(-m.fx, -m.fy); }
/** A frame or object given in scene coordinates, moved to where it is on screen at scene time t. */
function onScreenFrame(key, t, f) {
  const m = CAMS[key], z = camZoom(key, t); if (!m) return f;
  const g = { ...f, x: m.fx + (f.x - m.fx) * z, y: m.fy + (f.y - m.fy) * z };
  if (f.circ != null) g.circ = f.circ * z; else { g.w = f.w * z; g.h = f.h * z; g.r = (f.r || 0) * z; }
  return g;
}

// ── FRAME moves: one scene seen through a frame in the other (a window, a door, a screen, a picture, a mirror) ──
// f = the frame on screen: { x, y, w, h, r, rot } (rounded rectangle) or { x, y, circ } (circle).
// portal(q, f, outer, inner, o): q = 0 shows the outer scene with the frame in place; q = 1 shows the inner scene full screen.
//   Pull back out (the old scene becomes the view in a window of the new one): portal(1 - p, win, m.B, m.A, { open: true, over })
//   Go in (through a door or a tunnel the story enters; at most once a reel):   portal(p, door, m.A, m.B, { open: false })
// o.open: the frame already shows the inner scene; false: the object's face opens into a window first, with a small swell and a rim.
// o.over(): drawn on top in the outer scene's coordinates (window bars, a picture frame, a reflection on the glass).
function framePath(c, f, k) {
  c.save(); c.scale(k, k); c.beginPath();
  if (f.circ != null) c.arc(0, 0, Math.max(0.01, f.circ), 0, Math.PI * 2); else c.roundRect(-f.w / 2, -f.h / 2, f.w, f.h, Math.max(0, f.r || 0));
  c.restore();
}
const coverScale = (f, S, rr) => { const side = Math.abs(Math.cos(rr)) + Math.abs(Math.sin(rr)), fw = f.circ != null ? f.circ * 2 : f.w, fh = f.circ != null ? f.circ * 2 : f.h; return Math.min(1, Math.max(fw * S * side / W, fh * S * side / H)); };
function portal(q, f, outer, inner, o = {}) {
  const c = drawingContext, open = !!o.open, circle = f.circ != null, rot = f.rot || 0;
  const fw = circle ? f.circ * 2 : f.w, fh = circle ? f.circ * 2 : f.h;
  const a0 = open ? 0 : 0.16, E = Ease.inOutCubic(clamp01((q - a0) / (1 - a0)));
  const Zf = circle ? Math.hypot(W, H) * 0.59 / (fw / 2) : Math.max(W * 1.15 / fw, H * 1.15 / fh);   // the frame covers the screen at q = 1
  const Z = Math.exp(Math.log(Zf) * E), ant = open ? 0 : 0.085 * Math.sin(Math.PI * clamp01(q / 0.3));
  const Pk = Ease.inOutQuad(clamp01((q - a0) / 0.64)), Rk = Ease.inOutQuad(clamp01((q - a0) / 0.75));
  const Px = mix(f.x, W / 2, Pk), Py = mix(f.y, H / 2, Pk), rr = rot * (1 - Rk);                    // the frame slides to the centre and straightens
  const m = open ? 1 : Ease.outCubic(clamp01((q - 0.05) / 0.28)), S = Z * (1 + ant) * m;
  const f2 = f.r != null ? { ...f, r: f.r * (1 - sst(0.75, 1, q)) } : f;                              // corners square off as it covers the screen
  const outerAt = fn => { push(); translate(Px, Py); rotate(-rot * Rk); scale(Z * (1 + ant)); translate(-f.x, -f.y); fn(); pop(); };
  let covered = false;
  if (m > 0.001 && q > 0.4) { c.save(); c.translate(Px, Py); c.rotate(rr); framePath(c, f2, S); covered = [[2, 2], [W - 2, 2], [2, H - 2], [W - 2, H - 2]].every(([x, y]) => c.isPointInPath(x, y)); c.restore(); }
  if (!covered) outerAt(outer);
  if (m > 0.001) {
    c.save();
    if (!covered) { c.translate(Px, Py); c.rotate(rr); framePath(c, f2, S); c.clip(); c.setTransform(1, 0, 0, 1, 0, 0); }
    push(); translate(Px, Py); rotate(rr); scale(coverScale(f, S, rr)); translate(-W / 2, -H / 2); inner(); pop();
    c.restore();
  }
  if (!covered && o.over) outerAt(o.over);
  const ra = open ? 0 : 1 - sst(0.5, 0.88, q);                                                         // a bright rim while a closed object opens
  if (ra > 0.01 && m > 0.001 && !covered) {
    c.save(); c.translate(Px, Py); c.rotate(rr); framePath(c, f2, S); c.lineJoin = 'round';
    c.strokeStyle = `rgba(255,255,255,${0.25 * ra})`; c.lineWidth = 24; c.stroke(); c.strokeStyle = `rgba(255,244,214,${0.95 * ra})`; c.lineWidth = 9; c.stroke(); c.restore();
  }
}
/** A whole scene seen inside a frame of the current scene (the view through a window), exactly as portal() draws it at q = 0. */
function drawIn(f, fn) {
  const c = drawingContext; c.save(); c.translate(f.x, f.y); c.rotate(f.rot || 0); framePath(c, f, 1); c.clip();
  push(); scale(coverScale(f, 1, f.rot || 0)); translate(-W / 2, -H / 2); fn(); pop(); c.restore();
}

// ── TRAVEL: the camera follows an element across ONE continuous world. ──
// Scene B sits at (dx, dy) from scene A in world coordinates (dx > 0: to the right; dy < 0: above). Put at least half a screen
// between them (|dx| ≥ 1.5 W or |dy| ≥ 1.4 H) and let both scenes paint their background from one shared world function at
// their own offset, so the strip between them is continuous: one sky that darkens or brightens, one ground. The scenes are drawn
// with { bare: true, moving: true } on top of it (moving: leave out the element, the move draws it); o.el(k, ox, oy) draws the
// travelling element itself (screen = world + (ox, oy)) and must end exactly where scene B draws it.
function travel(p, dx, dy, m, o = {}) {
  const k = Ease.inOutCubic(clamp01(p)), ox = -dx * k, oy = -dy * k, bare = !!o.world, see = (x, y) => x > -W && x < W && y > -H && y < H;
  push(); translate(ox, oy); if (o.world) o.world(); if (see(ox, oy)) m.A({ bare, moving: true }); pop();
  if (see(ox + dx, oy + dy)) { push(); translate(ox + dx, oy + dy); m.B({ bare, moving: true }); pop(); }
  if (o.el) o.el(k, ox, oy);
}

// ── MORPH: an outline becomes another outline with a similar silhouette (a bubble becomes a hood, the sun becomes a lamp). ──
// Shapes are point lists [[x, y], …]: the corners of a polygon, or points sampled from curves. Both are resampled to the same count.
function resample(pts, n = 72) {
  const L = [0]; for (let i = 1; i <= pts.length; i++) { const a = pts[i - 1], b = pts[i % pts.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const out = [], total = L[pts.length];
  for (let k = 0, i = 0; k < n; k++) {
    const d = total * k / n; while (i < pts.length - 1 && L[i + 1] < d) i++;
    const a = pts[i], b = pts[(i + 1) % pts.length], u = (d - L[i]) / ((L[i + 1] - L[i]) || 1); out.push([mix(a[0], b[0], u), mix(a[1], b[1], u)]);
  }
  return out;
}
function morphPts(a, b, k, n = 72) {
  const A = resample(a, n); let B = resample(b, n);
  const area = P => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  if (Math.sign(area(A)) !== Math.sign(area(B))) B = B.reverse();                                     // same winding
  let best = 0, bd = Infinity;                                                                           // line the two outlines up
  for (let off = 0; off < n; off++) { let d = 0; for (let i = 0; i < n; i += 3) { const p = A[i], q = B[(i + off) % n]; d += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; } if (d < bd) { bd = d; best = off; } }
  return A.map((p, i) => { const q = B[(i + best) % n]; return [mix(p[0], q[0], k), mix(p[1], q[1], k)]; });
}
function smoothShape(c, pts) {                     // a soft closed outline through the points (fill or clip with it afterwards)
  const n = pts.length, mid = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
  c.beginPath(); const m0 = mid(n - 1); c.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const m1 = mid(i); c.quadraticCurveTo(pts[i][0], pts[i][1], m1[0], m1[1]); }
  c.closePath();
}
const ptsCircle = (x, y, r, n = 72) => Array.from({ length: n }, (_, i) => [x + r * Math.cos(Math.PI * 2 * i / n - Math.PI / 2), y + r * Math.sin(Math.PI * 2 * i / n - Math.PI / 2)]);
