---
name: new-series
description: "Saves a new reel concept as a reusable series template (a new skill in .claude/skills/) that extends the closest existing skill, so every later episode follows the same instructions. Use when the user describes a new kind of reel they want to make more than once ('a new series', 'a recurring format', 'every week we'll post…'), or says 'save this as a template', 'make a template for this type of reel', or 'turn this reel into a series'."
---

# New series: save a reel concept as a template

A series template is a skill that **extends** an existing skill and holds only what makes this series different. The parent keeps doing the heavy lifting (planning, engine, sound, content rules); the series skill adds its identity. Read `.claude/skills/README.md` for the conventions before you start.

## 1. Understand the concept

From the user's message, the chat, or a reel already made (its `script.md`, `reel.js`, review notes), collect:
- **The promise:** who it's for and what each episode gives them.
- **The shape:** length, structure, recurring segments, CTA, captions or none.
- **The look and sound:** style, palette, fonts, sound world; or "same as <existing series>".
- **What stays and what changes** from episode to episode.
- **The engine:** 2D drawn (p5), 3D clay (three), 2.5D painted layers (hybrid), or prompts only (no engine).

Ask only what you can't infer, in one message, at most four numbered questions, each with your default ("I'll assume 30 s with a CTA unless you say otherwise"). If the user said to go ahead, use your defaults and say which.

## 2. Pick the parent

The parent is the existing skill the new series is closest to, so the series file stays short. Run `node tools/skills.js` to see the tree.
- Kinetic text explainer → `educational`. Story with generated art → `storytelling`. Seamless satisfying loop → `asmr-loop`. Prompts only → `ai-video`.
- Otherwise the engine skill: `reel-creator` (p5), `reel-creator-3d` (three), `reel-creator-2-5d` (hybrid).
- A series may extend another series (a child of a child) when most of its rules apply. Never copy a parent's text into the child: point to it.

## 3. Write the skill

1. Choose a short slug (lowercase, hyphens; the folder name and `name:` must match). Check it isn't taken.
2. Copy `.claude/skills/new-series/series-template.md` to `.claude/skills/<slug>/SKILL.md` and fill it in. Delete sections that would only say "same as the parent". Write rules as decisions with a reason, in plain words, like the existing skills. The `description` decides when Claude picks the skill: name the kind of reel and the words the user will say.
3. If an existing reel is the reference, copy its `reel.js` and `script.md` into `.claude/skills/<slug>/example/` (the reel folder itself is never committed), name it in *Build*, and turn its decisions (palette, fonts, timings, sound, moves that worked, review notes) into the series rules.
4. If the series needs reusable code (a kit like `engines/<engine>/kinetic-kit.js`), add it to `engines/<engine>/`, document it at the top of the file, and test it with a real build and render before you rely on it.
5. Add `CHANGELOG.md` in the folder: `## 1.0.0 — <date>` and one line on where the series came from.
6. Add the entry to `.claude/skills/registry.json` (`kind: "series"`, `engine`, `parent`, `version: "1.0.0"`, `origin`, `summary`).
7. Run `node tools/skills.js --check` and fix every ✗.

## 4. Prove it and hand over

- If there is a script for the first episode, offer to build it now with the new skill (`node tools/new-reel.js "<topic>" --skill <slug>`); the first build usually teaches the series log its first lessons.
- Commit (`Add <slug> series template`) and push, as `CLAUDE.md` says.
- Tell the user in two or three lines: the skill's name and parent, how to use it (`/<slug>` followed by the script, or "make a <series> reel about …"), and that it can be improved any time with feedback (`skill-workshop`). A new skill folder is picked up by new sessions; if `/<slug>` isn't listed yet, start a new session.
