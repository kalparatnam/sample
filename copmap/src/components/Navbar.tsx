import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';

const links = [
  { to:'/',          label:'Home'     },
  { to:'/product',   label:'Product'  },
  { to:'/features',  label:'Features' },
  { to:'/about',     label:'About'    },
  { to:'/contact',   label:'Contact'  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          height: 'var(--nav-h)',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.4s ease',
          background: scrolled
            ? 'rgba(255, 255, 255, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15,23,42,0.05)' : '1px solid transparent',
        }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
              <Shield size={18} color="#fff" />
            </motion.div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Cop<span style={{ color: '#818cf8' }}>Map</span>
            </span>
          </NavLink>

          {/* Desktop links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                position: 'relative', padding: '8px 16px',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRadius: 'var(--r-full)',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              })}>
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div layoutId="nav-pill"
                        style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-full)', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NavLink to="/contact" className="btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>
              Request Demo
            </NavLink>
            <button onClick={() => setOpen(o => !o)} aria-label="Menu"
              style={{ display: 'none', background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-sm)', padding: 8, color: 'var(--text-primary)' }}
              className="mobile-menu-btn">
              {open ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 999, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border-subtle)', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to}
                style={({ isActive }) => ({ padding: '14px 20px', borderRadius: 'var(--r-md)', fontSize: 16, fontWeight: isActive ? 700 : 400, color: isActive ? 'var(--indigo-bright)' : 'var(--text-secondary)', background: isActive ? 'var(--indigo-glow)' : 'transparent', border: isActive ? '1px solid var(--border-indigo)' : '1px solid transparent', transition: 'all 0.2s' })}>
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
