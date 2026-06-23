import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Radar } from 'lucide-react';

/* A small ambient "system status" orb pinned bottom-right. Its core
   tracks the cursor with lag; hovering reveals a live-status readout. */
export default function OverwatchWidget() {
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cx = useSpring(mx, { stiffness: 120, damping: 18 });
  const cy = useSpring(my, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const on = (e: MouseEvent) => {
      mx.set(Math.max(-13, Math.min(13, (e.clientX - window.innerWidth + 50) * 0.06)));
      my.set(Math.max(-13, Math.min(13, (e.clientY - window.innerHeight + 50) * 0.06)));
    };
    window.addEventListener('mousemove', on, { passive: true });
    return () => window.removeEventListener('mousemove', on);
  }, [mx, my]);

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 60 }}>
      <AnimatePresence>
        {hover && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="console" style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 16, width: 210, padding: 16, borderRadius: 18 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--azure-400)', textTransform: 'uppercase', marginBottom: 10 }}>System · Overwatch</p>
            {[['Field nodes', '250'], ['Live patrols', '187'], ['Sync latency', '< 30s']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                <span className="c-mut">{k}</span><span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{v}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} aria-label="System status"
        style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--glass-strong)', backdropFilter: 'blur(18px)', border: '1px solid var(--glass-edge)', boxShadow: '0 14px 34px -10px var(--glow-indigo)' }}>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'conic-gradient(from 0deg, var(--amber), transparent 30%)', opacity: 0.5 }} />
        <motion.span style={{ x: cx, y: cy, width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', boxShadow: '0 0 16px var(--glow-azure)' }}>
          <Radar size={15} color="#fff" />
        </motion.span>
      </motion.button>
    </div>
  );
}
