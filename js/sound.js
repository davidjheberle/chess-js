// Sound effects, made with the Web Audio API so there are no audio files to
// load, and the volume setting, which is saved in the browser.

// The sounds that can be played.
export const Sound = {
  MOVE: "move",
  CAPTURE: "capture",
  CHECK: "check",
  CHECKMATE: "checkmate",
  DRAW: "draw",
  BUTTON: "button",
};

// Volume runs from 0 (muted) to MAX_VOLUME.
export const MAX_VOLUME = 10;
const DEFAULT_VOLUME = 7;
const VOLUME_KEY = "chess-js.volume";

let volume = loadVolume();

// Created on the first sound, which always follows a click, since browsers
// only allow audio to start after the player has interacted with the page.
let context = null;

// The saved volume, or the default if there isn't one or storage is blocked.
function loadVolume() {
  try {
    const saved = Number.parseInt(localStorage.getItem(VOLUME_KEY), 10);
    if (saved >= 0 && saved <= MAX_VOLUME) {
      return saved;
    }
  } catch {
    // Storage is unavailable, so the volume just isn't remembered.
  }
  return DEFAULT_VOLUME;
}

export function getVolume() {
  return volume;
}

// Set and save the volume, clamped to 0..MAX_VOLUME.
export function setVolume(value) {
  volume = Math.max(0, Math.min(MAX_VOLUME, value));
  try {
    localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    // Storage is unavailable, so the volume just isn't remembered.
  }
}

// A tone that starts after `start` seconds, rises quickly to `peak` and
// fades out over `duration` seconds, sliding to endFrequency if given.
function tone(
  output,
  { type = "sine", frequency, endFrequency, start = 0, duration, peak },
) {
  const t = context.currentTime + start;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, t);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(
      endFrequency,
      t + duration,
    );
  }
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  oscillator.connect(gain).connect(output);
  oscillator.start(t);
  oscillator.stop(t + duration + 0.02);
}

// A burst of noise around `frequency`, fading out over `duration` seconds:
// the tap at the start of a knock.
function noise(output, { start = 0, duration, frequency, q, peak }) {
  const t = context.currentTime + start;
  const length = Math.ceil(context.sampleRate * duration);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = context.createGain();
  gain.gain.setValueAtTime(peak, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  source.connect(filter).connect(gain).connect(output);
  source.start(t);
}

// A piece set down on the board.
function knock(output, start = 0) {
  noise(output, { start, duration: 0.03, frequency: 1800, q: 2, peak: 0.6 });
  tone(output, {
    start,
    frequency: 220,
    endFrequency: 120,
    duration: 0.07,
    peak: 0.7,
  });
}

// How to make each sound.
const RECIPES = {
  [Sound.MOVE]: (output) => knock(output),
  // A knock, then a lower, heavier one.
  [Sound.CAPTURE]: (output) => {
    knock(output);
    noise(output, {
      start: 0.05,
      duration: 0.05,
      frequency: 1200,
      q: 1.5,
      peak: 0.7,
    });
    tone(output, {
      start: 0.05,
      frequency: 160,
      endFrequency: 70,
      duration: 0.12,
      peak: 0.9,
    });
  },
  // Two quick rising beeps.
  [Sound.CHECK]: (output) => {
    tone(output, {
      type: "square",
      frequency: 660,
      duration: 0.08,
      peak: 0.18,
    });
    tone(output, {
      type: "square",
      frequency: 880,
      start: 0.09,
      duration: 0.1,
      peak: 0.18,
    });
  },
  // A rising arpeggio, C E G C.
  [Sound.CHECKMATE]: (output) => {
    [523, 659, 784, 1047].forEach((frequency, i) => {
      tone(output, {
        type: "triangle",
        frequency,
        start: i * 0.11,
        duration: i === 3 ? 0.45 : 0.14,
        peak: 0.45,
      });
    });
  },
  // Two flat tones at the same pitch.
  [Sound.DRAW]: (output) => {
    tone(output, { frequency: 440, duration: 0.18, peak: 0.4 });
    tone(output, { frequency: 440, start: 0.22, duration: 0.3, peak: 0.4 });
  },
  // A short blip.
  [Sound.BUTTON]: (output) => {
    tone(output, {
      type: "square",
      frequency: 1000,
      duration: 0.025,
      peak: 0.12,
    });
  },
};

// Play a Sound at the current volume.
export function playSound(sound) {
  if (volume === 0) {
    return;
  }
  try {
    context ??= new AudioContext();
  } catch {
    // No Web Audio in this browser, so the game is silent.
    return;
  }
  if (context.state === "suspended") {
    context.resume();
  }
  // Volume is perceived roughly logarithmically, so square it to make each
  // step sound about as big as the last.
  const output = context.createGain();
  output.gain.value = (volume / MAX_VOLUME) ** 2;
  output.connect(context.destination);
  RECIPES[sound](output);
}
