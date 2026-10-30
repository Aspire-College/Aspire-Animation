// @fonts Poppins:wght@800
// ════════════════════════════════════════════════════════════════════
//  1. REEL SETTINGS
// ════════════════════════════════════════════════════════════════════
const REEL = {
  title: 'Two hours a day',
  fps: 30,
  length: null,             // seconds; null = end of the last script line (the UI can override)
  timing: 'keep',           // 'keep' = exact timestamps (voiceover sync) | 'stretch' = scale everything to length
  sfxVolume: 0.8,
  autoTransitionSfx: true,  // add a whoosh under wipe/iris/blinds transitions that have no SFX of their own
  videoBitrate: 12_000_000,
  locale: 'en-IN',          // number formatting in scenes
  extraFonts: [],           // other canvas fonts to wait for, e.g. ['400 40px "Space Mono"'] (also add them to <head>)
};

// ════════════════════════════════════════════════════════════════════
//  2. STYLE  (derive from the style reference when one is given)
// ════════════════════════════════════════════════════════════════════
const STYLE = {
  bg: '#F4EBDC',
  paper: '#FFF8EC',
  ink: '#1D1A17',
  accent: '#E4572E',
  palette: ['#E4572E', '#F2A541', '#26315A', '#6CA6C1'],
  font: 'Poppins',          // captions + display text (loaded in <head>)
  line: 12,                 // default outline weight
  grain: 0.07,              // paper/film grain 0–1 (0 = off)
  boil: 12,                 // hand-drawn wobble steps per second (0 = smooth)
};

// ════════════════════════════════════════════════════════════════════
//  3. CAPTIONS — one caption per script line, in the upper safe area
// ════════════════════════════════════════════════════════════════════
const CAPTIONS = {
  show: true,
  y: 0.25,                  // centre of the caption block as a fraction of height (stay within ~0.17–0.40)
  size: 74,
  maxWidth: 860,
  maxLines: 3,              // text shrinks to fit within this many lines
  maxWords: 7,              // long lines split into chunks of about this many words (0 = never split)
  color: '#FFFFFF',
  emphasis: '#F2A541',      // *word* in the script is drawn in this colour
  box: 'rgba(29,26,23,0.9)',// pill behind each line ('' = no pill)
  padX: 30,
  radius: 24,
  outline: 0,               // outline width in px when not using a pill
  outlineColor: '#1D1A17',
};

// ════════════════════════════════════════════════════════════════════
//  4. SCRIPT — one entry per timestamped line
//     start/end  seconds          text   caption (*word* = emphasis)
//     scene      key in SCENES    transition  how the scene enters: cut | flash | wipe | iris | blinds
//     sfx        [{ at: seconds after line start, type, vol?, pitch?, dur?, shake? }]
// ════════════════════════════════════════════════════════════════════
const SCRIPT = [
  { start: 0.0, end: 3.0, text: 'You lose *2 hours* every single day.', scene: 'clock',
    sfx: [{ at: 0.0, type: 'riser', dur: 0.6, vol: 0.6 }, { at: 0.6, type: 'impact', shake: 28 }, { at: 1.25, type: 'stamp' }] },
  { start: 3.0, end: 6.5, text: 'Scrolling. Waiting. *Overthinking.*', scene: 'drains', transition: 'wipe',
    sfx: [{ at: 0.1, type: 'pop' }, { at: 0.85, type: 'pop', pitch: 1.2 }, { at: 1.6, type: 'pop', pitch: 1.45 }, { at: 2.5, type: 'whoosh', dur: 0.8, down: true }] },
  { start: 6.5, end: 10.0, text: "That's *730 hours* a year.", scene: 'counter', transition: 'blinds',
    sfx: [{ at: 0.2, type: 'ticks', dur: 1.3, rate: 14, vol: 0.8 }, { at: 1.55, type: 'ding' }, { at: 2.1, type: 'pop', pitch: 0.8 }] },
  { start: 10.0, end: 13.0, text: 'Take back *one hour.* Start today.', scene: 'flip', transition: 'iris',
    sfx: [{ at: 0.35, type: 'swoosh' }, { at: 1.0, type: 'sparkle' }, { at: 1.1, type: 'success', vol: 0.8 }] },
];

