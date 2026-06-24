import { lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Map, BarChart3, Lock, Send, MapPin, Bell, WifiOff, ShieldCheck, History, Navigation, Smartphone, MonitorSmartphone } from 'lucide-react';
import { Reveal, MagneticButton, TiltCard } from '../components/ui';
import { WarpGrid, DriftField } from '../components/Visuals';
import { SparkBorder, StaggerGroup, popItem, FlowText, Floaty, Appear, Shimmer, ScanLine, LineReveal, FocusPull, ClipReveal, Odometer } from '../components/motionx';

const PatrolGrid = lazy(() => import('../components/PatrolGrid'));
const Glow = <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}><div style={{ width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-azure), transparent 70%)' }} /></div>;

const dash = [
  ['Live Operations Map', 'See every officer, vehicle, and incident in real time — no refresh needed.', <Map size={18} key="i" />],
  ['Instant Analytics', 'Auto-generated PDF reports after every bandobast. Full audit trail.', <BarChart3 size={18} key="i" />],
  ['Role-Based Access', 'Custom views from Station Incharge to State DGP; each level sees only what they need.', <Lock size={18} key="i" />],
  ['Force Dispatch Engine', 'Allocate, track, and recall force with one click. Encrypted push to field devices.', <Send size={18} key="i" />],
];
const appFeatures = [
  ['GPS Attendance', 'Verifies officer location before marking present.', <MapPin size={16} key="i" />],
  ['Instant Duty Push', 'Roster arrives via encrypted notification.', <Bell size={16} key="i" />],
  ['Offline Mode', 'Full functionality without 4G connectivity.', <WifiOff size={16} key="i" />],
  ['Secure Access', 'AES-256 encrypted data.', <ShieldCheck size={16} key="i" />],
  ['Duty Log', 'Full history of assignments and reports.', <History size={16} key="i" />],
  ['Live Status', 'Officers see their patrol route and geo-fence alerts.', <Navigation size={16} key="i" />],
];

function CommandTable() {
  const bars = [0.5, 0.72, 0.46, 0.88, 0.64, 0.95, 0.7];
  return (
    <Shimmer className="console" radius={24} period={5} style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, position: 'relative', zIndex: 1 }}>
        {['var(--rose)', 'var(--amber)', 'var(--green)'].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-3)', letterSpacing: '0.12em' }}>COMMAND · ANALYTICS</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)' }}>▲ 12% WoW</span>
      </div>
      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
        {[['Deployments', '248', 'var(--azure)'], ['Compliance', '96%', 'var(--green)'], ['Avg Response', '4m 12s', 'var(--amber)']].map(([l, v, c]) => (
          <div key={l} style={{ padding: '12px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--console-edge)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: c as string }}>{v}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--paper-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* bar chart */}
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 14, border: '1px solid var(--console-edge)', background: 'rgba(8,12,38,0.5)', padding: '16px 16px 12px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--paper-3)', letterSpacing: '0.1em' }}>BANDOBAST / WEEK</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--paper-3)' }}>ZONE I</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 88 }}>
          {bars.map((b, i) => (
            <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${b * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: 1, borderRadius: '5px 5px 2px 2px', background: i === 5 ? 'linear-gradient(180deg, var(--amber), rgba(245,158,11,0.3))' : 'linear-gradient(180deg, var(--azure), rgba(56,189,248,0.2))' }} />
          ))}
        </div>
      </div>
      {/* live dispatch feed */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[['Officer #A12 dispatched', 'Zone 3', 'var(--amber)'], ['Patrol PTL-08 on route', 'Sector 4', 'var(--green)']].map(([t, z, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--console-edge)' }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, delay: i * 0.4, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: c as string, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--paper-2)' }}>{t}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--paper-3)' }}>{z}</span>
          </div>
        ))}
      </div>
    </Shimmer>
  );
}

