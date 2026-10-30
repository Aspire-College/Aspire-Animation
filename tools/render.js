#!/usr/bin/env node
// Headless render: a reel's index.html → out.mp4 (H.264 + AAC, 1080×1920), or still frames to look at.
//
//   node tools/render.js reels/<folder>                     render the whole reel to reels/<folder>/out.mp4
//   node tools/render.js reels/<folder> --frames auto       frame 0 plus three frames per caption → .check/*.png and .check/sheet.png
//   node tools/render.js reels/<folder> --frames 0,2.5,7    just those times
//   node tools/render.js reels/<folder> --loop-check        seamless-loop test: compares the first frame with the frame after the last
//
// Options: --out FILE  --fps N  --from S  --to S  --no-audio  --loop (wrap sound tails into the start)  --png (lossless frames, slower)
//          --crf N (quality, default 20; lower is better and bigger)  --keep-wav
// Works with every engine (p5, three, hybrid): the page exposes window.__reel (engines/shared/reel-export.js).
// Frames are drawn by the reel's own deterministic renderer at exact times, so the file is frame-perfect and not limited to real time.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, execSync } = require('child_process');

function loadPlaywright() {
  try { return require('playwright'); } catch (e) {}
  try { return require(path.join(execSync('npm root -g').toString().trim(), 'playwright')); } catch (e) {}
  console.error('✗ Playwright is not installed. Locally: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { o._.push(a); continue; }
    const k = a.slice(2), flag = ['no-audio', 'loop', 'png', 'loop-check', 'keep-wav'].includes(k);
    o[k] = flag ? true : argv[++i];
  }
  return o;
}

const ffmpegOk = () => { try { execSync('ffmpeg -version', { stdio: 'ignore' }); return true; } catch (e) { return false; } };
const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