// ════════════════════════════════════════════════════════════════════
//  5. SCENES — each draws the WHOLE frame for its time s.t (pure function of time)
//     s.t  seconds since the scene began      s.u  0→1 across the scene
//     s.d  scene duration                     s.T  global time
//     s.i  line index   s.seed  stable seed   s.line  the SCRIPT entry
//     Canvas is W×H = 1080×1920. Keep key subjects between y≈700 and y≈1250.
// ════════════════════════════════════════════════════════════════════
const SCENES = {
  clock(s) {
    const t = s.t, cx = W / 2, cy = 960, R = 330, hit = 0.6;
    background(STYLE.bg);
    push(); translate(cx, cy); rotate(t * 0.25); noStroke();
    for (let i = 0; i < 18; i++) { fill(i % 2 ? '#EBDDC5' : STYLE.bg); arc(0, 0, 2600, 2600, i * TWO_PI / 18, (i + 1) * TWO_PI / 18); }
    pop();

    const grow = mix(0.78, 1, tw(t, 0, 0.45, Ease.outBack)); // frame 0 already shows the clock
    push(); translate(cx, cy); scale(grow * (1 + 0.09 * bump(t, hit, 0.3))); rotate(-0.06 + 0.04 * Math.sin(t * 3));
    noStroke(); fill(STYLE.ink); circle(16, 22, R * 2 + 30);
    stroke(STYLE.ink); strokeWeight(STYLE.line); fill(STYLE.accent); circle(0, 0, R * 2 + 30);
    fill(STYLE.paper); circle(0, 0, R * 2 - 24);

    // hour marks fly off after the hit: p = p0 + v·dt + ½·g·dt²
    const r = rng(11), dt = Math.max(0, t - hit);
    for (let i = 0; i < 12; i++) {
      const a = i * TWO_PI / 12 - HALF_PI, vx = (r() - 0.5) * 900, vy = -500 - r() * 700, spin = (r() - 0.5) * 14;
      const x = Math.cos(a) * (R - 58) + vx * dt, y = Math.sin(a) * (R - 58) + vy * dt + 1300 * dt * dt;
      push(); translate(x, y); rotate(a + HALF_PI + spin * dt); noStroke(); fill(i % 3 ? STYLE.ink : STYLE.accent); rect(-9, -26, 18, 52, 6); pop();
    }
    // hands spin out of control, with a motion smear
    const am = -HALF_PI + TWO_PI * (0.8 * t + 0.9 * t * t), ah = -HALF_PI + 1 + TWO_PI * (0.08 * t + 0.1 * t * t);
    noStroke(); fill(withAlpha(STYLE.palette[1], 0.55)); arc(0, 0, (R - 70) * 2, (R - 70) * 2, am - 0.9, am, PIE);
    stroke(STYLE.ink); strokeCap(ROUND); strokeWeight(24); line(0, 0, Math.cos(ah) * R * 0.45, Math.sin(ah) * R * 0.45);
    strokeWeight(15); line(0, 0, Math.cos(am) * (R - 85), Math.sin(am) * (R - 85));
    noStroke(); fill(STYLE.accent); circle(0, 0, 44);
    // the crack draws itself on impact
    noFill(); stroke(STYLE.ink); strokeWeight(9); strokeJoin(ROUND);
    drawPath([[R * 0.62, -R * 0.62], [R * 0.32, -R * 0.28], [R * 0.44, -R * 0.06], [R * 0.08, R * 0.18], [R * 0.22, R * 0.46]], tw(t, hit, 0.18, Ease.outQuad));
    drawPath([[R * 0.32, -R * 0.28], [R * 0.04, -R * 0.38], [-R * 0.14, -R * 0.22]], tw(t, hit + 0.08, 0.15));
    pop();

    // stamped badge
    if (t > 1.25) {
      push(); translate(cx + 215, 715); rotate(-0.16); scale(mix(1.8, 1, tw(t, 1.25, 0.28, Ease.outBack)));
      drawingContext.globalAlpha = clamp01((t - 1.25) / 0.06);
      noStroke(); fill(STYLE.ink); rect(-160, -58, 340, 140, 26);
      fill(STYLE.accent); stroke(STYLE.ink); strokeWeight(8); rect(-170, -70, 340, 140, 26);
      noStroke(); fill(STYLE.paper); textFont(STYLE.font); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(92); text('−2:00', 0, 6);
      pop();
    }
  },

  drains(s) {
    const t = s.t;
    background(STYLE.palette[2]);
    stroke(withAlpha(STYLE.paper, 0.07)); strokeWeight(3);
    const off = (t * 40) % 90;
    for (let x = 0; x <= W; x += 90) line(x, 0, x, H);
    for (let y = -90; y <= H; y += 90) line(0, y + off, W, y + off);

    const pull = tw(t, 2.5, 0.85, Ease.inCubic), vort = tw(t, 2.25, 0.4);
    if (vort > 0) {
      push(); translate(W / 2, 1240); rotate(-t * 5); noFill(); strokeCap(ROUND);
      for (let i = 0; i < 5; i++) {
        stroke(withAlpha(i % 2 ? STYLE.palette[3] : STYLE.paper, 0.55 * vort)); strokeWeight(12);
        const d = (90 + i * 90) * vort * 2; arc(0, 0, d, d * 0.55, i, i + PI * 1.2);
      }
      pop();
    }
    const items = [
      { at: 0.1, x: 210, y: 960, draw: drawPhone },
      { at: 0.85, x: 540, y: 1020, draw: (lt) => drawHourglass(mix(0.85, 0.25, clamp01(lt / 2.5)), true, lt) },
      { at: 1.6, x: 870, y: 960, draw: drawScribble },
    ];
    items.forEach((it, j) => {
      const k = tw(t, it.at, 0.4, Ease.outBack); if (k <= 0) return;
      const pj = clamp01(pull * 1.15 - j * 0.07);
      const x = mix(it.x, W / 2, pj), y = mix(it.y + Math.sin(t * 2.2 + j) * 14, 1240, pj);
      push(); translate(x, y); rotate((j - 1) * 0.12 + pj * 6 + wob(j, t, 0.02)); scale(k * (1 - pj * 0.94)); it.draw(t - it.at); pop();
    });
  },

  counter(s) {
    const t = s.t;
    background(STYLE.palette[1]);
    noStroke(); fill(withAlpha(STYLE.paper, 0.2));
    const off = (t * 60) % 160;
    for (let x = -H; x < W + H; x += 160) quad(x + off, 0, x + off + 70, 0, x + off + 70 - H * 0.6, H, x + off - H * 0.6, H);

    const n = Math.round(730 * tw(t, 0.2, 1.3, Ease.outCubic));
    push(); translate(W / 2, 790); scale(tw(t, 0, 0.35, Ease.outBack) * (1 + 0.12 * bump(t, 1.55, 0.3))); rotate(-0.04);
    textFont(STYLE.font); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(300);
    noStroke(); fill(STYLE.ink); text(n.toLocaleString(REEL.locale), 14, 20);
    fill(STYLE.paper); stroke(STYLE.ink); strokeWeight(14); strokeJoin(ROUND); text(n.toLocaleString(REEL.locale), 0, 0);
    noStroke(); fill(STYLE.ink); textSize(54); text('HOURS / YEAR', 0, 175);
    pop();

    const r = rng(4), base = 1330, bw = 52, gap = 14, x0 = W / 2 - (12 * bw + 11 * gap) / 2;
    for (let i = 0; i < 12; i++) {
      const h = (90 + r() * 80) * tw(t, 0.3 + i * 0.07, 0.5, Ease.outBack), x = x0 + i * (bw + gap);
      noStroke(); fill(STYLE.ink); rect(x + 8, base - h + 10, bw, h, 10, 10, 0, 0);
      fill(STYLE.palette[2]); stroke(STYLE.ink); strokeWeight(6); rect(x, base - h, bw, h, 10, 10, 0, 0);
    }
    stroke(STYLE.ink); strokeWeight(10); line(x0 - 30, base, W - x0 + 30, base);

    const rb = tw(t, 2.1, 0.35, Ease.outBack);
    if (rb > 0) {
      push(); translate(W / 2, 1080); rotate(0.035); scale(rb);
      noStroke(); fill(STYLE.ink); rect(-220, -32, 460, 84, 42);
      fill(STYLE.accent); stroke(STYLE.ink); strokeWeight(6); rect(-230, -42, 460, 84, 42);
      noStroke(); fill(STYLE.paper); textFont(STYLE.font); textStyle(BOLD); textAlign(CENTER, CENTER); textSize(48); text('= 30 full days', 0, 3);
      pop();
    }
  },

  flip(s) {
    const t = s.t, cx = W / 2, cy = 1000;
    background(STYLE.palette[3]);
    const rays = tw(t, 0.5, 0.6);
    push(); translate(cx, cy); rotate(t * 0.35); noStroke(); fill(withAlpha(STYLE.paper, 0.25 * rays));
    for (let i = 0; i < 14; i++) { const a = i * TWO_PI / 14; arc(0, 0, 2600, 2600, a, a + TWO_PI / 28); }
    pop();
    noStroke(); fill(STYLE.palette[1]); circle(cx, cy, 560 * tw(t, 0.45, 0.5, Ease.outBack));

    // flip: swap which bulb holds the sand while the glass is horizontal, so it reads as continuous
    const f = tw(t, 0.35, 0.55, Ease.outBack), ang = PI * f, swapped = ang > HALF_PI;
    const sandTop = swapped ? Math.max(0.1, 0.92 - 0.2 * Math.max(0, t - 0.9)) : 0.06;
    push(); translate(cx, cy + Math.sin(t * 2) * 10); rotate(swapped ? ang - PI : ang); scale(1.3 * (1 + 0.06 * bump(t, 0.9, 0.3)));
    drawHourglass(sandTop, swapped && t > 0.9, t);
    pop();

    // sparkle burst; every random value is drawn before any `continue`, so the sequence never shifts
    const dt = t - 1.0;
    if (dt > 0) {
      const r = rng(21);
      for (let i = 0; i < 26; i++) {
        const a = r() * TWO_PI, sp = 500 + r() * 900, life = 0.7 + r() * 0.6, sz0 = 18 + r() * 26;
        const k = dt / life; if (k >= 1) continue;
        const d = sp * (dt - 0.35 * dt * dt);
        push(); translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); rotate(dt * 4 + i);
        noStroke(); fill(i % 3 ? STYLE.paper : STYLE.palette[1]); star4(sz0 * (1 - k)); pop();
      }
    }
  },
};

