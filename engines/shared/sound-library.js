/** SFX library: NATURE, everyday, object, screen, people and animal sounds, all synthesized (approximations are fine).
 *  Nature and tactile: wind, rain, water, leaves, fire, cloth, paper, wood, footsteps. Everyday: whoosh, riser, impact, boom,
 *  pop, click, shutter, tick, ding, bell, ping, chime, buzz, glitch, sparkle, clink, coin, knock, heartbeat, pour, sizzle,
 *  scribble, bird and birds, crickets, crowd, city, hum. No music. Add your own with the same helpers:
 *  SFX.name = (ac, out, t, o) => { ... } (and BEDS.add('name') for a background sound).
 *  Cue options (all optional): vol (x), pitch (x), dur (s), pan (-1..1), seed.
 *    beds (long ambience): fadeIn, fadeOut (s), to (end volume x, a slow drift), lp (muffle: [[s into the cue, Hz], ...], e.g.
 *      [[1.6, 9000], [2.2, 700]] closes the sound behind glass; reverse the numbers to open a window)
 *    gust, whoosh: down.   step: surface ('grass' 'earth' 'gravel' 'sand' 'wood' 'stone' 'snow').   rustle: density.
 *    drips, typing, ticking, heartbeat, sparkle: rate.   buzz, knock, bird: n. */
const VERB = new WeakMap(), NZ = new WeakMap();
function send(ac, out, amt) {                       // dark outdoor reverb send, one shared tail per output bus
  let c = VERB.get(out);
  if (!c) {
    const sr = ac.sampleRate, len = Math.floor(sr * 2.4), ir = ac.createBuffer(2, len, sr), r = rng(11);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch); let lp = 0;
      for (let i = 0; i < len; i++) {              // noise that darkens as it decays (a one-pole low-pass that closes)
        const u = i / len, k = 0.16 + 0.5 * (1 - u) * (1 - u);
        lp += k * ((r() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - u, 3) * Math.min(1, i / (sr * 0.015));
      }
    }
    c = ac.createConvolver(); c.buffer = ir; const g = ac.createGain(); g.gain.value = 0.5; c.connect(g); g.connect(out); VERB.set(out, c);
  }
  const s = ac.createGain(); s.gain.value = amt; s.connect(c); return s;
}
function nbuf(ac, kind) {                           // 6 s stereo noise that loops without a click: 'white' | 'pink' | 'brown'
  let m = NZ.get(ac); if (!m) NZ.set(ac, m = {});
  if (m[kind]) return m[kind];
  const sr = ac.sampleRate, n = Math.floor(sr * 6), f = Math.floor(sr * 0.25), b = ac.createBuffer(2, n - f, sr);
  for (let ch = 0; ch < 2; ch++) {
    const r = rng(101 + ch * 17 + kind.length * 5), raw = new Float32Array(n);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < n; i++) {
      const w = r() * 2 - 1;
      if (kind === 'pink') { b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; raw[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; }
      else if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; raw[i] = last * 3.5; }
      else raw[i] = w * 0.6;
    }
    const d = b.getChannelData(ch);
    for (let i = 0; i < n - f; i++) d[i] = i < f ? raw[i] * Math.sin(i / f * Math.PI / 2) + raw[n - f + i] * Math.cos(i / f * Math.PI / 2) : raw[i];
  }
  return m[kind] = b;
}
function nz(ac, kind, t, dur) { const s = ac.createBufferSource(); s.buffer = nbuf(ac, kind); s.loop = true; s.start(t, Math.random() * 4); s.stop(t + dur + 0.05); return s; }
function bus(ac, out, o) { if (!o.pan) return out; const p = ac.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, o.pan)); p.connect(out); return p; }
function lfo(ac, t, d, hz, depth, param) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = hz; g.gain.value = depth; o.connect(g); g.connect(param); o.start(t); o.stop(t + d + 0.05); return o; }
function bellEnv(ac, dst, t, d, peak, skew = 0.5) {    // smooth bell-shaped swell: 0 -> peak (at skew*d) -> 0
  const g = ac.createGain(), n = 48, c = new Float32Array(n);
  for (let i = 0; i < n; i++) { const u = i / (n - 1), x = u < skew ? u / skew : (1 - u) / (1 - skew); c[i] = peak * Math.pow(Math.sin(x * Math.PI / 2), 2); }
  g.gain.value = 0; g.gain.setValueCurveAtTime(c, t, d); g.connect(dst); return g;
}
function bedGain(ac, dst, t, d, o, base) {           // fade in, hold (with an optional slow drift to o.to), fade out
  const v0 = Math.max(1e-4, base * (o.vol ?? 1)), v1 = Math.max(1e-4, base * (o.to ?? o.vol ?? 1)), g = ac.createGain();
  const fi = Math.min(o.fadeIn ?? 1.5, d * 0.45), fo = Math.min(o.fadeOut ?? 2, d * 0.45), at = x => v0 + (v1 - v0) * x / d;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(at(fi), t + fi);       // straight-line fades so overlapping beds cross-fade smoothly
  g.gain.linearRampToValueAtTime(at(d - fo), t + d - fo); g.gain.linearRampToValueAtTime(0, t + d);
  let to = dst;
  if (o.lp && o.lp.length) {                         // muffle / open: a low-pass that moves through keyframes [s into the cue, Hz]
    const f = filt(ac, 'lowpass', o.lp[0][1], 0.6); f.connect(dst); to = f;
    o.lp.forEach(([s, hz], i) => { const tt = t + Math.max(0, s); if (i) f.frequency.exponentialRampToValueAtTime(hz, tt); else f.frequency.setValueAtTime(hz, tt); });
  }
  g.connect(to); return g;
}
function grains(ac, gain, t, d, rate, amp, len, r, onGrain) {   // sparse random bursts on one gain node (leaves, rain, embers, gravel)
  let ti = t + r() * 0.5 / rate;
  while (ti < t + d - 0.03) {
    const u = (ti - t) / d, L = len * (0.6 + 0.8 * r()), a = amp(u) * (0.35 + 0.65 * r());
    if (onGrain) onGrain(ti, r);
    gain.gain.setValueAtTime(0, ti); gain.gain.linearRampToValueAtTime(a, ti + 0.004);
    gain.gain.exponentialRampToValueAtTime(1e-4, ti + 0.004 + L); gain.gain.setValueAtTime(0, ti + 0.005 + L);
    ti += Math.max(L + 0.012, (0.4 + 1.2 * r()) / rate);
  }
}
const BEDS = new Set(['wind', 'rain', 'stream', 'waves', 'fire', 'leaves', 'room', 'birds', 'crickets', 'crowd', 'city', 'hum']);
function bedCatchUp(c, t0) {                         // after a seek, a bed that started earlier carries on from where it would be
  if (!BEDS.has(c.type)) return null;
  const d = c.dur || 6, el = t0 - c.time; if (el <= 0.05 || el >= d - 0.4) return null;
  const v0 = c.vol ?? 1, v1 = c.to ?? v0;
  return { ...c, time: t0, dur: d - el, vol: v0 + (v1 - v0) * el / d, to: v1, fadeIn: 0.5, lp: c.lp && c.lp.map(([s, hz]) => [s - el, hz]) };
}

