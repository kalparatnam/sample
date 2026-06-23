import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight, Award, Target, Eye, CheckCircle2, Shield, Cpu } from 'lucide-react';
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

const timeline = [
  { year:'2021', t:'The Problem Identified', b:'After months of field research with Maharashtra Police, CopMap documented systemic gaps — paper diaries, phone-call deployments, zero GPS visibility.', c:'#22d3ee' },
  { year:'2022', t:'First Prototype', b:'The first functional CopMap prototype was built and tested with real field officers. Core features validated in Zone I.', c:'#6366f1' },
  { year:'2023', t:'MeitY Genesis Grant', b:'CopMap received the prestigious MeitY Genesis Grant from the Government of India, recognising its transformative potential.', c:'#a855f7' },
  { year:'2024', t:'Live Deployment — Nagpur Police', b:'CopMap went live with Nagpur City Police, Zone I, bringing real-time patrol tracking and automated attendance to active officers.', c:'#10b981' },
  { year:'2025', t:'Expanding Across Maharashtra', b:'CopMap continues to scale across Maharashtra, with ongoing implementations and endorsements from senior IPS officers.', c:'#6366f1' },
];

const recognition = [
  { icon:<Award size={22}/>, t:'MeitY Genesis Grant', b:'Ministry of Electronics and Information Technology, Government of India', color:'#6366f1' },
  { icon:<CheckCircle2 size={22}/>, t:'Endorsed by IPS Officers', b:'Serving IPS Officers and SPs, Maharashtra Police', color:'#22d3ee' },
  { icon:<Shield size={22}/>, t:'Maharashtra Innovation Cell', b:'State Innovation Recognition, Maharashtra', color:'#a855f7' },
  { icon:<Target size={22}/>, t:'Active Implementation', b:'Nagpur City Police, Zone I, Live Deployment', color:'#10b981' },
];

const differentiators = [
  { t:'Purpose-Built for Indian Policing', b:'Not a generic workforce tool adapted for security. Built from day one around India\'s police hierarchy, bandobast workflows, and field conditions.', c:'#22d3ee' },
  { t:'Real-Time, Not Retrospective', b:'Every deployment tracked live. Every officer visible in real time. Every alert instant, not after the fact.', c:'#6366f1' },
  { t:'Complete Operational Visibility', b:'From the station to the state — every level of command sees exactly what they need, when they need it.', c:'#a855f7' },
  { t:'Maximum Fraud Deterrence', b:'No paper registers, no phone coordination, no manual reports. Everything digital, automatic, and auditable.', c:'#10b981' },
];

