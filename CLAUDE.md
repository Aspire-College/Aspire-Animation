# Aspire Animation: house rules

This repo makes Instagram Reels (9:16, 1080×1920) for Aspire College with code: every frame is drawn by a reel's own `index.html`, and `tools/render.js` turns it into `out.mp4`. These rules apply to every session.

## Map

```
CLAUDE.md                  these rules
.claude/skills/            the skills (registry.json = the family tree; README.md = conventions)
engines/                   p5/ three/ hybrid/ + shared/ (sound, export hook); README.md, CHANGELOG.md
reels/<date>-<topic>/      one working folder per reel (never committed): script.md, reel.json, images/, reel.js, index.html, out.mp4
tools/                     new-reel.js, build.js, render.js, unpack-reel.js, skills.js, sync-engines.py
```

## Which skill

Use the repo's skills (no prefix), never the `anthropic-skills:` versions of the same names: the repo copies are the ones that know this repo and get improved here.

| The user wants | Skill |
|---|---|
| A reel in an existing series | that series: `educational` (kinetic type), `storytelling` (image-led), `asmr-loop` (10 s loop), or one added later (`node tools/skills.js`) |
| A 2D reel, no series named | `reel-creator` (p5) |
| A 3D reel / 2.5D reel | `reel-creator-3d` (three) / `reel-creator-2-5d` (hybrid) |
| Hooks, AI video prompts, reel ideas | `ai-video` (no code) |
| "give prompt" / "prompt in parts" | the engine skill's prompt mode (no build) |
| A new kind of reel they'll repeat, or "save this as a template" | `new-series` |
| "From now on…", improve a skill, a variant of a skill, sync from claude.ai | `skill-workshop` |

If it's unclear which series a request belongs to, ask once, with your guess as the default.

## Making a reel

1. `node tools/new-reel.js "<topic>" --skill <skill>` and put the user's script in `script.md`, word for word.
2. **Plan first** (the skill says how) and wait for the user's OK. Paste the agreed plan into `script.md` and set `reel.json` status to `planned`.
3. Write `reel.js` only. Never retype engine code; never edit a reel's `index.html` by hand.
4. `node tools/build.js reels/<folder> --check`, then **look at** `.check/sheet.png` and the frames across every scene change (`node tools/render.js reels/<folder> --frames …`). Fix what you see before showing anything.
5. `node tools/render.js reels/<folder>` → `out.mp4`. Report what you looked at and the measured sound peak; never claim you heard it.
6. **Send the files to the user** with the file-sending tool: `out.mp4` (the video to post) and `index.html` (the project file: preview, change the hold, record in the browser, and it carries the reel's own source). Set status `rendered`. Tell them the length, what to check, and the open points. **Don't commit or push the reel.**
7. Review rounds in the same session: change `reel.js`, rebuild, re-render, send the new files, note the change under *Review notes*. A lesson that will matter again goes into the skill (`skill-workshop`), and *that* change is committed.
8. Revising an old reel in a new session: the user attaches its `index.html`; `node tools/unpack-reel.js <path>` rebuilds the folder (reel.js, script.md, reel.json, images), then carry on from step 4.

## Rules that never bend

- The user's script is used **word for word**: no rewriting, shortening or "improving". Timings estimated by you are marked as estimates.
- **Content rules** (full text in the engine skills): nothing indecent; no girls or women except in hijab; no pigs; sacred objects still and honoured, never the moving element; prophets never depicted in any form; no brand logos, copyrighted characters or real people.
- **Qur'an verses** appear in Arabic only from a verified source pasted with code (Tanzil / Quran.com), never typed or recalled; ask the user to paste it when you can't fetch it.
- No music. Sound is synthesized (or the user's own recordings).
- Never invent images, base64 or asset URLs. Images come from the user and live in `images/`.

## Engines and skills

- Engine changes go into `engines/` (shared code in `engines/shared/`, then `python3 tools/sync-engines.py`), with a line in `engines/CHANGELOG.md`, and are proved by rebuilding and rendering a reel.
- Skill changes follow `.claude/skills/README.md`: the change goes at the level it is true for, children only hold differences, every change bumps the version in `registry.json` and adds a `CHANGELOG.md` line. Run `node tools/skills.js --check` after any skill change.

## Git

- **The repo holds the studio, not the reels.** Commit and push only changes to skills, engines, tools and docs (`educational 1.1.0: …`, `engines: …`, `tools: …`). Reel folders are ignored by git (`reels/*`) and are never committed, force-added or pushed, however many there are: the user gets each reel as files (step 6).
- A session that only made or revised reels has nothing to push; don't push its branch.
- Work on the branch the session names, with clear commit messages, and push when a skill, engine or tool change is done.

## Environment notes

- Cloud sessions have Chromium + Playwright, ffmpeg, Node and Python with Pillow; `tools/render.js` uses them and reaches the CDNs (p5.js, Three.js, Google Fonts) through the session proxy.
- On a local machine: `npm i -D playwright && npx playwright install chromium`, plus ffmpeg and Python 3 with Pillow.
