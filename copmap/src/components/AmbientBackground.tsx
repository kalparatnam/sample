/**
 * AmbientBackground — Premium WebGL Particle Field
 * 3000 indigo/cyan star particles with:
 * - Cursor repulsion (hover)
 * - Scroll depth parallax
 * - Slow cinematic drift
 * CSS Aurora orbs in the background for glassmorphism depth
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    /* ── Particle geometry ── */
    const COUNT = window.innerWidth < 768 ? 1000 : 2500;
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const colorMix = new Float32Array(COUNT); // 0=indigo, 1=cyan

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i]    = Math.random() * 2.0 + 0.3;
      colorMix[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:    { value: 0 },
        uScrollY: { value: 0 },
        uMouseX:  { value: 0 },
        uMouseY:  { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aColorMix;
        uniform float uTime;
        uniform float uScrollY;
        uniform float uMouseX;
        uniform float uMouseY;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          vColorMix = aColorMix;
          vec3 pos = position;

          // Organic drift — each particle unique phase
          float phase = pos.x * 0.7 + pos.y * 0.5 + pos.z * 0.3;
          pos.x += sin(uTime * 0.18 + phase) * 0.12;
          pos.y += cos(uTime * 0.14 + phase * 1.3) * 0.09;
          pos.z += sin(uTime * 0.10 + phase * 0.9) * 0.05;

          // Scroll parallax — depth layers
          pos.y -= uScrollY * (0.3 + abs(pos.z) * 0.25);

          // Cursor repulsion bubble
          float dx = pos.x - uMouseX * 9.0;
          float dy = pos.y - uMouseY * 5.0;
          float dist = sqrt(dx*dx + dy*dy);
          if(dist < 2.0) {
            float force = (2.0 - dist) / 2.0;
            pos.x += dx / (dist + 0.001) * force * 0.5;
            pos.y += dy / (dist + 0.001) * force * 0.5;
          }

          // Fade based on depth
          vAlpha = 0.4 + (pos.z + 3.0) / 6.0 * 0.4;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * (280.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vColorMix;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r = length(uv);
          if(r > 0.5) discard;
          float alpha = (1.0 - r * 2.0) * vAlpha;

          // Indigo (6366f1) → Cyan (22d3ee)
          vec3 indigo = vec3(0.388, 0.400, 0.945);
          vec3 cyan   = vec3(0.133, 0.827, 0.933);
          // Purple accent (a855f7)
          vec3 violet = vec3(0.659, 0.333, 0.969);
          
          vec3 color = mix(indigo, cyan, vColorMix);
          color = mix(color, violet, smoothstep(0.6, 1.0, vColorMix) * 0.5);

          gl_FragColor = vec4(color, alpha * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let scrollY = 0, mouseX = 0, mouseY = 0, tMX = 0, tMY = 0;
    let rafId = 0, clock = 0, lastTs = 0;

    const onScroll    = () => { scrollY = window.scrollY / window.innerHeight; };
    const onMouse     = (e: MouseEvent) => {
      tMX = (e.clientX / window.innerWidth - 0.5) * 2;
      tMY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize    = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const onVisibility = () => { isVisible.current = !document.hidden; };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (ts: number) => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible.current) return;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts; clock += dt;

      mouseX += (tMX - mouseX) * 0.05;
      mouseY += (tMY - mouseY) * 0.05;

      mat.uniforms.uTime.value    = clock;
      mat.uniforms.uScrollY.value = scrollY * -0.015;
      mat.uniforms.uMouseX.value  = mouseX;
      mat.uniforms.uMouseY.value  = mouseY;

      points.rotation.y = clock * 0.006;
      points.rotation.x = Math.sin(clock * 0.04) * 0.025;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* WebGL particle canvas */}
      <canvas ref={canvasRef} aria-hidden="true" style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* CSS Aurora orbs — provide the glassmorphism base color wash */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        {/* Top-left — Indigo orb */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '65vw', height: '65vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'aorb1 30s ease-in-out infinite alternate',
        }} />
        {/* Bottom-right — Cyan orb */}
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-15%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 65%)',
          filter: 'blur(100px)',
          animation: 'aorb2 38s ease-in-out infinite alternate',
        }} />
        {/* Center — Violet pulse */}
        <div style={{
          position: 'absolute', top: '30%', left: '30%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.03) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'aorb3 25s ease-in-out infinite alternate',
        }} />
        {/* Dark vignette to keep text readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(3,4,10,0.85) 100%),
            linear-gradient(180deg, rgba(3,4,10,0.3) 0%, transparent 30%, transparent 70%, rgba(3,4,10,0.5) 100%)
          `,
        }} />
      </div>

      <style>{`
        @keyframes aorb1 { 0%{top:-20%;left:-15%} 100%{top:8%;left:5%} }
        @keyframes aorb2 { 0%{bottom:-15%;right:-15%} 100%{bottom:8%;right:2%} }
        @keyframes aorb3 { 0%{top:30%;left:30%;opacity:.8} 100%{top:50%;left:20%;opacity:.4} }
        @media(prefers-reduced-motion:reduce){
          canvas[aria-hidden]{display:none}
          [aria-hidden] div{animation:none!important}
        }
      `}</style>
    </>
  );
}
