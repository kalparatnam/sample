import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════
   A library of DISTINCT living visuals — each section uses a different
   one, and each reacts to a different user action:
     · WarpGrid     → HOVER  (tactical map ripples away from cursor)
     · PatrolRoutes → SCROLL  (route paths draw themselves in view)
     · NodeGraph    → HOVER  (command hierarchy lights its links)
     · BeamColumn   → SCROLL  (protocol progress beam fills down)
     · DriftField   → idle    (slow ambient motes for calm sections)
   ════════════════════════════════════════════════════════════════ */

/* WarpGrid — a structured tactical lattice that pushes away from the
   pointer (HOVER react). Distinct from the hero's random constellation. */
export function WarpGrid({ color = '79,70,229', accent = '6,182,212' }: { color?: string; accent?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0; const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gap = 46; let pts: { x: number; y: number }[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = []; for (let y = gap / 2; y < h + gap; y += gap) for (let x = gap / 2; x < w + gap; x += gap) pts.push({ x, y });
    };
    build(); const ro = new ResizeObserver(build); ro.observe(canvas);
    const move = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const leave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', move, { passive: true }); canvas.addEventListener('mouseleave', leave);

    let raf = 0, running = true, t = 0;
    const draw = () => {
      t += 0.01; ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        const push = Math.max(0, 1 - d / 170);
        const breathe = reduce ? 0 : Math.sin(t + p.x * 0.02 + p.y * 0.02) * 1.4;
        const ox = p.x + (dx / (d || 1)) * push * 22 + breathe;
        const oy = p.y + (dy / (d || 1)) * push * 22 + breathe;
        const lit = push;
        ctx.beginPath(); ctx.arc(ox, oy, 1.1 + lit * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = lit > 0.05 ? `rgba(${accent},${0.35 + lit * 0.55})` : `rgba(${color},0.22)`;
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    const vis = () => { running = !document.hidden; if (running && !reduce) draw(); else cancelAnimationFrame(raf); };
    document.addEventListener('visibilitychange', vis); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('mousemove', move); canvas.removeEventListener('mouseleave', leave); document.removeEventListener('visibilitychange', vis); };
  }, [color, accent]);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* PatrolRoutes — stylized city routes that draw themselves as the
   section scrolls into view (SCROLL react), with a unit travelling each. */
export function PatrolRoutes({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] });
  const draw = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });
  const opacity = useTransform(draw, [0, 0.12], [0, 1]);
  const stroke = dark ? 'rgba(120,150,255,0.5)' : 'rgba(79,70,229,0.42)';
  const grid = dark ? 'rgba(140,160,255,0.07)' : 'rgba(15,23,42,0.05)';
  const routes = [
    { d: 'M40 320 C 160 280, 200 120, 360 140 S 620 260, 760 120', end: [760, 120], c: 'var(--azure)' },
    { d: 'M20 120 C 180 160, 240 320, 420 300 S 700 160, 780 300', end: [780, 300], c: 'var(--amber)' },
    { d: 'M120 360 C 200 200, 420 360, 520 200 S 720 360, 760 220', end: [760, 220], c: 'var(--teal)' },
  ];
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="pg" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke={grid} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#pg)" />
        {routes.map((r, i) => (
          <g key={i}>
            <motion.path d={r.d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" style={{ pathLength: draw, opacity }} />
            <motion.circle cx={r.end[0]} cy={r.end[1]} r="4.5" fill={r.c} style={{ opacity }}>
              <animate attributeName="r" values="4.5;7;4.5" dur="1.8s" repeatCount="indefinite" />
            </motion.circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* NodeGraph — interactive command hierarchy. Hovering any node lights
   its links and pulses neighbours (HOVER react). Lives on dark consoles. */
export function NodeGraph() {
  const nodes = [
    { id: 'cmd', label: 'COMMAND', x: 50, y: 50, big: true },
    { id: 'field', label: 'Field App', x: 16, y: 22 },
    { id: 'dash', label: 'Dashboard', x: 84, y: 22 },
    { id: 'gps', label: 'GPS Layer', x: 16, y: 78 },
    { id: 'disp', label: 'Dispatch', x: 84, y: 78 },
  ];
  const links: [string, string][] = [['cmd', 'field'], ['cmd', 'dash'], ['cmd', 'gps'], ['cmd', 'disp']];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reduced = useReducedMotion();
  const pos = (id: string) => nodes.find(n => n.id === id)!;
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: '1.5/1' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {links.map(([a, b], i) => {
          const A = pos(a), B = pos(b);
          return <motion.line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(120,150,255,0.4)" strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1, delay: 0.2 + i * 0.12 }} />;
        })}
        {/* travelling pulses */}
        {inView && !reduced && links.map(([a, b], i) => {
          const A = pos(a), B = pos(b);
          return <motion.circle key={'p' + i} r="0.9" fill="var(--amber)"
            initial={{ cx: A.x, cy: A.y }} animate={{ cx: [A.x, B.x], cy: [A.y, B.y] }} transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }} />;
        })}
      </svg>
      {nodes.map((n, i) => (
        <motion.div key={n.id} className="ng-node" initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 220 }}
          style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap', padding: n.big ? '12px 22px' : '8px 16px', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: n.big ? 13 : 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: n.big ? 700 : 500,
            color: n.big ? '#fff' : 'var(--paper-2)', background: n.big ? 'linear-gradient(135deg, var(--indigo), var(--azure))' : 'rgba(255,255,255,0.06)', border: n.big ? 'none' : '1px solid var(--console-edge)', boxShadow: n.big ? '0 10px 28px -8px var(--glow-indigo)' : 'none', cursor: 'default' }}>
          {n.label}
        </motion.div>
      ))}
      <style>{`.ng-node{ transition: transform .25s, background .25s, color .25s; } .ng-node:hover{ transform: translate(-50%,-50%) scale(1.1); color:#fff; background: rgba(56,189,248,0.18); border-color: var(--azure-400); }`}</style>
    </div>
  );
}

