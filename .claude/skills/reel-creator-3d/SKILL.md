---
name: "reel-creator-3d"
description: "Aspire repo engine skill (engine: three). Turn a timestamped Reel script into a 3D 9:16 reel in Three.js: a fresh art direction every reel (no house style), places in one world arranged differently every reel, cinematic camera moves, story lighting, no cuts, planned first and built scene by scene. Use for 3D reels; images only when the user says \"with images\". Say 'give prompt' for a ready-to-paste build prompt, or 'prompt in parts' for the plan-first, part-by-part version; no reel is built in either case."
---

# 3D Reel Creator

You turn a timestamped script into a vertical 3D reel: one `index.html` that renders every frame with Three.js, shows captions line by line, plays a diverse sound score matched to the picture and records itself at 1080×1920. 3D is for **cinematic camera moves, light and storytelling**: every place is a small world (a diorama, an island, a model inside another) in one world, the camera travels from one to the next carried by an element of the story, and the light follows the time of day.

- **Drawn (default):** forms are built in code (boxes, cylinders, balls) and finished in the reel's look; every picture (textures, a poster, a clock dial, a phone screen, the window view, people and plants as flat cut-outs) is a Canvas 2D drawing in code, and simple animations are 2D drawings redrawn every frame (clock hands, a scrolling feed).
- **With images:** only when the user says **"with images"** (or attaches images and says to use them). Generated images in the reel's look then carry the stationary things that matter, on flat faces, tiled by real size or bent on sheets, never stretched. Never switch on your own.

Plan first, then build scene by scene. No cuts: an element of each scene takes us into the next. The user checks the picture with screenshots. Explicit user instructions override every default here. Standalone hooks go to `reel-visual-hook`, 2D reels to `reel-creator`; don't add an opening card or hook to a supplied script.

## Prompt mode: "give prompt" and "prompt in parts"

These two requests ask for a prompt to paste into another chat, not for a reel. When the user says **"give prompt"** or **"prompt in parts"** (or plainly asks for the prompt, for example "give me the prompt"), do only the steps below and skip everything else in this skill: no plan, no engine page, no questions about style or mode, no build.

1. **Pick the template.** "give prompt" → *Single prompt*. "prompt in parts" → *Prompt in parts* (a brief plan first, then one working part per message).
2. **Fill in the task.** The user's request for the reel (their script and any style, length, CTA or other instructions, whether in this message or earlier in the chat) goes after `Task:` exactly as they wrote it. Don't summarise, improve or expand it. If their words don't already say what kind of reel it is, put this one line first, then their words on the next line: "Make a 3D 9:16 Reel (1080×1920) as a single index.html in Three.js: each place a small world in one world, a fresh art direction, cinematic camera moves, story lighting, no cuts (an element of each scene takes us into the next), captions line by line, a sound score matched to the picture, and Record & Download, from this timestamped script:"
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

- This copy of the skill runs in Claude Code inside the **aspire-animation** repository (read `CLAUDE.md` first). Files in the repo replace attachments. Every reel lives in `reels/<YYYY-MM-DD>-<topic>/` (start it with `node tools/new-reel.js "<topic>" --skill <skill>`): `script.md` (script, brief, agreed plan, review notes), `reel.json` (engine `three`), `images/`, `reel.js`, the built `index.html` and the rendered `out.mp4`.
- **You can see the picture here.** Headless Chromium in this repo loads Three.js and renders WebGL. `node tools/build.js reels/<folder> --check` runs `build.py --check` (code errors, camera speed, the shot list, where subjects land) and then renders frame 0 plus the start, middle and end of every caption to `reels/<folder>/.check/` with a contact sheet `sheet.png`: Read the images and look at them. `node tools/render.js reels/<folder> --frames 3.1,3.4,3.7` renders the times you name (your `CHECKS`, the frames across a move). You don't need the user's screenshots, though they can still send them from the page's 📸 and 📷 buttons. Say what you looked at; you still haven't heard the sound.
- `node tools/render.js reels/<folder>` writes `out.mp4` (H.264 + AAC, 1080×1920, frame-perfect, not limited to real time) and reports the sound's peak level. The page's own Record & Download still works for the user in Chrome, Edge or Safari.
- **Spend output only on what is new.** Copy the engine from its page (see *Build*), never retype it. You write only `reel.js`: once in round 1, then small Edits of the lines that change. Prefer the engine's helpers (`room`, `Paint.*`, light presets, `PT.*`) to your own code, except drawings: a texture or picture is a few lines, so write your own wherever it improves the picture. Short comments, short replies, no code pasted into the chat.

## What you need

- **The script with timestamps** (required), in any notation (`0:03`, `[3s]`, `0:03–0:07`). If timestamps are missing, ask once; if told to go ahead, estimate 2.5 words per second plus 0.3 s between lines and say so. Use the user's words exactly; `*word*` marks the one or two words that carry the punch.
- Optional, never block on them: a CTA, the audience (it decides who "you" is on screen; ask in the plan if unknown), a voiceover, the user's own sound recordings. If an "attached" image isn't there, take the look from their words and carry on.

## Art direction: a new look every reel

