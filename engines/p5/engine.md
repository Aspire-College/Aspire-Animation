# Engine reference

Part of the `reel-creator` skill: read it before you build. *Section names in italics refer to the `reel-creator` skill's SKILL.md unless the section is in this file.*

- **Canvas:** `W = 1080`, `H = 1920`, `SAFE = { top: 270, bottom: 1250, left: 65, right: 1015 }`.
- **SCRIPT line options:** `start`, `end`, `text`, `scene`, `sfx`, `transition`, and `hold: true` on the last line (scene and caption stay until the end of the reel, including the End screen hold).
- **Scene argument `s`:** `t` seconds into the scene, `u` progress 0→1, `d` duration, `T` global time, `i` line index, `seed`, `line` (the SCRIPT entry). In *stretch* mode `s.t` stays in script seconds, so times in scene code keep matching the SFX cues.
- **Motion helpers:** `tw(t, start, dur, ease)` (0→1 tween), `bump(t, at, dur)` (0→1→0), `mix(a, b, k)`, `clamp01(x)`, `Ease.*` (linear, in/out/inOut Quad and Cubic, outQuart, Expo, inBack, outBack, outElastic, outBounce).
- **Randomness and wobble:** `rng(seed)`, `boilT(t)`, `wob(seed, t, amt)`.
- **Drawing helpers:** `drawPath(points, u)`, `withAlpha(colour, a)`, `dropShadow()`/`noShadow()`, `layer(key, w, h, paint)`, and in image-assisted mode `art(key, x, y, w, h)` and `plate(key, depth, cam, x, y, w)`. For American realism: `applyRoom`, `ROOMS`, `AR`, `arRoom`, `arWindowLight`, `arMotes`, `arCup`, `arSolid`, `arBean`, `arClock`, `arLamp`, `arPost` (see *Default style: American realism*; the code is `realism-kit.js`). For Sun-print see `references/sunprint.md`. For the Grain style also `vgrad`, `ridgePoly`, `moodAt`, `withCam`, `filmPass` (see *Named style: Grain style* in `styles.md`). For scene changes: `portal`, `drawIn`, `travel`, `morphPts`, `smoothShape`, `ptsCircle`, `camPush`, `onScreenFrame`, `drawSceneAt` (see *Scene changes*).
- **Style hook:** if `STYLE.post` is a function, the renderer calls it with the global time after the scene (and after the template grain), before transitions and captions. American realism uses it for the canvas texture and vignette, Sun-print for grain.
- **Transitions:** `cut`, `flash`, `wipe`, `iris`, `blinds` exist for when the user asks for cuts, drawn over the cut so only one scene renders per frame. By default every line uses `scene: 'reel'` and the scene changes are drawn by the compositor (see *Scene changes*), with `REEL.autoTransitionSfx: false`. Add new overlay transitions in `TRANSITIONS`.
- **Page UI (outside the recorded canvas):** play/pause, restart, a **Full screen** button (every reel page must have one: real fullscreen on the picture where the browser allows it, otherwise a fixed full-window overlay; tap the picture to play or pause, an ✕ button, `Esc` or `F` to leave), scrubber and frame stepping; total length (= script end + **End screen hold**) with **Keep timestamps** (extra length holds the last scene, shorter trims) or **Stretch to length**, and the **End screen hold (s)** control when the script ends on a CTA; SFX volume and **Hear SFX** (speakers only, never affects the file); Reels UI guides; clickable script list; asset picker or asset-error panel where applicable; Record & Download with the detected format shown.
- **Recording:** real time, tab visible; canvas plus audio at 1080×1920; MP4 or WebM chosen by detection, never by label; file length matches the chosen total within about 0.1 s; the visual clock is aligned to the audio output clock so SFX land on their frames.

## One deterministic timeline

Make every visual reconstructible from an explicit timeline time: character poses, facial expressions, camera transforms, procedural effects, captions and scene transitions.

- Expose `renderAt(time)`, which reconstructs the same visual state independently of earlier playback. A browser clock may request interactive frames, but `renderAt` is the single source of truth for preview, scrubbing and recording.
- Use time-derived motion and **fixed random seeds** (`rng(seed)`). Avoid exported animation that depends on accumulated `frameCount`, uncontrolled physics or mutable state from earlier playback.
- Compute particles analytically (`p = p0 + v·t + ½·g·t²`). Draw all random values for an item before any `continue`, so the sequence doesn't shift when an item dies.
- Await images and fonts before playback or capture. **Surface loading errors** visibly instead of silently omitting assets.
- Synchronize provided voiceover and synthesized effects to the same timeline. Reset playback and recording state correctly on restart.
- For a complete reel, keep its original timeline. For an explicitly requested **standalone insert** assembled from selected passages, start at 00:00 and give a compact table mapping each segment back to the original audio interval.

