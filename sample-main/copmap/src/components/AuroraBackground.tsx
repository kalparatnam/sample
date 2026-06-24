import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════════════
   AuroraBackground — the site-wide WebGL "living canvas" (v2, graphics
   leap). One <canvas> renders TWO layers every frame:

     1. A volumetric flow field — double domain-warped fbm painted in the
        brand chord with luminous CAUSTIC light-streaks, a scroll-driven
        hue/intensity drift, a soft vignette and in-shader grain.
     2. A depth GPU particle field — ~1.4k soft colored motes drifting on
        their own clock with cursor PARALLAX (near motes move more than
        far ones → real depth on the pearl canvas).

   Raw Three.js so we own the loop:
     · paused when the tab is hidden (battery)
     · prefers-reduced-motion → one static frame, no rAF
     · WebGL failure → silent; the CSS pearl-base still carries the page
   ════════════════════════════════════════════════════════════════════ */

const BG_FRAG = /* glsl */`
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;   // 0..1, lagged
  uniform float uReduce;  // 1.0 = frozen
  uniform float uScroll;  // 0..1 page progress

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
    for(int i=0;i<6;i++){ v += amp*noise(p); p = p*2.03 + vec2(11.3, 7.1); amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float aspect = uRes.x / uRes.y;
    vec2 p = uv; p.x *= aspect;

    float t = uTime * (1.0 - uReduce);

    // double domain warp → organic flowing ribbons
    vec2 q = vec2(fbm(p + vec2(0.0, t*0.05)), fbm(p + vec2(5.2, -t*0.045)));
    vec2 r = vec2(fbm(p + 1.8*q + vec2(t*0.035, 1.3)), fbm(p + 1.8*q + vec2(-1.1, t*0.028)));
    float f = fbm(p + 2.6*r);

    // luminous caustic streaks (interference bands riding the warp)
    float caustic = pow(0.5 + 0.5*sin((r.x + r.y)*9.4 + t*0.4 + f*4.0), 3.0);

    // brand chord, hue drift with scroll
    vec3 indigo = vec3(0.31, 0.27, 0.90);
    vec3 azure  = vec3(0.22, 0.60, 0.97);
    vec3 teal   = vec3(0.02, 0.71, 0.83);
    vec3 amber  = vec3(0.96, 0.62, 0.04);

    float s = uScroll;
    vec3 col = mix(indigo, azure, smoothstep(0.2, 0.85, f + s*0.15));
    col = mix(col, teal,  smoothstep(0.5, 1.05, length(r)));
    col = mix(col, amber, smoothstep(0.8, 1.2, q.y) * (0.40 + s*0.15));
    col = mix(col, vec3(1.0), caustic * 0.32);                 // light streaks

    // cursor gravity — luminous swell, heavy lag
    vec2 m = uMouse; m.x *= aspect;
    float d = distance(p, m);
    float glow = exp(-d*d*2.0) * 0.7;
    col += glow * mix(azure, vec3(1.0), 0.5);

    float intensity = smoothstep(0.15, 1.0, f) * 0.30 + caustic * 0.12 + glow * 0.5;
    intensity *= 0.55 + 0.45 * fbm(p*1.4 + r);                  // break flat bands

    // soft vignette keeps the centre clean for content
    float vig = smoothstep(1.3, 0.25, length(uv - 0.5));
    intensity *= mix(0.82, 1.0, vig);

    float alpha = clamp(intensity, 0.0, 0.52);

    float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.045;        // anti-banding grain
    col += g;

    gl_FragColor = vec4(col, alpha);
  }
`;

