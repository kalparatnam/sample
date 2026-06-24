import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import OverwatchWidget from './components/OverwatchWidget';
import CommandFrame from './components/CommandFrame';
import { ScrollProgress } from './components/motionx';
const AuroraBackground = lazy(() => import('./components/AuroraBackground'));
import Home from './pages/Home';
import Product from './pages/Product';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // poll for the target section (it may mount after the page transition)
      const id = hash.slice(1); let tries = 0;
      const go = () => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
        else if (tries++ < 40) setTimeout(go, 50);
      };
      setTimeout(go, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, hash]);
  return null;
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/product" element={<Page><Product /></Page>} />
        <Route path="/features" element={<Page><Features /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <ScrollTop />
      {/* layered living-canvas: static pearl wash → animated WebGL aurora → grain */}
      <div className="pearl-base" aria-hidden />
      <Suspense fallback={null}><AuroraBackground /></Suspense>
      <div className="grain" aria-hidden />
      <CustomCursor />
      <ScrollProgress />
      <CommandFrame />
      <OverwatchWidget />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar />
        <main><AnimatedRoutes /></main>
        <Footer />
      </div>
    </BrowserRouter>
    </MotionConfig>
  );
}
