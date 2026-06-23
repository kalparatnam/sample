import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './ui';

const nav = [['Home', '/'], ['Product', '/product'], ['Features', '/features'], ['About Us', '/about'], ['Contact', '/contact']];
const platform = ['Bandobast Management', 'Patrolling Operations', 'Resource Requirement', 'Attendance Management', 'Leave Management', 'Officer Management', 'VahanEye'];

export default function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 2, paddingTop: 80 }}>
      <div className="container">
        {/* CTA console */}
        <div className="console" style={{ padding: 'clamp(36px,5vw,64px)', marginBottom: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28 }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--azure-400)', textTransform: 'uppercase', marginBottom: 14 }}>Ready when you are</p>
            <h2 className="h-section" style={{ fontSize: 'clamp(26px,3.6vw,44px)', maxWidth: 16 + 'ch' }}>See CopMap in a real <span className="grad">deployment scenario.</span></h2>
            <p className="c-dim" style={{ marginTop: 14, fontSize: 14 }}>A 30-minute live walkthrough. No commitment required.</p>
          </div>
          <MagneticButton>
            <NavLink to="/contact" className="btn btn-primary" style={{ position: 'relative', zIndex: 1, fontSize: 15, padding: '15px 32px' }}>Schedule Demo <ArrowUpRight size={16} /></NavLink>
          </MagneticButton>
        </div>

        {/* grid */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1.4fr 1.3fr', gap: 44, paddingBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo-600), var(--azure))', boxShadow: '0 8px 18px -6px var(--glow-indigo)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l7 2.6v6.2c0 4.6-3 8.4-7 10.2-4-1.8-7-5.6-7-10.2V5.1l7-2.6z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="10.4" r="2.1" fill="#fff" /></svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>Cop<span className="grad">Map</span></span>
            </div>
            <p className="body" style={{ fontSize: 13.5, maxWidth: 270, marginBottom: 22 }}>India's purpose-built SaaS platform for law enforcement — from a single station to an entire state.</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 'var(--r-full)', padding: '7px 15px' }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live · Nagpur City Police</span>
            </div>
          </div>

          <FooterCol title="Navigation">
            {nav.map(([label, to]) => (
              <NavLink key={to} to={to} className="foot-link" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{label}</NavLink>
            ))}
          </FooterCol>

          <FooterCol title="Platform">
            {platform.map(f => (
              <NavLink key={f} to="/features" className="foot-link" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{f}</NavLink>
            ))}
          </FooterCol>

          <FooterCol title="Contact">
            {[[<Mail size={14} key="m" />, 'info@copmap.in'], [<Phone size={14} key="p" />, '+91 8855891936'], [<MapPin size={14} key="a" />, 'Bidkin, Chhatrapati Sambhajinagar – 431105, Maharashtra, India']].map(([ic, v], i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--indigo)', marginTop: 2, flexShrink: 0 }}>{ic}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>{v}</span>
              </div>
            ))}
          </FooterCol>
        </div>

        <div className="rule" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '22px 0 40px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>© 2026 CopMap — EyeQlytics Technologies Private Limited. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms & Conditions', 'Security Policy'].map(l => (
              <a key={l} href="#" className="foot-link" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .foot-link{ transition: color .2s, transform .2s; }
        .foot-link:hover{ color: var(--indigo-600) !important; transform: translateX(3px); }
        @media (max-width: 880px){ .footer-grid{ grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 520px){ .footer-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 18 }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>
    </div>
  );
}
