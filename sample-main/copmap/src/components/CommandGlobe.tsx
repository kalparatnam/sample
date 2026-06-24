import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════
   CommandGlobe — the "nationwide command network" sphere (v3, clean).
   Bloom is simulated via CSS drop-shadow (preserves canvas alpha).
   postprocessing EffectComposer was removed because it breaks the
   WebGL canvas alpha channel → showed as a solid opaque box.
   ════════════════════════════════════════════════════════════════ */

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function ringTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = 'rgba(255,255,255,1)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(32, 32, 26, 0, Math.PI * 2); ctx.stroke();
  return new THREE.CanvasTexture(c);
}

function fib(i: number, n: number) {
  const phi = Math.acos(1 - 2 * (i + 0.5) / n);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi));
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, seg = 64, lift = 0.38) {
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
    camera.position.z = 3.0;

    const root = new THREE.Group(); scene.add(root);
    const globe = new THREE.Group(); globe.rotation.z = 0.42; root.add(globe);

    const AZURE = new THREE.Color('#38bdf8'), INDIGO = new THREE.Color('#6366f1'), TEAL = new THREE.Color('#22d3ee'), AMBER = new THREE.Color('#f59e0b');
    const tex = glowTexture();
    const ringTex = ringTexture();

    // 1 — dotted earth (denser, latitude-tinted indigo↔azure), brighter without bloom
    const N = 2600; const pos = new Float32Array(N * 3); const col = new Float32Array(N * 3);
    const cTmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const p = fib(i, N);
      pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
      cTmp.copy(INDIGO).lerp(AZURE, (p.y + 1) / 2);
      col[i * 3] = cTmp.r; col[i * 3 + 1] = cTmp.g; col[i * 3 + 2] = cTmp.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.022, map: tex, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
    globe.add(new THREE.Points(pGeo, pMat));

    // 2 — fresnel atmosphere rim
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
      uniforms: { uColor: { value: new THREE.Color('#6aa8ff') } },
      vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vP = mv.xyz; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vP; void main(){ vec3 vd = normalize(-vP); float f = pow(1.0 - max(dot(vN, vd), 0.0), 3.0); gl_FragColor = vec4(uColor, f * 0.9); }`,
    });
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.07, 64, 64), atmoMat));

    // faint inner shell
    globe.add(new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.985, 2)),
      new THREE.LineBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })));

    // 3 — orbit rings
    [[0, 1], [Math.PI / 2.4, -1]].forEach(([tilt], k) => {
      const ringPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; ringPts.push(new THREE.Vector3(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5)); }
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts),
        new THREE.LineBasicMaterial({ color: k ? TEAL : AZURE, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.x = Math.PI / 2 + tilt; ring.rotation.z = tilt * 0.5; root.add(ring);
    });

    // 4 — patrol arcs + travelling pulses + station nodes + live pings
    const travellers: { sprite: THREE.Sprite; pts: THREE.Vector3[]; off: number; speed: number }[] = [];
    const nodeSprites: THREE.Sprite[] = [];
    const pings: { sprite: THREE.Sprite; off: number }[] = [];
    const ARCS = 16;
    for (let i = 0; i < ARCS; i++) {
      const a = fib((i * 53) % N, N), b = fib((i * 97 + 17) % N, N);
      const pts = arcPoints(a, b);
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: i % 3 === 0 ? TEAL : AZURE, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })));
      [a, b].forEach((pt, j) => {
        const isAmber = (i + j) % 4 === 0;
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: isAmber ? AMBER : AZURE, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false }));
        s.position.copy(pt); s.scale.setScalar(0.14); globe.add(s); nodeSprites.push(s);
        if ((i + j) % 3 === 0) {
          const ring = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, color: isAmber ? AMBER : TEAL, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
          ring.position.copy(pt); globe.add(ring); pings.push({ sprite: ring, off: Math.random() });
        }
      });
      const tr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: i % 3 === 0 ? TEAL : AMBER, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false }));
      tr.scale.setScalar(0.12); globe.add(tr);
      travellers.push({ sprite: tr, pts, off: Math.random(), speed: 0.06 + Math.random() * 0.06 });
    }

    // pointer parallax
    const target = { x: 0.35, y: 0 }; const cur = { x: 0.35, y: 0 };
    const onMove = (e: MouseEvent) => { target.x = (e.clientX / window.innerWidth - 0.5) * 0.9 + 0.35; target.y = (e.clientY / window.innerHeight - 0.5) * 0.6; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const resize = () => {
      const r = canvas.getBoundingClientRect(); const w = r.width || 1, h = r.height || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
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
      nodeSprites.forEach((s, i) => s.scale.setScalar(0.11 + Math.abs(Math.sin(t * 1.6 + i)) * 0.06));
      pings.forEach((p) => {
        const f = (p.off + t * 0.5) % 1;
        p.sprite.scale.setScalar(0.14 + f * 0.5);
        p.sprite.material.opacity = (1 - f) * 0.8;
      });
      travellers.forEach(tr => {
        const f = (tr.off + t * tr.speed) % 1;
        const idx = Math.min(tr.pts.length - 1, Math.floor(f * (tr.pts.length - 1)));
        v.copy(tr.pts[idx]); tr.sprite.position.copy(v);
        tr.sprite.material.opacity = 0.6 + Math.sin(f * Math.PI) * 0.4;
      });
      renderer.render(scene, camera);
    };
    const vis = () => { running = !document.hidden; if (running && !reduce) { clock.start(); frame(); } else { cancelAnimationFrame(raf); clock.stop(); } };
    document.addEventListener('visibilitychange', vis);
    if (reduce) renderer.render(scene, camera); else frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('mousemove', onMove); document.removeEventListener('visibilitychange', vis);
      renderer.dispose(); pGeo.dispose(); tex.dispose(); ringTex.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* soft CSS glow halo — much more controllable than postprocessing on transparent canvas */}
      <div aria-hidden style={{ position: 'absolute', inset: '-12%', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.22), rgba(56,189,248,0.10) 50%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <canvas ref={ref} style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        background: 'transparent', cursor: 'grab',
        filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.85)) drop-shadow(0 0 20px rgba(56,189,248,0.55)) drop-shadow(0 0 40px rgba(37,99,235,0.25))',
      }} />
    </div>
  );
}