async function main() {
  const o = args(process.argv.slice(2));
  if (!o._[0]) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 14).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }
  let html = path.resolve(o._[0]);
  if (fs.existsSync(html) && fs.statSync(html).isDirectory()) html = path.join(html, 'index.html');
  if (!fs.existsSync(html)) { console.error(`✗ ${html} not found. Build the reel first: node tools/build.js ${o._[0]}`); process.exit(1); }
  const dir = path.dirname(html), stillsOnly = !!(o.frames || o['loop-check']);
  if (!stillsOnly && !ffmpegOk()) { console.error('✗ ffmpeg is not installed (needed to write the MP4).'); process.exit(1); }

  const { chromium } = loadPlaywright();
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch({
    proxy: proxy ? { server: proxy } : undefined,
    args: ['--autoplay-policy=no-user-gesture-required', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const logs = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));
  await page.goto('file://' + html);
  try { await page.waitForFunction(() => window.__reel, null, { timeout: 30000 }); }
  catch (e) {
    console.error('✗ The page did not start (no window.__reel). Is it built from an engine in engines/? Console:\n  ' + logs.join('\n  '));
    await browser.close(); process.exit(1);
  }
  await page.evaluate(() => window.__reel.ready);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const info = await page.evaluate(() => window.__reel.info());
  const fps = Number(o.fps) || info.fps, t0 = Math.max(0, Number(o.from) || 0), t1 = Math.min(info.len, Number(o.to) || info.len);
  console.log(`${info.title} · ${info.w}×${info.h} · ${info.len.toFixed(2)} s · ${fps} fps · ${info.cues} sound cues`);

  const grab = async (T, type, q) => Buffer.from((await page.evaluate(([T, type, q]) => window.__reel.frame(T, type, q), [T, type, q])).split(',')[1], 'base64');
  const checkDir = path.join(dir, '.check');

  if (o['loop-check']) {
    const d = await page.evaluate(async len => {
      const load = src => new Promise(ok => { const im = new Image(); im.onload = () => ok(im); im.src = src; });
      const a = await load(window.__reel.frame(0)), b = await load(window.__reel.frame(len));
      const c = document.createElement('canvas'); c.width = a.width / 4; c.height = a.height / 4; const x = c.getContext('2d');
      x.drawImage(a, 0, 0, c.width, c.height); const A = x.getImageData(0, 0, c.width, c.height).data;
      x.drawImage(b, 0, 0, c.width, c.height); const B = x.getImageData(0, 0, c.width, c.height).data;
      let s = 0, n = 0; for (let i = 0; i < A.length; i += 4) { s += Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]); n += 3; }
      return s / n;
    }, info.len);
    console.log(`${d < 1 ? '✓' : d < 3 ? '•' : '✗'} loop seam: mean pixel difference ${d.toFixed(2)} (0–255) between frame 0 and the frame after the last (under 1 is invisible)`);
  }

  if (o.frames) {
    let times;
    if (o.frames === 'auto') {
      const marks = [0];   // frame 0, then the start, middle and end of every caption (the timeline every engine shares)
      for (const [a, b] of info.caps) marks.push(Math.min(a + 0.3, (a + b) / 2), (a + b) / 2, Math.max(a, b - 0.1));
      if (!info.caps.length) for (let t = 1; t < info.len; t++) marks.push(t);
      times = [...new Set(marks.concat([info.len - 0.05]).map(t => +Math.max(0, Math.min(t, info.len - 0.01)).toFixed(2)))].sort((a, b) => a - b).slice(0, 48);
    } else times = String(o.frames).split(',').map(Number).filter(t => t >= 0);
    fs.mkdirSync(checkDir, { recursive: true });
    const files = [];
    for (const T of times) { const f = path.join(checkDir, `frame_${T.toFixed(2).padStart(7, '0')}.png`); fs.writeFileSync(f, await grab(Math.min(T, info.len), 'image/png')); files.push(f); }
    console.log(`✓ ${files.length} frames in ${path.relative(process.cwd(), checkDir)}/`);
    if (files.length > 1 && ffmpegOk()) {
      const cols = Math.min(6, files.length), rows = Math.ceil(files.length / cols), sheet = path.join(checkDir, 'sheet.png');
      const inputs = files.flatMap(f => ['-i', f]);
      const filter = files.map((_, i) => `[${i}]scale=216:384,drawtext=text='${times[i].toFixed(2)} s':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6[f${i}]`).join(';')
        + ';' + files.map((_, i) => `[f${i}]`).join('') + `xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 216}_${Math.floor(i / cols) * 384}`).join('|')}:fill=black`;
      try { execSync(`ffmpeg -y -v error ${inputs.map(a => JSON.stringify(a)).join(' ')} -filter_complex ${JSON.stringify(filter)} -frames:v 1 ${JSON.stringify(sheet)}`); console.log(`✓ contact sheet ${path.relative(process.cwd(), sheet)} (${cols}×${rows})`); }
      catch (e) { console.log('• contact sheet skipped (ffmpeg filter failed)'); }
    }
  }

  if (!stillsOnly) {
    const out = path.resolve(o.out || path.join(dir, 'out.mp4')), tmp = out.replace(/\.mp4$/, '') + '.render';
    let wav = null;
    if (!o['no-audio']) {
      const a = await page.evaluate(loop => window.__reel.audio({ loop }), !!o.loop);
      if (a) {
        wav = tmp + '.wav'; fs.writeFileSync(wav, Buffer.from(a.wav, 'base64'));
        console.log(`${a.peakDb > -1 ? '✗' : a.peakDb > -6 ? '•' : '✓'} sound: peak ${a.peakDb.toFixed(1)} dBFS (aim under -6 so a voiceover sits on top)` + (a.errors.length ? `\n✗ sound errors: ${[...new Set(a.errors)].join('; ')}` : ''));
      } else console.log('• no sound cues: the MP4 is silent');
    }
    const png = !!o.png, n = Math.max(1, Math.round((t1 - t0) * fps));
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', png ? 'png' : 'mjpeg', '-framerate', String(fps), '-i', '-',
      ...(wav ? ['-ss', String(t0), '-t', String(t1 - t0), '-i', wav] : []),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', String(o.crf || 20), '-pix_fmt', 'yuv420p', '-r', String(fps),
      ...(wav ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((ok, no) => ff.on('close', c => c ? no(new Error('ffmpeg exited with ' + c)) : ok()));
    const started = Date.now(); let shown = -1;
    for (let i = 0; i < n; i++) {
      const T = t0 + i / fps, buf = await grab(T, png ? 'image/png' : 'image/jpeg', 0.95);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      const pct = Math.floor(100 * (i + 1) / n / 10) * 10;
      if (pct !== shown) { shown = pct; process.stdout.write(`\r  frames ${i + 1}/${n} · ${fmt(T)} · ${((Date.now() - started) / 1000).toFixed(0)} s elapsed`); }
    }
    ff.stdin.end(); await done; process.stdout.write('\n');
    if (wav && !o['keep-wav']) fs.unlinkSync(wav);
    let probe = '';
    try { probe = execSync(`ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of compact ${JSON.stringify(out)}`).toString().trim().replace(/\n/g, ' · '); } catch (e) {}
    console.log(`✓ ${path.relative(process.cwd(), out)} ${(fs.statSync(out).size / 1e6).toFixed(1)} MB${probe ? ' · ' + probe : ''}`);
  }

  const noise = ['Failed to load resource', 'fonts.g', 'AudioContext was not allowed', 'willReadFrequently', 'did not load; captions use a fallback'];   // the last: a race at start-up; frames are drawn after the fonts load
  const problems = [...new Set(logs)].filter(l => !noise.some(n => l.includes(n)));
  console.log(problems.length ? '✗ console:\n  ' + problems.slice(0, 20).join('\n  ') : '✓ no page errors');
  await browser.close();
  if (problems.some(l => l.startsWith('[pageerror]'))) process.exitCode = 1;
}

main().catch(e => { console.error('✗', e.message); process.exit(1); });
