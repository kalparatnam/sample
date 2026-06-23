import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Shield, Users, CheckCircle2 } from 'lucide-react';
import { Floating3DAsset } from '../components/AIPoliceAssets';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const expects = [
  { icon:<Clock size={16}/>,        t:'Response within 24 hours' },
  { icon:<Shield size={16}/>,       t:'Confidential & secure' },
  { icon:<Users size={16}/>,        t:'Tailored demo for your jurisdiction' },
  { icon:<CheckCircle2 size={16}/>, t:'No commitment required' },
];

const contactItems = [
  { icon:<Mail size={20}/>,   label:'Email',   val:'info@copmap.in',                                                          color:'#22d3ee' },
  { icon:<Phone size={20}/>,  label:'Phone',   val:'+91 8855891936',                                                          color:'#6366f1' },
  { icon:<MapPin size={20}/>, label:'Address', val:'10/81, Near SJP Petrol Pump, Bidkin, Chhatrapati Sambhajinagar – 431105', color:'#a855f7' },
];

type FormState = { name:string; designation:string; org:string; state:string; phone:string; email:string; message:string; };
const empty: FormState = { name:'', designation:'', org:'', state:'', phone:'', email:'', message:'' };

export default function Contact() {
  useReveal();
  const [form, setForm]           = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [focused, setFocused]     = useState<string|null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  const field = (key: keyof FormState, label: string, type='text', required=true, span=false) => (
    <div style={{ gridColumn: span ? 'span 2' : 'span 1' }}>
      <label style={{ display:'block', fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color: focused===key ? 'var(--cyan)' : 'var(--text-muted)', marginBottom:8, transition:'color 0.2s' }}>
        {label}{required && <span style={{ color:'var(--indigo-bright)' }}> *</span>}
      </label>
      {key === 'message' ? (
        <textarea value={form[key]} required={required} rows={4}
          onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}...`}
          style={{ ...inputBase, borderColor: focused===key ? 'rgba(99,102,241,0.5)' : 'var(--border-subtle)', boxShadow: focused===key ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', background: focused===key ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.03)' }}
        />
      ) : (
        <input type={type} value={form[key]} required={required}
          onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}...`}
          style={{ ...inputBase, borderColor: focused===key ? 'rgba(99,102,241,0.5)' : 'var(--border-subtle)', boxShadow: focused===key ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', background: focused===key ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.03)' }}
        />
      )}
    </div>
  );

  return (
    <div style={{ position:'relative', zIndex:1 }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop:'calc(var(--nav-h) + 80px)', paddingBottom:60, textAlign:'center', position:'relative', overflow: 'hidden' }} className="aurora-section">
        
        {/* Subtle grid background instead of overlapping 3D badge */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:0.6, pointerEvents:'none' }} />
        
        <div className="container" style={{ position:'relative', pointerEvents:'auto', display:'grid', gridTemplateColumns:'1fr 300px', alignItems:'center', gap:40 }}>
          <div style={{ textAlign: 'left' }}>
            <div className="reveal" style={{ marginBottom:24 }}><span className="badge">Get in Touch</span></div>
            <h1 className="section-title reveal" style={{ fontSize:'clamp(38px,6vw,74px)', marginBottom:20, transitionDelay:'0.1s', textAlign: 'left' }}>
              Let's <span className="gradient-text">Connect.</span>
            </h1>
            <p className="section-body reveal" style={{ margin:'0', textAlign:'left', transitionDelay:'0.2s' }}>
              Whether you are a senior officer exploring CopMap for your jurisdiction, a private security organisation, or a government institution — we are ready to show you CopMap in action.
            </p>
          </div>

          {/* 3D Glass Shield Element perfectly contained */}
          <div className="reveal-right" style={{ height: 300, position: 'relative' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:250, height:250, background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter:'blur(30px)', zIndex:0 }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
              <Floating3DAsset src="/police_map.png" alt="3D Police Holographic Map" scale={1.1} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="section-pad" style={{ paddingTop:40 }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:40, alignItems:'start' }} className="two-col">

            {/* Left — contact info */}
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
                {contactItems.map((item, i) => (
                  <motion.div key={i} className="glass-card reveal" style={{ padding:'20px 24px', display:'flex', gap:16, alignItems:'flex-start', transitionDelay:`${i*0.1}s` }}
                    whileHover={{ x:6, borderColor:`${item.color}50` }}>
                    <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, background:`${item.color}12`, border:`1px solid ${item.color}25`, display:'flex', alignItems:'center', justifyContent:'center', color:item.color, boxShadow:`0 0 16px ${item.color}20` }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4 }}>{item.label}</p>
                      <p style={{ fontSize:14, color:'var(--text-primary)', fontWeight:500, lineHeight:1.55 }}>{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="glass-card reveal" style={{ padding:26, transitionDelay:'0.3s' }}>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--cyan)', marginBottom:18 }}>What to Expect</p>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {expects.map((e, i) => (
                    <motion.div key={i} style={{ display:'flex', gap:12, alignItems:'center' }} whileHover={{ x:4 }}>
                      <span style={{ color:'var(--cyan)', flexShrink:0 }}>{e.icon}</span>
                      <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{e.t}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Police badge decorative element */}
              <motion.div className="glass-card reveal" style={{ padding:24, marginTop:14, textAlign:'center', transitionDelay:'0.4s', background:'rgba(99,102,241,0.04)', border:'1px solid var(--border-indigo)' }}
                whileHover={{ boxShadow:'0 0 40px rgba(99,102,241,0.15)' }}
                animate={{ boxShadow:['0 0 0 0 rgba(99,102,241,0)', '0 0 0 8px rgba(99,102,241,0.04)', '0 0 0 0 rgba(99,102,241,0)'] }}
                transition={{ duration:3, repeat:Infinity }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:8 }}>Trusted By</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'var(--indigo-bright)' }}>Maharashtra Police</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', marginTop:4 }}>Nagpur City Police · Zone I</div>
              </motion.div>
            </div>

            {/* Right — form */}
            <motion.div className="glass-card reveal" style={{ padding:44, transitionDelay:'0.15s' }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} style={{ textAlign:'center', padding:'60px 0' }}>
                    <motion.div
                      initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.1, type:'spring', stiffness:200 }}
                      style={{ width:80, height:80, borderRadius:'50%', background:'rgba(16,185,129,0.12)', border:'2px solid rgba(16,185,129,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', color:'#10b981', boxShadow:'0 0 40px rgba(16,185,129,0.2)' }}>
                      <CheckCircle2 size={40}/>
                    </motion.div>
                    <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:26, color:'var(--text-primary)', marginBottom:14 }}>Request Submitted!</h2>
                    <p style={{ fontSize:15, color:'var(--text-secondary)', lineHeight:1.8 }}>
                      Thank you for reaching out. Our deployment specialists will contact you within 24 hours to schedule your personalised demo.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <div style={{ marginBottom:32 }}>
                      <p style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--cyan)', marginBottom:8 }}>Demo Request</p>
                      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:26, color:'var(--text-primary)', marginBottom:8 }}>Request a Live Demo</h2>
                      <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Fill out the form below and our deployment specialists will get back to you.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }} className="form-two-col">
                        {field('name', 'Full Name')}
                        {field('designation', 'Designation / Role')}
                        {field('org', 'Organisation / Unit')}
                        {field('state', 'State / City')}
                        {field('phone', 'Phone Number', 'tel')}
                        {field('email', 'Official Email ID', 'email')}
                        {field('message', 'Message', 'text', false, true)}
                      </div>
                      <div style={{ marginBottom:22 }}>
                        <p style={{ fontSize:12, color:'var(--text-muted)' }}>
                          By submitting this form, you agree to our <span style={{ color:'var(--cyan)', cursor:'pointer' }}>Privacy Policy</span>.
                        </p>
                      </div>
                      <motion.button type="submit" className="btn-primary" disabled={loading}
                        whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                        style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'16px 24px', opacity:loading ? 0.7 : 1 }}>
                        {loading ? (
                          <span style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <span style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite', display:'inline-block' }}/>
                            Submitting...
                          </span>
                        ) : 'Submit Demo Request →'}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputBase: React.CSSProperties = {
  width:'100%', padding:'14px 18px',
  borderRadius:'var(--r-md)',
  color:'var(--text-primary)',
  fontSize:14,
  outline:'none',
  transition:'all 0.25s ease',
  resize:'vertical',
  border:'1px solid',
};