Typical structured data, kept separate from drawing code:
```js
const TIMELINE = {
  script:  [ { start: 0.0, end: 3.2, text: 'Most people *forget* this…', scene: 'hook' } ],
  camera:  [ { t: 0, x: 0, y: 0, z: 0 }, { t: 3.2, x: 40, y: 0, z: 0.08 } ],
  perform: [ { t: 0.0, pose: 'stand_front_open', face: 'neutral' } ],
  audio:   { voiceover: 'vo' }   // label of a supplied audio asset, or null
};
```

## Engine changes for the end-screen hold

**Engine changes** (the bundled template may not have them yet; make them and keep recording, captions and timing working):
```js
// state
const UI = { len: null, timing: REEL.timing, vol: REEL.sfxVolume, monitor: true, hold: REEL.ctaHold || 0 };
// buildTimeline(): replace the first lines that set end, len, k and lines
const end = scriptEnd(), hold = Math.max(0, UI.hold || 0);
const len = Math.max(0.5, UI.len || REEL.length || end + hold);
const k = UI.timing === 'stretch' ? Math.max(0.2, len - hold) / end : 1;                    // stretch scales the script; the hold comes after it
const lines = SCRIPT.map((e, i) => ({ ...e, i, t0: e.start * k, t1: e.hold ? len : Math.min(e.end * k, len) })) /* …same filter/sort as before */;
// cues: toEnd lasts to the end, fromEnd counts back from the end
for (const c of l.sfx || []) { const time = c.fromEnd != null ? len - c.fromEnd : l.t0 + c.at * k; if (time >= 0 && time < len) cues.push(c.toEnd ? { ...c, time, dur: Math.max(0.3, len - time) } : { ...c, time }); }
// captions: the last caption of a `hold` line stays to the very last frame (no fade-out at the end)
for (const l of lines) { const own = chunkCaption(l.text, l.t0, l.hold ? Math.min(l.end * k, len) : l.t1); if (l.hold && own.length) own[own.length - 1].t1 = len + 1; caps.push(...own); }
// page: <input id="hold" type="number" min="0" max="120" step="0.5"> in the length panel, and
$('hold').addEventListener('change', () => { UI.hold = Math.max(0, Math.min(120, parseFloat($('hold').value) || 0)); if (UI.timing !== 'stretch') UI.len = null; rebuild(); });
$('len').addEventListener('change', () => { const v = parseFloat($('len').value); if (!(v > 0)) UI.len = null; else if (UI.timing === 'stretch') UI.len = Math.min(180, v); else { UI.len = null; UI.hold = Math.max(0, Math.min(120, v - scriptEnd())); } rebuild(); });
$('lenReset').onclick = () => { UI.len = null; UI.hold = REEL.ctaHold || 0; rebuild(); };
// in rebuild(), right after buildTimeline():  $('len').value = TL.len.toFixed(1); $('hold').value = UI.hold.toFixed(1);
// and add 'hold' to the list of controls that are disabled while recording
```

## Recording and export

- Capture the canvas (1080×1920) plus audio into one stream: synthesized SFX and any supplied voiceover both go through one `AudioContext`, to the speakers and to a `MediaStreamAudioDestinationNode` that is added to the recording stream. Schedule audio from the same timeline clock as the visuals.
- **Detect** what the exporter and browser support with `MediaRecorder.isTypeSupported`, in order of preference, for example `video/mp4;codecs=avc1.42E01E,mp4a.40.2`, `video/mp4`, `video/webm;codecs=vp9,opus`, `video/webm;codecs=vp8,opus`, `video/webm`.
- Use the chosen type's real MIME type for the `Blob` and derive the filename extension from it (`.mp4` or `.webm`). **Never rename WebM to `.mp4`, and never promise MP4 because the button says MP4.** Show the actual format on the page ("Recording as WebM (VP9/Opus)").
- Where provided audio is part of the reel, include it in the export together with the synchronized sound effects. Do not claim successful audio/video export without evidence; say what was and wasn't tested.
- Recording runs in real time (a 30 s reel takes 30 s) and the tab must stay visible.

## Performance
The reel records in real time at 1080×1920, so keep per-frame work light: avoid `filter()`, per-frame `loadPixels()` and large `shadowBlur` (use offset solid shadows); avoid thousands of shapes per frame; paint static backgrounds once with `layer(key, w, h, paint)`. A few large images per frame are fine; embed them no bigger than they are drawn. 30 fps by default; 60 only for simple scenes.

## p5 pitfalls
- p5 is pinned to **1.11.x**; write 1.x code.
- Global mode: don't name variables after p5 functions (`scale`, `color`, `text`, `image`, `map`, `noise`, `random`, `fill`, `filter`, `blend`, `mask`, `shape`, `line`, `hex`).
- Wrap transforms and style changes in `push()`/`pop()`; set `textFont` again after a `pop()`.
- `background()` ignores transforms, which is what lets camera shake work.
- No emoji. Never use `Math.random()` or `frameCount` in scenes.
- `W`, `H`, `T`, `SAFE` and `TL` are globals: never name a local `H` or `W` (a `const H = …` silently breaks every later use of the frame height). The engine also has `sceneAt` and `drawPath`: don't reuse those names.
