import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Eye, Award, BadgeCheck, Building2, Landmark, MapPin, Mail, Phone } from 'lucide-react';
import { Reveal, MagneticButton, TiltCard } from '../components/ui';
import { BeamColumn, DriftField } from '../components/Visuals';

const story = [
  ['2021', 'The Problem Identified', 'After months of field research with Maharashtra Police officers, the CopMap team documented the systemic gaps — paper diaries, phone-call deployments, zero GPS visibility, and hours wasted on manual rosters.'],
  ['2022', 'First Prototype', 'The first functional CopMap prototype was built and tested with real field officers. Core features (bandobast mapping, GPS tracking, and digital attendance) were validated in Zone I.'],
  ['2023', 'MeitY Genesis Grant', 'CopMap received the prestigious MeitY Genesis Grant from the Government of India, recognising its potential to transform policing operations at scale.'],
  ['2024', 'Live Deployment — Nagpur Police', 'CopMap went live with Nagpur City Police, Zone I, bringing real-time patrol tracking, digital bandobast management, and automated attendance to active duty officers.'],
  ['2025', 'Expanding Across Maharashtra', 'CopMap continues to scale across Maharashtra, with ongoing implementations and endorsements from senior IPS officers committed to digitising frontline policing.'],
];
const why = [
  ['Purpose-Built for Indian Policing', 'Not a generic workforce tool adapted for security. Built from day one around India\'s police hierarchy, bandobast workflows, and field conditions.'],
  ['Real-Time, Not Retrospective', 'Every deployment tracked live. Every officer visible in real time. Every alert instant, not after the fact.'],
  ['Complete Operational Visibility', 'From the station to the state — every level of command sees exactly what they need, when they need it.'],
  ['Maximum Fraud Deterrence', 'No paper registers, no phone coordination, no manual reports. Everything digital, automatic, and auditable.'],
];
const recognition = [
  ['MeitY Genesis Grant', 'Ministry of Electronics and Information Technology, Government of India', <Award size={20} key="i" />],
  ['Endorsed by IPS Officers', 'Serving IPS Officers and SPs, Maharashtra Police', <BadgeCheck size={20} key="i" />],
  ['Maharashtra Innovation Cell', 'State Innovation Recognition, Maharashtra', <Landmark size={20} key="i" />],
  ['Active Implementation', 'Nagpur City Police, Zone I, Live Deployment', <Building2 size={20} key="i" />],
];
const miniStats = [['2+', 'Years of R&D'], ['2024', 'Founded'], ['MeitY', 'Grant Recipient'], ['Nagpur', 'Live Deployment']];

