import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════
   Emblems — bespoke, fully-vector police/command illustrations.
   · transparent (no raster background — sits on light OR dark)
   · colour driven by CSS variables → adapts when a dark theme lands
     (structural lines use currentColor; accents use --indigo/azure/…)
   · animated + cursor-tilt for real depth (not a flat clipart)
   These make the product domain readable at a glance, no copy needed.
   ════════════════════════════════════════════════════════════════ */

function Tilt({ children, max = 14 }: { children: React.ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 15 });
  const sy = useSpring(my, { stiffness: 120, damping: 15 });
  const rX = useTransform(sy, [-0.5, 0.5], [`${max}deg`, `-${max}deg`]);
  const rY = useTransform(sx, [-0.5, 0.5], [`-${max}deg`, `${max}deg`]);
  const move = (e: React.MouseEvent) => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => { mx.set(0); my.set(0); }} style={{ perspective: 1100, width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <motion.div style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>{children}</motion.div>
    </div>
  );
}

/* ── SHIELD CREST — the flagship police badge emblem ── */
export function ShieldCrest() {
  return (
    <Tilt>
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', maxWidth: 380, aspectRatio: '0.84', position: 'relative', color: 'var(--ink-2)' }}>
        {/* soft glow bloom */}
        <motion.div aria-hidden animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.06, 1] }} transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', inset: '8%', borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-indigo), transparent 65%)', filter: 'blur(34px)' }} />
        <svg viewBox="0 0 200 240" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'visible' }}>
          {/* rotating dashed ring behind */}
          <motion.circle cx="100" cy="118" r="104" fill="none" stroke="var(--azure)" strokeWidth="0.6" strokeDasharray="3 7" opacity="0.4"
            style={{ transformOrigin: '100px 118px' }} animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
          {/* shield body */}
          <path d="M100 12 L182 44 V120 C182 178 146 214 100 230 C54 214 18 178 18 120 V44 Z"
            fill="var(--glass-strong)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M100 12 L182 44 V120 C182 178 146 214 100 230 C54 214 18 178 18 120 V44 Z"
            fill="none" stroke="var(--indigo)" strokeWidth="0.8" opacity="0.5" transform="scale(0.92) translate(8.6,9)" />
          {/* circuit traces */}
          {[34, 166].map((x, i) => (
            <g key={i} stroke="var(--azure)" strokeWidth="1.1" fill="none" opacity="0.55">
              <path d={`M${x} 70 h${i ? -16 : 16} v14`} />
              <path d={`M${x} 104 h${i ? -22 : 22}`} />
              <circle cx={i ? x - 16 : x + 16} cy="84" r="1.8" fill="var(--azure)" />
            </g>
          ))}
          {/* central star + radiating wings */}
          <g transform="translate(100 104)">
            <motion.g animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              {[...Array(8)].map((_, i) => (
                <line key={i} x1="0" y1="0" x2={Math.cos((i * Math.PI) / 4) * 46} y2={Math.sin((i * Math.PI) / 4) * 46} stroke="var(--indigo)" strokeWidth="0.8" opacity="0.35" />
              ))}
              <path d="M0 -30 L8.8 -9.3 L30.5 -9.3 L13 4 L19.6 26 L0 12.5 L-19.6 26 L-13 4 L-30.5 -9.3 L-8.8 -9.3 Z"
                fill="var(--amber)" stroke="var(--amber-soft)" strokeWidth="1" />
              <circle r="7" fill="var(--glass-strong)" stroke="var(--amber)" strokeWidth="1.5" />
            </motion.g>
          </g>
          {/* banner */}
          <g transform="translate(100 176)">
            <path d="M-58 -12 L58 -12 L48 8 L-48 8 Z" fill="var(--indigo)" opacity="0.92" />
            <path d="M-58 -12 L-70 0 L-58 8 Z M58 -12 L70 0 L58 8 Z" fill="var(--indigo-600)" />
            {[-30, -10, 10, 30].map(x => <rect key={x} x={x - 3} y="-4" width="6" height="6" rx="1" fill="var(--azure-400)" opacity="0.9" />)}
          </g>
          {/* rivets */}
          {[[40, 50], [160, 50], [100, 214]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />)}
          {/* scan line */}
          <motion.rect x="18" width="164" height="2.5" fill="var(--azure)" opacity="0.5"
            animate={{ y: [40, 210, 40] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        </svg>
      </motion.div>
    </Tilt>
  );
}

