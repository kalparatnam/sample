import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Monitor, Smartphone, MapPin, FileText, Users, Zap, Wifi, Lock, ClipboardList, Navigation } from 'lucide-react';
import { Floating3DAsset } from '../components/AIPoliceAssets';

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

const dashFeatures = [
  { icon:<MapPin size={16}/>, c:'#22d3ee', t:'Live Operations Map', b:'Every officer, vehicle, and incident in real time — no refresh needed.' },
  { icon:<FileText size={16}/>, c:'#6366f1', t:'Instant Analytics', b:'Auto-generated PDF reports after every bandobast. Full audit trail.' },
  { icon:<Users size={16}/>, c:'#a855f7', t:'Role-Based Access', b:'Custom views from Station Incharge to State DGP; each level sees only what they need.' },
  { icon:<Zap size={16}/>, c:'#10b981', t:'Force Dispatch Engine', b:'Allocate, track, and recall force with one click. Encrypted push to field devices.' },
];

const appFeatures = [
  { icon:<MapPin size={16}/>, t:'GPS Attendance', b:'Verifies officer location before marking present.' },
  { icon:<Zap size={16}/>, t:'Instant Duty Push', b:'Roster arrives via encrypted notification.' },
  { icon:<Wifi size={16}/>, t:'Offline Mode', b:'Full functionality without 4G connectivity.' },
  { icon:<Lock size={16}/>, t:'Secure Access', b:'AES-256 encrypted data at all times.' },
  { icon:<ClipboardList size={16}/>, t:'Duty Log', b:'Full history of assignments and reports.' },
  { icon:<Navigation size={16}/>, t:'Live Status', b:'Officers see their patrol route and geo-fence alerts.' },
];

