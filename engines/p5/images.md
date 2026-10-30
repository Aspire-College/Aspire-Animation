# Image-assisted mode

Part of the `reel-creator` skill; only when the user says "with images". *Section names in italics refer to the `reel-creator` skill's SKILL.md unless the section is in this file.*

## The workflow

### Asset labels and checklist
Give every asset a short, stable label (`bg_market`, `sheep_stand_front`, `sheep_walk_f01`, `coin`, `fg_stall`) and an optional suggested filename (`bg_market.png`). Keep labels identical across revisions.

Maintain a compact checklist and show it whenever it changes:

| Label | Purpose | Reference attachment | Version | Status |
|---|---|---|---|---|

Status is one of: **available** (supplied by the user), **needed**, **pending review** (returned but not yet inspected), **approved**, **rejected**, **superseded**. Never mark something approved unless the user said so; "inspected, looks usable" is not approval, so use *pending review* with your note. Offer a downloadable checklist or handoff note when useful, but do not require a separate manifest.

### Choose the minimum useful images
- Images supply distinctive characters, illustrated environments, textures and detailed props. p5.js supplies motion, diagrams, particles, masks, camera transforms, captions and visual explanations.
- Do not request an image for every sentence. Reuse images across scenes with different crops, scale, angle and motion rather than generating near-duplicates.
- Separate elements only when independent movement, layering or reuse makes the separation useful. Useful layers: background, foreground, character, movable prop, furniture, independent facial features, articulated body parts (only when required).
- A single illustration can support camera moves, reveals and effects, but that is **not** articulated character animation. Soft-3D artwork is still layered 2D artwork unless an actual 3D system is used.
- Animate with code (transforms, squash and stretch, parallax, camera pushes). Keep frame-by-frame image sequences for short loops such as a blink or a walk cycle.
- **2.5D:** background, midground and foreground share one camera angle, horizon height and light direction, stated in every prompt ("three-quarter view from slightly above, horizon at 55% of image height, light from the top left"). Moving layers at different speeds gives depth.
- Background plates are opaque 9:16 scenes with no main subject and a calm upper third (the caption band). **Every background plate must be minimalistic** (see *Minimalistic backgrounds*). Subjects and props are separate transparent images with no cast shadow; draw contact shadows in code.
- Captions and on-screen text stay in code; every prompt asks for no text.

### Minimalistic backgrounds
Whenever the skill asks the user for an image that is a **background plate** (any full-frame environment, scene or backdrop: market, street, room, landscape, interior), the plate must be **minimalistic**. This is a default for every background request, in every stage, unless the user explicitly asks for a busy or detailed background.

**Why:** the reel puts a character, props, captions and effects on top of the plate. A busy background fights all of them for attention, hides captions and the subject, and makes parallax and camera moves look cluttered. A minimalistic plate is a calm stage that the code layers can act on.

**What "minimalistic" means.** Think of the same location drawn twice. The busy version is crowded with stalls, goods, baskets, pots, animals, large props, many trees, rich texture, strong contrast and saturated colour. The minimalistic version keeps the same place and style but strips it down:
- **Same setting, far fewer elements.** Keep only what identifies the place: for a desert market, the mud-brick wall, one or two palm trees and one or two simple stalls. Drop the crowded goods, hanging items, animals, scattered pots and baskets, stacked fabrics, extra trees and small clutter.
- **Large open, empty centre.** The middle of the frame and the whole ground area stay clear and uncluttered, so a character and props can be placed there. Keep what remains of the scenery at the left and right edges and along the horizon, as a frame around the empty space.
- **Calm upper third.** Soft sky only, with at most a couple of faint clouds. Nothing important behind the caption band.
- **Simplified shapes.** Large, clean, simple forms: walls as plain blocks with a few tiny openings, palms as simple silhouettes, stalls as a roof, two posts and one cloth. No fine detail, no small repeated objects, no intricate patterns.
- **Soft, low-contrast, light palette.** Pale, muted, slightly desaturated versions of the reel's palette, a gentle pastel wash, with a hazy atmosphere that fades distant objects. No harsh shadows, no deep darks, no strong highlights.
- **Smooth, quiet texture.** Soft painterly or flat surfaces, with ground and sky as gentle washes rather than grainy detail, pebbles or visible brush noise.
- **No focal point of its own.** Nothing in the plate should pull the eye away from the subject that will be added later.

