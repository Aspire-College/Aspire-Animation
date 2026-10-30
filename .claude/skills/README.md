# Reel skills

Each folder here is a skill Claude Code loads in this repo (`/<name>` runs one by hand). `registry.json` is the family tree; `node tools/skills.js` prints it and checks it.

| Kind | Skills | What it does |
|---|---|---|
| engine | `reel-creator` (p5), `reel-creator-3d` (three), `reel-creator-2-5d` (hybrid) | Builds reels on one engine in `engines/`. Imported from the claude.ai skills of the same name, with a repo *Environment* section. |
| series | `educational`, `storytelling`, `asmr-loop` | A reel template that **extends** a parent skill and only says what differs. |
| prompts | `ai-video` | Prompts and ideas, never code (built on the claude.ai skill `reel-visual-hook`). |
| tool | `new-series`, `skill-workshop` | Save a new series template; improve, derive and sync skills. |

## How inheritance works

There is no inheritance in the skill format itself, so it is a convention, and `tools/skills.js` enforces it:
1. The child's `SKILL.md` begins: **Extends `<parent>`.** Read `.claude/skills/<parent>/SKILL.md` first and follow all of it. This file only lists what … changes. Where they differ, this file wins; the user's explicit instructions win over both.
2. The child never copies the parent's text. It overrides by stating the new rule (and, if useful, which parent rule it replaces).
3. `registry.json` records `parent`, `engine`, `kind`, `version`.
4. Priority, highest first: the user's explicit instructions → the child → the parent → `CLAUDE.md` defaults. Content rules in the engine skills and `CLAUDE.md` are never relaxed by a child.

## Versions

`MAJOR.MINOR.PATCH` in `registry.json`, with a line in the folder's `CHANGELOG.md` for every change: patch for wording and fixes, minor for a new rule or option, major when reels built before would come out differently. `reel.json` in each reel records the skill version it was made with.

## Adding one

- A new kind of reel for a series → `new-series` (template in `new-series/series-template.md`).
- A variant of an existing skill → `skill-workshop` (B).
- A lesson from a review → `skill-workshop` (A): it goes in the *Series log* or the rules of the skill it is true for.
