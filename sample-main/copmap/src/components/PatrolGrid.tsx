import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════
   PatrolGrid — a top-down perspective city grid with patrol units
   moving through it in real time. Represents GPS tracking on the
   Product page. Completely different from CommandGlobe (sphere)
   — this is flat, city-level, top-down, all about movement.
   ════════════════════════════════════════════════════════════════ */

function makeGlowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.28, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function routeLength(pts: THREE.Vector3[]) {
  let l = 0; for (let i = 1; i < pts.length; i++) l += pts[i].distanceTo(pts[i - 1]); return l;
}
function routeAt(pts: THREE.Vector3[], t: number): THREE.Vector3 {
  let d = ((t % 1) + 1) % 1 * routeLength(pts);
  for (let i = 1; i < pts.length; i++) {
    const seg = pts[i].distanceTo(pts[i - 1]); if (d <= seg) return pts[i - 1].clone().lerp(pts[i], d / seg); d -= seg;
  }
  return pts[pts.length - 1].clone();
}

export default function PatrolGrid() {
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
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 5.8, 5.2);
    camera.lookAt(0, 0, -0.5);

    const INDIGO = new THREE.Color('#6366f1');
    const AZURE = new THREE.Color('#38bdf8');
    const TEAL = new THREE.Color('#22d3ee');
    const AMBER = new THREE.Color('#f59e0b');
    const glowTex = makeGlowTex();

    // ── street grid (11×11, spacing 1 unit) ──────────────────────
    const G = 5; // grid half-size
    const gridVerts: number[] = [];
    for (let i = -G; i <= G; i++) {
      gridVerts.push(-G, 0, i, G, 0, i);   // rows
      gridVerts.push(i, 0, -G, i, 0, G);   // cols
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridVerts), 3));
    scene.add(new THREE.LineSegments(gridGeo,
      new THREE.LineBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })));

    // ── highlighted patrol zones (rectangle outlines) ─────────────
    const zoneDefs = [
      { x: -3, z: -4, w: 2.8, d: 2.5, c: AZURE },
      { x: 0.4, z: 0.5, w: 3, d: 2.8, c: TEAL },
      { x: -4, z: 1.5, w: 2.5, d: 3, c: INDIGO },
    ];
    const zoneMats: THREE.LineBasicMaterial[] = [];
    zoneDefs.forEach(z => {
      const pts = [
        new THREE.Vector3(z.x, 0.02, z.z),
        new THREE.Vector3(z.x + z.w, 0.02, z.z),
        new THREE.Vector3(z.x + z.w, 0.02, z.z + z.d),
        new THREE.Vector3(z.x, 0.02, z.z + z.d),
        new THREE.Vector3(z.x, 0.02, z.z),
      ];
      const mat = new THREE.LineBasicMaterial({ color: z.c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
      zoneMats.push(mat);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    });

    // ── patrol routes ─────────────────────────────────────────────
    const routes = [
      [[-4, -3], [-1, -3], [-1, 0], [2, 0], [2, 3]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[3, -4], [3, 1], [0, 1], [0, 4]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[-4, 2], [-2, 2], [-2, -1], [1, -1], [1, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[4, 2], [1, 2], [1, -3], [-2, -3]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[-3, -4], [-3, 0], [0, 0], [0, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[4, -2], [2, -2], [2, 3], [-1, 3]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
      [[-4, -4], [-4, 4], [4, 4], [4, -4], [-4, -4]].map(([x, z]) => new THREE.Vector3(x, 0, z)),
    ];

    // Route trail lines
    const routeColors = [AZURE, TEAL, AZURE, INDIGO, TEAL, AZURE, INDIGO];
    routes.forEach((route, i) => {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(route),
        new THREE.LineBasicMaterial({ color: routeColors[i], transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })));
    });

    // Patrol unit sprites
    const unitColors = [AZURE, TEAL, AZURE, AMBER, TEAL, AZURE, INDIGO];
    const units = routes.map((route, i) => {
      const mat = new THREE.SpriteMaterial({ map: glowTex, color: unitColors[i], transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(0.32);
      scene.add(sprite);
      return { sprite, route, off: i / routes.length, speed: 0.07 + (i % 3) * 0.02 };
    });

    // Incident / active-alert markers (larger amber pings at intersections)
    const alertPos = [new THREE.Vector3(-1, 0.02, -1), new THREE.Vector3(2, 0.02, 2), new THREE.Vector3(-3, 0.02, -2)];
    const alertSprites: THREE.Sprite[] = [];
    alertPos.forEach(p => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: AMBER, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.position.copy(p); s.scale.setScalar(0.22); scene.add(s); alertSprites.push(s);
    });

    // Station nodes at grid intersections
    [[-3, -3], [3, -3], [-3, 3], [3, 3], [0, 0]].forEach(([x, z], i) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: i === 4 ? TEAL : AZURE, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.position.set(x, 0.02, z); s.scale.setScalar(i === 4 ? 0.26 : 0.18); scene.add(s);
    });

    // cursor parallax
    const cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { tgt.x = (e.clientX / window.innerWidth - 0.5) * 0.6; tgt.y = (e.clientY / window.innerHeight - 0.5) * 0.4; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const resize = () => {
      const r = canvas.getBoundingClientRect(); const w = r.width || 1, h = r.height || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize(); const ro = new ResizeObserver(resize); ro.observe(canvas);

    const clock = new THREE.Clock(); let raf = 0, running = true;
    const frame = () => {
      raf = requestAnimationFrame(frame); if (!running) return;
      const t = clock.getElapsedTime();

      cur.x += (tgt.x - cur.x) * 0.04;
      cur.y += (tgt.y - cur.y) * 0.04;
      camera.position.x = cur.x * 1.4;
      camera.position.y = 5.8 - cur.y * 0.8;
      camera.lookAt(0, 0, -0.5);

      units.forEach(u => {
        const p = routeAt(u.route, u.off + t * u.speed);
        p.y = 0.18 + Math.sin(t * 2.2 + u.off * 8) * 0.04;
        u.sprite.position.copy(p);
        u.sprite.scale.setScalar(0.28 + Math.abs(Math.sin(t * 1.8 + u.off * 5)) * 0.06);
      });

      zoneMats.forEach((m, i) => { m.opacity = 0.35 + Math.abs(Math.sin(t * 0.65 + i * 1.3)) * 0.35; });
      alertSprites.forEach((s, i) => {
        s.scale.setScalar(0.18 + Math.abs(Math.sin(t * 1.4 + i * 2)) * 0.1);
        s.material.opacity = 0.6 + Math.abs(Math.sin(t * 1.4 + i * 2)) * 0.38;
      });

      renderer.render(scene, camera);
    };
    const vis = () => { running = !document.hidden; if (running && !reduce) { clock.start(); frame(); } else { cancelAnimationFrame(raf); clock.stop(); } };
    document.addEventListener('visibilitychange', vis);
    if (reduce) renderer.render(scene, camera); else frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('mousemove', onMove); document.removeEventListener('visibilitychange', vis);
      renderer.dispose(); glowTex.dispose(); gridGeo.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div aria-hidden style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(ellipse at 50% 65%, rgba(37,99,235,0.20), rgba(34,211,238,0.10) 50%, transparent 70%)', filter: 'blur(38px)', pointerEvents: 'none', zIndex: 0 }} />
      <canvas ref={ref} style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%', background: 'transparent', cursor: 'default',
        filter: 'drop-shadow(0 0 7px rgba(56,189,248,0.9)) drop-shadow(0 0 18px rgba(34,211,238,0.55)) drop-shadow(0 0 36px rgba(37,99,235,0.22))',
      }} />
    </div>
  );
}
