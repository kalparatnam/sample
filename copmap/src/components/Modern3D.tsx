import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Float, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── 1. LIQUID WAVE BACKGROUND (Home Hero) ──
function LiquidWave() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positionAttribute = meshRef.current.geometry.getAttribute('position');
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const u = positionAttribute.getX(i);
        const v = positionAttribute.getY(i);
        const z = Math.sin(u * 2 + time) * 0.5 + Math.cos(v * 2 + time * 0.8) * 0.5;
        positionAttribute.setZ(i, z);
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshStandardMaterial 
        color="#00f0ff" 
        emissive="#00d4ff"
        emissiveIntensity={0.2}
        wireframe={true} 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
}

export function LiquidWaveBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={1} />
        <LiquidWave />
      </Canvas>
    </div>
  );
}

// ── 2. TACTICAL HEX RADAR (Features Page) ──
function HexagonGrid() {
  const groupRef = useRef<THREE.Group>(null);
  
  const hexRadius = 0.5;
  const hexWidth = hexRadius * Math.sqrt(3);
  const hexHeight = hexRadius * 2;
  
  const hexPositions = useMemo(() => {
    const pos = [];
    const cols = 10;
    const rows = 10;
    for (let r = 0; r < rows; r++) {
      for (let q = 0; q < cols; q++) {
        const x = (q + (r % 2 === 0 ? 0 : 0.5)) * hexWidth;
        const z = r * hexHeight * 0.75;
        pos.push(new THREE.Vector3(x - (cols * hexWidth)/2, 0, z - (rows * hexHeight)/2));
      }
    }
    return pos;
  }, [hexWidth, hexHeight]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const x = hexPositions[i].x;
        const z = hexPositions[i].z;
        const y = Math.sin(x * 0.5 + time) * 0.2 + Math.cos(z * 0.5 + time) * 0.2;
        child.position.y = y;
        const scale = 0.8 + Math.sin(time * 2 + i) * 0.2;
        child.scale.set(scale, 1, scale);
      });
    }
  });

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = hexRadius * Math.cos(angle);
      const y = hexRadius * Math.sin(angle);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return shape;
  }, [hexRadius]);

  const extrudeSettings = { depth: 0.1, bevelEnabled: false };

  return (
    <group ref={groupRef}>
      {hexPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[hexShape, extrudeSettings]} />
          <meshStandardMaterial 
            color="#00f0ff" 
            emissive="#00f0ff"
            emissiveIntensity={Math.random() > 0.8 ? 2 : 0.2} 
            transparent 
            opacity={0.4} 
            wireframe={Math.random() > 0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

export function TacticalHexRadar() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'crosshair' }}>
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <ambientLight intensity={1} />
        <PresentationControls global rotation={[0, 0, 0]} polar={[-0.2, 0.4]} azimuth={[-0.5, 0.5]}>
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
            <HexagonGrid />
            <mesh position={[0, 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1, 1.05, 32]} />
              <meshBasicMaterial color="#ff003c" transparent opacity={0.8} />
            </mesh>
            <Line points={[[0, 2, -1.2], [0, 2, -0.8]]} color="#ff003c" />
            <Line points={[[0, 2, 1.2], [0, 2, 0.8]]} color="#ff003c" />
            <Line points={[[-1.2, 2, 0], [-0.8, 2, 0]]} color="#ff003c" />
            <Line points={[[1.2, 2, 0], [0.8, 2, 0]]} color="#ff003c" />
            <Html position={[1.5, 2, 0]}>
              <div style={{ color: '#ff003c', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>TARGET LOCKED</div>
            </Html>
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

// ── 3. POLICE SURVEILLANCE DRONE (Product Page) ──
function DroneModel() {
  const groupRef = useRef<THREE.Group>(null);
  const rotor1 = useRef<THREE.Mesh>(null);
  const rotor2 = useRef<THREE.Mesh>(null);
  const rotor3 = useRef<THREE.Mesh>(null);
  const rotor4 = useRef<THREE.Mesh>(null);
  const scannerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (rotor1.current) rotor1.current.rotation.y += 0.5;
    if (rotor2.current) rotor2.current.rotation.y -= 0.5;
    if (rotor3.current) rotor3.current.rotation.y -= 0.5;
    if (rotor4.current) rotor4.current.rotation.y += 0.5;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.2;
      groupRef.current.rotation.z = Math.sin(time) * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 1.5) * 0.05;
    }
    if (scannerRef.current) {
      (scannerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(time * 10) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.8]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.1} transmission={0.9} thickness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhysicalMaterial color="#00f0ff" metalness={0.8} roughness={0.2} />
      </mesh>
      {[
        [0.6, 0, 0.4], [0.6, 0, -0.4], [-0.6, 0, 0.4], [-0.6, 0, -0.4]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
      {[
        { ref: rotor1, pos: [1, 0.1, 0.8] }, { ref: rotor2, pos: [1, 0.1, -0.8] },
        { ref: rotor3, pos: [-1, 0.1, 0.8] }, { ref: rotor4, pos: [-1, 0.1, -0.8] }
      ].map((r, i) => (
        <group key={i} position={r.pos as [number, number, number]}>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh ref={r.ref}>
            <boxGeometry args={[0.8, 0.02, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.2, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={scannerRef} position={[0, -0.25, 0.4]} rotation={[Math.PI/2, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -2, 0.4]}>
        <cylinderGeometry args={[0.02, 0.5, 4]} />
        <meshBasicMaterial color="#ff003c" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function TacticalDroneScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'crosshair' }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <PresentationControls global rotation={[0, -Math.PI/4, 0]} polar={[-0.2, 0.2]} azimuth={[-0.5, 0.5]}>
          <DroneModel />
        </PresentationControls>
      </Canvas>
    </div>
  );
}

// ── 4. AI GENERATIVE CORE (About Page) ──
function CoreModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  const cubes = useMemo(() => {
    const temp = [];
    for(let i=0; i<150; i++) {
       temp.push({
         pos: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3],
         scale: Math.random() * 0.2 + 0.05
       })
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if(groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.rotation.x = time * 0.1;
      
      groupRef.current.children.forEach((child, i) => {
        if(i === 0) return; // Skip central octahedron
        const scaleBase = cubes[i-1].scale;
        const scale = scaleBase + Math.sin(time * 3 + i) * 0.05;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial color="#ffffff" metalness={0.9} roughness={0.1} transmission={0.9} thickness={1} />
      </mesh>
      {cubes.map((c, i) => (
        <mesh key={i+1} position={c.pos as [number,number,number]}>
          <boxGeometry args={[1,1,1]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#00f0ff" : "#ff003c"} 
            emissive={i % 2 === 0 ? "#00f0ff" : "#ff003c"} 
            emissiveIntensity={1} 
            wireframe={i % 3 === 0} 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      ))}
    </group>
  );
}

export function AIGenerativeCore() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'crosshair' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <PresentationControls global rotation={[0, 0, 0]} polar={[-0.2, 0.2]} azimuth={[-0.5, 0.5]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <CoreModel />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

// ── 5. SATELLITE UPLINK (Contact Page) ──
function SatelliteModel() {
  const groupRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if(groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.1;
    }
    if(dishRef.current) {
      dishRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;
      dishRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
    }
    if(ringRef.current) {
      const scale = (time * 1.5) % 3;
      const opacity = Math.max(0, 1 - scale / 3);
      ringRef.current.scale.set(scale, scale, scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <group ref={dishRef} position={[0, 0.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.8} roughness={0.1} transmission={0.9} thickness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2]} />
          <meshStandardMaterial color="#ff003c" emissive="#ff003c" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, 0, 1.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
        <mesh ref={ringRef} position={[0, 0, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
}

export function SatelliteUplink() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', cursor: 'crosshair' }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <PresentationControls global rotation={[0, -Math.PI/4, 0]} polar={[-0.2, 0.2]} azimuth={[-0.5, 0.5]}>
          <SatelliteModel />
        </PresentationControls>
      </Canvas>
    </div>
  );
}