**Put these instructions in the brief itself.** ChatGPT/Codex cannot read this skill, so every background job carries the rules in words. Use this block, adapted to the scene, inside the job:

```
MINIMALISTIC BACKGROUND: keep the same location and art style but make it minimal and calm.
Only the few elements that identify the place (<for example: one mud-brick wall, two palm trees,
two simple stalls at the far left and right edges>). Leave the entire centre and the whole ground
area open and empty for characters and props. Soft, low-contrast, pale muted colours with a light
atmospheric haze; smooth gentle texture; simple large shapes; no small details. Do NOT include
crowds of goods, baskets, pots, hanging items, stacked fabric, animals, many trees, clutter,
strong shadows or high-contrast detail. Calm, almost empty sky in the top third.
```

If the user has attached a pair of reference images (a busy version and a minimalistic version of the same scene), tell them to attach **the minimalistic one** with the brief as the density reference, and state in the job: "match the level of simplicity of the attached minimalistic reference, not the busy one." Never use the busy image as a reference for a background plate.

If a plate comes back too busy, treat it as needing repair (see *Inspect returned artwork and register it*) rather than using it.

### Step A: inspect, then plan
When image-assisted mode is requested, first inspect what is attached and identify what can be reused. Then prepare a concise asset plan, one row per asset:

- asset label
- relevant script interval
- purpose
- reuse or generate
- required aspect ratio and transparency
- required reference attachment
- intended animation method

Choose sensible defaults rather than asking about every minor design decision. Ask only for missing information that materially affects the result.

The scene-change and sound plan (see *Plan first*) comes before the first image brief, because the assets depend on it: share it together with this asset plan, wait for the user's answer, then lead the next reply with the brief.

### Step B: the image brief (first reply of each stage, once the plan is agreed)
Give the user **one copyable image-generation brief** for ChatGPT/Codex for the current dependency stage. Lead the reply with the brief (the user pastes it straight away), then show the compact asset plan and checklist. Keep the reply short.

Structure the brief like this, in one code block so it copies cleanly:

```
IMAGE BRIEF — <reel title> — stage <n>
ATTACH THESE BEFORE PASTING: <label → which of the user's files>, ...
SHARED STYLE: <art style, palette with hex values, materials, outline weight, lighting direction>
SHARED RULES: no text, captions, watermarks or labels in any image. Cutouts must have a genuine
transparent background (alpha channel), not a checkerboard drawing and not a solid fill.

JOB 1 — <label> (suggested filename)
Canvas: <ratio> at <preferred pixel size>. Background: <transparent | opaque>.
Reference: <exact attachment to use> — keep consistent: <identity, costume, proportions, palette>.
Subject / action / posture / view: ...
Composition: complete subject visible, <negative space notes>, <upper third calm if a plate>.
Plates only: MINIMALISTIC BACKGROUND block (see *Minimalistic backgrounds*): few elements, empty
centre and ground, soft low-contrast pale palette, simple shapes, no clutter.
Keep separate for animation: <elements, or "none">.
Restate: no text; transparent background if cutout; minimalistic if a plate.

JOB 2 — ...
```

Every job must:
- describe subject, action, posture and view;
- carry a consistent art style, palette, materials, outlines and lighting;
- state composition, useful negative space and complete subject visibility;
- state the canvas aspect ratio and preferred dimensions;
- require a genuine transparent background for cutouts (plates are opaque);
- for background plates, include the full MINIMALISTIC BACKGROUND instructions in words (few elements, open empty centre and ground, calm sky, soft low-contrast pale palette, simple shapes, no clutter);
- forbid baked captions, unwanted text, watermarks and labels;
- name the exact reference attachment and what must stay consistent;
- list any elements that must remain separate for animation.

Include the actual visual instructions in the brief. Do not assume ChatGPT/Codex can read this skill, another chat or an inaccessible reference. Each job restates its own critical rules in a line so it still works if read alone. Each job produces one separate intended asset unless a sheet is explicitly requested. Prefer separate images when that makes the handoff or animation simpler.

Tell the user which reference images to attach when pasting the brief. If a transparent background cannot be produced by their tool, ask for a flat single colour not present in the subject (for example pure magenta) and key it out afterwards, saying so.

**Staged handoffs.** Never request an asset whose reference does not exist yet. One brief covers one dependency stage; later stages come in later replies once the earlier images are attached.

