import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

// ── MAGNETIC BUTTON ──
// Pulls towards the cursor on hover.
export function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3); // Pull strength
    y.set(middleY * 0.3);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ── 3D TILT CARD ──
// Tilts based on mouse position over the card.
export const TiltCard = ({ children, className = '' }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// ── INTERACTIVE RADAR (Scroll & Hover React) ──
// Spins slowly, but spins faster on scroll and scales on hover.
export const InteractiveRadar = ({ style }: { style?: React.CSSProperties }) => {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 2000], [0, 720]);
  
  return (
    <motion.div
      style={{
        ...style,
        width: 300, height: 300,
        borderRadius: '50%',
        border: '1px solid var(--border-indigo)',
        background: 'radial-gradient(circle at center, transparent 30%, var(--indigo-glow) 100%)',
        position: 'absolute',
        zIndex: 0,
        pointerEvents: 'none',
        rotate,
      }}
    >
      {/* Radar Sweep Line */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%',
          background: 'conic-gradient(from 0deg, transparent 70%, var(--indigo) 100%)',
          transformOrigin: 'top left',
          opacity: 0.3
        }}
      />
      {/* Concentric circles */}
      <div style={{ position: 'absolute', inset: '15%', border: '1px solid var(--border-indigo)', borderRadius: '50%', opacity: 0.5 }} />
      <div style={{ position: 'absolute', inset: '35%', border: '1px solid var(--border-indigo)', borderRadius: '50%', opacity: 0.5 }} />
      <div style={{ position: 'absolute', inset: '49%', border: '2px solid var(--indigo)', borderRadius: '50%' }} />
    </motion.div>
  );
};

// ── DATA DECRYPT TEXT (Hover React) ──
// Scrambles letters rapidly then settles on the real word.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
export const DecryptText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  
  const handleHover = () => {
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split('').map((_, index) => {
        if(index < iter) return text[index];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));
      
      if(iter >= text.length) clearInterval(interval);
      iter += 1/3;
    }, 30);
  };

  return (
    <span onMouseEnter={handleHover} style={{ cursor: 'pointer' }}>
      {display}
    </span>
  );
};
