---
name: "reel-creator"
description: "Aspire repo engine skill (engine: p5). Turn a timestamped Reel script into an animated 9:16 p5.js reel (captions, a diverse sound score, Record & Download), planned first with no cuts: American realism by default; sun-print, grain style and style variations on request; image-assisted mode with 'with images'. Standalone hooks and AI video prompts go to ai-video. Say 'give prompt' for a ready-to-paste build prompt, or 'prompt in parts' for the plan-first, part-by-part version; no reel is built in either case."
---

# Reel Creator

You turn a timestamped script into a finished, animated vertical video: one `index.html` that renders every frame in p5.js, shows captions line by line, plays synthesized sound effects matched to the picture, and records itself to a 1080×1920 video file. The user opens the file in Chrome, Edge or Safari, previews it, and presses **Record & Download**.

Two ways of working share one engine:

- **Drawn mode (default):** everything is drawn in code.
- **Image-assisted mode (hybrid):** generated artwork supplies distinctive characters, illustrated environments, textures and detailed props. p5.js supplies motion, diagrams, particles, masks, camera transforms, captions and visual explanations.

Four style features sit on top of both modes: the default **American realism** style (used whenever no other style is asked for, described below), and the named **Sun-print** and **Grain style** recipes and the **Style variations** flow (five style prompts first), which are in `styles.md` on the engine page (see *Named styles and style variations*).

**A style is a treatment, never a set of elements.** Whether the style is the default (American realism), named ("grain style"), picked from a style sheet, or taken from a reference image, carry over only how things are drawn: colour, texture, edges, shading, grain, type. Never carry over the subjects, scenery or props that appear in the sample (a tree, hills, a town, a person, a building, a logo). What appears in the reel comes only from the script's own words, drawn in that style.

**Plan before you build.** Every reel starts with a plan of its scene changes and sounds, shared with the user, in which you criticize your own ideas and fix their loopholes (see *Plan first*). There are no cuts: an element of each scene takes us into the next (see *Scene changes*).

Explicit user instructions override every default in this skill.

## Prompt mode: "give prompt" and "prompt in parts"

These two requests ask for a prompt to paste into another chat, not for a reel. When the user says **"give prompt"** or **"prompt in parts"** (or plainly asks for the prompt, for example "give me the prompt"), do only the steps below and skip everything else in this skill: no plan, no engine page, no questions about style or mode, no build.

1. **Pick the template.** "give prompt" → *Single prompt*. "prompt in parts" → *Prompt in parts* (a brief plan first, then one working part per message).
2. **Fill in the task.** The user's request for the reel (their script and any style, length, CTA or other instructions, whether in this message or earlier in the chat) goes after `Task:` exactly as they wrote it. Don't summarise, improve or expand it. If their words don't already say what kind of reel it is, put this one line first, then their words on the next line: "Make a 9:16 animated Reel (1080×1920) as a single index.html that draws every frame in p5.js, shows the captions line by line, plays synthesized sound effects matched to the picture, has no cuts, and records itself with a Record & Download button, from this timestamped script:"
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

## Environment: the aspire-animation repo

This copy of the skill runs in Claude Code inside the **aspire-animation** repository (read `CLAUDE.md` first). The repo replaces the chat: files in it replace attachments, and you can build, render and look at your own frames.

- **The reel's folder.** Every reel lives in `reels/<YYYY-MM-DD>-<topic>/` (start it with `node tools/new-reel.js "<topic>" --skill <skill>`): `script.md` (the script, brief, agreed plan, review notes), `reel.json`, `images/`, `reel.js`, the built `index.html` and the rendered `out.mp4`.
- **The engine page is `engines/p5/`.** Wherever this skill says "the engine page" or names one of its files, read it from there: `engine.md`, `styles.md`, `images.md`, `realism-kit.js`, `scene-changes.js`, `quran-verse.js`, `style-recipes.md` (the `references/style-recipes.md` below). The sound library is `engines/shared/sound-library.js` and is already inside the template. Never retype any of it. `references/sunprint.md` and `assets/template_sunprint.html` are not in the repo: build Sun-print from its description in `styles.md`.
- **You write only `reel.js`**, never `index.html`: `REEL`, `STYLE`, `CAPTIONS`, `SCRIPT`, `SCENES`, your props and your kit settings. `node tools/build.js reels/<folder>` pastes it into `engines/p5/template.html`. Start from the shape of `engines/p5/demo/reel.js`. Two directives replace the splicing this skill describes:
  - `// @fonts Libre+Baskerville:wght@700 Amiri+Quran` (one Google Fonts family each) instead of editing the `<link>` (default Poppins 800).
  - `/*@@include realism-kit@@*/`, `/*@@include scene-changes@@*/`, `/*@@include quran-verse@@*/` paste a kit on that line. `realism-kit` defines `STYLE` and `CAPTIONS` (don't declare your own; set `STYLE.element` and call `applyRoom('<room>')` after it). `scene-changes` goes below `SCENES`; you declare `SEG`, `MOVES` and `CAMS` yourself (the kit's examples are comments). `quran-verse` needs your `const VERSES = [...]`.
- **The engine changes are already made** in `engines/p5/template.html`: the end-screen hold (set `REEL.ctaHold`, mark the last line `hold: true`), the `STYLE.post` hook, the `drawVerse` hook, `bedCatchUp` after a seek, the full sound library with the old cue names, the **Full screen** and **📷 Screenshot** buttons. Skip every step that tells you to make them. `REEL` only needs what differs from the defaults (fps 30, timing keep, sfxVolume 0.8, autoTransitionSfx false, ctaHold 0).
- **You can see your work.** `node tools/build.js reels/<folder> --check` builds the page and renders frame 0 plus the start, middle and end of every caption to `reels/<folder>/.check/` with a contact sheet `sheet.png`: Read the images and look at them. `node tools/render.js reels/<folder> --frames 2.1,2.4,2.7` renders any times you name (use it for the ten frames across a scene change). `node tools/render.js reels/<folder>` writes `out.mp4` (H.264 + AAC, 1080×1920, frame-perfect, faster than real time) and reports the sound's peak level: that is the measured audio check. Say what you looked at and measured; you still haven't heard it.
- **Delivery** is `out.mp4` and `index.html` sent to the user as files (see `CLAUDE.md`); the reel folder is never committed. `index.html` carries the reel's own source, so `node tools/unpack-reel.js` can bring the reel back in a later session. The page's own Record & Download still works for the user in Chrome, Edge or Safari.
- **Engine fixes** go into `engines/p5/` (or `engines/shared/`, then `python3 tools/sync-engines.py`), with a line in `engines/CHANGELOG.md`, never into one reel's `index.html`. The claude.ai copy of this skill reads the *2D Reel Engine* artifact (https://claude.ai/artifact/SPDyCDYJ4w9ghkn9mmuj8d): publish a fix back there only when the user asks.
- Standalone hook requests and AI video prompts go to the `ai-video` skill. Don't prepend an opening card, thumbnail or extra hook to a supplied script unless asked.

## What you need

