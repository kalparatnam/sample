import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════
   CommandGlobe — a holographic "nationwide command network" sphere.
   Dotted globe + glowing patrol arcs + pulsing station nodes + a soft
   bloom halo, slow auto-rotation with cursor drag/parallax. Everything
   is additive & unlit (no flat shading → never reads as toy/cartoon),
   transparent canvas so it works on light or a future dark theme.
   ════════════════════════════════════════════════════════════════ */

// soft radial glow sprite texture (for nodes / travellers / atmosphere)
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); return t;
}

function fib(i: number, n: number) { // fibonacci sphere point
  const phi = Math.acos(1 - 2 * (i + 0.5) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi));
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, seg = 48, lift = 0.35) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const p = a.clone().lerp(b, t).normalize();
    p.multiplyScalar(1 + lift * Math.sin(Math.PI * t));
    pts.push(p);
  }
  return pts;
}

export default function CommandGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }); }
    catch { return; }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.15;

    const root = new THREE.Group(); scene.add(root);
    const globe = new THREE.Group(); globe.rotation.z = 0.4; root.add(globe);

    const AZURE = new THREE.Color('#38bdf8'), INDIGO = new THREE.Color('#6366f1'), TEAL = new THREE.Color('#22d3ee'), AMBER = new THREE.Color('#f59e0b');
    const tex = glowTexture();

    // 1 — dotted sphere surface
    const N = 1600; const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const p = fib(i, N); arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.018, map: tex, color: AZURE, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    globe.add(new THREE.Points(pGeo, pMat));

    // 2 — faint wireframe shell for structure
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.998, 2)),
      new THREE.LineBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
    globe.add(wire);

    // 3 — orbit rings (Pytia/Sapforce feel)
    [[0, 0.2], [Math.PI / 2.4, -0.3]].forEach(([tilt, _], k) => {
      const ringPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; ringPts.push(new THREE.Vector3(Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45)); }
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts),
        new THREE.LineBasicMaterial({ color: k ? TEAL : AZURE, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.x = Math.PI / 2 + tilt; ring.rotation.z = tilt * 0.5; root.add(ring);
    });

    // 4 — patrol arcs + travelling pulses + station nodes
    const travellers: { sprite: THREE.Sprite; pts: THREE.Vector3[]; off: number; speed: number }[] = [];
    const nodeSprites: THREE.Sprite[] = [];
    const ARCS = 11;
    for (let i = 0; i < ARCS; i++) {
      const a = fib((i * 53) % N, N), b = fib((i * 97 + 17) % N, N);
      const pts = arcPoints(a, b);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: i % 3 === 0 ? TEAL : AZURE, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }));
      globe.add(line);
      // node glows at endpoints
      [a, b].forEach((pt, j) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: (i + j) % 4 === 0 ? AMBER : AZURE, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
        s.position.copy(pt); s.scale.setScalar(0.12); globe.add(s); nodeSprites.push(s);
      });
      // traveller
      const tr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: i % 3 === 0 ? TEAL : AMBER, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }));
      tr.scale.setScalar(0.1); globe.add(tr);
      travellers.push({ sprite: tr, pts, off: Math.random(), speed: 0.06 + Math.random() * 0.06 });
    }

    // pointer parallax
    const target = { x: 0.4, y: 0 }; const cur = { x: 0.4, y: 0 };
    const onMove = (e: MouseEvent) => { target.x = (e.clientX / window.innerWidth - 0.5) * 0.9 + 0.4; target.y = (e.clientY / window.innerHeight - 0.5) * 0.6; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const resize = () => {
      const r = canvas.getBoundingClientRect(); const w = r.width || 1, h = r.height || 1;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize(); const ro = new ResizeObserver(resize); ro.observe(canvas);

    const clock = new THREE.Clock(); let raf = 0, running = true;
    const v = new THREE.Vector3();
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!running) return;
      const t = clock.getElapsedTime();
      if (!reduce) globe.rotation.y += 0.0016;
      cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05;
      root.rotation.y = cur.x * 0.5; root.rotation.x = cur.y;
      // pulse nodes
      nodeSprites.forEach((s, i) => s.scale.setScalar(0.1 + Math.abs(Math.sin(t * 1.6 + i)) * 0.06));
      // move travellers
      travellers.forEach(tr => {
        let f = (tr.off + t * tr.speed) % 1; const idx = Math.min(tr.pts.length - 1, Math.floor(f * (tr.pts.length - 1)));
        v.copy(tr.pts[idx]); tr.sprite.position.copy(v);
        tr.sprite.material.opacity = 0.6 + Math.sin(f * Math.PI) * 0.4;
      });
      renderer.render(scene, camera);
    };
    const vis = () => { running = !document.hidden; if (running) { clock.start(); frame(); } else { cancelAnimationFrame(raf); clock.stop(); } };
    document.addEventListener('visibilitychange', vis);
    if (reduce) renderer.render(scene, camera); else frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('mousemove', onMove); document.removeEventListener('visibilitychange', vis);
      renderer.dispose(); pGeo.dispose(); tex.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
      <div aria-hidden style={{ position: 'absolute', inset: '-15%', background: 'radial-gradient(circle at 50% 50%, var(--glow-indigo), transparent 58%)', filter: 'blur(52px)', pointerEvents: 'none' }} />
      <canvas ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', cursor: 'grab' }} />
    </div>
  );
}
