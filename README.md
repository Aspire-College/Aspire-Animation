# Aspire Animation

Instagram Reels for Aspire College, made with Claude Code: each reel is a small program that draws every frame (p5.js 2D, Three.js 3D, or 2.5D painted layers), with captions, a synthesized sound score and no cuts, rendered to a 1080×1920 MP4.

## Making a reel (talk to Claude)

- "Make an **educational** reel from this script: 0:00–0:03 …" (kinetic typography)
- "Make a **storytelling** reel …" (image-led: Claude writes the image prompts, you generate the images)
- "Make an **ASMR loop** of clay being sliced" (10-second seamless loop)
- "Make a **3D** / **2.5D** reel …", or just "make a reel …" (2D)
- "Give me **hook prompts** for …" or "10 **reel ideas** for exam week" (prompts only)
- "This is a new series: … **save it as a template**" (a new series skill)
- "**From now on**, always …" (improves the skill it belongs to)

Claude plans first and waits for your OK, builds, looks at its own frames, renders `out.mp4`, and sends you `out.mp4` and `index.html` as files. Reels are never committed: the repo is the studio (skills, engines, tools), not an archive. To revise an old reel, attach its `index.html`: it carries its own source.

## Layout

| Path | What |
|---|---|
| `CLAUDE.md` | House rules every Claude session follows |
| `.claude/skills/` | The skills: 3 engine skills, series templates, prompts, and the tools that manage them |
| `engines/` | The shared engine code: `p5/`, `three/`, `hybrid/`, `shared/` |
| `reels/<date>-<topic>/` | Working folder per reel (ignored by git) |
| `tools/` | `new-reel.js`, `build.js`, `render.js`, `unpack-reel.js`, `skills.js`, `sync-engines.py` |

## Commands

```bash
node tools/new-reel.js "topic" --skill educational
```

```bash
node tools/build.js reels/<folder> --check
```

```bash
node tools/render.js reels/<folder>
```

```bash
node tools/skills.js
```

Requirements: Node 18+, Python 3 with Pillow, ffmpeg, and Playwright with Chromium (preinstalled in Claude Code cloud sessions; locally `npm i -D playwright && npx playwright install chromium`).
