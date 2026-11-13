---
name: "reel-creator-2-5d"
description: "Aspire repo engine skill (engine: hybrid). Turn a timestamped Reel script into a 2.5D 9:16 reel in Three.js: every element painted with p5.js on flat layers standing in a 3D space, with real 3D camera moves, parallax, depth, light and particles; a fresh art direction every reel, no cuts, planned first and built scene by scene. Use for 2.5D reels; images only when the user says \"with images\". Say 'give prompt' for a ready-to-paste build prompt, or 'prompt in parts' for the plan-first, part-by-part version; no reel is built in either case."
---

# 2.5D Reel Creator

You turn a timestamped script into a vertical 2.5D reel: one `index.html` that renders every frame with Three.js, shows captions line by line, plays a diverse sound score matched to the picture and records itself at 1080×1920.

**2.5D:** everything you see (sky, hills, streets, walls, rooms, furniture, people, plants, light) is a picture painted with p5.js on a flat card, and the cards stand in a real 3D space. The camera moves through them in 3D, so near layers slide past far ones (parallax), haze and light give depth, and particles drift in 3D between the layers. A 3D form is only for what no card can do (something that turns fully round: a coin, a globe, a lantern), and it is painted too.

- **Drawn (default):** you paint every picture in code.
- **With images:** only when the user says **"with images"** (or attaches images and says to use them). The user generates the focal pictures from your prompts; code paints the rest in the same style. Never switch on your own.

Plan first, then build scene by scene. No cuts: an element of each scene takes us into the next. The user checks the picture with screenshots. Explicit user instructions override every default here. Standalone hooks go to `reel-visual-hook`, flat 2D reels to `reel-creator`, 3D reels to `reel-creator-3d`; don't add an opening card or hook to a supplied script.

## Prompt mode: "give prompt" and "prompt in parts"

These two requests ask for a prompt to paste into another chat, not for a reel. When the user says **"give prompt"** or **"prompt in parts"** (or plainly asks for the prompt, for example "give me the prompt"), do only the steps below and skip everything else in this skill: no plan, no engine page, no questions about style or mode, no build.

1. **Pick the template.** "give prompt" → *Single prompt*. "prompt in parts" → *Prompt in parts* (a brief plan first, then one working part per message).
2. **Fill in the task.** The user's request for the reel (their script and any style, length, CTA or other instructions, whether in this message or earlier in the chat) goes after `Task:` exactly as they wrote it. Don't summarise, improve or expand it. If their words don't already say what kind of reel it is, put this one line first, then their words on the next line: "Make a 2.5D 9:16 Reel (1080×1920) as a single index.html in Three.js: every element painted with p5.js on flat layers standing in 3D space, real 3D camera moves, parallax, depth, light and particles, no cuts (an element of each scene takes us into the next), captions line by line, a sound score matched to the picture, and Record & Download, from this timestamped script:"
3. **Reply.** Give the finished prompt inside one plain code block. One short line before it is the most allowed; nothing after it.

If there is no script yet, ask for it in one sentence and stop. Copy the templates word for word: don't reword, shorten, add to or reorder any line.

**Single prompt** ("give prompt")

```
Build the task below as a complete project in one working file. Make reasonable choices quickly.

Deliver the complete working code in one message, with brief instructions. For bugs, give a concise patch.

Your output limit is 50,000 tokens, so always go with your first choices and don't waste effort in thinking.

Task:
[USER'S TASK, VERBATIM]
```

**Prompt in parts** ("prompt in parts")

```
Build the task below as a complete project in small, working parts. Make reasonable choices quickly.

First, give a brief plan only and wait for “approved.” Then deliver one part per message, with code and brief instructions. Wait for “next” before continuing. For bugs, give a concise patch.

For the plan and every part: your output limit is 50,000 tokens, so always go with your first choices and don't waste effort in thinking.

Task:
[USER'S TASK, VERBATIM]
```

## Environment and cost

- This copy of the skill runs in Claude Code inside the **aspire-animation** repository (read `CLAUDE.md` first). Files in the repo replace attachments. Every reel lives in `reels/<YYYY-MM-DD>-<topic>/` (start it with `node tools/new-reel.js "<topic>" --skill <skill>`): `script.md` (script, brief, agreed plan, review notes), `reel.json` (engine `hybrid`), `images/`, `reel.js`, the built `index.html` and the rendered `out.mp4`.
- **You can see the picture here.** Headless Chromium in this repo loads Three.js and renders WebGL. `node tools/build.js reels/<folder> --check` runs `build.py --check` (code errors, camera speed, the shot list, where subjects land, cards seen edge-on, picture sizes, p5 calls) and then renders frame 0 plus the start, middle and end of every caption to `reels/<folder>/.check/` with a contact sheet `sheet.png`: Read the images and look at them. `node tools/render.js reels/<folder> --frames 3.1,3.4,3.7` renders the times you name (your `CHECKS`, the frames across a move). You don't need the user's screenshots, though they can still send them from the page's 📸 and 📷 buttons. Say what you looked at; you still haven't heard the sound.
- `node tools/render.js reels/<folder>` writes `out.mp4` (H.264 + AAC, 1080×1920, frame-perfect, not limited to real time) and reports the sound's peak level. The page's own Record & Download still works for the user in Chrome, Edge or Safari.
- **Spend output only on what is new.** Copy the engine from its page (see *Build*), never retype it. You write only `reel.js`: once in round 1, then small Edits of the lines that change. Paint with short functions you reuse (one function per character, one per kind of tree or cloud, drawn with different seeds and sizes). Short comments, short replies, no code pasted into the chat.

## What you need

- **The script with timestamps** (required), in any notation (`0:03`, `[3s]`, `0:03–0:07`). If timestamps are missing, ask once; if told to go ahead, estimate 2.5 words per second plus 0.3 s between lines and say so. Use the user's words exactly; `*word*` marks the one or two words that carry the punch.
- Optional, never block on them: a CTA, the audience (it decides who "you" is on screen; ask in the plan if unknown), a voiceover, the user's own sound recordings, a look they want. If an "attached" image isn't there, take the look from their words and carry on.

