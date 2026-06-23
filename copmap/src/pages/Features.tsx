import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Route, Users, UserCheck, Calendar, Building2, Target, Truck, ChevronRight, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Floating3DAsset } from '../components/AIPoliceAssets';
import { ScrollRadarGrid, FloatingPatrolNodes } from '../components/TacticalBackgrounds';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const modules = [
  { icon:<MapPin size={22}/>, color:'#22d3ee', id:'bandobast', title:'Bandobast Management', sub:'Systematic Security Deployment for Every Event.',
    headline:'From a small nakabandi to a state-level festival — planned, monitored, and reported automatically.',
    body:'CopMap transforms bandobast planning from a multi-day paper exercise into a digital workflow that takes minutes. Select deployment points on the map, assign officers, and deploy with one click.',
    points:['Select deployment points from the static points database on Google Maps','Assign officers per point based on availability, designation, and duty history','Send notifications via App, WhatsApp, Email, and Call — simultaneously','Live GPS monitoring with auto-alerts if an officer goes offline or leaves post','Auto-generate complete bandobast PDF reports after every operation'],
    outcomes:['No deployment gaps','Real-time visibility','Automatic reports','90% Paperless'] },
  { icon:<Route size={22}/>, color:'#6366f1', id:'patrolling', title:'Patrolling Operations', sub:'Plan It. Monitor It. Prove It.',
    headline:'Every patrol planned digitally, tracked live, and automatically documented — no manual registers.',
    body:'CopMap turns patrolling from an informal verbal assignment into a fully planned, real-time monitored, and automatically documented operation.',
    points:['Plan patrol routes by selecting static points and drawing routes on Google Maps','Assign officers and vehicles directly through the portal','Automated notifications via App, WhatsApp, Email, and Call simultaneously','Live GPS tracking with alerts for offline, route deviation, and unexpected halts'],
    outcomes:['Complete patrol proof','Zero manual registers','Route compliance','Auto-reports'] },
  { icon:<Users size={22}/>, color:'#a855f7', id:'resource', title:'Resource Requirement', sub:'Request. Distribute. Deploy.',
    headline:'Structured force escalation from station to commissioner level.',
    body:'When a station needs additional officers, CopMap allows them to raise a formal force requirement. The system distributes the request, tracks partial fulfilments, and escalates only the remaining shortfall.',
    points:['Raise designation-wise and gender-wise force requirements digitally','Auto-escalates to DCP or CP based on deployment scale','Partial fulfilment tracking; only remaining shortfall escalates upward','Fulfilled officers flow directly into the bandobast or patrolling plan','Real-time fulfilment status visible to all command levels simultaneously'],
    outcomes:['No phone coordination','Full audit trail','Faster fulfilment','Command visibility'] },
  { icon:<UserCheck size={22}/>, color:'#10b981', id:'attendance', title:'Attendance Management', sub:'Smart, Location-Based Attendance.',
    headline:'Attendance verified by actual GPS location before it is marked. No proxy. No manual entry.',
    body:'CopMap automates attendance by verifying an officer\'s real GPS location against their assigned duty before marking them present.',
    points:['Officers clock in via the CopMap mobile app','System validates GPS location against assigned duty coordinates','Auto-marks attendance for patrol, bandobast, and station duty','Generates shift schedules based on leave status and officer availability'],
    outcomes:['Zero proxy attendance','Zero manual entry','Real-time duty status','Automatic shift planning'] },
  { icon:<Calendar size={22}/>, color:'#f59e0b', id:'leave', title:'Leave Management', sub:'Data-Driven Leave Approvals.',
    headline:'Officers apply from their phone. Supervisors approve with full context. Conflicts flagged automatically.',
    body:'CopMap streamlines leave requests while protecting operational readiness. Officers submit leave from the mobile app with full context for supervisors.',
    points:['Officers submit leave requests directly from the mobile app','Portal shows leave balance, history, and duty conflicts before approval','Automatically flags clashes with scheduled patrols or bandobast','Complete leave history maintained for workforce planning'],
    outcomes:['Faster approvals','No duty gaps','Historical data','Fair process'] },
  { icon:<Building2 size={22}/>, color:'#6366f1', id:'officers', title:'Officer & Hierarchy Management', sub:'Complete Organisational Visibility.',
    headline:'Every officer linked. Every level visible. Every deployment tracked.',
    body:'CopMap mirrors India\'s police hierarchy — State → Zone → District → Division → Station — giving every level real-time visibility into officers, duties, and deployments.',
    points:['Officers onboard via simple self-registration on the mobile app','Each officer linked to their station, designation, and reporting hierarchy','Filter officers by duty status: idle, patrolling, bandobast, on leave','District and state authorities have drill-down visibility into any station'],
    outcomes:['Full roster visibility','Smart duty assignment','No unlinked personnel','Command drill-down'] },
  { icon:<Target size={22}/>, color:'#22d3ee', id:'static', title:'Static Points Management', sub:'Geographic Intelligence at the Heart of Every Operation.',
    headline:'Crime hotspots, sensitive areas, checkpoints — all mapped, prioritised, and shared.',
    body:'Static points are the fixed locations that anchor all patrol routes and bandobast deployments. CopMap lets stations map these points digitally with priority levels.',
    points:['Map static points on Google Maps with precise GPS coordinates','Assign priority levels: High, Medium, Low','Cascades visibility up the hierarchy: zone, district, state','Serves as the foundation for all patrol route and bandobast point selection'],
    outcomes:['Shared intelligence','Priority-based planning','Consistent ground data','Informed decisions'] },
  { icon:<Truck size={22}/>, color:'#a855f7', id:'assets', title:'Asset & Resource Management', sub:'Know Where Every Vehicle and Resource Is.',
    headline:'Patrol cars, motorcycles, barricades, equipment — all registered, assigned, and tracked digitally.',
    body:'CopMap digitally registers and tracks all police station assets. Every asset can be assigned directly to an operation, and tracked by officer, duty, and time.',
    points:['Register all station assets with type, condition, and availability status','Assign vehicles and equipment directly to specific operations','Track asset usage by officer, duty, and time','Identify underutilised or shortage assets across stations'],
    outcomes:['Optimised utilisation','Full accountability','No untracked equipment','Current inventory'] },
];

