import { motion } from 'framer-motion';
import { MapPin, ShieldAlert, Radio, Target } from 'lucide-react';

// A 3D isometric map grid with animated patrol nodes
export const IsometricMap = ({ className = '' }) => {
  return (
    <div className={className} style={{ perspective: '1000px', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '120%', height: '120%',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg)',
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          position: 'relative'
        }}
      >
        {/* Animated Radar Sweep */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: '50%', height: '50%', background: 'conic-gradient(from 0deg, transparent 70%, rgba(34,211,238,0.4) 100%)', borderRadius: '100% 0 0 0', transformOrigin: 'bottom right' }}
        />
        
        {/* Patrol Nodes */}
        {[
          { top: '20%', left: '30%', color: '#10b981', delay: 0 },
          { top: '60%', left: '70%', color: '#22d3ee', delay: 1 },
          { top: '80%', left: '40%', color: '#6366f1', delay: 2 },
          { top: '40%', left: '80%', color: '#f43f5e', delay: 0.5, alert: true }
        ].map((node, i) => (
          <motion.div key={i} style={{ position: 'absolute', top: node.top, left: node.left, transformStyle: 'preserve-3d' }}>
            <motion.div
              animate={{ height: node.alert ? [20, 60, 20] : [10, 30, 10], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
              style={{ width: 4, background: node.color, boxShadow: `0 0 15px ${node.color}`, transform: 'rotateX(-90deg)', transformOrigin: 'bottom center' }}
            />
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1px solid ${node.color}`, position: 'absolute', top: -10, left: -8, opacity: 0.5 }} />
            {node.alert && (
              <motion.div
                animate={{ scale: [1, 3], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${node.color}`, position: 'absolute', top: -15, left: -13 }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// A floating glassmorphic data card that tilts on hover and reacts to scroll
export const FloatingDataCard = ({ title, value, status, icon, color, top, left, delay = 0 }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, rotateX: 10, rotateY: -10 }}
      style={{
        position: 'absolute', top, left,
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,255,255,0.1)`, borderTopColor: `${color}80`,
        borderRadius: '16px', padding: '16px',
        boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 ${color}40`,
        display: 'flex', alignItems: 'center', gap: '16px',
        zIndex: 10, transformStyle: 'preserve-3d'
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{title}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>{value}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
        <span style={{ fontSize: '11px', color }}>{status}</span>
      </div>
    </motion.div>
  );
};

// Animated connection lines between points
export const ConnectionLines = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
    <motion.path
      d="M 100 100 Q 300 50 500 200 T 900 150"
      fill="transparent"
      stroke="rgba(99,102,241,0.3)"
      strokeWidth="2"
      strokeDasharray="10 10"
      animate={{ strokeDashoffset: [0, -100] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />
    <motion.circle cx="100" cy="100" r="4" fill="#6366f1" />
    <motion.circle cx="500" cy="200" r="4" fill="#22d3ee" />
    <motion.circle cx="900" cy="150" r="4" fill="#a855f7" />
  </svg>
);