There is no house style: you have complete creative freedom. Choose the look from the script, its audience and its feeling, and never repeat the last reel's look in this chat. The user's words about a look always win. Looks to think in, never a menu: soft matte clay, low-poly flat-shaded, a wooden toy set, folded paper craft, glazed ceramic, felt and fabric, a realistic miniature, polished glass and light, brushed metal and machines, toon shading, stone and plaster, a lit night city, a pop-up book. Mix them when the story wants it.

**A look is a treatment, never a set of elements:** the subjects come only from the script.
- **Write it down** in the plan, in four short lines: the medium and materials (`LOOK`: `bevel` 0.005 crisp to 0.08 soft, `rough` 0 glossy to 1 matte, `metal`, `sat`, `vary`; `mat(col, { rough, metal })` for one form); the palette (5 to 7 hex colours with their jobs: walls, ground, shadow, accent; set them on `P` at the top of `reel.js`); shapes (rounded or sharp, chunky or fine, how much detail); light and finish (time of day, colour of the light, textures).
- **One hand made everything:** every form, drawing, cut-out, particle and caption follows that look. Don't drift into a default.
- **Captions follow the look:** `CAPTIONS.font` (any Google Font with the weight in `CAPTIONS.weight`), colours, outline or soft `shadow`, always legible over any part of the picture.
- **Places:** the world is built of places the camera can travel between: cutaway rooms (`room`), outdoor islands (`plinth`, `terrain`), small worlds nested inside others, or one place that changes, about 11 to 14 m apart so the camera can travel and the end can pull back. How they sit changes every reel (*Arrange every reel differently*).
- **Wall colour (optional):** when the look has coloured rooms, `setRoom('<room>')` gives one from the script's MAIN ELEMENT, never its mood: brick (fire, cooking, work, city), sage (water, health, calm, sleep), ochre (bread, money, the sun, sand), dusk (time, screens, travel, study), olive (plants, nature, food), slate (books, the mind, technology, stone), plum (the heart, love, family, fruit). Or set `P.wall`, `P.wall2`, `P.wain` yourself.
- **Light:** one main source with a reason in the picture (the sun or moon through a window, a lamp, a screen, the sky outdoors), and a sky that follows the time of day.
- **People** are flat cut-outs painted in the look, front view; the camera stays within about 35° of their front.
- **Motion:** the camera eases with a breath of hand-held life; objects slide and settle with a small hop (`settle`), never bounce or scale-pop; steam rises, dust drifts, the light arcs with the hours.
- Beautiful and dignified: craft over gimmicks, nothing cheap or garish.

## Pictures: drawn in code, or images

| Kind | For | How |
|---|---|---|
| Forms | every form, and everything that moves, turns, falls or lights up | `bx`, `cy`, `ball`, `grp`; motion in `animate(T)` |
| Drawings (both modes) | surfaces (floors, walls, wallpaper, rugs, ground, table tops, fabric), pictures made of simple shapes (a poster, a sign, a label, a book cover), screens, clock dials, the window view and sky, people and plants in drawn mode, **any picture that animates simply** | `Paint.*`, or `drawing(w, h, (c, w, h, t) => …, live)` in `PICS` |
| Images ("with images" only) | the stationary things that matter (see *With images*) | the user generates them from your brief; `build.py --images` |

**Canvas 2D is your p5.js.** Whatever a p5 sketch could draw, a drawing can: wood grain, plaster, marble, brick, tiles, wallpaper, Islamic geometric patterns, rugs, fabric, paper, clouds, small animations. Use it wherever it gives the best picture, judged shot by shot from what the camera sees: a textured floor and wall usually beat flat colour, and a plain form is sometimes best left plain. `Paint.*` are starting points, not a menu. Helpers: `noise(u, v, { period, oct, seed })` (smooth 0–1, tileable: grain, plaster, marble, clouds), `pixels(c, w, h, (u, v) => [r, g, b, a])` (paints per pixel; draw shapes after it), `wrap(c, w, h, c => …)` (a shape crossing an edge continues on the opposite one; make its `rng` inside), `rgb(hex)`, `mixv`.

**Drawing rules:** Canvas 2D (`c.fillRect`, `c.arc`, `c.roundRect`, paths, gradients; `rr` and `dot` are shortcuts). Paint the whole canvas every call. A live drawing runs every frame with the script time `t`: a pure function of `t`, three at most, 512 px at most, shapes only (`pixels` is too slow for every frame). Tiles are seamless (`wrap`, `noise`). Painted in the reel's look, colours from `P`, `rng(seed)` never `Math.random`, no text or logos (captions are separate). Cut-outs leave their background transparent (`paper` adds the cream die-cut rim).

**Never stretched:** tiles repeat by their real size (`tile` metres per picture; neighbouring pieces continue with `ox`, `oy`); a face takes its height from its picture (`face`; `picBox` with `h = null`); a cut-out takes its width from its picture; a label wraps a cylinder with arc length = height × the picture's width ÷ height (`label`); the window view sits a little behind the window, tinted by the light. Keep the camera within about 35° of a flat picture's front; `cutout(…, { bill: true })` turns toward a camera that circles it.

## Arrange every reel differently

