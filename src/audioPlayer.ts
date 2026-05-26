import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Zustand store (persisted to localStorage) ────────────────────────────────
interface AudioState {
  playing: boolean;
  volume: number;
  muted: boolean;
  lastVolume: number;
  setPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      playing: false,
      volume: 0.4,
      muted: false,
      lastVolume: 0.4,
      setPlaying: (v) => set({ playing: v }),
      setVolume:  (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
      toggleMute: () => {
        const { muted, volume, lastVolume } = get();
        if (muted) {
          // unmute — restore last volume
          set({ muted: false, volume: lastVolume });
        } else {
          // mute — save current volume, set to 0
          set({ muted: true, lastVolume: volume > 0 ? volume : lastVolume, volume: 0 });
        }
      },
    }),
    {
      name: 'audio-player', // localStorage key
      partialize: (s) => ({ playing: s.playing, volume: s.volume, muted: s.muted, lastVolume: s.lastVolume }),
    }
  )
);

// ── Singleton (audio engine) ─────────────────────────────────────────────────
type Listener = () => void;

class AudioPlayerSingleton {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private _analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private _progress = 0;
  private listeners = new Set<Listener>();
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Restore persisted volume immediately
    const { volume, playing } = useAudioStore.getState();

    const audio = new Audio('/MusicMenu%20Update.mp3');
    audio.loop = true;
    audio.volume = 1; // gain node controls actual volume
    this.audio = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const p = audio.currentTime / audio.duration;
        if (Math.abs(p - this._progress) > 0.005) {
          this._progress = p;
          this.notify();
        }
      }
    });

    const tryPlay = () => {
      audio.play().then(() => {
        useAudioStore.getState().setPlaying(true);
        this.initCtx();
        this.notify();
      }).catch(() => {});
    };

    if (playing) {
      // User had it playing — autoplay attempt
      audio.play().then(() => {
        useAudioStore.getState().setPlaying(true);
        this.initCtx();
        this.notify();
      }).catch(() => {
        // Autoplay blocked — wait for interaction
        const opts = { once: true } as const;
        document.addEventListener('click',      tryPlay, opts);
        document.addEventListener('keydown',    tryPlay, opts);
        document.addEventListener('touchstart', tryPlay, opts);
      });
    } else {
      // Was paused — stay paused, just apply stored volume when ctx ready
      // Volume will be applied once initCtx() is called on first toggle
    }

    // Apply persisted volume to gain node once context exists
    this._volume_pending = volume;
  }

  private _volume_pending = 0.4;

  private initCtx() {
    if (this.audioCtx || !this.audio) return;
    const ctx = new AudioContext();
    this.audioCtx = ctx;

    const an = ctx.createAnalyser();
    an.fftSize = 256;
    an.smoothingTimeConstant = 0.91;

    const gain = ctx.createGain();
    gain.gain.value = this._volume_pending; // restored from localStorage
    this.gainNode = gain;

    const src = ctx.createMediaElementSource(this.audio);
    this.audio.volume = 1;
    src.connect(an);
    an.connect(gain);
    gain.connect(ctx.destination);

    this._analyser = an;
    this.notify();
  }

  toggle() {
    if (!this.audio) return;
    const playing = useAudioStore.getState().playing;
    if (playing) {
      this.audio.pause();
      useAudioStore.getState().setPlaying(false);
    } else {
      this.initCtx();
      this.audioCtx?.resume().then(() => this.audio!.play());
      useAudioStore.getState().setPlaying(true);
    }
    this.notify();
  }

  setVolume(v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    this._volume_pending = clamped;
    if (this.gainNode) this.gainNode.gain.value = clamped;
    // If user drags slider while muted, unmute
    const store = useAudioStore.getState();
    if (store.muted && clamped > 0) useAudioStore.setState({ muted: false });
    store.setVolume(clamped);
    this.notify();
  }

  toggleMute() {
    useAudioStore.getState().toggleMute();
    const newVol = useAudioStore.getState().volume;
    this._volume_pending = newVol;
    if (this.gainNode) this.gainNode.gain.value = newVol;
    this.notify();
  }

  get playing() { return useAudioStore.getState().playing; }
  get volume()  { return useAudioStore.getState().volume; }
  get progress(){ return this._progress; }
  get analyser(){ return this._analyser; }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const audioPlayer = new AudioPlayerSingleton();

// ── React hook ───────────────────────────────────────────────────────────────
export function useAudioPlayer() {
  // Subscribe to Zustand store (re-renders on playing/volume/muted change)
  const playing = useAudioStore(s => s.playing);
  const volume  = useAudioStore(s => s.volume);
  const muted   = useAudioStore(s => s.muted);

  // Subscribe to singleton for progress + analyser (not in store)
  const [, tick] = useState(0);
  useEffect(() => audioPlayer.subscribe(() => tick(n => n + 1)), []);

  return {
    playing,
    volume,
    muted,
    progress:    audioPlayer.progress,
    analyser:    audioPlayer.analyser,
    toggle:      () => audioPlayer.toggle(),
    setVolume:   (v: number) => audioPlayer.setVolume(v),
    toggleMute:  () => audioPlayer.toggleMute(),
  };
}