/* ── COMMAND MAP — live operations / dispatch board ── */
export function CommandMap() {
  const routes = ['M40 210 C 110 180, 130 90, 220 96 S 320 60, 360 110', 'M60 70 C 130 90, 150 200, 250 190 S 330 150, 370 200'];
  const pins = [[40, 210], [220, 96], [360, 110], [60, 70], [250, 190], [150, 140]];
  return (
    <div style={{ width: '100%', color: 'var(--ink-3)' }}>
      <svg viewBox="0 0 400 280" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <pattern id="cmg" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.25" /></pattern>
        </defs>
        {/* region */}
        <path d="M30 40 Q 70 18 140 28 T 280 24 Q 360 30 372 80 T 360 200 Q 350 252 280 250 T 120 252 Q 36 248 26 190 T 30 40 Z" fill="url(#cmg)" stroke="var(--indigo)" strokeWidth="1.4" opacity="0.9" />
        {/* routes draw + loop */}
        {routes.map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke={i ? 'var(--teal)' : 'var(--azure)'} strokeWidth="2" strokeLinecap="round" strokeDasharray="0 1"
            initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.9 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.2 + i * 0.3 }} />
        ))}
        {/* travelling units */}
        {routes.map((d, i) => (
          <circle key={'u' + i} r="3.4" fill={i ? 'var(--teal)' : 'var(--azure)'}>
            <animateMotion dur={`${5 + i}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
        {/* radar sweep at command centre — SMIL rotate pivots on the group origin (the centre) */}
        <g transform="translate(150 140)">
          <circle r="34" fill="none" stroke="var(--indigo)" strokeWidth="0.8" opacity="0.4" />
          <circle r="20" fill="none" stroke="var(--indigo)" strokeWidth="0.8" opacity="0.4" />
          <g>
            <path d="M0 0 L0 -34 A34 34 0 0 1 24 -24 Z" fill="var(--indigo)" opacity="0.2" />
            <line x1="0" y1="0" x2="0" y2="-34" stroke="var(--indigo)" strokeWidth="1.2" opacity="0.6" />
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
          </g>
          <circle r="4" fill="var(--indigo)" />
        </g>
        {/* station pins */}
        {pins.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <motion.circle r="6" fill="none" stroke={i % 3 === 0 ? 'var(--amber)' : 'var(--azure)'} strokeWidth="1.5"
              animate={{ r: [6, 13, 6], opacity: [0.9, 0, 0.9] }} transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity }} />
            <circle r="3.4" fill={i % 3 === 0 ? 'var(--amber)' : 'var(--azure)'} />
          </g>
        ))}
        {/* alert chip */}
        <g transform="translate(300 60)">
          <rect x="-2" y="-12" width="86" height="24" rx="6" fill="var(--glass-strong)" stroke="var(--amber)" strokeWidth="1" />
          <circle cx="12" cy="0" r="3.5" fill="var(--amber)"><animate attributeName="opacity" values="1;0.3;1" dur="1.3s" repeatCount="indefinite" /></circle>
          <text x="24" y="4" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-2)" letterSpacing="1">ALERT · Z3</text>
        </g>
      </svg>
    </div>
  );
}

/* ── HIERARCHY CHART — State → Zone → District → Station ── */
export function HierarchyChart() {
  const levels = [
    [{ x: 200, label: 'STATE' }],
    [{ x: 110, label: 'ZONE' }, { x: 290, label: 'ZONE' }],
    [{ x: 60, label: 'DISTRICT' }, { x: 160, label: 'DISTRICT' }, { x: 240, label: 'DIST' }, { x: 340, label: 'DIST' }],
    [{ x: 60, label: 'STATION' }, { x: 160, label: 'STATION' }, { x: 240, label: 'STN' }, { x: 340, label: 'STN' }],
  ];
  const yOf = (r: number) => 30 + r * 70;
  const edges: [number, number, number, number][] = [
    [200, yOf(0), 110, yOf(1)], [200, yOf(0), 290, yOf(1)],
    [110, yOf(1), 60, yOf(2)], [110, yOf(1), 160, yOf(2)], [290, yOf(1), 240, yOf(2)], [290, yOf(1), 340, yOf(2)],
    [60, yOf(2), 60, yOf(3)], [160, yOf(2), 160, yOf(3)], [240, yOf(2), 240, yOf(3)], [340, yOf(2), 340, yOf(3)],
  ];
  return (
    <div style={{ width: '100%', color: 'var(--ink-3)' }}>
      <svg viewBox="0 0 400 290" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        {edges.map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <motion.line x1={x1} y1={y1 + 12} x2={x2} y2={y2 - 12} stroke="currentColor" strokeWidth="1" opacity="0.5"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.05 }} />
            <circle r="2" fill="var(--azure)"><animateMotion dur="2.6s" begin={`${i * 0.2}s`} repeatCount="indefinite" path={`M${x1} ${y1 + 12} L${x2} ${y2 - 12}`} /></circle>
          </g>
        ))}
        {levels.map((row, r) => row.map((n, i) => (
          <motion.g key={`${r}-${i}`} initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: r * 0.15 + i * 0.05, type: 'spring', stiffness: 200 }}>
            <rect x={n.x - 38} y={yOf(r) - 13} width="76" height="26" rx="13" fill={r === 0 ? 'var(--indigo)' : 'var(--glass-strong)'} stroke={r === 0 ? 'none' : 'var(--line-indigo)'} strokeWidth="1" />
            <text x={n.x} y={yOf(r) + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" letterSpacing="0.5" fill={r === 0 ? '#fff' : 'var(--ink-2)'}>{n.label}</text>
          </motion.g>
        )))}
      </svg>
    </div>
  );
}

/* ── RADAR SCOPE — comms / surveillance dial ── */
export function RadarScope() {
  return (
    <Tilt max={10}>
      <div style={{ width: '100%', maxWidth: 360, aspectRatio: '1', position: 'relative', color: 'var(--ink-3)' }}>
        <motion.div aria-hidden animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: 'absolute', inset: '14%', borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-azure), transparent 65%)', filter: 'blur(30px)' }} />
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', position: 'relative' }}>
          {[88, 64, 40, 18].map((r, i) => <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="0.8" opacity={0.45 - i * 0.05} />)}
          <line x1="12" y1="100" x2="188" y2="100" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          <line x1="100" y1="12" x2="100" y2="188" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          <motion.g style={{ transformOrigin: '100px 100px' }} animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
            <path d="M100 100 L100 12 A88 88 0 0 1 162 38 Z" fill="var(--azure)" opacity="0.22" />
            <line x1="100" y1="100" x2="100" y2="12" stroke="var(--azure)" strokeWidth="1.4" />
          </motion.g>
          {[[140, 70], [70, 130], [150, 140], [80, 60]].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="3.5" fill={i % 2 ? 'var(--amber)' : 'var(--teal)'} animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }} />
          ))}
          <circle cx="100" cy="100" r="4" fill="var(--indigo)" />
        </svg>
      </div>
    </Tilt>
  );
}
