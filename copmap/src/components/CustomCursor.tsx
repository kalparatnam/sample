import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const bx = useMotionValue(-100);
  const by = useMotionValue(-100);

  const sx = useSpring(bx, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(by, { stiffness: 60, damping: 18, mass: 0.8 });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      bx.set(e.clientX);
      by.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const clickable = window.getComputedStyle(el).cursor === 'pointer' || el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button') || el.closest('a');
      setIsHovered(!!clickable);
    };
    const onLeave = () => setIsHovered(false);
    
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <>
      {/* Inner dot — precise */}
      <motion.div
        animate={{ 
          scale: isClicking ? 0.5 : (isHovered ? 0 : 1),
          opacity: isHovered ? 0 : 1
        }}
        style={{
          x, y,
          position:'fixed', top:0, left:0,
          width:6, height:6,
          borderRadius:'50%',
          background:'linear-gradient(135deg, #6366f1, #22d3ee)',
          boxShadow:'0 0 12px rgba(99,102,241,0.8)',
          pointerEvents:'none', zIndex:99999,
          translateX:'-50%', translateY:'-50%'
        }}
      />
      {/* Tactical Outer Crosshair */}
      <motion.div
        animate={{ 
          rotate: isHovered ? 90 : 0,
          scale: isClicking ? 0.8 : (isHovered ? 1.5 : 1),
          borderColor: isHovered ? 'rgba(239,68,68,0.8)' : 'rgba(99,102,241,0.5)',
          background: isHovered ? 'rgba(239,68,68,0.05)' : 'rgba(99,102,241,0.02)'
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{
          x: sx, y: sy,
          position:'fixed', top:0, left:0,
          width:36, height:36,
          borderRadius:'50%',
          border:'1.5px solid',
          backdropFilter:'blur(2px)',
          pointerEvents:'none', zIndex:99998,
          translateX:'-50%', translateY:'-50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {/* Crosshair Ticks */}
        <motion.div style={{ position:'absolute', top:-4, width:2, height:6, background: isHovered ? '#ef4444' : '#6366f1' }} />
        <motion.div style={{ position:'absolute', bottom:-4, width:2, height:6, background: isHovered ? '#ef4444' : '#6366f1' }} />
        <motion.div style={{ position:'absolute', left:-4, width:6, height:2, background: isHovered ? '#ef4444' : '#6366f1' }} />
        <motion.div style={{ position:'absolute', right:-4, width:6, height:2, background: isHovered ? '#ef4444' : '#6366f1' }} />
      </motion.div>
    </>
  );
}
