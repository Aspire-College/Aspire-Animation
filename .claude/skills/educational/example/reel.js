// @fonts Archivo+Black
// Demo of the educational series (kinetic typography): the script's words are the picture, no caption block, no cuts.
const REEL = { title: 'Study smarter', ctaHold: 2 };
const STYLE = { bg: '#F4EFE6', paper: '#F4EFE6', ink: '#14171F', accent: '#FF5A36', palette: ['#FF5A36', '#2E5BFF', '#FFD23F', '#14171F'], font: 'Archivo Black', line: 0, grain: 0.04, boil: 0 };
const CAPTIONS = { show: false, y: 0.25, size: 72, maxWidth: 860, maxLines: 3, maxWords: 7, color: '#14171F', emphasis: '#FF5A36', box: '', padX: 30, radius: 24, outline: 0, outlineColor: '#14171F' };
const SCRIPT = [
  { start: 0.0, end: 2.8, text: 'Reading it *once* isn’t learning.', scene: 'reel',
    sfx: [{ at: 0, type: 'room', dur: 12, toEnd: true, vol: 0.5 }, { at: 0.05, type: 'thump', vol: 0.8 }, { at: 0.75, type: 'impact', vol: 0.5, pitch: 1.3 }, { at: 1.35, type: 'scribble', dur: 0.4, vol: 0.6 }] },
  { start: 2.8, end: 5.6, text: 'Test yourself *tomorrow.*', scene: 'reel',
    sfx: [{ at: -0.6, type: 'riser', dur: 0.6, vol: 0.5 }, { at: 0.9, type: 'click', pan: -0.5 }, { at: 1.5, type: 'pop', pitch: 1.2, pan: -0.3 }] },
  { start: 5.6, end: 8.6, text: 'Then again in *3 days.*', scene: 'reel',
    sfx: [{ at: -0.6, type: 'whoosh', dur: 0.6, pan: 0.4 }, { at: 0.5, type: 'ticking', dur: 1.1, rate: 6, vol: 0.7 }, { at: 1.65, type: 'ding', vol: 0.7 }] },
  { start: 8.6, end: 10.6, text: 'Save this for *exam week.*', scene: 'reel', hold: true,
    sfx: [{ at: -0.6, type: 'whoosh', down: true, dur: 0.6 }, { at: 0.1, type: 'thump' }, { fromEnd: 1.29, type: 'click' }, { fromEnd: 1.1, type: 'chime', vol: 0.6 }] },
];

/*@@include kinetic-kit@@*/

// One paper world: every scene paints the same ground, so a travel between them has no seam.
const ground = () => background(KIN.paper);
const DAY = 112, ROW_Y = 1130, X3 = 80 - 3 * (DAY + 16);   // X3: the row in scene three, moved on by three days
function calendar(x0, lit, k) {   // a row of day squares drawn on; lit: index of the highlighted day; k: 0→1 draw-on
  for (let d = 0; d < 7; d++) {
    const kd = Ease.outBack(clamp01(k * 7 - d)), x = x0 + d * (DAY + 16);
    if (kd <= 0) continue;
    push(); translate(x + DAY / 2, ROW_Y + DAY / 2); scale(kd);
    noStroke(); fill(d === lit ? KIN.accent : '#E4DDD0'); rect(-DAY / 2, -DAY / 2, DAY, DAY, 18);
    fill(d === lit ? KIN.paper : '#9A9283'); textFont(KIN.font); textSize(34); textAlign(CENTER, CENTER); text(d + 1, 0, 2);
    pop();
  }
}
const SCENES = {
  once(s) {
    if (!s.bare) ground(); const b = kinType(0, s.t, { in: 'slam', em: 'color', y: 900 });
    const learning = b.find(x => x.word.startsWith('learning')); if (learning) kinUnder(learning, Ease.inOutCubic(clamp01((s.t - 1.35) / 0.4)));
  },
  tomorrow(s) {
    if (!s.bare) ground(); kinType(1, s.t, { in: 'rise', em: 'box', y: 760, out: s.d - 0.7 });   // the words leave as the calendar starts to slide (the slide is too short to carry them off)
    if (!(s.moving && s.t > 1)) calendar(80, s.t > 0.9 ? 1 : -1, 1);   // the anchor is there from the first frame (the rise lands on it); on the way out the 'along' move draws it
  },
  three(s) {
    if (!s.bare) ground(); kinType(2, s.t, { in: 'mask', em: 'marker', y: 760 });
    if (!s.moving) calendar(X3, 4, 1);
    const k = Ease.inOutCubic(clamp01((s.t - 0.5) / 1.1)), dayX = d => X3 + d * (DAY + 16) + DAY / 2;   // a hop from day 2 to day 5
    push(); noFill(); stroke(KIN.second); strokeWeight(10); strokeCap(ROUND);
    drawPath(Array.from({ length: 25 }, (_, j) => { const u = j / 24; return [mix(dayX(1), dayX(4), u), ROW_Y - 30 - 260 * Math.sin(Math.PI * u)]; }), k); pop();
  },
  cta(s) {
    if (!s.bare) ground();
    const t = s.t, D = Math.max(s.d, CTA_END + 0.9), tapAt = D - CTA_END;
    const ia = tw(t, 0.8, 0.45, Ease.inOutQuad) * (1 - tw(t, tapAt - 0.3, 0.3, Ease.inOutQuad)), A = ((((t - tapAt) / CTA_LOOP) % 1 + 1) % 1) * TAU;
    kinType(3, t, { in: 'slam', em: 'marker', y: 760 });
    const tt = t - tapAt, press = bump(tt, 0.05, 0.25), fillK = tw(tt, 0.1, 0.3), breathe = 1 + 0.07 * ia * (0.5 + 0.5 * Math.sin(2 * A - Math.PI / 2));
    push(); translate(W / 2, 1080 + 12 * Math.sin(A) * ia); scale(breathe * (1 - 0.12 * press));   // on screen from the scene's first frame: the fall lands on it
    noStroke(); fill(KIN.ink); beginShape(); vertex(-70, -95); vertex(70, -95); vertex(70, 95); vertex(0, 45); vertex(-70, 95); endShape(CLOSE);   // a bookmark
    fill(fillK > 0 ? KIN.accent : KIN.paper); beginShape(); vertex(-46, -71); vertex(46, -71); vertex(46, 48); vertex(0, 18); vertex(-46, 48); endShape(CLOSE);
    pop();
  },
};
const CTA_LOOP = 1.6, CTA_END = 1.29;

/*@@include scene-changes@@*/
const SEG = [{ key: 'once', line: 0 }, { key: 'tomorrow', line: 1 }, { key: 'three', line: 2 }, { key: 'cta', line: 3 }];
const MOVES = [
  { D: 0.7, draw: (p, m) => travel(p, 0, -H * 0.8, m, { world: ground }) },                 // rise: the paper scrolls up to tomorrow (text only, so the scenes may share the frame mid-move)
  { D: 0.7, draw: (p, m) => travel(p, 3 * (DAY + 16), 0, m, { world: ground, el: (k, ox) => calendar(80 + ox, k > 0.6 ? 4 : 1, 1) }) },   // along: the calendar row slides on to day 5
  { D: 0.7, draw: (p, m) => travel(p, 0, H * 0.8, m, { world: ground, el: (k, ox, oy) => { push(); translate(ox, oy); calendar(X3, 4, 1); pop(); } }) },   // fall: down to the end screen; the move carries the calendar (moving: true hides the scene's own)
];
const CAMS = {};