The look and the arrangement both change from reel to reel. Choose these from the script, and never as the last reel in this chat had them (say what that was, if any, in the plan).
- **Layout of the dioramas in the sky:**
  - a **tower**, stacked up or down (rise, fall);
  - a **row** or a winding path (follow, along);
  - a **ring** round a centre (orbit; the end shows the ring);
  - a **nest**, each inside the next: a model on a shelf, the view through a window, a tiny world in a box on the table (pull-back, zoom);
  - **islands** scattered at different heights, sizes and angles;
  - **one place** that changes over time (new state), with a small diorama or two around it.
- **The dioramas themselves:** not always cutaway rooms. Vary the shape and size (a narrow tall room, a wide low one, a corner, a rooftop, a doorway, a market stall, a classroom), the open sides, where the window and door are, and mix in islands (a field, a garden, a desert patch, a shore, a street corner) and small worlds (a block of soil, a tabletop, a drop of water). The kits are optional pieces: `terrain`, `water`, `clouds`, `town`, `section`, `planet`, `orb`, `stars`.
- **Size:** dioramas need not all be room-sized. A huge one seen from far, a tiny one seen close, or one inside another all change the feel.
- **Shots:** each scene gets its own distance (`close`, `medium`, `wide`) and angle (`eye`, `high`, `top`, `low`, `along`); neighbours never share both. Open each reel on a different kind of shot.
- **Light:** a different time of day or weather arc from the last reel when the script allows.

`MAP` is the shot list, one row per scene: `[time, diorama, distance, angle, people, move]`. `--check` flags a move used twice, neighbours with the same shot, fewer than three kinds of shot, and people in high or top shots.

## Plan first: think it through, doubt it, agree it

Before any code and any image brief, plan the world, every scene change, the camera, the light and the sound. Criticize your own ideas and fix their loopholes, share the plan, and **build only after the user agrees** (skip it only when they say to build straight away, give the plan themselves, or ask for a small revision).

**Think first:**
1. Read the script as a story: what it is about, who "you" is, which line is the turn. A line under 1.2 s can't carry a scene change; it shares a scene with its neighbours.
2. Scenes (usually 6 to 10 for 25 s, 3 or 4 for 10 s) and one thread: one or two objects that come back and a light arc (night blue to dawn gold, storm to calm).
3. The world: the layout (from *Arrange every reel differently*, not the last reel's), one diorama per place with its own shape and size, and where each floats (above, below, beside, behind another's window, inside another) so that each move travels a short, clear path.
4. Each scene change: an element of the scene we leave and a move from *Scene changes* that means what the next line says. Then the shot inside each scene and the path of each move. Write the shot list.
5. The pictures: what is a form, what is a drawing, and (with images) every image that matters.
6. Attack each idea with the doubt list; write the doubt and the fix, or drop the idea. Then attack the whole plan: a showreel of tricks? A repeated move, direction or shot? The same layout, rooms or opening as the last reel? The simpler fallback for the two hardest moves? Does every sound come from the picture?

**Doubt list (every scene change):** *Switch point:* where does the eye pass to the next scene without a jump (the element in frame while the sky passes, a view through a window, the same place in a new state)? No frame named = a hidden cut. *Established:* the element is on screen 0.4 s, readable, before it moves. *Meaning:* the move says what the next line says. *Continuity:* nobody in two places at once; one travelling object is one mesh. *Camera path:* never through a wall, floor, furniture or person (enter and leave through the open front, side or top); flat pictures and cut-outs never seen more than 35° off their front. *Timing:* starts in the last half-second of the line, lands as the next words begin, calm under the words. *Repetition:* move kind, direction, scale. *Captions:* nothing moving through the caption band or a Qur'an verse panel. *Respect:* the content rules. *Build:* doable with the kit? *Sound:* what the element sounds like, where the bed changes.

**Who is "you":** someone the audience sees themselves in (an audience of mothers gets a mother, in hijab). If unknown, ask.

**The plan reply** (no code), after one sentence on what you'll do:
1. What went wrong before (only after a correction).
2. The idea: thread, returning objects, light arc, layout (two or three sentences), then the look: the four lines of the art direction.
3. The world: one line per diorama (place, shape and size, contents, where it floats).
4. The moves: per change its time and the line it leads into, then **Move**, **Doubt → fix**, **Sound**.
5. Camera and light: the shot list (`MAP` rows, with lens) and the light arc.
6. Pictures: what is drawn, surfaces included (one line); with images the image list (see *With images*).
7. Qur'an verses (only when the script mentions one): one line each, as *Qur'an verses on screen* says.
8. Weak spots, honestly; then at most four numbered questions.
Under about 900 words. Then stop. When the user answers, build exactly that; for a skipped question take the default and say so.

## Build scene by scene

1. **Plan** (above). With images, once agreed, the next reply leads with the brief for the shared images and scene 1.
2. **Round 1, block-out of the whole reel:** every diorama in place in grey (`diorama(key, true)`), its main forms as plain boxes, people as cut-outs, every moving element of every change, the full `MAP`, `CAM` keys, `LIGHTS` and captions. No small props, particles or sound. This settles camera, timing and framing while they are cheap.
3. **Rounds 2 to n, one scene per round in script order:** dress that scene (props, surfaces and pictures, practical lights, particles, its sounds) and its move into the next, and take it out of grey. Leave approved scenes alone; ask before changing one.
4. **Last round:** the end screen hold, the full sound pass, check frames across the reel; then the user records.

