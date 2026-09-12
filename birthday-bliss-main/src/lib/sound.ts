let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, gain = 0.08, type: OscillatorType = "sine") {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const vol = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + start);
  vol.gain.setValueAtTime(0.0001, audio.currentTime + start);
  vol.gain.exponentialRampToValueAtTime(gain, audio.currentTime + start + 0.012);
  vol.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
  osc.connect(vol).connect(audio.destination);
  osc.start(audio.currentTime + start);
  osc.stop(audio.currentTime + start + duration + 0.02);
}

/** Crisp, pleasant UI click. */
export function playClick() {
  tone(880, 0, 0.09, 0.06, "triangle");
  tone(1320, 0.03, 0.08, 0.035, "sine");
}

/** Soft success chime. */
export function playSuccess() {
  [659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22, 0.07, "sine"));
}

/** Gentle error blip. */
export function playError() {
  tone(320, 0, 0.16, 0.06, "triangle");
  tone(220, 0.1, 0.2, 0.05, "triangle");
}

/** Birthday fanfare. */
export function playCelebration() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
    tone(f, i * 0.12, 0.35, 0.08, "triangle"),
  );
}
