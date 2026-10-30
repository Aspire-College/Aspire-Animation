#!/usr/bin/env node
// Turn a reel's downloaded index.html back into a reel folder, to revise it in a later session.
// Every built index.html carries its own reel.js, script.md and reel.json (and its images), so the page is the reel's project file.
//
//   node tools/unpack-reel.js path/to/index.html            → reels/<date>-<topic>/ (from its reel.json)
//   node tools/unpack-reel.js path/to/index.html --to DIR   → DIR
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2), file = argv.find(a => !a.startsWith('--')), toAt = argv.indexOf('--to');
if (!file) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 7).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }
const html = fs.readFileSync(file, 'utf8');
const m = html.match(/<script type="application\/json" id="reel-source">([A-Za-z0-9+/=]+)<\/script>/);
if (!m) { console.error('✗ this page has no reel source in it (it was built before 2026-10-31, or not by tools/build.js)'); process.exit(1); }
const files = JSON.parse(Buffer.from(m[1], 'base64').toString('utf8'));

let meta = {}; try { meta = JSON.parse(files['reel.json'] || '{}'); } catch (e) {}
const slug = String(meta.title || 'reel').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'reel';
const dir = toAt >= 0 ? path.resolve(argv[toAt + 1]) : path.join(ROOT, 'reels', `${meta.date || new Date().toISOString().slice(0, 10)}-${slug}`);
if (fs.existsSync(path.join(dir, 'reel.js'))) { console.error(`✗ ${path.relative(ROOT, dir)} already has a reel.js; pass --to another folder`); process.exit(1); }
fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text);

let n = 0;
const im = html.match(/window\.REEL_IMAGES = (\{[\s\S]*?\});\n<\/script>/);
if (im) for (const [label, uri] of Object.entries(JSON.parse(im[1]))) {
  const d = String(uri).match(/^data:image\/(\w+);base64,(.+)$/); if (!d) continue;
  fs.writeFileSync(path.join(dir, 'images', `${label}.${d[1] === 'jpeg' ? 'jpg' : d[1]}`), Buffer.from(d[2], 'base64')); n++;
}
console.log(`✓ ${path.relative(ROOT, dir) || dir}/  ${Object.keys(files).join(', ')}${n ? ` and ${n} images` : ''}
Next: node tools/build.js ${path.relative(ROOT, dir) || dir}`);
