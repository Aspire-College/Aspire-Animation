# Named styles and style variations

Part of the `reel-creator` skill. *Section names in italics refer to the `reel-creator` skill's SKILL.md unless the section is in this file.*

## Named style: Sun-print

When the user says **"sun-print"**, **"sun print"** or **"cyanotype"** (or picks it from a style sheet), use `references/sunprint.md` and `assets/template_sunprint.html` instead of American realism. It is one ink on a deep ground: pale soft-edged shapes, a theme colour chosen from the script's main element, paper grain, edge to edge. If the reference file is not available, build it from this description: pale paper-white to pale-tint silhouettes with a soft two-step halo on a deep single-hue ground, detail as ground-coloured cut-out lines, slow exposure patches, a glow behind the active element, one burst of pale light on the biggest beat (inside a scene, not as a scene change), Playfair Display captions. Scene changes follow *Scene changes*, whatever the reference file or its template does.

## Named style: Grain style

When the user says **"grain style"** (or "grain look", "grainy style"), use this recipe instead of American realism, and skip the style-variations flow.

**Grain style is the treatment only, not the scenery.** It came from a dusk landscape with a hatched tree, but the tree, the hills, the sand, the town and every other element of that picture are NOT part of the style. Do not add them. The subjects, setting and props of the reel come only from the script. A script about money gets coins, a vault and charts drawn in this style; a script about the sea gets waves and a boat. Add a tree, hills or a landscape only if the script itself calls for them.

**The treatment (always applied, whatever the subject)**
- Flat, soft-edged colour fields with no outlines. Objects are simple layered shapes; farther layers are lighter and hazier (atmospheric perspective), so depth comes from colour, not detail.
- Muted, desaturated dusk palette (table below), applied to whatever the scenes contain. Where the script allows, run one continuous light mood across the reel, interpolated over time (dusk → heavy and dark → clearing → bright → dawn), rather than a new palette per scene. The camera moves through the world; it doesn't cut.
- Fine parallel and cross-hatching on the **main subject only** (whatever it is: a coin stack, a door, a boat), as thin dark lines clipped inside its shape, contrasting with the flat background.
- Soft offset shadows under objects, and small scattered detail only where the setting naturally has it.
- Film grain over the whole frame that "boils" about 10 steps a second, faint horizontal brush streaks, and a light vignette. These are the signature of the style.
- Captions: small, quiet italic old-style serif in cream; emphasis words in warm gold; a thin dark halo stroke (not a box) for contrast on light backgrounds; an optional small reference line beneath (for example a scripture reference). Fonts: Cormorant Garamond italic 500/600/700, and Amiri for Arabic. Load them with `family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@1,500;1,600;1,700` and list them in `REEL.extraFonts`.
- Never copy a source account's wordmark, handle or watermark into the reel; leave the watermark empty unless the user supplies their own text.
- All content rules still apply (no prophets in any form; people only if the script truly needs them and the rules allow it).

**Palette (colours only; apply to whatever is drawn, interpolate between moods)**

| Role | Dusk (default) | Heavy / dark | Bright / dawn |
|---|---|---|---|
| Sky / backdrop top | #8a9db6 | #4e566f | #a7b9cc → #9db9d8 |
| Sky / backdrop mid | #b3b8c6 | #6e6f89 | #d8cbc4 → #e5d6cc |
| Sky / backdrop low | #e4b99f | #a98079 | #f1cba7 → #f6cfa4 |
| Horizon glow | #f0cba6 | #c79983 | #f8d9ae → #fbe2b5 |
| Far layer (lilac) | #aa9dc6 | #8a7fa6 | #b8abd0 |
| Mid layer | #8f7eb2 | #6f6290 | #9d8cc0 |
| Near layer (deep purple) | #6b5a90 | #51456f | #7a68a0 |
| Warm ground / sand | #d2b073 → #b8935a | #a98c5d → #8c7048 | #dbb97b → #c19b60 |
| Wood / bark (if any) | #8a6a3f → #6b4f2e → #4e3822 | | |
| Plant green (if any) | #7b8450 / #a1a876 / #555d38 | | |
| Caption cream / gold | #f6ecdc / #f7cf8e | halo rgba(48,38,72,.38) | |

Use these as the reel's colours. A subject that has its own natural colour (a red door, gold coins) is drawn in a desaturated, dusk-tinted version of it.

