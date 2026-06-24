import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════
   HoloScene — a family of DISTINCT holographic WebGL 3D objects (one
   per page hero) in the same additive/glow style as the command globe:
     · 'core'    → glass icosa core + orbiting particle shell (About)
     · 'rings'   → tilted signal rings + uplink beam + blips  (Contact)
     · 'lattice' → rotating command node-lattice w/ pulses     (Features)
   Additive & unlit → premium hologram, never toy-like. Transparent
   canvas, RAF + visibility gated, reduced-motion safe.
   ════════════════════════════════════════════════════════════════ */

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!; const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}
function fib(i: number, n: number) {
  const phi = Math.acos(1 - 2 * (i + 0.5) / n), theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi));
}

const AZURE = '#38bdf8', INDIGO = '#6366f1', TEAL = '#22d3ee', AMBER = '#f59e0b';

export default function HoloScene({ variant = 'core' }: { variant?: 'core' | 'rings' | 'lattice' }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); } catch { return; }
    renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100); camera.position.z = 5.2;
    const root = new THREE.Group(); scene.add(root);
    const spin = new THREE.Group(); root.add(spin);
    const tex = glowTexture();
    const additive = (color: string, opacity = 0.4) => new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
    const sprite = (color: string, s: number, o = 0.9) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false })); sp.scale.setScalar(s); return sp; };

    const updaters: ((t: number) => void)[] = [];

    if (variant === 'core') {
      const ico1 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.2, 1)), additive(INDIGO, 0.22)); spin.add(ico1);
      const ico2 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.78, 0)), additive(TEAL, 0.5)); spin.add(ico2);
      const N = 600; const arr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { const p = fib(i, N).multiplyScalar(1.85); arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      spin.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.03, map: tex, color: AZURE, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })));
      const center = sprite(AMBER, 0.7); spin.add(center);
      updaters.push(t => { ico1.rotation.y = t * 0.2; ico1.rotation.x = t * 0.1; ico2.rotation.y = -t * 0.3; center.scale.setScalar(0.6 + Math.sin(t * 2) * 0.12); });
    }

    if (variant === 'rings') {
      [[1.1, AZURE, 0.5], [1.6, TEAL, 0.4], [2.1, INDIGO, 0.32]].forEach(([r, c, o], i) => {
        const pts: THREE.Vector3[] = []; for (let k = 0; k <= 128; k++) { const a = (k / 128) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * (r as number), 0, Math.sin(a) * (r as number))); }
        const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), additive(c as string, o as number));
        ring.rotation.x = Math.PI / 2 + (i - 1) * 0.5; ring.rotation.y = i * 0.4; spin.add(ring);
        updaters.push(t => { ring.rotation.z = t * (0.2 + i * 0.12) * (i % 2 ? -1 : 1); });
      });
      const center = sprite(AZURE, 0.8); spin.add(center);
      const blips: THREE.Sprite[] = [];
      for (let i = 0; i < 7; i++) { const b = sprite(i % 2 ? AMBER : TEAL, 0.18); const a = Math.random() * Math.PI * 2, rr = 0.6 + Math.random() * 1.5; b.position.set(Math.cos(a) * rr, (Math.random() - 0.5) * 0.6, Math.sin(a) * rr); spin.add(b); blips.push(b); }
      // uplink beam + traveller
      const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.6, 0)]), additive(AMBER, 0.4)); spin.add(beam);
      const trav = sprite(AMBER, 0.22); spin.add(trav);
      updaters.push(t => { center.scale.setScalar(0.7 + Math.sin(t * 2.4) * 0.15); blips.forEach((b, i) => b.material.opacity = 0.4 + Math.abs(Math.sin(t * 1.5 + i)) * 0.6); trav.position.y = (t * 1.1) % 2.6; trav.material.opacity = 1 - ((t * 1.1) % 2.6) / 2.6; });
    }

    if (variant === 'lattice') {
      const n = 4, s = 0.9, off = (n - 1) * s / 2;
      const nodes: THREE.Vector3[] = [];
      for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) nodes.push(new THREE.Vector3(x * s - off, y * s - off, z * s - off));
      const parr = new Float32Array(nodes.length * 3); nodes.forEach((p, i) => { parr[i * 3] = p.x; parr[i * 3 + 1] = p.y; parr[i * 3 + 2] = p.z; });
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(parr, 3));
      spin.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.06, map: tex, color: AZURE, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })));
      const edges: number[] = []; const epairs: [THREE.Vector3, THREE.Vector3][] = [];
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { if (Math.abs(nodes[i].distanceTo(nodes[j]) - s) < 0.01) { const a = nodes[i], b = nodes[j]; edges.push(a.x, a.y, a.z, b.x, b.y, b.z); epairs.push([a, b]); } }
      const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(edges), 3));
      spin.add(new THREE.LineSegments(eg, additive(INDIGO, 0.16)));
      const travs = Array.from({ length: 6 }, () => ({ sp: sprite(Math.random() > 0.5 ? AMBER : TEAL, 0.16), e: (Math.random() * epairs.length) | 0, off: Math.random() }));
      travs.forEach(tr => spin.add(tr.sp));
      updaters.push(t => { spin.rotation.y = t * 0.18; spin.rotation.x = Math.sin(t * 0.2) * 0.2; travs.forEach(tr => { const [a, b] = epairs[tr.e]; const f = (tr.off + t * 0.25) % 1; tr.sp.position.lerpVectors(a, b, f); tr.sp.material.opacity = Math.sin(f * Math.PI); }); });
    }

    const tgt = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { tgt.x = (e.clientX / window.innerWidth - 0.5) * 0.7; tgt.y = (e.clientY / window.innerHeight - 0.5) * 0.5; };
    window.addEventListener('mousemove', onMove, { passive: true });
    const resize = () => { const r = canvas.getBoundingClientRect(); const w = r.width || 1, h = r.height || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(canvas);

    const clock = new THREE.Clock(); let raf = 0, running = true;
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!running) return;
      const t = reduce ? 6 : clock.getElapsedTime();
      if (!reduce) { spin.rotation.y += variant === 'lattice' ? 0 : 0.0016; }
      cur.x += (tgt.x - cur.x) * 0.05; cur.y += (tgt.y - cur.y) * 0.05;
      root.rotation.y = cur.x; root.rotation.x = cur.y;
      updaters.forEach(u => u(t));
      renderer.render(scene, camera);
    };
    const vis = () => { running = !document.hidden; if (running) { clock.start(); frame(); } else { cancelAnimationFrame(raf); clock.stop(); } };
    document.addEventListener('visibilitychange', vis);
    if (reduce) { updaters.forEach(u => u(6)); renderer.render(scene, camera); } else frame();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('mousemove', onMove); document.removeEventListener('visibilitychange', vis); renderer.dispose(); tex.dispose(); };
  }, [variant]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
      <div aria-hidden style={{ position: 'absolute', inset: '-15%', background: 'radial-gradient(circle at 50% 50%, var(--glow-indigo), transparent 58%)', filter: 'blur(52px)', pointerEvents: 'none' }} />
      <canvas ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', cursor: 'grab' }} />
    </div>
  );
}
