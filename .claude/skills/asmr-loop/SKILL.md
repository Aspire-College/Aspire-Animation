---
name: asmr-loop
description: "Aspire series template (engine: three, extends reel-creator-3d). A 10-second seamless satisfying loop: one continuous clay 3D action (cutting, stacking, pressing, pouring, rolling, sorting) whose last frame flows into its first, with close tactile ASMR sound on every contact and no voice. Use when the user asks for an ASMR reel, a satisfying loop, an oddly satisfying video, a seamless loop or a 10-second loop."
---

# ASMR loop: 10 seconds, seamless, satisfying

**Extends `reel-creator-3d`.** Read `.claude/skills/reel-creator-3d/SKILL.md` first and follow it for the engine, the clay look, light, the build and the content rules. This file changes the reel's shape: there is no story to tell, so most of the parent's scene-change machinery is replaced by one loop. Where they differ, this file wins; the user's explicit instructions win over both.

## What every reel in this series is

- **Exactly 10.0 s, 300 frames at 30 fps, and frame 300 is frame 0.** Played on repeat, nobody can see where it starts.
- **One satisfying action**, in one continuous shot: a clay block sliced into perfect slices, cubes that stack and fit exactly, a press that squashes and releases, sand poured to a perfect level, marbles down a track, gears meshing, colours sorting into rows, a spiral that winds. It must look physically right: weight, squash, settle.
- **Sound is the point.** Close, crisp, tactile sounds on every contact, no voice, no music.
- **No script needed.** If the user gives a hook line, it shows as one static caption for all 10 s (it must be identical at frame 0 and 300); otherwise no caption (`SCRIPT` is one line with empty `text` that carries the sound cues). No end screen, no CTA hold (`ctaHold: 0`).
- **2D variant.** If the user asks for a flat or 2D loop, build it with `reel-creator` (engine p5) under the same loop rules.

## The loop mechanism (choose one, name it in the plan)

| Mechanism | How the end equals the start | Good for |
|---|---|---|
| Cycle | everything moves on whole-number periods of 10 s (10, 5, 2.5, 2 s…) | gears, orbits, spinning, breathing |
| Conveyor | objects enter as others leave, at the same spacing, so the set looks the same after one step | slicing, stamping, sorting, stacking |
| Reset by motion | what was made moves out of frame while a fresh start slides in | press, pour, build-then-clear |
| Self-similar zoom | the camera ends at k× scale on a copy of where it started | spirals, nested shapes, infinite stairs |
| Match | the last frame lines up with the first on an identical object (`match` move) | a ball that lands where another starts |

**Rules that make it seamless**
- Every motion is a function of `T` with a period that divides 10: `ph = (T % P) / P`, `Math.sin(TAU * k * T / 10)` for whole `k`. No `T * speed` drift unless it wraps.
- Particles are analytic and **pre-warmed**: each one's birth time is spread over the period and wrapped (`age = ((T - born) % life + life) % life`), so the same particles are alive at 0 and at 10.
- Lights are constant or periodic. The camera is locked, or makes one periodic move (a sway with `sin`, an orbit of whole turns). `LIGHTS` and `CAM` keys at 0 and 10 are identical.
- Nothing appears for the first time: everything at frame 0 has already been moving.

## Sound

- A cue for every contact, at the same phase in every cycle (generate them with a loop over the period). Pick by material: clay or sand cut `crease` and `rustle` (high `pitch`, short `dur`), a soft press `cloth` with a low `thump`, wood `wood` or `knock`, glass or marble `clink` and `pebble`, metal `coin`, sand flowing `pour` with a `rustle` bed, a snap into place `click` and `twig`. Vary `pitch`, `seed` and `pan` a little on each repeat so it doesn't sound machine-made.
- A very low bed (`room` at `vol` 0.3, or none). With no voice, touches may sit higher than the parent's mix: aim for a peak around -6 dBFS.
- Render with `--loop` so the tails of the last sounds wrap into the start (no silence or click at the seam).

## Plan (shorter than the parent's)

One reply, no code, under about 400 words: the action and its material, the mechanism and the periods, the camera (locked or its periodic move), light, the list of contacts with their times in one cycle and their sounds, the frame-0 / frame-300 argument (why they are identical), weak spots, at most three questions. Then wait.

## Build and check

- `reel.js` as the parent's, with `REEL = { title, fps: 30, ctaHold: 0 }` and one `SCRIPT` line `{ start: 0, end: 10, text: '' or the hook, sfx: [...] }`. `MAP` has one shot.
- `node tools/build.js reels/<folder> --check`, then `node tools/render.js reels/<folder> --loop-check`: the mean pixel difference between frame 0 and the frame after the last must be under 1. Look at frames 0, 2.5, 5, 7.5 and 9.97.
- Render the file with `node tools/render.js reels/<folder> --loop`. To hear the seam, the user can play `out.mp4` on repeat; optionally make a 3× preview with `ffmpeg -stream_loop 2 -i out.mp4 -c copy loop3.mp4` (don't commit it).
- Deliver `out.mp4` at exactly 10.00 s.

## Series log

Lessons from reels in this series, newest first (see `skill-workshop`).

- (none yet)
