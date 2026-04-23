import { useEffect, useState } from 'react';

type Listener = () => void;

class AudioPlayerSingleton {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private _analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private _playing = false;
  private _volume = 0.09;
  private _progress = 0;
  private listeners = new Set<Listener>();
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const audio = new Audio('/MusicMenu%20Update.mp3');
    audio.loop = true;
    audio.volume = 1; // gain node controls volume after AudioContext is created
    this.audio = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        this._progress = audio.currentTime / audio.duration;
        this.notify();
      }
    });

    const tryPlay = () => {
      audio.play().then(() => {
        this._playing = true;
        this.initCtx();
        this.notify();
      }).catch(() => {});
    };

    audio.play().then(() => {
      this._playing = true;
      this.initCtx();
      this.notify();
    }).catch(() => {
      // Autoplay blocked — play on first user interaction
      const opts = { once: true } as const;
      document.addEventListener('click',      tryPlay, opts);
      document.addEventListener('keydown',    tryPlay, opts);
      document.addEventListener('touchstart', tryPlay, opts);
    });
  }

  private initCtx() {
    if (this.audioCtx || !this.audio) return;
    const ctx = new AudioContext();
    this.audioCtx = ctx;

    // Analyser taps the raw signal — gain controls output volume after it
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    an.smoothingTimeConstant = 0.91;

    const gain = ctx.createGain();
    gain.gain.value = this._volume;
    this.gainNode = gain;

    const src = ctx.createMediaElementSource(this.audio);
    this.audio.volume = 1; // volume is controlled by gainNode, not the element
    src.connect(an);
    an.connect(gain);
    gain.connect(ctx.destination);

    this._analyser = an;
    this.notify();
  }

  toggle() {
    if (!this.audio) return;
    if (this._playing) {
      this.audio.pause();
      this._playing = false;
    } else {
      this.initCtx();
      this.audioCtx?.resume().then(() => this.audio!.play());
      this._playing = true;
    }
    this.notify();
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.gainNode) this.gainNode.gain.value = this._volume;
    this.notify();
  }

  get playing() { return this._playing; }
  get volume() { return this._volume; }
  get progress() { return this._progress; }
  get analyser() { return this._analyser; }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const audioPlayer = new AudioPlayerSingleton();

export function useAudioPlayer() {
  const [, tick] = useState(0);
  useEffect(() => audioPlayer.subscribe(() => tick(n => n + 1)), []);
  return {
    playing: audioPlayer.playing,
    volume: audioPlayer.volume,
    progress: audioPlayer.progress,
    analyser: audioPlayer.analyser,
    toggle: () => audioPlayer.toggle(),
    setVolume: (v: number) => audioPlayer.setVolume(v),
  };
}
