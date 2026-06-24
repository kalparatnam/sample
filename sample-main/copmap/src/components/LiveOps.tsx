import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────
   LiveOpsField — a domain-themed "live operations map" for the hero.
   Officer nodes drift on their own clock and link into a constellation;
   a radar sweep pings nodes it passes; the cursor becomes a live node
   that links to nearby units (HOVER reacts); clicking drops an
   expanding command ping that lights up every node it crosses (CLICK
   reacts). 2D canvas → cheap, crisp, RAF + visibility + reduced-motion.
   ──────────────────────────────────────────────────────────────── */

type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
type Ping = { x: number; y: number; t: number };

export function LiveOpsField({ density = 0.00009 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const pings: Ping[] = [];
    let sweep = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(14, Math.min(46, Math.floor(w * h * density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.6 + 1.2, pulse: 0,
      }));
    };
    build();

    const ro = new ResizeObserver(build); ro.observe(canvas);

    const toLocal = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const onMove = (e: MouseEvent) => { const p = toLocal(e); mouse.x = p.x; mouse.y = p.y; mouse.active = p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h; };
    const onLeave = () => { mouse.active = false; };
    const onDown = (e: MouseEvent) => { const p = toLocal(e); if (p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) pings.push({ x: p.x, y: p.y, t: 0 }); };
    window.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);

    const LINK = 140;
    const cx = () => w * 0.5, cy = () => h * 0.5;

    let raf = 0, running = true;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (!reduce) sweep += 0.006;

      // radar sweep cone (rotates around centre)
      const sx = cx(), sy = cy();
      const grad = ctx.createConicGradient ? ctx.createConicGradient(sweep, sx, sy) : null;
      if (grad) {
        grad.addColorStop(0, 'rgba(79,70,229,0.16)');
        grad.addColorStop(0.06, 'rgba(79,70,229,0)');
        grad.addColorStop(1, 'rgba(79,70,229,0)');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(sx, sy, Math.max(w, h), 0, Math.PI * 2); ctx.fill();
      }

      // node motion + sweep pinging
      for (const n of nodes) {
        if (!reduce) { n.x += n.vx; n.y += n.vy; }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const ang = Math.atan2(n.y - sy, n.x - sx);
        let da = (ang - (sweep % (Math.PI * 2)));
        da = Math.atan2(Math.sin(da), Math.cos(da));
        if (Math.abs(da) < 0.05) n.pulse = 1;
        n.pulse *= 0.96;
      }

      // links between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const o = (1 - dist / LINK) * 0.32;
            ctx.strokeStyle = `rgba(56,108,235,${o})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // cursor becomes a live node — links to nearby units (HOVER react)
      if (mouse.active) {
        for (const n of nodes) {
          const dist = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (dist < LINK * 1.5) {
            const o = (1 - dist / (LINK * 1.5)) * 0.6;
            ctx.strokeStyle = `rgba(245,158,11,${o})`;
            ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(245,158,11,0.9)';
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(245,158,11,0.35)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2); ctx.stroke();
      }

      // command pings (CLICK react)
      for (let k = pings.length - 1; k >= 0; k--) {
        const p = pings[k]; p.t += 0.018;
        const rad = p.t * Math.max(w, h) * 0.9;
        const o = Math.max(0, 1 - p.t);
        ctx.strokeStyle = `rgba(79,70,229,${o * 0.7})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.stroke();
        for (const n of nodes) { if (Math.abs(Math.hypot(n.x - p.x, n.y - p.y) - rad) < 14) n.pulse = 1; }
        if (p.t >= 1) pings.splice(k, 1);
      }

      // nodes
      for (const n of nodes) {
        const lit = n.pulse;
        ctx.fillStyle = lit > 0.1 ? `rgba(245,158,11,${0.5 + lit * 0.5})` : 'rgba(79,70,229,0.7)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + lit * 2.5, 0, Math.PI * 2); ctx.fill();
        if (lit > 0.1) {
          ctx.strokeStyle = `rgba(245,158,11,${lit * 0.5})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 6 + lit * 8, 0, Math.PI * 2); ctx.stroke();
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onVis = () => { running = !document.hidden; if (running && !reduce) draw(); else cancelAnimationFrame(raf); };
    document.addEventListener('visibilitychange', onVis);
    draw();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [density]);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ScrollRadar — a refined tactical radar dial that spins with scroll
   progress (SCROLL react) and breathes on its own. Brand palette, no neon. */
export function ScrollRadar({ style }: { style?: React.CSSProperties }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, [0, 2600], [0, 540]);
  const rot = useSpring(raw, { stiffness: 50, damping: 24 });

  return (
    <motion.div aria-hidden style={{ position: 'absolute', width: 360, height: 360, pointerEvents: 'none', ...style }}>
      <motion.div style={{ position: 'absolute', inset: 0, rotate: rot }}>
        {/* dial rings */}
        {[0, 0.18, 0.36, 0.5].map((inset, i) => (
          <div key={i} style={{ position: 'absolute', inset: `${inset * 100}%`, borderRadius: '50%', border: `1px solid rgba(79,70,229,${0.18 - i * 0.02})` }} />
        ))}
        {/* crosshair ticks */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(79,70,229,0.1)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(79,70,229,0.1)' }} />
      </motion.div>
      {/* independent sweep */}
      <motion.div
        animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(245,158,11,0.22), transparent 28%)' }} />
    </motion.div>
  );
}