## Art direction: a new look every reel

There is no house style and no template: you have complete creative freedom. Choose the look from the script, its audience and its feeling, and never repeat the last reel's look in this chat. Mediums to think in, never a menu: paper cut-out layers, gouache storybook, ink and wash, watercolour, linocut or woodcut, flat shapes with print grain, stained glass, a pop-up book, shadow puppets, pastel chalk, a miniature painting, arabesque and geometric ornament, painted night light, collage. Mix them when the story wants it.

- **Write it down** in the plan, in four short lines: the medium; the palette (5 to 7 hex colours with their jobs: sky, ground, shadow, accent); shapes and line (soft or angular, outlined or not, hand-cut edges); texture and light (grain, paper, brush; where the light comes from and its colour).
- **One hand painted everything:** every card, person, particle and caption follows that look. Don't drift into a default.
- **Captions follow the look:** `CAPTIONS.font` (any Google Font that has the weight in `CAPTIONS.weight`), colours, outline or soft `shadow`, always legible over any part of the picture.
- **Finish:** `LOOK.grain` (moving grain over the whole picture, 0 to 0.25) and `LOOK.vignette` (0 to 1) when the look wants them.
- Beautiful and dignified: craft over gimmicks, nothing cheap or garish.

## Painting in p5.js

**Every picture is a p5.js sketch.** `drawing(w, h, (p, w, h, t) => …, o)` hands you `p`, a w×h p5.Graphics (p5 1.x), and you paint with p5: `p.fill` `p.stroke` `p.noStroke` `p.strokeWeight`; shapes `p.ellipse` `p.circle` `p.arc` `p.rect(x, y, w, h, r)` `p.triangle` `p.quad` `p.line` `p.bezier`; paths `p.beginShape` `p.vertex` `p.bezierVertex` `p.quadraticVertex` `p.curveVertex` `p.beginContour` (holes) `p.endShape(p.CLOSE)`; `p.push` `p.pop` `p.translate` `p.rotate` `p.scale`; `p.lerpColor` `p.blendMode` `p.erase()` `p.noErase()`; `p.random` `p.noise` `p.map`. Colours as hex, `'rgba(…)'` or numbers. **No Canvas 2D:** never `p.drawingContext`, `getContext` or a canvas of your own (`--check` flags them and names the p5 way). Where p5 has nothing, the engine's helpers do it:
- `gradient(p, x0, y0, x1, y1, [[0, col], …, [1, col]])` and `radial(p, x, y, r0, r1, stops)`: the next fills use that gradient (until the next `p.fill`).
- `soft(p, px, () => …)`: whatever it paints, blurred (contact shadows, mist, glows, depth inside a picture). `shadow(p, blur, col, ox, oy)`: a soft shadow or halo under the next shapes; `shadow(p, 0)` or `p.pop()` ends it.
- `wash(p, w, h, { seed, period, lo, hi, atop, res })`: soft clouds of paint from noise (`lo`, `hi` are `[r, g, b, a]` at noise 0 and 1; `atop: true` keeps it on what is painted).
- `noise(u, v, { period, oct, seed })` (smooth 0–1 and tileable, unlike `p.noise`), `pixels(p, w, h, (u, v) => [r, g, b, a])` (paints every pixel; draw shapes after it), `wrap(p, w, h, p => …)` (seamless tiles), `grain(p, w, h, k, seed)` (speckle what is painted), `blob(p, x, y, r, col, { wob, n, sy, seed })` (organic shapes: bushes, clouds, rocks), `poly(p, points, col)`, `rr(p, x, y, w, h, r, col)`, `dot(p, x, y, r, col)`, `textDir(p, 'rtl')`, `rgb(hex)`, `mixv`, `rng(seed)`.

- `o`: `seed` seeds `p.random` and `p.noise` for this picture (default 1; give each picture its own); `true` or `{ live: true }` repaints it every frame with the time `t` (a flame, water, a screen, eyes that blink, a vine that grows: about 512 px at most, `--check` measures them); `blur: k` paints it k times softer (depth of field); `rim: [px, colour]` gives it a cut-paper edge; `feather: px` (or `[top, right, bottom, left]`) fades its edges out (show it on a `soft` card).
- Each call starts fresh (no transform, p5's default state with its 1 px black outline, so `p.noStroke()` before filled shapes; the picture's seeds), so paint the whole picture every call and make a live picture a pure function of `t`: never `millis()`, `frameCount` or `Math.random`. Cut-outs leave their background transparent: a card is the shape of its subject, not a rectangle. No text, letters or logos in pictures (captions are separate).
- **Size each picture to what the camera sees:** about one pixel per screen pixel at its closest (a card filling the frame about 1080 px wide; far or small cards 256 to 512).
- **Never stretched:** a card's height comes from its picture; floors repeat by real size (`tile`).
- **Openings:** cut doors, arches and windows out of a card (`p.erase()`, a filled shape, `p.noErase()`) so the camera can look or fly through them.

