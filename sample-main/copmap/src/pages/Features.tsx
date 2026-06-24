import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinned, Route, Users2, Fingerprint, CalendarClock, Network, Target, Truck, Check, ArrowRight, Zap, ShieldAlert, WifiOff } from 'lucide-react';
import { Reveal, TiltCard } from '../components/ui';
import { WarpGrid } from '../components/Visuals';
import { SparkBorder, StaggerGroup, popItem, FlowText, Floaty, GooBlob, FloatCard, LineReveal, PinnedTrack } from '../components/motionx';

const accentCycle = ['var(--indigo)', 'var(--azure)', 'var(--teal)', 'var(--amber)'];

const modules = [
  { icon: <MapPinned size={18} />, name: 'Bandobast Management', h: 'Systematic Security Deployment for Every Event.', sub: 'From a small nakabandi to a state-level festival — planned, monitored, and reported automatically.',
    body: 'CopMap transforms bandobast planning from a multi-day paper exercise into a digital workflow that takes minutes. Select deployment points on the map, assign officers based on availability, and deploy with one click.',
    points: ['Select deployment points from the static points database on Google Maps', 'Assign officers per point based on availability, designation, and duty history', 'Send deployment notifications via App, WhatsApp, Email, and Call — simultaneously', 'Live GPS monitoring with auto-alerts if an officer goes offline or leaves their post', 'Auto-generate complete bandobast PDF reports after every operation'],
    outcomes: ['No deployment gaps', 'Real-time visibility', 'Automatic reports', '90% Paperless Process'] },
  { icon: <Route size={18} />, name: 'Patrolling Operations', h: 'Plan It. Monitor It. Prove It.', sub: 'Every patrol planned digitally, tracked live, and automatically documented — with no manual registers.',
    body: 'CopMap turns patrolling from an informal verbal assignment into a fully planned, real-time monitored, and automatically documented operation.',
    points: ['Plan patrol routes by selecting static points and drawing routes on Google Maps', 'Assign officers and vehicles directly through the portal', 'Automated notifications via App, WhatsApp, Email, and Call simultaneously', 'Live GPS tracking with alerts for offline, route deviation, and unexpected halts'],
    outcomes: ['Complete patrol proof', 'Zero manual registers', 'Route compliance', 'Auto-reports'] },
  { icon: <Network size={18} />, name: 'Resource Requirement', h: 'Request. Distribute. Deploy.', sub: 'Structured force escalation from station to commissioner level.',
    body: 'When a station needs additional officers for a large deployment, CopMap allows them to raise a formal force requirement. The system distributes the request, tracks partial fulfilments, and escalates only the remaining shortfall.',
    points: ['Raise designation-wise and gender-wise force requirements digitally', 'Auto-escalates to DCP or CP based on deployment scale and available strength', 'Partial fulfilment tracking; only the remaining shortfall escalates upward', 'Fulfilled officers flow directly into the bandobast or patrolling deployment plan', 'Real-time fulfilment status visible to all command levels simultaneously'],
    outcomes: ['No phone coordination', 'Full audit trail', 'Faster fulfilment', 'Command visibility'] },
  { icon: <Fingerprint size={18} />, name: 'Attendance Management', h: 'Smart, Location-Based Attendance. Maximum Fraud Deterrence.', sub: 'Attendance verified by actual GPS location before it is marked. No proxy. No manual entry.',
    body: 'CopMap automates attendance by verifying an officer\'s real GPS location against their assigned duty before marking them present.',
    points: ['Officers clock in via the CopMap mobile app', 'System validates GPS location against assigned duty coordinates before marking present', 'Auto-marks attendance for patrol, bandobast, and station duty', 'Generates shift schedules based on leave status, prior duty, and officer availability'],
    outcomes: ['Zero proxy attendance', 'Zero manual entry', 'Real-time duty status', 'Automatic shift planning'] },
  { icon: <CalendarClock size={18} />, name: 'Leave Management', h: 'Data-Driven Leave Approvals. No Operational Gaps.', sub: 'Officers apply from their phone. Supervisors approve with full context. Conflicts are flagged automatically.',
    body: 'CopMap streamlines leave requests while protecting operational readiness. Officers submit leave requests from the mobile app with full context for supervisors.',
    points: ['Officers submit leave requests directly from the mobile app', 'Portal shows leave balance, history, and duty conflicts before approval', 'Automatically flags clashes with scheduled patrols or bandobast', 'Complete leave history maintained for workforce planning'],
    outcomes: ['Faster approvals', 'No duty gaps', 'Historical data', 'Fair process'] },
  { icon: <Users2 size={18} />, name: 'Officer & Hierarchy Management', h: 'Complete Organisational Visibility. From State to Station.', sub: 'Every officer linked. Every level visible. Every deployment tracked.',
    body: 'CopMap mirrors India\'s police hierarchy — State → Zone → District → Division → Station — and gives every level of authority real-time visibility into officers, duties, and deployments.',
    points: ['Officers onboard via simple self-registration on the mobile app', 'Each officer linked to their station, designation, and reporting hierarchy', 'Filter officers by duty status: idle, patrolling, bandobast, on leave', 'District and state authorities have drill-down visibility into any station at any time'],
    outcomes: ['Full roster visibility', 'Smart duty assignment', 'No unlinked personnel', 'Command drill-down'] },
  { icon: <Target size={18} />, name: 'Static Points Management', h: 'Geographic Intelligence at the Heart of Every Operation.', sub: 'Crime hotspots, sensitive areas, checkpoints — all mapped, prioritised, and shared across the command chain.',
    body: 'Static points are the fixed locations that anchor all patrol routes and bandobast deployments. CopMap lets stations map these points digitally with priority levels.',
    points: ['Map static points on Google Maps with precise GPS coordinates', 'Assign priority levels: High, Medium, Low', 'Cascades visibility up the hierarchy: zone, district, state', 'Serves as the foundation for all patrol route and bandobast point selection'],
    outcomes: ['Shared intelligence', 'Priority-based planning', 'Consistent ground data', 'Informed decisions'] },
  { icon: <Truck size={18} />, name: 'Asset & Resource Management', h: 'Know Where Every Vehicle and Resource Is. At All Times.', sub: 'Patrol cars, motorcycles, barricades, equipment — all registered, assigned, and tracked digitally.',
    body: 'CopMap digitally registers and tracks all police station assets. Every asset can be assigned directly to an operation, and tracked by officer, duty, and time.',
    points: ['Register all station assets with type, condition, and availability status', 'Assign vehicles and equipment directly to specific operations', 'Track asset usage by officer, duty, and time', 'Identify underutilised or shortage assets across stations'],
    outcomes: ['Optimised utilisation', 'Full accountability', 'No untracked equipment', 'Current inventory'] },
];

