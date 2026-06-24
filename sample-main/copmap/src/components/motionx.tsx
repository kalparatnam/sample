import React, { useRef, useState, useEffect } from 'react';
import {
  motion, AnimatePresence, useScroll, useSpring, useTransform, useVelocity,
  useMotionValue, useAnimationFrame, useMotionTemplate, useInView, useMotionValueEvent, useReducedMotion,
  type Variants, type PanInfo, type MotionValue,
} from 'framer-motion';

/* ════════════════════════════════════════════════════════════════════
   MOTIONX — a toolkit of unique, light-theme-native motion primitives.
   Everything here is built to sit on the pearl/glass canvas (indigo →
   azure → teal, amber signal). No dark-theme assumptions.
   ════════════════════════════════════════════════════════════════════ */

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* ── 1. ScrollProgress ──────────────────────────────────────────────
   Slim gradient beam pinned to the very top that fills as you scroll.  */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div aria-hidden style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60,
      transformOrigin: '0% 50%', scaleX,
      background: 'linear-gradient(90deg, var(--indigo), var(--azure) 50%, var(--teal))',
      boxShadow: '0 0 14px var(--glow-indigo)', borderRadius: 2,
    }} />
  );
}

/* ── 2. VelocityMarquee ─────────────────────────────────────────────
   A kinetic band that auto-scrolls, but speeds up, slows, reverses and
   skews based on the page's scroll velocity. Renders its children 4×.  */
function VelocityMarqueeInner({ children, baseVelocity }: { children: React.ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollV = useVelocity(scrollY);
  const smoothV = useSpring(scrollV, { damping: 50, stiffness: 380 });
  const factor = useTransform(smoothV, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothV, [-1500, 0, 1500], [-7, 0, 7], { clamp: true });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <motion.div style={{ x, skewX: skew, display: 'flex', willChange: 'transform' }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ flexShrink: 0, display: 'inline-flex' }}>{children}</span>
      ))}
    </motion.div>
  );
}

export function VelocityMarquee({ children, baseVelocity = 4 }: { children: React.ReactNode; baseVelocity?: number }) {
  const reduced = useReducedMotion();
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {reduced
        ? <div style={{ display: 'flex' }}>{children}</div>
        : <VelocityMarqueeInner baseVelocity={baseVelocity}>{children}</VelocityMarqueeInner>}
    </div>
  );
}

/* ── 3. WordReveal ──────────────────────────────────────────────────
   Plain text where every word springs up from behind a mask, staggered. */
export function WordReveal({ text, className = '', style, delay = 0, stagger = 0.05 }: { text: string; className?: string; style?: React.CSSProperties; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <span ref={ref} className={className} style={{ display: 'inline-block', ...style }}>
      {text.split(' ').map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span style={{ display: 'inline-block', willChange: 'transform' }}
            initial={{ y: '115%' }} animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}>
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── 4. FlowText ────────────────────────────────────────────────────
   Gradient text where the colour stop perpetually flows across.        */
export function FlowText({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.span className={className}
      style={{
        backgroundImage: 'linear-gradient(110deg, var(--indigo), var(--azure) 35%, var(--teal) 55%, var(--indigo))',
        backgroundSize: '250% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent', display: 'inline-block', ...style,
      }}
      animate={{ backgroundPositionX: ['0%', '250%'] }}
      transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}>
      {children}
    </motion.span>
  );
}

/* ── 5. FlipCard ────────────────────────────────────────────────────
   3D card that flips on hover to reveal a back face. Fixed height.      */
export function FlipCard({ front, back, height = 120, className = '', style }: { front: React.ReactNode; back: React.ReactNode; height?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ perspective: 1300, height, ...style }}>
      <motion.div
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
        initial={false} whileHover={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>{front}</div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{back}</div>
      </motion.div>
    </div>
  );
}

