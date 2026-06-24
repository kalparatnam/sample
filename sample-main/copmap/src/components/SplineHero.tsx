import { Suspense, lazy, Component } from 'react';
import type { ReactNode } from 'react';
import CommandGlobe from './CommandGlobe';

/* ════════════════════════════════════════════════════════════════
   SplineHero — drops an interactive Spline 3D scene into the hero.

   👉 TO USE YOUR OWN SCENE:
      1. Build/pick a police-themed scene at spline.design
         (search community for: globe, shield, drone, network, radar).
      2. Top-right → Export → "Code" / "Viewer" → copy the
         https://prod.spline.design/XXXX/scene.splinecode URL.
      3. Paste it into SCENE below.

   If SCENE is empty, or the scene fails to load (offline / bad URL),
   it gracefully falls back to the in-house WebGL command globe — the
   page never breaks.
   ════════════════════════════════════════════════════════════════ */

const SCENE = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

const Spline = lazy(() => import('@splinetool/react-spline'));

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

const Glow = (
  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
    <div style={{ width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-indigo), transparent 70%)', filter: 'blur(8px)' }} />
  </div>
);

export default function SplineHero() {
  if (!SCENE) return <CommandGlobe />;
  return (
    <Boundary fallback={<CommandGlobe />}>
      <Suspense fallback={Glow}>
        <Spline scene={SCENE} style={{ width: '100%', height: '100%' }} />
      </Suspense>
    </Boundary>
  );
}
