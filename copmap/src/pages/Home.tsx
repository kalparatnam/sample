import { useState, lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, MapPin, Radio, Activity, GitBranch, Lock, Wifi, RefreshCw, Plus, ShieldCheck } from 'lucide-react';
import { Reveal, MagneticButton, TiltCard, DecryptText, CountUp, Ticker, Spotlight } from '../components/ui';
import { MarqueeText, CardImage, IMG } from '../components/Media';
import { CommandMap } from '../components/Emblems';
import { LiveOpsField } from '../components/LiveOps';
import { WarpGrid, PatrolRoutes, NodeGraph, BeamColumn, DriftField, Bokeh } from '../components/Visuals';

const SplineHero = lazy(() => import('../components/SplineHero'));

const fleet = [
  { img: IMG.drone, label: 'Aerial Surveillance', sub: 'Patrol Drone', c: 'var(--azure)' },
  { img: IMG.car, label: 'Rapid Patrol', sub: 'Interceptor Unit', c: 'var(--indigo)' },
  { img: IMG.suv, label: 'Tactical Response', sub: 'Armoured SUV', c: 'var(--teal)' },
  { img: IMG.camera, label: 'Smart Monitoring', sub: 'Secure Cameras', c: 'var(--azure)' },
  { img: IMG.watch, label: 'Field Wearable', sub: 'Tactical Ops Watch', c: 'var(--amber)' },
  { img: IMG.badge, label: 'Verified Identity', sub: 'Officer Credentials', c: 'var(--indigo)' },
];

const ticker = ['Live GPS Tracking', 'Bandobast Management', 'Minimal Paperwork', 'Strategic Deployment', 'Patrolling Operations', 'Active in Law Enforcement', 'Attendance Automation', 'Resource Escalation', 'Endorsed by Top Brass', 'Real-Time Command'];
const stats = [{ n: 10000, s: 'K+', d: 'Field Officers', f: 1000 }, { n: 250, s: '+', d: 'Active Nodes' }, { n: 1000, s: '+', d: 'Daily Patrols', f: 1000 }, { n: 99, s: '%', d: 'Live Visibility' }];

const cards = [
  { icon: <MapPin size={20} />, c: 'var(--indigo)', t: 'Bandobast Management', s: 'Multi-zone deployment', b: 'Orchestrate multi-zone security visually. Push encrypted deployments instantly to field devices through unified mapping.', tags: ['250+ Deploy Points', '10K+ Officers', '99% GPS Tracked'], wide: true },
  { icon: <Radio size={20} />, c: 'var(--teal)', t: 'Incident Alerts', s: 'Auto-dispatch', b: 'Nearest-officer dispatch triggered automatically from live GPS position data. Instant, automated coordination.', tags: ['Officer #A12 · Dispatched', 'Zone 3 · Acknowledged'] },
  { icon: <Activity size={20} />, c: 'var(--azure)', t: 'Live Patrols', s: 'Real-time GPS', b: 'Track every officer on live map layers. Geo-fence alerts trigger instantly for off-route or halted units.', tags: ['18 On Route', '4 Halted', '2 Off-Route'] },
  { icon: <GitBranch size={20} />, c: 'var(--amber)', t: 'Command Escalation', s: 'Force workflow', b: 'Strictly defined Station-to-DCP-to-Zone force request flow. Track exact manpower reserves dynamically across zones.', tags: ['Local Station → CP'], wide: true },
];

const manages = [
  ['Bandobast Command', 'Plan deployments, assign points, and issue instructions from one structured control layer.'],
  ['Patrolling Visibility', 'See active patrol movement, route compliance, and live coverage in real time.'],
  ['Officer Management', 'Track force availability, designation, attendance, and readiness from the dashboard.'],
  ['Command Escalation', 'Handle additional force requests through a clear station-to-command workflow.'],
  ['Attendance Control', 'Check attendance, duty status, and officer availability instantly.'],
];

const specs = [['Uptime SLA', '99.9%'], ['Encryption', 'AES-256'], ['Data Residency', 'IN-Region'], ['Field Sync', 'Offline-First'], ['GPS Refresh', '< 30s']];

const steps = [
  ['01', 'Digital Roster Generation', 'Assign strategic map points instantly via bulk action routines with automated conflict detection across all zones.'],
  ['02', 'Automated Conflict Checking', 'Verifies double-duties and leave overlaps systematically before any officer is dispatched to field positions.'],
  ['03', 'Encrypted Rapid Dispatch', '256-bit encrypted push notifications routed directly to officer devices instantly with delivery confirmation.'],
  ['04', 'Live Field Monitoring', 'Real-time tracking activated across the command dashboard layer with continuous geo-fence compliance alerts.'],
];

