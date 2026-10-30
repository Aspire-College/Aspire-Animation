// ════════════════════════════════════════════════════════════════════
//  KINETIC TYPE KIT — the script's own words as the picture (educational series; any p5 reel may use it)
//  Include it after SCRIPT:  /*@@include kinetic-kit@@*/   and set  CAPTIONS.show = false  (the type is the caption).
//  Every helper is a pure function of time, like the scenes.
//
//  kinWords(i, o)        the words of SCRIPT[i] with the time each one lands (s into the line); *word* = emphasis (an *emphasised phrase* stays one unit)
//                        a line that starts at 0 is the cover: its words are on screen at frame 0 (o.cover: false to animate them in)
//  kinLayout(words, o)   wraps and measures them at (o.x, o.y): returns { lines, boxes[] } (a box per word: word, x (left), y (centre), w, h, em, i, at)
//  kinType(i, t, o)      draws line i at scene time t; returns the boxes so a scene can hang graphics on a word
//      o.in    'slam' | 'slide' | 'rise' | 'mask' | 'type'   how each word lands (vary it from scene to scene)
//      o.em    'color' | 'marker' | 'underline' | 'box'       how *emphasis* is shown
//      o.x, o.y (centre of the block), o.size, o.maxW, o.align ('center' | 'left'), o.out (s into the line when the words leave; omit = stay)
//  kinCount(x, y, from, to, t, at, dur, o)   a number counting up (o.size, o.prefix, o.suffix, o.locale, o.col)
//  kinUnder(box, k, o) · kinStrike(box, k, o) · kinMark(box, k, o)   underline, strike-through, marker sweep behind one word (k 0→1)
// ════════════════════════════════════════════════════════════════════
const KIN = {
  font: 'Archivo Black',      // display face; add  // @fonts Archivo+Black  to reel.js
  size: 104, emScale: 1.35, lead: 1.08, maxW: 900,
  ink: '#14171F', paper: '#F4EFE6', accent: '#FF5A36', second: '#2E5BFF', soft: '#FFD23F',
  land: 0.7,                  // the last word lands by this fraction of the line (the rest is reading time)
};
function kinWords(i, o = {}) {
  const l = SCRIPT[i], toks = []; let em = false;
  for (const part of String(l.text).split(/(\*)/)) { if (part === '*') { em = !em; continue; } for (const w of part.split(/\s+/)) if (w) toks.push({ w, em }); }
  for (let k = toks.length - 1; k > 0; k--) if (toks[k].em && toks[k - 1].em) { toks[k - 1].w += ' ' + toks[k].w; toks.splice(k, 1); }   // an emphasised phrase stays one unit
  if (l.start <= 0.001 && o.cover !== false) return toks.map((tk, k) => ({ ...tk, at: -1, i: k }));   // frame 0 is the cover: the first line is already there
  const d = (l.end - l.start) * (o.land || KIN.land), weight = toks.map(tk => tk.w.length + 2), total = weight.reduce((a, b) => a + b, 0) || 1;
  let acc = 0; return toks.map((tk, k) => { const at = d * acc / total; acc += weight[k]; return { ...tk, at, i: k }; });
}
function kinLayout(words, o = {}) {
  const size = o.size || KIN.size, maxW = o.maxW || KIN.maxW, lead = o.lead || KIN.lead;
  push(); textFont(o.font || KIN.font); const sizeOf = wd => wd.em ? size * KIN.emScale : size;
  const lines = []; let cur = { words: [], w: 0, h: 0 };
  for (const wd of words) {
    textSize(sizeOf(wd)); const ww = textWidth(wd.w), sp = textWidth(' '), nw = cur.words.length ? cur.w + sp + ww : ww;
    if (cur.words.length && nw > maxW) { lines.push(cur); cur = { words: [], w: 0, h: 0 }; }
    cur.words.push({ ...wd, ww, sp, sz: sizeOf(wd) }); cur.w = cur.words.length > 1 ? cur.w + sp + ww : ww; cur.h = Math.max(cur.h, sizeOf(wd) * lead);
  }
  lines.push(cur); pop();
  const blockH = lines.reduce((a, l) => a + l.h, 0), cx = o.x ?? W / 2, boxes = []; let y = (o.y ?? H * 0.48) - blockH / 2;
  for (const ln of lines) {
    let x = o.align === 'left' ? cx - maxW / 2 : cx - ln.w / 2;
    for (const wd of ln.words) { boxes.push({ word: wd.w, em: wd.em, at: wd.at, i: wd.i, sz: wd.sz, x, y: y + ln.h / 2, w: wd.ww, h: wd.sz }); x += wd.ww + wd.sp; }
    y += ln.h;
  }
  return { lines, boxes };
}
function kinType(i, t, o = {}) {
  const L = kinLayout(kinWords(i, o), o), mode = o.in || 'slam', emMode = o.em || 'color', c = drawingContext;
  const gone = o.out != null ? Ease.inCubic(clamp01((t - o.out) / 0.35)) : 0;
  if (gone >= 1) return L.boxes;
  push(); textFont(o.font || KIN.font); textAlign(LEFT, CENTER);
  translate(0, gone * -60); c.globalAlpha = 1 - gone;   // leaving: words and their marks rise and fade together
  for (const b of L.boxes) {
    const k = clamp01((t - b.at) / 0.32), e = Ease.outCubic(k); if (k <= 0) continue;
    const col = b.em ? (o.emColor || KIN.accent) : (o.color || KIN.ink);
    if (b.em && emMode === 'marker') kinMark(b, Ease.inOutCubic(clamp01((t - b.at - 0.15) / 0.35)), o);
    if (b.em && emMode === 'box') { noStroke(); fill(o.boxColor || KIN.ink); rect(b.x - 18, b.y - b.h * 0.62, (b.w + 36) * Ease.outCubic(clamp01((t - b.at) / 0.25)), b.h * 1.2, 10); }
    push(); c.globalAlpha = (1 - gone) * (mode === 'type' ? (k > 0 ? 1 : 0) : Math.min(1, k * 2.5));
    let dx = 0, dy = 0, s = 1;
    if (mode === 'slam') s = mix(b.em ? 1.9 : 1.4, 1, Ease.outBack(k));
    else if (mode === 'slide') dx = (1 - e) * -120;
    else if (mode === 'rise') dy = (1 - e) * 70;
    translate(b.x + b.w / 2 + dx, b.y + dy); scale(s);
    if (mode === 'mask') { c.save(); c.beginPath(); c.rect(-b.w / 2 - 8, -b.h * 0.7, b.w + 16, b.h * 1.4); c.clip(); translate(0, (1 - e) * b.h * 1.2); }
    noStroke(); fill(b.em && emMode === 'box' ? (o.paper || KIN.paper) : col); textSize(b.sz); textAlign(CENTER, CENTER); text(b.word, 0, 0);
    if (mode === 'mask') c.restore();
    pop();
    if (b.em && emMode === 'underline') kinUnder(b, Ease.inOutCubic(clamp01((t - b.at - 0.2) / 0.4)), o);
  }
  pop(); c.globalAlpha = 1;
  return L.boxes;
}
function kinCount(x, y, from, to, t, at, dur, o = {}) {
  const k = Ease.outCubic(clamp01((t - at) / dur)), v = Math.round(mix(from, to, k));
  push(); textFont(o.font || KIN.font); textAlign(CENTER, CENTER); textSize(o.size || 220); noStroke(); fill(o.col || KIN.ink);
  text(`${o.prefix || ''}${v.toLocaleString(o.locale || REEL.locale || 'en-IN')}${o.suffix || ''}`, x, y); pop();
}
function kinUnder(b, k, o = {}) { if (k <= 0) return; push(); stroke(o.lineColor || KIN.accent); strokeWeight(o.weight || 12); strokeCap(ROUND); noFill(); drawPath([[b.x, b.y + b.h * 0.52], [b.x + b.w, b.y + b.h * 0.48]], k); pop(); }
function kinStrike(b, k, o = {}) { if (k <= 0) return; push(); stroke(o.lineColor || KIN.accent); strokeWeight(o.weight || 14); strokeCap(ROUND); noFill(); drawPath([[b.x - 10, b.y + 4], [b.x + b.w + 10, b.y - 6]], k); pop(); }
function kinMark(b, k, o = {}) { if (k <= 0) return; push(); noStroke(); fill(o.markColor || KIN.soft); rect(b.x - 14, b.y - b.h * 0.18, (b.w + 28) * k, b.h * 0.62, 6); pop(); }
