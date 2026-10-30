#!/usr/bin/env node
// The reel skills as a family tree, checked against .claude/skills/.
//
//   node tools/skills.js            print the tree (engine, version, summary) and any problems
//   node tools/skills.js --check    only the problems; exit code 1 if there are any
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), DIR = path.join(ROOT, '.claude', 'skills');
const ENGINES = ['p5', 'three', 'hybrid'];

const reg = JSON.parse(fs.readFileSync(path.join(DIR, 'registry.json'), 'utf8')).skills;
const problems = [];
const folders = fs.readdirSync(DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

for (const name of folders) {
  const f = path.join(DIR, name, 'SKILL.md');
  if (!fs.existsSync(f)) { problems.push(`${name}/ has no SKILL.md`); continue; }
  const head = fs.readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (!head) { problems.push(`${name}/SKILL.md has no frontmatter`); continue; }
  const fm = Object.fromEntries(head[1].split('\n').map(l => l.match(/^(\w[\w-]*):\s*(.*)$/)).filter(Boolean).map(m => [m[1], m[2].replace(/^"|"$/g, '')]));
  if (fm.name !== name) problems.push(`${name}/SKILL.md: name is "${fm.name}", the folder is "${name}"`);
  if (!fm.description) problems.push(`${name}/SKILL.md: no description (Claude can't tell when to use it)`);
  if (!reg[name]) problems.push(`${name}: not in registry.json`);
}
for (const [name, s] of Object.entries(reg)) {
  if (!folders.includes(name)) problems.push(`registry.json: ${name} has no folder`);
  if (s.parent && !reg[s.parent]) problems.push(`${name}: parent ${s.parent} is not a skill`);
  if (s.engine && !ENGINES.includes(s.engine)) problems.push(`${name}: engine ${s.engine} is not one of ${ENGINES.join(', ')}`);
  if (['engine', 'series'].includes(s.kind) && !s.engine) problems.push(`${name}: a ${s.kind} skill needs an engine`);
  if (s.parent) {
    const body = fs.existsSync(path.join(DIR, name, 'SKILL.md')) ? fs.readFileSync(path.join(DIR, name, 'SKILL.md'), 'utf8') : '';
    if (!body.includes(`.claude/skills/${s.parent}/SKILL.md`)) problems.push(`${name}: SKILL.md never tells Claude to read its parent (.claude/skills/${s.parent}/SKILL.md)`);
  }
  const seen = new Set([name]); let p = s.parent;
  while (p) { if (seen.has(p)) { problems.push(`${name}: parent chain loops at ${p}`); break; } seen.add(p); p = reg[p] && reg[p].parent; }
}

if (!process.argv.includes('--check')) {
  const kids = p => Object.entries(reg).filter(([, s]) => s.parent === p).map(([n]) => n);
  const line = (n, pre) => { const s = reg[n]; console.log(`${pre}${n}  ·  ${s.kind}${s.engine ? ' · ' + s.engine : ''} · v${s.version}  —  ${s.summary}`); };
  const walk = (n, pre) => { const k = kids(n); k.forEach((c, i) => { const last = i === k.length - 1; line(c, pre + (last ? '└─ ' : '├─ ')); walk(c, pre + (last ? '   ' : '│  ')); }); };
  for (const kind of ['engine', 'prompts', 'tool']) for (const n of Object.keys(reg).filter(n => !reg[n].parent && reg[n].kind === kind)) { line(n, ''); walk(n, ''); }
  console.log('');
}
console.log(problems.length ? '✗ ' + problems.join('\n✗ ') : '✓ every skill has a SKILL.md, a registry entry and a valid parent');
if (problems.length) process.exitCode = 1;