const BG_VERT = /* glsl */`
  void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const P_VERT = /* glsl */`
  attribute vec3  aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uReduce;
  uniform vec2  uParallax;
  uniform float uSize;
  varying vec3  vColor;
  varying float vA;
  void main(){
    vColor = aColor;
    float t = uTime * (1.0 - uReduce);
    vec3 pos = position;
    pos.x += sin(t * 0.20 + aSeed * 6.2831) * 0.7;
    pos.y += cos(t * 0.16 + aSeed * 5.1300) * 0.6;
    // depth parallax — nearer motes (bigger seed) react more to cursor
    pos.xy += uParallax * (0.3 + aSeed * 1.1);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 1.8) * (300.0 / -mv.z);
    vA = 0.18 + 0.30 * aSeed;
  }
`;

const P_FRAG = /* glsl */`
  precision mediump float;
  varying vec3  vColor;
  varying float vA;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // soft core + faint halo → reads as a luminous mote on the pearl canvas
    float a = (smoothstep(0.5, 0.0, d) * 0.75 + pow(smoothstep(0.5, 0.18, d), 2.0) * 0.35) * vA;
    gl_FragColor = vec4(vColor, a);
  }
`;

const PALETTE = [
  [0.31, 0.27, 0.90], // indigo
  [0.22, 0.60, 0.97], // azure
  [0.02, 0.71, 0.83], // teal
  [0.50, 0.55, 0.98], // periwinkle
  [0.96, 0.62, 0.04], // amber (sparing)
];

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
    renderer.autoClear = false;

    /* ── layer 1: flow-field background (fullscreen clip quad) ── */
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.Camera();
    const uniforms = {
      uTime:   { value: 0 },
      uRes:    { value: new THREE.Vector2(1, 1) },
      uMouse:  { value: new THREE.Vector2(0.5, 0.55) },
      uReduce: { value: reduce ? 1 : 0 },
      uScroll: { value: 0 },
    };
    const bgMat = new THREE.ShaderMaterial({ vertexShader: BG_VERT, fragmentShader: BG_FRAG, uniforms, transparent: true, depthTest: false, depthWrite: false });
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgScene.add(bgMesh);

    /* ── layer 2: depth particle field ── */
    const COUNT = mobile ? 600 : 1700;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -2 - Math.random() * 7;
      const pick = Math.random();
      const c = PALETTE[pick > 0.93 ? 4 : (Math.random() * 4) | 0]; // amber rare
      colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
      seeds[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const pUniforms = {
      uTime:     { value: 0 },
      uReduce:   { value: reduce ? 1 : 0 },
      uParallax: { value: new THREE.Vector2(0, 0) },
      uSize:     { value: mobile ? 2.6 : 3.3 },
    };
    const pMat = new THREE.ShaderMaterial({
      vertexShader: P_VERT, fragmentShader: P_FRAG, uniforms: pUniforms,
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.NormalBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    const pScene = new THREE.Scene();
    pScene.add(points);
    const pCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    pCamera.position.z = 6;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      const pr = renderer.getPixelRatio();
      uniforms.uRes.value.set(w * pr, h * pr);
      pCamera.aspect = w / h;
      pCamera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // cursor target + lagged values
    const target = new THREE.Vector2(0.5, 0.55);
    const parallaxTarget = new THREE.Vector2(0, 0);
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth, ny = 1 - e.clientY / window.innerHeight;
      target.set(nx, ny);
      parallaxTarget.set((nx - 0.5) * 1.6, (ny - 0.5) * 1.2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      uniforms.uScroll.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0, running = true;

    const renderFrame = () => {
      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.render(pScene, pCamera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      pUniforms.uTime.value = t;
      uniforms.uMouse.value.lerp(target, 0.04);              // heavy gravity lag
      pUniforms.uParallax.value.lerp(parallaxTarget, 0.05);
      renderFrame();
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) { clock.start(); loop(); } else { cancelAnimationFrame(raf); clock.stop(); }
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (reduce) {
      uniforms.uTime.value = 12.0;
      pUniforms.uTime.value = 12.0;
      uniforms.uMouse.value.copy(target);
      renderFrame();
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      bgMat.dispose(); bgMesh.geometry.dispose();
      pMat.dispose(); pGeo.dispose();
      renderer.dispose();
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
