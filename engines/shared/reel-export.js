/** Headless export hook, shared by every engine (p5, three, hybrid). tools/render.js drives it; the page itself never calls it.
 *  exposeReel({ render(T), canvas, timeline: () => TL, sfx: SFX, volume: () => 0..1, ready })
 *  window.__reel.frame(T)  draws the frame at T and returns it as a data URL (read in the same task, so WebGL needs no preserveDrawingBuffer)
 *  window.__reel.audio()   renders every cue offline through the same compressor as the live page and returns a base64 WAV (null when silent)
 *                          { loop: true } wraps the tails of the last sounds into the start, for seamless loops */
function exposeReel(a) {
  const info = () => { const tl = a.timeline(); return { len: tl.len, fps: REEL.fps || 30, title: REEL.title || 'reel', w: a.canvas.width, h: a.canvas.height, cues: tl.cues.length, caps: (tl.caps || []).map(c => [c.t0, Math.min(c.t1, tl.len)]) }; };
  async function audio(o = {}) {
    const tl = a.timeline(), sr = o.sampleRate || 48000, len = tl.len, pass = o.loop ? 2 : 1;
    if (!tl.cues.length || typeof OfflineAudioContext === 'undefined') return null;
    const off = new OfflineAudioContext(2, Math.ceil(len * pass * sr), sr), vol = off.createGain(), comp = off.createDynamicsCompressor(), session = off.createGain();
    vol.gain.value = a.volume ? a.volume() : 0.8;
    comp.threshold.value = -12; comp.knee.value = 8; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    session.connect(vol); vol.connect(comp); comp.connect(off.destination);
    const errors = [];
    for (let k = 0; k < pass; k++) for (const c of tl.cues) {
      const fn = a.sfx[c.type]; if (!fn) { errors.push('unknown sound ' + c.type); continue; }
      try { fn(off, session, Math.max(0, c.time + k * len), c); } catch (e) { errors.push(c.type + ': ' + e.message); }
    }
    const buf = await off.startRendering(), from = o.loop ? Math.floor(len * sr) : 0, n = Math.ceil(len * sr);
    const L = buf.getChannelData(0), R = buf.getChannelData(1), pcm = new DataView(new ArrayBuffer(44 + n * 4));
    const str = (p, s) => { for (let i = 0; i < s.length; i++) pcm.setUint8(p + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); pcm.setUint32(4, 36 + n * 4, true); str(8, 'WAVEfmt '); pcm.setUint32(16, 16, true); pcm.setUint16(20, 1, true); pcm.setUint16(22, 2, true);
    pcm.setUint32(24, sr, true); pcm.setUint32(28, sr * 4, true); pcm.setUint16(32, 4, true); pcm.setUint16(34, 16, true); str(36, 'data'); pcm.setUint32(40, n * 4, true);
    let peak = 0;
    for (let i = 0; i < n; i++) for (let ch = 0; ch < 2; ch++) {
      const v = Math.max(-1, Math.min(1, (ch ? R : L)[from + i] || 0)); peak = Math.max(peak, Math.abs(v)); pcm.setInt16(44 + i * 4 + ch * 2, v * 32767, true);
    }
    const bytes = new Uint8Array(pcm.buffer); let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return { wav: btoa(bin), peakDb: peak > 0 ? 20 * Math.log10(peak) : -Infinity, errors };
  }
  window.__reel = { ready: Promise.resolve(a.ready).then(() => true), info, audio, frame(T, type = 'image/png', q) { a.render(T); return a.canvas.toDataURL(type, q); } };
}
