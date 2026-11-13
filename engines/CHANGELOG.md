# Engines changelog

Newest first. One line per change: the engine, what changed, and why.

## 2026-11-13 — check harness reads the right script

- **three, hybrid:** `build.py --check` cut the page's module at the last `</script>`, which since the reel source was embedded is the `reel-source` block, so every check reported a false SYNTAX ERROR and skipped the frame-by-frame harness. It now cuts at the module's own `</script>`.

## 2026-10-31 — reels leave the repo

- **all:** `build.py` embeds the reel's `reel.js`, `script.md` and `reel.json` in `index.html` (`<script id="reel-source">`), so the delivered page is the reel's project file; `tools/unpack-reel.js` restores the folder, images included. Rebuilding an unpacked reel gives the identical page.

## 2026-10-30 — imported and set up for the repo

- **all:** the sound library moved to `shared/sound-library.js`, identical to the claude.ai engines; `tools/sync-engines.py` pastes it into every template.
- **all:** `shared/reel-export.js` and an `exposeReel(…)` call in every template, for `tools/render.js` (exact frames, offline sound, MP4).
- **three, hybrid:** `build.py` uses the engine's own `template.html` when the reel folder has none, so reels keep only `reel.js`.
- **p5:** `template.html` rebuilt from the reel-creator skill's bundled template with the changes the skill used to ask for on every reel: end-screen hold (engine.md), `STYLE.post` hook, `drawVerse` hook, `bedCatchUp` after a seek, the full sound library plus the old cue names, Full screen and Screenshot buttons, `REEL` defaults. The demo reel moved to `p5/demo/reel.js`; the page has `/*@@REEL@@*/`, `<!--@@FONTS@@-->` and `<!--@@IMAGES@@-->` placeholders filled by `p5/build.py`.
- **p5:** `scene-changes.js` keeps its tested helpers; its example `SEG`, `MOVES` and `CAMS` are now comments, so the kit can be included and the reel declares its own. `quran-verse.js` is the verse code from the skill, with `VERSES` declared by the reel.
- **p5:** new `kinetic-kit.js` for the educational series (tested with the reel now in `.claude/skills/educational/example/`).

## Known issues

- **p5 captions:** a word right after an emphasis (`*more*.`) is spaced as a separate word ("more ."). Put the punctuation inside the asterisks (`*more.*`) until the caption tokenizer is fixed.
- **p5:** Sun-print's `references/sunprint.md` and `assets/template_sunprint.html` were not part of the import; `styles.md` describes how to build it without them.
