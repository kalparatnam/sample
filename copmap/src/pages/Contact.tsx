import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Send, CheckCircle2, FileText } from 'lucide-react';
import { Reveal, MagneticButton } from '../components/ui';
import { WarpGrid } from '../components/Visuals';

const HoloScene = lazy(() => import('../components/HoloScene'));

const expect = [
  ['Response within 24 hours', <Clock size={16} key="i" />],
  ['Confidential & secure', <ShieldCheck size={16} key="i" />],
  ['Tailored demo for your jurisdiction', <FileText size={16} key="i" />],
  ['No commitment required', <CheckCircle2 size={16} key="i" />],
];
const fields = [
  ['Full Name', 'name', 'text', false], ['Designation / Role', 'role', 'text', false],
  ['Organisation / Unit', 'org', 'text', false], ['State / City', 'city', 'text', false],
  ['Phone Number', 'phone', 'tel', false], ['Official Email ID', 'email', 'email', false],
] as const;

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      {/* HERO — satellite uplink 3D (drag/hover) + warp grid */}
      <section style={{ position: 'relative', minHeight: '78vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }}><WarpGrid accent="6,182,212" /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 48, alignItems: 'center' }}>
            <Reveal>
              <span className="badge" style={{ marginBottom: 24 }}>Get in Touch</span>
              <h1 className="h-display" style={{ marginBottom: 22 }}>Let's <span className="grad">Connect.</span></h1>
              <p className="lede">Whether you are a senior officer exploring CopMap for your jurisdiction, a private security organisation, or a government institution — we are ready to show you CopMap in action.</p>
            </Reveal>
            <motion.div style={{ height: 420 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}><div style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-azure), transparent 70%)' }} /></div>}>
                <HoloScene variant="rings" />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DETAILS + FORM */}
      <section id="details" className="section-pad" style={{ paddingTop: 20, scrollMarginTop: 88 }}>
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 24, alignItems: 'start' }}>
            {/* left — details console */}
            <Reveal>
              <div className="console" style={{ padding: 'clamp(26px,3vw,40px)' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span className="kicker" style={{ color: 'var(--azure-400)' }}>Contact Details</span>
                  <div style={{ display: 'grid', gap: 18, margin: '20px 0 30px' }}>
                    {[[<Mail size={16} key="m" />, 'Email', 'info@copmap.in'], [<Phone size={16} key="p" />, 'Phone', '+91 8855891936'], [<MapPin size={16} key="a" />, 'Address', '10/81, Near SJP Petrol Pump, Bidkin, Chhatrapati Sambhajinagar – 431105, Maharashtra, India']].map(([ic, k, v], i) => (
                      <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                        <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', color: 'var(--azure-400)', background: 'rgba(56,189,248,0.12)', border: '1px solid var(--console-edge)', flexShrink: 0 }}>{ic}</span>
                        <div><div className="c-mut" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>{k as string}</div><div style={{ color: '#fff', fontSize: 13.5, lineHeight: 1.5 }}>{v as string}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="rule" style={{ background: 'rgba(255,255,255,0.1)', marginBottom: 22 }} />
                  <p className="c-mut" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>What to Expect</p>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {expect.map(([t, ic], i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ color: 'var(--green)' }}>{ic}</span><span className="c-dim" style={{ fontSize: 13.5 }}>{t as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* right — form */}
            <Reveal delay={0.1}>
              <div id="demo" className="glass" style={{ padding: 'clamp(26px,3vw,42px)', minHeight: 520, scrollMarginTop: 100 }}>
                <span className="kicker">Request a Live Demo</span>
                <h2 className="h-section" style={{ fontSize: 'clamp(22px,2.6vw,30px)', marginBottom: 8 }}>Tell us about your <span className="grad">jurisdiction.</span></h2>
                <p className="body" style={{ fontSize: 14, marginBottom: 26 }}>Fill out the form below and our deployment specialists will get back to you.</p>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '50px 20px' }}>
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        style={{ display: 'inline-grid', placeItems: 'center', width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--green)', marginBottom: 20 }}><CheckCircle2 size={36} /></motion.span>
                      <h3 className="h-card" style={{ fontSize: 22, marginBottom: 10 }}>Request Received.</h3>
                      <p className="body">A CopMap deployment specialist will reach out within 24 hours.</p>
                      <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setSent(false)}>Submit another</button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                      <div className="form-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                        {fields.map(([label, name, type]) => (
                          <div key={name}>
                            <label className="field-label" htmlFor={name}>{label}</label>
                            <input id={name} name={name} type={type} required placeholder={label} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label className="field-label" htmlFor="msg">Message (Optional)</label>
                        <textarea id="msg" name="msg" rows={4} placeholder="Tell us about your requirement…" />
                      </div>
                      <MagneticButton strength={0.2}><button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Demo Request <Send size={15} /></button></MagneticButton>
                      <p style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', marginTop: 14 }}>By submitting this form, you agree to our Privacy Policy.</p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <style>{`@media (max-width: 980px){ .contact-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
