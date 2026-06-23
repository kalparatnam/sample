import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxAssetProps {
  src: string;
  alt: string;
  width: number | string;
  className?: string;
  style?: React.CSSProperties;
  // Scroll Parallax settings
  yOffset?: [number, number]; // [startOffset, endOffset]
  xOffset?: [number, number];
  rotateOffset?: [number, number];
  scaleOffset?: [number, number];
}

export default function ParallaxAsset({ 
  src, 
  alt, 
  width, 
  className = "", 
  style = {},
  yOffset = [100, -100],
  xOffset = [0, 0],
  rotateOffset = [0, 0],
  scaleOffset = [1, 1]
}: ParallaxAssetProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Apply smoothing physics to the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const y = useTransform(smoothProgress, [0, 1], yOffset);
  const x = useTransform(smoothProgress, [0, 1], xOffset);
  const rotate = useTransform(smoothProgress, [0, 1], rotateOffset);
  const scale = useTransform(smoothProgress, [0, 1], scaleOffset);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        width,
        y,
        x,
        rotate,
        scale,
        position: 'absolute',
        zIndex: 0,
        pointerEvents: 'auto', // Allow hover
        cursor: 'grab'
      }}
      // Interactive hover tilt
      whileHover={{ scale: 1.05, rotateZ: 2, rotateX: 10, rotateY: 15 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block',
          mixBlendMode: 'multiply', // Crucial: Hides white background on light theme
          filter: 'contrast(1.1) brightness(0.95) drop-shadow(0 20px 30px rgba(79,70,229,0.2))'
        }} 
      />
    </motion.div>
  );
}
