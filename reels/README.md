# Reels

Working folders, one per reel: `reels/<YYYY-MM-DD>-<topic>/`. **They are never committed** (`.gitignore` has `reels/*`): the user receives `out.mp4` and `index.html` as files, and the repo stays the studio, not an archive. `index.html` carries the reel's own `reel.js`, `script.md`, `reel.json` and images, so `node tools/unpack-reel.js <index.html>` brings a reel back for a later revision.

Start one with:

```bash
node tools/new-reel.js "why savings shrink" --skill educational
```

| File | What it is |
|---|---|
| `script.md` | The script word for word, the brief, the agreed plan, the image brief (image-led reels) and review notes |
| `reel.json` | Title, date, skill and its version, engine, status (`script` → `planned` → `built` → `rendered` → `posted`) |
| `images/` | Generated or supplied images; the file name is the label used in the code |
| `reel.js` | The reel itself: script data, scenes, sounds. The only code written per reel |
| `index.html` | Built by `node tools/build.js`: open it in Chrome, Edge or Safari to preview, change the end-screen hold, or record. It is also the reel's project file |
| `out.mp4` | Rendered by `node tools/render.js`: 1080×1920 H.264 with AAC sound, ready to post (voiceover is added in the editor from 0:00). Sent to the user as a file |
| `prompts.md` | AI video prompts or ideas (`ai-video`), when there are any |
| `.check/` | Check frames and contact sheet |

Reference reels for a series live in that skill's `example/` folder (for example `.claude/skills/educational/example/`).