**If image generation is unavailable in Claude Chat,** provide the brief and wait for the user to attach the generated images. You may continue independent planning or code preparation meanwhile, but never present placeholders as a finished image-assisted reel. A page built with labelled placeholders is a work in progress and must be described that way.

Make open choices yourself and state them in one line rather than asking first. Do not wait for a style reference image.

### Reusable character identity
Create a reusable character kit only when the reel needs a recurring or multi-pose character. Use **four blank-face body bases**:
1. Standing FRONT
2. Standing slight-LEFT
3. Sitting FRONT
4. Sitting slight-LEFT

Reuse any matching supplied bases and generate only the missing ones. Do not automatically generate full action banks. A one-off illustration, or a reel needing only one pose, must not trigger four-base kit creation.

- Keep the **original facial identity reference** separate from the body bases.
- For independently animated talking characters, use separate eyes, brows, blink and mouth layers. Static illustrations may keep their faces when independent facial animation is unnecessary.
- Preserve the character's own proportions, costume, colours and facial design. Do not copy another character's facial placement or impose a special eye style on unrelated characters.
- For slight-left views, the shoulders, torso, hips, knees and feet follow the gentle turn. Turning only the head is not enough.
- Right-facing reuse can mirror the whole calibrated left rig where suitable. Keep directional symbols, lettering and asymmetric details as separate layers when mirroring would break them.
- All content rules apply to characters (see *Content rules*).

### Character frame reference sequence
For a missing character action:
1. Generate **frame 1** using the matching posture/view base as its **sole body reference**.
2. Obtain and keep the actual frame-1 image before requesting later frames.
3. Generate **every later frame** using that animation's saved frame 1 as its **sole reference**.
4. Never chain frame 2 into frame 3. Never use another action's frame 1.
5. Generate only the frames the action needs.
6. Repair later frames against the same frame 1; repair frame 1 against its matching base.

This needs staged handoffs: do not request dependent frames before their reference exists. A sheet of the remaining frames is allowed once frame 1 exists and is supplied as its sole reference. Keep identity, costume, proportions, view and props consistent. Preserve useful existing animations even if they were made by a different process.

State sheet layouts explicitly (rows × columns, ratio). These are layout conventions, not required frame counts:
- 2 poses: 1 row × 2 columns, 4:3 landscape
- 4 poses: 2 rows × 2 columns, 2:3 portrait
- 8 poses: 2 rows × 4 columns, 4:3 landscape

### Inspect returned artwork and register it
When the user attaches generated images:
- Match each attachment to an asset label and update the checklist (*pending review*).
- Inspect visible content, transparency, cropping, proportions and usable poses with whatever tools are available. **State any important property you cannot verify.** For example, from a chat view alone you usually cannot tell true alpha from a baked checkerboard; check pixel alpha with code if code execution is available, otherwise say it is unverified.
- For every background plate, check that it is **minimalistic**: few elements, an open and empty centre and ground, a calm sky and upper third, soft low-contrast colour, simple shapes, no clutter, no small busy detail. A plate that is crowded with props, goods, trees or texture is *pending review* with a note, never approved; ask for a repair that strips it down (see *Minimalistic backgrounds*).
- Request only essential missing or incorrect assets. If an image needs regeneration, give a focused repair prompt naming the correct reference; never ask to replace a whole usable set.
- Preserve originals when producing derived versions (trimmed, resized, keyed).

For character animation:
- Use **uniform scaling**, never stretching to disguise proportion differences.
- Align by visible crown-to-feet stature and planted feet, not a bounding box enlarged by raised hands.
- Keep stable logical placement and pivots across frames.
- Position facial layers for each pose's actual visible face.
- Keep complete pixels and allow negative placement offsets for wide poses. Inspect sheet overhangs before cropping, since figures may extend beyond nominal cells.
- Do not rotate a baked arm independently unless separated artwork and sufficient underlying body coverage exist.

