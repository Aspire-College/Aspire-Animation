#!/usr/bin/env node
// Start a reel folder: reels/<date>-<topic>/ with reel.json, script.md and images/.
//
//   node tools/new-reel.js "why savings shrink" --skill educational
//   node tools/new-reel.js "lanterns" --skill reel-creator-2-5d --date 2026-11-02 --title "Lanterns at dusk"
//
// --skill  any skill in .claude/skills/registry.json (default reel-creator); its engine is used unless --engine is given
// --engine p5 | three | hybrid      --date YYYY-MM-DD (default today)      --title "On-screen title" (default: the topic)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude/skills/registry.json'), 'utf8')).skills;

const argv = process.argv.slice(2), o = { _: [] };
for (let i = 0; i < argv.length; i++) argv[i].startsWith('--') ? (o[argv[i].slice(2)] = argv[++i]) : o._.push(argv[i]);
const topic = o._.join(' ').trim();
if (!topic) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 9).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }

const skill = o.skill || 'reel-creator', s = reg[skill];
if (!s) { console.error(`✗ no skill "${skill}". Skills: ${Object.keys(reg).join(', ')}`); process.exit(1); }
const engine = o.engine || s.engine;
if (s.kind !== 'prompts' && !['p5', 'three', 'hybrid'].includes(engine)) { console.error(`✗ engine must be p5, three or hybrid (got ${engine})`); process.exit(1); }
const date = o.date || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('✗ --date must be YYYY-MM-DD'); process.exit(1); }
const slug = topic.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'reel';
const dir = path.join(ROOT, 'reels', `${date}-${slug}`);
if (fs.existsSync(dir)) { console.error(`✗ ${path.relative(ROOT, dir)} already exists`); process.exit(1); }

const title = o.title || topic.replace(/^\w/, c => c.toUpperCase());
fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
fs.writeFileSync(path.join(dir, 'images', '.gitkeep'), '');
fs.writeFileSync(path.join(dir, 'reel.json'), JSON.stringify({ title, date, skill, skillVersion: s.version, engine: s.kind === 'prompts' ? null : engine, status: 'script' }, null, 2) + '\n');
fs.writeFileSync(path.join(dir, 'script.md'), `# ${title}

Skill: \`${skill}\` v${s.version}${s.kind === 'prompts' ? '' : ` · Engine: \`${engine}\``} · Date: ${date}

## Script

<!-- The user's timestamped script, word for word. One line per timestamp, e.g. 0:00–0:03 Your second cup isn't helping. -->

## Brief

<!-- Audience (who is "you" on screen), CTA, style or look, anything the user asked for. -->

## Plan

<!-- The agreed plan (scene changes, sound, Qur'an verses, answers to the questions). Paste it here once the user approves it. -->

## Review notes

<!-- What the user asked to change after seeing frames or the MP4, and what was changed. Lessons worth keeping go into the skill (see skill-workshop). -->
`);
console.log(`✓ ${path.relative(ROOT, dir)}/  (skill ${skill}${s.kind === 'prompts' ? '' : `, engine ${engine}`})
  script.md   the script, brief, agreed plan and review notes
  reel.json   title, skill, engine, status
  images/     generated or supplied images (file names are their labels)
Next: ${s.kind === 'prompts' ? 'write prompts.md here' : `write reel.js, then  node tools/build.js ${path.relative(ROOT, dir)} --check`}`);
