import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHover(!!(el.closest('a') || el.closest('button') || el.closest('[role="button"]') || el.closest('input') || el.closest('textarea')));
    };
    const dn = () => setDown(true), up = () => setDown(false);
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over, { passive: true });
    document.addEventListener('mousedown', dn); document.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', over); document.removeEventListener('mousedown', dn); document.removeEventListener('mouseup', up); };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <>
      <motion.div animate={{ scale: down ? 0.6 : hover ? 0 : 1 }}
        style={{ x, y, position: 'fixed', top: 0, left: 0, width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', boxShadow: '0 0 12px var(--amber)', translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 99999 }} />
      <motion.div animate={{ scale: down ? 0.85 : hover ? 1.6 : 1, borderColor: hover ? 'rgba(245,158,11,0.7)' : 'rgba(79,70,229,0.5)' }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ x: rx, y: ry, position: 'fixed', top: 0, left: 0, width: 34, height: 34, borderRadius: '50%', border: '1.5px solid', backdropFilter: 'blur(1px)', translateX: '-50%', translateY: '-50%', pointerEvents: 'none', zIndex: 99998 }} />
    </>
  );
}