### Direct character performance by meaning
- For explanatory characters, use a relaxed open-hand explanation as the home pose. Insert one or two readable accent poses for meaningful phrases, then return naturally. Don't cycle through every pose or change gesture every sentence.
- Distinguish alternative poses from actual motion phases and from poses with different meanings.
- Finger-counting is only for explicit enumeration: hold the appropriate number rather than looping through numbers. Use pointing only when there is a meaningful target.
- Let listeners stay quiet with restrained expressions and blinks.
- Time body gestures, eyes and mouths independently.
- Keep character-specific independent facial assets when supplied.
- **Lip sync:** if original voiceover and usable lip-sync cues are provided, preserve the audio timing and reuse the cues; visual changes must not need repeated speech recognition. Never invent phoneme timings and call them accurate lip sync. If reliable cues are unavailable, say so and use a suitable non-speaking presentation (or the approach the user asks for). Do not automatically suppress speaking animation during quotations or citations.

## Assets in the delivered page

**Assets**
- **Embed** the actual supplied images and audio as data URIs only when the chat's tools can do it reliably (for example by encoding the real attached files with code). Resize each image to the largest size it is drawn at, trim empty transparent margins, prefer WebP (quality about 85) or PNG for transparency, and keep the page under about 15 MB. Generate the data block with code; **never write base64 by hand and never invent base64 data, asset URLs or inaccessible attachment paths.**
- **If embedding is unavailable or impractical,** ship the HTML with a clearly labelled **local asset picker**: one file input per asset showing the exact label the user must select (`bg_market`, `sheep_stand_front`, `vo`…), loading the chosen files in the browser. Explain that the assets must be selected again whenever the HTML is reopened. Keep the picker and all editor controls outside the recorded canvas, and don't require a folder structure.
- Do not link to files next to the page; opened from disk, fetching sibling files fails.

**Loading code (works for both data URIs and picker object URLs)**
```js
const ASSETS = {            // editable config, separate from drawing logic
  bg_market: { file: 'bg_market.png', required: true },
  sheep_stand_front: { file: 'sheep_stand_front.png', required: true },
};
const IMG = {}, ASSET_ERRORS = [];
function loadImg(src) {
  return new Promise((ok, fail) => {
    const im = new Image();
    im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => ok(im));
    im.onerror = () => fail(new Error('decode failed'));
    im.src = src;
  });
}
async function loadAssets(sources) {            // sources: label -> data URI or object URL
  await Promise.all(Object.keys(ASSETS).map(async k => {
    try { IMG[k] = await loadImg(sources[k]); } catch (e) { ASSET_ERRORS.push(k); }
  }));
  await document.fonts.ready;
  if (ASSET_ERRORS.length) showAssetErrors(ASSET_ERRORS);   // visible message in the page UI
}
// Draw image `key` centred on (x, y), w px wide (height keeps the aspect unless h is given).
function art(key, x, y, w, h) {
  const im = IMG[key];
  if (!im) { return drawMissing(key, x, y, w, h ?? w); }     // labelled dashed box, preview only
  const hh = h ?? w * im.naturalHeight / im.naturalWidth;
  drawingContext.drawImage(im, x - w / 2, y - hh / 2, w, hh);
}
// 2.5D parallax: depth 0 = far (barely moves), 1 = near. cam = { x, y, z } computed from time.
function plate(key, depth, cam, x = W / 2, y = H / 2, w = W * 1.1) {
  push(); translate(x - cam.x * depth, y - cam.y * depth); scale(1 + cam.z * depth); art(key, 0, 0, w); pop();
}
```
Start playback and enable recording only after `loadAssets` resolves. **Disable Record & Download while any required asset is missing**, so a placeholder can't be recorded as a finished reel. Fade images with `drawingContext.globalAlpha = a` and reset it to 1; avoid `tint()` on large images. Mirroring: `scale(-1, 1)` around the character's pivot.

## Example invocation: image-assisted mode

> /reel-creator Image-assisted mode. Script below with timestamps. Use my attached character (`hero_face.png`, the face identity) and the attached market background (`bg_market.png`). He needs to stand and explain, and point at the chart once around 0:12. Voiceover attached as `vo.mp3`, no lip-sync cues. Cel-shaded look to match the character. Give me the image brief first for whatever is missing.
>
> 0:00–0:04 …
> 0:04–0:09 …
> 0:09–0:15 …

Expected behaviour: inspect the attachments, list what is reusable, put one copyable brief first (standing-front blank-face base referencing `hero_face.png`, one pointing frame referencing the saved base, the chart prop as a separate transparent image), show the compact asset plan and checklist with a short plan of the scene changes and sounds (the user asked for the brief first, so it leads), and wait for the generated images and the user's answer. Without cues it uses a non-speaking presentation rather than invented lip sync.