// ── Props shared by scenes (local coordinates, centred on 0,0) ──────────
function drawPhone(t) {
  const w = 220, h = 400, sw = w - 40, sh = h - 70;
  noStroke(); fill(STYLE.ink); rect(-w / 2 + 14, -h / 2 + 18, w, h, 36);
  stroke(STYLE.ink); strokeWeight(STYLE.line); fill(STYLE.paper); rect(-w / 2, -h / 2, w, h, 36);
  noStroke(); fill(STYLE.palette[3]); rect(-sw / 2, -sh / 2 - 6, sw, sh, 14);
  const c = drawingContext; c.save(); c.beginPath(); c.rect(-sw / 2, -sh / 2 - 6, sw, sh); c.clip();
  const off = (t * 620) % 130;
  for (let j = -1; j < 5; j++) {
    const y = -sh / 2 + j * 130 - off + 10;
    fill(STYLE.paper); rect(-sw / 2 + 14, y, sw - 28, 110, 12);
    fill(j % 2 ? STYLE.accent : STYLE.palette[1]); circle(-sw / 2 + 46, y + 32, 34);
    fill(withAlpha(STYLE.ink, 0.25)); rect(-sw / 2 + 72, y + 22, 70, 12, 6); rect(-sw / 2 + 30, y + 62, sw - 60, 12, 6);
  }
  c.restore();
  fill(STYLE.ink); rect(-26, h / 2 - 26, 52, 8, 4);
}