/* ── 6. SparkBorder ─────────────────────────────────────────────────
   A conic "spark" travels around the card's border on hover, masked to
   a 1.5px ring so the frosted glass underneath stays clean.            */
/* The travelling conic ring — isolated so its per-frame loop only exists
   while the card is hovered (mounting/unmounting it keeps the page idle
   otherwise, which matters for perf, battery, and headless capture). */
function SparkRing() {
  const angle = useMotionValue(0);
  useAnimationFrame((_, delta) => { angle.set(angle.get() + delta * 0.18); });
  const bg = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg, var(--indigo) 55deg, var(--azure) 110deg, var(--teal) 150deg, transparent 200deg, transparent 360deg)`;
  return (
    <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', padding: 1.5, background: bg,
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none', zIndex: 3,
      }} />
  );
}
export function SparkBorder({ children, className = '', style, radius = 22 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number }) {
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', borderRadius: radius, ...style }}>
      <AnimatePresence>{hover && !reduced && <SparkRing key="ring" />}</AnimatePresence>
      {children}
    </div>
  );
}

/* ── 7. Stagger group + item ────────────────────────────────────────
   Drop StaggerGroup around a list; give each child variants={popItem}.  */
export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } } };
export const popItem: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
export function StaggerGroup({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  return (
    <motion.div ref={ref} className={className} style={style} variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'}>
      {children}
    </motion.div>
  );
}

/* ── 8. GooBlob ─────────────────────────────────────────────────────
   An organic blob vector that endlessly morphs (border-radius) and
   drifts — a soft, non-geometric decorative element for the canvas.    */
export function GooBlob({ size = 320, color = 'var(--glow-indigo)', style, duration = 16 }: { size?: number; color?: string; style?: React.CSSProperties; duration?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div aria-hidden style={{
      width: size, height: size, pointerEvents: 'none', borderRadius: '46%',
      background: `radial-gradient(circle at 50% 45%, ${color}, transparent 70%)`,
      filter: 'blur(6px)', ...style,
    }}
      animate={reduced ? undefined : {
        borderRadius: ['42% 58% 63% 37% / 41% 44% 56% 59%', '58% 42% 38% 62% / 63% 37% 63% 37%', '38% 62% 55% 45% / 52% 58% 42% 48%', '42% 58% 63% 37% / 41% 44% 56% 59%'],
        rotate: [0, 35, -20, 0], scale: [1, 1.08, 0.96, 1],
      }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut' }} />
  );
}

/* ── 9. Floaty ──────────────────────────────────────────────────────
   Gentle continuous bob for any element (icons, chips, badges).        */
export function Floaty({ children, amount = 8, duration = 4, delay = 0, style }: { children: React.ReactNode; amount?: number; duration?: number; delay?: number; style?: React.CSSProperties }) {
  const reduced = useReducedMotion();
  return (
    <motion.div style={{ display: 'inline-flex', ...style }}
      animate={reduced ? undefined : { y: [0, -amount, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  );
}

/* ── 10. HoloGlareCard ──────────────────────────────────────────────
   3D tilt toward the cursor + a specular glare and a faint holographic
   chord that track the pointer. Tuned soft for the pearl/glass theme.  */
export function HoloGlareCard({ children, className = '', style, radius = 22, max = 12 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const px = useMotionValue(50), py = useMotionValue(50);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 18 });
  const sy = useSpring(y, { stiffness: 150, damping: 18 });
  const rX = useTransform(sy, [-0.5, 0.5], [`${max}deg`, `-${max}deg`]);
  const rY = useTransform(sx, [-0.5, 0.5], [`-${max}deg`, `${max}deg`]);
  const glare = useMotionTemplate`radial-gradient(380px circle at ${px}% ${py}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 46%)`;
  const holo = useMotionTemplate`conic-gradient(from 210deg at ${px}% ${py}%, rgba(79,70,229,0.45), rgba(56,189,248,0.45), rgba(6,182,212,0.45), rgba(245,158,11,0.4), rgba(79,70,229,0.45))`;
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    x.set(fx - 0.5); y.set(fy - 0.5);
    px.set(fx * 100); py.set(fy * 100);
  };
  return (
    <div style={{ perspective: 900, borderRadius: radius, height: '100%' }}>
      <motion.div ref={ref} className={className}
        onMouseMove={move} onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); x.set(0); y.set(0); }}
        style={{ ...style, position: 'relative', borderRadius: radius, overflow: 'hidden', rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}>
        {children}
        <motion.span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: holo, mixBlendMode: 'soft-light', opacity: hover ? 0.5 : 0, transition: 'opacity .4s ease', zIndex: 4 }} />
        <motion.span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: glare, mixBlendMode: 'overlay', opacity: hover ? 1 : 0, transition: 'opacity .4s ease', zIndex: 5 }} />
      </motion.div>
    </div>
  );
}

/* ── 11. SwipeDeck ──────────────────────────────────────────────────
   A stack of cards you can grab and throw left/right; the dismissed
   card flies to the back and the next surfaces. Drag, or tap the dots. */
export type DeckItem = { quote: string; name: string; role: string; accent: string };
export function SwipeDeck({ items, height = 320 }: { items: DeckItem[]; height?: number }) {
  const [order, setOrder] = useState(items.map((_, i) => i));
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]]);
  const onEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 480) cycle();
  };
  return (
    <div style={{ position: 'relative', height }}>
      {order.map((idx, pos) => {
        const it = items[idx];
        const front = pos === 0;
        return (
          <motion.div key={idx}
            drag={front ? 'x' : false} dragSnapToOrigin dragElastic={0.6}
            onDragEnd={front ? onEnd : undefined}
            whileDrag={{ cursor: 'grabbing' }}
            animate={{ scale: 1 - pos * 0.05, y: pos * 20, opacity: pos < 3 ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ position: 'absolute', inset: 0, zIndex: items.length - pos, transformOrigin: 'top center', cursor: front ? 'grab' : 'default' }}>
            <div className="glass" style={{ height: '100%', padding: 'clamp(24px,3vw,34px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: `3px solid ${it.accent}`, boxShadow: 'var(--sh-lg)' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 0.5, color: it.accent, opacity: 0.4 }}>&ldquo;</span>
                <p className="lede" style={{ fontSize: 'clamp(16px,1.5vw,19px)', marginTop: 8 }}>{it.quote}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
                <span style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${it.accent} 16%, transparent)`, color: it.accent, fontFamily: 'var(--font-display)', fontWeight: 800 }}>{it.name.charAt(0)}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{it.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{it.role}</div>
                </div>
                {front && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Drag →</span>}
              </div>
            </div>
          </motion.div>
        );
      })}
      {/* progress dots */}
      <div style={{ position: 'absolute', bottom: -28, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
        {items.map((_, i) => (
          <button key={i} aria-label={`card ${i + 1}`} onClick={cycle}
            style={{ width: order[0] === i ? 22 : 8, height: 8, borderRadius: 8, background: order[0] === i ? 'linear-gradient(90deg, var(--indigo), var(--azure))' : 'var(--line-2)', transition: 'all .35s var(--ease)' }} />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ALWAYS-ON / SCROLL-DRIVEN motion — visible while simply scrolling,
   no hover required. This is the layer that makes the whole site feel
   alive at a glance.
   ════════════════════════════════════════════════════════════════════ */

/* ── 12. Appear ─────────────────────────────────────────────────────
   Scroll-into-view entrance with a pickable direction, so different
   sections come in differently (left, right, scale, blur, rotate...).  */
const APPEAR: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 64 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -64 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -90 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 90 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, y: 30, filter: 'blur(14px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  rotate: { hidden: { opacity: 0, y: 50, rotate: -7 }, show: { opacity: 1, y: 0, rotate: 0 } },
};
export function Appear({ children, from = 'up', delay = 0, className = '', style }: { children: React.ReactNode; from?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'rotate'; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  return (
    <motion.div ref={ref} className={className} style={style}
      variants={APPEAR[from]} initial="hidden" animate={inView ? 'show' : 'hidden'}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── 13. Parallax ───────────────────────────────────────────────────
   Element drifts vertically as the page scrolls past it — clearly
   visible depth. Positive speed = drifts up; negative = down.          */
export function Parallax({ children, speed = 0.3, className = '', style }: { children: React.ReactNode; speed?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 130, speed * -130]);
  return <motion.div ref={ref} className={className} style={{ y, ...style }}>{children}</motion.div>;
}

/* ── 14. FloatCard ──────────────────────────────────────────────────
   Continuous gentle bob for a full block (cards), no hover needed.     */
export function FloatCard({ children, amount = 10, duration = 4.5, delay = 0, className = '', style }: { children: React.ReactNode; amount?: number; duration?: number; delay?: number; className?: string; style?: React.CSSProperties }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} style={style}
      animate={reduced ? undefined : { y: [0, -amount, 0] }}
      transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  );
}

/* ── 15. Shimmer ────────────────────────────────────────────────────
   A light bar perpetually sweeps diagonally across a surface — always
   moving, so the card reads as "live" even at a passing glance.        */
export function Shimmer({ children, className = '', style, radius = 22, delay = 0, period = 4.8 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number; delay?: number; period?: number }) {
  const reduced = useReducedMotion();
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, ...style }}>
      {children}
      {!reduced && <motion.span aria-hidden style={{
        position: 'absolute', top: '-30%', bottom: '-30%', width: '40%', pointerEvents: 'none', zIndex: 4,
        background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)',
        filter: 'blur(3px)', transform: 'skewX(-16deg)', mixBlendMode: 'overlay',
      }}
        initial={{ left: '-50%' }} animate={{ left: '130%' }}
        transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: period, ease: 'easeInOut' }} />}
    </div>
  );
}