export default function Product() {
  useReveal();
  const dashImgRef = useRef<HTMLDivElement>(null);
  const appImgRef  = useRef<HTMLDivElement>(null);

  const { scrollYProgress: ds } = useScroll({ target: dashImgRef, offset: ['start end', 'end start'] });
  const { scrollYProgress: as } = useScroll({ target: appImgRef,  offset: ['start end', 'end start'] });

  const dashY = useTransform(ds, [0, 1], [40, -40]);
  const appY  = useTransform(as, [0, 1], [80, -80]);

  return (
    <div style={{ position:'relative', zIndex:1 }}>

      {/* ── HERO ── */}
      <section style={{ minHeight:'60vh', display:'flex', alignItems:'center', paddingTop:'var(--nav-h)', textAlign:'center', position:'relative', overflow:'hidden' }} className="aurora-section">
        
        {/* Subtle geometric background instead of overlapping globe */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:0.6, pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:'80%', height:'100%', background:'radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 60%)', filter:'blur(40px)', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', paddingTop:80, paddingBottom:80, pointerEvents:'auto' }}>
          <div className="reveal" style={{ marginBottom:24 }}><span className="badge">Ecosystem Architecture</span></div>
          <h1 className="section-title reveal" style={{ fontSize:'clamp(38px,6vw,74px)', marginBottom:20, transitionDelay:'0.1s' }}>
            Two Products.<br /><span className="gradient-text">One Reality.</span>
          </h1>
          <p className="section-body reveal" style={{ margin:'0 auto 40px', textAlign:'center', transitionDelay:'0.2s' }}>
            A web-based Command Dashboard for supervisors, and an intuitive Mobile App for officers. Perfectly synced in real-time.
          </p>
          <div className="reveal" style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', transitionDelay:'0.3s' }}>
            <a href="#dashboard" className="btn-primary"><Monitor size={15}/> Explore Dashboard</a>
            <a href="#app" className="btn-ghost"><Smartphone size={15}/> Explore App</a>
          </div>
        </div>
      </section>

      {/* ── COMMAND DASHBOARD ── */}
      <section id="dashboard" className="section-pad">
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>

            {/* Left — text */}
            <div>
              <p className="section-label reveal"><Monitor size={12} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }}/>Command Dashboard</p>
              <h2 className="section-title reveal" style={{ marginBottom:16, transitionDelay:'0.1s' }}>The Command <span className="gradient-text">Dashboard.</span></h2>
              <p className="section-body reveal" style={{ marginBottom:8, transitionDelay:'0.2s' }}>
                A high-performance web portal built for full-force visibility. Every widget, every metric alive.
              </p>
              <p className="reveal" style={{ fontSize:13, color:'var(--cyan)', fontFamily:'var(--font-mono)', marginBottom:36, transitionDelay:'0.25s' }}>
                For: Station Incharges · DCPs · CPs · State Authorities
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {dashFeatures.map((f, i) => (
                  <motion.div key={i} className="glass-card reveal" style={{ padding:'16px 20px', display:'flex', gap:14, alignItems:'flex-start', transitionDelay:`${0.3+i*0.08}s` }}
                    whileHover={{ x:6, borderColor:'var(--border-indigo)' }}>
                    <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:`${f.c}18`, border:`1px solid ${f.c}30`, display:'flex', alignItems:'center', justifyContent:'center', color:f.c }}>{f.icon}</div>
                    <div>
                      <p style={{ fontWeight:600, fontSize:14, color:'var(--text-primary)', marginBottom:3 }}>{f.t}</p>
                      <p style={{ fontSize:12, color:'var(--text-muted)' }}>{f.b}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — ADVANCED HUD MOCKUP */}
            <motion.div ref={dashImgRef} style={{ y: dashY }} className="reveal-right">
              <motion.div
                whileHover={{ scale:1.02, rotateX:2, rotateY:-3 }}
                transition={{ type:'spring', stiffness:300, damping:22 }}
                style={{ position:'relative', height: 400, borderRadius:'var(--r-xl)', border:'1px solid var(--cyan)', background:'rgba(5,10,20,0.85)', backdropFilter:'blur(24px)', boxShadow:'0 0 40px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.1)', overflow:'hidden', transformStyle:'preserve-3d' }}>
                
                {/* HUD Corner Brackets */}
                <div style={{ position:'absolute', top:10, left:10, width:20, height:20, borderTop:'2px solid var(--cyan)', borderLeft:'2px solid var(--cyan)' }} />
                <div style={{ position:'absolute', top:10, right:10, width:20, height:20, borderTop:'2px solid var(--cyan)', borderRight:'2px solid var(--cyan)' }} />
                <div style={{ position:'absolute', bottom:10, left:10, width:20, height:20, borderBottom:'2px solid var(--cyan)', borderLeft:'2px solid var(--cyan)' }} />
                <div style={{ position:'absolute', bottom:10, right:10, width:20, height:20, borderBottom:'2px solid var(--cyan)', borderRight:'2px solid var(--cyan)' }} />

                {/* Browser chrome bar -> Tactical Header */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:36, background:'linear-gradient(90deg, transparent, rgba(0,240,255,0.1), transparent)', borderBottom:'1px solid rgba(0,240,255,0.3)', display:'flex', alignItems:'center', justifyContent: 'center', zIndex:2 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.2em' }}>COMMAND UPLINK ACTIVE</div>
                </div>
                
                {/* Enhanced UI Content */}
                <div style={{ padding:'56px 20px 20px', display:'flex', flexDirection:'column', gap:16, height:'100%', position: 'relative', zIndex: 1 }}>
                  {/* Grid overlay */}
                  <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)', backgroundSize:'20px 20px', pointerEvents: 'none' }} />
                  
                  {/* Top Row: Map and Stats */}
                  <div style={{ display:'flex', gap:16, zIndex: 2 }}>
                    {/* Fake Map Widget */}
                    <div style={{ width:'70%', height:140, background:'rgba(0,0,0,0.4)', borderRadius:8, border:'1px solid rgba(0,240,255,0.2)', position:'relative', overflow:'hidden' }}>
                      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width: 80, height: 80, borderRadius:'50%', border:'1px dashed rgba(0,240,255,0.4)' }} />
                      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width: 40, height: 40, borderRadius:'50%', border:'1px solid rgba(0,240,255,0.6)' }} />
                      
                      <div style={{ position:'absolute', top:'40%', left:'30%', width:8, height:8, borderRadius:'50%', background:'var(--red)', boxShadow:'0 0 10px var(--red)' }} />
                      <div style={{ position:'absolute', top:'60%', left:'70%', width:6, height:6, borderRadius:'50%', background:'var(--cyan)', boxShadow:'0 0 10px var(--cyan)' }} />
                      <div style={{ position:'absolute', top:'20%', left:'50%', width:6, height:6, borderRadius:'50%', background:'var(--cyan)', boxShadow:'0 0 10px var(--cyan)' }} />
                    </div>
                    {/* Fake Stats Widget */}
                    <div style={{ width:'30%', height:140, background:'rgba(0,0,0,0.4)', borderRadius:8, border:'1px solid rgba(0,240,255,0.2)', display:'flex', flexDirection:'column', gap:8, padding:12 }}>
                      <div style={{ width:'40%', height:8, background:'rgba(0,240,255,0.3)', borderRadius:4 }} />
                      <div style={{ width:'80%', height:24, background:'rgba(255,0,60,0.2)', borderLeft:'2px solid var(--red)', borderRadius:2 }} />
                      <div style={{ width:'60%', height:8, background:'rgba(0,240,255,0.1)', borderRadius:4, marginTop:'auto' }} />
                    </div>
                  </div>
                  {/* Bottom Row: Data Table */}
                  <div style={{ flex:1, background:'rgba(0,0,0,0.4)', borderRadius:8, border:'1px solid rgba(0,240,255,0.2)', padding:16, display:'flex', flexDirection:'column', gap:10, zIndex: 2 }}>
                    <div style={{ width:'30%', height:10, background:'rgba(0,240,255,0.3)', borderRadius:4, marginBottom:4 }} />
                    {[1,2,3].map(i => (
                      <div key={i} style={{ display:'flex', gap:12, alignItems:'center', borderBottom:'1px solid rgba(0,240,255,0.1)', paddingBottom:6 }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(0,240,255,0.1)', border: '1px solid var(--cyan)' }} />
                        <div style={{ width:'40%', height:8, background:'rgba(0,240,255,0.2)', borderRadius:4 }} />
                        <div style={{ marginLeft:'auto', width:'15%', height:8, background: i === 1 ? 'rgba(255,0,60,0.4)' : 'rgba(0,255,170,0.4)', borderRadius:4 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              {/* Floating status card */}
              <motion.div animate={{ y:[-6,6,-6] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', bottom:-16, right:-16, background:'rgba(5,10,20,0.95)', backdropFilter:'blur(16px)', border:'1px solid var(--green)', borderRadius:'var(--r-md)', padding:'12px 18px', boxShadow:'0 0 20px rgba(0,255,170,0.2)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 12px var(--green)' }}/>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--green)' }}>1,284 UNITS ACTIVE</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OFFICER APP ── */}
      <section id="app" className="section-pad aurora-section" style={{ background:'rgba(99,102,241,0.02)' }}>
        <div className="container">
          <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>

            {/* Left — ADVANCED MOBILE HUD */}
            <motion.div ref={appImgRef} style={{ y: appY }} className="reveal-left">
              <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
                {/* Glow halo */}
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'60%', height:'60%', background:'radial-gradient(circle, rgba(0,240,255,0.18) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }}/>
                
                <motion.div
                  animate={{ y:[-10,10,-10] }}
                  transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                  style={{ width:240, height:500, background:'rgba(5,10,20,0.85)', backdropFilter:'blur(24px)', border:'4px solid #1e293b', borderRadius:36, boxShadow:'0 0 40px rgba(0, 240, 255, 0.2)', position:'relative', display:'flex', flexDirection:'column', overflow:'hidden' }}
                >
                  <div style={{ width:'40%', height:20, background:'#1e293b', margin:'0 auto', borderBottomLeftRadius:12, borderBottomRightRadius:12 }} />
                  <div style={{ flex:1, padding:16, display:'flex', flexDirection:'column', gap:12 }}>
                    {/* HUD Header */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                      <div style={{ width:'40%', height:12, background:'rgba(0,240,255,0.2)', borderRadius:4 }} />
                      <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(0,240,255,0.1)', border: '1px solid var(--cyan)' }} />
                    </div>
                    {/* Main Action Card */}
                    <div style={{ width:'100%', height:80, background:'rgba(0,240,255,0.05)', borderRadius:12, border:'1px solid var(--cyan)', padding:12, display:'flex', flexDirection:'column', gap:8, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(45deg, transparent, rgba(0,240,255,0.1), transparent)', transform:'translateX(-100%)', animation:'shimmer 2s infinite' }} />
                      <div style={{ width:'50%', height:10, background:'rgba(0,240,255,0.4)', borderRadius:4 }} />
                      <div style={{ width:'30%', height:8, background:'rgba(0,240,255,0.2)', borderRadius:4 }} />
                    </div>
                    {/* List items */}
                    <div style={{ width:'100%', height:50, background:'rgba(0,0,0,0.4)', borderRadius:12, border:'1px solid rgba(0,240,255,0.2)', padding:12, display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:16, height:16, borderRadius:4, background:'rgba(255,0,60,0.2)', border: '1px solid var(--red)' }} />
                      <div style={{ width:'60%', height:8, background:'rgba(0,240,255,0.2)', borderRadius:4 }} />
                    </div>
                    <div style={{ width:'100%', flex:1, background:'rgba(0,0,0,0.4)', borderRadius:12, border:'1px solid rgba(0,240,255,0.2)', position:'relative', overflow:'hidden' }}>
                       <div style={{ position:'absolute', bottom:0, width:'100%', height:'50%', background:'linear-gradient(to top, rgba(0,240,255,0.1), transparent)' }} />
                    </div>
                  </div>
                </motion.div>
                {/* Floating alert tag */}
                <motion.div animate={{ y:[4,-4,4] }} transition={{ duration:3.5, repeat:Infinity, ease:'easeInOut' }}
                  style={{ position:'absolute', top:'20%', right:'-15%', background:'rgba(5,10,20,0.95)', backdropFilter:'blur(16px)', border:'1px solid var(--red)', borderRadius:'var(--r-sm)', padding:'10px 14px', boxShadow: '0 0 20px rgba(255,0,60,0.3)' }}>
                  <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--red)', letterSpacing:'0.1em' }}>CRITICAL ALERT</div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:13, color:'#fff' }}>Unit B-7 Offline</div>
                </motion.div>
                {/* GPS verified chip */}
                <motion.div animate={{ y:[-3,3,-3] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut', delay:1 }}
                  style={{ position:'absolute', bottom:'22%', left:'-15%', background:'rgba(5,10,20,0.95)', backdropFilter:'blur(16px)', border:'1px solid var(--green)', borderRadius:'var(--r-sm)', padding:'10px 14px', boxShadow: '0 0 20px rgba(0,255,170,0.2)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 10px var(--green)' }}/>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--green)' }}>SAT-LINK ACTIVE</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — text */}
            <div>
              <p className="section-label reveal"><Smartphone size={12} style={{ display:'inline', verticalAlign:'middle', marginRight:6 }}/>Officer App</p>
              <h2 className="section-title reveal" style={{ marginBottom:16, transitionDelay:'0.1s' }}>Built for <span className="gradient-text">the field.</span></h2>
              <p className="section-body reveal" style={{ marginBottom:8, transitionDelay:'0.2s' }}>
                An incredibly simple, secure app built for field constables. No typing required — assignments arrive via push, attendance verified via GPS.
              </p>
              <p className="reveal" style={{ fontSize:13, color:'var(--violet)', fontFamily:'var(--font-mono)', marginBottom:36, transitionDelay:'0.25s' }}>
                For: Every Constable · PSI · Inspector in the Field
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {appFeatures.map((f, i) => (
                  <motion.div key={i} className="glass-card reveal" style={{ padding:'16px', transitionDelay:`${0.3+i*0.07}s` }}
                    whileHover={{ y:-4, borderColor:'var(--border-indigo)' }}>
                    <span style={{ color:'var(--violet)', display:'block', marginBottom:8 }}>{f.icon}</span>
                    <p style={{ fontWeight:600, fontSize:13, color:'var(--text-primary)', marginBottom:4 }}>{f.t}</p>
                    <p style={{ fontSize:11, color:'var(--text-muted)', lineHeight:1.55 }}>{f.b}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" style={{ textAlign:'center' }}>
        <div className="container">
          <motion.div className="glass-card shimmer-border reveal"
            style={{ padding:'80px 40px', position:'relative', overflow:'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: 40 }}
            whileHover={{ boxShadow:'0 40px 100px rgba(99,102,241,0.2)' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
            
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'left' }}>
              <h2 className="section-title reveal" style={{ marginBottom:16, textAlign: 'left' }}>Experience the <span className="gradient-text">platform.</span></h2>
              <p className="section-body reveal" style={{ margin:'0 0 40px', textAlign:'left', transitionDelay:'0.1s' }}>
                Stop tracking operations on paper. Digitize your entire force today with a live 30-minute demo.
              </p>
              <div className="reveal" style={{ display:'flex', gap:16, justifyContent:'flex-start', flexWrap:'wrap', marginBottom:48, transitionDelay:'0.2s' }}>
                <NavLink to="/contact" className="btn-primary">Schedule Live Demo <ArrowRight size={15}/></NavLink>
                <NavLink to="/features" className="btn-ghost">Explore Features</NavLink>
              </div>
              <div className="reveal" style={{ display:'flex', gap:48, justifyContent:'flex-start', flexWrap:'wrap', transitionDelay:'0.3s' }}>
                {[{n:'2–3 Days',l:'To Deploy'},{n:'10K+',l:'Officers Managed'},{n:'99%',l:'GPS Visibility'}].map((s,i) => (
                  <div key={i} style={{ textAlign:'center' }}>
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:28, color:'var(--cyan)' }}>{s.n}</p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'var(--font-mono)' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Tactical Patrol Car in CTA */}
            <div style={{ height: 400, position: 'relative', zIndex: 1 }}>
              <Floating3DAsset src="/patrol_car.png" alt="3D Police Patrol Car" scale={1.3} yOffset={15} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
