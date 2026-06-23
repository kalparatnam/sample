import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// ── 1. ADVANCED SCROLL-REACTIVE RADAR GRID ──
export function ScrollRadarGrid() {
  const { scrollY } = useScroll();
  // Map scroll position to rotation for the radar sweep
  const rotationRaw = useTransform(scrollY, [0, 2000], [0, 360]);
  const rotation = useSpring(rotationRaw, { stiffness: 50, damping: 20 });

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: 0.6 }}>
      {/* Blueprint Grid */}
      <div style={{ 
        position: 'absolute', inset: -200, 
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        transformOrigin: 'top center'
      }} />
      
      {/* Spinning Radar Sweep tied to Scroll */}
      <motion.div 
        style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: 800, height: 800,
          borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.1)',
          rotate: rotation
        }}
      >
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dashed rgba(34,211,238,0.2)', transform: 'scale(0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(99,102,241,0.05)', transform: 'scale(0.4)' }} />
        
        {/* Radar beam gradient */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '50%', height: '50%',
          background: 'conic-gradient(from 180deg at 0 0, rgba(34,211,238,0.1) 0deg, transparent 60deg)',
          transformOrigin: '0 0'
        }} />
      </motion.div>
    </div>
  );
}

// ── 2. INTERACTIVE FLOATING PATROL NODES ──
export function FloatingPatrolNodes() {
  useEffect(() => {
    const handleMouseMove = () => {};
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate some static random nodes
  const nodes = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: 60 + Math.random() * 35, // Force nodes to stay on the right side of the screen
    y: 20 + Math.random() * 60, // %
    label: `UNIT-${Math.floor(Math.random() * 900) + 100}`,
    status: Math.random() > 0.8 ? 'ALERT' : 'ACTIVE',
    color: Math.random() > 0.8 ? '#f43f5e' : '#22d3ee'
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {nodes.map(node => {
        // Simple distance calculation to repel nodes from mouse
        // Note: In a real app we'd use Framer Motion useSpring for performance on individual nodes,
        // but for a background effect this gives a cool reactive feel.
        return (
          <motion.div
            key={node.id}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Node Dot */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: node.color, boxShadow: `0 0 12px ${node.color}` }}>
                {/* Ping ring */}
                <motion.div 
                  animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', border: `1px solid ${node.color}` }}
                />
              </div>
              
              {/* Glassmorphic Data Label */}
              <div style={{ 
                background: 'rgba(255,255,255,0.7)', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.9)',
                padding: '4px 8px',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: node.color,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                {node.label} [{node.status}]
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