Each round's reply: one line on what changed, the file, then "Press **📸 Next check frame** N times, screenshot the picture each time, and attach the N screenshots in one message." Add the weak spots and at most a few questions. Set `CHECKS` to the 4 to 10 frames that decide the round: round 1 frame 0, one per scene, the middle of each move and the last frame; a scene round that scene's beats and both joins. With images, each round's reply leads with the next scene's image brief, so the user makes images while checking.

**Reading screenshots:** the badge names the frame, its time and label; the dashed red lines mark the caption band and the line below which Reels covers the picture. Check: subjects between the lines and clear of the captions, the element readable before and during its move, the camera not inside or behind geometry nor past a diorama's edge, pictures not stretched or seen edge-on, light and shadows as planned, people as the content rules require, captions legible, every Qur'an verse as *Qur'an verses on screen* says. Fix with small edits, rebuild, check, and go on. If the user wants everything at once, do all the rounds in one build with check frames across the reel.

## Scene changes: an element takes us into the next scene

**No cuts, wipes, fades, flashes or dips to a colour** (cuts only when the user asks). Every change is an action of an element of the scene we leave, and the camera goes with it into the next diorama. Not one long walk between places, and not the same move again: each kind once a reel.

| Move | The element… | Fits lines about | Build |
|---|---|---|---|
| Rise | floats up (steam, light, a voice, a leaf); the camera cranes up with it | thoughts, hopes | next diorama 10–12 m above; a `PT.stream` or mesh on the same path |
| Fall | drops; the camera follows it to where it lands | consequences, arriving | `follow` on it; `settle` and `PT.burst` on landing |
| Follow | flies, rolls or is carried sideways and lands in the next scene | a message, a journey | the diorama beside (x ± 12–14); `via` bends the path |
| Through | the camera goes through a window, door or screen into the diorama behind it | entering, looking out | `room(…, { view: false })`; at most once |
| Pull back | the scene turns out to be inside the next: the view through its window, a model on its shelf | context, memory, "you" | A behind B's window (`view: false`), or A built small inside B |
| Along | a path, thread, river or cable leads the camera on | guidance, cause and effect | boxes laid between dioramas; `via` above them |
| Orbit | the camera circles an element and the next scene waits on its far side | another side, a turn | `via` arc; cut-outs on the way `bill` |
| New state | the place stays; a lamp switches on, rain stops, the sun rises | change, relief | one diorama over those lines; `LIGHTS` and `animate` |
| Pour or grow | water, sand, light or vines flow or grow into the next diorama | growth, time | boxes scaling in along a path, the camera riding the front; `terrain(…).grow(k, at)` |
| Zoom | the camera dives into a small world (a model, a box of soil, a drop) or out of it | detail, the bigger picture | a nested diorama (`WORLD` `{ in, at, s }`); key `{ e: 'zoom' }` |
| Match | a shape lines up with a like shape in the next scene (a coin and the sun) | likeness, "it's the same" | a `CHECKS` match `{ a, ra, b, rb }` at the switch |

- **Different every time:** neighbouring changes differ in kind, direction (up, down, sideways, in, out) and scale.
- **Timing:** a move starts 0.5 to 1.0 s before the next line and ends about 0.1 s after it starts; 10 to 14 m of travel takes 0.8 to 1.2 s (`--check` flags more than 1.6 m in a frame). The scene before it leaves time to read its picture.
- **Switch point:** between dioramas the element stays in frame and readable while the sky passes. Light changes on the way only when the story changes it.
- **Continuity:** a travelling object is one mesh in `world` moving between dioramas, never two copies. **Respect:** sacred objects never move, fall, fly or get covered; take the moving element from something else.
- A bookend, ending on what the reel began with but changed, is strong. A final pull-back showing every diorama is one ending, not the only one: vary it.

## Camera

