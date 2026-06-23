import { motion, useScroll, useTransform } from 'framer-motion';

export function Floating3DAsset({ src, alt, scale = 1, delay = 0, yOffset = 20 }: { src: string, alt: string, scale?: number, delay?: number, yOffset?: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow behind the image */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} 
      />
      
      {/* Center Holographic Ring */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
        style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid var(--cyan)', background: 'rgba(0,240,255,0.02)' }}
      />

      {/* The Masked 3D Render Image */}
      <motion.div
        animate={{ y: [-yOffset, yOffset, -yOffset] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        style={{
          width: 320,
          height: 320,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 20px 30px rgba(0, 240, 255, 0.15))'
        }}
      >
        <img 
          src={src} 
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
            // This is the magic CSS that fades out the square borders!
            maskImage: 'radial-gradient(circle closest-side at center, black 60%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle closest-side at center, black 60%, transparent 95%)'
          }}
        />
      </motion.div>
    </div>
  );
}
