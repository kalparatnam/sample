import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { MagneticButton } from './ui';

const links: { to: string; label: string; sub: { l: string; h: string }[] }[] = [
  { to: '/', label: 'Home', sub: [
    { l: 'Operational Core', h: 'core' }, { l: 'How It Manages', h: 'manage' }, { l: 'Infrastructure', h: 'infra' }, { l: 'Protocol Sequence', h: 'protocol' }, { l: 'FAQ', h: 'faq' },
  ] },
  { to: '/product', label: 'Product', sub: [
    { l: 'Command Dashboard', h: 'dashboard' }, { l: 'Officer App', h: 'app' },
  ] },
  { to: '/features', label: 'Features', sub: [
    { l: 'Feature Explorer', h: 'explorer' }, { l: 'Capability Stack', h: 'stack' },
  ] },
  { to: '/about', label: 'About', sub: [
    { l: 'Mission & Vision', h: 'mission' }, { l: 'Our Story', h: 'story' }, { l: 'Why CopMap', h: 'why' }, { l: 'Recognition', h: 'recognition' }, { l: 'Company', h: 'company' },
  ] },
  { to: '/contact', label: 'Contact', sub: [
    { l: 'Contact Details', h: 'details' }, { l: 'Request a Demo', h: 'demo' },
  ] },
];

function Logo() {
  return (
    <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 11 }} aria-label="CopMap home">
      <motion.div whileHover={{ rotate: 8, scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }}
        style={{ width: 38, height: 38, borderRadius: 11, position: 'relative', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo-600), var(--azure))', boxShadow: '0 8px 20px -6px var(--glow-indigo)' }}>
        {/* shield-pin glyph */}
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.5l7 2.6v6.2c0 4.6-3 8.4-7 10.2-4-1.8-7-5.6-7-10.2V5.1l7-2.6z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="12" cy="10.4" r="2.1" fill="#fff" />
          <path d="M12 12.5v3.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
        Cop<span className="grad">Map</span>
      </span>
    </NavLink>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); setMenu(null); }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: 'var(--nav-h)', display: 'flex', alignItems: 'center', transition: 'background .4s, box-shadow .4s, border-color .4s',
          background: scrolled ? 'rgba(244,247,255,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(22px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />

          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 4, borderRadius: 'var(--r-full)', background: 'var(--glass)', border: '1px solid var(--glass-edge)', backdropFilter: 'blur(14px)' }}>
            {links.map(({ to, label, sub }) => (
              <div key={to} style={{ position: 'relative' }} onMouseEnter={() => setMenu(to)} onMouseLeave={() => setMenu(null)}>
                <NavLink to={to} end={to === '/'}
                  style={({ isActive }) => ({ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? '#fff' : 'var(--ink-2)', borderRadius: 'var(--r-full)', transition: 'color .25s' })}>
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId="nav-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-full)', background: 'linear-gradient(120deg, var(--indigo), var(--azure))', boxShadow: '0 8px 20px -8px var(--glow-indigo)' }} />}
                      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
                      <motion.span animate={{ rotate: menu === to ? 180 : 0 }} style={{ position: 'relative', zIndex: 1, display: 'inline-flex', opacity: 0.7 }}><ChevronDown size={13} /></motion.span>
                    </>
                  )}
                </NavLink>
                <AnimatePresence>
                  {menu === to && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97, x: '-50%' }} animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }} exit={{ opacity: 0, y: 8, scale: 0.97, x: '-50%' }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="glass" style={{ position: 'absolute', top: 'calc(100% + 12px)', left: '50%', minWidth: 224, padding: 8, borderRadius: 18, boxShadow: 'var(--sh-lg)' }}>
                      {/* hover bridge so the gap doesn't drop the menu */}
                      <span style={{ position: 'absolute', top: -14, left: 0, right: 0, height: 14 }} />
                      <span style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: 'var(--glass)', borderLeft: '1px solid var(--glass-edge)', borderTop: '1px solid var(--glass-edge)' }} />
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-4)', padding: '6px 12px 8px' }}>{label} · Sections</p>
                      {sub.map(({ l, h }) => (
                        <NavLink key={h} to={`${to}#${h}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 11, fontSize: 13.5, color: 'var(--ink-2)', transition: 'all .18s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.09)'; (e.currentTarget as HTMLElement).style.color = 'var(--indigo-600)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-2)'; }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', flexShrink: 0 }} />{l}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MagneticButton strength={0.25}>
              <NavLink to="/contact" className="btn btn-primary nav-cta" style={{ fontSize: 13, padding: '11px 22px' }}>
                Request Demo <ArrowUpRight size={15} />
              </NavLink>
            </MagneticButton>
            <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu"
              style={{ display: 'none', width: 42, height: 42, borderRadius: 12, border: '1px solid var(--glass-edge)', background: 'var(--glass-strong)', color: 'var(--ink)', placeItems: 'center' }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div key="m" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.28 }}
            style={{ position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0, zIndex: 999, background: 'rgba(244,247,255,0.94)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--line)', padding: '20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({ padding: '14px 18px', borderRadius: 'var(--r-md)', fontSize: 16, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--indigo-600)' : 'var(--ink-2)', background: isActive ? 'rgba(79,70,229,0.08)' : 'transparent', border: isActive ? '1px solid var(--line-indigo)' : '1px solid transparent' })}>
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 880px){
          .nav-desktop{ display:none !important; }
          .nav-burger{ display:grid !important; }
          .nav-cta{ display:none !important; }
        }
      `}</style>
    </>
  );
}
