import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, MapPin, Radio, Activity, Zap, ChevronRight, Lock, Wifi, RefreshCw } from 'lucide-react';
import { MagneticButton, TiltCard, InteractiveRadar, DecryptText } from '../components/InteractiveElements';
import { LiquidWaveBackground } from '../components/Modern3D';

gsap.registerPlugin(ScrollTrigger);

const ticker = ['Live GPS Tracking','Bandobast Management','Minimal Paperwork','Strategic Deployment','Patrolling Operations','Attendance Automation','Resource Escalation','Real-Time Command'];
const stats = [{ n:'10K+',l:'Field Officers' },{ n:'250+',l:'Active Nodes' },{ n:'1K+',l:'Daily Patrols' },{ n:'99%',l:'Uptime SLA' }];

const cards = [
  { icon:<MapPin size={22}/>, color:'var(--indigo)', title:'Bandobast Management', sub:'Multi-zone deployment', body:'Orchestrate multi-zone security on a live map. Push encrypted deployments instantly to field devices.', tags:['250+ Deploy Points','10K+ Officers','99% GPS'] },
  { icon:<Radio size={22}/>, color:'var(--cyan)', title:'Incident Alerts', sub:'Auto-dispatch', body:'Nearest-officer dispatch triggered automatically from live GPS. Zero manual call coordination.', tags:['Auto Dispatch','Zone Alerts'] },
  { icon:<Activity size={22}/>, color:'var(--violet)', title:'Live Patrols', sub:'Real-time GPS', body:'Track every officer on live map layers. Geo-fence alerts trigger instantly for off-route units.', tags:['18 On Route','4 Halted','2 Off-Route'] },
  { icon:<Zap size={22}/>, color:'var(--green)', title:'Command Escalation', sub:'Force workflow', body:'Station-to-DCP-to-Zone force request flow. Track exact manpower reserves dynamically.', tags:['Station → CP','Escalation'] },
];

const steps = [
  { n:'01', t:'Digital Roster Generation', b:'Assign strategic map points via bulk routines with automated conflict detection.' },
  { n:'02', t:'Automated Conflict Checking', b:'Verifies double-duties and leave overlaps before any officer is dispatched.' },
  { n:'03', t:'Encrypted Rapid Dispatch', b:'AES-256 encrypted push to officer devices with delivery confirmation.' },
  { n:'04', t:'Live Field Monitoring', b:'Real-time tracking with continuous geo-fence compliance alerts.' },
];

const faqs = [
  { q:'Is operational data secured?', a:'Yes. All data is AES-256 encrypted at rest and in transit, hosted in compliance with strict law enforcement infosec guidelines.' },
  { q:'Can officers tamper with GPS?', a:'No. CopMap uses tamper-evident tracking and instantly logs all disconnects for administrative review.' },
  { q:'Does this replace manual diaries?', a:'Yes. CopMap integrates duty assignments with automated shift generation, digitizing 90% of manual paperwork.' },
  { q:'What is the deployment timeline?', a:'Command center setup takes 2-3 days. Full field onboarding completed in under two weeks.' },
];