export default function Features() {
  useReveal();
  const [active, setActive] = useState(0);
  const mod = modules[active];
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const mapY  = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const mapOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div style={{ position:'relative', zIndex:1 }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ paddingTop:'calc(var(--nav-h) + 80px)', paddingBottom:0, textAlign:'center', position:'relative', overflow:'hidden' }}>
        
        {/* Subtle grid background instead of giant overlapping globe */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)', backgroundSize:'30px 30px', opacity:0.6, pointerEvents:'none' }} />

        <div className="container reveal" style={{ position:'relative', zIndex:2, marginBottom:56, pointerEvents:'auto' }}>
          <div style={{ marginBottom:24 }}><span className="badge">Platform Features</span></div>
          <h1 className="section-title" style={{ fontSize:'clamp(38px,6vw,78px)', marginBottom:20 }}>
            Every Feature Your<br /><span className="gradient-text">Force Needs.</span>
          </h1>
          <p className="section-body" style={{ margin:'0 auto', textAlign:'center' }}>
            An end-to-end field operations platform. Real-time intelligence from the constable on the ground to the Commissioner in the command room.
          </p>
        </div>

        {/* 4K Interactive 3D Data Network replacing static map */}
        <motion.div style={{ y: mapY, opacity: mapOp }} className="reveal-scale">
          <div style={{ position:'relative', maxWidth:1100, margin:'0 auto', borderRadius:'var(--r-xl) var(--r-xl) 0 0', overflow:'hidden', border:'1px solid var(--border-subtle)', borderBottom:'none', boxShadow:'0 -20px 80px rgba(99,102,241,0.15)', height: 500, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
            
            {/* Grid Pattern */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:0.5 }} />
            
            {/* 3D Container - perfectly masked and contained */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80%', height: '80%' }}>
                <Floating3DAsset src="/bandobast.png" alt="3D Bandobast Security Shield" scale={1.2} />
              </div>
            </div>

            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(255,255,255,0) 30%, var(--bg-body) 100%)', pointerEvents:'none', zIndex: 2 }} />
            
            {/* Floating stat chips over the network */}
            {[{l:'Active Zones',v:'43',x:'15%',y:'35%',c:'#22d3ee'},{l:'Officers Live',v:'1.2K',x:'60%',y:'25%',c:'#6366f1'},{l:'Alerts',v:'12',x:'78%',y:'55%',c:'#f59e0b'}].map((s,i) => (
              <motion.div key={i} animate={{ y:[-4,4,-4] }} transition={{ duration:3+i, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', left:s.x, top:s.y, background:'rgba(255,255,255,0.8)', backdropFilter:'blur(16px)', border:`1px solid ${s.c}40`, borderRadius:'var(--r-sm)', padding:'8px 14px', boxShadow:'0 8px 32px rgba(0,0,0,0.05)' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:s.c }}>{s.v}</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:9, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MODULE EXPLORER ── */}
      <section className="section-pad" style={{ paddingTop:80, position:'relative', overflow:'hidden' }}>
        
        {/* Advanced Code-Driven Tactical Backgrounds */}
        <ScrollRadarGrid />
        <FloatingPatrolNodes />

        <div className="container" style={{ position:'relative', zIndex: 2 }}>
          <p className="section-label reveal" style={{ marginBottom:40 }}>Explore every module in detail.</p>
          <div className="feature-explorer" style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:24, alignItems:'start' }}>

            {/* Sidebar */}
            <div className="reveal" style={{ display:'flex', flexDirection:'column', gap:3, position:'sticky', top:'calc(var(--nav-h) + 20px)' }}>
              {modules.map((m, i) => (
                <motion.button key={i} onClick={() => setActive(i)}
                  whileHover={{ x:4 }}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px',
                    borderRadius:'var(--r-md)', border:'none',
                    background: active===i ? 'var(--bg-card)' : 'transparent',
                    backdropFilter: active===i ? 'blur(20px)' : 'none',
                    borderLeft: active===i ? `3px solid ${m.color}` : '3px solid transparent',
                    color: active===i ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontFamily:'var(--font-body)', fontSize:13, fontWeight: active===i ? 600 : 400,
                    textAlign:'left', cursor:'pointer', transition:'all 0.2s ease', width:'100%' }}>
                  <span style={{ color: active===i ? m.color : 'inherit', flexShrink:0 }}>{m.icon}</span>
                  <span style={{ lineHeight:1.3 }}>{m.title}</span>
                  {active===i && <ChevronRight size={14} style={{ marginLeft:'auto', color:m.color }}/>}
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              <motion.div key={active} className="glass-card"
                initial={{ opacity:0, y:24, scale:0.98 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-16, scale:0.98 }}
                transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                style={{ padding:44 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:18, marginBottom:28 }}>
                  <div style={{ width:56, height:56, borderRadius:16, flexShrink:0,
                    background:`${mod.color}18`, border:`1px solid ${mod.color}35`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:mod.color, boxShadow:`0 0 20px ${mod.color}30` }}>
                    {mod.icon}
                  </div>
                  <div>
                    <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:mod.color, marginBottom:4 }}>{mod.title}</p>
                    <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'var(--text-primary)', lineHeight:1.3 }}>{mod.sub}</h2>
                  </div>
                </div>

                <p style={{ fontSize:16, color:mod.color, fontWeight:500, marginBottom:14, lineHeight:1.6 }}>{mod.headline}</p>
                <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.85, marginBottom:32 }}>{mod.body}</p>

                <p style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:16 }}>Key Capabilities</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12, marginBottom:36 }}>
                  {mod.points.map((pt, j) => (
                    <motion.li key={j} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:j*0.06 }}
                      style={{ display:'flex', gap:12, alignItems:'flex-start', fontSize:14, color:'var(--text-secondary)', lineHeight:1.65 }}>
                      <CheckCircle2 size={15} style={{ color:mod.color, flexShrink:0, marginTop:3 }}/>{pt}
                    </motion.li>
                  ))}
                </ul>

                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {mod.outcomes.map((o, j) => (
                    <span key={j} style={{ padding:'6px 16px', borderRadius:'var(--r-full)',
                      background:`${mod.color}12`, border:`1px solid ${mod.color}30`,
                      fontSize:12, color:mod.color, fontFamily:'var(--font-mono)' }}>{o}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── WHY COPMAP CARDS ── */}
      <section className="section-pad aurora-section" style={{ background:'rgba(99,102,241,0.02)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p className="section-label reveal">Why CopMap</p>
            <h2 className="section-title reveal" style={{ transitionDelay:'0.1s' }}>The complete <span className="gradient-text">capability stack.</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {[
              { t:'Deployed in Days', b:'2–3 days setup. Full force operational in under two weeks.', icon:<Zap size={22}/>, c:'#6366f1' },
              { t:'Maximum Fraud Deterrence', b:'AES-256 encryption. Tamper-evident GPS. Full audit trails on every action.', icon:<CheckCircle2 size={22}/>, c:'#22d3ee' },
              { t:'Works Offline', b:'Officers function in low-connectivity areas. Smart sync keeps data current.', icon:<Target size={22}/>, c:'#a855f7' },
            ].map((d, i) => (
              <motion.div key={i} className="glass-card reveal" style={{ padding:32, transitionDelay:`${i*0.1}s` }}
                whileHover={{ y:-6, boxShadow:`0 24px 64px ${d.c}20` }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${d.c}18`, border:`1px solid ${d.c}30`, display:'flex', alignItems:'center', justifyContent:'center', color:d.c, marginBottom:20 }}>{d.icon}</div>
                <div className="divider"/>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-primary)', marginBottom:12 }}>{d.t}</h3>
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 }}>{d.b}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:56 }}>
            <NavLink to="/contact" className="btn-primary reveal">Schedule Live Demo <ArrowRight size={15}/></NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