export default function About() {
  useReveal();
  const commandRef = useRef<HTMLDivElement>(null);
  const serverRef  = useRef<HTMLDivElement>(null);
  // Empty hook call to maintain hook order if necessary, but actually we can just remove them entirely
  useScroll({ target: commandRef, offset: ['start end','end start'] });
  useScroll({ target: serverRef,  offset: ['start end','end start'] });

  return (
    <div style={{ position:'relative', zIndex:1 }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop:'calc(var(--nav-h) + 80px)', paddingBottom:80, position:'relative', textAlign:'center', overflow: 'hidden' }} className="aurora-section">
        
        {/* Subtle grid background instead of overlapping 3D badge */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:0.6, pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', pointerEvents:'auto', display:'grid', gridTemplateColumns:'1fr 400px', alignItems:'center', gap:40 }}>
          
          <div style={{ textAlign: 'left' }}>
            <div className="reveal" style={{ marginBottom:24 }}><span className="badge">About CopMap</span></div>
            <h1 className="section-title reveal" style={{ fontSize:'clamp(38px,6vw,74px)', marginBottom:20, transitionDelay:'0.1s', textAlign: 'left' }}>
              Built from the ground up.<br /><span className="gradient-text">For the ground force.</span>
            </h1>
            <p className="section-body reveal" style={{ margin:'0', textAlign:'left', transitionDelay:'0.2s', maxWidth: 600 }}>
              Not built from a boardroom. Built after years of field research — understanding how Indian policing works, where the friction is, and what a real solution looks like.
            </p>
            {/* mini stats row */}
            <div className="reveal" style={{ display:'flex', gap:40, marginTop:40, flexWrap:'wrap', transitionDelay:'0.3s' }}>
              {[{n:'2+',l:'Years of R&D'},{n:'2024',l:'Founded'},{n:'MeitY',l:'Grant Recipient'}].map((s,i) => (
                <div key={i} style={{ textAlign:'left' }}>
                  <div className="stat-num" style={{ fontSize:'clamp(28px,4vw,36px)' }}>{s.n}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fully Contained 3D Glass Shield */}
          <div className="reveal-right" style={{ height: 400, position: 'relative' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:300, height:300, background:'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)', filter:'blur(40px)', zIndex:0 }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
              <Floating3DAsset src="/police_officer.png" alt="3D Tactical Police Officer" scale={1.2} yOffset={20} />
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID — Mission / Vision / Infrastructure ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.15fr', gridTemplateRows:'auto auto', gap:20 }}>

            {/* MISSION — full-height */}
            <motion.div ref={commandRef}
              className="glass-card reveal"
              style={{ gridRow:'1 / span 2', padding:40, overflow:'hidden', position:'relative', minHeight:640, display:'flex', flexDirection:'column' }}
              whileHover="hover">
              <div style={{ position:'relative', zIndex:1, marginTop:'auto' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:'rgba(34,211,238,0.12)', border:'1px solid rgba(34,211,238,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#22d3ee', marginBottom:20 }}>
                  <Target size={22}/>
                </div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee', marginBottom:10 }}>Mission</p>
                <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:30, color:'var(--text-primary)', marginBottom:16, lineHeight:1.2 }}>
                  Making Policing <span className="gradient-text">Transparent & Accountable.</span>
                </h2>
                <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24 }}>
                  CopMap exists to give every officer the tools they need on the ground — and every supervisor the full visibility they need in the command room.
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  {['Every operation planned','Every officer visible','Every action recorded'].map((p,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.6)', backdropFilter:'blur(12px)', padding:'7px 14px', borderRadius:'var(--r-full)', border:'1px solid rgba(255,255,255,0.8)' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:'#22d3ee', boxShadow:'0 0 10px #22d3ee' }}/>
                      <span style={{ fontSize:13, color:'var(--text-primary)', fontWeight:500 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* VISION — top right */}
            <motion.div className="glass-card reveal" style={{ padding:40, display:'flex', flexDirection:'column', justifyContent:'center', transitionDelay:'0.1s' }}
              whileHover={{ y:-6, boxShadow:'0 24px 60px rgba(99,102,241,0.18)' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#6366f1', marginBottom:20 }}>
                <Eye size={22}/>
              </div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#6366f1', marginBottom:10 }}>Vision</p>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:24, color:'var(--text-primary)', marginBottom:16, lineHeight:1.3 }}>
                The Digital Backbone for <span style={{ color:'#818cf8' }}>Modern Law Enforcement.</span>
              </h2>
              <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.8 }}>
                A future where law enforcement is entirely paperless, deeply connected, and proactively guided by real-time intelligence — creating safer cities and more efficient police forces.
              </p>
            </motion.div>

            {/* INFRASTRUCTURE — bottom right */}
            <motion.div ref={serverRef} className="glass-card reveal" style={{ padding:40, overflow:'hidden', position:'relative', minHeight:240, transitionDelay:'0.2s' }}
              whileHover={{ y:-6, boxShadow:'0 24px 60px rgba(168,85,247,0.18)' }}>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <Cpu size={20} style={{ color:'#a855f7' }}/>
                  <p style={{ fontFamily:'var(--font-mono)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.12em', color:'#a855f7' }}>Secure Infrastructure</p>
                </div>
                <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'var(--text-primary)', marginBottom:10 }}>AES-256. IN-Region. Always On.</h2>
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.7, maxWidth:'75%' }}>
                  Government-compliant servers with zero data leaks and 99.9% operational uptime guaranteed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section-pad aurora-section" style={{ background:'rgba(99,102,241,0.015)' }}>
        <div className="container">
          <p className="section-label reveal">Our Story</p>
          <h2 className="section-title reveal" style={{ marginBottom:12, transitionDelay:'0.1s' }}>
            From field research to <span className="gradient-text">live deployment.</span>
          </h2>
          <p className="section-body reveal" style={{ marginBottom:64, transitionDelay:'0.2s' }}>
            CopMap didn't start with a pitch deck. It started with conversations — with officers, inspectors, and command staff who knew exactly what was broken.
          </p>
          <div style={{ position:'relative', paddingLeft:52 }}>
            <div style={{ position:'absolute', left:18, top:8, bottom:8, width:2, background:'linear-gradient(180deg, #22d3ee, #6366f1, #a855f7, transparent)', borderRadius:2 }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
              {timeline.map((ev, i) => (
                <motion.div key={i} className="reveal" style={{ position:'relative', transitionDelay:`${i*0.1}s` }}
                  whileHover={{ x:6 }}>
                  <div style={{ position:'absolute', left:-42, top:6, width:14, height:14, borderRadius:'50%', background:ev.c, border:`2px solid var(--bg-base)`, boxShadow:`0 0 16px ${ev.c}` }}/>
                  <div className="glass-card" style={{ padding:'24px 32px' }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:ev.c, letterSpacing:'0.08em' }}>{ev.year}</span>
                    <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--text-primary)', margin:'8px 0 10px' }}>{ev.t}</h3>
                    <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 }}>{ev.b}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY COPMAP ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p className="section-label reveal">Why CopMap</p>
            <h2 className="section-title reveal" style={{ transitionDelay:'0.1s' }}>Purpose-Built. <span className="gradient-text">Not Adapted.</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
            {differentiators.map((d, i) => (
              <motion.div key={i} className="glass-card reveal" style={{ padding:32, transitionDelay:`${i*0.08}s` }}
                whileHover={{ y:-6, boxShadow:`0 24px 64px ${d.c}18` }}>
                <div className="divider"/>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--text-primary)', marginBottom:12 }}>{d.t}</h3>
                <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75 }}>{d.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION ── */}
      <section className="section-pad aurora-section" style={{ background:'rgba(34,211,238,0.01)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p className="section-label reveal">Recognition</p>
            <h2 className="section-title reveal" style={{ transitionDelay:'0.1s' }}>Recognised by the <span className="gradient-text">institutions that matter.</span></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {recognition.map((r, i) => (
              <motion.div key={i} className="glass-card reveal" style={{ padding:32, transitionDelay:`${i*0.1}s` }}
                whileHover={{ y:-6, boxShadow:`0 24px 64px ${r.color}18` }}>
                <div style={{ width:52, height:52, borderRadius:16, background:`${r.color}15`, border:`1px solid ${r.color}30`, display:'flex', alignItems:'center', justifyContent:'center', color:r.color, marginBottom:20, boxShadow:`0 0 20px ${r.color}20` }}>{r.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:16, color:'var(--text-primary)', marginBottom:8 }}>{r.t}</h3>
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65 }}>{r.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY + CTA ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }} className="two-col">
            <div>
              <p className="section-label reveal">The Company</p>
              <h2 className="section-title reveal" style={{ fontSize:32, marginBottom:16, transitionDelay:'0.1s' }}>The team behind <span className="gradient-text">the mission.</span></h2>
              <p className="section-body reveal" style={{ marginBottom:28, transitionDelay:'0.2s' }}>EyeQlytics Technologies is the company behind CopMap — laser-focused on digitising India's law enforcement.</p>
              <motion.div className="glass-card reveal" style={{ padding:24, transitionDelay:'0.3s' }}
                whileHover={{ borderColor:'var(--border-indigo)' }}>
                {[['Company','EyeQlytics Technologies Private Limited'],['Product','CopMap'],['Website','www.copmap.in'],['Email','info@copmap.in'],['Phone','+91 8855891936']].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid var(--border-subtle)', fontSize:13 }}>
                    <span style={{ color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{k}</span>
                    <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div className="glass-card shimmer-border reveal" style={{ padding:44, textAlign:'center', transitionDelay:'0.15s' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:26, color:'var(--text-primary)', marginBottom:16 }}>Ready to see CopMap in action?</h2>
              <p style={{ fontSize:15, color:'var(--text-secondary)', marginBottom:36, lineHeight:1.75 }}>
                Book a free 30-minute demo and see every feature running in a real deployment scenario.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <NavLink to="/contact" className="btn-primary" style={{ justifyContent:'center' }}>Schedule Live Demo <ArrowRight size={15}/></NavLink>
                <NavLink to="/product" className="btn-ghost" style={{ justifyContent:'center' }}>View Products</NavLink>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