/* ── 16b. ScanLine ──────────────────────────────────────────────────
   Alternative console treatment to Shimmer: a thin radar line scans
   top→bottom on a loop. Distinct motion so not every console looks alike. */
export function ScanLine({ children, className = '', style, radius = 22, period = 3.4, color = 'rgba(56,189,248,0.55)' }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number; period?: number; color?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, ...style }}>
      {children}
      {!reduced && <motion.span aria-hidden style={{
        position: 'absolute', left: 0, right: 0, height: 2, pointerEvents: 'none', zIndex: 4,
        background: `linear-gradient(90deg, transparent, ${color} 25%, ${color} 75%, transparent)`,
        boxShadow: `0 0 14px ${color}`,
      }}
        initial={{ top: '-4%' }} animate={{ top: ['-4%', '104%'] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: period, ease: 'easeInOut' }} />}
    </div>
  );
}

/* ── 16. Breathe ────────────────────────────────────────────────────
   Slow continuous scale pulse — for badges, dots, hero accents.        */
export function Breathe({ children, scale = 1.05, duration = 3.4, className = '', style }: { children: React.ReactNode; scale?: number; duration?: number; className?: string; style?: React.CSSProperties }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} style={{ display: 'inline-flex', ...style }}
      animate={reduced ? undefined : { scale: [1, scale, 1] }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}>
      {children}
    </motion.div>
  );
}