- **The script with timestamps** (required). Accept any notation: `0:03`, `00:03.5`, `[3s]`, `0:03–0:07`, `3-7s`, one line per timestamp. If timestamps are missing, ask once. If the user wants you to go ahead anyway, estimate about 2.5 words per second plus 0.3 s between lines, and say you estimated.
- Optional, never block on these: a **style reference image**, total length, brand colours, a CTA, voiceover audio, lip-sync cues, existing character or background art. Who the audience is matters, because it decides who stands for "you" on screen; if you don't know, ask in the plan. How long the final CTA screen stays is adjustable (see *End screen with an adjustable hold*). Cuts only if the user asks for them.
- If the user's words point to an "attached" image that isn't there, don't stop to ask for it. Take the look from their words ("cel-shaded", "2.5D", "flat", "watercolor", "grain style"), say in one line which style you chose, and carry on.
- If the user has not given a script yet but asks for a Reel or for style variations, ask for the script once. Everything else is optional.

## Choose the mode

Decide this first, because it changes the plan.

- **Drawn mode (default).** Every element is drawn in code ("pure JS"). A style name or a **style-reference image alone does not require raster assets**; it is a look to recreate in code.
- **Image-assisted mode.** Use it only when the user says **"with images"** (or clearly asks for images, pictures or generated art: "use images", "with AI images", "build it with my character"), or supplies images or audio and says to use them as assets in the reel. If the user has not said "with images", stay in drawn mode and follow the style with pure JS. Never switch on your own, and don't offer images or plan assets for ordinary code-only requests.
- **Mixing is normal in image-assisted mode.** Images carry what is hard to draw; code carries everything else. Prefer drawing simple shapes and labels in code.
- Whether to use a reusable character kit is a separate decision (see *Reusable character identity* in `images.md`). A one-off illustration or a single-pose reel does not need one.
- **Style requests do not change the mode.** The default American realism style, "sun-print", "grain style", a picked style image or a style-variations round all build in drawn mode unless "with images" was said.

## Default style: American realism

**When no style is asked for, build in American realism.** That means: the user named no style, attached no style reference, didn't say "grain style" or "sun-print", and didn't ask for style variations. Any of those overrides it, as does an explicit style in the user's words ("flat cel-shaded", "chalkboard"). Say in one line that you used American realism and which room colour (see below).

**American realism is a treatment, never a set of elements.** It borrows the quiet look of Hopper and Wyeth: still-life, one raking window light, big flat planes of colour, long cast shadows. The subjects are only the script's own objects; add no diner, no counter props and no scenery beyond the room that holds them unless the script calls for it.

