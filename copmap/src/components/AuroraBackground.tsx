import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ────────────────────────────────────────────────────────────────
   AuroraBackground — the single site-wide "living canvas".
   A fullscreen GLSL plane: domain-warped fbm noise painted in the
   brand chord (indigo / azure / teal / signal-amber) drifting on its
   own clock, with a cursor-gravity highlight (heavy lag → feels like
   gravity, not tracking). Raw Three.js so we own the RAF loop:
     · paused when the tab is hidden (Page Visibility) — battery
     · prefers-reduced-motion → one static frame, never animated
     · WebGL failure → silent; the CSS pearl-base still carries the page
   ──────────────────────────────────────────────────────────────── */

const FRAG = /* glsl */`
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;   // 0..1, lagged
  uniform float uReduce;  // 1.0 = reduced motion (freeze time)

  // hash + value noise + fbm (cheap, stable across GPUs)
  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, amp = 0.55;
    for(int i=0;i<5;i++){ v += amp*noise(p); p *= 2.02; amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float aspect = uRes.x / uRes.y;
    vec2 p = uv; p.x *= aspect;

    float t = uTime * (1.0 - uReduce);

    // domain warp → organic, flowing aurora ribbons
    vec2 q = vec2(fbm(p + vec2(0.0, t*0.06)), fbm(p + vec2(5.2, -t*0.05)));
    vec2 r = vec2(fbm(p + 1.7*q + vec2(t*0.04, 1.3)), fbm(p + 1.7*q + vec2(-1.1, t*0.03)));
    float f = fbm(p + 2.4*r);

    // brand chord
    vec3 indigo = vec3(0.31, 0.27, 0.90);
    vec3 azure  = vec3(0.22, 0.60, 0.97);
    vec3 teal   = vec3(0.02, 0.71, 0.83);
    vec3 amber  = vec3(0.96, 0.62, 0.04);

    vec3 col = mix(indigo, azure, smoothstep(0.2, 0.8, f));
    col = mix(col, teal,  smoothstep(0.55, 1.05, length(r)));
    col = mix(col, amber, smoothstep(0.78, 1.15, q.y) * 0.5); // warm signal, sparing

    // cursor gravity — soft luminous swell that follows with lag
    vec2 m = uMouse; m.x *= aspect;
    float d = distance(p, m);
    float glow = exp(-d*d*2.2) * 0.6;
    col += glow * mix(azure, vec3(1.0), 0.4);

    // intensity / alpha — kept FAINT: this is only a connective base layer;
    // each section paints its own distinct living visual on top.
    float intensity = smoothstep(0.2, 1.0, f) * 0.34 + glow * 0.5;
    intensity *= 0.55 + 0.45 * fbm(p*1.5 + r);          // breaks up flat bands
    float alpha = clamp(intensity, 0.0, 0.5);

    // fine in-shader grain (kills any visible gradient banding)
    float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.05;
    col += g;

    gl_FragColor = vec4(col, alpha);
  }
`;

const VERT = /* glsl */`
  void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export default function AuroraBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 760px)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch {
      return; // WebGL unavailable → CSS pearl-base carries the page
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const uniforms = {
      uTime:   { value: 0 },
      uRes:    { value: new THREE.Vector2(1, 1) },
      uMouse:  { value: new THREE.Vector2(0.5, 0.55) },
      uReduce: { value: reduce ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };
    resize();
    window.addEventListener('resize', resize);

    // cursor target + lagged value (gravity feel)
    const target = new THREE.Vector2(0.5, 0.55);
    const onMove = (e: MouseEvent) => { target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight); };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    let running = true;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      uniforms.uTime.value = clock.getElapsedTime();
      // heavy lag → 4% per frame
      uniforms.uMouse.value.lerp(target, 0.04);
      renderer.render(scene, camera);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) { clock.start(); loop(); } else { cancelAnimationFrame(raf); clock.stop(); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (reduce) {
      // single static frame, never animated
      uniforms.uTime.value = 12.0;
      uniforms.uMouse.value.copy(target);
      renderer.render(scene, camera);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      material.dispose(); mesh.geometry.dispose(); renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -2, pointerEvents: 'none' }}
    />
  );
}
