#!/usr/bin/env python3
"""Render and sanity-check a reel built from the reel-creator template.

Usage:
  python check_reel.py index.html [--out reel_check] [--times 0,1.5,4] [--record]

What it does (headless Chromium via Playwright):
  * serves p5.js from a local cache if the CDN is unreachable (downloads it once from the CDN or GitHub)
  * lists scenes, caption chunks and SFX cues, and reports console errors and scene errors
  * renders frames (default: frame 0 plus the start, middle and end of every scene) to PNGs
    and a contact sheet (sheet.png) to look at
  * --record clicks "Record & Download", saves the video and prints its streams and duration (needs ffprobe)
"""
import argparse, base64, json, pathlib, re, subprocess, sys, urllib.request

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("html")
    ap.add_argument("--out", default="reel_check")
    ap.add_argument("--times", help="comma-separated seconds to render (default: per-scene sample)")
    ap.add_argument("--record", action="store_true", help="also run Record & Download (takes the reel's length in real time)")
    a = ap.parse_args()
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("Playwright is not installed (pip install playwright && playwright install chromium).")

    html = pathlib.Path(a.html).resolve()
    out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
    src = html.read_text(encoding="utf-8")
    m = re.search(r"p5@([\d.]+)", src)
    version = m.group(1) if m else "1.11.10"
    p5 = load_p5(version)

    def route(r):
        u = r.request.url
        if u.endswith("p5.min.js") and p5:
            return r.fulfill(body=p5, content_type="application/javascript")
        return r.continue_()

    logs = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        ctx = b.new_context(viewport={"width": 1440, "height": 900}, accept_downloads=True)
        ctx.route("https://**/*", route)
        pg = ctx.new_page()
        pg.on("console", lambda msg: logs.append((msg.type, msg.text)))
        pg.on("pageerror", lambda e: logs.append(("pageerror", str(e))))
        pg.goto(html.as_uri())
        try:
            pg.wait_for_function("typeof TL !== 'undefined' && !!TL && typeof canvasEl !== 'undefined' && !!canvasEl", timeout=20000)
        except Exception:
            print("Page did not initialise. Console:"); [print(" ", t, x) for t, x in logs]; sys.exit(1)
        pg.wait_for_timeout(800)  # fonts
        info = pg.evaluate("""() => ({
            size: [canvasEl.width, canvasEl.height], len: TL.len,
            font: STYLE.font, fontLoaded: fontLoaded(STYLE.font),
            scenes: TL.lines.map(l => ({ scene: l.scene, v0: +l.v0.toFixed(2), v1: +l.v1.toFixed(2), defined: !!SCENES[l.scene], transition: l.transition || 'cut' })),
            captions: TL.caps.map(c => { const L = layoutCaption(c); return { t: [+c.t0.toFixed(2), +c.t1.toFixed(2)], lines: L.lines.map(x => x.words.map(w => w.w).join(' ')), size: L.size }; }),
            cues: TL.cues.map(c => [+c.time.toFixed(2), c.type, !!SFX[c.type]]), mime: pickMime() })""")
        print(f"Canvas {info['size'][0]}x{info['size'][1]}  length {info['len']}s  record format {info['mime']}")
        print(f"Caption font '{info['font']}' loaded: {info['fontLoaded']}  (if False, captions use a fallback font: check the <head> font link)")
        print("\nScenes:")
        for s in info["scenes"]:
            print(f"  {s['v0']:>6} – {s['v1']:<6} {s['scene']:<18} {s['transition']}{'' if s['defined'] else '   <-- NOT DEFINED in SCENES'}")
        print("\nCaptions:")
        for c in info["captions"]:
            print(f"  {c['t'][0]:>6} – {c['t'][1]:<6} [{c['size']}px] " + " / ".join(c["lines"]))
        print("\nSFX cues:")
        print("  " + ", ".join(f"{t}s {ty}{'' if ok else ' (UNKNOWN)'}" for t, ty, ok in info["cues"]))

        if a.times:
            times = [float(x) for x in a.times.split(",")]
        else:
            times = [0.0]
            for s in info["scenes"]:
                d = s["v1"] - s["v0"]
                times += [s["v0"] + min(0.35, d / 3), s["v0"] + d / 2, max(s["v0"], s["v1"] - 0.15)]
            times = sorted({round(min(t, info["len"] - 0.01), 2) for t in times})
        files = []
        for t in times:
            url = pg.evaluate(f"(seek({t}), canvasEl.toDataURL('image/png'))")
            f = out / f"frame_{t:07.2f}.png"; f.write_bytes(base64.b64decode(url.split(",")[1])); files.append((t, f))
        scene_errors = pg.evaluate("[...errorsSeen]")
        sheet = contact_sheet(files, out / "sheet.png")
        print(f"\nRendered {len(files)} frames to {out}/" + (f"  contact sheet: {sheet}" if sheet else ""))

        if a.record:
            with pg.expect_download(timeout=int(info["len"] * 1000 * 3 + 30000)) as dl:
                pg.click("#btnRec")
            f = out / dl.value.suggested_filename; dl.value.save_as(str(f))
            print(f"\nRecorded {f}  status: {pg.inner_text('#status')}")
            try:
                probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height",
                                        "-of", "compact", str(f)], capture_output=True, text=True).stdout
                print(probe.strip())
            except FileNotFoundError:
                print("(ffprobe not found; skipped stream check)")
        b.close()

    noise = ("Failed to load resource", "fonts.g")
    problems = [(t, x) for t, x in logs if t in ("error", "pageerror", "warning") and not any(n in x for n in noise)]
    if scene_errors: print("\nSCENE ERRORS:"); [print("  " + e) for e in scene_errors]
    if problems: print("\nConsole problems:"); [print(f"  [{t}] {x}") for t, x in problems]
    if not scene_errors and not problems: print("\nNo scene or console errors.")

def load_p5(version):
    cache = pathlib.Path.home() / ".cache" / "reel-creator" / f"p5-{version}.min.js"
    if cache.exists(): return cache.read_text()
    for url in (f"https://cdn.jsdelivr.net/npm/p5@{version}/lib/p5.min.js",
                f"https://github.com/processing/p5.js/releases/download/v{version}/p5.min.js"):
        try:
            data = urllib.request.urlopen(url, timeout=30).read().decode("utf-8")
            if "p5" in data[:200]:
                cache.parent.mkdir(parents=True, exist_ok=True); cache.write_text(data); return data
        except Exception:
            continue
    print("Could not fetch p5.js locally; relying on the page's CDN.")
    return None

def contact_sheet(files, dest):
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    w, h, cols = 216, 384, 6
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 26) + 8), (24, 24, 24))
    d = ImageDraw.Draw(sheet)
    for i, (t, f) in enumerate(files):
        x, y = 8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 26)
        sheet.paste(Image.open(f).convert("RGB").resize((w, h)), (x, y + 18)); d.text((x, y + 2), f"{t:.2f}s", fill=(230, 230, 230))
    sheet.save(dest); return dest

if __name__ == "__main__":
    main()