/* ── 17. ScrollRoute ────────────────────────────────────────────────
   A patrol route that draws itself across the band as you scroll, with
   station nodes that light up — on-theme and unmistakably animated.    */
export function ScrollRoute() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.35'] });
  const len = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  const nodes = [[60, 150], [330, 70], [600, 130], [880, 55], [1140, 110]];
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ width: '100%', height: 'clamp(120px,18vw,200px)', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="route-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--indigo)" />
            <stop offset="55%" stopColor="var(--azure)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
        {/* faint full track */}
        <path d="M60,150 C200,60 240,40 330,70 S520,170 600,130 S800,10 880,55 S1060,140 1140,110" fill="none" stroke="var(--line-2)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
        {/* drawn route tied to scroll */}
        <motion.path d="M60,150 C200,60 240,40 330,70 S520,170 600,130 S800,10 880,55 S1060,140 1140,110" fill="none" stroke="url(#route-g)" strokeWidth="4" strokeLinecap="round" style={{ pathLength: len, filter: 'drop-shadow(0 6px 14px var(--glow-indigo))' }} />
        {nodes.map(([cx, cy], i) => (
          <g key={i}>
            <motion.circle cx={cx} cy={cy} r="11" fill="var(--bg-base)" stroke="url(#route-g)" strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.18, type: 'spring', stiffness: 200 }} style={{ transformOrigin: `${cx}px ${cy}px` }} />
            <motion.circle cx={cx} cy={cy} r="4" fill="var(--indigo)"
              animate={reduced ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity }} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ADVANCED SCROLL-CHOREOGRAPHY — section-level "wow" primitives grounded
   in motion.dev patterns (sticky scenes, horizontal scrub, clip reveals,
   spring counters, per-line masks, focus pulls, timelines, tabs, ribbons)
   ════════════════════════════════════════════════════════════════════ */