const SFX = {
  // ── Air: wind, breath, gusts ──
  wind(ac, out, t, o) {                              // bed: a soft breeze with slow gusts
    const d = o.dur || 6, p = o.pitch || 1, r = rng(o.seed || 3), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.54);
    const gust = ac.createGain(); gust.gain.value = 0.7; gust.connect(g);
    lfo(ac, t, d, 0.11 + r() * 0.06, 0.28, gust.gain); lfo(ac, t, d, 0.29 + r() * 0.1, 0.12, gust.gain);
    const body = filt(ac, 'bandpass', 380 * p, 0.55); lfo(ac, t, d, 0.17 + r() * 0.05, 140 * p, body.frequency);
    nz(ac, 'pink', t, d).connect(body).connect(gust);
    const air = filt(ac, 'bandpass', 1500 * p, 0.8), ag = ac.createGain(); ag.gain.value = 0.28; lfo(ac, t, d, 0.23 + r() * 0.05, 420 * p, air.frequency);
    nz(ac, 'pink', t, d).connect(air).connect(ag).connect(gust);
  },
  gust(ac, out, t, o) {                              // one pass of wind: use it for camera moves and big arrivals
    const d = o.dur || 1.6, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), [a, b] = o.down ? [950, 260] : [260, 950];
    const f = filt(ac, 'bandpass', a * p, 0.6); f.frequency.setValueAtTime(a * p, t); f.frequency.exponentialRampToValueAtTime(b * p, t + d);
    const env = bellEnv(ac, dst, t, d, 0.5 * v, 0.45); env.connect(send(ac, out, 0.18));
    nz(ac, 'pink', t, d).connect(f).connect(env);
    nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', 2300 * p, 0.7)).connect(bellEnv(ac, dst, t + d * 0.1, d * 0.8, 0.11 * v, 0.5));
  },
  breeze(ac, out, t, o) { SFX.gust(ac, out, t, { ...o, dur: o.dur || 0.9, vol: (o.vol ?? 1) * 0.7, pitch: (o.pitch || 1) * 1.25 }); },
  swell(ac, out, t, o) {                             // wind that builds and lifts; time it so t + dur lands on the reveal
    const d = o.dur || 1.4, v = o.vol ?? 1, f = filt(ac, 'bandpass', 200, 0.6);
    f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(1500, t + d);
    const env = bellEnv(ac, bus(ac, out, o), t, d + 0.35, 0.55 * v, d / (d + 0.35)); env.connect(send(ac, out, 0.25));
    nz(ac, 'pink', t, d + 0.4).connect(f).connect(env);
  },
  // ── Leaves, grass, steps ──
  rustle(ac, out, t, o) {                            // leaves / foliage / dry grass: a soft scatter of tiny rustles
    const d = o.dur || 0.9, v = o.vol ?? 1, p = o.pitch || 1, r = rng(o.seed || Math.floor(t * 997) + 1), dst = bus(ac, out, o);
    const f = filt(ac, 'bandpass', 3500 * p, 0.9), g = ac.createGain(); g.gain.value = 0;
    nz(ac, 'white', t, d).connect(f).connect(filt(ac, 'lowpass', 6000)).connect(g); g.connect(dst); g.connect(send(ac, out, 0.2));
    grains(ac, g, t, d, o.density || 22, u => v * 0.4 * Math.pow(Math.sin(Math.PI * Math.min(1, u)), 0.7), 0.035, r, ti => f.frequency.setValueAtTime((2300 + r() * 3000) * p, ti));
  },
  leaves(ac, out, t, o) {                            // bed: wind moving through a canopy
    const d = o.dur || 6, p = o.pitch || 1, r = rng(o.seed || 8), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.5);
    const hush = ac.createGain(); hush.gain.value = 0.5; hush.connect(g); lfo(ac, t, d, 0.2 + r() * 0.08, 0.3, hush.gain);
    nz(ac, 'pink', t, d).connect(filt(ac, 'highpass', 1800 * p)).connect(filt(ac, 'lowpass', 5200)).connect(hush);
    const gr = ac.createGain(); gr.gain.value = 0; const f = filt(ac, 'bandpass', 3500 * p, 0.9); nz(ac, 'white', t, d).connect(f).connect(gr); gr.connect(g);
    grains(ac, gr, t, d, 9, () => 0.35, 0.04, r, ti => f.frequency.setValueAtTime((2300 + r() * 3000) * p, ti));
  },
  step(ac, out, t, o) {                              // one soft footstep
    const v = o.vol ?? 1, r = rng(o.seed || Math.floor(t * 1013) + 7), p = (o.pitch || 1) * (0.92 + 0.16 * r()), dst = bus(ac, out, o), sf = o.surface || 'grass', A = 0.45 * v * (0.8 + 0.2 * r());
    const body = (lp, a, att, dec) => nz(ac, 'pink', t, dec + att).connect(filt(ac, 'lowpass', lp * p, 0.5)).connect(envGain(ac, dst, t, att, dec, a * A));
    const thump = (f, a, dec) => { const s = osc(ac, 'sine', f * p, t, dec); s.frequency.exponentialRampToValueAtTime(f * p * 0.55, t + dec * 0.8); s.connect(envGain(ac, dst, t, 0.004, dec, a * A)); };
    const crunch = (rate, span, f, a) => { const gg = ac.createGain(); gg.gain.value = 0; gg.connect(dst); nz(ac, 'white', t, span + 0.1).connect(filt(ac, 'bandpass', f * p, 1.1)).connect(gg); grains(ac, gg, t, span, rate, () => a * A, 0.012, r); };
    if (sf === 'earth') { body(900, 0.4, 0.006, 0.09); thump(95, 0.3, 0.1); crunch(60, 0.1, 2600, 0.05); }
    else if (sf === 'gravel') { body(1200, 0.2, 0.005, 0.08); crunch(90, 0.12, 3000, 0.13); thump(110, 0.15, 0.07); }
    else if (sf === 'sand') { body(1000, 0.35, 0.02, 0.16); thump(80, 0.12, 0.1); }
    else if (sf === 'wood') { thump(150, 0.5, 0.14); body(900, 0.12, 0.003, 0.03); const s = osc(ac, 'sine', 320 * p, t, 0.12); s.connect(envGain(ac, dst, t, 0.003, 0.1, 0.07 * A)); }
    else if (sf === 'stone') { body(2000, 0.25, 0.003, 0.05); thump(120, 0.25, 0.08); crunch(60, 0.04, 2500, 0.07); }
    else if (sf === 'snow') { crunch(110, 0.14, 2200, 0.14); body(700, 0.2, 0.02, 0.12); }
    else { body(650, 0.42, 0.008, 0.11); thump(88, 0.32, 0.12); crunch(140, 0.12, 3200, 0.035); }   // grass
  },
  thump(ac, out, t, o) {                             // soft earth thump: a landing, a heavy step, a fruit falling
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), s = osc(ac, 'sine', 105 * p, t, 0.3);
    s.frequency.exponentialRampToValueAtTime(48 * p, t + 0.22);
    const g = envGain(ac, dst, t, 0.006, 0.3, 0.2 * v); g.connect(send(ac, out, 0.2)); s.connect(g);
    nz(ac, 'pink', t, 0.2).connect(filt(ac, 'lowpass', 260 * p)).connect(envGain(ac, dst, t, 0.004, 0.12, 0.13 * v));
  },
  // ── Water ──
  drop(ac, out, t, o) {                              // a dewdrop falling into still water, with a faint ripple echo
    const v = o.vol ?? 1, r = rng(o.seed || Math.floor(t * 911) + 3), p = (o.pitch || 1) * (0.94 + 0.12 * r()), dst = bus(ac, out, o), wet = send(ac, out, 0.9);
    [[0, 1, 1], [0.15 + 0.04 * r(), 0.2, 1.06]].forEach(([dt, a, k]) => {
      const f = 760 * p * k, tt = t + dt, s = osc(ac, 'sine', f * 0.9, tt, 0.3), s2 = osc(ac, 'sine', f * 2.1, tt, 0.12);
      s.frequency.exponentialRampToValueAtTime(f * 1.12, tt + 0.05);
      const g = envGain(ac, dst, tt, 0.004, 0.16, 0.15 * a * v); g.connect(wet); s.connect(g);
      s2.connect(envGain(ac, dst, tt, 0.003, 0.05, 0.025 * a * v));
    });
    nz(ac, 'white', t, 0.03).connect(filt(ac, 'lowpass', 1600)).connect(envGain(ac, dst, t, 0.002, 0.02, 0.02 * v));
  },
  drips(ac, out, t, o) {                             // slow water drips, for counting or a quiet passage
    const rate = o.rate || 2, n = Math.max(1, Math.round((o.dur || 2) * rate)), r = rng(o.seed || 5);
    for (let i = 0; i < n; i++) SFX.drop(ac, out, t + i / rate + r() * 0.12, { vol: o.vol, pitch: (o.pitch || 1) * (0.8 + 0.5 * r()), pan: o.pan, seed: i + 1 });
  },
  splash(ac, out, t, o) {                            // a soft splash with a few settling drops
    const v = o.vol ?? 1, d = 0.5, r = rng(o.seed || 4), f = filt(ac, 'lowpass', 3200, 0.6);
    f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(450, t + d);
    const env = bellEnv(ac, bus(ac, out, o), t, d, 0.26 * v, 0.12); env.connect(send(ac, out, 0.4)); nz(ac, 'white', t, d).connect(f).connect(env);
    [0.1, 0.19, 0.3].forEach((dt, i) => SFX.drop(ac, out, t + dt, { vol: 0.5 * v, pitch: 1.1 + r() * 0.5, pan: o.pan, seed: 40 + i }));
  },
  stream(ac, out, t, o) {                            // bed: a small brook
    const d = o.dur || 8, r = rng(o.seed || 5), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.18);
    nz(ac, 'pink', t, d).connect(filt(ac, 'lowpass', 900)).connect(ac.createGain()).connect(g);
    [[1050, 3.2, 0.5, [[2.3, 330], [5.1, 240], [8.7, 140]]], [1900, 4, 0.3, [[3.1, 500], [6.3, 300], [11.3, 160]]]].forEach(([f0, q, a, mods]) => {
      const bp = filt(ac, 'bandpass', f0, q), ga = ac.createGain(); ga.gain.value = a;
      mods.forEach(([hz, dep]) => lfo(ac, t, d, hz * (0.9 + 0.2 * r()), dep, bp.frequency));
      nz(ac, 'white', t, d).connect(bp).connect(ga).connect(g);
    });
    const hiss = ac.createGain(); hiss.gain.value = 0.07; lfo(ac, t, d, 0.4, 0.03, hiss.gain);
    nz(ac, 'white', t, d).connect(filt(ac, 'highpass', 3200)).connect(filt(ac, 'lowpass', 6000)).connect(hiss).connect(g);
  },
  rain(ac, out, t, o) {                              // bed: soft rain on leaves
    const d = o.dur || 8, r = rng(o.seed || 6), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.24);
    const sheet = ac.createGain(); sheet.gain.value = 0.5; lfo(ac, t, d, 0.17, 0.12, sheet.gain);
    nz(ac, 'white', t, d).connect(filt(ac, 'highpass', 900)).connect(filt(ac, 'lowpass', 5200)).connect(sheet).connect(g);
    const body = ac.createGain(); body.gain.value = 0.35; nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', 520, 0.6)).connect(body).connect(g);
    const pg = ac.createGain(); pg.gain.value = 0; const f = filt(ac, 'bandpass', 3600, 1); nz(ac, 'white', t, d).connect(f).connect(pg); pg.connect(g);
    grains(ac, pg, t, d, 38, () => 0.35, 0.012, r, ti => f.frequency.setValueAtTime(2400 + r() * 2800, ti));
  },
  waves(ac, out, t, o) {                             // bed: slow waves on a shore
    const d = o.dur || 10, r = rng(o.seed || 7), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.24), hz = 0.1 + r() * 0.03;
    const swell = ac.createGain(); swell.gain.value = 0.5; swell.connect(g); lfo(ac, t, d, hz, 0.45, swell.gain);
    const lp = filt(ac, 'lowpass', 650); lfo(ac, t, d, hz, 450, lp.frequency); nz(ac, 'pink', t, d).connect(lp).connect(swell);
    const foam = ac.createGain(); foam.gain.value = 0.16; foam.connect(swell); nz(ac, 'white', t, d).connect(filt(ac, 'highpass', 2200)).connect(filt(ac, 'lowpass', 5800)).connect(foam);
  },
  fire(ac, out, t, o) {                              // bed: a quiet fire, a low roar with small crackles
    const d = o.dur || 8, r = rng(o.seed || 10), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.33);
    const roar = ac.createGain(); roar.gain.value = 0.5; lfo(ac, t, d, 0.7, 0.1, roar.gain); nz(ac, 'brown', t, d).connect(filt(ac, 'lowpass', 450)).connect(roar).connect(g);
    const cg = ac.createGain(); cg.gain.value = 0; const f = filt(ac, 'bandpass', 2400, 1); nz(ac, 'white', t, d).connect(f).connect(cg); cg.connect(g);
    grains(ac, cg, t, d, 7, () => 0.7, 0.008, r, ti => f.frequency.setValueAtTime(1200 + r() * 3200, ti));
  },
  thunder(ac, out, t, o) {                           // distant rolling thunder: low, slow, never sharp
    const d = o.dur || 3.6, v = o.vol ?? 1, dst = bus(ac, out, o), f = filt(ac, 'lowpass', 200);
    f.frequency.setValueAtTime(260, t); f.frequency.exponentialRampToValueAtTime(90, t + d);
    const env = bellEnv(ac, dst, t, d, 0.44 * v, 0.2); env.connect(send(ac, out, 0.3)); lfo(ac, t, d, 3.1, 0.07 * v, env.gain);
    nz(ac, 'brown', t, d).connect(f).connect(env);
    nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', 300, 0.5)).connect(bellEnv(ac, dst, t, d, 0.11 * v, 0.18));   // body that small speakers can play
  },
  room(ac, out, t, o) {                              // bed: a quiet room, near silence with a little air (indoors, and the hush before a key line)
    const d = o.dur || 6, g = bedGain(ac, bus(ac, out, o), t, d, o, 0.06);
    nz(ac, 'brown', t, d).connect(filt(ac, 'lowpass', 320)).connect(g);
    const air = ac.createGain(); air.gain.value = 0.1; nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', 700, 0.5)).connect(air).connect(g);
  },
  // ── Cloth and paper ──
  cloth(ac, out, t, o) {                             // fabric moving: a bag swung off a shoulder, a sleeve, a curtain drawn
    const d = o.dur || 0.45, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), r = rng(o.seed || Math.floor(t * 577) + 9);
    const f = filt(ac, 'bandpass', 800 * p, 0.7); f.frequency.setValueAtTime(650 * p, t); f.frequency.exponentialRampToValueAtTime(1500 * p, t + d * 0.5); f.frequency.exponentialRampToValueAtTime(850 * p, t + d);
    nz(ac, 'pink', t, d).connect(f).connect(bellEnv(ac, dst, t, d, 0.42 * v, 0.4));
    const g = ac.createGain(); g.gain.value = 0; g.connect(dst); const f2 = filt(ac, 'bandpass', 2400 * p, 1.1);
    nz(ac, 'white', t, d).connect(f2).connect(filt(ac, 'lowpass', 4800)).connect(g);
    grains(ac, g, t, d, 28, u => 0.1 * v * Math.sin(Math.PI * Math.min(1, u)), 0.02, r);
  },
  flap(ac, out, t, o) {                              // a curtain or a flag flapping in the wind: irregular soft cloth snaps (pair it with a gust)
    const d = o.dur || 1.5, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), r = rng(o.seed || 21);
    const g = ac.createGain(); g.gain.value = 0; g.connect(dst); g.connect(send(ac, out, 0.15));
    const f = filt(ac, 'bandpass', 1000 * p, 0.8); nz(ac, 'pink', t, d + 0.1).connect(f).connect(g);
    let ti = t + 0.04;
    while (ti < t + d - 0.08) {
      const u = (ti - t) / d, a = 0.55 * v * Math.pow(Math.sin(Math.PI * u), 0.6) * (0.45 + 0.55 * r()), L = 0.05 + 0.08 * r();
      f.frequency.setValueAtTime((750 + 800 * r()) * p, ti);
      g.gain.setValueAtTime(0.0001, ti); g.gain.linearRampToValueAtTime(a, ti + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, ti + 0.012 + L);
      ti += Math.max(L + 0.03, 0.1 + 0.18 * r());
    }
  },
  crease(ac, out, t, o) {                            // one paper crease while folding: a short, dry crackle (use 2 or 3 for a fold)
    const v = o.vol ?? 1, d = o.dur || 0.12, dst = bus(ac, out, o), r = rng(o.seed || Math.floor(t * 431) + 5);
    const g = ac.createGain(); g.gain.value = 0; g.connect(dst); const f = filt(ac, 'bandpass', 2200, 0.9);
    nz(ac, 'white', t, d + 0.05).connect(f).connect(filt(ac, 'lowpass', 5000)).connect(g);
    grains(ac, g, t, d, 70, () => 0.42 * v, 0.006, r, ti => f.frequency.setValueAtTime(1400 + r() * 2200, ti));
    nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', 900, 0.8)).connect(bellEnv(ac, dst, t, d, 0.22 * v, 0.3));
  },
  flutter(ac, out, t, o) {                           // paper fluttering through the air: a paper plane, a page blown away
    const d = o.dur || 0.9, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o);
    const f = filt(ac, 'bandpass', 1100 * p, 0.9); f.frequency.setValueAtTime(900 * p, t); f.frequency.exponentialRampToValueAtTime(1500 * p, t + d);
    const am = ac.createGain(); am.gain.value = 0.55; lfo(ac, t, d, 19, 0.45, am.gain);
    nz(ac, 'pink', t, d).connect(f).connect(am).connect(bellEnv(ac, dst, t, d, 0.42 * v, 0.35));
  },
  // ── Small touches ──
  pebble(ac, out, t, o) {                            // a small stone tapped on stone
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), s = osc(ac, 'sine', 1150 * p, t, 0.08);
    s.frequency.exponentialRampToValueAtTime(760 * p, t + 0.03); const g = envGain(ac, dst, t, 0.001, 0.035, 0.2 * v); g.connect(send(ac, out, 0.15)); s.connect(g);
    nz(ac, 'white', t, 0.03).connect(filt(ac, 'bandpass', 2100 * p, 1.2)).connect(filt(ac, 'lowpass', 4500)).connect(envGain(ac, dst, t, 0.001, 0.014, 0.14 * v));
  },
  wood(ac, out, t, o) {                              // a hollow wooden knock (bamboo, a branch, a door)
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), wet = send(ac, out, 0.25);
    [[1, 0.16, 0.13], [1.62, 0.056, 0.07], [2.7, 0.02, 0.04]].forEach(([m, a, dec]) => { const g = envGain(ac, dst, t, 0.002, dec, a * v); g.connect(wet); osc(ac, 'sine', 400 * p * m, t, dec).connect(g); });
    nz(ac, 'white', t, 0.02).connect(filt(ac, 'bandpass', 800, 0.8)).connect(envGain(ac, dst, t, 0.001, 0.012, 0.05 * v));
  },
  twig(ac, out, t, o) {                              // a dry twig giving way: two small soft cracks
    const v = o.vol ?? 1, dst = bus(ac, out, o), wet = send(ac, out, 0.2);
    [0, 0.028].forEach((dt, i) => { const g = envGain(ac, dst, t + dt, 0.001, 0.02, 0.56 * v * (i ? 0.6 : 1)); g.connect(wet); nz(ac, 'white', t + dt, 0.04).connect(filt(ac, 'bandpass', 1500 + i * 500, 1)).connect(filt(ac, 'lowpass', 4500)).connect(g); });
  },
  paper(ac, out, t, o) {                             // a page turning
    const v = o.vol ?? 1, d = o.dur || 0.34, f = filt(ac, 'bandpass', 1800, 0.8);
    f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(700, t + d);
    nz(ac, 'pink', t, d).connect(f).connect(bellEnv(ac, bus(ac, out, o), t, d, 0.4 * v, 0.3));
  },
  type(ac, out, t, o) {                              // one soft wooden key
    const v = o.vol ?? 1, dst = bus(ac, out, o), s = osc(ac, 'sine', 190, t, 0.04); s.connect(envGain(ac, dst, t, 0.002, 0.03, 0.15 * v));
    nz(ac, 'pink', t, 0.03).connect(filt(ac, 'lowpass', 700)).connect(envGain(ac, dst, t, 0.002, 0.02, 0.18 * v));
  },
  typing(ac, out, t, o) { const rate = o.rate || 9, n = Math.round((o.dur || 1) * rate), r = rng(o.seed || 5); for (let i = 0; i < n; i++) SFX.type(ac, out, t + i / rate + r() * 0.04, { vol: (o.vol ?? 1) * (0.7 + 0.3 * r()), pan: o.pan }); },
  // ── Everyday, objects, screens, people and animals (approximations: close to the picture is enough) ──
  whoosh(ac, out, t, o) {                            // air rushing past: something flies by, a fast move (down: falling)
    const d = o.dur || 0.5, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), f = filt(ac, 'bandpass', 1, 1.1), [a, b] = o.down ? [2800, 260] : [260, 2800];
    f.frequency.setValueAtTime(a * p, t); f.frequency.exponentialRampToValueAtTime(b * p, t + d);
    const g = bellEnv(ac, dst, t, d, 0.7 * v, 0.6); g.connect(send(ac, out, 0.3)); nz(ac, 'pink', t, d).connect(f).connect(g);
  },
  riser(ac, out, t, o) {                             // tension building to a reveal; time it so t + dur lands on it
    const d = o.dur || 1.6, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), f = filt(ac, 'bandpass', 300 * p, 1.4), s = osc(ac, 'sine', 180 * p, t, d);
    f.frequency.exponentialRampToValueAtTime(3200 * p, t + d); s.frequency.exponentialRampToValueAtTime(520 * p, t + d);
    const g = bellEnv(ac, dst, t, d, 0.6 * v, 0.92); g.connect(send(ac, out, 0.4)); nz(ac, 'pink', t, d).connect(f).connect(g); s.connect(bellEnv(ac, dst, t, d, 0.05 * v, 0.92));
  },
  impact(ac, out, t, o) {                            // a weighty hit: a hard landing, a slam, a reveal
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), s = osc(ac, 'sine', 90 * p, t, 0.6); s.frequency.exponentialRampToValueAtTime(38 * p, t + 0.4);
    const g = envGain(ac, dst, t, 0.003, 0.55, 0.24 * v); g.connect(send(ac, out, 0.35)); s.connect(g);
    nz(ac, 'pink', t, 0.25).connect(filt(ac, 'lowpass', 1400 * p)).connect(envGain(ac, dst, t, 0.002, 0.18, 0.18 * v));
  },
  boom(ac, out, t, o) {                              // a deep boom: close thunder, a cannon, a huge reveal
    const v = o.vol ?? 1, d = o.dur || 2.4, dst = bus(ac, out, o), s = osc(ac, 'sine', 62 * (o.pitch || 1), t, d); s.frequency.exponentialRampToValueAtTime(30, t + d);
    const g = envGain(ac, dst, t, 0.01, d, 0.36 * v); g.connect(send(ac, out, 0.5)); s.connect(g);
    nz(ac, 'brown', t, d).connect(filt(ac, 'lowpass', 220)).connect(envGain(ac, dst, t, 0.02, d * 0.8, 0.4 * v));
  },
  pop(ac, out, t, o) {                               // a cork, a bubble, something popping into view
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), s = osc(ac, 'sine', 880 * p, t, 0.1); s.frequency.exponentialRampToValueAtTime(240 * p, t + 0.07);
    s.connect(envGain(ac, dst, t, 0.002, 0.07, 0.15 * v)); nz(ac, 'white', t, 0.02).connect(filt(ac, 'bandpass', 1800 * p, 1)).connect(envGain(ac, dst, t, 0.001, 0.01, 0.08 * v));
  },
  click(ac, out, t, o) {                             // a button, a switch, a mouse, a pen
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o);
    nz(ac, 'white', t, 0.02).connect(filt(ac, 'highpass', 1800 * p)).connect(envGain(ac, dst, t, 0.0005, 0.008, 0.22 * v));
    osc(ac, 'triangle', 2400 * p, t, 0.02).connect(envGain(ac, dst, t, 0.0005, 0.012, 0.06 * v));
  },
  shutter(ac, out, t, o) {                           // a camera taking a photo
    SFX.click(ac, out, t, o); SFX.click(ac, out, t + 0.07, { ...o, pitch: (o.pitch || 1) * 0.8 });
    nz(ac, 'white', t + 0.01, 0.06).connect(filt(ac, 'bandpass', 2500, 0.8)).connect(envGain(ac, bus(ac, out, o), t + 0.01, 0.005, 0.05, 0.12 * (o.vol ?? 1)));
  },
  tick(ac, out, t, o) {                              // one clock tick (pitch under 1: the tock)
    const v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o);
    nz(ac, 'white', t, 0.02).connect(filt(ac, 'bandpass', 3200 * p, 2)).connect(envGain(ac, dst, t, 0.0005, 0.012, 0.3 * v));
    osc(ac, 'sine', 1900 * p, t, 0.03).connect(envGain(ac, dst, t, 0.0005, 0.02, 0.07 * v));
  },
  ticking(ac, out, t, o) { const rate = o.rate || 1, n = Math.max(1, Math.round((o.dur || 3) * rate)); for (let i = 0; i < n; i++) SFX.tick(ac, out, t + i / rate, { ...o, pitch: (o.pitch || 1) * (i % 2 ? 0.82 : 1) }); },
  ding(ac, out, t, o) {                              // a small bell: a notification, a shop door, an idea
    const v = o.vol ?? 1, f = 1040 * (o.pitch || 1), d = o.dur || 1.4, dst = bus(ac, out, o), wet = send(ac, out, 0.4);
    [[1, 0.12, 1], [2.76, 0.04, 0.45], [5.4, 0.015, 0.25]].forEach(([m, a, k]) => { const g = envGain(ac, dst, t, 0.002, d * k, a * v); g.connect(wet); osc(ac, 'sine', f * m, t, d * k).connect(g); });
  },
  bell(ac, out, t, o) { SFX.ding(ac, out, t, { ...o, dur: o.dur || 2.6, pitch: (o.pitch || 1) * 0.55 }); },          // a larger bell, a school bell
  ping(ac, out, t, o) { SFX.ding(ac, out, t, { ...o, dur: o.dur || 0.5, pitch: (o.pitch || 1) * 1.35 }); },          // a short screen ping
  chime(ac, out, t, o) { SFX.ding(ac, out, t, { ...o, dur: o.dur || 0.9 }); SFX.ding(ac, out, t + 0.13, { ...o, dur: o.dur || 1.2, pitch: (o.pitch || 1) * 1.5 }); },   // two notes: a message, success
  buzz(ac, out, t, o) {                              // a phone vibrating on a table (dur: one buzz; n: how many)
    const v = o.vol ?? 1, d = o.dur || 0.4, dst = bus(ac, out, o);
    for (let i = 0; i < (o.n || 2); i++) {
      const tt = t + i * (d + 0.18), g = ac.createGain(); g.connect(dst);
      g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(0.1 * v, tt + 0.02); g.gain.setValueAtTime(0.1 * v, tt + d - 0.03); g.gain.linearRampToValueAtTime(0, tt + d);
      osc(ac, 'sawtooth', 150 * (o.pitch || 1), tt, d).connect(filt(ac, 'lowpass', 600)).connect(g);
    }
  },
  glitch(ac, out, t, o) {                            // a screen glitching: stuttering digital bursts
    const v = o.vol ?? 1, d = o.dur || 0.4, r = rng(o.seed || 17), dst = bus(ac, out, o);
    for (let tt = t; tt < t + d; tt += 0.025 + r() * 0.05) { const L = 0.01 + r() * 0.03; nz(ac, 'white', tt, L).connect(filt(ac, 'bandpass', 400 + r() * 3000, 2)).connect(envGain(ac, dst, tt, 0.001, L, 0.4 * v * (0.3 + 0.7 * r()))); }
  },
  sparkle(ac, out, t, o) {                           // glints and twinkles: magic, something clean or new, stars, an idea
    const v = o.vol ?? 1, d = o.dur || 1, r = rng(o.seed || 7), dst = bus(ac, out, o), wet = send(ac, out, 0.6);
    for (let i = 0, n = Math.round(d * (o.rate || 14)); i < n; i++) { const tt = t + r() * d, f = (2200 + r() * 3200) * (o.pitch || 1), g = envGain(ac, dst, tt, 0.002, 0.12 + r() * 0.2, 0.05 * v * (0.4 + r())); g.connect(wet); osc(ac, 'sine', f, tt, 0.35).connect(g); }
  },
  shimmer(ac, out, t, o) { SFX.sparkle(ac, out, t, { ...o, rate: o.rate || 24, dur: o.dur || 1.4 }); },
  clink(ac, out, t, o) {                             // glass or china touching, a spoon in a cup
    const v = o.vol ?? 1, f = 2300 * (o.pitch || 1), dst = bus(ac, out, o), wet = send(ac, out, 0.3);
    [[1, 0.1, 0.5], [2.32, 0.05, 0.3], [3.9, 0.03, 0.2]].forEach(([m, a, dec]) => { const g = envGain(ac, dst, t, 0.001, dec, a * v); g.connect(wet); osc(ac, 'sine', f * m, t, dec).connect(g); });
  },
  coin(ac, out, t, o) { const p = (o.pitch || 1) * 1.3; SFX.clink(ac, out, t, { ...o, pitch: p }); SFX.clink(ac, out, t + 0.11, { ...o, vol: (o.vol ?? 1) * 0.5, pitch: p }); },   // coins dropping
  knock(ac, out, t, o) { for (let i = 0; i < (o.n || 3); i++) SFX.wood(ac, out, t + i * 0.16, { ...o, pitch: (o.pitch || 1) * 0.5, vol: (o.vol ?? 1) * 1.3 }); },   // knocks on a door
  heartbeat(ac, out, t, o) {                         // lub-dub, rate beats a second (life, fear, waiting)
    const rate = o.rate || 1.2, n = Math.max(1, Math.round((o.dur || 3) * rate));
    for (let i = 0; i < n; i++) [[0, 1], [0.28, 0.7]].forEach(([dt, a]) => SFX.thump(ac, out, t + i / rate + dt, { vol: (o.vol ?? 1) * a, pitch: 0.75 * (o.pitch || 1), pan: o.pan }));
  },
  pour(ac, out, t, o) {                              // liquid poured into a cup or glass (rising as it fills)
    const d = o.dur || 1.5, v = o.vol ?? 1, p = o.pitch || 1, dst = bus(ac, out, o), f = filt(ac, 'bandpass', 500 * p, 3), g = bellEnv(ac, dst, t, d, 0.9 * v, 0.2);
    f.frequency.exponentialRampToValueAtTime(1400 * p, t + d); lfo(ac, t, d, 9, 160 * p, f.frequency); g.connect(send(ac, out, 0.2)); nz(ac, 'white', t, d).connect(f).connect(g);
  },
  sizzle(ac, out, t, o) {                            // frying, steam, a hot pan
    const d = o.dur || 2, v = o.vol ?? 1, dst = bus(ac, out, o), g = ac.createGain(); g.gain.value = 0; g.connect(dst);
    grains(ac, g, t, d, 60, () => 0.25 * v, 0.01, rng(o.seed || 4)); nz(ac, 'white', t, d).connect(filt(ac, 'highpass', 3000)).connect(g);
    nz(ac, 'white', t, d).connect(filt(ac, 'highpass', 4000)).connect(bellEnv(ac, dst, t, d, 0.05 * v, 0.3));
  },
  scribble(ac, out, t, o) {                          // a pencil or pen writing
    const d = o.dur || 1.2, v = o.vol ?? 1, dst = bus(ac, out, o), g = ac.createGain(); g.gain.value = 0; g.connect(dst);
    grains(ac, g, t, d, 16, () => 0.5 * v, 0.05, rng(o.seed || 8)); nz(ac, 'white', t, d).connect(filt(ac, 'bandpass', 2600 * (o.pitch || 1), 1.2)).connect(g);
  },
  bird(ac, out, t, o) {                              // a small bird's call: a few quick chirps
    const v = o.vol ?? 1, p = o.pitch || 1, r = rng(o.seed || Math.floor(t * 37) + 2), dst = bus(ac, out, o), wet = send(ac, out, 0.5);
    for (let i = 0, n = o.n || 2 + Math.floor(r() * 3); i < n; i++) {
      const tt = t + i * (0.09 + r() * 0.05), f = (2600 + r() * 900) * p, s = osc(ac, 'sine', f, tt, 0.08);
      s.frequency.exponentialRampToValueAtTime(f * (1.25 + r() * 0.3), tt + 0.03); s.frequency.exponentialRampToValueAtTime(f * 0.85, tt + 0.07);
      const g = envGain(ac, dst, tt, 0.005, 0.06, 0.15 * v); g.connect(wet); s.connect(g);
    }
  },
  birds(ac, out, t, o) {                             // bed: birds around a garden or a morning window
    const d = o.dur || 6, r = rng(o.seed || 21);
    for (let tt = t + r(); tt < t + d - 0.5; tt += 0.8 + r() * 1.8) SFX.bird(ac, out, tt, { vol: (o.vol ?? 1) * (0.4 + 0.6 * r()), pitch: (o.pitch || 1) * (0.85 + 0.3 * r()), pan: (r() - 0.5) * 1.2, seed: Math.floor(r() * 1e6) });
  },
  crickets(ac, out, t, o) {                          // bed: a night field
    const d = o.dur || 6, p = o.pitch || 1, g = bedGain(ac, bus(ac, out, o), t, d, o, 0.05), a = ac.createGain(), b = ac.createGain();
    a.gain.value = 0.5; b.gain.value = 0.5; a.connect(b); b.connect(g); lfo(ac, t, d, 27, 0.5, a.gain); lfo(ac, t, d, 1.7, 0.5, b.gain);
    osc(ac, 'sine', 4300 * p, t, d).connect(a); osc(ac, 'sine', 4600 * p, t, d).connect(a);
  },
  crowd(ac, out, t, o) {                             // bed: many people talking (a market, a hall, a playground)
    const d = o.dur || 6, r = rng(o.seed || 9), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.5);
    for (const [fc, q, hz] of [[420, 2, 3.1], [900, 3, 4.3], [1600, 3, 5.2]]) { const a = ac.createGain(); a.gain.value = 0.5; a.connect(g); lfo(ac, t, d, hz + r(), 0.45, a.gain); nz(ac, 'pink', t, d).connect(filt(ac, 'bandpass', fc * (o.pitch || 1), q)).connect(a); }
  },
  city(ac, out, t, o) {                              // bed: traffic and the hum of a town, a car passing now and then
    const d = o.dur || 6, r = rng(o.seed || 13), g = bedGain(ac, bus(ac, out, o), t, d, o, 0.2);
    nz(ac, 'brown', t, d).connect(filt(ac, 'lowpass', 380)).connect(g);
    for (let tt = t + 0.6 + r() * 1.5; tt < t + d - 2; tt += 2.2 + r() * 3) SFX.whoosh(ac, out, tt, { dur: 1.6 + r(), vol: (o.vol ?? 1) * 0.2, pitch: 0.35, pan: r() < 0.5 ? -0.6 : 0.6 });
  },
  hum(ac, out, t, o) {                               // bed: a fridge, a machine, lights, a computer
    const d = o.dur || 6, p = o.pitch || 1, g = bedGain(ac, bus(ac, out, o), t, d, o, 0.03);
    [[100, 1], [200, 0.5], [300, 0.2]].forEach(([f, a]) => { const k = ac.createGain(); k.gain.value = a; k.connect(g); osc(ac, 'sine', f * p, t, d).connect(k); });
  },
};