export default function About() {
  return (
    <div>
      {/* HERO — text-forward + story year-rail */}
      <section style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <span className="badge" style={{ marginBottom: 24 }}>About CopMap</span>
            <h1 className="h-display" style={{ margin: '0 auto 22px', maxWidth: '18ch' }}>Built from the ground up. <span className="grad">For the ground force.</span></h1>
            <p className="lede" style={{ margin: '0 auto 52px' }}>Not built from a boardroom. Built after years of field research — understanding how Indian policing works, where the friction is, and what a real solution looks like.</p>
          </Reveal>
          {/* milestone year-rail (modern, hints at the story below) */}
          <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: 7, left: '6%', right: '6%', height: 2, background: 'linear-gradient(90deg, var(--indigo), var(--azure), var(--teal))', opacity: 0.4 }} />
            {[['2021', 'Research'], ['2022', 'Prototype'], ['2023', 'MeitY Grant'], ['2024', 'Live · Nagpur'], ['2025', 'Scaling MH']].map(([y, l], i) => (
              <motion.div key={y} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <motion.span animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity }} style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', boxShadow: '0 0 0 5px var(--bg-base)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--ink)' }}>{y}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION + VISION — two contrasting panels */}
      <section id="mission" className="section-pad" style={{ scrollMarginTop: 88 }}>
        <div className="container">
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            <Reveal>
              <div className="glass" style={{ padding: 'clamp(28px,3.4vw,44px)', height: '100%' }}>
                <span style={{ width: 50, height: 50, borderRadius: 14, display: 'grid', placeItems: 'center', color: 'var(--indigo)', background: 'rgba(79,70,229,0.1)', border: '1px solid var(--line-indigo)', marginBottom: 20 }}><Target size={22} /></span>
                <span className="kicker">Mission</span>
                <h2 className="h-section" style={{ fontSize: 'clamp(24px,3vw,38px)', marginBottom: 14 }}>Making Policing Transparent & Accountable.</h2>
                <p className="body" style={{ marginBottom: 22 }}>CopMap exists to give every officer the tools they need on the ground — and every supervisor the full visibility they need in the command room.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{['Every operation planned', 'Every officer visible', 'Every action recorded'].map(c => <span key={c} className="chip">{c}</span>)}</div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="console" style={{ padding: 'clamp(28px,3.4vw,44px)', height: '100%' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ width: 50, height: 50, borderRadius: 14, display: 'grid', placeItems: 'center', color: 'var(--azure-400)', background: 'rgba(56,189,248,0.12)', border: '1px solid var(--console-edge)', marginBottom: 20 }}><Eye size={22} /></span>
                  <span className="kicker" style={{ color: 'var(--azure-400)' }}>Vision</span>
                  <h2 className="h-section" style={{ fontSize: 'clamp(24px,3vw,38px)', marginBottom: 14 }}>The Digital Backbone for Modern Law Enforcement.</h2>
                  <p className="lede" style={{ color: 'var(--paper-2)', fontSize: 16 }}>A future where law enforcement is entirely paperless, deeply connected, and proactively guided by real-time intelligence — creating safer cities and more efficient police forces.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OUR STORY — scroll timeline w/ progress beam */}
      <section id="story" className="section-pad" style={{ position: 'relative', scrollMarginTop: 88 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="kicker">Our Story</span>
            <h2 className="h-section">From field research to <span className="grad">live deployment.</span></h2>
            <p className="lede" style={{ margin: '16px auto 0' }}>CopMap didn't start with a pitch deck. It started with conversations — with officers, inspectors, and command staff who knew exactly what was broken and had no solution.</p>
          </div></Reveal>
          <div style={{ position: 'relative' }}>
            <BeamColumn />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
              {story.map(([y, t, b], i) => (
                <Reveal key={y} delay={i * 0.05}>
                  <div className="tl-row" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center' }}>
                    <div className="glass glass-hover" style={{ gridColumn: i % 2 ? 3 : 1, padding: 26 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'transparent', WebkitTextStroke: '1px var(--line-indigo)' }}>{y}</span>
                      <h3 className="h-card" style={{ fontSize: 17, margin: '6px 0 8px' }}>{t}</h3>
                      <p className="body" style={{ fontSize: 14 }}>{b}</p>
                    </div>
                    <div style={{ gridColumn: 2, display: 'grid', placeItems: 'center' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', boxShadow: '0 0 0 5px var(--bg-base), 0 0 16px var(--glow-indigo)' }} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="glass" style={{ marginTop: 40, padding: 26, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
              {miniStats.map(([n, l]) => (<div key={l} style={{ textAlign: 'center' }}><div className="stat-num" style={{ fontSize: 'clamp(22px,2.6vw,32px)' }}>{n}</div><div className="stat-label">{l}</div></div>))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY COPMAP */}
      <section id="why" className="section-pad" style={{ position: 'relative', overflow: 'hidden', scrollMarginTop: 88 }}>
        <DriftField count={10} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="kicker">Why CopMap</span>
            <h2 className="h-section">Purpose-Built. <span className="grad">Not Adapted.</span></h2>
            <p className="lede" style={{ margin: '16px auto 0' }}>Generic tools fail field operations. CopMap was designed around India's specific policing structure from day one.</p>
          </div></Reveal>
          <div className="col-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {why.map(([t, b], i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="glass glass-hover" style={{ padding: 30, display: 'flex', gap: 18, height: '100%' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'transparent', WebkitTextStroke: '1.5px var(--line-indigo)', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div><h3 className="h-card" style={{ marginBottom: 8 }}>{t}</h3><p className="body" style={{ fontSize: 14.5 }}>{b}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECOGNITION */}
      <section id="recognition" className="section-pad" style={{ scrollMarginTop: 88 }}>
        <div className="container">
          <Reveal><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="kicker">Recognition</span>
            <h2 className="h-section">Recognised by the institutions <span className="grad">that matter.</span></h2>
            <p className="lede" style={{ margin: '16px auto 0' }}>Government grants, senior officer endorsements, and live deployments — not just awards, but real-world validation.</p>
          </div></Reveal>
          <div className="col-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {recognition.map(([t, b, ic], i) => (
              <Reveal key={i} delay={i * 0.08}>
                <TiltCard className="glass glass-hover" style={{ padding: 26, height: '100%', textAlign: 'center' }}>
                  <span style={{ width: 52, height: 52, borderRadius: 14, display: 'inline-grid', placeItems: 'center', color: 'var(--amber)', background: 'var(--glow-amber)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 16 }}>{ic}</span>
                  <h3 className="h-card" style={{ fontSize: 15.5, marginBottom: 8 }}>{t as string}</h3>
                  <p className="body" style={{ fontSize: 13 }}>{b as string}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section id="company" className="section-pad" style={{ scrollMarginTop: 88 }}>
        <div className="container">
          <Reveal>
            <div className="console" style={{ padding: 'clamp(32px,4vw,60px)' }}>
              <div className="split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div>
                  <span className="kicker" style={{ color: 'var(--azure-400)' }}>The Company</span>
                  <h2 className="h-section" style={{ marginBottom: 16 }}>The team behind <span className="grad">the mission.</span></h2>
                  <p className="lede" style={{ color: 'var(--paper-2)', marginBottom: 26 }}>EyeQlytics Technologies is the company behind CopMap — a firm laser-focused on digitising India's law enforcement.</p>
                  <MagneticButton><NavLink to="/contact" className="btn btn-primary">Get in Touch <ArrowRight size={16} /></NavLink></MagneticButton>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {[['Company', 'EyeQlytics Technologies Private Limited'], ['Product', 'CopMap'], ['Website', 'www.copmap.in']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="c-mut" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</span>
                      <span style={{ color: '#fff', fontSize: 13.5, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                  {[[<Mail size={14} key="m" />, 'info@copmap.in'], [<Phone size={14} key="p" />, '+91 8855891936'], [<MapPin size={14} key="a" />, '10/81, Near SJP Petrol Pump, Bidkin, Chhatrapati Sambhajinagar – 431105, Maharashtra, India']].map(([ic, v], i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingTop: 4 }}>
                      <span style={{ color: 'var(--azure-400)', marginTop: 2, flexShrink: 0 }}>{ic}</span>
                      <span className="c-dim" style={{ fontSize: 13, lineHeight: 1.6 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal><div style={{ textAlign: 'center' }}>
            <h2 className="h-section" style={{ marginBottom: 16 }}>Ready to see CopMap <span className="grad-warm">in action?</span></h2>
            <p className="lede" style={{ margin: '0 auto 32px' }}>Book a free 30-minute demo and see every feature running in a real deployment scenario.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticButton><NavLink to="/contact" className="btn btn-primary">Schedule Live Demo <ArrowRight size={16} /></NavLink></MagneticButton>
              <MagneticButton strength={0.2}><NavLink to="/product" className="btn btn-ghost">View Products</NavLink></MagneticButton>
            </div>
          </div></Reveal>
        </div>
      </section>

      <style>{`@media (max-width: 760px){ .tl-row{ grid-template-columns: 50px 1fr !important; } .tl-row > .glass{ grid-column: 2 !important; } .tl-row > div:nth-child(2){ grid-column: 1 !important; } }`}</style>
    </div>
  );
}