const diffs = [
  ['Deployed in Days', '2–3 days setup. Command center live in 2-3 days. Full force operational in under two weeks.', <Zap size={20} key="i" />, 'var(--amber)'],
  ['Maximum Fraud Deterrence', 'AES-256 encryption. Tamper-evident GPS. Full audit trails on every action.', <ShieldAlert size={20} key="i" />, 'var(--indigo)'],
  ['Works Offline', 'Officers function in low-connectivity areas. Smart sync keeps data current.', <WifiOff size={20} key="i" />, 'var(--teal)'],
];

export default function Features() {
  const [active, setActive] = useState(0);
  const m = modules[active];

  return (
    <div>
      {/* HERO — smart camera render (cursor-tilt 3D) */}
      <section style={{ position: 'relative', minHeight: '84vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}><WarpGrid accent="6,182,212" /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Reveal>
            <span className="badge" style={{ marginBottom: 24 }}>Platform Features</span>
            <LineReveal as="h1" className="h-display" style={{ margin: '0 auto 22px', maxWidth: '15ch' }} gradientLine={1} lines={['Every Feature Your', <FlowText key="f">Force Needs.</FlowText>]} />
            <p className="lede" style={{ margin: '0 auto 40px' }}>An end-to-end field operations platform. Real-time intelligence from the constable on the ground to the Commissioner in the command room.</p>
          </Reveal>
          {/* modern module pill cloud (no boxed 3D) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 860, margin: '0 auto' }}>
            {modules.map((mod, i) => (
              <motion.button key={i} onClick={() => { setActive(i); document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }); }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -4 }} className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 18px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--ink-2)' }}>
                <span style={{ color: ['var(--indigo)', 'var(--azure)', 'var(--teal)', 'var(--amber)'][i % 4], display: 'inline-flex' }}>{mod.icon}</span>
                {mod.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITY FILMSTRIP — pinned horizontal scroll tour */}
      <section className="section-pad" style={{ paddingBottom: 0 }}>
        <div className="container">
          <Reveal><div style={{ textAlign: 'center' }}>
            <span className="kicker">Platform Tour</span>
            <h2 className="h-section">A tour of the <span className="grad">full platform.</span></h2>
            <p className="lede" style={{ margin: '14px auto 0' }}>Keep scrolling — the modules glide past, left to right.</p>
          </div></Reveal>
        </div>
      </section>
      <PinnedTrack vh={340}>
        {modules.map((m, i) => (
          <article key={i} className="glass" style={{ flex: '0 0 clamp(260px,40vw,520px)', height: 'min(60vh, 460px)', borderTop: `3px solid ${accentCycle[i % 4]}`, padding: 'clamp(22px,3vw,40px)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center', color: accentCycle[i % 4], background: `color-mix(in srgb, ${accentCycle[i % 4]} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${accentCycle[i % 4]} 30%, transparent)` }}>{m.icon}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', letterSpacing: '0.12em' }}>{String(i + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</span>
            </div>
            <h3 className="h-card" style={{ fontSize: 'clamp(20px,2.4vw,28px)', marginBottom: 10 }}>{m.name}</h3>
            <p className="lede" style={{ fontSize: 15, marginBottom: 14 }}>{m.sub}</p>
            <p className="body" style={{ fontSize: 14, marginBottom: 'auto' }}>{m.body}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 18 }}>{m.outcomes.slice(0, 3).map((o) => <span key={o} className="chip">{o}</span>)}</div>
          </article>
        ))}
      </PinnedTrack>

      {/* FEATURE EXPLORER — interactive, click to switch module */}
      <section id="explorer" className="section-pad" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}><WarpGrid /></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="kicker">Feature Explorer</span>
            <h2 className="h-section">Explore every module <span className="grad">in detail.</span></h2>
          </div></Reveal>

          <div className="explorer" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 24, alignItems: 'start' }}>
            {/* selectable list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'sticky', top: 100 }}>
              {modules.map((mod, i) => (
                <button key={i} onClick={() => setActive(i)} className="glass"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', textAlign: 'left', border: active === i ? '1px solid var(--line-indigo)' : '1px solid var(--glass-edge)', background: active === i ? 'var(--glass-hover)' : 'var(--glass)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', flexShrink: 0, color: active === i ? '#fff' : 'var(--indigo)', background: active === i ? 'linear-gradient(135deg, var(--indigo), var(--azure))' : 'rgba(79,70,229,0.1)', transition: 'all .3s' }}>{mod.icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: active === i ? 700 : 500, fontSize: 14.5, color: active === i ? 'var(--ink)' : 'var(--ink-2)' }}>{mod.name}</span>
                  {active === i && <motion.span layoutId="exp-arrow" style={{ marginLeft: 'auto', color: 'var(--indigo)' }}><ArrowRight size={16} /></motion.span>}
                </button>
              ))}
            </div>

            {/* detail panel */}
            <div className="glass" style={{ padding: 'clamp(26px,3.4vw,42px)', minHeight: 460 }}>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <div style={{ height: 150, marginBottom: 22, borderRadius: 16, background: 'radial-gradient(circle at 50% 55%, rgba(56,189,248,0.14), rgba(79,70,229,0.05) 55%, transparent 72%)', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', border: '1px dashed var(--line-indigo)' }} />
                    <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: 92, height: 92, borderRadius: 26, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, var(--indigo), var(--azure))', color: '#fff', boxShadow: '0 18px 40px -12px var(--glow-indigo)' }}>
                      {/* enlarge the module's own glyph */}
                      <span style={{ transform: 'scale(2.1)', display: 'grid', placeItems: 'center' }}>{m.icon}</span>
                    </motion.span>
                  </div>
                  <span className="chip" style={{ marginBottom: 16 }}>{m.icon} Module {String(active + 1).padStart(2, '0')}</span>
                  <h3 className="h-section" style={{ fontSize: 'clamp(22px,2.6vw,32px)', marginBottom: 12 }}>{m.h}</h3>
                  <p className="lede" style={{ fontSize: 16, marginBottom: 16 }}>{m.sub}</p>
                  <p className="body" style={{ marginBottom: 24 }}>{m.body}</p>
                  <div style={{ display: 'grid', gap: 10, marginBottom: 26 }}>
                    {m.points.map((p, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--green)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 }}><Check size={12} /></span>
                        <span style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{p}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="rule" style={{ marginBottom: 18 }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>Outcomes</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {m.outcomes.map(o => <span key={o} className="chip" style={{ borderColor: 'var(--line-indigo)', color: 'var(--indigo-600)' }}>{o}</span>)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ALL MODULES — differentiators */}
      <section id="stack" className="section-pad" style={{ scrollMarginTop: 88, position: 'relative', overflow: 'hidden' }}>
        <GooBlob size={440} color="var(--glow-azure)" duration={19} style={{ position: 'absolute', top: -120, left: -100, zIndex: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="kicker">The Complete Stack</span>
            <h2 className="h-section">The complete <span className="grad">capability stack.</span></h2>
          </div></Reveal>
          <StaggerGroup className="col-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            {diffs.map(([t, b, ic, c], i) => (
              <motion.div key={i} variants={popItem} style={{ height: '100%' }}>
                <FloatCard amount={9} duration={4.2 + (i % 3) * 0.7} delay={i * 0.3} style={{ height: '100%' }}>
                <SparkBorder radius={22} style={{ height: '100%' }}>
                  <TiltCard className="glass glass-hover" style={{ padding: 32, height: '100%' }}>
                    <Floaty amount={7} duration={5} delay={i * 0.5} style={{ marginBottom: 20 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 15, display: 'grid', placeItems: 'center', color: c as string, background: `color-mix(in srgb, ${c} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 28%, transparent)` }}>{ic}</div>
                    </Floaty>
                    <h3 className="h-card" style={{ marginBottom: 10 }}>{t as string}</h3>
                    <p className="body" style={{ fontSize: 14.5 }}>{b as string}</p>
                  </TiltCard>
                </SparkBorder>
                </FloatCard>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <style>{`@media (max-width: 980px){ .explorer{ grid-template-columns: 1fr !important; } .explorer > div:first-child{ position: static !important; } }`}</style>
    </div>
  );
}