**Build recipe (drawn mode)**
- Draw the script's own subjects as flat, soft-edged shapes with the treatment above. Build the scenery once in **world coordinates** and move a focus-point camera through it: `withCam({fx, fy, sx, sy, z}, fn)` does `translate(sx, sy); scale(z); translate(-fx, -fy)` so world point (fx, fy) lands on screen point (sx, sy). Each scene can be a different camera framing of the same world (wide push-in, close and low, pull-back, a tilt up), which gives variety without breaking the style.
- Backdrop: a vertical gradient from the palette, a soft glow near the horizon, flat cloud ellipses with a thin streak line (or a plain gradient for indoor or abstract scripts). Layers of simple shapes in the far / mid / near colours give depth for whatever the setting is (shelves, buildings, waves, dunes, machines). Only draw landscape layers when the script is set outdoors in a landscape.
- Moods are keyframes (`{t, skyTop, …, dark, cloudAmt, lit, glow}`) interpolated by `moodAt(t)` with a smoothstep; a screen-space `dark` overlay deepens the mood.
- Hatching: clip to the main subject's polygon and draw a diagonal lattice of thin dark lines; for foliage-like subjects only, draw leaves as short strokes batched per tone into `Path2D` objects (one `stroke` per tone).
- Scene changes follow an element through the one world (see *Scene changes*): the camera travels with a boat, a coin, a beam of light or a drifting leaf from one framing to the next. Overlays (a dip to a dark dusk colour, a warm flash, a hard cut on the beat) only if the user asks for cuts.
- Keep the main subjects between y ≈ 700 and 1250; the upper third stays calm for captions.

Helpers that carry the look (adapt names, keep behaviour):
```js
function vgrad(y0, y1, c0, c1) {                            // c0, c1 = [r,g,b]
  const g = drawingContext.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, rgba(c0)); g.addColorStop(1, rgba(c1)); return g;
}
function ridgePoly(fn, x0, x1, step, bot, fill) {          // flat layered shape from a ridge function (only when the setting needs one)
  const c = drawingContext; c.beginPath(); c.moveTo(x0, bot);
  for (let x = x0; x <= x1; x += step) c.lineTo(x, fn(x));
  c.lineTo(x1, fn(x1)); c.lineTo(x1, bot); c.closePath(); c.fillStyle = fill; c.fill();
}

let GRAIN = null, STREAK = null;                           // build once in setup()
function makeGrain() {
  const w = 1200, h = 2040, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const x = cv.getContext('2d'), img = x.createImageData(w, h), d = img.data, r = rng(1234);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (r() < 0.5) { d[o] = d[o+1] = d[o+2] = 255; } else { d[o] = 40; d[o+1] = 30; d[o+2] = 50; }
    d[o+3] = (r() * 34) | 0;
  }
  x.putImageData(img, 0, 0); return cv;
}
function makeStreaks() {                                    // faint horizontal brush marks
  const cv = document.createElement('canvas'); cv.width = W + 300; cv.height = H + 20;
  const x = cv.getContext('2d'), r = rng(808);
  for (let i = 0; i < 760; i++) {
    x.fillStyle = r() < 0.5 ? `rgba(255,255,255,${0.02 + r()*0.05})` : `rgba(50,40,80,${0.02 + r()*0.04})`;
    x.fillRect(r() * W * 0.7, r() * H, 200 + r() * 900, 1 + r() * 2.5);
  }
  return cv;
}
function filmPass(t, dark) {                                 // draw after the scene, before overlays and captions
  const c = drawingContext, step = Math.floor(t * 10);
  if (dark > 0.001) { c.fillStyle = `rgba(26,22,48,${dark})`; c.fillRect(0, 0, W, H); }
  c.drawImage(STREAK, -((step * 13) % 280), -(step % 3) * 4);
  c.globalAlpha = 0.6; c.drawImage(GRAIN, -((step * 137) % 120), -((step * 251) % 120)); c.globalAlpha = 1;
  const v = c.createRadialGradient(W/2, H/2, 620, W/2, H/2, 1320);
  v.addColorStop(0, 'rgba(30,20,50,0)'); v.addColorStop(1, 'rgba(30,20,50,0.34)');
  c.fillStyle = v; c.fillRect(0, 0, W, H);
}
```

**Grain style with images (only if the user said "with images")**
The image-brief style lock reads: "flat soft-edged colour fields with no outlines, desaturated dusk palette (hex values above), fine hatching only on the main subject, soft offset shadows, fine film grain and faint horizontal brush streaks, no text." It names no scenery or props beyond what the script needs. Background plates stay minimalistic (see *Minimalistic backgrounds* in `images.md`). Still apply `filmPass` in code over the composed frame so images and drawn parts share one grain.

## Style variations: five style prompts first

When the user asks for **different style variations** ("show me style options", "different styles for this script", "style variations"), do not write the reel yet. First give them image prompts to try, and wait for their pick.