/* ── 18. PinnedScene ────────────────────────────────────────────────
   A tall section pins a sticky 100vh stage; the smoothed scroll progress
   is handed to a render-prop so callers scrub a sequence of "acts".      */
export function PinnedScene({ children, vh = 360, stiffness = 90, damping = 30 }: { children: (p: MotionValue<number>) => React.ReactNode; vh?: number; stiffness?: number; damping?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness, damping, mass: 0.4 });
  return (
    <section ref={ref} style={{ height: `${vh}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
        {children(p)}
      </div>
    </section>
  );
}

/* ── 19. PinnedTrack ────────────────────────────────────────────────
   Vertical scroll → lateral filmstrip. A tall section pins a viewport and
   translates a flex row of cards horizontally — a scroll-paced tour.
   Responsive: measures the real track + viewport width every resize, so
   the last card always rests fully in view on any device.                */
export function PinnedTrack({ children, vh = 320, gap = 24, stiffness = 80, damping = 24, showRail = true }: { children: React.ReactNode; vh?: number; gap?: number; stiffness?: number; damping?: number; showRail?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef(0);
  const [, force] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref });
  const xRaw = useTransform(scrollYProgress, (v) => -(v * rangeRef.current));
  const x = useSpring(xRaw, { stiffness, damping });
  useEffect(() => {
    const measure = () => {
      const t = trackRef.current; if (!t) return;
      const vw = t.parentElement?.clientWidth ?? window.innerWidth;
      rangeRef.current = Math.max(0, t.scrollWidth - vw);
      force((n) => n + 1);
    };
    measure();
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(trackRef.current);
    }
    window.addEventListener('resize', measure);
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  return (
    <section ref={ref} style={{ height: `${vh}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div ref={trackRef} style={{ x, display: 'flex', gap, paddingInline: 'clamp(20px, 6vw, 96px)', willChange: 'transform' }}>{children}</motion.div>
        {showRail && (
          <motion.div aria-hidden style={{ position: 'absolute', left: '6vw', right: '6vw', bottom: '7vh', height: 3, transformOrigin: '0% 50%', scaleX: scrollYProgress, background: 'linear-gradient(90deg, var(--indigo), var(--azure), var(--teal))', borderRadius: 2 }} />
        )}
      </div>
    </section>
  );
}

/* ── 20. ClipReveal ─────────────────────────────────────────────────
   A heavy visual wipes into view via a scroll-scrubbed clip-path inset —
   "data coming online". A frosted edge fades in as it completes.         */
export function ClipReveal({ children, direction = 'up', radius = 22, frostBorder = true, className = '', style }: { children: React.ReactNode; direction?: 'up' | 'down' | 'left' | 'right'; radius?: number; frostBorder?: boolean; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'center center'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  const inset = useTransform(p, [0, 1], [86, 0]);
  const up = useMotionTemplate`inset(0% 0% ${inset}% 0% round ${radius}px)`;
  const down = useMotionTemplate`inset(${inset}% 0% 0% 0% round ${radius}px)`;
  const left = useMotionTemplate`inset(0% ${inset}% 0% 0% round ${radius}px)`;
  const right = useMotionTemplate`inset(0% 0% 0% ${inset}% round ${radius}px)`;
  const clip = direction === 'down' ? down : direction === 'left' ? left : direction === 'right' ? right : up;
  const borderO = useTransform(p, [0.8, 1], [0, 1]);
  return (
    <motion.figure ref={ref} className={className} style={{ clipPath: clip, WebkitClipPath: clip, willChange: 'clip-path', borderRadius: radius, position: 'relative', margin: 0, ...style }}>
      {children}
      {frostBorder && <motion.span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: radius, border: '1px solid var(--glass-edge)', opacity: borderO, pointerEvents: 'none' }} />}
    </motion.figure>
  );
}