function PhoneMock() {
  return (
    <div style={{ position: 'relative', width: 262, margin: '0 auto' }}>
      {/* ambient glow */}
      <div aria-hidden style={{ position: 'absolute', inset: '-8% -14%', borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-indigo), transparent 65%)', filter: 'blur(40px)', opacity: 0.7 }} />
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', borderRadius: 52, padding: 7, background: 'linear-gradient(150deg, #3a4570, #0b1024 40%, #1b2348)', boxShadow: '0 50px 90px -30px rgba(8,12,38,0.65), inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>
        {/* side buttons */}
        <span style={{ position: 'absolute', left: -3, top: 120, width: 3, height: 54, borderRadius: 3, background: 'linear-gradient(#2a3360,#161d3c)' }} />
        <span style={{ position: 'absolute', right: -3, top: 96, width: 3, height: 34, borderRadius: 3, background: 'linear-gradient(#2a3360,#161d3c)' }} />
        <div className="console" style={{ position: 'relative', borderRadius: 46, padding: '14px 16px 20px', minHeight: 440, overflow: 'hidden' }}>
          {/* dynamic island */}
          <div style={{ width: 86, height: 26, borderRadius: 16, background: '#05070f', margin: '4px auto 16px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10, gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(56,189,248,0.5)' }} />
          </div>
          {/* status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2, marginBottom: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-2)' }}>
            <span>9:02</span><span>5G · ▮▮▮▮ · 86%</span>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--paper-3)', letterSpacing: '0.1em' }}>OFFICER · PSI R. DESHMUKH</p>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff', margin: '4px 0 16px' }}>Today's Duty</h4>
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: [0, 1, 1], y: [-14, 0, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              style={{ padding: 12, borderRadius: 14, background: 'rgba(79,70,229,0.2)', border: '1px solid var(--line-indigo)', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bell size={13} color="var(--azure-400)" /><span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>New Deployment</span></div>
              <p style={{ fontSize: 10.5, color: 'var(--paper-2)', marginTop: 4 }}>Bandobast · Sitabuldi · 18:00–23:00</p>
            </motion.div>
            {[['GPS Attendance', 'Verified · 09:02'], ['Patrol Route', 'Active · 4.2 km'], ['Geo-fence', 'Inside zone'], ['Duty Status', 'On Duty']].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--paper-2)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)' }}>{v}</span>
              </div>
            ))}
            {/* home indicator */}
            <div style={{ width: 90, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.3)', margin: '20px auto 0' }} />
          </div>
          {/* glossy screen reflection */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 32%)' }} />
        </div>
      </motion.div>
    </div>
  );
}

/* Command-center assembly — staggered whileInView so every element
   appears as you scroll past, no blank 300vh pinned scroll needed. */
function CommandAssembly() {
  const pins = [['18%', '26%'], ['64%', '18%'], ['40%', '52%'], ['78%', '60%'], ['26%', '70%']];
  return (
    <section className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <Reveal><div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="kicker">Live Build</span>
          <h2 className="h-section" style={{ fontSize: 'clamp(24px,3.4vw,46px)' }}>Watch the command center <span className="grad">assemble itself.</span></h2>
          <p className="body" style={{ marginTop: 12, maxWidth: '44ch', margin: '12px auto 0' }}>Every layer — map, pins, console — appears as your team deploys it.</p>
        </div></Reveal>

        <div style={{ position: 'relative', maxWidth: 1040, margin: '0 auto', height: 'clamp(380px, 58vh, 540px)' }}>
          {/* Step 1 — map grid */}
          <motion.div className="glass" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24 }}
            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}><WarpGrid accent="56,189,248" /></div>

            {/* Step 2 — deployment pins drop in */}
            {pins.map(([left, top], i) => (
              <motion.span key={i} style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', color: i === 2 ? 'var(--amber)' : 'var(--indigo)', display: 'block' }}
                initial={{ opacity: 0, y: -22, scale: 0.5 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-10%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 + i * 0.15 }}>
                <motion.span style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid currentColor' }}
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }} transition={{ duration: 2.2, delay: 0.9 + i * 0.15, repeat: Infinity, ease: 'easeOut' }} />
                <MapPin size={22} fill="currentColor" strokeWidth={1.5} />
              </motion.span>
            ))}
          </motion.div>

          {/* Step 3 — console slides up */}
          <motion.div style={{ position: 'absolute', right: 'clamp(8px,4%,40px)', bottom: '6%', width: 'min(360px,86%)' }}
            initial={{ opacity: 0, y: 56 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.65, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="console" style={{ padding: 16, borderRadius: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative', zIndex: 1 }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', display: 'block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--paper-3)', letterSpacing: '0.12em' }}>COMMAND ONLINE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, position: 'relative', zIndex: 1 }}>
                {[['248', 'Deploys', 'var(--azure)'], ['96%', 'Compliance', 'var(--green)'], ['4m', 'Response', 'var(--amber)']].map(([v, l, c], i) => (
                  <motion.div key={l} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--console-edge)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: c }}>{v}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--paper-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Product() {
  return (
    <div>
      {/* HERO — glass drone (drag/hover) + warp grid (hover) */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }}><WarpGrid accent="56,189,248" /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 0.95fr', gap: 48, alignItems: 'center' }}>
            <Reveal>
              <span className="badge" style={{ marginBottom: 24 }}>Ecosystem Architecture</span>
              <LineReveal as="h1" className="h-display" style={{ marginBottom: 22 }} gradientLine={1} lines={['Two Products.', <FlowText key="f">One Reality.</FlowText>]} />
              <p className="lede" style={{ marginBottom: 34 }}>A web-based Command Dashboard for supervisors, and an intuitive Mobile App for officers. Perfectly synced in real-time.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <MagneticButton><a href="#dashboard" className="btn btn-primary"><MonitorSmartphone size={16} /> Explore Dashboard</a></MagneticButton>
                <MagneticButton strength={0.2}><a href="#app" className="btn btn-ghost"><Smartphone size={15} /> Explore App</a></MagneticButton>
              </div>
            </Reveal>
            <motion.div style={{ height: 460 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}><Suspense fallback={Glow}><PatrolGrid /></Suspense></motion.div>
          </div>
        </div>
      </section>

      {/* COMMAND-BUILD ASSEMBLY — whileInView stagger, no blank scroll trap */}
      <CommandAssembly />

      {/* DASHBOARD — split with live dashboard mock */}
      <section id="dashboard" className="section-pad">
        <div className="container">
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'center' }}>
            <Reveal>
              <span className="kicker">Command Dashboard</span>
              <h2 className="h-section" style={{ marginBottom: 18 }}>The <span className="grad">Command Dashboard.</span></h2>
              <p className="lede" style={{ marginBottom: 18 }}>A high-performance web portal built for full-force visibility. Every widget, every metric alive.</p>
              <p className="body" style={{ marginBottom: 26 }}>For Station Incharges, DCPs, CPs, and State Authorities.</p>
              <div style={{ display: 'grid', gap: 12 }}>
                {dash.map(([t, b, ic], i) => (
                  <Appear key={i} from="left" delay={i * 0.08}>
                    <div className="glass glass-hover" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <Floaty amount={5} duration={4} delay={i * 0.4}><span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', color: 'var(--indigo)', background: 'rgba(79,70,229,0.1)', border: '1px solid var(--line-indigo)', flexShrink: 0 }}>{ic}</span></Floaty>
                      <div><h3 className="h-card" style={{ fontSize: 16, marginBottom: 4 }}>{t}</h3><p className="body" style={{ fontSize: 13.5 }}>{b}</p></div>
                    </div>
                  </Appear>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
                {['Live Map Tracking', 'Instant Dispatching', 'Force Requirement Engine', 'Automated Reporting'].map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </Reveal>
            <FocusPull radius={24}><CommandTable /></FocusPull>
          </div>
        </div>
      </section>

      {/* OFFICER APP — reversed split with phone mock + drift (idle) */}
      <section id="app" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
        <DriftField count={12} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="split" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center' }}>
            <ClipReveal direction="up" radius={46} frostBorder={false}><PhoneMock /></ClipReveal>
            <Reveal delay={0.1}>
              <span className="kicker">Officer App</span>
              <h2 className="h-section" style={{ marginBottom: 18 }}>Built for <span className="grad">the field.</span></h2>
              <p className="lede" style={{ marginBottom: 18 }}>An incredibly simple, secure app built for field constables. No typing required — assignments arrive via push, attendance verified via GPS.</p>
              <p className="body" style={{ marginBottom: 26 }}>For Every Constable, PSI, and Inspector in the Field.</p>
              <StaggerGroup className="col-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {appFeatures.map(([t, b, ic], i) => (
                  <motion.div key={i} variants={popItem} style={{ height: '100%' }}>
                    <SparkBorder radius={22} style={{ height: '100%' }}>
                      <TiltCard max={6} className="glass glass-hover" style={{ padding: 18, height: '100%' }}>
                        <Floaty amount={5} duration={4.5} delay={i * 0.35} style={{ marginBottom: 10 }}>
                          <span style={{ color: 'var(--teal)', display: 'inline-flex' }}>{ic}</span>
                        </Floaty>
                        <h3 className="h-card" style={{ fontSize: 15, marginBottom: 4 }}>{t}</h3>
                        <p className="body" style={{ fontSize: 13 }}>{b}</p>
                      </TiltCard>
                    </SparkBorder>
                  </motion.div>
                ))}
              </StaggerGroup>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA — dark console */}
      <section className="section-pad">
        <div className="container">
          <Reveal>
            <ScanLine className="console" radius={30} style={{ padding: 'clamp(36px,5vw,68px)', textAlign: 'center' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="h-section" style={{ marginBottom: 16 }}>Experience the <span className="grad">platform.</span></h2>
                <p className="lede" style={{ color: 'var(--paper-2)', margin: '0 auto 30px' }}>Stop tracking operations on paper. Digitize your entire force today with a live 30-minute demo.</p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
                  <MagneticButton><NavLink to="/contact" className="btn btn-primary">Schedule Live Demo <ArrowRight size={16} /></NavLink></MagneticButton>
                  <MagneticButton strength={0.2}><NavLink to="/features" className="btn on-dark">Explore Features</NavLink></MagneticButton>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(28px,6vw,72px)', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}><div className="stat-num" style={{ fontSize: 'clamp(28px,4vw,46px)' }}>2–3 Days</div><div className="stat-label">to Deploy</div></div>
                  <div style={{ textAlign: 'center' }}><Odometer to={10000} format={(n) => Math.round(n / 1000) + 'K+'} style={{ fontSize: 'clamp(28px,4vw,46px)' }} /><div className="stat-label">Officers Managed</div></div>
                  <div style={{ textAlign: 'center' }}>
                    <Odometer to={99} suffix="%" style={{ fontSize: 'clamp(28px,4vw,46px)' }} />
                    <motion.div aria-hidden style={{ height: 2, width: '64%', margin: '6px auto 0', transformOrigin: '50% 50%', background: 'var(--amber)', borderRadius: 2 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} />
                    <div className="stat-label">GPS Visibility</div>
                  </div>
                </div>
              </div>
            </ScanLine>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