**Paint like an illustrator, not a diagram.** Simple is fine; crude is not. Every picture gets:
- **A clear silhouette:** the subject reads as one dark shape (a clear pose, overlapping parts, no tangents); vary sizes (big, medium, small), never a row of equal shapes.
- **Values by depth:** each layer has its own band of values; far layers sit close to the sky's value, near layers carry the strongest darks; the subject gets the strongest contrast and the warmest light.
- **Shapes with life:** curves and tapers (`p.bezierVertex`, `p.curveVertex`, `p.quadraticVertex`), hand-cut edges; rounded rectangles only for things that are rounded rectangles.
- **Light and form:** a gradient across every big shape (lit side to shadow side), a thin rim of light on edges facing the light, a soft contact shadow under everything that stands (a dark ellipse in `soft`). A change of light is two versions crossfading (`alpha`) or a live picture.
- **Texture:** break every flat fill (`grain`, `wash` mottling, low-alpha `p.line` brush strokes, paper fibres); flat fills look unfinished.
- **Detail where the eye goes:** faces, hands, the hero object, the lit window; leave the rest quiet.
- **People:** believable proportions (head about 1/7 of the height, shoulders about two heads wide, hands reaching mid-thigh), clothes with folds and a hem, hands as simple mittens with a thumb, faces minimal (eyes, a hint of nose and mouth) or in three-quarter view; the posture tells the feeling. One painting function per character with pose parameters, reused in every scene; the content rules apply.
- **Composition per shot:** one focal point, a clear near, middle and far, lines leading to the subject, the top third calm for the captions.

## Layers in space: the 2.5D craft

