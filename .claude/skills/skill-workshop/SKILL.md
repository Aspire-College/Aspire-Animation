---
name: skill-workshop
description: "Maintains the reel skills in this repo: improves a skill from feedback (with a version bump and changelog), creates a child skill that extends another skill, syncs the engine skills and engines with the user's claude.ai versions, and fixes engines for every reel. Use when the user says 'improve the skill', 'from now on always/never…', 'remember this for next time', 'make a version of <skill> that…', 'child skill', 'update the skill from claude.ai', or reports a bug that will happen again in later reels."
---

# Skill workshop: improve, derive, sync

The skills in `.claude/skills/` form a family tree (`node tools/skills.js`). Engine skills (`reel-creator`, `reel-creator-3d`, `reel-creator-2-5d`) own an engine in `engines/`; series and child skills extend a parent and only hold their differences. Read `.claude/skills/README.md` first.

## Where a change belongs

Put every lesson at the **highest level it is true for**, and nowhere else:
- true for this reel only → the reel's `script.md` (*Review notes*), not a skill;
- true for every reel of one series → that series skill (its rules, or a line in *Series log*);
- true for every reel on one engine → the engine skill, or the engine code in `engines/<engine>/`;
- true for every reel at all (content rules, delivery, repo workflow) → `CLAUDE.md`, and the engine skills where they state it.

If you can't tell, ask the user once: "Should this apply to every <series> reel, or every reel?"

## A. Improve a skill

1. Read the skill and its parent. Find the sentence that should change; change the fewest words that make the rule clear. Keep the skill's voice: decisions with reasons, plain words, no shouting.
2. Never edit a parent to suit one child. If the change is about one series, it goes in that series.
3. Bump the version in `.claude/skills/registry.json` and add a line to the skill's `CHANGELOG.md`: **patch** (1.0.1) for wording and fixes, **minor** (1.1.0) for a new rule or option, **major** (2.0.0) when reels built before would now come out differently.
4. Check the children: `node tools/skills.js` lists them. Read each child's rules against the change; fix conflicts in the child, or tell the user which child disagrees and ask.
5. Run `node tools/skills.js --check`, commit (`<skill> 1.1.0: <what changed>`), push.

## B. Create a child skill

When the user wants a variant of an existing skill ("an educational series for Arabic grammar", "storytelling but 2.5D and always at night"), make a new skill that extends it, exactly as `.claude/skills/new-series/SKILL.md` describes (template, registry entry with `parent`, changelog, check). The child holds only differences and starts by telling Claude to read `.claude/skills/<parent>/SKILL.md`. Children of children are fine; `tools/skills.js` rejects loops.

## C. Fix or improve an engine

- The engine code is `engines/<engine>/` (templates, kits, `build.py`) and `engines/shared/` (the sound library and the export hook, pasted into every template between `/*@@shared:NAME@@*/` markers).
- Fix the source, never one reel's `index.html`. After editing `engines/shared/`, run `python3 tools/sync-engines.py`.
- Prove it: copy a series' `example/` folder into `reels/` and build and render it (`cp -r .claude/skills/educational/example reels/test-p5 && node tools/build.js reels/test-p5 --check` for p5) or a small test reel for three/hybrid, and look at the frames.
- Add a line to `engines/CHANGELOG.md`. Old reels keep their built `index.html`; rebuild one only when the user wants the fix in it.

## D. Sync with claude.ai

The three engine skills and `reel-visual-hook` started as the user's claude.ai skills. In cloud sessions the account's skills are synced to `/root/.claude/skills/synced/*/<name>/SKILL.md` (find them with `ls -d /root/.claude/skills/synced/*/<name>`); the engine code lives in the artifacts named in each engine skill's environment section.
- **claude.ai → repo** (the user improved the chat version): diff the synced `SKILL.md` against the repo copy. Bring every upstream change in, but keep the repo's adaptations: the *Environment* section (the aspire-animation repo), the description prefix "Aspire repo engine skill (engine: …)", the repo *Build* paragraph and *Delivery* lines. For engines, read the artifact's files with the Artifact tool, diff them against `engines/<engine>/`, merge, and keep the repo additions (the `/*@@shared…@@*/` markers, the `exposeReel(…)` call, the p5 template's `/*@@REEL@@*/`, `<!--@@FONTS@@-->` and `<!--@@IMAGES@@-->` placeholders, and the include-friendly `scene-changes.js` and `quran-verse.js`). Then sync, rebuild and render a test reel, bump the version (origin: "synced from claude.ai <date>").
- **repo → claude.ai** (only when the user asks): write the chat version of the skill to a file in the scratchpad: the repo text with the original chat *Environment* section and engine-page instructions restored (take them from the synced copy). Tell the user where it is and that they upload it to their claude.ai skills (in claude.ai's settings, where they manage skills), replacing the old version. Publish an engine fix back to its artifact only with the user's OK.

## Always

- Keep `name:` equal to the folder name, and the `description` specific (it decides when the skill is used).
- One change, one commit, with the version in the message.
- Tell the user in a line or two what changed, at which level, and which skills it affects.