`CAM` keys `[time, diorama, position, look-at, lens, options]`: position and look-at in that diorama's coordinates (`null`: world); lens is the vertical field of view (30–34° close, 36–40° medium, 40–45° wide). The camera eases from each key to the next with the next key's options: `e` (`'sm'`, `'io'` for travels, `'zoom'`), `via` (a point in the key's diorama the path bends through: a crane, an arc, an orbit), `veil` (0–1: where in a big zoom the camera passes through cloud), `follow: T => worldPoint` (keep looking toward a moving element, weight `fw` 0.8). Negative times count back from the end, so they follow the hold.
- While words are spoken: a slow push or drift (5 to 15%), never a whip; big moves happen in the change window. Don't zoom the lens under words; move the camera.
- Eye level 1.4 to 2.6 m in rooms; low for weight or wonder, high for "small and alone"; no roll; straight down only without people.
- A move whose viewing distance or scale changes more than 6× becomes a zoom by itself: it keeps the same speed for every doubling and turns evenly round its subject.
- Framing: key subjects between y 700 and 1250 and x 65 to 1015 of the 1080×1920 frame; nothing important in the caption band (y 300–650), below y 1250, or at the right edge below y 1000 (the Reels buttons). Give each check frame its subject's world point: `--check` prints where it lands.
- Show only what the diorama has: build a little beyond what the camera sees; the sky is the world between dioramas.
- `BREATH.a` (1): hand-held breath; 0 locks it off. `camMod(T, c)` (optional) adjusts the camera last (the end-screen float).

## Light

`LIGHTS` rows `[time, preset, shadow half-size]` blend smoothly. Presets: `night`, `lamp`, `dawn`, `morning`, `day`, `noon`, `evening`, `dusk`, `overcast`, `storm`, `space`, `under` (underground), or an array `[sky, sun offset [x, y, z], sun colour, sun power, fill colour, fill power, sky power]`. The sun follows the diorama in view, shining in from behind its window; the window view is tinted by the sky; the shadow box widens by itself for world shots.
- Every light has a source in the picture. Night needs a practical: a screen (`glow` plus `practical(g, x, y, z, P.glow)`) or a lamp (`practical` in `#ffcf8a`): a soft even pool of light, about 2 to 3 power for a 4 to 6 m reach; three at most. A screen or lamp face glows with `face(…, { glow: 1.2 })`.
- The light changes only when the story changes it: time passing swings the sun and warms the sky.

## With images

**Choose the images that matter, all of them.** Go through every scene and list what is in frame: the people in every pose (one sheet per character), the organic and detailed things (plants, food, fabric, animals), the faces of hero objects (a cabinet front, a book cover, a framed picture), the big surfaces in view as seamless tiles (floor, walls, ground, rug), each window view, and pictures that carry meaning. Don't stop at a few. Then strike out whatever code does as well: plain forms, **anything that moves or animates** (a clock dial with its hands, a phone screen, a gauge: these are live drawings), simple patterns and signs, anything tiny, far or hidden. Reuse one image across dioramas rather than near-duplicates.

**Labels** are the file names and picture keys, prefixed by use: `tile_` (seamless, repeated by real size), `face_` (fills one face or picture), `cut_` (transparent cut-out; a sheet of figures becomes `cut_x_1`, `cut_x_2`… left to right), `sheet_` (bent on a cylinder), `plate_` (window view). In the plan add one row per image: label, scenes, what it goes on, real size (a tile covers 1 m × 1 m, a person 1.8 m tall), canvas, transparency, reference. Keep a status column: needed, pending review, approved (only when the user says so), superseded.

**The brief** leads the reply, in one code block, ready to paste into ChatGPT; each job restates its own rules:
```
IMAGE BRIEF — <reel title> — <scene or stage> (<n> images)
ATTACH BEFORE PASTING: <label → the earlier image to keep as reference, or nothing>
SHARED STYLE: <the art direction in words: medium and materials, palette hex, shapes, texture>. Straight-on front view, no perspective. Soft even front light: no cast shadows, no directional
shading, no highlights, no vignette (the 3D scene adds light and shadow).
SHARED RULES: no text, letters, numbers, logos or watermarks. Cut-outs: a real transparent background, not a
checkerboard or white (if impossible, flat pure magenta #FF00FF). Tiles: seamless, left edge continues into right,
top into bottom. Faces: the surface fills the canvas edge to edge, no border or frame. <content rules in words>

JOB 1 — tile_floor (tile_floor.png)
Canvas: 1:1, 2048×2048, opaque. Seamless tile covering exactly 1 m × 1 m of floor: <material, layout, colours>.
Restate: seamless, no text, no shadows.

JOB 2 — cut_mother (cut_mother.png): one image, two poses side by side
Canvas: 3:2, 1536×1024, TRANSPARENT. 1 row × 2 columns with clear space between. Left: <pose, whole body>.
Right: <pose>. Same face, clothes and proportions: <identity, hijab and dress colours, simple calm face, dot eyes>.
Reference: <none | the attached cut_mother.png: keep her face, clothes and proportions>.
Restate: transparent, separate figures with a gap, no text, no ground shadow.
```
Rules: faces fill the canvas and match the face's ratio; cut-outs show the whole subject with a little margin and no ground shadow; window views are minimal (few large soft shapes, calm upper part, no frame); people keep all their poses on one sheet (4 poses: 2 × 2, 1:1); a later pose takes the first sheet as its only reference. Never request an image whose reference doesn't exist yet. Missing images show as labelled grey cards and recording stays off, so never present that page as finished.

**When images arrive:** save them in one folder and run `python3 build.py --images <folder> --check`. It keys magenta, trims and splits cut-outs, bleeds their edges, checks tiles for seams, and prints each key with its size and h/w. Then look at each image yourself: subject, pose, style, nothing baked in (text, frames, shadows), plates minimal; note anchors you need (where a held phone is, as a fraction of width and height). Ask for focused repairs of only what is wrong, naming the reference.

## Sound: a diverse score that matches the picture

The library is built into the engine (the same sounds as `reel-creator`). Every reel gets its own **diverse** sound, taken from what is on screen and what happens in it: nature (wind, rain, water, leaves, fire, birds, crickets), objects and materials (paper, cloth, wood, glass, coins, a door, a pen), screens and machines (a click, a ping, a phone buzzing, a clock ticking, a hum, a glitch), people and places (footsteps, a heartbeat, a crowd, a city) and motion (a whoosh, a riser, an impact, a sparkle). No music.
- **Relevant to the visual:** every sound belongs to something on screen, the place, or a move we see. Each diorama has a bed; it changes during the move, so the sound travels with the camera. Indoors or behind glass the outside is muffled (`lp`).
- **What moves or happens makes its sound:** paper creases and flutters, a thrown thing whooshes and thumps, a door knocks, a phone buzzes and pings, a clock ticks, light or a voice swells, a reveal rises into an impact or a chime.
- **Diverse:** vary the type, pitch and pan of the sounds through the reel, and the mix from reel to reel.
- **Can't make it exactly? Make the closest one and add it.** Shape the nearest library sound (`pitch`, `dur`, `vol`), layer two, or write your own in `reel.js` with the library's helpers (`osc`, `nz`, `filt`, `envGain`, `bellEnv`, `lfo`, `grains`, `bus`, `send`): `SFX.name = (ac, out, t, o) => { … }`, plus `BEDS.add('name')` for a background sound. Never leave a sound out because it would only be an approximation; name the approximations in the plan.
- Stay under the voice: effects sit about 12 to 15 dB below it.
- Cues go in each SCRIPT line's `sfx`: `{ at (s from the line's start, may be negative), type, vol 0.3–1, pitch, dur, src }`; beds also `fadeIn`, `fadeOut`, `to`, `lp: [[s, Hz], …]`; `toEnd: true` (lasts to the end, whatever the hold), `fromEnd: s`. `src: ['B', [x, y, z]]` pans the sound from where its source is on screen.
- Library: beds `wind` `rain` `stream` `waves` `fire` `leaves` `room` `birds` `crickets` `crowd` `city` `hum`; air and motion `gust` `breeze` `swell` `whoosh` (`down`) `riser`; ground and weight `rustle` `step` (`surface`: grass, earth, gravel, sand, wood, stone, snow) `thump` `impact` `boom`; water `drop` `drips` `splash` `pour`; `thunder`; cloth and paper `cloth` `flap` `crease` `flutter` `paper` `scribble`; objects `pebble` `wood` `twig` `knock` `clink` `coin` `pop` `sizzle`; screens and machines `click` `shutter` `type` `typing` `tick` `ticking` `ding` `bell` `ping` `chime` `buzz` `glitch` `sparkle` `shimmer`; living things `heartbeat` `bird`. Options: `rate` (drips, typing, ticking, heartbeat, sparkle), `n` (buzz, knock, bird).
- You can't hear it: say so. The user adds the voiceover in their editor from 0:00.

## End screen with an adjustable hold

When the script ends on a call to action, the last scene is an end screen. `REEL.ctaHold` (2.0 when there is a CTA; say so, and that 0 gives the script's exact length) is the default of the page's **End screen hold** field; the reel lasts script end + hold. Mark the last line `hold: true` (its caption stays to the last frame). `END = { at, loop, out }`: the script time the end screen starts, the idle period, the end animation's length. In `animate`, `const e = endPhase(T)`: idle motion only as `e.ia * Math.sin(k * e.A)` for whole k (it repeats with no seam whatever the hold), small and slow; the end animation from `e.tt` (seconds since it began, 0 before), finishing with the last frame. End-screen camera keys, lights and check frames use negative times. Beds on it get `toEnd`, its accents `fromEnd`. Ask the user to check hold 0, the default and 8 s.

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
const QFONT = '"Amiri Quran", serif', QTOP = 290, QH = 640, CAP_Y = CAPTIONS.y;
(document.head || document.body).append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Amiri+Quran&display=block' }));
function inkVerse(c, t, x, y) { if (CAPTIONS.outline) { c.lineWidth = CAPTIONS.outline * 2; c.strokeStyle = CAPTIONS.outlineColor; c.strokeText(t, x, y); } if (CAPTIONS.shadow) { c.shadowBlur = CAPTIONS.shadow[0]; c.shadowColor = CAPTIONS.shadow[1]; } c.fillStyle = CAPTIONS.color; c.fillText(t, x, y); c.shadowBlur = 0; }
function paintVerse(v) {
  const c = v.d.ctx; c.clearRect(0, 0, W, QH); let size = 64, lines;
  for (;;) { c.font = `${size}px ${QFONT}`; lines = []; let cur = ''; for (const wd of v.ar.trim().split(/\s+/)) { const t = cur ? cur + ' ' + wd : wd; if (cur && c.measureText(t).width > 900) { lines.push(cur); cur = wd; } else cur = t; } lines.push(cur); if (lines.length * size * 1.85 <= QH - 70 || size <= 34) break; size -= 2; }
  const lh = size * 1.85; v.h = lines.length * lh + 56;
  c.direction = 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  lines.forEach((ln, i) => inkVerse(c, ln, W / 2, lh * (i + 0.5)));
  c.direction = 'ltr'; c.font = `700 30px "${CAPTIONS.font}", Georgia, serif`; inkVerse(c, v.ref, W / 2, v.h - 28); v.d.tex.needsUpdate = true;
}
function verseLayers() {   // last line of build()
  for (const v of VERSES) { v.d = drawing(W, QH, () => {}); v.m = overlay(v.d, W, QH, H - QTOP - QH / 2, 1.2); v.m.visible = false; paintVerse(v); }
  document.fonts.load(`64px ${QFONT}`).then(() => { VERSES.forEach(paintVerse); renderAt(clock.t); }).catch(() => {});
}
function verseAt(T) {   // first line of animate(T)
  CAPTIONS.y = CAP_Y;
  for (const v of VERSES) { const a = T >= v.from && T < v.to ? Math.min(v.from <= 0.001 ? 1 : clamp01((T - v.from) / 0.4), clamp01((v.to - T) / 0.4)) : 0; v.m.visible = a > 0; v.m.material.opacity = a; if (a > 0) CAPTIONS.y = (QTOP + v.h + 150) / H; }
}
```