- **A scene is 3 to 7 layers in depth:** a foreground frame (leaves, an arch, a curtain, the edge of a wall; often blurred), the subject, the midground, the background, the sky. Spread them out (for example 1, 4, 10, 30 and 80 m from the camera) so every move shows parallax. `span(distance, lens)` gives the width and height the camera sees at that distance: paint each layer at least that big plus room for the move, and overlap neighbouring cards so no edge shows.
- **Rooms and buildings are flats,** like a theatre set or a pop-up book: a back wall card, side walls turned 60 to 90°, a `ground` for the floor, furniture and people as cut-outs in front. Streets are rows of facade cards; landscapes are hill lines, tree lines and clouds at many depths.
- **Edge-on:** a flat card shows its trick beyond about 35° off its front. Keep the camera within that; `bill: true` turns a card toward a camera that circles it; `bend` curves a backdrop the camera pans across. A floor or table top seen level with the eye is a line across the picture: look down on it or end it before it. `--check` flags both. No rectangle edge ever shows: shape the card, overlap it, or `feather` it.
- **Depth cues:** haze (each place's `fog`: far layers melt into the sky colour), soft layers of mist or cloud between others (a `feather`ed picture on a `soft` card), `blur` on the nearest and farthest layers, smaller and paler things far away, glows and beams between layers, particles at several depths, cast shadows (`cast` on a cut-out, `catch` on the opaque card behind it or on the `ground`).
- **Motion inside the picture:** cards slide, sway in the wind, bob, breathe in scale a little, hinge (a pop-up rising from flat, a page or door swinging), cross-fade; live pictures for what changes shape. Never bounce or scale-pop.

## Arrange every reel differently

The arrangement never repeats. Choose these from the script, and never as the last reel in this chat had them (say what that was, if any, in the plan).
- **Layout of the places in space:**
  - a **corridor** of layers the camera flies down;
  - a **tower**, stacked up or down (rise, fall);
  - a **scroll** unrolling sideways (along);
  - a **pop-up book** whose pages unfold and fold (unfold, page);
  - a **picture inside a picture**: a painting on a wall, the view in a window, a world in a drop or an eye (pull-back, zoom);
  - **islands** of layers floating at different heights and sizes;
  - **one tableau** that changes over time (new state);
  - a **ring** of standing cards the camera circles (orbit).
- **Sizes:** a vast landscape, a room, a tabletop, a tiny world, one inside another.
- **Shots:** each scene gets its own distance (`close`, `medium`, `wide`) and angle (`eye`, `high`, `top`, `low`, `along`); neighbours never share both. Open each reel on a different kind of shot.
- **Light:** a different time of day or weather arc from the last reel when the script allows.

`MAP` is the shot list, one row per scene: `[time, place, distance, angle, people, move]`. `--check` flags a move used twice, neighbours with the same shot, fewer than three kinds of shot, and people in high or top shots.

## Plan first: think it through, doubt it, agree it

Before any code and any image prompt, plan the look, the world, every scene change, the camera, the light and the sound. Criticize your own ideas and fix their loopholes, share the plan, and **build only after the user agrees** (skip it only when they say to build straight away, give the plan themselves, or ask for a small revision).

**Think first:**
1. Read the script as a story: what it is about, who "you" is, which line is the turn. A line under 1.2 s can't carry a scene change; it shares a scene with its neighbours.
2. The look (*Art direction*), and one thread: one or two objects that come back, and a light arc (night blue to dawn gold, storm to calm).
3. Scenes (usually 6 to 10 for 25 s, 3 or 4 for 10 s). The world: the layout, each place as its layers front to back with their depths, and where each place sits so that each move travels a short, clear path.
4. Each scene change: an element of the scene we leave and a move from *Scene changes* that means what the next line says. Then the shot inside each scene and the path of each move. Write the shot list.
5. The pictures: what is a static painting, what is live; with images, which pictures are focal and become images.
6. Attack each idea with the doubt list; write the doubt and the fix, or drop the idea. Then attack the whole plan: a showreel of tricks? A repeated move, direction or shot? The same look, layout or opening as the last reel? The simpler fallback for the two hardest moves? Does every sound come from the picture?

**Doubt list (every scene change):** *Switch point:* where does the eye pass to the next scene without a jump (the element in frame while the layers pass, a view through a gap, the same place in a new state)? No frame named = a hidden cut. *Established:* the element is on screen 0.4 s, readable, before it moves. *Meaning:* the move says what the next line says. *Continuity:* nobody in two places at once; one travelling object is one card. *Camera path:* never through a solid layer (go through gaps: a window, a door, between leaves), never edge-on to a card, never past a layer's painted edge. *Timing:* fills the end of the line, lands as the next words begin, calm under the words. *Repetition:* move kind, direction, scale. *Captions:* nothing moving through the caption band or a Qur'an verse panel. *Respect:* the content rules. *Build:* doable with cards? *Sound:* what the element sounds like, where the bed changes.

**Who is "you":** someone the audience sees themselves in (an audience of mothers gets a mother, in hijab). If unknown, ask.

**The plan reply** (no code), after one sentence on what you'll do:
1. What went wrong before (only after a correction).
2. The look: the four lines of the art direction.
3. The idea: thread, returning objects, light arc, layout (two or three sentences).
4. The world: one line per place (its layers front to back with depths).
5. The moves: per change its time and the line it leads into, then **Move**, **Doubt → fix**, **Sound**.
6. Camera and light: the shot list (`MAP` rows, with lens) and the light arc.
7. With images: the image prompts come first in the reply instead (see *With images*); here one line per image on where it goes.
8. Qur'an verses (only when the script mentions one): one line each, as *Qur'an verses on screen* says.
9. Weak spots, honestly; then at most four numbered questions.
Under about 900 words besides the prompts. Then stop. When the user answers, build exactly that; for a skipped question take the default and say so.

## Build scene by scene

1. **Plan** (above).
2. **Round 1, block-out of the whole reel:** every place with its layers at their depths as flat silhouettes in the palette (a few lines of painting each), people as simple silhouettes, every moving element of every change, the full `MAP`, `CAM` keys, `LIGHTS` and captions. No detail, particles or sound. This settles camera, timing, parallax and framing while they are cheap.
3. **Rounds 2 to n, one scene per round in script order:** paint that scene's layers fully (texture, light, people), its glows, particles and sounds, and its move into the next. Leave approved scenes alone; ask before changing one.
4. **Last round:** the end screen hold, the full sound pass, check frames across the reel; then the user records.

Each round's reply: one line on what changed, the file, then "Press **📸 Next check frame** and then **📷 Screenshot**, N times, and attach the N PNGs in one message." Add the weak spots and at most a few questions. Set `CHECKS` to the 4 to 10 frames that decide the round: round 1 frame 0, one per scene, the middle of each move and the last frame; a scene round that scene's beats and both joins. With images, each round's reply leads with the prompts for the images the next scene needs, so the user makes images while checking.

**Reading screenshots:** the label in the corner names the frame, its time and label (drawn in while Guides is on; the file name says it too); the dashed red lines mark the caption band and the line below which Reels covers the picture. Check: subjects between the lines and clear of the captions, the element readable before and during its move, no card edge or empty background showing at the frame's borders, no card seen edge-on, parallax and depth reading (haze, sizes, blur), the look consistent, people as the content rules require, captions legible, every Qur'an verse as *Qur'an verses on screen* says. Fix with small edits, rebuild, check, and go on. If the user wants everything at once, do all the rounds in one build with check frames across the reel.

## Scene changes: an element takes us into the next scene

**No cuts, wipes, fades, flashes or dips to a colour** (cuts only when the user asks). Every change is an action of an element of the scene we leave, and the camera goes with it into the next place. Not the same move again: each kind once a reel.

| Move | The camera… | Build |
|---|---|---|
| Through | passes through a gap in a layer (a window, a door, an arch, a hole in paper, between leaves) into the place behind | the next place behind the gap; the path through its middle |
| Pull back | finds the scene was a picture: a painting on a wall, a page, the view in a window, a reflection in an eye or a drop | A built small inside B (`WORLD` `{ in, at, s }`) |
| Zoom | dives into a detail that becomes the next world (a drop, a seed, a pattern, an eye) | a nested place; key `{ e: 'zoom' }`, `veil` for a jump of 100× or more (Pull back is the same move outward: it reveals a frame) |
| Rise / Fall | climbs or drops past the layers with something rising or falling (steam, a bird, a lantern, rain, a leaf) | the next place above or below; a stream or card on the same path |
| Follow | flies with an element carried sideways into the next place | `follow`; the element is one card |
| Along | trucks sideways along a path, a river, a thread, a scroll | the places in a long row |
| Unfold | layers hinge up from flat like a pop-up book, or fold flat away | cards with `rx` from flat (−90°) to standing |
| Page | a layer swings away like a page or a door, showing the next scene behind | a card with `at: 'left'` and `ry` |
| Orbit | circles an element; the next scene waits on its far side | a `via` arc; cards on the way `bill` |
| New state | stays; the light, the season or the state changes | `LIGHTS`, crossfading cards, live pictures |
| Pour or grow | rides the front of water, light, colour or vines flowing into the next place | live pictures, cards sliding or scaling in |
| Match | lines a shape up with a like shape in the next scene (a coin and the moon) | a `CHECKS` match `{ a, ra, b, rb }` at the switch |

- **Different every time:** neighbouring changes differ in kind, direction (up, down, sideways, in, out) and scale.
- **Timing:** a move fills the end of a line and lands about 0.1 s after the next line starts; most take 0.8 to 1.6 s (longer travel takes longer: `--check` says when a move is too fast). The scene before it leaves time to read its picture.
- **Switch point:** the element stays in frame and readable while we pass. Light changes on the way only when the story changes it.
- **Continuity:** a travelling object is one card moving between places, never two copies. **Respect:** sacred objects never move, fall, fly or get covered; take the moving element from something else.
- A bookend, ending on what the reel began with but changed, is strong.

## Camera

`CAM` keys `[time, place, position, look-at, lens, options]`: position and look-at in that place's metres (`null`: world); lens is the vertical field of view (30–34° close, 36–40° medium, 40–50° wide). The camera eases from each key to the next with the next key's options: `e` (`'sm'`, `'io'` for travels, `'zoom'`), `via` (a point in the key's place the path bends through: a crane, an arc, an orbit), `veil` (0–1: where in a big zoom the camera passes through cloud), `follow: T => worldPoint` (keep looking toward a moving element, weight `fw` 0.8). Negative times count back from the end, so they follow the hold.
- **Parallax lives in sideways and vertical moves** (truck, crane, arc). A straight push shows depth only when near layers pass the lens; combine them.
- While words are spoken: a slow push or drift (5 to 15%), never a whip; big moves happen in the change window. Don't zoom the lens under words; move the camera.
- No roll; straight down only without people. A move whose viewing distance or scale changes more than 6× becomes a zoom by itself: the same speed for every doubling, turning evenly round its subject.
- Framing: key subjects between y 700 and 1250 and x 65 to 1015 of the 1080×1920 frame; nothing important in the caption band (y 300–650), below y 1250, or at the right edge below y 1000 (the Reels buttons). A point `dy` metres above the line of sight at depth `z` lands near y = 960 − dy ÷ (z × tan(lens ÷ 2)) × 960. Give each check frame its subject's world point: `--check` prints where it lands.
- The frame never shows past the painted world: overscan every layer for the whole move; the sky colour fills only what is meant to be sky.
- `BREATH.a` (1): hand-held breath; 0 locks it off. `camMod(T, c)` (optional) adjusts the camera last (the end-screen float).

## Light

`LIGHTS` rows `[time, preset or { sky, grade, haze, sun, shade }, shadow half-size]` blend smoothly. Presets: `night`, `lamp` (a lamp-lit room at night), `dawn`, `morning`, `day`, `noon`, `evening`, `dusk`, `overcast`, `storm`, `space`, `under` (underground); `{ ...LIGHT.night, grade: '#8a93c0' }` adjusts one. `sky` is the background colour, `grade` a tint over every painted card (white leaves the paint as painted; night darkens and cools it), `haze` the colour far layers fade into (the sky by default), `sun` where cast shadows come from (an offset in the place's metres), `shade` their strength.
- The grade carries the time of day and tints every card, paper included; the paint carries the light's direction and character. Things that give light keep `grade: 0` (the sun, a lamp, a screen, fire, a lit window), and a lamp-lit corner at night can take a lower grade (0.3 to 0.6).
- Added light: `glow` (a soft halo, or `flat` as a pool of light on a wall or floor), `beam` (a shaft of light), particles with `add: true`. Every light has a source in the picture.
- The light changes only when the story changes it.

## With images

**Only the images that matter:** the focal pictures that carry the reel and its design, usually 2 to 6: the hero subject, each character (all poses on one sheet), the one or two key places, and any object the story turns on. Code paints everything else in the same style, so the images and the paintings must share the art direction.

**Labels** are the file names and picture keys, by use: `cut_` (a transparent cut-out; a sheet of figures becomes `cut_x_1`, `cut_x_2`… left to right), `layer_` (a transparent layer kept whole: a skyline, a hill line, a foreground frame of leaves or an arch), `plate_` (an opaque full background), `tile_` (a seamless texture repeated by real size).

**The prompts come first in the reply**, in one code block, ready to paste; each one stands alone with its ratio, transparency, art style and the earlier image to keep as reference:
```
IMAGE PROMPTS — <reel title> (<n> images)
STYLE FOR EVERY IMAGE: <the art direction in words: medium, palette hex, shapes and line, texture, light from <side>>.
No text, letters, numbers, logos or watermarks. <content rules in words>

1 — cut_mother.png — 1:1, 2048×2048, TRANSPARENT background (a real transparency, not a checkerboard or white;
if impossible, flat pure magenta #FF00FF)
A sheet of 4 poses of the same woman, 2 × 2 with clear gaps, whole body, straight-on: <poses>. <identity, hijab and
long dress colours, simple face>. Light from <side>, as in the style. No ground shadow.
Keep as reference: none

2 — plate_courtyard.png — 9:16, 1080×1920, opaque
<the place, its depth and its focal point; the top third calm for the captions>. Keep as reference: none
```
Rules: transparent images show the whole subject with a little margin; layers run the full width with the sky transparent; plates leave the top third calm; the light comes from the same side in every image; a later image takes the earlier one as its only reference; never request an image whose reference doesn't exist yet. Missing images show as labelled grey cards and recording stays off, so never present that page as finished.

**When images arrive:** save them in one folder and run `python3 build.py --images <folder> --check`. It keys magenta, trims and splits cut-out sheets, keeps layers whole, checks tiles for seams, and prints each key with its size. Then look at each image yourself: subject, pose, style matching the plan, nothing baked in (text, frames, ground shadows); ask for focused repairs of only what is wrong, naming the reference. Place images with `card(g, 'cut_mother_2', null, x, y, z, { h: 1.6 })`; paint the rest to match them.

## Sound: a diverse score that matches the picture

The library is built into the engine (the same sounds as `reel-creator`). Every reel gets its own **diverse** sound, taken from what is on screen and what happens in it: nature (wind, rain, water, leaves, fire, birds, crickets), objects and materials (paper, cloth, wood, glass, coins, a door, a pen), screens and machines (a click, a ping, a phone buzzing, a clock ticking, a hum, a glitch), people and places (footsteps, a heartbeat, a crowd, a city) and motion (a whoosh, a riser, an impact, a sparkle). No music.
- **Relevant to the visual:** every sound belongs to something on screen, the place, or a move we see. Each place has a bed; it changes during the move, so the sound travels with the camera. Indoors or behind glass the outside is muffled (`lp`). Paper layers can sound like paper (a flap, a crease) when they unfold.
- **What moves or happens makes its sound:** paper creases and flutters, a thrown thing whooshes and thumps, a door knocks, a phone buzzes and pings, a clock ticks, light or a voice swells, a reveal rises into an impact or a chime.
- **Diverse:** vary the type, pitch and pan of the sounds through the reel, and the mix from reel to reel.
- **Can't make it exactly? Make the closest one and add it.** Shape the nearest library sound (`pitch`, `dur`, `vol`), layer two, or write your own in `reel.js` with the library's helpers (`osc`, `nz`, `filt`, `envGain`, `bellEnv`, `lfo`, `grains`, `bus`, `send`): `SFX.name = (ac, out, t, o) => { … }`, plus `BEDS.add('name')` for a background sound. Never leave a sound out because it would only be an approximation; name the approximations in the plan.
- Stay under the voice: effects sit about 12 to 15 dB below it.
- Cues go in each SCRIPT line's `sfx`: `{ at (s from the line's start, may be negative), type, vol 0.3–1, pitch, dur, src }`; beds also `fadeIn`, `fadeOut`, `to`, `lp: [[s, Hz], …]`; `toEnd: true` (lasts to the end, whatever the hold), `fromEnd: s`. `src: ['A', [x, y, z]]` pans the sound from where its source is on screen.
- Library: beds `wind` `rain` `stream` `waves` `fire` `leaves` `room` `birds` `crickets` `crowd` `city` `hum`; air and motion `gust` `breeze` `swell` `whoosh` (`down`) `riser`; ground and weight `rustle` `step` (`surface`: grass, earth, gravel, sand, wood, stone, snow) `thump` `impact` `boom`; water `drop` `drips` `splash` `pour`; `thunder`; cloth and paper `cloth` `flap` `crease` `flutter` `paper` `scribble`; objects `pebble` `wood` `twig` `knock` `clink` `coin` `pop` `sizzle`; screens and machines `click` `shutter` `type` `typing` `tick` `ticking` `ding` `bell` `ping` `chime` `buzz` `glitch` `sparkle` `shimmer`; living things `heartbeat` `bird`. Options: `rate` (drips, typing, ticking, heartbeat, sparkle), `n` (buzz, knock, bird).
- You can't hear it: say so. The user adds the voiceover in their editor from 0:00.

## End screen with an adjustable hold

When the script ends on a call to action (follow, join, enrol, visit, book, a link in the bio), the last scene is an end screen; an inspiring last line is not one. `REEL.ctaHold` (2.0 when there is a CTA; say so, and that 0 gives the script's exact length) is the default of the page's **End screen hold** field; the reel lasts script end + hold. Mark the last line `hold: true` (its caption stays to the last frame). `END = { at, loop, out }`: the script time the end screen starts, the idle period, the end animation's length. In `animate`, `const e = endPhase(T)`: idle motion only as `e.ia * Math.sin(k * e.A)` for whole k (it repeats with no seam whatever the hold), small and slow; the end animation from `e.tt` (seconds since it began, 0 before), finishing with the last frame. End-screen camera keys, lights and check frames use negative times. Beds on it get `toEnd`, its accents `fromEnd`. Ask the user to check hold 0, the default and 8 s.

## Qur'an verses on screen

Whenever the script mentions a verse of the Qur'an (quoted in English, paraphrased, introduced as "Allah says…", or named by surah and number such as "Surah Al-Asr" or "2:286"), show the **complete verse in Arabic** on screen from the line that mentions it until the last line that explains it, **together with the usual English captions**. This holds even when the script has no Arabic in it.

- **Which verse:** find the surah and verse number. If the script doesn't give them, identify the verse from its wording; if more than one verse fits or you aren't sure, ask in the plan. If the script quotes only part of a verse, still show the whole verse. A whole short surah or a range of verses: every verse in full, together if they fit, otherwise one after another as the explanation reaches each.
- **Exact text, never from memory:** copy the Arabic exactly, every letter and mark, from a reliable digital Qur'an text (the Uthmani script of Tanzil or Quran.com). Never type, retype or reconstruct it from memory, and never translate it back from English. Fetch it with code where you can (a published Qur'an-text package or data file from npm, pip or GitHub) and paste it into the reel with code. A WebFetch result passes through another model: if you use one, ask for the verse verbatim and check it against a second source. If you can't get an exact copy, ask the user in the plan to paste the verse from Quran.com, and use what they paste.
- **In the plan:** one line per verse: its reference, its Arabic text (so the user can check it), the line where it appears and the line where its explanation ends. If it's unclear where the explanation ends, take the last line before the script moves to another point or to the CTA, and say so.
- **The look:** a still panel in screen space, centred near the top of the upper safe area (from y ≈ 290), never inside the picture, never on a mushaf or any other prop, never in an image. Arabic in **Amiri Quran** (Google Fonts), right to left, about 64 px, wrapped only at whole words and shrunk to fit (no smaller than about 34 px), with a tall line height so the marks never touch; the captions' colour with their halo, shadow or pill; under it the reference in small caption type ("Al-Baqarah 2:255"). No emphasis colour, no word-by-word or letter animation, no bounce, scale, blur or distortion: it fades in over about 0.4 s as its line starts (fully shown at once if that is frame 0), stays perfectly still, and fades out over the last 0.4 s of the explanation.
- **Layout while it shows:** the English captions carry on line by line in the user's exact words (the verse never replaces or repeats them), moved down to sit just under the panel. Key subjects go below the captions and above y 1250; nothing moving passes over the panel and no particles cross it. A very long verse may fill most of the upper frame: then the picture behind it stays a calm backdrop, and you say so in the plan.
- **Check:** frames at the start, middle and end of every verse: letters joined in their right shapes (not separated, reversed or boxes), marks intact, nothing cut off, the reference correct, captions readable under it.

**How to build it.** Put this in `reel.js` with the verses filled in; call `verseLayers()` as the last line of `build()` and `verseAt(T)` as the first line of `animate(T)`. It draws in screen space over the picture, so the camera never moves, skews or lights it, and it moves the captions under the panel while a verse shows. Give `CHECKS` a frame at the start, middle and end of each verse.
```js
const VERSES = [ { from: 4.2, to: 15.8, ref: 'Al-Asr 103:2', ar: '…' } ];   // from: the line that mentions it starts; to: its explanation's last line ends (script seconds); ar: pasted with code from the source, never typed
const QFONT = 'Amiri Quran', QTOP = 290, QH = 640, CAP_Y = CAPTIONS.y;
(document.head || document.body).append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Amiri+Quran&display=block' }));
function inkVerse(p, t, x, y) {   // the captions' outline, then their fill with its halo
  if (CAPTIONS.outline) { p.push(); p.noFill(); p.stroke(CAPTIONS.outlineColor); p.strokeWeight(CAPTIONS.outline * 2); p.strokeJoin(p.ROUND); p.text(t, x, y); p.pop(); }
  p.push(); if (CAPTIONS.shadow) shadow(p, CAPTIONS.shadow[0], CAPTIONS.shadow[1]); p.noStroke(); p.fill(CAPTIONS.color); p.text(t, x, y); p.pop();
}
function paintVerse(v) {
  const p = v.d.p; p.clear(); p.textFont(QFONT); p.textStyle(p.NORMAL); let size = 64, lines;
  for (;;) { p.textSize(size); lines = []; let cur = ''; for (const wd of v.ar.trim().split(/\s+/)) { const t = cur ? cur + ' ' + wd : wd; if (cur && p.textWidth(t) > 900) { lines.push(cur); cur = wd; } else cur = t; } lines.push(cur); if (lines.length * size * 1.85 <= QH - 70 || size <= 34) break; size -= 2; }
  const lh = size * 1.85; v.h = lines.length * lh + 56;
  textDir(p, 'rtl'); p.textAlign(p.CENTER, p.CENTER); lines.forEach((ln, i) => inkVerse(p, ln, W / 2, lh * (i + 0.5)));
  textDir(p, 'ltr'); p.textFont(CAPTIONS.font); p.textStyle(p.BOLD); p.textSize(30); inkVerse(p, v.ref, W / 2, v.h - 28); v.d.tex.needsUpdate = true;
}
function verseLayers() {   // last line of build()
  for (const v of VERSES) { v.d = drawing(W, QH, () => {}); v.m = overlay(v.d, W, QH, H - QTOP - QH / 2, 1.2); v.m.visible = false; paintVerse(v); }
  document.fonts.load(`64px "${QFONT}"`).then(() => { VERSES.forEach(paintVerse); renderAt(clock.t); }).catch(() => {});
}
function verseAt(T) {   // first line of animate(T)
  CAPTIONS.y = CAP_Y;
  for (const v of VERSES) { const a = T >= v.from && T < v.to ? Math.min(v.from <= 0.001 ? 1 : clamp01((T - v.from) / 0.4), clamp01((v.to - T) / 0.4)) : 0; v.m.visible = a > 0; v.m.material.opacity = a; if (a > 0) CAPTIONS.y = (QTOP + v.h + 150) / H; }
}
```

## Build

**The engine is `engines/hybrid/`** (`template.html` and `build.py`); never copy or retype it into the reel's folder. Write `reels/<folder>/reel.js` and, after every change, run `node tools/build.js reels/<folder> --check` (it passes `--images images` when `images/` has pictures, named as *With images* says). Fix every ✗, look at the sheet, then render. The claude.ai copy of this skill reads the *2.5D Reel Engine* artifact (https://claude.ai/artifact/1g9smPEh2j24CUuX6mwBXz); an engine fix goes into `engines/hybrid/template.html` (or `engines/shared/`, then `python3 tools/sync-engines.py`) with a line in `engines/CHANGELOG.md`, and is published back to that artifact only when the user asks.

**reel.js** (the top level only declares; `build` makes everything once, `animate` sets what moves from `T` alone):
```js
const REEL = { title: 'Lanterns at dusk', fps: 30, ctaHold: 0 };
Object.assign(CAPTIONS, { font: 'Cormorant Garamond', weight: 700, color: '#FFF4DE', emphasis: '#F2B65A', outline: 0, shadow: [18, 'rgba(20,10,30,0.9)'] });
LOOK.grain = 0.08;
const SCRIPT = [ { start: 0, end: 3.2, text: 'The street was *dark* tonight.', sfx: [{ at: 0, type: 'crickets', dur: 3.6, vol: 0.5 }] }, … ];
const WORLD = { street: [0, 0, 0], room: [0, 0, -40] };      // places in one space (a nested one: { in: 'street', at: [x, y, z], s: 0.05 })
const MAP = [[0, 'street', 'wide', 'eye', false], [3.2, 'room', 'close', 'low', true, 'through'], …];   // the shot list
const INK = '#1E1830', DUSK = ['#2A2550', '#6B4E7A', '#E39A6B'];  // the palette in the plan
const hills = (seed, col) => (p, w, h) => { p.noStroke(); p.fill(col); p.beginShape(); p.vertex(0, h); for (let x = 0; x <= w; x += 8) p.vertex(x, h * 0.45 + h * 0.2 * noise(x / w, seed / 10, { period: 3, seed })); p.vertex(w, h); p.endShape(p.CLOSE); grain(p, w, h, 0.05, seed); };
const PICS = {
  sky: drawing(1024, 1820, (p, w, h) => { gradient(p, 0, 0, 0, h, DUSK.map((col, i) => [i / 2, col])); p.rect(0, 0, w, h); }),
  far: drawing(1024, 360, hills(3, '#4A3F6B'), { seed: 3 }), near: drawing(1024, 300, hills(7, INK), { blur: 3, seed: 7 }),
  lantern: drawing(128, 128, (p, w, h, t) => { soft(p, 6, () => dot(p, 64, 64, 46, 'rgba(255,170,80,0.6)')); dot(p, 64, 64, 36 + 4 * Math.sin(t * 5), '#FFC46B'); }, true),
};
const LIGHTS = [[0, 'dusk'], [2.8, 'dusk'], [3.6, 'night'], [-0.01, 'night']];
const R = {};
function build() {
  const S = level('street');
  card(S, 'sky', ...[span(90, 40)[0] * 1.4, 0, -6, -90], { fog: false, bend: 120 });   // far backdrop, curved for the pan
  card(S, 'far', 60, 0, 0, -35); card(S, 'near', 14, 0, -0.5, 3, { flip: true });       // layers at depths: parallax
  R.lamp = card(S, 'lantern', 0.4, 1.2, 2.4, -2, { at: 'center', grade: 0 }); glow(S, 1.2, 2.4, -1.95, 2, '#FFB75E');
}
function animate(T) { R.lamp.position.y = 2.4 + 0.03 * Math.sin(T * 2); PT.motes(AT('street', [0, 0, -2]), T, { n: 30, box: [8, 4, 6], shape: 'spark', add: true, col: '#FFD08A' }); }
const CAM = [[0, 'street', [2.5, 1.7, 9], [0, 1.6, -2], 42], [2.9, 'street', [-1, 1.6, 7], [0, 1.7, -2], 40], [3.6, 'room', [0, 1.6, 5], [0, 1.4, 0], 36, { e: 'io' }], …];
const CHECKS = [[0.05, 'street opens', AT('street', [1.2, 2.4, -2])], [3.2, 'through the window'], [-0.05, 'the end']];   // [time, label, world points to locate]
```
- Units are metres, y up, +z toward the camera; cards face +z. A person stands about 1.6 to 1.8 m, a door 2.1 m, a table 0.75 m.
- Everything moving is set in `animate` from `T` (no state, `rng(seed)`, analytic particles). Move, turn, scale or fade the meshes the helpers return.
- Don't redeclare engine names (anything in the template). Yours: `REEL SCRIPT WORLD MAP PICS LIGHTS CAM CHECKS END R build animate camMod`, plus your own painting functions (each takes `p`) and constants (and `VERSES QFONT QTOP QH CAP_Y inkVerse paintVerse verseLayers verseAt` when a verse shows).

**Engine:** `level(key)` (the group of a place: build its cards in it), `grp(g, x, y, z, ry)`, `AT(key, point)`, `lv(key)` → `{ o, s }`, `span(distance, lens)` → `[w, h]`; `card(g, pic, w, x, y, z, { h, at: 'base'|'center'|'top'|'left'|'right', ry, rx, rz, bill, flip, bend, alpha, soft, add, grade, fog, cast, catch, order, double })` (pic: a `PICS` key, a `drawing`, an image key or a `'#hex'` colour; `at` names the point at x, y, z: 'base' its bottom middle, 'left' and 'right' its bottom corner, so a door or page stands on y and swings with `ry`; cards built flat with `rx` to unfold aren't edge-checked), `ground(g, pic, w, x, y, z, { d, tile, catch })`, `solid(g, 'sphere'|'disc'|'cylinder'|'box', size, pic, x, y, z, { t, h, open, rx, ry, rz, cast })`, `glow(g, x, y, z, size, col, { flat, rx, ry, alpha })`, `beam(g, x, y, z, w, h, col, { rz, ry, alpha, bill })`; `drawing(w, h, (p, w, h, t) => …, { seed, live, blur, rim, feather })` (`.p` is its p5.Graphics), `pic(key)`, `ratio(key)`; painting helpers `gradient`, `radial`, `soft`, `shadow`, `wash`, `noise`, `pixels`, `wrap`, `grain`, `blob`, `poly`, `rr`, `dot`, `textDir`, `rgb`; particles `PT.stream(origin, T, { t0, t1, rate, life, v, g, spread, spreadY, wob, size, col, shape: dot|disc|spark|streak|petal|leaf|flake|ring|a PICS key, add, streak, spin, flutter, fade, s, seed })`, `PT.motes(origin, T, { n, box, y, size, col, shape, add, spin, flutter, s })`, `PT.burst(origin, T, t0, { n, speed, up, life, size, col, shape, add, s })`; `screenOf(point, T)`, `endPhase(T)`, `sm`, `tw`, `bump`, `settle`, `mix`, `mixv`, `add3`, `clamp01`, `rng`, `Ease`, `hexMix`, `lighten`, `darken`, `rgba`; `LIGHT` (the presets), `LOOK`, `CAPTIONS`, `BREATH`, `world`, `THREE`. Each `WORLD` place may also take `hide: true` (never drawn) or `always: true` (drawn even when tiny).

## Delivery

Send the user `out.mp4` (rendered with `node tools/render.js`) and `index.html` as files, as `CLAUDE.md` says (never commit the reel; `index.html` carries its source for `node tools/unpack-reel.js`). The user opens `index.html` in Chrome, Edge or Safari to preview, adjust the hold or record; the first open needs internet (Three.js and p5.js from jsDelivr, the caption font from Google Fonts). The page has Play, Restart, Full screen (Esc or F; tap to play), a scrubber with frame stepping, **📸 Next check frame** and ◀ with the guides, **📷 Screenshot** (S: the frame as a PNG), End screen hold, sound volume, and Record & Download (real time, tab visible; MP4 where the browser can, otherwise WebM). Say what you checked (code, numbers, the frames you rendered and looked at, the measured sound peak) and that you haven't heard the reel. For another chat, give a short handoff: the look, the world layout, labels of the images to reattach, open issues.

## Content rules

These apply to every frame, character, drawing and image prompt.
- Nothing indecent: no nudity, revealing clothing, suggestive poses, romance, gore, drugs, alcohol or gambling.
- No girls or women except in hijab, anywhere (backgrounds, crowds, silhouettes). Prefer objects, hands, animals and places; if a person is needed, one simple figure: a man, or a woman or girl in hijab when the story or audience calls for one.
- No pigs or piggy banks; never religious symbols or sacred imagery as a gag. Sacred objects (the Quran, a mushaf, a prayer mat) stay still in a place of honour, with no readable text, and never move, fall or get covered. Qur'anic text appears only in the verse panel (see *Qur'an verses on screen*).
- Prophets are never depicted in any form (no face, figure, silhouette, hands or glow); tell their stories through objects, places and outcomes. Companions and revered figures without faces: from behind, far away, or hands only.
- No brand logos, copyrighted characters or real people. If the user's own artwork breaks these rules, say so and ask.