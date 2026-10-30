# Engines

The code every reel is built on. A reel folder only holds its own `reel.js` (and images); `node tools/build.js reels/<folder>` pastes it into its engine's template to make `index.html`, and tucks the reel's source into the page so `tools/unpack-reel.js` can restore it.

| Engine | Skill | What it draws | Build |
|---|---|---|---|
| `p5/` | `reel-creator` | 2D: every frame drawn with p5.js 1.11 | `p5/build.py` (includes, fonts, images) |
| `three/` | `reel-creator-3d` | 3D: clay dioramas in Three.js 0.170 | `three/build.py` (`--check` runs a code harness) |
| `hybrid/` | `reel-creator-2-5d` | 2.5D: p5.js-painted cards in a Three.js space | `hybrid/build.py` (`--check` runs a code harness) |

Every template has the same page around the picture: Play, Restart, **Full screen** (F, Esc; tap to play), scrubber and frame stepping, **📷 Screenshot** (S: copies a 1080×1920 PNG with the guides), Reels UI guides, End screen hold, SFX volume, **Record & Download** (real time; MP4 where the browser can, else WebM), captions line by line, and the export hook `tools/render.js` uses.

## shared/

Code that is the same in every engine, pasted into each `template.html` between `/*@@shared:NAME@@*/` and `/*@@end:NAME@@*/`:
- `sound-library.js`: about 70 synthesized sounds (beds, nature, objects, screens, people, motion), no music.
- `reel-export.js`: `window.__reel` for the headless renderer: exact frames at any time and the whole sound track rendered offline.

Edit the file in `shared/`, then run `python3 tools/sync-engines.py` (`--check` reports stale templates).

## p5/ in detail

- `template.html`: the page and engine. Already includes the end-screen hold, the `STYLE.post` hook, the Qur'an verse hook, bed catch-up after a seek, the full sound library with the old cue names, Full screen and Screenshot.
- Kits pasted into `reel.js` with `/*@@include NAME@@*/`: `realism-kit` (American realism: rooms, window light, shaded objects, canvas texture; defines `STYLE` and `CAPTIONS`), `scene-changes` (travel, portal, morph, the compositor; the reel declares `SEG`, `MOVES`, `CAMS`), `quran-verse` (the Arabic verse panel; the reel declares `VERSES`), `kinetic-kit` (kinetic typography for the educational series).
- Fonts: `// @fonts Family+Name:wght@700 Other+Family` in `reel.js` (default Poppins 800).
- Guides: `engine.md` (read before building), `styles.md` (Sun-print, Grain style, style variations), `images.md` (image-assisted mode), `style-recipes.md`.
- `demo/reel.js`: the template's original demo reel ("Two hours a day").
- `check_reel.py`: the claude.ai skill's checker (needs Python Playwright, which this repo doesn't use; `tools/render.js --frames auto` does the same job).

## Where they came from

Imported on 2026-10-30 from the user's claude.ai engine artifacts: *2D Reel Engine* (https://claude.ai/artifact/SPDyCDYJ4w9ghkn9mmuj8d) and the reel-creator skill's bundled files, *3D Reel Engine* (https://claude.ai/artifact/9nUis3pJLMKK3kZeZGRSZk), *2.5D Reel Engine* (https://claude.ai/artifact/1g9smPEh2j24CUuX6mwBXz). Repo changes are listed in `CHANGELOG.md`; `skill-workshop` (D) describes syncing in either direction.
