---
name: <series-slug>
description: "Aspire series template (engine: <p5|three|hybrid>, extends <parent>). <One sentence: what every reel in this series is.> Use when the user asks for <the words they will use: 'a <series> reel', the topic, the format>."
---

# <Series name>

**Extends `<parent>`.** Read `.claude/skills/<parent>/SKILL.md` first and follow all of it. This file only lists what the <series name> series changes. Where they differ, this file wins; the user's explicit instructions win over both.

## What every reel in this series is

- <the promise of the series in one line: who it is for, what they get>
- <length, structure (hook → … → CTA), recurring segments, the recurring opening or sign-off if any>
- <what stays the same in every episode (look, characters, a recurring object, a title card the user asked for)>
- <what changes every episode>

## The series look

<Only what differs from the parent: palette tokens (hex), fonts (`// @fonts …`), texture, the default style, how captions look. A table of tokens is easiest to keep up to date.>

## Build

<Only what differs: kits to include, settings in reel.js, a reference reel to copy the shape of (`reels/<date>-<topic>/reel.js`), helpers worth reusing.>

## Rules

<The decisions that make this series recognisable: motion vocabulary, scene-change preferences, what never to do. Each rule with its reason in a few words.>

## Sound

<The series' sound world, if it differs from the parent's: beds, signature touches, levels.>

## Plan additions

<What the plan must also state for this series, one line each.>

## Checks

<The parent's checks, plus the checks that are specific to this series.>

## Series log

Lessons from reels in this series, newest first (see `skill-workshop`).

- <date> · <reel folder> · <the lesson, in one line>
