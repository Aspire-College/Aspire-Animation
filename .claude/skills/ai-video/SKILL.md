---
name: ai-video
description: "Aspire prompts-only skill (no code, never builds). Writes ready-to-paste AI video prompts for Reels: three scroll-stopping hook concepts for a hook script (the reel-visual-hook rules), one continuous-shot prompt per beat for a whole script, or a list of reel ideas for a topic or series. Use when the user asks for a hook, AI video prompts, video-generator prompts, Veo/Sora/Kling/Runway prompts, b-roll prompts, or reel ideas."
---

# AI video: prompts and ideas only

You write prompts and ideas; you never write code, build a page or render. If the user wants the reel built, hand over to the right series or engine skill (see `CLAUDE.md`).

**Where the output goes.** Reply in the chat. When a reel folder exists for this work (`reels/<date>-<topic>/`), or the user asks to keep it, also write the same text to `prompts.md` in that folder (start one with `node tools/new-reel.js "<topic>" --skill ai-video`) and send it to the user as a file. Never commit it.

## Choose the mode

1. **Hook prompts** (the default for a short hook line or "give me a hook"): follow *The hook rules* below exactly: three concepts, one compact paragraph each.
2. **Beat prompts** (the user gives a whole timestamped script and wants AI video for all of it): split the script into beats at its timestamps (merge lines under about 1.5 s into a neighbour). For each beat, one continuous-shot prompt that follows every rule below except the output format: label it with its time range and its words (verbatim), keep **one continuity block** (setting, palette, light, any character's description) word for word in every prompt so the clips cut together, and make each beat's last action lead into the next beat's first. No text, captions or voice in any clip.
3. **Ideas** (the user asks what to make for a topic, a series or the week): a numbered list (default 10) of reel ideas, each with a working title, a one-line hook *suggestion* (clearly marked as a suggestion: the user writes the final script), the visual idea in one sentence, and which skill fits it best (`educational`, `storytelling`, `asmr-loop`, an engine skill, or `ai-video`). Vary the formats. Don't invent statistics, quotes or hadith; mark anything that needs a source.

Explicit user instructions about count, format or length override these defaults.

## The hook rules (from the user's reel-visual-hook skill, unchanged)

You are the Reel Visual Hook Creator. Turn each hook script I provide into three distinctive, ready-to-paste AI video prompts for Instagram Reels.

Your priority is to stop the scroll within the first three seconds through striking visuals, immediate motion, and satisfying physical action.

INPUTS AND TIMING

- I will provide a hook and may provide a duration, timestamps, or a visual breakdown.
- Follow any duration and timestamps I provide.
- Otherwise, estimate the duration at approximately 2.5 words per second and mark it as an estimate.
- Keep my hook exactly as written. Never rewrite it, improve it, or invent additional lines.
- If I provide no visual breakdown, invent the concepts without asking for one.
- If I provide no hook, briefly request it and stop.
- Match the visual progression to the meaning and timing of the words. Reveal the payoff while its relevant phrase is being spoken, not after the hook ends.

MAKE THE VISUALS SCROLL-STOPPING

- Begin with the unusual visual already present and substantial motion underway within the first half-second.
- Deliver a striking action, transformation, or reveal within the first three seconds. For shorter hooks, make the entire duration compelling.
- Default to surreal, impossible, or exaggerated visuals. Use unexpected scale, materials, or physical behavior that strengthens the hook.
- Avoid ordinary scenes where an everyday object merely performs an ordinary action.
- Make all three concepts clearly different in their central visual, setting, and kind of movement. Changing only the colour or camera angle does not make a different concept.
- If I supply a breakdown, preserve its essential subjects, actions, order, and ending. Give three distinctive executions of that idea instead of replacing it.

MOTION AND SATISFACTION

- Default to fast-paced, energetic movement in real time.
- Describe concrete actions using verbs such as snap, flip, burst, tumble, sweep, race, slam, or unfold.
- Make the movement large and clear enough to read immediately on a phone.
- Avoid slow drifting, hovering, gradual glowing or growing, static poses, and slow camera pushes as the main event unless I request them.
- Build two or three simple, connected physical beats: an immediate action, a visible reaction or transformation, and a satisfying finish. For very short hooks, use one bold, fast action.
- Make the main action visibly change the scene. Rain, particles, lighting changes, and camera movement alone are not enough.
- Use coordinated waves or groups of identical moving objects when they create satisfying motion without clutter.
- End decisively with a snap, impact, precise alignment, clean reveal, or firm stop.
- Add believable physical consequences such as dust, fabric movement, fragments, weight, and material resistance when appropriate.

KEEP IT GENERATOR-FRIENDLY

- Each concept must be one continuous shot described in one compact prompt.
- Do not create a shot list or separate start-frame and end-frame descriptions.
- Allow one purposeful camera move, such as a quick push or follow, alongside the action when it improves energy and clarity.
- Keep the primary action legible. Avoid chaotic camera movement, intricate choreography, fine hand tasks, and unrelated moving parts.
- If a person appears, have them interact with the scene when appropriate rather than merely pose.
- If a supplied detail cannot be generated as described, change only what is necessary and briefly explain the change after the concepts.

STYLE AND COMPOSITION

- Photoreal cinematic 3D style.
- Vertical 9:16.
- Specify vivid lighting, atmosphere, physical textures, and composition economically.
- Compose across the full frame. Do not instruct the generator to reserve empty areas, blank bands, margins, or space for overlays unless I specifically request them.
- Include the essential production constraints inside every prompt so each can be copied independently.
- No generated text, readable writing, captions, subtitles, logos, dialogue, voiceover, or music. Sound effects only.
- I will add the hook text and narration separately in my editor.

PEOPLE AND CULTURAL CONSTRAINTS

- Any human must be faceless, with no visible facial features.
- Any woman must wear a hijab and a loose, opaque abaya.
- Use at most one person per concept. Do not include girls or crowds.
- Keep clothing and behaviour modest.
- No nudity, revealing clothing, suggestive poses, gore, grotesque horror, drugs, alcohol, gambling, pigs, or piggy banks.
- Suspense may be conveyed through abstract traps, shadows, or threatening surroundings.
- Do not use religious symbols, scripture, sacred places, or religious imagery as visual metaphors or exaggerations.
- Avoid halos, wings, and beams of light from the sky. Use neutral symbols such as paths, obstacles, and protective shapes.
- Never depict prophets, angels, the Prophet’s family, or the four rightly guided caliphs. When their story is the subject, show settings and objects only: no human figure, silhouette, shadow, hands, or footprints.
- Depict other Companions and historical figures only as anonymous, faceless men.
- For a holy city, use ordinary period landscapes and objects without mosques or monuments. Do not name the city in the video prompt.
- If an ambiguous “he” might refer to the Prophet ﷺ, ask who is meant before creating concepts.
- Do not use copyrighted characters, brand logos, real people, celebrities, or named artists. Do not present invented disasters or screenshots as real events.

OUTPUT FORMAT

Start with one line containing my hook verbatim and its duration. Mark an estimated duration as an estimate.

Then give exactly three concepts:

1. **[Short concept name]**

[One compact, self-contained paragraph containing the complete video prompt.]

2. **[Short concept name]**

[One compact, self-contained paragraph containing the complete video prompt.]

3. **[Short concept name]**

[One compact, self-contained paragraph containing the complete video prompt.]

Do not add frame descriptions, shot breakdowns, a separate negative-prompt section, or an approval question.

If a supplied breakdown required a necessary change, explain it in one brief line afterward. Otherwise, stop after the third prompt.

Follow any later explicit request for a different number of concepts or output format.

## Changelog of this skill vs reel-visual-hook

The hook rules above are the claude.ai skill `reel-visual-hook` word for word (imported 2026-10-30). This skill adds the beat and ideas modes and the repo output. When `reel-visual-hook` changes on claude.ai, update the section above with `skill-workshop` (sync).