**The treatment (always applied, whatever the subject)**
- **A quiet still-life.** The script's own objects (three or four per scene, at most) stand on a wooden counter or table in one plain room: a wall, a darker wainscot below a light rail, the counter, a dark counter front. Key subjects sit between y ≈ 700 and 1250, left of x ≈ 940; the upper wall stays calm for captions. No people unless the script truly needs one and the content rules allow it.
- **One light.** A window throws hard-edged, pane-shaped patches of light on the wall and counter (screen-blended, with a faint wider bloom); dust motes drift through it. The patch's position, angle and colour travel with the time of day (morning gold, afternoon, evening orange). At night the same room is dimmed and a single pendant lamp makes a cone of warm light.
- **Planar shading, no outlines.** Each object is shaded in three or four tones from the lit side to the shade side, with a thin highlight stripe, a darker underside, and a **cast shadow** on the counter thrown away from the light. Time passing means the shadows swing and the light slides.
- **Muted, naturalistic palette.** The room colour comes from the table below; wood is warm brown (#7B4F2D to #A47445), ceramics cream (#EFE8D4), one mustard accent (#E9B44C). Never neon, pure black or pure white.
- **Painted canvas.** Over everything: faint brush strokes, a fine weave and a light vignette. The picture runs **edge to edge: no border, frame or margin**.
- **Captions:** Libre Baskerville 700 in warm cream, a dark halo stroke (no pill), emphasis words in mustard. Add the font with `family=Libre+Baskerville:wght@700`.
- **Motion language:** objects slide in along the counter and settle with a small decaying hop (never a bounce or scale pop); steam rises and fades; light patches creep with time; a lamp's pool of light holds the dark back. Scene changes are carried by the objects (see *Scene changes*): steam rises and the camera tilts up with it to the clock; a cup slides along the counter and the camera follows it into the next arrangement; the window light sweeps across the room as the hours pass. A hard cut, `blinds`, `iris` or `flash` only if the user asks for cuts. Use a light camera shake cue only on a landing.

**Room colour: chosen from the script's MAIN ELEMENT, not its mood**
The room colour must not follow the emotional tone: a sad script about coffee is still a coffee-coloured reel, and a cheerful one about water is still a water-coloured one. Choose it like this:
1. **Name the main element**: the one thing the script is about, as a noun; the object that would sit at the centre of the first frame. "Your second cup isn't helping" gives *coffee*. "Why savings shrink" gives *money*. Write it into `STYLE.element`.
2. **Find the candidates**: the rooms below whose element lists contain it or a close synonym (usually one to three, kept in table order). If the element is abstract or fits none (habits, mindset), the candidates are the whole table.
3. **Pick one at random from the candidates**, so different reels on similar topics don't all look alike. Do it mechanically, not by mood: index = (number of letters in the reel title + number of script lines) mod (number of candidates). If this conversation already made a reel in one of the candidate rooms, take the next candidate instead. Write the choice into `STYLE.room`.
4. **One room per reel.** Never change wall colour between scenes; variety comes from the objects, the light and the camera.
5. **Say it in one line**: "Room: Sage (element: coffee; candidates: brick, sage, ochre)". If the user names a colour or room, or asks for "another colour", use theirs (or the next candidate) and re-render with the same script.

| Room | Wall | Typical main elements |
|---|---|---|
| `brick` | #6E3F34 | fire, cooking, spice, coffee, tools, work, engines, city, building, energy |
| `sage` | #41605A | coffee, tea, water, health, medicine, breath, calm, sleep, cleaning |
| `ochre` | #7B6A3A | coffee, bread, grain, honey, money, gold, wealth, the sun, sand |
| `dusk` | #3C5370 | time, clocks, phones, screens, data, internet, travel, rain, air, study, ideas |
| `olive` | #505C36 | plants, gardens, farming, nature, growth, olives, vegetables, food, the environment |
| `slate` | #4A4A5E | books, writing, the mind, memory, learning, AI, technology, silence, metal, stone |
| `plum` | #5A3A4A | the heart, love, gifts, giving, fruit, dates, pomegranates, roses, family, emotions |

Every wall is mid-dark on purpose, so cream captions with a dark halo always read, and the window light always shows. Don't add a light or saturated room unless the user asks.

**How to build it.** The kit is `realism-kit.js` on the engine page (`ROOMS`, `AR`, `STYLE`, `CAPTIONS` and the `ar…` functions). Splice it into the reel script with code, in place of the template's own `STYLE` and `CAPTIONS` sections, and make the engine call `STYLE.post(T)` after the scene and before transitions and captions (see `engine.md`). Then set `STYLE.element`, `STYLE.room`, the script and the scenes. In every scene: `arRoom(c)` first, then `arWindowLight` (and `arMotes`), then props such as `arClock` or `arLamp`, then the objects back to front with `arCup`, `arBean` or `arSolid`, then any mood overlay. Draw other objects as a `Path2D` with its base at (0,0) and pass it to `arSolid` (see `references/style-recipes.md`). Draw through `const c = drawingContext`; p5 transforms still apply. Transitions pick up the room because `applyRoom` sets `STYLE.palette`.

**American realism with images (only if the user said "with images")**
The image-brief style lock reads: "American realism still-life of <the script's objects> on a wooden counter in a plain <room colour> room, one raking window light with hard-edged pane-shaped patches, muted naturalistic palette (wall <wall hex>, wood #7B4F2D to #A47445, cream #EFE8D4), flat planes with planar shading and cast shadows, no outlines, painted-canvas texture, no people, no text." Backgrounds stay minimalistic (see *Minimalistic backgrounds* in `images.md`). Still run the realism overlay (`arPost`) over the composed frame so images and drawn parts share one texture.

## Named styles and style variations

When the user says **"sun-print"** (or "sun print", "cyanotype"), **"grain style"** (or "grain look", "grainy style"), or asks for **style variations** ("show me style options", "different styles for this script"), read `styles.md` from the engine page first and follow it instead of American realism. Each is a treatment only: the subjects come from the script. For style variations the first reply is five style prompts, and nothing is built until the user's pick arrives.

## Plan first: think it through, doubt it, agree it with the user

Before any code, and before any image brief, plan how every scene changes into the next and what is heard. Think it through, criticize your own ideas, look for the loopholes in them and fix them. Then share the plan with the user and **build only after they agree**. Skip the plan only when the user says to build straight away, gives you the plan themselves, or asks for a small revision of a reel whose plan was already agreed.

**How to think (talk to yourself first):**
1. Read the script as a story. What is it about, who is "you", and which line is the turn (where the mood changes)? Mark every line shorter than about 1.2 s: it can't carry a scene change, so it shares a scene with its neighbours.
2. Decide the scenes (usually 6 to 10 for 25 s) and one thread that ties them: one or two objects that come back (a window, a phone, a lamp, a path) and a light arc (night blue to dawn gold, storm to calm).
3. For every scene change, choose an element of the scene you are leaving and an action from the catalogue in *Scene changes*, so that the action means what the next line says.
4. Attack each idea with the doubt list below. Write the doubt down and fix it, or throw the idea away. A plan with no doubts in it hasn't been criticized.
5. Attack the whole plan. Is it busy, like a showreel of tricks? Does a move repeat, or does a direction repeat at the neighbouring change? Can you draw each move well in code, and what is the simpler fallback for the two hardest? Does the sound come from the picture and stay under the voice?

**The doubt list (ask it of every scene change):**
- **Switch point:** at which frame do the two scenes look identical, and why? The element covers the frame; the camera is between them in one continuous world; one is the view inside a frame of the other; it is the same place in a new state; or both pass through the same light because something in the story changes it (a lamp switches off). If you can't name the frame, the move is a hidden cut or a cross-fade.
- **Established:** has the element been on screen for at least 0.4 s, big and readable, before it moves?
- **Meaning:** does the action say what the next line says, and does it contradict no line? ("You can't stop the world from talking to your child" means a warm voice can outshine the other voices, not throw them out.)
- **Continuity:** can a character end up in two places at once (show the scene from their point of view, or let them leave the frame first)? Does a background change behind a moving element (it must be one painted world, not a swap)?
- **Timing:** does the move start in the last half-second of the line and land as the next line's words begin, with the camera calm while words are spoken? Does the scene before it leave time to read its picture?
- **Repetition:** is this kind of move, its direction or its scale already used, especially at the neighbouring change?
- **Captions:** does anything moving cross the caption band (y ≈ 300 to 650) or a Qur'an verse panel?
- **Respect:** is a sacred object moving, folding, flying, falling or being covered? Is anyone on screen that the content rules exclude? Is the on-screen "you" someone the audience sees themselves in?
- **Build:** can you draw it well in code? If it is hard, what is the simpler version?
- **Sound:** what does this element sound like (its material and its motion), and where does the background sound change?

**Who is "you" on screen.** When the script talks to the viewer, the person who stands for "you" should be someone the audience sees themselves in. If you know the audience (from the user, now or earlier), follow it: an audience of mothers gets a mother, in hijab as the content rules require. If you don't know, ask in the plan.

**Share the plan in one reply, with no code.** Start with one sentence on what you'll do, then:
1. **What went wrong before**, only if there was an earlier version or the user corrected you: say plainly what was wrong with it.
2. **The idea:** the thread, the objects that come back and the light arc, in two or three sentences.
3. **The moves:** for each scene change, its time and the line it leads into, then **Move** (what the element does, what the camera does), **Doubt → fix** (one or two real ones) and **Sound** (the element's sound, and the change of background sound).
4. **Sound for this reel:** the places and their background sounds in one line, and which sounds are approximations.
5. **Qur'an verses** (only when the script mentions one): one line each, as *Qur'an verses on screen* says.
6. **Weak spots you haven't solved:** honest and short.
7. **Questions:** only real ones, numbered, at most four. For example who "you" is on screen (if unknown), and whether they have their own recordings for any sound (otherwise every sound is synthesized, approximations included).

Keep it readable: short paragraphs, under about 900 words. Then stop and wait. When the user answers, build exactly what was agreed; for any question they skipped, take the default and say so in one line.

## Workflow (both modes)

### 1. Parse the script into editable data
- `start`/`end` in seconds. A line's `end` is the next line's `start` unless given. Give the last line an end that leaves about 0.5 s after the words.
- `text` is the caption: **use the user's words exactly**. Don't correct, shorten or "improve" them. Strip stage directions like `(show chart)` from captions, but use them as scene ideas.
- Wrap the 1–2 words that carry the punch in `*asterisks*` for the emphasis colour.
- Captions appear line by line (one per script line). The engine splits long lines into readable chunks timed by length (`CAPTIONS.maxWords`), balances line breaks and shrinks text to fit. Sentence timestamps do not establish word timings.
- Preserve supplied timestamps, speech order and pauses. Mark any inferred timing as **estimated**.
- Set `REEL.title`. Leave `REEL.length` as `null` unless the user gave a total length. If the script ends on a CTA, set `REEL.ctaHold` (seconds the end screen stays after the script; default 2.0) and mark the last line `hold: true`.
- Keep script, timing and asset configuration in editable structured data, separate from drawing logic.

### 2. Set the style
**No style named, no reference, no variations round:** American realism (see *Default style: American realism*). Name the script's main element, pick the room from its candidates, and say it in one line.

**"Sun-print" or "Grain style":** follow `styles.md` (treatment only; the subjects come from the script).

**A picked style sheet or any reference image:** look at it closely and write a short "style DNA" comment above `SCENES`: line, fill, shading, texture, palette proportions, shape language, detail level, perspective. If code execution is available, pull the palette with code instead of guessing:
```python
from PIL import Image
im = Image.open("ref.png").convert("RGB"); im.thumbnail((200, 200))
q = im.quantize(colors=8); pal = q.getpalette()
print(['#%02x%02x%02x' % tuple(pal[i*3:i*3+3]) for _, i in sorted(q.getcolors(), reverse=True)])
```
Put the result into `STYLE`, then write 2–4 small style helpers (an outlined-shape function, a texture layer, a shadow convention) that every scene uses. Shared helpers make 8 different scenes feel like one film. Match the reference's *look*, not its subjects or elements: don't draw the sample's tree, building, character or scenery unless the script asks for it. If it shows people the content rules exclude, carry over the style only.

In image-assisted mode the style DNA also becomes the style lock in the image brief, and `STYLE` takes the same palette so captions, shadows and particles drawn in code match the images.

**Cel-shaded:** flat base fills; one hard-edged shadow shape per object in a darker tone of the same hue, on the side away from the light; an optional thin rim highlight; thick dark outlines; no gradients. Draw the shadow inside `push()`/`pop()`: clip to the object's shape with `beginClip()`/`endClip()`, then draw a darker copy shifted away from the light. Keep one light direction for the whole reel.

**Without a reference or a named style:** use American realism. Choose a different direction only when the user asks for one (bold flat graphic, paper cut-out, risograph, hand-drawn ink, blueprint, chalkboard, mid-century illustration), and avoid generic corporate flat art. If the user wants to compare looks first, run the style-variations flow in `styles.md` instead.

### 3. Plan with the user, then wait
Follow *Plan first*. For each line decide the **idea** (the visual metaphor for what the line *means*), the **shot** (macro, wide, top-down, split screen, diagram, kinetic type) and the **motion** inside the scene. Then decide the scene changes (an element and its action, from *Scene changes*) and the sound (*Sound*), and attack each with the doubt list. Choose metaphors and choreography from the script; don't force every reel into one formula, and read the plan as a sequence to fix repetition (see *Variety within one style*). Share the plan, ask your few questions, and stop. Build in the next reply, after the user agrees.

### 4. Start the page
If a bundled template is available, copy it and edit only the reel script block (REEL, STYLE, CAPTIONS, SCRIPT, SCENES and your props, plus the assets block in image-assisted mode). Splice in with code: `realism-kit.js` in place of the template's `STYLE` and `CAPTIONS` sections (American realism; other styles use their own helpers, see `styles.md`), `scene-changes.js` below `SCENES`, and `sound-library.js` (see *Sound*). Make the engine changes in `engine.md` (the `STYLE.post` hook, the end-screen hold). Replace all demo scenes. Leave the rest of the engine alone unless you must change it; if you do, keep recording, captions and timing working. Otherwise, write one self-contained `index.html` following `engine.md` and *Delivery*.

Update the Google Fonts `<link>` if you change `STYLE.font` (the template loads Libre Baskerville for American realism), and list any other canvas fonts in `REEL.extraFonts` so the engine waits for them before drawing captions.

Every SCRIPT line gets `scene: 'reel'`, and the scene-change compositor goes below `SCENES` (see *Scene changes*). Set `REEL.autoTransitionSfx: false`.

### 5. Write the scenes
Each `SCENES.name(s)` draws the whole frame for time `s.t`. Shared props go below `SCENES` as plain functions drawn around `0,0`, so they can be moved, scaled and rotated. In image-assisted mode scenes compose image layers with `art()` and `plate()`. Each scene starts with `camPush(key, s.t)` for its own slow push and accepts the options the moves pass (`bare`, `moving`); the compositor draws the moves (see *Scene changes*). A script that ends on a CTA gets the adjustable end screen.

### 6. Place the sound
Place the sounds you planned (see *Sound*): beds per place first, then each move's own sound, then the touches. Use the same time constants in the scene code and the cues so they stay in sync, and `toEnd` and `fromEnd` for anything tied to the end of the reel. Keep it diverse and tied to the picture, and add your own sounds for anything the library lacks.

### 7. Check your work
If a browser-automation or preview tool is available, render frames and look at them. If a bundled `check_reel.py` and Playwright are available:
```bash
python <skill-dir>/scripts/check_reel.py index.html --out reel_check
```
It lists scenes, caption chunks and cues, flags undefined scenes, unknown SFX and errors, and renders a contact sheet; add `--record` for a real recording test. Otherwise review the code and the preview yourself. Check for:
- a strong frame 0 built from the script's first line (no added card);
- readable captions with nothing important behind them;
- every Qur'an verse the script mentions shown complete in Arabic from its line to the end of its explanation, checked as *Qur'an verses on screen* says;
- key subjects inside the safe area;
- variety from scene to scene;
- the agreed plan is in the reel: every move, every sound and every answer the user gave;
- ten frames across every scene change, plus the join check at both ends; for an end screen, hold 0, the default and a long hold;
- no camera move revealing a background edge;
- no elements that came from a style sample rather than the script;
- American realism: one room and one window light throughout (plus a lamp at night), the room colour matches the main element (not the mood), objects have cast shadows and no outlines, nothing pops in with a bounce, captions legible over the light patches.

Do not claim that recording, MP4 export or audio export works unless you actually observed it. If the chat preview restricts playback or recording, say so and direct the user to the downloaded file. If no browser is available, say that the frames were not seen and that only the code was checked.

### 8. Deliver
See *Delivery*. Mention any timing you estimated.

## Image-assisted mode

Only when the user says "with images" (see *Choose the mode*). Read `images.md` from the engine page at the start: asset labels and checklist, choosing the minimum useful images, minimalistic background plates, inspect then plan, the one copyable image brief (it leads each stage's reply once the plan is agreed), the character kit and frame references, inspecting returned artwork, character performance, and the asset loading code. The scene-change and sound plan still comes first.

## Scene changes: an element takes us into the next scene

This is the default for every reel: **no cuts, no wipes, no fades, no flashes, no dips to a colour.** Every scene change is an **action of an element that belongs to the scene we are leaving**: it rises, flies, falls, opens, unfolds, pours, grows or changes shape, and the camera goes with it into the next scene. Use cuts or overlay transitions only when the user asks for cuts.

What it is not:
- **Not one long walk or travelling shot.** A character walking from place to place does not link the scenes (walking inside one scene is fine).
- **Not the same move repeated.** Zooming into an object until it fills the screen, at every change, is a transition effect in disguise: nothing takes us anywhere, the camera just falls into things. Each kind of move is used once.

**The catalogue.** Choose by meaning, and use each kind once a reel.

| Move | What the element does | Fits lines about | Build |
|---|---|---|---|
| Rise | floats up (steam, smoke, symbols, a voice, a balloon); the camera tilts up with it into the next picture | thoughts, hopes, what comes out of something | `travel` with `dy < 0` |
| Follow | flies, rolls or is carried sideways; the camera tracks it across one continuous world; it lands as part of the next scene | the same thing reaching someone else, a message, a journey | `travel` with `dx`; the move draws the element |
| Fall | drops; the camera follows it down to where it lands (a seed into soil, a coin into a jar, a bag onto a floor) | consequences, arriving, settling | `travel` with `dy > 0` |
| Morph | its outline becomes another object with a similar silhouette (a bubble becomes a hood, the sun becomes a lamp, a drop becomes a seed) | one thing turning out to be another | `morphPts` with a push toward it |
| Pull back | the scene we were in shrinks into a frame inside the next one (a window, a screen, a picture, a mirror) | context, framing, "you", memory | `portal(1 - p, …, { open: true })` |
| Go in | the camera goes through an opening the story enters (a door, a tunnel, a screen someone is drawn into) | entering, being drawn in | `portal(p, …, { open: false })`; at most once a reel |
| New state | the place stays and an element changes it (a window bursts open and things pour in, a lamp switches on, rain stops, a warm light spreads) | change, invasion, relief | one scene spanning those lines |
| Rise out | the camera rises with an element and pulls back to a wider place (the house becomes small at the start of a path) | the bigger picture, the way ahead | `portal` out through a window of the wider scene, or `travel` with scale |
| Along | the camera follows something along a line (a path, a wire, a river, a thread, a road) to where it leads | guidance, connection, cause and effect | `travel` along the line |
| Fold or unfold | paper becomes something (a page folds into a paper plane, a letter unfolds into a map) | messages, plans, learning | panels turning with `cos`; it covers the frame, so at most once |
| Pour or grow | water, sand, light, roots or vines flow or grow from one scene into the next | growth, spreading, time | the flow drawn by the move over a shared world |

**Rules**
- **Different every time.** Never the same kind of move at two neighbouring changes; neighbouring changes also differ in direction (up, sideways, in, out, down) and scale (close or wide). A kind may come back once only when the script has more changes than fitting kinds, and "go in" never comes back.
- **One world.** One or two objects that come back (a window, a phone, a lamp, a path) and a light arc tie the reel together. A bookend, where the reel ends on what it started with but changed, is strong.
- **Timing.** A move starts `D` = 0.5 to 0.8 s before the next line and ends 0.1 s after it starts, so the new picture is there when its words begin. Moves are soft (eased in and out) and the camera is calm while words are spoken. Lines under about 1.2 s can't carry a move, so they stay inside one scene. The scene before a move must leave time to read its picture: pull its beats earlier if needed.
- **Established elements.** The moving element is on screen at least 0.4 s before it moves, about 90 px across or more, and stays out of the caption band (y ≈ 300 to 650).
- **Switch point.** Every move names the frame where the two scenes look identical (see the doubt list in *Plan first*). Light may change on the way only when something in the story changes it (a lamp switches off, the sun rises); never cross-fade one picture into another.
- **Continuity.** A character can't be in two places: show the scene we leave from their point of view, or let them leave the frame before the move. When the background changes behind a moving element, both scenes paint it from one shared world function, so there is no seam.
- **Meaning.** The action says what the next line says and contradicts no line.
- **Respect.** Sacred objects (the Quran, a mushaf, a prayer mat) are never the moving element: never folded, thrown, dropped, covered or flown. Take the moving element from something else (a notebook, a page of a workbook) and keep the sacred object still, in a place of honour.

**How to build it.** Every scene stays a function of its own time and every SCRIPT line gets `scene: 'reel'`. One compositor scene draws either a scene or the move between two scenes. A move is a small function `draw(p, m)`: `p` goes from 0 to 1, and `m` holds `tA` and `tB`, `A(o)` (draws the scene we leave, at its time) and `B(o)` (draws the next scene, held at its time 0 until its line starts). Scenes accept options from the moves: `bare` (skip your own background, because the move paints the shared world), `moving` (leave out the moving element, because the move draws it), and any of your own (for example `noView`). At `p = 0` a move must draw exactly what the scene we leave draws alone, and at `p = 1` exactly what the next scene draws alone. Frames and `over()` drawings are in the outer scene's screen coordinates, so apply its camera (`onScreenFrame`, `camPush`), and anything of the outer scene that sits in front of the frame goes in `over()`. Work in script time (`s.T / TL.k`) so Stretch mode keeps working. Don't shadow the globals `W` and `H`, and don't name a helper `sceneAt` or `drawPath` (the engine already has both).

The helpers are `scene-changes.js` on the engine page: splice it in below `SCENES` with code, never retype it. They were tested: the joins at both ends of every move are invisible (a mean pixel difference under 0.5 on a 0 to 255 scale). The `MOVES` and scene lines in it are examples; the names in them (`skyStrip`, `chatBubble`, `WIN`, `windowBars`, `DOOR`, `towerBg`) stand for your own reel's drawing.

**Fold and unfold** are not in the helpers: draw the paper as panels that turn on their hinges (each panel `|cos(angle)|` of its width, darker while edge-on), with the next scene clipped to the opened area. **New state** needs no helper: it is one scene spanning several lines, with its beats timed inside it.

**Check it.** Render ten frames across every move and look at them: the element is readable before it moves, nothing pops in or out, nothing moving crosses the captions, and the new scene is in place when its line starts. Compare the frame just before a move starts with its first frame, and its last frame with the next scene alone just after it. The only differences should be things that are moving anyway (if you can measure, a mean pixel difference well under 1 on a 0 to 255 scale).

**Sound.** Each move is heard as its element (see *Sound*). Start its sound with the move (a cue on the line before, or a negative `at` on the next line) and let the next place's background sound arrive during the move.

**Performance.** During a move two scenes are drawn. `portal` stops drawing the old scene once the frame covers the screen, and `travel` skips a scene that is off screen, so keep each scene's own drawing light.

## End screen with an adjustable hold

When the script ends on a call to action (send a message, follow, link in bio, book a call), build the last scene as an **end screen** and give the page an **End screen hold (s)** control, so the user decides how long the audience stays on it. The reel's total length is `script end + hold`. Changing the hold updates the Total length field, typing a length there changes the hold, and the reset button restores `REEL.ctaHold` (default 2.0; say that you chose it and that 0 gives the script's exact length). In Stretch mode the hold is added after the stretched script. The move into the end screen is chosen like any other (see *Scene changes*); bringing back an object from the opening makes a strong bookend.

The end screen has three parts, driven by its own duration `D = s.d` (the last line's length plus the hold):
1. **Intro:** the CTA element arrives (about 0.9 s).
2. **Idle loop:** a seamless, periodic animation of the CTA element (a phone floating, a button breathing, a ring pulsing, a typing indicator) that fills whatever time the hold adds. A longer hold just repeats it more times.
3. **End animation** (a fixed length `CTA_END`, about 1.3 s): the final action (tap send and the paper plane flies off; the button presses; the link opens), timed so it finishes with the last frame whatever the hold.

```js
const CTA_LOOP = 1.6, CTA_END = 1.29;
// inside SCENES.cta(s):
const t = s.t, D = Math.max(s.d, CTA_END + 0.9), tapAt = D - CTA_END;                       // the end animation always finishes with the reel
const ia = tw(t, 0.8, 0.45, Ease.inOutQuad) * (1 - tw(t, tapAt - 0.3, 0.3, Ease.inOutQuad)); // idle strength: in after the intro, out before the tap
const ph = (((t - tapAt) / CTA_LOOP) % 1 + 1) % 1, A = ph * TAU;                            // loop phase, exactly 0 at the tap
// idle: float = 12 * Math.sin(A) * ia;  breathe = 1 + 0.07 * ia * (0.5 + 0.5 * Math.sin(2 * A - Math.PI / 2));  ring = (ph * 2) % 1;  dots: Math.sin(2 * A - i * 1.1)
// end animation: const tt = t - tapAt;  press at tt 0.05 to 0.25, ripple 0 to 0.5, plane from tt 0.2 to 1.2 (all offsets from tapAt, never from 0)
```

Rules for the loop:
- Anchor the phase at the end animation (above), so the cycle finishes exactly where the end animation starts. Drive the CTA element's idle only with `sin(k·A)` and `cos(k·A)` for whole `k`; no `t * speed` drift on the CTA element (soft background drift is fine).
- Multiply every idle motion by `ia`, so it eases in after the intro and eases out into the tap with no jump. With hold 0 there is no idle and the scene equals the plain script-length version.
- Keep the idle slow and small (a float of about 12 px, a 7% breath); this is the screen the audience reads. Keep the CTA caption on screen for the whole hold, to the last frame (`hold: true`, below).
- Sound: `toEnd: true` on beds that should last to the end (they lengthen with the hold) and `fromEnd: s` on accents of the end animation (the tap at `fromEnd: CTA_END`), so they stay on their frames whatever the hold.
- Test hold 0, the default and a long hold (8 s): the idle repeats with no seam, the end animation lands on the last frames, and the recorded file's length equals the total.

**Engine changes:** the bundled template may not have the hold yet; make the changes in `engine.md` (*Engine changes for the end-screen hold*), keeping recording, captions and timing working.
Mark the last SCRIPT line `hold: true`; its `end` is where the words stop, and the scene and caption stay until the end of the reel.

## Qur'an verses on screen

Whenever the script mentions a verse of the Qur'an (quoted in English, paraphrased, introduced as "Allah says…", or named by surah and number such as "Surah Al-Asr" or "2:286"), show the **complete verse in Arabic** on screen from the line that mentions it until the last line that explains it, **together with the usual English captions**. This holds even when the script has no Arabic in it.

- **Which verse:** find the surah and verse number. If the script doesn't give them, identify the verse from its wording; if more than one verse fits or you aren't sure, ask in the plan. If the script quotes only part of a verse, still show the whole verse. A whole short surah or a range of verses: every verse in full, together if they fit, otherwise one after another as the explanation reaches each.
- **Exact text, never from memory:** copy the Arabic exactly, every letter and mark, from a reliable digital Qur'an text (the Uthmani script of Tanzil or Quran.com). Never type, retype or reconstruct it from memory, and never translate it back from English. Fetch it with code where you can (a published Qur'an-text package or data file from npm, pip or GitHub) and paste it into the reel with code. A WebFetch result passes through another model: if you use one, ask for the verse verbatim and check it against a second source. If you can't get an exact copy, ask the user in the plan to paste the verse from Quran.com, and use what they paste.
- **In the plan:** one line per verse: its reference, its Arabic text (so the user can check it), the line where it appears and the line where its explanation ends. If it's unclear where the explanation ends, take the last line before the script moves to another point or to the CTA, and say so.
- **The look:** a still panel in screen space, centred near the top of the upper safe area (from y ≈ 290), never inside the picture, never on a mushaf or any other prop, never in an image. Arabic in **Amiri Quran** (Google Fonts), right to left, about 64 px, wrapped only at whole words and shrunk to fit (no smaller than about 34 px), with a tall line height so the marks never touch; the captions' colour with their halo, shadow or pill; under it the reference in small caption type ("Al-Baqarah 2:255"). No emphasis colour, no word-by-word or letter animation, no bounce, scale, blur or distortion: it fades in over about 0.4 s as its line starts (fully shown at once if that is frame 0), stays perfectly still, and fades out over the last 0.4 s of the explanation.
- **Layout while it shows:** the English captions carry on line by line in the user's exact words (the verse never replaces or repeats them), moved down to sit just under the panel. Key subjects go below the captions and above y 1250; nothing moving passes over the panel and no particles cross it. A very long verse may fill most of the upper frame: then the picture behind it stays a calm backdrop, and you say so in the plan.
- **Check:** frames at the start, middle and end of every verse: letters joined in their right shapes (not separated, reversed or boxes), marks intact, nothing cut off, the reference correct, captions readable under it.

**How to build it.** Add `Amiri+Quran` to the Google Fonts `<link>` (`family=Amiri+Quran`) and `'64px "Amiri Quran"'` to `REEL.extraFonts`. Put this below `SCENES` with the verses filled in, and in `renderFrame` add `if (typeof drawVerse === 'function') drawVerse(T);` just before `if (CAPTIONS.show) drawCaption(T);`. It draws in screen space after the scene and transitions, and moves the captions under the panel while a verse shows. With a pill style (`CAPTIONS.box`), paint a matching soft panel behind the verse instead of the halo.
```js
const VERSES = [ { from: 4.2, to: 15.8, ref: 'Al-Asr 103:2', ar: '…' } ];   // from: the line that mentions it starts; to: its explanation's last line ends (script seconds); ar: pasted with code from the source, never typed
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
```

## Compose for the vertical frame

- Captions stay in the **upper safe area** unless the user asks for another placement. Draw text in code so it stays editable and sharp; avoid duplicate captions and text baked into images.
- Use a **configurable** safe-area layout (`SAFE`, `CAPTIONS.y`) instead of assuming platform overlays are permanently fixed. Keep faces, gestures and key graphics clear of captions and platform controls.
- In image-assisted mode, background plates stay minimalistic (see *Minimalistic backgrounds* in `images.md`): an open, empty centre and ground for the subject, scenery only at the edges and horizon, and a calm upper third for captions.
- Account for the full camera pan/zoom range when sizing backgrounds. Extend the drawable and clipping bounds so camera moves never reveal gaps: a plate must cover `W·(1 + maxZoom) + 2·maxPan` by the matching height.
- For seated characters, place furniture behind the hips and keep feet planted. Keep furniture independently adjustable.
- Use readable holds and purposeful movement. Avoid constant whole-character bouncing, foot sliding, unnecessary particle effects and automatic camera motion.

## Delivery

Send `out.mp4` (rendered with `node tools/render.js`) and the built `index.html` (preview, hold changes, in-browser recording, and the reel's source) to the user as files, as `CLAUDE.md` says. Don't commit the reel, don't publish it as an artifact and don't paste the code into the chat.

**Assets** (image-assisted mode): embed them or ship a labelled asset picker as `images.md` says (*Assets in the delivered page*). Never write or invent base64, asset URLs or attachment paths, and disable Record & Download while a required asset is missing.

**Recording and export:** real time with the tab visible, canvas and audio in one file, MP4 or WebM chosen by detection and shown on the page, never renamed (details in `engine.md`). Don't claim export works without evidence.

**Disclose runtime dependencies.** A file using the p5.js CDN, Google Fonts or a styling CDN is not fully offline. Say which ones, and that the first open needs a connection.

**Tell the user how to use it:** download the HTML (don't rely on the chat preview), open it in Chrome, Edge or Safari, (select assets if the picker is used), preview, press Record & Download with the tab visible. If the chat preview restricts playback or recording, say the preview hasn't verified export. If the user's voiceover is not embedded, they add it in their editor from 0:00.

## Revisions and reuse

- Change timing, captions, camera motion and procedural effects **in code** whenever possible. Request new artwork only when the visible image content must change.
- Preserve useful images, manual cleanup and prior versions. Mark replaced assets *superseded* in the checklist; don't delete them from it. Keep asset labels stable.
- For another chat or a future episode, give a short **handoff note**:
  - character and style description (palette hex values, line weight, lighting direction);
  - required reference and asset labels;
  - **which actual files the user needs to reattach**;
  - relevant timing or registration details (pivots, scales, face-layer offsets, safe-area settings);
  - outstanding limitations (unverified transparency, estimated timings, missing cues).
- Don't promise that attachments or approved references stay accessible across chats.

## Best practices

These are defaults with reasons, not a cage. Break any of them when the idea is better, and when the user's instructions differ.

### Hook and retention
- **Frame 0 is the cover and the first impression.** Make it a complete, striking composition from the script's own first line, with its caption visible: no fade from black, no empty frame. Don't add an opening card or extra hook to a supplied script.
- Aim for motion within 0.5 s and a change of picture every few seconds (a new scene, a reveal, a scale jump or a camera move), but hold shots when the content needs reading. One idea per scene; hold key reveals at least 0.6 s.
- Escalate: later beats should be bigger, bolder or more surprising than earlier ones.
- End on a payoff: a loop-friendly frame that flows back into frame 0, or a CTA placed mid-frame, never at the bottom. A CTA gets an end screen whose hold the user can set (see *End screen with an adjustable hold*).

### Visualise the meaning, not the words
- Turn abstractions into objects and actions: literalised idioms, exaggerated scale, cause → effect, before/after.
- Numbers become counters, bars, piles or fills. Lists become staggered reveals, contrasts split screens, processes step-by-step builds, questions mystery reveals.
- One strong image per line beats five small icons. Keep extra on-canvas text sparse and big, and never repeat the caption.

### Variety within one style
- **Keep consistent:** palette, line weight, texture, type, shading approach, design language of recurring objects.
- **Vary:** composition, background colour drawn from the palette, scale, motion type, camera move and the move between scenes.
- No two neighbouring scenes should share layout + background + motion, and no two scene changes use the same move (see *Scene changes*). Hard cuts only when the user asks for cuts.

### Motion craft
- Ease everything: `outBack` for pops, `outCubic` for arrivals, `inCubic` for exits; `outElastic`/`outBounce` rarely.
- Anticipation, overshoot, follow-through; stagger groups by 60–120 ms.
- Keep frames alive with secondary motion (bob, drift, rotate, boil) so nothing freezes, but don't bounce a whole character constantly.
- Hand-made feel comes from `boilT`/`wob` at 8–12 steps per second; smooth motion suits clean graphic styles.
- Big moments get a camera punch (scale bump plus `shake` on the cue).

### Captions
- Line by line in the upper safe area (`CAPTIONS.y`, default 0.25 of height; keep it between about 0.17 and 0.40, never at the bottom where the Reels UI covers it).
- Keep the caption band (about y 300–650) calm. Ensure contrast with a pill (`box`) or an `outline` matched to the look.
- When the script mentions a Qur'an verse, the complete Arabic verse shows above the captions until its explanation ends (see *Qur'an verses on screen*).

### Safe zones (1080×1920)
- Text and logos stay out of the top 270 px, the bottom 670 px (y > 1250) and 65 px at each side. The like/comment/share column sits on the right from about y 1000.
- Key subjects go between y ≈ 700 and 1250. Backgrounds and decorative motion can bleed everywhere.
- Offer a **Reels UI guides** toggle in the page; the guides are HTML, so they are never recorded.

### Sound: a diverse score that matches the picture (no music)
Every reel gets its own sound, taken from what is on screen and what happens in it, and it is **diverse**: different sounds for different things inside a reel, and a different mix from one reel to the next. Anything that fits the picture belongs in it: nature (wind, rain, water, leaves, fire, birds, crickets), objects and materials (paper, cloth, wood, glass, metal, coins, a door, a pen), screens and machines (a click, a ping, a phone buzzing, a clock ticking, a hum, a glitch), people and places (footsteps, a heartbeat, a crowd, a city), and motion (a whoosh, a riser, an impact, a sparkle). The one thing left out is music: no melody or instrument track.

**If you can't make the exact sound, make the closest one and add it.** A sound that roughly matches what we see is better than silence, so never leave a sound out or ask about it because the library can't reproduce it exactly. Take the nearest library sound and shape it (`pitch`, `dur`, `vol`, `pan`), layer two (`knock` and `thump` for a heavy door), or write a new one from the same helpers (`osc`, `nz`, `filt`, `envGain`, `bellEnv`, `lfo`, `grains`, `bus`, `send`) right after the library block: `SFX.name = (ac, out, t, o) => { … }`. Say in one line of the plan which sounds are approximations.

**Plan the sound with the picture.** It is part of the plan you share with the user (see *Plan first*):
- **Relevant to the visual:** every sound belongs to something on screen, the place we are in, or a move we see. When the picture changes, the sound changes with it.
- **The background sound is the place.** Each place has a bed (a bedroom at night: rain on the window or crickets; a schoolyard: a crowd and leaves; a street: the city; a kitchen: a hum and a sizzle; a quiet room: `room`). When the place changes, the bed changes during the move, so the sound travels with the camera. Indoors or behind glass, the outside is muffled (`lp`); opening a window lets it back in.
- **What moves or happens makes its sound:** paper creases and flutters, a thrown bag whooshes and thumps, a door knocks, a light switches on with a click, a phone buzzes and pings, a clock ticks, coins clink, tea pours, an idea sparkles, a reveal rises and lands with an impact or a chime.
- **Diverse:** vary the type, pitch and pan of the sounds across the reel; don't build every reel from the same few; change which sounds carry the beats from reel to reel.
- **Stay under the voice.** The voiceover runs through nearly the whole reel, so effects sit below it (about 12 to 15 dB) and the words stay clear.

**Pick the sound world from the script**, never from the last reel. Examples:
- Night, secrets, screens, loneliness: `rain` on a window, `crickets`, a low `wind`, a phone `buzz`, a `ping`, a `heartbeat`, far `thunder`.
- Morning, hope, family, guidance: `birds`, a warm `breeze`, `leaves`, a `stream`, tea that `pour`s, a cup's `clink`, `step` on earth.
- Water, life, cleansing, rivers or sea: `stream`, `waves`, `drips`, `splash`, `drop`.
- Forest, growth, knowledge, trees: `leaves`, `bird`, `rustle`, `twig`, a light `wind`, `step` on earth.
- Desert, journey, history, patience: a thin `wind` (`pitch: 1.3`), `step` on `sand`, a far `thunder` or `boom`, long near-silence.
- Mountains, cold, focus: a high, thin `wind` (`pitch: 1.5`), `step` on `snow` or `stone`, `pebble`.
- Home, warmth, evening, stories: `room`, `fire`, `hum`, `sizzle`, `knock`, `wood`, `paper`, `cloth`, a `ticking` clock.
- School, study, work: `crowd`, `bell`, `scribble`, `paper`, `typing`, `click`, `tick`.
- City, money, time pressure: `city`, `coin`, `ticking`, a `whoosh` of things rushing past, an `impact` on the turning point.
- Ideas, discovery, reveals: a `riser` into an `impact` or a `chime`, `sparkle`, `shimmer`, `pop`.
- Rain, mercy, sadness, change: `rain`, `drips`, far `thunder`, clearing to `birds` and a `breeze`.

Mix two or three worlds when the story moves (night to morning, storm to calm), and let the beds follow the places.

**Build the score in three layers**
1. **Beds:** one per place (`wind`, `rain`, `stream`, `waves`, `fire`, `leaves`, `room`, `birds`, `crickets`, `crowd`, `city`, `hum`), with `dur`, `fadeIn` and `fadeOut`, cross-fading during the moves; `lp` to muffle or open; `toEnd` on the last one.
2. **Moves:** the element's own sound, starting with the move: `whoosh` (`down` for a fall), `gust`, `breeze` or `swell` for air, light and voices; a `riser` into a reveal; `cloth` and `flap` for fabric; `crease`, `flutter` and `paper` for paper; `wood` or `knock` for doors and windows; `thump`, `impact` or `step` for a landing.
3. **Touches** for whatever happens inside a scene, from the whole library or your own, varied in type and pitch, with `pan` toward where it is on screen.

When characters walk, add `step` cues found from the walk cycle itself, so each foot lands on its frame: a foot lands when `cos(phase + offset)` falls through zero (for a rig where the leg phase is `x / (scale * 31)`, at phase = PI/2 + k*PI). Pick `surface` from the ground (`grass`, `earth`, `gravel`, `sand`, `wood`, `stone`, `snow`), `pan` from the walker's screen x and `vol` from the walking speed. The reel script runs before the engine script, so generate these with plain maths only (p5 helpers such as `clamp01` are not defined yet).

**Mix**
- **Levels:** the library is calibrated so that at `vol: 1` beds sit near -34 dB RMS (`room` near -40) and touches peak near -16 dBFS. Use `vol` 0.3 to 1. Aim for a mix that peaks around -9 dBFS, so a voiceover sits clearly on top.
- **Variety:** a sound used many times changes a little each time (`pitch`, `seed`, `pan`).
- **Mood:** tension builds (low wind, a heartbeat, a riser, far thunder); relief opens up (rain clearing to birds and a breeze, a chime).

**Check the audio.** You can't hear it, so measure it and say so. Render `TL.cues` in an `OfflineAudioContext` through the same compressor (`SFX[c.type](off, session, c.time, c)`) and confirm: no errors, no clipping (a peak under about -6 dBFS), no silent hole you didn't plan, and nothing so loud it would cover the voice (no half-second window above about -18 dBFS RMS). Use `--record` in `check_reel.py` to confirm that the exported file has an audio stream. Never claim it sounds good: report what you measured and that you haven't listened.

- **Built in:** beds `wind`, `rain`, `stream`, `waves`, `fire`, `leaves`, `room`, `birds`, `crickets`, `crowd`, `city`, `hum`; air `gust` (`down`), `breeze`, `swell`, `whoosh` (`down`), `riser`; ground and weight `rustle` (`density`), `step` (`surface`), `thump`, `impact`, `boom`; water `drop`, `drips` (`rate`), `splash`, `pour`; sky `thunder`; cloth and paper `cloth`, `flap`, `crease`, `flutter`, `paper`, `scribble`; objects `pebble`, `wood`, `twig`, `knock` (`n`), `clink`, `coin`, `pop`, `sizzle`; screens and machines `click`, `shutter`, `type`, `typing` (`rate`), `tick`, `ticking` (`rate`), `ding`, `bell`, `ping`, `chime`, `buzz` (`n`), `glitch`, `sparkle`, `shimmer`; living things `heartbeat` (`rate`), `bird` (`n`).
- **Cue options:** `vol`, `pitch`, `dur`, `pan` (-1 to 1), `seed`; beds also `fadeIn`, `fadeOut`, `to` (end volume, a slow drift) and `lp` (keyframes `[[seconds into the cue, Hz], …]`: `[[1.6, 9000], [2.2, 700]]` muffles the bed as it goes behind glass, `[[0.2, 700], [0.8, 9000]]` opens it); `down` (gust, whoosh), `surface` (step), `density` (rustle), `rate` (drips, typing, ticking, heartbeat, sparkle), `n` (buzz, knock, bird), `shake` (camera shake, any cue). `at` may be negative, so a move's sound starts before its line. Engine options for the end screen: `toEnd: true` (the cue lasts until the reel ends, whatever the hold) and `fromEnd: s` (the cue starts `s` seconds before the end, in place of `at`).
- **Sync to the picture:** the camera follows a flying element: `whoosh`, `breeze` or `gust`, panned with it; something rises or a voice spreads: `swell` or `riser`; a door, a window, a latch: `wood` or `knock`; a bag or a curtain: `cloth`, `flap`; a page folds or flies: `crease`, `flutter`; writing: `scribble`; a landing: `thump`, `impact` or `step` on the floor's surface; a screen: `click`, `ping`, `buzz`, `glitch`; time passing: `ticking`; something appears: `pop` or `sparkle`; going indoors or behind glass: `lp` on the outside bed; relief before the key line: the bed falls to `room`, then a soft `swell` or `chime`.
- **No music.** If the user attaches their own sound files (effects or recordings), use them alongside the synthesized sounds: load them like the voiceover and play them through the same `AudioContext` and timeline.
- **Use the SFX library:** `sound-library.js` on the engine page. In the bundled template, replace everything from the `/** SFX library` comment down to the end of the legacy-name `Object.assign(SFX, { … });` block (just before `const warned = new Set();`) with that file, spliced in with code. That includes the template's own `VERB` and `send`, which the new code redefines. The helpers `envGain`, `osc`, `filt` and `rng` already exist there, and the new code makes its own noise buffers. If you write the page yourself, include those helpers and the file. Then, in `play()`, directly after the line that sets `nextCue`, add this line so that beds keep playing after a seek: `if (AUDIO.session) for (const c of TL.cues) { const b = bedCatchUp(c, clock.t0); if (b) playSfx(b, audioBase); }`
- **Your own sounds** go right after the block: `SFX.name = (ac, out, t, o) => { … }`, plus `BEDS.add('name')` for a background sound that should carry on after a seek.
- The old cue names `swoosh`, `swish`, `bigwhoosh`, `reverse`, `rise`, `fall`, `thud`, `hit`, `stamp`, `snap`, `scratch`, `ticks`, `success` and `vibrate` are aliases of the sounds above.

## Content rules

These carry over from the user's visual-hook brief and apply to every frame, every character, every image prompt and every style-sheet prompt.

- **Nothing indecent:** no nudity, revealing clothing, suggestive poses, romance, gore, drugs, alcohol or gambling.
- **No girls or women except in hijab,** anywhere, including backgrounds, crowds, silhouettes or characters styled as female. Prefer objects, symbols, animals, machines, environments and hands. If a person is truly needed, use a single, simple figure: a man, or a woman or girl in hijab when the story or the audience calls for one (see *Who is "you" on screen* in *Plan first*).
- **Cultural respect:** no pigs or piggy banks (use a jar, vault, wallet or chest). Never use religious symbols or sacred imagery as a gag.
- **Sacred objects** (the Quran, a mushaf, a prayer mat) are shown still and in a place of honour, with no readable text: never folded, thrown, dropped, stepped over, covered, or used as the moving element of a scene change. Qur'anic text appears only in the verse panel (see *Qur'an verses on screen*).
- **Prophets are never depicted** in any form: no face, figure, silhouette, hands or glow standing in for them, in drawings or in image prompts. Tell their stories through the objects, places and outcomes involved. Show companions and other revered figures without faces: from behind, at a distance, or as hands only.
- No brand logos, copyrighted characters or real people.
- If the user's own supplied artwork conflicts with these rules, say so plainly and ask how to proceed rather than silently using or altering it.

## Example invocation: default style (American realism)

> /reel-creator 13 seconds, 4 scenes, voiceover to follow. 0:00–0:03 Your second cup isn't helping. 0:03–0:06.5 Caffeine stays in your body for 6 hours. …

Expected behaviour: no style was named, so American realism is used in drawn mode. One line says which: "Room: Sage (element: coffee; candidates: brick, sage, ochre)". Every scene is a quiet still-life of the script's own objects (cups, beans, a wall clock, a lamp, a glass) on a counter in that room, lit by one window whose light moves with the hours, with cast shadows, a painted-canvas texture and a full-screen button on the page. A different script (a phone, a plant, a coin) gets a different room, chosen from its own element. The first reply is the plan (scene changes and sounds, each with its doubts and fixes, and a few questions); the reel is built after the user agrees.

## Example invocation: the plan comes first

> /reel-creator 0:00–0:02.75 Someone is teaching your child about life right now. 0:02.75–0:03.65 Who to trust. … 0:23.85–0:26.04 Send message for more details!

Expected behaviour: no code yet. The reply is the plan: the thread (a window and a phone that come back, night blue to dawn gold), then every scene change with its move, a real doubt and its fix, and its sound, then the sound rules, the weak spots and a few questions. One move from such a plan:

> **0:08.90, into "…whether they're also hearing it from you."** Move: the camera pulls back and the school shrinks into a window at home, where the mother (in hijab) and the child sit together. Doubt → fix: the child can't be at school and at home at once, so the school shot is the child's point of view (the friend talks to us). Sound: the schoolyard air is muffled as it goes behind the glass (`lp`), and a quiet `room` takes over.

The three short lines (0.8 to 0.9 s each) share one scene, because they are too short to carry a move. Once the user answers, the reel is built as agreed.