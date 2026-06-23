import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// A ripple effect that expands when a user clicks to deploy a unit
function Ripple({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.scale.x += delta * 4;
      meshRef.current.scale.y += delta * 4;
      materialRef.current.opacity -= delta * 1.5;
      if (materialRef.current.opacity <= 0) {
        onComplete();
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.1, 0.15, 32]} />
      <meshBasicMaterial ref={materialRef} color="#00e5ff" transparent opacity={0.8} />
    </mesh>
  );
}

// Marker that drops on click
function Marker({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const startY = position[1] + 2;
  
  useFrame((state) => {
    if (ref.current) {
      // Drop animation
      if (ref.current.position.y > position[1]) {
        ref.current.position.y -= 0.1;
      } else {
        ref.current.position.y = position[1];
        // Bobbing animation once landed
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      }
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <group ref={ref} position={[position[0], startY, position[2]]}>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshBasicMaterial color="#ff2a85" wireframe />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.14, 0.38, 4]} />
        <meshBasicMaterial color="#ff2a85" transparent opacity={0.3} />
      </mesh>
      <Html position={[0, 0.6, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'var(--bg-void)', border: '1px solid #ff2a85', color: '#ff2a85',
          fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '2px 6px',
          textTransform: 'uppercase', letterSpacing: '0.1em'
        }}>
          Deployed
        </div>
      </Html>
    </group>
  );
}

// The main interactive grid with searchlight
function GridPlayground() {
  const { viewport, mouse, camera } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);
  const targetRef = useRef<THREE.Mesh>(null);
  
  const [markers, setMarkers] = useState<{ id: number, pos: [number, number, number] }[]>([]);
  const [ripples, setRipples] = useState<{ id: number, pos: [number, number, number] }[]>([]);

  useFrame(() => {
    // Convert normalized mouse coordinates to world coordinates
    const x = (mouse.x * viewport.width) / 2;
    const z = -(mouse.y * viewport.height) / 2; // Y becomes Z in 3D grid

    if (lightRef.current) {
      // Searchlight follows cursor with slight lag
      lightRef.current.position.x += (x - lightRef.current.position.x) * 0.1;
      lightRef.current.position.z += (z - lightRef.current.position.z) * 0.1;
    }
    if (targetRef.current) {
      targetRef.current.position.x += (x - targetRef.current.position.x) * 0.1;
      targetRef.current.position.z += (z - targetRef.current.position.z) * 0.1;
      targetRef.current.rotation.z += 0.05;
    }
  });

  const handleGridClick = (e: any) => {
    e.stopPropagation();
    const { point } = e;
    const id = Date.now();
    setMarkers(prev => [...prev, { id, pos: [point.x, 0, point.z] }]);
    setRipples(prev => [...prev, { id, pos: [point.x, 0.01, point.z] }]);
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} position={[0, 2, 0]} intensity={4} color="#00e5ff" distance={8} />

      {/* Target Reticle following cursor */}
      <mesh ref={targetRef} position={[0, 0.01, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.3, 0.32, 16]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} />
      </mesh>

      {/* Interactive Floor Grid */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} onClick={handleGridClick} receiveShadow>
        <planeGeometry args={[20, 20, 40, 40]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Invisible plane to catch raycasts properly without wireframe gaps */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} onClick={handleGridClick}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {markers.map(m => <Marker key={m.id} position={m.pos} />)}
      {ripples.map(r => (
        <Ripple key={r.id} position={r.pos} onComplete={() => setRipples(prev => prev.filter(x => x.id !== r.id))} />
      ))}
    </>
  );
}

export default function InteractiveCommandGrid() {
  return (
    <div style={{ width: '100%', height: '500px', background: 'var(--bg-inset)', border: '1px solid var(--border-hard)', position: 'relative', overflow: 'hidden' }}>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, pointerEvents: 'none' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00e5ff', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, background: '#00e5ff', borderRadius: '50%', marginRight: 8, animation: 'pulse 1s infinite' }} />
          Live Command Playground
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Tactical Deployment Grid</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 300 }}>
          Hover to scan sectors with the searchlight. <br/>
          <strong style={{ color: '#ff2a85' }}>Click anywhere on the grid to deploy a patrol unit.</strong>
        </p>
      </div>

      <Canvas camera={{ position: [0, 4, 6], fov: 45 }}>
        <GridPlayground />
      </Canvas>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      `}</style>
    </div>
  );
}