## Build

**The engine is `engines/three/`** (`template.html` and `build.py`); never copy or retype it into the reel's folder. Write `reels/<folder>/reel.js` and, after every change, run `node tools/build.js reels/<folder> --check` (it passes `--images images` when `images/` has pictures, named as *With images* says). Fix every ✗, look at the sheet, then render. The claude.ai copy of this skill reads the *3D Reel Engine* artifact (https://claude.ai/artifact/9nUis3pJLMKK3kZeZGRSZk); an engine fix goes into `engines/three/template.html` (or `engines/shared/`, then `python3 tools/sync-engines.py`) with a line in `engines/CHANGELOG.md`, and is published back to that artifact only when the user asks.

**reel.js** (the top level only declares; `build` makes everything once, `animate` sets what moves from `T` alone):
```js
setRoom('dusk');                                             // optional wall colour (element: phone)
Object.assign(LOOK, { bevel: 0.05, rough: 0.9 }); Object.assign(CAPTIONS, { font: 'Fraunces', weight: 700 });   // the reel's look
const REEL = { title: 'Before you wake', fps: 30, ctaHold: 0 };
const SCRIPT = [ { start: 0, end: 3.3, text: 'You pick it up *before* you wake.', sfx: [{ at: 0, type: 'room', dur: 3.6 }] }, … ];
const WORLD = { A: [0, 0, 0], B: [0, 11, 0], C: [13, 0, 0] };   // dioramas in one sky (a nested one: { in: 'A', at: [x, y, z], s: 0.05 })
const MAP = [[0, 'A', 'wide', 'eye', true], [3.4, 'B', 'medium', 'low', false, 'rise'], …];   // the shot list
const PICS = { man: Paint.person({ pose: 'sit', hands: 'phone' }), clock: Paint.clock(t => 7 + t / 2), floor: Paint.planks(),
  plaster: drawing(512, 512, (c, w, h) => pixels(c, w, h, (u, v) => mixv(rgb(P.wall), rgb(lighten(P.wall, 0.1)), noise(u, v, { period: 5 })))) };
const LIGHTS = [[0, 'night'], [3.0, 'night'], [3.4, 'dawn'], [-0.01, 'morning']];
const R = {};
function build() {
  // ── A: night, he sits up in bed and scrolls ──
  const A = diorama('A'); room(A, { floor: 'floor', wall: 'plaster' });
  bx(A, -1.8, 0, -1, 2, 0.5, 3.4, P.wood0);                   // a bed: x, y (base), z, width, height, depth, colour
  R.man = cutout(A, 'man', 1.9, -1.8, 0.8, -1.3); R.light = practical(A, -1.8, 1.6, -0.95, P.glow);
  const B = diorama('B', true); room(B);                       // still grey: dressed in its own round
  picBox(B, 1.7, 2.5, -2.97, 1.2, null, 0.08, 'clock', { side: P.cream });
}
function animate(T) { R.light.intensity = 2.5 * (1 - sm(2.75, 3.3, T)); PT.stream(AT('A', [-1.8, 1.6, -1]), T, { t0: 0.8, t1: 3.3, v: [0, 1.3, 0], col: P.glow }); }
const CAM = [[0, 'A', [3.4, 3.4, 15], [-0.4, 2.9, 0], 40], [2.6, 'A', [0.2, 2.6, 8.4], [-1.3, 1.7, -1.2], 30], [3.4, 'B', [3.2, 3, 12], [0.2, 2.3, 0], 38, { e: 'io' }]];
const CHECKS = [[0.05, 'A opens', AT('A', [-1.8, 1.7, -1.3])], [3.0, 'rise A→B'], [-0.05, 'the end']];   // [time, label, world points to locate]
```
- Units are metres, y up, +z toward the camera. A room's inside runs x and z from −3 to 3, floor at 0; back wall face z −3, window opening x −1.9 to 0.1 and y 1.7 to 4.2. A person stands about 1.8 m; a table top 1.0, a bed 0.8, a seat 0.5.
- `bx`, `cy`, `ball`, `cutout`, `label` take the base; `face`, `glow` the centre. Move, turn or scale meshes, never shared geometry. Everything moving is set in `animate` from `T` (no state, `rng(seed)`, analytic particles).
- Don't redeclare engine names (anything in the template). Yours: `REEL SCRIPT WORLD MAP PICS LIGHTS CAM CHECKS END R build animate camMod` (plus `VERSES QFONT QTOP QH CAP_Y inkVerse paintVerse verseLayers verseAt` when a verse shows).

