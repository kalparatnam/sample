import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════
   CommandFrame — the site-wide signature motif. A subtle "command
   console" overlay present on EVERY page: tactical corner brackets,
   a live secure-ops status chip, and a sector/coords readout. This is
   the consistent domain cue — a visitor reads "police command system"
   at a glance, before any copy. Pointer-events none; var-driven so it
   adapts to a future dark theme.
   ════════════════════════════════════════════════════════════════ */

const SECTORS = ['SEC-01 · ZONE I', 'SEC-04 · CENTRAL', 'SEC-07 · NORTH', 'SEC-02 · PORT', 'SEC-09 · HQ'];

function Bracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const v: React.CSSProperties = { position: 'fixed', width: 26, height: 26, zIndex: 40, pointerEvents: 'none', opacity: 0.4 };
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 84, left: 16, borderTop: '2px solid var(--indigo)', borderLeft: '2px solid var(--indigo)', borderTopLeftRadius: 6 },
    tr: { top: 84, right: 16, borderTop: '2px solid var(--indigo)', borderRight: '2px solid var(--indigo)', borderTopRightRadius: 6 },
    bl: { bottom: 16, left: 16, borderBottom: '2px solid var(--indigo)', borderLeft: '2px solid var(--indigo)', borderBottomLeftRadius: 6 },
    br: { bottom: 16, right: 16, borderBottom: '2px solid var(--indigo)', borderRight: '2px solid var(--indigo)', borderBottomRightRadius: 6 },
  };
  return <div aria-hidden style={{ ...v, ...map[pos] }} />;
}

export default function CommandFrame() {
  const [sector, setSector] = useState(0);
  const [clock, setClock] = useState('--:--:--');
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`);
    }, 1000);
    const s = setInterval(() => setSector(p => (p + 1) % SECTORS.length), 4200);
    return () => { clearInterval(t); clearInterval(s); };
  }, []);

  return (
    <div aria-hidden className="command-frame">
      <Bracket pos="tl" /><Bracket pos="tr" /><Bracket pos="bl" /><Bracket pos="br" />

      {/* live secure-ops chip — bottom-left */}
      <div style={{ position: 'fixed', bottom: 22, left: 52, zIndex: 40, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textTransform: 'uppercase' }}>
        <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
        Secure Ops · Live
      </div>

      {/* sector + clock readout — top-left under nav */}
      <div style={{ position: 'fixed', top: 90, left: 52, zIndex: 40, pointerEvents: 'none', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-4)', textTransform: 'uppercase', display: 'flex', gap: 14 }}>
        <span style={{ color: 'var(--indigo)' }}>◈ CopMap</span>
        <motion.span key={sector} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>{SECTORS[sector]}</motion.span>
        <span>{clock}</span>
      </div>

      <style>{`
        @media (max-width: 760px){ .command-frame{ display:none; } }
      `}</style>
    </div>
  );
}
