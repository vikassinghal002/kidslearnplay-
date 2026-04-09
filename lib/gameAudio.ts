/**
 * Procedural game audio — no audio files needed.
 * Uses Web Audio API to synthesize all sounds and music on the fly.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function osc(freq: number, type: OscillatorType, dur: number, vol = 0.3, startTime?: number) {
  const ac = getCtx(); if (!ac) return;
  const t = startTime ?? ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.connect(g); g.connect(ac.destination);
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.start(t); o.stop(t + dur);
}

function noise(dur: number, vol = 0.15, startTime?: number) {
  const ac = getCtx(); if (!ac) return;
  const t = startTime ?? ac.currentTime;
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  src.buffer = buf;
  f.type = "bandpass"; f.frequency.value = 300;
  src.connect(f); f.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.start(t); src.stop(t + dur);
}

// ─── Sound effects ────────────────────────────────────────────────────────────

export const sfx = {
  shoot()       { osc(880, "square", 0.07, 0.2); },
  enemyHit()    { osc(300, "sawtooth", 0.12, 0.25); osc(150, "sawtooth", 0.12, 0.15); },
  playerHit()   { noise(0.2, 0.3); osc(100, "square", 0.3, 0.2); },
  brickHit()    { osc(440 + Math.random() * 200, "square", 0.05, 0.2); },
  paddleHit()   { osc(660, "square", 0.07, 0.2); },
  wallHit()     { osc(330, "triangle", 0.05, 0.15); },
  powerUp()     { [523,659,784,1047].forEach((f,i) => osc(f,"sine",0.12,0.25, (getCtx()?.currentTime??0) + i*0.08)); },
  jump()        { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="square"; o.frequency.setValueAtTime(300,ac.currentTime); o.frequency.exponentialRampToValueAtTime(600,ac.currentTime+0.15); g.gain.setValueAtTime(0.25,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.2); o.start(); o.stop(ac.currentTime+0.2); },
  die()         { [400,300,200,100].forEach((f,i) => osc(f,"sawtooth",0.15,0.3, (getCtx()?.currentTime??0) + i*0.1)); },
  eat()         { osc(880, "sine", 0.08, 0.3); },
  levelUp()     { [523,659,784,1047,1319].forEach((f,i) => osc(f,"sine",0.18,0.3, (getCtx()?.currentTime??0) + i*0.1)); },
  correct()     { [523,659,784].forEach((f,i) => osc(f,"sine",0.15,0.25, (getCtx()?.currentTime??0) + i*0.08)); },
  wrong()       { [300,200].forEach((f,i) => osc(f,"sawtooth",0.15,0.25, (getCtx()?.currentTime??0) + i*0.1)); },
  pop()         { osc(600 + Math.random()*400,"sine",0.1,0.3); },
  click()       { osc(1200,"sine",0.04,0.15); },
  coin()        { osc(1046,"sine",0.08,0.2); osc(1318,"sine",0.08,0.2,(getCtx()?.currentTime??0)+0.06); },
  tap()         { osc(800,"sine",0.05,0.15); },
};

// ─── Background music ─────────────────────────────────────────────────────────

const TUNES: Record<string, { bpm: number; notes: [number, number][] }> = {
  space: {
    bpm: 140,
    notes: [ // C minor pentatonic space vibe
      [261,1],[0,0.5],[329,0.5],[392,1],[0,0.5],[523,0.5],[392,0.5],[329,0.5],
      [261,1],[0,0.5],[220,0.5],[261,1],[0,1],
      [392,1],[0,0.5],[466,0.5],[523,1],[0,0.5],[466,0.5],[392,0.5],[329,0.5],
      [261,2],[0,2],
    ],
  },
  happy: {
    bpm: 160,
    notes: [ // C major happy tune
      [523,0.5],[587,0.5],[659,0.5],[523,0.5],[659,1],[784,1],
      [698,0.5],[659,0.5],[587,0.5],[523,0.5],[587,1],[523,1],
      [523,0.5],[587,0.5],[659,0.5],[784,0.5],[880,1],[784,0.5],[659,0.5],
      [587,0.5],[523,0.5],[440,0.5],[523,0.5],[523,2],
    ],
  },
  adventure: {
    bpm: 130,
    notes: [
      [392,0.5],[440,0.5],[494,0.5],[523,0.5],[494,1],[440,1],
      [392,0.5],[349,0.5],[330,0.5],[294,0.5],[330,1],[349,1],
      [392,0.5],[440,0.5],[494,0.5],[587,0.5],[659,1],[587,0.5],[523,0.5],
      [494,0.5],[440,0.5],[392,0.5],[330,0.5],[392,2],
    ],
  },
};

let musicTimer: ReturnType<typeof setTimeout> | null = null;
let musicPlaying = false;
let currentTune = "";

function playNote(freq: number, dur: number, vol = 0.06) {
  if (freq === 0) return;
  osc(freq, "square", dur * 0.8, vol * 0.4);
  osc(freq / 2, "triangle", dur * 0.8, vol * 0.25);
}

function scheduleTune(tuneName: string, noteIdx: number) {
  if (!musicPlaying || currentTune !== tuneName) return;
  const tune = TUNES[tuneName];
  if (!tune) return;
  const [freq, beats] = tune.notes[noteIdx % tune.notes.length];
  const dur = (60 / tune.bpm) * beats;
  playNote(freq, dur);
  musicTimer = setTimeout(() => scheduleTune(tuneName, noteIdx + 1), dur * 1000);
}

export function startMusic(tuneName: keyof typeof TUNES) {
  if (musicPlaying && currentTune === tuneName) return;
  stopMusic();
  musicPlaying = true;
  currentTune = tuneName;
  scheduleTune(tuneName, 0);
}

export function stopMusic() {
  musicPlaying = false;
  currentTune = "";
  if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
}
