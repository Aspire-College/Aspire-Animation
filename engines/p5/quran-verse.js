// ════════════════════════════════════════════════════════════════════
//  QUR'AN VERSE PANEL — the complete Arabic verse in screen space, above the captions (reel-creator SKILL.md, "Qur'an verses on screen")
//  reel.js defines VERSES (the include does not), adds  // @fonts Amiri+Quran  and  REEL.extraFonts: ['64px "Amiri Quran"'].
//  The engine calls drawVerse(T) after the scene and transitions, just before the captions; it moves the captions under the panel.
//    const VERSES = [ { from: 4.2, to: 15.8, ref: 'Al-Asr 103:2', ar: '…' } ];
//    from: the line that mentions it starts; to: its explanation's last line ends (script seconds);
//    ar: pasted WITH CODE from a verified Uthmani source (Tanzil / Quran.com), never typed or recalled.
// ════════════════════════════════════════════════════════════════════
const QFONT = '"Amiri Quran", serif', QTOP = 290, QH = 640, CAP_Y = CAPTIONS.y || 0.25;
function inkVerse(c, t, x, y) { if (CAPTIONS.outline > 0) { c.lineWidth = CAPTIONS.outline * 2; c.strokeStyle = CAPTIONS.outlineColor; c.strokeText(t, x, y); } c.fillStyle = CAPTIONS.color; c.fillText(t, x, y); }
function paintVerse(v) {
  const cv = v.cv = document.createElement('canvas'); cv.width = W; cv.height = QH; const c = cv.getContext('2d'); let size = 64, lines;
  for (;;) { c.font = `${size}px ${QFONT}`; lines = []; let cur = ''; for (const wd of v.ar.trim().split(/\s+/)) { const t = cur ? cur + ' ' + wd : wd; if (cur && c.measureText(t).width > 900) { lines.push(cur); cur = wd; } else cur = t; } lines.push(cur); if (lines.length * size * 1.85 <= QH - 70 || size <= 34) break; size -= 2; }
  const lh = size * 1.85; v.h = lines.length * lh + 56;
  c.direction = 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  lines.forEach((ln, i) => inkVerse(c, ln, W / 2, lh * (i + 0.5)));
  c.direction = 'ltr'; c.font = `700 30px "${STYLE.font}", Georgia, serif`; inkVerse(c, v.ref, W / 2, v.h - 28);
}
function drawVerse(T) {   // renderFrame calls it just before drawCaption
  CAPTIONS.y = CAP_Y; const t = T / (TL.k || 1), v = VERSES.find(q => t >= q.from && t < q.to); if (!v) return;
  if (!v.cv) paintVerse(v);
  const c = drawingContext; c.save(); c.globalAlpha = Math.min(v.from <= 0.001 ? 1 : clamp01((t - v.from) / 0.4), clamp01((v.to - t) / 0.4));
  c.drawImage(v.cv, 0, QTOP, W, QH); c.restore(); CAPTIONS.y = (QTOP + v.h + 150) / H;   // captions just under the panel
}