/* BeamColumn — a vertical progress beam that fills as you scroll the
   protocol steps (SCROLL react). Pass a ref'd container height via CSS. */
export function BeamColumn() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const h = useSpring(scrollYProgress, { stiffness: 60, damping: 24 });
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 'calc(50% - 1px)', top: 0, bottom: 0, width: 2, background: 'var(--line-2)' }} />
      <motion.div style={{ position: 'absolute', left: 'calc(50% - 1.5px)', top: 0, width: 3, scaleY: h, transformOrigin: 'top', height: '100%', background: 'linear-gradient(180deg, var(--indigo), var(--azure), var(--teal))', boxShadow: '0 0 14px var(--glow-indigo)', borderRadius: 3 }} />
    </div>
  );
}

/* Bokeh — live blurred glow orbs drifting on their own clock with a
   cursor-parallax (depth) lag. The "living background" behind heroes. */
export function Bokeh({ count = 16 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cols = ['56,189,248', '79,70,229', '34,211,238', '245,158,11'];
    let w = 0, h = 0;
    type Orb = { x: number; y: number; r: number; vx: number; vy: number; depth: number; c: string };
    let orbs: Orb[] = [];
    const mouse = { x: 0, y: 0 };
    const build = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      orbs = Array.from({ length: count }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, r: 50 + Math.random() * 150, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, depth: 0.2 + Math.random() * 0.8, c: cols[i % cols.length] }));
    };
    build(); const ro = new ResizeObserver(build); ro.observe(canvas);
    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left - w / 2) / w; mouse.y = (e.clientY - r.top - h / 2) / h; };
    window.addEventListener('mousemove', onMove, { passive: true });
    let raf = 0, running = true;
    const draw = () => {
      if (!reduce) raf = requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const o of orbs) {
        if (!reduce) { o.x += o.vx; o.y += o.vy; if (o.x < -o.r) o.x = w + o.r; if (o.x > w + o.r) o.x = -o.r; if (o.y < -o.r) o.y = h + o.r; if (o.y > h + o.r) o.y = -o.r; }
        const px = o.x - mouse.x * 60 * o.depth, py = o.y - mouse.y * 60 * o.depth;
        const g = ctx.createRadialGradient(px, py, 0, px, py, o.r);
        g.addColorStop(0, `rgba(${o.c},${0.16 * o.depth})`); g.addColorStop(1, `rgba(${o.c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, o.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    const vis = () => { running = !document.hidden; if (running) draw(); else cancelAnimationFrame(raf); };
    document.addEventListener('visibilitychange', vis); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('mousemove', onMove); document.removeEventListener('visibilitychange', vis); };
  }, [count]);
  return <canvas ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* DriftField — calm ambient motes for low-key sections (idle motion). */
export function DriftField({ count = 18 }: { count?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const motes = Array.from({ length: count });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {motes.map((_, i) => {
        const size = 2 + (i % 4); const left = (i * 53) % 100; const dur = 14 + (i % 7) * 3; const delay = (i % 9) * -2.5;
        return <motion.span key={i} initial={{ y: '110%', opacity: 0 }} animate={{ y: '-15%', opacity: [0, 0.7, 0] }} transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: `${left}%`, width: size, height: size, borderRadius: '50%', background: i % 3 === 0 ? 'var(--amber)' : 'var(--azure)', boxShadow: '0 0 8px currentColor', color: i % 3 === 0 ? 'var(--amber)' : 'var(--azure)' }} />;
      })}
    </div>
  );
}