/* ── 21. Odometer ───────────────────────────────────────────────────
   A KPI numeral that springs from 0 to target on scroll-in (slight
   overshoot, settles). Numeric only — pass a format for K+/decimals.     */
export function Odometer({ to, format, suffix = '', prefix = '', className = 'stat-num', style }: { to: number; format?: (n: number) => string; suffix?: string; prefix?: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const mv = useSpring(0, { stiffness: 60, damping: 18, mass: 1 });
  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString());
  const [txt, setTxt] = useState(() => fmt(0));
  useEffect(() => { if (inView) mv.set(to); }, [inView, to, mv]);
  useMotionValueEvent(mv, 'change', (v) => setTxt(fmt(v)));
  return <span ref={ref} className={className} style={style}>{prefix}{txt}{suffix}</span>;
}

/* ── 22. LineReveal ─────────────────────────────────────────────────
   Per-LINE masked heading entrance — each line rises from behind an
   overflow clip, staggered. One line can render in the brand gradient.   */
export function LineReveal({ lines, as = 'h2', className = '', style, stagger = 0.12, gradientLine }: { lines: React.ReactNode[]; as?: 'h1' | 'h2' | 'h3'; className?: string; style?: React.CSSProperties; stagger?: number; gradientLine?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger } } };
  const line: Variants = { hidden: { y: '120%' }, show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };
  const MotionTag = ({ h1: motion.h1, h2: motion.h2, h3: motion.h3 })[as] as typeof motion.h1;
  return (
    <MotionTag ref={ref} className={className} style={style} variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', maxWidth: '100%' }}>
          <motion.span variants={line} style={{ display: 'block', willChange: 'transform', whiteSpace: 'normal', overflowWrap: 'break-word', maxWidth: '100%' }} className={i === gradientLine ? 'grad' : undefined}>{l}</motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ── 23. FocusPull ──────────────────────────────────────────────────
   Scroll-scrubbed focus pull: the element scales 0.9→1 and lifts as its
   indigo shadow widens, pulling the eye to a centerpiece.                */
export function FocusPull({ children, className = '', style, radius = 22 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.55'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const y = useTransform(p, [0, 1], [40, 0]);
  const boxShadow = useTransform(p, [0, 1], ['0 4px 14px rgba(37,99,235,0.06)', '0 30px 60px rgba(37,99,235,0.16)']);
  return <motion.div ref={ref} className={className} style={{ scale, y, boxShadow, borderRadius: radius, willChange: 'transform', ...style }}>{children}</motion.div>;
}

/* ── 24. TimelineScrub ──────────────────────────────────────────────
   A vertical milestone timeline: a gradient beam draws down the centre
   spine tied to scroll, each card slides in from its alternating side.   */
export function TimelineScrub({ events, className = '', style }: { events: { body: React.ReactNode }[]; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.72', 'end 0.6'] });
  const h = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });
  return (
    <div ref={ref} className={`tlscrub ${className}`} style={{ position: 'relative', ...style }}>
      {/* spine centred on desktop, snaps to the left rail on mobile (matches the collapsed card grid) */}
      <style>{`.tlscrub .tl-spine,.tlscrub .tl-beam{left:calc(50% - 1px);}@media(max-width:760px){.tlscrub .tl-spine,.tlscrub .tl-beam{left:24px;}}`}</style>
      <div aria-hidden className="tl-spine" style={{ position: 'absolute', top: 0, bottom: 0, width: 2, background: 'var(--line-2)' }} />
      <motion.div aria-hidden className="tl-beam" style={{ position: 'absolute', top: 0, width: 2, height: '100%', originY: 0, scaleY: h, background: 'linear-gradient(var(--indigo), var(--azure), var(--teal))', boxShadow: '0 0 14px var(--glow-indigo)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, position: 'relative', zIndex: 1 }}>
        {events.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: i % 2 ? 54 : -54 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-18% 0px' }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
            {e.body}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 25. LayoutTabs ─────────────────────────────────────────────────
   Tabbed panel with a layoutId underline that slides between labels and
   a directional spring slide between panels (AnimatePresence wait).      */
export function LayoutTabs({ tabs, initial = 0, className = '', renderTab }: { tabs: { label: React.ReactNode; content: React.ReactNode }[]; initial?: number; className?: string; renderTab?: (label: React.ReactNode, active: boolean) => React.ReactNode }) {
  const [[i, dir], set] = useState<[number, number]>([initial, 0]);
  const go = (n: number) => set([n, n > i ? 1 : -1]);
  const v: Variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };
  return (
    <div className={className}>
      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        {tabs.map((t, n) => (
          <button key={n} onClick={() => go(n)} style={{ position: 'relative', padding: '8px 4px' }}>
            {renderTab ? renderTab(t.label, n === i) : <span style={{ fontFamily: 'var(--font-display)', fontWeight: n === i ? 700 : 500, color: n === i ? 'var(--ink)' : 'var(--ink-3)' }}>{t.label}</span>}
            {n === i && <motion.span layoutId="lt-underline" style={{ position: 'absolute', left: 0, right: 0, bottom: -2, height: 2, borderRadius: 2, background: 'linear-gradient(90deg, var(--indigo), var(--azure))' }} />}
          </button>
        ))}
      </nav>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={i} custom={dir} variants={v} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          {tabs[i].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── 26. MarqueeRow ─────────────────────────────────────────────────
   A calm, always-on horizontal ribbon (endorsements / trust band) that
   loops seamlessly; pauses on hover. Built on the index.css ticker CSS.  */
export function MarqueeRow({ children, speed = 28, gap = 56, reverse = false, fade = true, pauseOnHover = true, className = '' }: { children: React.ReactNode; speed?: number; gap?: number; reverse?: boolean; fade?: boolean; pauseOnHover?: boolean; className?: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={`${fade ? 'ticker-mask' : ''} ${className}`} style={{ overflow: 'hidden' }}
      onMouseEnter={() => pauseOnHover && setPaused(true)} onMouseLeave={() => pauseOnHover && setPaused(false)}>
      <div className="ticker-track" style={{ gap, animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal', animationPlayState: paused ? 'paused' : 'running' }}>
        <div style={{ display: 'flex', gap, alignItems: 'center', flexShrink: 0 }}>{children}</div>
        <div style={{ display: 'flex', gap, alignItems: 'center', flexShrink: 0 }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}