function drawHourglass(sandTop, flowing, t) {
  const w = 230, h = 380, neck = 20;
  const glass = () => {
    beginShape();
    vertex(-w / 2, -h / 2); vertex(w / 2, -h / 2);
    bezierVertex(w / 2, -h * 0.12, neck, -h * 0.08, neck, 0);
    bezierVertex(neck, h * 0.08, w / 2, h * 0.12, w / 2, h / 2);
    vertex(-w / 2, h / 2);
    bezierVertex(-w / 2, h * 0.12, -neck, h * 0.08, -neck, 0);
    bezierVertex(-neck, -h * 0.08, -w / 2, -h * 0.12, -w / 2, -h / 2);
    endShape(CLOSE);
  };
  noStroke(); fill(STYLE.ink); push(); translate(14, 18); glass(); pop();
  fill(STYLE.paper); glass();
  const hw = (y) => mix(neck, w / 2 - 16, Math.min(1, Math.abs(y) / (h / 2 - 20)) ** 0.8);
  fill(STYLE.palette[1]);
  const yTop = mix(-12, -h / 2 + 26, clamp01(sandTop));
  if (sandTop > 0.02) { beginShape(); vertex(-hw(yTop), yTop); vertex(hw(yTop), yTop); vertex(neck - 6, -8); vertex(-neck + 6, -8); endShape(CLOSE); }
  const pile = (1 - clamp01(sandTop)) * (h / 2 - 50), yb = h / 2 - 14;
  beginShape(); vertex(-w / 2 + 18, yb); bezierVertex(-w * 0.2, yb - pile * 0.4, -w * 0.1, yb - pile, 0, yb - pile); bezierVertex(w * 0.1, yb - pile, w * 0.2, yb - pile * 0.4, w / 2 - 18, yb); endShape(CLOSE);
  if (flowing && sandTop > 0.02) { stroke(STYLE.palette[1]); strokeWeight(7); line(wob(3, t, 1.5), -6, wob(4, t, 1.5), yb - pile); }
  noFill(); stroke(STYLE.ink); strokeWeight(STYLE.line); glass();
  fill(STYLE.accent); strokeWeight(8); rect(-w / 2 - 30, -h / 2 - 40, w + 60, 40, 12); rect(-w / 2 - 30, h / 2, w + 60, 40, 12);
}

function drawScribble(t) {
  const pts = [];
  for (let i = 0; i < 160; i++) {
    const a = i * 0.33, r = 60 + 70 * noise(i * 0.07, 4.2);
    pts.push([Math.cos(a) * r + (noise(i * 0.05, 8) - 0.5) * 70 + wob(i, t, 3), Math.sin(a) * r * 1.15 + (noise(i * 0.05, 11) - 0.5) * 70]);
  }
  const u = tw(t, 0, 0.9, Ease.outQuad);
  noFill(); strokeJoin(ROUND); strokeCap(ROUND); strokeWeight(12);
  push(); translate(10, 12); stroke(STYLE.ink); drawPath(pts, u); pop();
  stroke(STYLE.accent); drawPath(pts, u);
}

function star4(r) {
  beginShape();
  for (let i = 0; i < 8; i++) { const a = i * QUARTER_PI - HALF_PI, rr = i % 2 ? r * 0.28 : r; vertex(Math.cos(a) * rr, Math.sin(a) * rr); }
  endShape(CLOSE);
}
</script>

<script id="engine">
