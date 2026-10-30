# Style recipes for p5.js reels

How to read a style reference, and how to get common looks out of p5.js 1.x cheaply enough to record at 1080×1920 in real time. Mix and adapt; these are starting points.

## Reading a reference image

Write the answers down as a short "style DNA" comment above `SCENES`. Every scene should follow it.

| Look at | Questions |
|---|---|
| Line | None, thin or thick? Uniform or varying? Clean or wobbly? Coloured or black? |
| Fill | Flat, gradient, textured, halftone, hatched? |
| Shading | None, hard cel shadow, soft, offset drop shadow? Where is the light? |
| Edges | Crisp vector, torn paper, brushy, pixelated? |
| Texture | Grain, paper fibre, print noise, none? |
| Palette | Background colour, ink colour, 1–3 accents, and *how much* of each (proportions matter more than the hues) |
| Shapes | Geometric or organic, rounded or sharp, chunky or delicate? |
| Detail | Minimal icons or rich illustration? |
| Space | Flat, isometric, layered depth, perspective? |
| Type | Heavy sans, rounded, condensed, serif, handwritten? Pick a matching Google Font for captions. |
| Motion feel | Smooth and vector, or stepped, stop-motion, 12 fps? |

Then write 2–4 helpers that encode it, for example `inkShape(drawFn)`, `paperShadow(drawFn)` or `hatch(x, y, w, h)`, and use them everywhere. Consistency comes from shared helpers, not from remembering.

## Recipes

**Bold flat graphic / Swiss**
- Hard-edged blocks in 3–4 saturated colours on a strong grid; big heavy type as image.
- Hard cuts on the beat, slides and masks.
- `STYLE.grain = 0`, `boil = 0`.

**Paper cut-out / collage**
- Flat fills plus an offset solid shadow: draw the shape in a darker tone at (+12, +16) first. Don't use `shadowBlur`.
- Slight per-piece rotation; torn edges from a polygon whose radius is perturbed with `noise()`.
- Grain 0.05–0.1; stepped motion (`boil` 10–12).

**Risograph print**
- 2–3 spot colours on off-white.
- Draw each colour layer with `blendMode(MULTIPLY)`, offset by 3–6 px (misregistration). Reset with `blendMode(BLEND)`.
- Halftone for tones: a dot grid (spacing 18–28 px) whose dot size follows a value; paint static ones once with `layer()`.
- Heavy grain (0.12–0.2).

**Linocut / woodcut**
- One ink colour plus paper, high contrast.
- Carve-style hatching: parallel strokes inside shapes using `drawingContext.clip()`, with jittered stroke ends.
- Chunky, slightly irregular outlines (`wob`); stepped motion.

**Hand-drawn ink / doodle**
- Wobbly strokes: perturb points with `wob(i, t, 2–4)` and set `boil` to 8–12 so the line "boils".
- Round caps and joins; reveal things with `drawPath(points, u)`.
- Cross-hatch for shadow; scribble fills for colour.

**Chalkboard**
- Charcoal or green-black background.
- Chalk strokes: draw each line 3–4 times with low alpha (0.25–0.4) and 1–3 px random offsets, plus a dust grain layer.
- Draw-on reveals; eraser-wipe transitions.

**Blueprint / technical**
- Blue ground, white 2–4 px lines, a fine grid.
- Dimension lines with arrowheads; monospace labels (add the font in `<head>` and `REEL.extraFonts`).
- Everything draws on with `drawPath`.

**Neon / glow**
- Near-black background.
- Glow without `shadowBlur`: draw the stroke 3 times, wide and faint, then medium, then thin and bright.
- Deterministic flicker via `noise(seed, boilT(t))`. Use `blendMode(ADD)` for overlapping light, then reset.

**Clay / stop-motion feel**
- Chunky rounded shapes; a soft highlight with `drawingContext.createRadialGradient`; subtle squash and stretch on landings.
- `boil` 12 with small per-step position jitter (that is the stop-motion signature). Grain 0.05.

**Pixel art**
- Draw into a small `createGraphics` (e.g. 135×240), then `image()` it up to W×H with `drawingContext.imageSmoothingEnabled = false` and `g.noSmooth()`.
- Snap motion to whole pixels; limited palette; step-based animation (`boil` 8).

**Isometric**
- A projection helper: `iso(x, y, z) = [(x - y) * cos30, (x + y) * sin30 - z]`.
- Three tones per block: top light, left mid, right dark.
- Camera moves are cheap: translate the whole scene.

**Mid-century illustration**
- Muted retro palette (mustard, teal, coral, cream), geometric starbursts, boomerangs, rounded type, slight print texture.
- Gentle, bouncy motion.

**Watercolour wash**
- Paint washes once with `layer()`: 20–40 low-alpha (0.03–0.06) blobs per wash, with noisy edges.
- Animate them by moving or masking the cached layers, not by repainting.
- Paper grain on.

**Low-poly**
- Shapes as triangle fans with flat shading; colour varies by facet angle.
- Facets can tumble apart or assemble as transitions.

## Gradients and masks (p5 1.x)
- Linear or radial gradients: `const g = drawingContext.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); drawingContext.fillStyle = g;` then draw a shape with no p5 `fill()` call after it.
- Clipping: `drawingContext.save(); drawingContext.beginPath(); /* path */ drawingContext.clip(); … drawingContext.restore();`. This is good for reveals, screens and windows.
- Text: `textFont()` takes any loaded Google Font. Stroke-then-fill gives a clean outline.