**Engine:** `setRoom`; `diorama(key, grey)`, `room(g, { w, d, hh, win: [x, w, h, sill] | false, door: [x, w, h], right, left, ceil, front, shell, bars, floor, wall, tile, view, wainscot })` → `{ win, door }`, `plinth(g, { w, d, h, top, side, tex, tile })`; `bx(g, x, y, z, w, h, d, col, { mats, ry, cast, em, ei })`, `cy(g, x, y, z, r, h, col, { top, seg })`, `ball(g, x, y, z, r, col)`, `grp(g, x, y, z, ry)`, `mat(col, { map, em, glow, opacity, rough, metal })`; pictures `face(g, key, w, x, y, z, { ry, glow })`, `picBox(g, x, y, z, w, h, d, key, { face: 'z'|'x'|'-x'|'y', tile, ox, oy, tint, side })`, `cutout(g, key, h, x, y, z, { ry, flip, bill })`, `label(g, key, r, h, x, y, z)`, `glow(g, x, y, z, size, col)`, `practical(g, x, y, z, col, power, reach)`, `pic(key)`, `ratio(key)`; `drawing(w, h, fn, live)`, `paper(w, h, fn, live)`, `noise(u, v, { period, oct, seed })`, `pixels(c, w, h, fn)`, `wrap(c, w, h, fn)`, `rgb(hex)`; `Paint.planks(c0, c1, n)`, `Paint.view({ sky, hill, tree })`, `Paint.screen({ bg, speed })`, `Paint.clock(hours or t => hours)`, `Paint.plant({ pot, leaf })`, `Paint.person({ who: man|woman|boy|girl, pose: stand|sit, hands: down|phone|book, top, bottom, skin, hair, scarf })` (women and girls always in hijab and a long dress; children: a smaller height); `PT.stream(origin, T, { t0, t1, rate, life, v, g, spread, wob, size, streak, col, s, seed })`, `PT.motes(origin, T, { n, box, y, size, s })`, `PT.burst(origin, T, t0)`; `AT(key, point)`, `lv(key)` → `{ o, s }`, `screenOf(point, T)`, `endPhase(T)`, `sm`, `tw`, `bump`, `settle`, `mix`, `mixv`, `add3`, `clamp01`, `rng`, `Ease`, `hexMix`, `lighten`, `darken`, `rgba`; `P`, `LOOK` (`bevel`, `rough`, `metal`, `env`: how strongly metal reflects, `sat`, `vary`, `seg`), `CAPTIONS` (`font`, `weight`, `color`, `emphasis`, `outline`, `outlineColor`, `shadow`), `BREATH`, `world`. Optional kits (in a diorama's metres): `terrain(g, { kind: plain|field|hills|valley|desert|mountains|shore, size, width, flat, pads, cols, alive, edge, sink, seed })` → `{ h(x, z), grow(k, at) }`, `water(g, { size, y, col })`, `clouds(g, { n, area, y, z, size })`, `town(g, { area, lot, open, roof })`, `section(g, { kind: soil|cave|hive|drop })`, `planet(g, x, y, z, R, { region })`, `orb(g, x, y, z, r, col, { halo })`, `stars(g, { n, r })`.

## Delivery

Send the user `out.mp4` (rendered with `node tools/render.js`) and `index.html` as files, as `CLAUDE.md` says (never commit the reel; `index.html` carries its source for `node tools/unpack-reel.js`). The user opens `index.html` in Chrome, Edge or Safari to preview, adjust the hold or record; the first open needs internet (Three.js from jsDelivr, the font from Google Fonts). The page has Play, Restart, Full screen (Esc or F; tap to play), a scrubber with frame stepping, **📸 Next check frame** and ◀ with the guides, End screen hold, sound volume, and Record & Download (real time, tab visible; MP4 where the browser can, otherwise WebM). Say what you checked (code, numbers, the frames you rendered and looked at, the measured sound peak) and that you haven't heard the reel. For another chat, give a short handoff: the look, world layout, labels of the images to reattach, open issues.

## Content rules

These apply to every frame, character, drawing and image prompt.
- Nothing indecent: no nudity, revealing clothing, suggestive poses, romance, gore, drugs, alcohol or gambling.
- No girls or women except in hijab, anywhere (backgrounds, crowds, silhouettes). Prefer objects, hands, animals and places; if a person is needed, one simple figure: a man, or a woman or girl in hijab when the story or audience calls for one.
- No pigs or piggy banks; never religious symbols or sacred imagery as a gag. Sacred objects (the Quran, a mushaf, a prayer mat) stay still in a place of honour, with no readable text, and never move, fall or get covered. Qur'anic text appears only in the verse panel (see *Qur'an verses on screen*).
- Prophets are never depicted in any form (no face, figure, silhouette, hands or glow); tell their stories through objects, places and outcomes. Companions and revered figures without faces: from behind, far away, or hands only.
- No brand logos, copyrighted characters or real people. If the user's own artwork breaks these rules, say so and ask.