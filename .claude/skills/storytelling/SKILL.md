---
name: storytelling
description: "Aspire series template (engine: p5, extends reel-creator). Image-led story reels: the 'with images' flow is on by default, so generated artwork carries the characters and places while code carries motion, camera, captions and sound. Recurring characters stay consistent across the series. Use when the user asks for a story reel, a storytelling reel, a parable, a character story, an image-led reel, or says 'storytelling'."
---

# Storytelling reel: image-led

**Extends `reel-creator`.** Read `.claude/skills/reel-creator/SKILL.md` first and follow all of it, and read `engines/p5/images.md` (image-assisted mode) before the plan. This file only lists what the storytelling series changes. Where they differ, this file wins; the user's explicit instructions win over both.

## What every reel in this series is

- **Image-assisted mode is on by default.** The user doesn't need to say "with images": this series is built on generated artwork. Images carry what is hard to draw (characters, illustrated places, detailed props); code carries motion, camera, parallax, particles, masks, captions and sound. Drawn-only parts are fine where code does them well.
- **A story, not a list.** Read the user's script (never rewrite it) as a story and plan the picture along this spine: *hook* (we open in the middle of a moment) → *want* (who, and what they want) → *obstacle* → *turn* (the line where the mood changes) → *payoff* (what changes, the lesson) → *CTA*. Mark which line is which in the plan.
- **Few, reusable images.** Choose the minimum (see *Choose the minimum useful images* in `images.md`): usually two or three background plates, one character kit, a few props. A plate serves several scenes through camera moves and light.
- **2.5D on request.** If the user says "2.5D story" or "with depth", build it with `reel-creator-2-5d` (engine hybrid) and its *With images* section instead, keeping everything else here.

## Workflow in the repo

1. **Plan** exactly as the parent says (scene changes, sound, questions), with the story spine above. Stop and wait.
2. **Image brief** once the plan is agreed (*Step B* in `images.md`): one copyable block with the style lock and one prompt per image, each with its label. Write it into the reel's `script.md` under a heading *Image brief* too.
3. **The user makes the images** in their image tool and gives them back: attached in the chat (they land on disk: copy them into the reel's `images/`). Images are never committed; they travel inside the built `index.html`. **The file name is the label** (`bg_market.png`, `cut_boy_walk.png`). Never invent images, base64 or URLs.
4. **Inspect** each image (Read it and look): style match, transparency, cropping, hands, faces, the content rules. Ask for a repair of anything unusable, naming the label and the fix.
5. **Build:** `node tools/build.js reels/<folder> --check` turns `images/` into `images.js` (`window.REEL_IMAGES`, one entry per label) and builds. In `reel.js`, load with the `ASSETS` / `loadAssets(window.REEL_IMAGES)` code from `images.md` and draw with `art()` and `plate()`. Recording stays disabled while a required image is missing.

## Recurring characters

A character who may come back in a later reel gets an entry in `characters.md` in this folder (create it with the first one): label, one-line description, palette hex values, outfit, proportions, pose list, and the path of its reference image in the reel where it was made. The next reel's image brief copies that description word for word and asks for the same reference, so the series looks like one world. Update the entry when the user approves a change.

## The look

No default style: take it from the user's words or reference, or offer the parent's style-variations round (`engines/p5/styles.md`) for the first reel of a new story world, then keep that look for the whole series and record it in *Series log*. Backgrounds stay minimalistic (an open centre for the subject, a calm upper third for captions). Captions as the parent describes, in a font that matches the art.

## Content rules for people

The parent's rules, and in image prompts also: faces are allowed only when the user asks for them; otherwise faceless or from behind (as in `ai-video`). Any woman or girl in hijab and a loose, opaque abaya or long dress. Prophets are never depicted in any form; companions and revered figures without faces.

## Checks

The parent's checks, plus: every image you used is one the user supplied under that label (no placeholder recorded); the character looks the same in every scene and matches `characters.md`; the camera never shows a plate's edge (size plates for the full move, as the parent says); the turn line gets the reel's biggest change of picture.

## Series log

Lessons from reels in this series, newest first (see `skill-workshop`).

- (none yet)
