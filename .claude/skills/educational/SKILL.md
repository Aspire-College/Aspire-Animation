---
name: educational
description: "Aspire series template (engine: p5, extends reel-creator). Kinetic-typography educational reels: the script's own words are the picture, landing word by word with a series palette, simple drawn diagrams and no caption block. Use when the user asks for an educational, explainer, tips, study, how-to or kinetic-typography reel, or says 'educational' / 'kinetic type'."
---

# Educational reel: kinetic typography

**Extends `reel-creator`.** Read `.claude/skills/reel-creator/SKILL.md` first and follow all of it (plan first, no cuts, scene changes, sound, Qur'an verses, safe zones, content rules, delivery). This file only lists what the educational series changes. Where they differ, this file wins; the user's explicit instructions win over both.

## What every reel in this series is

- **The words are the picture.** Every word of the script appears on screen, in order, exactly as written, as big kinetic type. It replaces the caption block (`CAPTIONS.show = false`), so the words are never shown twice.
- **One idea per reel, 15 to 45 s.** A claim or question as the hook, two to four points, a recap that brings back the key words, a CTA end screen with the adjustable hold.
- **A drawn anchor in every scene.** Beside the words, one simple graphic drawn in code that *shows* the idea: a counter, a bar, a calendar row, a timeline, an arrow, a split screen, a checklist, a before/after. It is on screen at the scene's first frame, so the move into the scene lands on it (words alone arrive with the voice, so a scene of words only is an empty frame while the move happens).
- **Not American realism.** The series look replaces the parent's default style (below). A named style ("grain style", "sun-print") or "with images" from the user still overrides it.

## The series look

| Token | Default | Use |
|---|---|---|
| Ground | `#F4EFE6` paper | every scene; one ground for the whole reel, so travels have no seam |
| Ink | `#14171F` | words |
| Accent | `#FF5A36` | *emphasis* words, the one highlighted thing in the anchor |
| Second | `#2E5BFF` | arrows, paths, a second series in a chart |
| Soft | `#FFD23F` | marker sweeps behind words |
| Display font | Archivo Black (`// @fonts Archivo+Black`) | all words; numbers too |

Change the tokens in `KIN` (the kit) only when the user gives brand colours or a font; then record them in this file (see *Series log*) so every later reel uses them. Flat colour, no outlines, a light grain (`STYLE.grain` about 0.04), no gradients, no drop shadows.

## Build

- `reel.js` starts with `// @fonts Archivo+Black`, sets its own `STYLE` and `CAPTIONS` (with `show: false`), then `SCRIPT`, then `/*@@include kinetic-kit@@*/`, then `SCENES`, then `/*@@include scene-changes@@*/` with `SEG`, `MOVES`, `CAMS`. The reference reel is `.claude/skills/educational/example/` (`reel.js`, `script.md`): copy its shape, never its content. To see it, copy the folder into `reels/` and build it.
- The kit (`engines/p5/kinetic-kit.js`): `kinType(i, t, { in, em, y, out })` draws line `i` and returns a box per word (`word`, `x`, `y`, `w`, `h`), so the anchor can hang off a word (underline it, strike it, morph from it, fly it into the next scene). `kinUnder`, `kinStrike`, `kinMark`, `kinCount` are the small marks. The first line is the cover: its words are on screen at frame 0.
- Each scene draws its ground only when `!s.bare`, and leaves out an element only when *that move* carries it (the `moving` flag is set on both ends of a scene, so scope it: `s.moving && s.t > 1` means "on the way out").
- If a move is too short to carry a scene's words off screen, let them leave with `out: s.d - D` as the move starts.

## Kinetic rules

- **Readability first.** Body words 90 to 120 px, emphasis 1.35×, at most about 8 words on screen, a whole phrase readable for at least 0.6 s after its last word lands (the kit lands the last word by 70% of the line). Type stays inside x 65 to 1015 and y 300 to 1250.
- **Entrances by meaning, varied:** `slam` (a claim, a number), `rise` (hope, a step up), `slide` (sequence, next), `mask` (a reveal), `type` (a quote, a message). Never the same entrance in two neighbouring scenes.
- **Emphasis by meaning:** `color` (the default), `marker` (the thing to remember), `box` (a single command word), `underline` drawn on (a correction or a key term), a strike-through then the right word (a myth and its fix).
- **Numbers count up** (`kinCount`) only when the number is the picture and is *not* also in the words on screen; otherwise show the number as a quantity (bars, squares, a fill).
- **Typographic scene changes** (still the parent's catalogue, each once): *follow* (an emphasised word slides on and becomes part of the next scene), *rise* or *fall* (the paper scrolls with an anchor), *along* (an underline becomes a timeline or path), *morph* (a letter's shape becomes the next anchor: an O becomes a clock), *pull back* (the sentence shrinks into one card of a list), *go in* (through a letter's counter, at most once).

## Sound

Tactile and typographic, under the voice: `thump` or `impact` on slams (the emphasis word only), `click` and `pop` as anchors appear, `scribble` for underlines, `whoosh` for slides, `riser` into the key reveal, `tick` or `ticking` under counters, `chime` or `ding` on the payoff, a low `room` bed (or `hum` for screens and study). Vary pitch and pan; don't put a sound on every word.

## Plan additions

Add to the parent's plan, one line each: the hook line and its entrance; per scene its anchor graphic and entrance/emphasis choice; and which word carries each move. Keep the plan under about 700 words.

## Checks

The parent's checks, plus: frame 0 shows the whole first line; no frame inside a move is empty paper (render the move's frames with `node tools/render.js reels/<folder> --frames …`); no word or mark is left behind or pops out at the end of a move; every script word appears exactly once; nothing is repeated as both type and graphic.

## Series log

Lessons from reels in this series, newest first. Add one when a review teaches something every later reel should do (see `skill-workshop`).

- 2026-10-30 · demo · Words land with the voice, so a scene made only of words is empty while the move into it plays: every scene needs a drawn anchor from its first frame.
- 2026-10-30 · demo · Emphasis marks (box, marker) must leave with their word; the kit now fades and lifts them together.