const faqs = [
  ['Is the operational data secured?', 'Yes. All operational data is heavily encrypted at rest and in transit, hosted securely in compliance with strict law enforcement infosec guidelines.'],
  ['Can field officers tamper with the GPS?', 'No. The CopMap system utilizes tamper-evident tracking technology and instantly logs all disconnects for immediate administrative review.'],
  ['Does this replace manual station diaries?', 'Yes. CopMap integrates duty assignments with automated shift generation, completely digitizing 90% of tedious manual paperwork.'],
  ['What is the deployment timeline?', 'Initial command center setup takes typically 2-3 days, with full field personnel onboarded and trained in under two weeks.'],
];

export default function Home() {
  const [activeManage, setActiveManage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div>
      {/* ═══ HERO — live ops field (hover/click) + command orb (drag) ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><Bokeh count={16} /></div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.55 }}><LiveOpsField /></div>

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '90px 32px' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 48, alignItems: 'center' }}>
            <motion.div className="glass" style={{ padding: 'clamp(28px,4vw,46px)', background: 'var(--glass-strong)' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <span className="badge" style={{ marginBottom: 26 }}>Digitizing Police Operations</span>
              <h1 className="h-display" style={{ marginBottom: 22 }}>
                Plan. Deploy.<br /><span className="grad">Monitor.</span> Audit.<br />Improve.
              </h1>
              <p className="lede" style={{ marginBottom: 34 }}>
                CopMap brings automation, coordination, and control across all police operations — empowering every police station and officer across the nation with real-time intelligence.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 38 }}>
                <MagneticButton><NavLink to="/contact" className="btn btn-primary">Request Demo <ArrowRight size={16} /></NavLink></MagneticButton>
                <MagneticButton strength={0.2}><NavLink to="/product" className="btn btn-ghost"><Play size={14} /> Watch How it Works</NavLink></MagneticButton>
              </div>
              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
                {[['1,284', 'Field Officers'], ['187', 'Active Patrols'], ['12', 'Alerts Today']].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: ['var(--indigo)', 'var(--azure)', 'var(--amber)'][i] }}>{v}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 26, paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.08em', flexWrap: 'wrap' }}>
                <Lock size={13} style={{ color: 'var(--green)' }} /> SECURE CHANNEL · AES-256 ENCRYPTED · IN-REGION DATA · MeitY-BACKED
              </div>
            </motion.div>

            <motion.div className="hero-orb" style={{ height: 540 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}><div style={{ width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-indigo), transparent 70%)' }} /></div>}>
                <SplineHero />
              </Suspense>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="glass" style={{ marginTop: 46, padding: '14px 0', borderRadius: 'var(--r-full)' }}>
            <Ticker items={ticker} />
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS — dark console + count-up + drifting motes (idle) ═══ */}
      <section className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <Reveal>
          <div className="console stats-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: 'clamp(28px,4vw,48px) 0', position: 'relative' }}>
            <DriftField count={14} />
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 18px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', position: 'relative', zIndex: 1 }}>
                <div className="stat-num"><CountUp to={s.f ? s.n / s.f : s.n} suffix={s.s} /></div>
                <div className="stat-label">{s.d}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ CONNECTED FLEET — real device renders on an infinite rail (hover) ═══ */}
      <section className="section-pad" style={{ paddingTop: 60, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Reveal><div className="eyebrow-row" style={{ marginBottom: 36 }}>
            <div>
              <span className="kicker">Connected Field Ecosystem</span>
              <h2 className="h-section" style={{ maxWidth: '15ch' }}>One command layer. <span className="grad">Every asset on the ground.</span></h2>
            </div>
            <p className="body" style={{ maxWidth: 340 }}>Drones, vehicles, wearables, and cameras — every field unit reports into CopMap, live.</p>
          </div></Reveal>
        </div>
        <div className="container">
          <Reveal>
            <div className="fleet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {fleet.map((f, i) => (
                <TiltCard key={i} max={6} className="glass glass-hover" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <CardImage src={f.img} glow={f.c} />
                  <div>
                    <div className="h-card" style={{ fontSize: 16 }}>{f.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{f.sub}</div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ OPERATIONAL CORE — bento cards (hover tilt) + warp grid (hover) ═══ */}
      <section id="core" className="section-pad" style={{ position: 'relative', overflow: 'hidden', scrollMarginTop: 88 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.7 }}><WarpGrid /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div className="eyebrow-row" style={{ marginBottom: 52 }}>
              <div>
                <span className="kicker">Operational Core</span>
                <h2 className="h-section" style={{ maxWidth: '14ch' }}>Tools built for the <span className="grad">Line of Duty.</span></h2>
              </div>
              <p className="body" style={{ maxWidth: 360 }}>Deeply integrated workflows visually map, direct, and measure your force from one command hub.</p>
            </div>
          </Reveal>
          <Spotlight style={{ borderRadius: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 18, perspective: 1400, position: 'relative', zIndex: 1 }}>
            {cards.map((c, i) => (
              <Reveal key={i} delay={i * 0.08} style={{ gridColumn: c.wide ? 'span 4' : 'span 2' }} className="bento-cell">
                <TiltCard max={7} className="glass glass-hover" style={{ padding: 30, height: '100%' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, display: 'grid', placeItems: 'center', color: c.c, background: `color-mix(in srgb, ${c.c} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${c.c} 30%, transparent)`, marginBottom: 20 }}>{c.icon}</div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.c, marginBottom: 8 }}>{c.s}</p>
                  <h3 className="h-card" style={{ marginBottom: 12 }}>{c.t}</h3>
                  <p className="body" style={{ fontSize: 14.5, marginBottom: 20 }}>{c.b}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{c.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          </Spotlight>
        </div>
      </section>

      {/* ═══ KINETIC MARQUEE BAND ═══ */}
      <section style={{ padding: '30px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--glass)' }}>
        <MarqueeText words={['Bandobast', 'Patrolling', 'Dispatch', 'Attendance', 'Escalation', 'Command']} />
      </section>

      {/* ═══ BANDOBAST IN ACTION — image-led showcase, parallax + floating stat chips ═══ */}
      <section className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
            <motion.div className="band-visual glass" style={{ padding: 22, position: 'relative' }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <CommandMap />
              {[['250+', 'Deploy Points', '4%', '4%'], ['99%', 'GPS Tracked', '78%', '72%']].map(([n, l, top, left], i) => (
                <motion.div key={i} className="glass" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.18, type: 'spring', stiffness: 200 }}
                  style={{ position: 'absolute', top, left, padding: '10px 14px', borderRadius: 14 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--indigo)' }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                </motion.div>
              ))}
            </motion.div>
            <Reveal>
              <span className="kicker">Bandobast Command</span>
              <h2 className="h-section" style={{ marginBottom: 18 }}>Orchestrate multi-zone <span className="grad">security, visually.</span></h2>
              <p className="lede" style={{ marginBottom: 24 }}>Push encrypted deployments instantly to field devices through unified mapping. Plan deployment points, assign officers, and deploy with one click.</p>
              <div style={{ display: 'grid', gap: 12 }}>
                {[['Multi-zone deployment', 'Plan and push assignments across every sector from one map.'], ['Encrypted field dispatch', 'AES-256 push to officer devices with delivery confirmation.'], ['Live GPS oversight', 'Auto-alerts the moment a unit goes offline or off-post.']].map(([t, b], i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 7, background: 'linear-gradient(135deg, var(--indigo), var(--azure))', flexShrink: 0 }} />
                    <div><h3 className="h-card" style={{ fontSize: 16, marginBottom: 3 }}>{t}</h3><p className="body" style={{ fontSize: 14 }}>{b}</p></div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ HOW COPMAP MANAGES — split + interactive list + patrol routes (scroll) ═══ */}
      <section id="manage" className="section-pad" style={{ position: 'relative', overflow: 'hidden', scrollMarginTop: 88 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.55 }}><PatrolRoutes /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center' }}>
            <Reveal>
              <span className="kicker">Unified Command</span>
              <h2 className="h-section" style={{ marginBottom: 20 }}>How CopMap manages <span className="grad">policing operations.</span></h2>
              <p className="lede">From daily officer management to patrol visibility and force deployment, CopMap keeps every core operation connected inside one command system.</p>
              <div className="glass" style={{ marginTop: 28, padding: 20, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <ShieldCheck size={18} style={{ color: 'var(--green)' }} />
                <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Bandobast dashboard · Attendance control · Live patrol visibility</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {manages.map(([t, b], i) => (
                  <motion.button key={i} onMouseEnter={() => setActiveManage(i)} onFocus={() => setActiveManage(i)}
                    className="glass" style={{ textAlign: 'left', padding: 22, border: activeManage === i ? '1px solid var(--line-indigo)' : '1px solid var(--glass-edge)', background: activeManage === i ? 'var(--glass-hover)' : 'var(--glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: activeManage === i ? 'var(--indigo)' : 'var(--ink-4)', fontWeight: 600 }}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="h-card" style={{ fontSize: 17 }}>{t}</h3>
                    </div>
                    <AnimatePresence initial={false}>
                      {activeManage === i && (
                        <motion.p initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: 10 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden', fontSize: 14, color: 'var(--ink-2)', paddingLeft: 26 }}>{b}</motion.p>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ COMMAND INFRASTRUCTURE — DARK console + interactive node graph (hover) ═══ */}
      <section id="infra" className="section-pad" style={{ scrollMarginTop: 88 }}>
        <div className="container">
          <div className="console" style={{ padding: 'clamp(32px,5vw,64px)' }}>
            <div className="split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div>
                <span className="kicker" style={{ color: 'var(--azure-400)' }}>Infrastructure</span>
                <h2 className="h-section" style={{ marginBottom: 18 }}>Command-grade <span className="grad">infrastructure.</span></h2>
                <p className="lede" style={{ color: 'var(--paper-2)', marginBottom: 30 }}>Every architectural decision is made with operational continuity and field officer safety in mind. Zero compromise.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {specs.map(([l, v]) => (
                    <div key={l} style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--console-edge)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff' }}><DecryptText text={v} /></div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{l}</div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0 4px' }}>
                    {[<Lock size={14} key="l" />, <Wifi size={14} key="w" />, <RefreshCw size={14} key="r" />].map((ic, i) => <span key={i} className="chip">{ic}</span>)}
                  </div>
                </div>
              </div>
              <div><NodeGraph /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROTOCOL — vertical stepper + scroll-fill beam (scroll) ═══ */}
      <section id="protocol" className="section-pad" style={{ position: 'relative', scrollMarginTop: 88 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="kicker">Protocol Sequence</span>
            <h2 className="h-section">Execute with <span className="grad">Precision.</span></h2>
            <p className="lede" style={{ margin: '16px auto 0' }}>A strictly regimented workflow that ensures every officer receives their roster securely and on time.</p>
          </div></Reveal>
          <div style={{ position: 'relative' }}>
            <BeamColumn />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              {steps.map(([n, t, b], i) => (
                <Reveal key={n} delay={i * 0.05}>
                  <div className="step-row" style={{ display: 'grid', gridTemplateColumns: i % 2 ? '1fr 80px 1fr' : '1fr 80px 1fr', alignItems: 'center', gap: 0 }}>
                    <div className="glass glass-hover" style={{ gridColumn: i % 2 ? 3 : 1, padding: 28 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--azure)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Step {n}</p>
                      <h3 className="h-card" style={{ marginBottom: 10 }}>{t}</h3>
                      <p className="body" style={{ fontSize: 14 }}>{b}</p>
                    </div>
                    <div style={{ gridColumn: 2, display: 'grid', placeItems: 'center' }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, boxShadow: '0 10px 24px -8px var(--glow-indigo)', border: '3px solid var(--bg-base)' }}>{n}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ — glass accordion + drifting motes ═══ */}
      <section id="faq" className="section-pad" style={{ position: 'relative', overflow: 'hidden', scrollMarginTop: 88 }}>
        <DriftField count={12} />
        <div className="container" style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="kicker">FAQ</span>
            <h2 className="h-section">Common questions, <span className="grad">answered.</span></h2>
          </div></Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(([q, a], i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="glass" style={{ overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '22px 26px', textAlign: 'left' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16.5, color: 'var(--ink)' }}>{q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} style={{ color: 'var(--indigo)', flexShrink: 0 }}><Plus size={20} /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                        <p className="body" style={{ padding: '0 26px 24px', fontSize: 15 }}>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA — kinetic ═══ */}
      <section style={{ padding: '40px 0 30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Reveal><div className="container">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px,15vw,210px)', fontWeight: 800, color: 'transparent', WebkitTextStroke: '1px rgba(79,70,229,0.12)', lineHeight: 0.9, userSelect: 'none', letterSpacing: '-0.05em' }}>2026</div>
          <h2 className="h-section" style={{ marginTop: '-0.15em', marginBottom: 18 }}>Ready to modernize your<br /><span className="grad-warm">force operations?</span></h2>
          <p className="lede" style={{ margin: '0 auto 36px' }}>Join active deployments across Maharashtra Police. Get operational in under two weeks.</p>
          <MagneticButton><NavLink to="/contact" className="btn btn-primary" style={{ fontSize: 16, padding: '17px 46px' }}>Get Started <ArrowRight size={17} /></NavLink></MagneticButton>
        </div></Reveal>
      </section>

      <style>{`
        @media (max-width: 980px){ .hero-orb{ height: 340px !important; } .step-row{ grid-template-columns: 60px 1fr !important; } .step-row > .glass{ grid-column: 2 !important; } .step-row > div:nth-child(2){ grid-column: 1 !important; } }
        @media (max-width: 760px){ .bento-cell{ grid-column: span 6 !important; } }
      `}</style>
    </div>
  );
}
