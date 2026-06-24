import { useState, lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, MapPin, Radio, Activity, GitBranch, Lock, Wifi, RefreshCw, Plus, ShieldCheck } from 'lucide-react';
import { Reveal, MagneticButton, TiltCard, DecryptText, CountUp, Ticker, Spotlight } from '../components/ui';
import { CardImage, IMG } from '../components/Media';
import { CommandMap } from '../components/Emblems';
import { LiveOpsField } from '../components/LiveOps';
import { WarpGrid, PatrolRoutes, NodeGraph, DriftField, Bokeh } from '../components/Visuals';
import { FlipCard, SparkBorder, StaggerGroup, popItem, VelocityMarquee, WordReveal, FlowText, GooBlob, Floaty, SwipeDeck, Appear, Parallax, FloatCard, Shimmer, ScrollRoute } from '../components/motionx';
import type { DeckItem } from '../components/motionx';

const HeroGlobe = lazy(() => import('../components/CommandGlobe'));

const fleet = [
  { img: IMG.drone, label: 'Aerial Surveillance', sub: 'Patrol Drone', c: 'var(--azure)', metric: '42 Units', detail: '4K Thermal · 35min flight' },
  { img: IMG.car, label: 'Rapid Patrol', sub: 'Interceptor Unit', c: 'var(--indigo)', metric: '310 Cars', detail: 'Live GPS · Avg 4.2min ETA' },
  { img: IMG.suv, label: 'Tactical Response', sub: 'Armoured SUV', c: 'var(--teal)', metric: '68 Units', detail: 'Rapid action · All-terrain' },
  { img: IMG.camera, label: 'Smart Monitoring', sub: 'Secure Cameras', c: 'var(--azure)', metric: '1.2K Feeds', detail: 'AI alerts · 24/7 uptime' },
  { img: IMG.watch, label: 'Field Wearable', sub: 'Tactical Ops Watch', c: 'var(--amber)', metric: '9.4K Worn', detail: 'SOS · Heart-rate · GPS' },
  { img: IMG.badge, label: 'Verified Identity', sub: 'Officer Credentials', c: 'var(--indigo)', metric: '100% Auth', detail: 'Tamper-evident · Encrypted' },
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

const voices: DeckItem[] = [
  { quote: 'CopMap turned bandobast planning from a two-day paper exercise into minutes. We now see every officer on the ground, live.', name: 'Senior IPS Officer', role: 'Maharashtra Police', accent: 'var(--indigo)' },
  { quote: 'GPS-verified attendance ended proxy duty overnight. The accountability across the station is total.', name: 'Station Incharge', role: 'Nagpur City · Zone I', accent: 'var(--azure)' },
  { quote: 'Force escalation that used to mean a dozen phone calls now happens in one clean, auditable flow.', name: 'Deputy Commissioner', role: 'Zone Command', accent: 'var(--teal)' },
  { quote: 'Every patrol is planned, tracked, and proven. No more informal verbal assignments or paper registers.', name: 'Patrol Inspector', role: 'Field Operations', accent: 'var(--amber)' },
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
                Plan. Deploy.<br /><FlowText>Monitor.</FlowText> Audit.<br />Improve.
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
                <HeroGlobe />
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
          <Shimmer className="console stats-4" radius={30} period={5.5} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: 'clamp(28px,4vw,48px) 0' }}>
            <DriftField count={14} />
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 18px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', position: 'relative', zIndex: 1 }}>
                <div className="stat-num"><CountUp to={s.f ? s.n / s.f : s.n} suffix={s.s} /></div>
                <div className="stat-label">{s.d}</div>
              </div>
            ))}
          </Shimmer>
        </Reveal>
      </section>

      {/* ═══ CONNECTED FLEET — 3D flip cards (hover) reveal live telemetry ═══ */}
      <section className="section-pad" style={{ paddingTop: 60, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <GooBlob size={420} color="var(--glow-azure)" style={{ position: 'absolute', top: -120, right: -80, zIndex: 0 }} />
        <GooBlob size={360} color="var(--glow-amber)" duration={20} style={{ position: 'absolute', bottom: -140, left: -90, zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><div className="eyebrow-row" style={{ marginBottom: 36 }}>
            <div>
              <span className="kicker">Connected Field Ecosystem</span>
              <h2 className="h-section" style={{ maxWidth: '15ch' }}>One command layer. <span className="grad">Every asset on the ground.</span></h2>
            </div>
            <p className="body" style={{ maxWidth: 340 }}>Drones, vehicles, wearables, and cameras — every field unit reports into CopMap, live. <span style={{ color: 'var(--indigo)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hover to read telemetry.</span></p>
          </div></Reveal>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <StaggerGroup className="fleet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {fleet.map((f, i) => (
              <motion.div key={i} variants={popItem}>
                <FloatCard amount={9} duration={4 + (i % 3) * 0.7} delay={i * 0.25}>
                <FlipCard height={104}
                  front={
                    <div className="glass" style={{ height: '100%', padding: 20, display: 'flex', gap: 16, alignItems: 'center', borderRadius: 'var(--r-lg)' }}>
                      <CardImage src={f.img} glow={f.c} />
                      <div>
                        <div className="h-card" style={{ fontSize: 16 }}>{f.label}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{f.sub}</div>
                      </div>
                    </div>
                  }
                  back={
                    <div className="glass" style={{ height: '100%', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 'var(--r-lg)', background: 'var(--glass-hover)', border: `1px solid color-mix(in srgb, ${f.c} 45%, var(--glass-edge))` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: f.c, boxShadow: `0 0 0 3px color-mix(in srgb, ${f.c} 22%, transparent)` }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{f.sub} · Live</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: f.c, lineHeight: 1 }}>{f.metric}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-2)', marginTop: 6 }}>{f.detail}</div>
                    </div>
                  }
                />
                </FloatCard>
              </motion.div>
            ))}
          </StaggerGroup>
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
              <Appear key={i} from={(['left', 'scale', 'right', 'up'] as const)[i % 4]} delay={i * 0.06} style={{ gridColumn: c.wide ? 'span 4' : 'span 2' }} className="bento-cell">
                <SparkBorder radius={22} style={{ height: '100%' }}>
                  <TiltCard max={7} className="glass glass-hover" style={{ padding: 30, height: '100%' }}>
                    <Floaty amount={6} duration={5} delay={i * 0.4} style={{ marginBottom: 20 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 14, display: 'grid', placeItems: 'center', color: c.c, background: `color-mix(in srgb, ${c.c} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${c.c} 30%, transparent)` }}>{c.icon}</div>
                    </Floaty>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.c, marginBottom: 8 }}>{c.s}</p>
                    <h3 className="h-card" style={{ marginBottom: 12 }}>{c.t}</h3>
                    <p className="body" style={{ fontSize: 14.5, marginBottom: 20 }}>{c.b}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>{c.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
                  </TiltCard>
                </SparkBorder>
              </Appear>
            ))}
          </div>
          </Spotlight>
        </div>
      </section>

      {/* ═══ KINETIC MARQUEE BAND — scroll-velocity reactive (speeds + skews) ═══ */}
      <section style={{ padding: '30px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--glass)', overflow: 'hidden' }}>
        <VelocityMarquee baseVelocity={3}>
          {['Bandobast', 'Patrolling', 'Dispatch', 'Attendance', 'Escalation', 'Command'].map((w) => (
            <span key={w} style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px,5vw,68px)', letterSpacing: '-0.02em', color: 'transparent', WebkitTextStroke: '1px rgba(79,70,229,0.30)', paddingRight: 56 }}>
              {w}
              <span style={{ width: 12, height: 12, marginLeft: 56, background: 'linear-gradient(135deg, var(--indigo), var(--azure))', transform: 'rotate(45deg)', borderRadius: 2, WebkitTextStroke: 0 }} />
            </span>
          ))}
        </VelocityMarquee>
      </section>

      {/* ═══ LIVE NETWORK — patrol route draws itself as you scroll ═══ */}
      <section className="section-pad" style={{ paddingTop: 48, paddingBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Appear from="up"><div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span className="kicker">Live Network</span>
            <h2 className="h-section" style={{ fontSize: 'clamp(24px,3vw,42px)' }}>One connected <span className="grad">patrol grid.</span></h2>
          </div></Appear>
          <ScrollRoute />
        </div>
      </section>

      {/* ═══ BANDOBAST IN ACTION — image-led showcase, parallax + floating stat chips ═══ */}
      <section className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>
            <Parallax speed={0.28}>
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
            </Parallax>
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

      {/* ═══ PROTOCOL — horizontal connected stepper: connector draws on scroll, badges spring-pop ═══ */}
      <section id="protocol" className="section-pad" style={{ position: 'relative', scrollMarginTop: 88 }}>
        <div className="container" style={{ maxWidth: 1080 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="kicker">Protocol Sequence</span>
            <h2 className="h-section">Execute with <span className="grad">Precision.</span></h2>
            <p className="lede" style={{ margin: '16px auto 0' }}>A strictly regimented workflow that ensures every officer receives their roster securely and on time.</p>
          </div></Reveal>
          <div className="protocol-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {/* connector line behind the badges — draws left→right on scroll-in */}
            <motion.div aria-hidden className="protocol-line" style={{ position: 'absolute', top: 33, left: '12.5%', right: '12.5%', height: 3, transformOrigin: '0% 50%', background: 'linear-gradient(90deg, var(--indigo), var(--azure), var(--teal))', borderRadius: 2, boxShadow: '0 0 12px var(--glow-indigo)' }}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-15% 0px' }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
            {steps.map(([n, t, b], i) => (
              <Appear key={n} from="up" delay={i * 0.14} className="protocol-cell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0, rotate: -40 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.4 + i * 0.14 }}
                  style={{ width: 66, height: 66, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, boxShadow: '0 14px 30px -10px var(--glow-indigo)', border: '4px solid var(--bg-base)', position: 'relative', zIndex: 1, marginBottom: 22 }}>{n}</motion.div>
                <SparkBorder radius={18} style={{ width: '100%', flex: 1 }}>
                  <div className="glass glass-hover" style={{ padding: 24, height: '100%', borderRadius: 18 }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--azure)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Step {n}</p>
                    <h3 className="h-card" style={{ marginBottom: 10, fontSize: 16.5 }}>{t}</h3>
                    <p className="body" style={{ fontSize: 13.5 }}>{b}</p>
                  </div>
                </SparkBorder>
              </Appear>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VOICES — draggable, throwable testimonial deck ═══ */}
      <section className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
        <GooBlob size={460} color="var(--glow-indigo)" duration={18} style={{ position: 'absolute', bottom: -160, right: -110, zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 56, alignItems: 'center' }}>
            <Reveal>
              <span className="kicker">Voices from the Field</span>
              <h2 className="h-section" style={{ marginBottom: 18 }}>Trusted where it <FlowText>matters most.</FlowText></h2>
              <p className="lede" style={{ marginBottom: 22 }}>From station houses to zone command, CopMap is run by the officers who depend on it every shift.</p>
              <p className="body" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--indigo)' }}>Grab a card and throw it — or tap the dots.</p>
            </Reveal>
            <Reveal delay={0.1} style={{ paddingBottom: 30 }}>
              <SwipeDeck items={voices} height={320} />
            </Reveal>
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
        <GooBlob size={520} color="var(--glow-indigo)" duration={22} style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 0 }} />
        <Reveal><div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px,15vw,210px)', fontWeight: 800, color: 'transparent', WebkitTextStroke: '1px rgba(79,70,229,0.12)', lineHeight: 0.9, userSelect: 'none', letterSpacing: '-0.05em' }}>2026</div>
          <h2 className="h-section" style={{ marginTop: '-0.15em', marginBottom: 18 }}>Ready to modernize your<br /><FlowText>force operations?</FlowText></h2>
          <p className="lede" style={{ margin: '0 auto 36px', maxWidth: '46ch' }}><WordReveal text="Join active deployments across Maharashtra Police. Get operational in under two weeks." /></p>
          <MagneticButton><NavLink to="/contact" className="btn btn-primary" style={{ fontSize: 16, padding: '17px 46px' }}>Get Started <ArrowRight size={17} /></NavLink></MagneticButton>
        </div></Reveal>
      </section>

      <style>{`
        @media (max-width: 980px){ .hero-orb{ height: 340px !important; } }
        @media (max-width: 860px){ .protocol-grid{ grid-template-columns: 1fr 1fr !important; } .protocol-line{ display: none !important; } }
        @media (max-width: 760px){ .bento-cell{ grid-column: span 6 !important; } }
        @media (max-width: 520px){ .protocol-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
