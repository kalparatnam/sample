import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Lightformer, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════
   GlassHero — the reference-style hero object: a GLOSSY, REFRACTIVE
   glass form (transmission + chromatic aberration) lit by a procedural
   studio environment (Lightformers — no network), with a glowing inner
   core. Reads like Dora/Ambiq/Sapforce: premium, realistic, not toy.
   Distinct shape per page; cursor-reactive; transparent canvas (light
   OR future dark theme). Lazy-loaded by each page.
   ════════════════════════════════════════════════════════════════ */

type Variant = 'orb' | 'knot' | 'crystal' | 'capsule' | 'torus';

function Geo({ variant }: { variant: Variant }) {
  switch (variant) {
    case 'knot': return <torusKnotGeometry args={[1, 0.34, 220, 32]} />;
    case 'crystal': return <icosahedronGeometry args={[1.45, 0]} />;
    case 'capsule': return <capsuleGeometry args={[0.7, 1.1, 24, 48]} />;
    case 'torus': return <torusGeometry args={[1.15, 0.42, 40, 100]} />;
    default: return <sphereGeometry args={[1.4, 96, 96]} />;
  }
}

function CoreGeo({ variant }: { variant: Variant }) {
  if (variant === 'knot') return <torusKnotGeometry args={[1, 0.3, 160, 24]} />;
  if (variant === 'torus') return <torusGeometry args={[1.15, 0.36, 24, 80]} />;
  if (variant === 'capsule') return <capsuleGeometry args={[0.42, 0.7, 16, 32]} />;
  return <icosahedronGeometry args={[variant === 'crystal' ? 0.8 : 0.7, 0]} />;
}

function Model({ variant, tint, core }: { variant: Variant; tint: string; core: string }) {
  const grp = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (glass.current) { glass.current.rotation.x += dt * 0.12; glass.current.rotation.y += dt * 0.18; }
    if (grp.current) {
      grp.current.rotation.y = THREE.MathUtils.lerp(grp.current.rotation.y, state.pointer.x * 0.5, 0.05);
      grp.current.rotation.x = THREE.MathUtils.lerp(grp.current.rotation.x, -state.pointer.y * 0.4, 0.05);
    }
  });
  return (
    <group ref={grp}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        {/* glowing inner core (shows through the glass) */}
        <mesh scale={0.62}>
          <CoreGeo variant={variant} />
          <meshStandardMaterial color={core} emissive={core} emissiveIntensity={1.4} roughness={0.3} metalness={0.4} toneMapped={false} />
        </mesh>
        {/* refractive glass shell */}
        <mesh ref={glass}>
          <Geo variant={variant} />
          <MeshTransmissionMaterial
            samples={6} resolution={256} thickness={1.6} ior={1.45} chromaticAberration={0.4}
            anisotropy={0.3} roughness={0.06} distortion={0.3} distortionScale={0.4} temporalDistortion={0.1}
            transmission={1} color={tint} attenuationColor={tint} attenuationDistance={1.4} />
        </mesh>
      </Float>
    </group>
  );
}

const PALETTE: Record<Variant, { tint: string; core: string }> = {
  orb: { tint: '#cfe0ff', core: '#4f46e5' },
  knot: { tint: '#d4ecff', core: '#2563eb' },
  crystal: { tint: '#cde8ff', core: '#06b6d4' },
  capsule: { tint: '#dbe6ff', core: '#38bdf8' },
  torus: { tint: '#ffe9c7', core: '#f59e0b' },
};

export default function GlassHero({ variant = 'orb' }: { variant?: Variant }) {
  const { tint, core } = PALETTE[variant];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
      {/* soft full-bleed bloom — no hard edge / no boundary box */}
      <div aria-hidden style={{ position: 'absolute', inset: '-25%', background: `radial-gradient(circle at 50% 45%, ${core}2e, transparent 55%)`, filter: 'blur(55px)', pointerEvents: 'none' }} />
      <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 5], fov: 42 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} style={{ position: 'relative', background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <Model variant={variant} tint={tint} core={core} />
          {/* procedural studio env (no network) → real reflections on the glass */}
          <Environment resolution={256}>
            <Lightformer intensity={3} color="#ffffff" position={[0, 3, 2]} scale={[6, 3, 1]} />
            <Lightformer intensity={2} color={core} position={[-4, -1, 1]} scale={[3, 3, 1]} />
            <Lightformer intensity={2} color="#38bdf8" position={[4, 1, 2]} scale={[3, 3, 1]} />
            <Lightformer intensity={1.4} color="#ffffff" position={[0, -3, 1]} scale={[6, 2, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
