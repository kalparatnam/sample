import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';

/* Reveal — scroll-into-view entrance via IntersectionObserver-style hook */
export function Reveal({ children, delay = 0, y = 34, className = '', style }: { children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      style={style}>
      {children}
    </motion.div>
  );
}

/* MagneticButton — wrapper that pulls its child toward the cursor */
export function MagneticButton({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.1 });
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy, display: 'inline-flex' }} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.div>
  );
}

/* TiltCard — 3D parallax tilt toward the pointer */
export function TiltCard({ children, className = '', style, max = 10 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const rX = useTransform(sy, [-0.5, 0.5], [`${max}deg`, `-${max}deg`]);
  const rY = useTransform(sx, [-0.5, 0.5], [`-${max}deg`, `${max}deg`]);
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className} style={{ ...style, rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}>
      {children}
    </motion.div>
  );
}

/* DecryptText — scrambles then resolves; re-runs on hover */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*<>/';
export function DecryptText({ text, auto = true }: { text: string; auto?: boolean }) {
  const [display, setDisplay] = useState(auto ? text.replace(/[^ ]/g, '·') : text);
  const run = () => {
    let iter = 0; const id = setInterval(() => {
      setDisplay(text.split('').map((c, i) => (c === ' ' ? ' ' : i < iter ? text[i] : CHARS[(Math.random() * CHARS.length) | 0])).join(''));
      if (iter >= text.length) clearInterval(id);
      iter += 1 / 2;
    }, 28);
  };
  useEffect(() => { if (auto) run(); /* eslint-disable-next-line */ }, []);
  return <span onMouseEnter={run} style={{ cursor: 'default', fontVariantNumeric: 'tabular-nums' }}>{display}</span>;
}

/* CountUp — animates a number when it scrolls into view */
export function CountUp({ to, suffix = '', prefix = '', duration = 1.6 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* Spotlight — a glow that tracks the cursor across a section (modern,
   reveals the grid beneath the frosted cards). */
export function Spotlight({ children, className = '', style, color = 'rgba(79,70,229,0.14)', size = 460 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; color?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: -9999, y: -9999, on: false });
  return (
    <div ref={ref} className={className}
      onMouseMove={(e) => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top, on: true }); }}
      onMouseLeave={() => setP(s => ({ ...s, on: false }))}
      style={{ position: 'relative', ...style }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 0, opacity: p.on ? 1 : 0, transition: 'opacity .35s', background: `radial-gradient(${size}px circle at ${p.x}px ${p.y}px, ${color}, transparent 62%)` }} />
      {children}
    </div>
  );
}

/* Marquee ticker */
export function Ticker({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`ticker-mask ${className}`} style={{ overflow: 'hidden' }}>
      <div className="ticker-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 30px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)' }} />{t}
          </span>
        ))}
      </div>
    </div>
  );
}
