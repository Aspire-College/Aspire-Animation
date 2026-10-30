#!/usr/bin/env node
// Build a reel: reels/<folder>/reel.js (+ images/) → reels/<folder>/index.html, with the engine named in reel.json.
//
//   node tools/build.js reels/<folder>            build index.html
//   node tools/build.js reels/<folder> --check    build, run the engine's code checks, then render the check frames to .check/sheet.png
//   node tools/build.js reels/<folder> --render   build, then render out.mp4
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2), dir = argv.find(a => !a.startsWith('--'));
if (!dir) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 7).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }
const reelDir = path.resolve(dir), meta = path.join(reelDir, 'reel.json');
if (!fs.existsSync(meta)) { console.error(`✗ ${path.relative(ROOT, meta)} not found (start reels with node tools/new-reel.js)`); process.exit(1); }
const { engine } = JSON.parse(fs.readFileSync(meta, 'utf8'));
if (!['p5', 'three', 'hybrid'].includes(engine)) { console.error(`✗ reel.json engine is "${engine}"; it must be p5, three or hybrid`); process.exit(1); }

const run = (cmd, args) => { const r = spawnSync(cmd, args, { cwd: reelDir, stdio: 'inherit' }); if (r.status) process.exit(r.status); };
const images = path.join(reelDir, 'images'), hasImages = fs.existsSync(images) && fs.readdirSync(images).some(f => /\.(png|jpe?g|webp)$/i.test(f));
const check = argv.includes('--check');
run('python3', [path.join(ROOT, 'engines', engine, 'build.py'), ...(hasImages ? ['--images', 'images'] : []), ...(check && engine !== 'p5' ? ['--check'] : [])]);
if (check) run('node', [path.join(ROOT, 'tools', 'render.js'), reelDir, '--frames', 'auto']);
if (argv.includes('--render')) run('node', [path.join(ROOT, 'tools', 'render.js'), reelDir]);
