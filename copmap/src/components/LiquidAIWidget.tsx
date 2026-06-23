import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function LiquidAIWidget() {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking for the "eye/core"
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const coreX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const coreY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to bottom right corner where widget lives
      const x = (e.clientX - window.innerWidth + 80) * 0.05; // limit movement range
      const y = (e.clientY - window.innerHeight + 80) * 0.05;
      
      // Keep within bounds
      mouseX.set(Math.max(-15, Math.min(15, x)));
      mouseY.set(Math.max(-15, Math.min(15, y)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 50, pointerEvents: 'auto' }}>
      
      {/* SVG filter for the liquid gooey effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        style={{ 
          position: 'relative', 
          width: 70, 
          height: 70, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          filter: 'url(#goo)' // Applies liquid glass effect to children
        }}
      >
        {/* Main Glass Body */}
        <motion.div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 10px 30px rgba(79,70,229,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {/* Orbiting Liquid Droplets */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%' }}
        >
          <div style={{ position: 'absolute', top: -5, left: '50%', width: 20, height: 20, background: 'rgba(99,102,241,0.8)', borderRadius: '50%', transform: 'translateX(-50%)' }} />
        </motion.div>

        {/* Moving Eye/Core (Reacts to Mouse) */}
        <motion.div
          style={{
            position: 'absolute',
            x: coreX,
            y: coreY,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: isHovered ? 'linear-gradient(135deg, #f43f5e, #f59e0b)' : 'linear-gradient(135deg, #6366f1, #22d3ee)',
            boxShadow: isHovered ? '0 0 20px #f43f5e' : '0 0 20px #22d3ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          <ShieldAlert size={14} color="#fff" />
        </motion.div>
      </motion.div>

      {/* Floating Text Label */}
      <motion.div 
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        style={{
          position: 'absolute',
          bottom: '100%',
          right: 0,
          marginBottom: 16,
          background: 'rgba(3,4,10,0.8)',
          backdropFilter: 'blur(12px)',
          padding: '6px 12px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: '#22d3ee',
          border: '1px solid rgba(34,211,238,0.3)',
          pointerEvents: 'none'
        }}
      >
        AI OVERWATCH ACTIVE
      </motion.div>
    </div>
  );
}
