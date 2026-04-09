/**
 * Procedural game audio — no audio files needed.
 * Uses Web Audio API to synthesize all sounds and music on the fly.
 */

let ctx: AudioContext | null = null;
let globalMuted = false;

export function setGlobalMuted(m: boolean) { globalMuted = m; }
export function isGlobalMuted() { return globalMuted; }

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (globalMuted) return null;
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

  // ── Toddler / educational ────────────────────────────────────────────
  letterPop()   { osc(1200 + Math.random()*300,"sine",0.08,0.25); osc(1800,"sine",0.05,0.15,(getCtx()?.currentTime??0)+0.04); },
  bubbleBurst() { osc(1500 + Math.random()*500,"sine",0.05,0.2); osc(900 + Math.random()*300,"sine",0.06,0.15,(getCtx()?.currentTime??0)+0.03); },
  cardFlip()    { osc(480,"triangle",0.05,0.2); osc(620,"triangle",0.04,0.15,(getCtx()?.currentTime??0)+0.03); },
  cardMatch()   { [659,784,988].forEach((f,i) => osc(f,"sine",0.12,0.25, (getCtx()?.currentTime??0) + i*0.06)); },
  dotConnect()  { osc(700,"triangle",0.06,0.2); osc(900,"sine",0.05,0.15,(getCtx()?.currentTime??0)+0.03); },
  pictureReveal(){ [523,659,784,988,1175].forEach((f,i) => osc(f,"sine",0.18,0.28, (getCtx()?.currentTime??0) + i*0.09)); },
  sortDrop()    { osc(440,"square",0.06,0.2); osc(330,"triangle",0.08,0.15,(getCtx()?.currentTime??0)+0.04); },
  sparkle()     { [1200,1500,1800,2100].forEach((f,i) => osc(f,"sine",0.08,0.15, (getCtx()?.currentTime??0) + i*0.04)); },
  magicChime()  { [784,988,1175,1319].forEach((f,i) => osc(f,"triangle",0.2,0.22, (getCtx()?.currentTime??0) + i*0.07)); },
  wordComplete(){ [523,659,784,1047].forEach((f,i) => osc(f,"sine",0.14,0.25, (getCtx()?.currentTime??0) + i*0.07)); },
  pageFlip()    { noise(0.08, 0.15); osc(660,"triangle",0.05,0.12,(getCtx()?.currentTime??0)+0.02); },
  storyChime()  { osc(880,"sine",0.3,0.2); osc(1100,"sine",0.3,0.15,(getCtx()?.currentTime??0)+0.1); },
  combo()       { [659,784,988,1175,1319,1568].forEach((f,i) => osc(f,"square",0.08,0.2, (getCtx()?.currentTime??0) + i*0.05)); },
  count()       { osc(800,"sine",0.06,0.22); },

  // ── Procedural animal sounds (best-effort approximations) ────────────
  moo()         { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(140,ac.currentTime); o.frequency.linearRampToValueAtTime(110,ac.currentTime+0.5); g.gain.setValueAtTime(0.3,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.6); o.start(); o.stop(ac.currentTime+0.6); },
  woof()        { const ac=getCtx(); if(!ac) return; [0,0.16].forEach(delay => { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(220,ac.currentTime+delay); o.frequency.exponentialRampToValueAtTime(130,ac.currentTime+delay+0.12); g.gain.setValueAtTime(0.3,ac.currentTime+delay); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+delay+0.15); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+0.15); }); },
  meow()        { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="triangle"; o.frequency.setValueAtTime(500,ac.currentTime); o.frequency.exponentialRampToValueAtTime(700,ac.currentTime+0.15); o.frequency.exponentialRampToValueAtTime(400,ac.currentTime+0.35); g.gain.setValueAtTime(0.25,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.4); o.start(); o.stop(ac.currentTime+0.4); },
  roar()        { const ac=getCtx(); if(!ac) return; noise(0.5, 0.3); const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(90,ac.currentTime); o.frequency.linearRampToValueAtTime(70,ac.currentTime+0.5); g.gain.setValueAtTime(0.35,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.6); o.start(); o.stop(ac.currentTime+0.6); },
  oink()        { const ac=getCtx(); if(!ac) return; [0,0.1].forEach(delay => { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(300,ac.currentTime+delay); o.frequency.linearRampToValueAtTime(200,ac.currentTime+delay+0.08); g.gain.setValueAtTime(0.25,ac.currentTime+delay); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+delay+0.12); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+0.12); }); },
  baa()         { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="triangle"; o.frequency.setValueAtTime(350,ac.currentTime); const lfo=ac.createOscillator(),lfoG=ac.createGain(); lfo.frequency.value=8; lfoG.gain.value=20; lfo.connect(lfoG); lfoG.connect(o.frequency); g.gain.setValueAtTime(0.25,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.45); o.start(); lfo.start(); o.stop(ac.currentTime+0.45); lfo.stop(ac.currentTime+0.45); },
  cluck()       { const ac=getCtx(); if(!ac) return; [0,0.08,0.16].forEach(delay => { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="square"; o.frequency.setValueAtTime(800,ac.currentTime+delay); g.gain.setValueAtTime(0.2,ac.currentTime+delay); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+delay+0.05); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+0.05); }); },
  quack()       { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(380,ac.currentTime); o.frequency.linearRampToValueAtTime(250,ac.currentTime+0.2); g.gain.setValueAtTime(0.25,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.25); o.start(); o.stop(ac.currentTime+0.25); },
  neigh()       { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(600,ac.currentTime); o.frequency.linearRampToValueAtTime(300,ac.currentTime+0.3); o.frequency.linearRampToValueAtTime(450,ac.currentTime+0.5); g.gain.setValueAtTime(0.25,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.6); o.start(); o.stop(ac.currentTime+0.6); },
  frog()        { const ac=getCtx(); if(!ac) return; [0,0.12].forEach(delay => { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="square"; o.frequency.setValueAtTime(180,ac.currentTime+delay); g.gain.setValueAtTime(0.25,ac.currentTime+delay); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+delay+0.08); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+0.08); }); },
  elephant()    { const ac=getCtx(); if(!ac) return; const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="sawtooth"; o.frequency.setValueAtTime(250,ac.currentTime); o.frequency.linearRampToValueAtTime(400,ac.currentTime+0.2); o.frequency.linearRampToValueAtTime(200,ac.currentTime+0.5); g.gain.setValueAtTime(0.3,ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.6); o.start(); o.stop(ac.currentTime+0.6); },
  monkey()      { const ac=getCtx(); if(!ac) return; [0,0.08,0.18].forEach(delay => { const o=ac.createOscillator(),g=ac.createGain(); o.connect(g);g.connect(ac.destination); o.type="triangle"; o.frequency.setValueAtTime(700 + delay*500,ac.currentTime+delay); g.gain.setValueAtTime(0.25,ac.currentTime+delay); g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+delay+0.1); o.start(ac.currentTime+delay); o.stop(ac.currentTime+delay+0.1); }); },

  // Generic animal sound (used if specific one missing)
  animal(kind: string) {
    const k = kind.toLowerCase();
    if (k.includes("cow")) this.moo();
    else if (k.includes("dog") || k.includes("puppy")) this.woof();
    else if (k.includes("cat") || k.includes("kitten")) this.meow();
    else if (k.includes("lion") || k.includes("tiger") || k.includes("bear")) this.roar();
    else if (k.includes("pig")) this.oink();
    else if (k.includes("sheep") || k.includes("goat")) this.baa();
    else if (k.includes("chicken") || k.includes("hen")) this.cluck();
    else if (k.includes("duck")) this.quack();
    else if (k.includes("horse")) this.neigh();
    else if (k.includes("frog")) this.frog();
    else if (k.includes("elephant")) this.elephant();
    else if (k.includes("monkey") || k.includes("ape")) this.monkey();
    else this.pop();
  },
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
  // Slow twinkle-twinkle style for toddler/preschool games
  twinkle: {
    bpm: 110,
    notes: [
      [523,1],[523,1],[784,1],[784,1],[880,1],[880,1],[784,2],
      [698,1],[698,1],[659,1],[659,1],[587,1],[587,1],[523,2],
      [784,1],[784,1],[698,1],[698,1],[659,1],[659,1],[587,2],
      [784,1],[784,1],[698,1],[698,1],[659,1],[659,1],[587,2],
    ],
  },
  // Bouncy kid-friendly tune
  playful: {
    bpm: 170,
    notes: [
      [523,0.5],[659,0.5],[784,0.5],[1047,0.5],[784,0.5],[659,0.5],[523,1],
      [587,0.5],[740,0.5],[880,0.5],[1175,0.5],[880,0.5],[740,0.5],[587,1],
      [659,0.5],[784,0.5],[988,0.5],[1319,0.5],[988,0.5],[784,0.5],[659,1],
      [523,0.5],[0,0.5],[1047,0.5],[0,0.5],[784,1],[523,2],
    ],
  },
  // Slow, mysterious minor key for story/word games
  mystery: {
    bpm: 100,
    notes: [
      [294,1],[0,0.5],[349,0.5],[440,1],[0,0.5],[523,0.5],[440,0.5],[349,0.5],
      [294,1],[0,0.5],[262,0.5],[294,2],[0,1],
      [349,1],[0,0.5],[415,0.5],[494,1],[0,0.5],[440,0.5],[349,0.5],[294,0.5],
      [262,2],[0,2],
    ],
  },
  // Upbeat quirky tune for math quiz games
  quirky: {
    bpm: 150,
    notes: [
      [440,0.5],[587,0.5],[440,0.5],[659,0.5],[440,0.5],[784,0.5],[698,1],
      [659,0.5],[587,0.5],[523,0.5],[494,0.5],[523,1],[440,1],
      [523,0.5],[659,0.5],[784,0.5],[880,0.5],[988,0.5],[1047,0.5],[880,1],
      [784,0.5],[659,0.5],[587,0.5],[523,0.5],[440,2],
    ],
  },
  // Peaceful for focus-required games (pattern, memory, dots)
  calm: {
    bpm: 90,
    notes: [
      [440,1.5],[0,0.5],[523,1.5],[0,0.5],[659,1],[587,1],[523,2],
      [494,1.5],[0,0.5],[440,1.5],[0,0.5],[523,1],[587,1],[494,2],
      [440,1],[523,1],[587,1],[659,1],[587,1],[523,1],[440,2],
    ],
  },
  // Heroic quest vibe for spelling/word games
  quest: {
    bpm: 125,
    notes: [
      [392,0.75],[494,0.25],[587,1],[494,0.75],[392,0.25],[330,1],
      [440,0.75],[523,0.25],[659,1],[523,0.75],[440,0.25],[349,1],
      [587,0.5],[494,0.5],[440,0.5],[392,0.5],[494,1],[587,1],[392,2],
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