export default function Home() {
  const heroRef     = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);
  const faqOpenRef  = useRef<Set<number>>(new Set());
  const faqBodyRefs = useRef<(HTMLDivElement|null)[]>([]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset:['start start','end start'] });
  const heroY  = useTransform(scrollYProgress, [0,1], ['0%','15%']);
  const heroOp = useTransform(scrollYProgress, [0,0.7], [1, 0]);
  const springY  = useSpring(heroY,  { stiffness:60, damping:20 });
  const springOp = useSpring(heroOp, { stiffness:80, damping:25 });

  const [activeCard, setActiveCard] = useState<number|null>(null);

  useEffect(() => {
    // GSAP card entrance
    const cardEls = cardsRef.current?.querySelectorAll('.feature-card');
    if (cardEls) {
      gsap.fromTo(Array.from(cardEls),
        { opacity:0, y:60, rotateX:10 },
        { opacity:1, y:0, rotateX:0, stagger:0.12, duration:0.9, ease:'power3.out',
          scrollTrigger: { trigger:cardsRef.current, start:'top 80%' } }
      );
    }
    // GSAP steps
    if (stepsRef.current) {
      gsap.fromTo(stepsRef.current.querySelectorAll('.step-item'),
        { opacity:0, x:-50 },
        { opacity:1, x:0, stagger:0.18, duration:0.8, ease:'power2.out',
          scrollTrigger: { trigger:stepsRef.current, start:'top 78%' } }
      );
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const toggleFaq = (i:number) => {
    const body = faqBodyRefs.current[i];
    if (!body) return;
    const open = faqOpenRef.current.has(i);
    if (open) { faqOpenRef.current.delete(i); body.style.maxHeight='0px'; body.style.opacity='0'; }
    else       { faqOpenRef.current.add(i);   body.style.maxHeight=body.scrollHeight+'px'; body.style.opacity='1'; }
  };

  return (
    <div style={{ position:'relative', zIndex:1, background: 'var(--bg-base)' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:'var(--nav-h)', overflow:'hidden', position:'relative' }} className="aurora-section">
        
        {/* New 3D Live Background */}
        <LiquidWaveBackground />

        <InteractiveRadar style={{ right: '-5%', top: '10%' }} />
        <InteractiveRadar style={{ left: '-10%', bottom: '20%', transform: 'scale(1.5)', opacity: 0.5 }} />

        <motion.div style={{ y:springY, opacity:springOp, width:'100%', position:'relative', zIndex:2, pointerEvents:'none' }}>
          <div className="container" style={{ paddingTop:80, paddingBottom:80, pointerEvents:'auto' }}>
            <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 0.8fr', gap:64, alignItems:'center' }}>

              {/* Left — Text */}
              <div className="glass-card" style={{ padding: 40, background: 'rgba(255,255,255,0.6)' }}>
                <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }} style={{ marginBottom:28 }}>
                  <span className="badge">Digitizing Police Operations</span>
                </motion.div>
                <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.3, ease:[0.16,1,0.3,1] }}
                  style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(42px,5.5vw,76px)', lineHeight:1.0, letterSpacing:'-0.03em', marginBottom:28, color: 'var(--text-primary)' }}>
                  Plan. Deploy.<br/>
                  <span className="gradient-text"><DecryptText text="Monitor." /></span>
                </motion.h1>
                <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7, duration:0.7 }}
                  className="section-body" style={{ marginBottom:40, fontSize:17 }}>
                  CopMap brings automation, coordination, and control across all police operations — empowering every station and officer with real-time intelligence.
                </motion.p>
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.9, duration:0.6 }}
                  style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                  <MagneticButton><NavLink to="/contact" className="btn-primary">Request Demo <ArrowRight size={16}/></NavLink></MagneticButton>
                  <MagneticButton><NavLink to="/product" className="btn-ghost"><Play size={14}/> See It Live</NavLink></MagneticButton>
                </motion.div>

                {/* Live status bar */}
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
                  style={{ marginTop:44, display:'flex', gap:24, flexWrap:'wrap' }}>
                  {[{label:'Field Officers', val:'1,284', color:'var(--indigo)'},{label:'Active Patrols', val:'187', color:'var(--cyan-dim)'},{label:'Alerts Today', val:'12', color:'var(--violet)'}].map((s,i) => (
                    <div key={i} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:s.color }}>{s.val}</span>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.12em' }}>{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Empty space for 3D elements to shine through */}
              <div></div>
            </div>

            {/* Ticker */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.4 }}
              style={{ marginTop:64, overflow:'hidden', borderTop:'1px solid var(--border-bright)', borderBottom:'1px solid var(--border-bright)', padding:'16px 0', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display:'flex', width:'max-content', animation:'ticker 30s linear infinite' }}>
                {[...ticker,...ticker].map((t,i) => (
                  <span key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'0 32px', fontFamily:'var(--font-mono)', fontSize:12, fontWeight: 500, color:'var(--text-secondary)', letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--indigo)', display:'inline-block' }}/>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:'72px 0', position:'relative' }}>
        <div className="container">
          <div className="four-col-stats glass-card" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, overflow: 'hidden' }}>
            {stats.map((s,i) => (
              <motion.div key={i} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.1 }}
                style={{ textAlign:'center', padding:'40px 16px', borderRight: i<3 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div className="stat-num">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="section-pad" style={{ paddingTop:80 }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:60 }}>
            <div>
              <span className="section-label">Operational Core</span>
              <h2 className="section-title" style={{ maxWidth:480 }}>Tools built for the <span className="gradient-text">Line of Duty.</span></h2>
            </div>
            <p className="section-body" style={{ fontSize:15, maxWidth:360 }}>
              Deeply integrated workflows that visually map, direct, and measure your force from one command hub.
            </p>
          </div>

          <div ref={cardsRef} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:20, perspective:1000 }}>
            {cards.map((c,i) => (
              <motion.div key={i} className="glass-card feature-card"
                style={{ padding:32, cursor:'pointer' }}
                whileHover={{ scale:1.02, rotateY:3, rotateX:-2 }}
                onHoverStart={() => setActiveCard(i)}
                onHoverEnd={() => setActiveCard(null)}
                transition={{ type:'spring', stiffness:350, damping:22 }}>
                {/* Icon */}
                <motion.div style={{ width:52, height:52, borderRadius:14, background:`${c.color}18`, border:`1px solid ${c.color}30`, display:'flex', alignItems:'center', justifyContent:'center', color:c.color, marginBottom:20 }}
                  animate={activeCard===i ? { boxShadow:`0 0 20px ${c.color}40` } : { boxShadow:'none' }}>
                  {c.icon}
                </motion.div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:c.color, marginBottom:8 }}>{c.sub}</p>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:19, color:'var(--text-primary)', marginBottom:12 }}>{c.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75, marginBottom:20 }}>{c.body}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {c.tags.map((t,j) => <span key={j} className="chip">{t}</span>)}
                </div>
                {/* Hover shimmer line */}
                <motion.div style={{ height:3, background:`linear-gradient(90deg, ${c.color}, transparent)`, marginTop:24, borderRadius:1.5 }}
                  animate={activeCard===i ? { scaleX:1 } : { scaleX:0 }}
                  initial={{ scaleX:0 }} transition={{ duration:0.4 }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad aurora-section" ref={stepsRef} style={{ position:'relative' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <span className="section-label">Protocol</span>
            <h2 className="section-title">Execute with <span className="gradient-text">Precision.</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {steps.map((s,i) => (
              <TiltCard key={i}>
                <motion.div className="glass-card step-item" style={{ padding:36, position:'relative', overflow:'hidden', height: '100%' }}
                  whileHover={{ borderColor:'var(--indigo)' }}>
                  {/* Big ghost number */}
                  <div style={{ position:'absolute', top:12, right:16, fontFamily:'var(--font-display)', fontSize:72, fontWeight:900, color:'rgba(79, 70, 229, 0.05)', lineHeight:1, userSelect:'none' }}>{s.n}</div>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg, var(--indigo), transparent)`, opacity:i===0?1:0.3 }}/>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--cyan-dim)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12, fontWeight: 600 }}>Step {s.n}</p>
                  <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-primary)', marginBottom:12, lineHeight:1.35 }}>{s.t}</h3>
                  <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 }}>{s.b}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span className="section-label">Infrastructure</span>
            <h2 className="section-title"><span className="gradient-text">Command-grade</span> infrastructure.</h2>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-80px' }}
            variants={{ hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } }}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:3 }}>
            {[{l:'Uptime SLA',v:'99.9%'},{l:'Encryption',v:'AES-256'},{l:'Data Residency',v:'IN-Region'},{l:'Field Sync',v:'Offline-First'},{l:'GPS Refresh',v:'< 30s'}].map((s,i) => (
              <TiltCard key={i}>
                <motion.div variants={{ hidden:{opacity:0,y:20}, visible:{opacity:1,y:0,transition:{duration:0.5}} }}
                  className="glass-card" style={{ padding:'32px 20px', textAlign:'center', height: '100%' }}>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:28, color:'var(--indigo)', letterSpacing:'-0.02em', marginBottom:8 }}><DecryptText text={s.v} /></p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)', fontWeight: 500 }}>{s.l}</p>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>

          {/* Architecture flow */}
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.4, duration:0.7 }}
            style={{ marginTop:24, padding:'32px 40px', display:'flex', alignItems:'center', justifyContent:'center', gap:0, flexWrap:'wrap' }}
            className="glass-card">
            {['Field App','GPS Layer','COMMAND','Dashboard','Dispatch'].map((node,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ padding:'10px 22px', fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase',
                  color: node==='COMMAND' ? '#fff' : 'var(--text-secondary)',
                  background: node==='COMMAND' ? 'linear-gradient(135deg, var(--indigo), var(--violet))' : 'transparent',
                  border: node==='COMMAND' ? 'none' : '1px solid var(--border-bright)',
                  borderRadius: node==='COMMAND' ? 'var(--r-full)' : 8,
                  fontWeight: node==='COMMAND' ? 700 : 500,
                  boxShadow: node==='COMMAND' ? '0 8px 24px rgba(79,70,229,0.3)' : 'none',
                }}>{node}</div>
                {i<4 && <div style={{ width:32, height:2, background:'linear-gradient(90deg, var(--indigo), var(--cyan))', opacity:0.5 }}/>}
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginLeft:28, flexWrap:'wrap' }}>
              {[<Lock size={12}/>,<Wifi size={12}/>,<RefreshCw size={12}/>].map((ic,i) => <span key={i} className="chip">{ic}</span>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-pad aurora-section">
        <div className="container" style={{ maxWidth:760 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions, <span className="gradient-text">answered.</span></h2>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {faqs.map((f,i) => (
              <motion.div key={i} className="glass-card" style={{ overflow:'hidden' }}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.08 }}>
                <button onClick={() => toggleFaq(i)} style={{
                  width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'22px 28px', background:'transparent', border:'none',
                  color:'var(--text-primary)', fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, textAlign:'left', gap:16 }}>
                  {f.q}
                  <ChevronRight size={18} style={{ color:'var(--indigo)', flexShrink:0 }}/>
                </button>
                <div ref={el => { faqBodyRefs.current[i]=el; }} style={{ maxHeight:'0px', overflow:'hidden', opacity:0, transition:'max-height 0.35s ease, opacity 0.3s ease', padding:'0 28px' }}>
                  <p style={{ paddingBottom:22, fontSize:15, color:'var(--text-secondary)', lineHeight:1.8 }}>{f.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding:'120px 0', textAlign:'center', position:'relative', overflow:'hidden' }} className="aurora-section">

        <motion.div className="container" initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(80px,14vw,200px)', fontWeight:900, color:'rgba(79, 70, 229, 0.04)', lineHeight:0.9, marginBottom:'-0.1em', userSelect:'none', letterSpacing:'-0.05em' }}>2026</div>
          <h2 className="section-title" style={{ marginBottom:20 }}>
            Ready to modernize your<br/><span className="gradient-text">force operations?</span>
          </h2>
          <p className="section-body" style={{ margin:'0 auto 44px', textAlign:'center' }}>
            Join active deployments across Maharashtra Police. Get operational in under two weeks.
          </p>
          <NavLink to="/contact" className="btn-primary" style={{ fontSize:15, padding:'16px 44px' }}>
            Get Started <ArrowRight size={16}/>
          </NavLink>
        </motion.div>
      </section>
    </div>
  );
}