**Step 1: the five style prompts (lead the reply with them).**
- Needs the timestamped script. If it is missing, ask once.
- Give **five prompts**, one per style. Each prompt makes **one image: a style sheet of four different frames from the script in a 2×2 grid**. (The user calls this a "4×4 grid": four frames. If they ask for a different count or a different grid, follow them.)
- Choose the **four frames from the script's own beats**, in script order (left to right, top to bottom): the opening frame (frame 0), one strong middle beat, the turning point or most visual beat, and the closing frame. Each frame has a different composition (wide, close, low angle, top-down...). Describe each frame's subject from the script's words, as a visual metaphor.
- The five styles must differ in **technique**, not just colour. Draw from options such as: paper cut-out layers, risograph two-colour print, ink wash, gouache storybook, linocut / woodcut, mid-century poster, blueprint line art, geometric mosaic or stained glass, low-poly, soft clay-like 3D, cel-shaded flat, cyanotype sun-print (see `references/sunprint.md`). Prefer styles that can later be recreated in pure JS (flat shapes, hatching, texture). Don't repeat American realism or the Grain style among the five unless the user asks, since the first is the default and the second is available by name. Leave colour variants out of the comparison: the five styles differ in technique.
- Every prompt is **ready to paste** into ChatGPT/Codex image generation and self-contained (it doesn't rely on this skill or another chat). Put each prompt in its own code block, labelled with the style name. Use this structure:
```
STYLE SHEET <n> — <style name> — <reel title>
Canvas: one image, portrait 9:16 (for example 2160×3840), opaque background (no transparency).
Layout: a 2×2 grid of four equal 9:16 panels in reading order (top-left, top-right, bottom-left,
bottom-right) with thin even gutters in <gutter colour>. Every panel is a full composition, not a thumbnail.
Art style: <technique, line or edge treatment, texture, shading, light direction, palette with hex values,
detail level>. Identical style and palette in all four panels.
Panel 1 (script <time>): <subject, composition, view>.
Panel 2 (script <time>): ...
Panel 3 (script <time>): ...
Panel 4 (script <time>): ...
Reference: none (or: the attached image, keep its <what>).
Rules: no text, captions, watermarks, logos or labels anywhere. Calm, uncluttered upper third in each
panel (captions go there later). <Content rules from this skill, in words: for example no people or
prophets, no nudity, no brand logos, nothing religious used as a gag.>
Restate: one image, 2×2 grid, 9:16, no text.
```
- After the prompts, add one short line: attach the one you like; say "with images" if you want generated art used as assets, otherwise it is rebuilt in pure JS. Keep the reply short. Don't build anything yet.

**Step 2: the user attaches their pick.**
- Treat the attached sheet as a **style reference**: take the treatment (technique, edges, texture, shading, palette, detail level), not the sample's subjects or scenery. Identify which style it is, write the style DNA (line, fill, shading, texture, palette proportions, shape language, detail level, perspective) and take the palette from it (see *Set the style*), then continue with the usual instructions of this skill.
- **No "with images" → drawn mode:** recreate the look in pure JS. Do not cut the sheet's panels out as reel assets (they are small style samples) unless the user asks.
- **"with images" said → image-assisted mode:** the picked style becomes the style lock in the one image brief, then continue as usual (asset plan, brief first, inspect what comes back).
- If several sheets are attached, ask which one is the pick.

## Example invocation: sun-print

> /reel-creator Sun-print style. 13 seconds, 4 scenes. …

Expected behaviour: the Sun-print recipe and `assets/template_sunprint.html` are used, with the colour theme chosen from the script's main element and stated in one line.

## Example invocation: grain style (pure JS)

> /reel-creator Grain style. 30 seconds, 5 scenes, no voiceover. Script below with timestamps. …

Expected behaviour: no images are requested. The reel is drawn in code with the Grain treatment (flat soft shapes, dusk palette, hatching on the main subject, film grain, streaks, vignette, italic serif captions). The subjects and setting come only from the script: no tree, hills or landscape appear unless the script mentions them. Plan the moves through the one world and the sounds first and share the plan; after the user agrees, vary the camera per scene, score it with diverse sounds taken from the picture (beds, the moving elements' own sounds, footsteps, touches), and deliver one `index.html`.

## Example invocation: style variations

> /reel-creator Give me style variations for this script. 0:00–0:06 … 0:06–0:12 … 0:12–0:18 … 0:18–0:24 … 0:24–0:30 …

Expected behaviour: the reply opens with five ready-to-paste style-sheet prompts (each one image, a 2×2 grid of four script frames, in a different technique), then one line asking the user to attach the pick and to say "with images" if they want generated art used as assets. Nothing is built until the pick arrives; then pure JS in that style (treatment only, no sample elements), or image-assisted mode if they said "with images".
