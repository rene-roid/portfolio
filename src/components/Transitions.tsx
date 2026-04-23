import React, { useEffect, useState } from 'react';
import type { TransitionProps } from '../types';

// v1-style transitions: CSS-transition driven by a 0→1 state flip, onDone via setTimeout.
// The parent must key this component uniquely per phase so it remounts on cover→reveal.

function SlashTransition({ color, phase, onDone }: TransitionProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => setT(1));
    const id = setTimeout(onDone, 380);
    return () => clearTimeout(id);
  }, []);
  const covering = phase === 'cover';
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div style={{
        position: 'absolute', width: '160%', height: '60%',
        left: '-30%', top: '-10%', background: color,
        transform: `skewY(-12deg) translateX(${covering ? (t ? 0 : -120) : (t ? -120 : 0)}%)`,
        transition: 'transform 360ms cubic-bezier(.8,0,.2,1)',
      }} />
      <div style={{
        position: 'absolute', width: '160%', height: '60%',
        left: '-30%', bottom: '-10%', background: color,
        transform: `skewY(-12deg) translateX(${covering ? (t ? 0 : 120) : (t ? 120 : 0)}%)`,
        transition: 'transform 360ms cubic-bezier(.8,0,.2,1)',
      }} />
    </div>
  );
}

function BarsTransition({ color, phase, onDone }: TransitionProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => setT(1));
    const id = setTimeout(onDone, 500);
    return () => clearTimeout(id);
  }, []);
  const covering = phase === 'cover';
  const N = 8;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col">
      {Array.from({ length: N }).map((_, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const delay = i * 30;
        const x = covering ? (t ? 0 : dir * 120) : (t ? dir * 120 : 0);
        return (
          <div key={i} style={{
            flex: 1, background: color,
            transform: `translateX(${x}%)`,
            transition: `transform 380ms cubic-bezier(.7,0,.2,1) ${delay}ms`,
          }} />
        );
      })}
    </div>
  );
}

function GlitchTransition({ color: _color, phase, onDone }: TransitionProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => setT(1));
    const id = setTimeout(onDone, 520);
    return () => clearTimeout(id);
  }, []);
  const covering = phase === 'cover';
  const slabs = [
    { c: '#ff3b8a', d: -8, off: -3 },
    { c: '#4fd6ff', d: 0,  off: 0  },
    { c: '#ffd23f', d: 8,  off: 3  },
  ];
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" style={{ mixBlendMode: 'screen' }}>
      {slabs.map((s, i) => {
        const y = covering ? (t ? 0 : -110) : (t ? -110 : 0);
        return (
          <div key={i} className="absolute inset-0" style={{
            background: s.c,
            transform: `translateY(${y}%) skewX(${s.d}deg) translateX(${s.off}%)`,
            transition: `transform 420ms cubic-bezier(.85,.05,.1,1) ${i * 40}ms`,
            opacity: 0.95,
          }} />
        );
      })}
      <div className="absolute inset-0" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 4px)',
        opacity: covering ? t * 0.6 : (1 - t) * 0.6,
        transition: 'opacity 300ms',
      }} />
    </div>
  );
}

function IrisTransition({ color, phase, onDone }: TransitionProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => setT(1));
    const id = setTimeout(onDone, 500);
    return () => clearTimeout(id);
  }, []);
  const covering = phase === 'cover';
  const r = covering ? (t ? 180 : 0) : (t ? 0 : 180);
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute" style={{
        left: '50%', top: '50%', width: '10vmax', height: '10vmax',
        transform: `translate(-50%,-50%) scale(${r / 10})`,
        background: color, borderRadius: '50%',
        transition: 'transform 460ms cubic-bezier(.8,0,.2,1)',
      }} />
      <div className="absolute" style={{
        left: '50%', top: '50%', width: '30vmax', height: '30vmax',
        transform: `translate(-50%,-50%) rotate(${covering ? t * 360 : (1 - t) * 360}deg)`,
        transition: 'transform 500ms linear',
        border: `2px dashed ${color}`, borderRadius: '50%',
        opacity: covering ? t : 1 - t,
      }} />
    </div>
  );
}

function StripeTransition({ color, phase, onDone }: TransitionProps) {
  const [t, setT] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => setT(1));
    const id = setTimeout(onDone, 520);
    return () => clearTimeout(id);
  }, []);
  const covering = phase === 'cover';
  const N = 14;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex">
      {Array.from({ length: N }).map((_, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const delay = Math.abs(i - N / 2) * 18;
        const y = covering ? (t ? 0 : dir * 120) : (t ? dir * 120 : 0);
        return (
          <div key={i} style={{
            flex: 1, background: i % 2 === 0 ? color : '#ffffff',
            transform: `translateY(${y}%)`,
            transition: `transform 420ms cubic-bezier(.7,0,.2,1) ${delay}ms`,
          }} />
        );
      })}
    </div>
  );
}

const TRANSITIONS: Record<string, React.ComponentType<TransitionProps>> = {
  slash:  SlashTransition,
  bars:   BarsTransition,
  glitch: GlitchTransition,
  iris:   IrisTransition,
  stripe: StripeTransition,
};

export function Transition({ kind, color, phase, onDone }: TransitionProps & { kind: string }) {
  const Comp = TRANSITIONS[kind] ?? SlashTransition;
  return <Comp color={color} phase={phase} onDone={onDone} />;
}
