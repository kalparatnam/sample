import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { to:'/',         label:'Home'      },
  { to:'/product',  label:'Product'   },
  { to:'/features', label:'Features'  },
  { to:'/about',    label:'About'     },
  { to:'/contact',  label:'Contact'   },
];

const features = [
  'Bandobast Management',
  'Patrolling Operations',
  'Resource Requirement',
  'Attendance Management',
  'Officer & Hierarchy Management',
  'Leave Management',
];

export default function Footer() {
  return (
    <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid var(--border-subtle)', background:'rgba(255,255,255,0.8)', backdropFilter:'blur(24px)' }}>

      {/* Top CTA strip */}
      <div style={{ borderBottom:'1px solid var(--border-subtle)', padding:'48px 0' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(22px,4vw,40px)', color:'var(--text-primary)', marginBottom:8, lineHeight:1.2 }}>
              See CopMap in a real<br/><span className="gradient-text">deployment scenario.</span>
            </h2>
            <p style={{ fontSize:14, color:'var(--text-secondary)' }}>30-minute live walkthrough. No commitment required.</p>
          </div>
          <NavLink to="/contact" className="btn-primary" style={{ fontSize:14, padding:'14px 32px', flexShrink:0 }}>
            Schedule Demo <ArrowUpRight size={16}/>
          </NavLink>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container" style={{ padding:'64px 32px 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1.4fr 1.2fr', gap:48 }}>

          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg, #6366f1, #22d3ee)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 16px rgba(99,102,241,0.4)' }}>
                <Shield size={16} color="#fff"/>
              </div>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:17, color:'var(--text-primary)' }}>
                Cop<span style={{ color:'#818cf8' }}>Map</span>
              </span>
            </div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.8, marginBottom:24, maxWidth:260 }}>
              India's leading police operations management platform — digitising every bandobast, patrol, and duty cycle.
            </p>
            {/* Status pill */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:'var(--r-full)', padding:'6px 14px' }}>
              <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6, repeat:Infinity }} style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981' }}/>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.1em' }}>Live in Nagpur Police</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:20 }}>Navigation</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  style={{ fontSize:14, color:'var(--text-secondary)', transition:'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; (e.currentTarget as HTMLElement).style.paddingLeft = '6px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.paddingLeft = '0'; }}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Platform features */}
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:20 }}>Platform</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {features.map(f => (
                <NavLink key={f} to="/features"
                  style={{ fontSize:13, color:'var(--text-secondary)', transition:'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#22d3ee'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}>
                  {f}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact + Live Demo */}
          <div>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:20 }}>Contact</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
              {[
                { icon:<Mail size={14}/>,   val:'info@copmap.in',    c:'#22d3ee' },
                { icon:<Phone size={14}/>,  val:'+91 8855891936',    c:'#6366f1' },
                { icon:<MapPin size={14}/>, val:'Chhatrapati Sambhajinagar, MH', c:'#a855f7' },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ color:item.c, marginTop:1, flexShrink:0 }}>{item.icon}</span>
                  <span style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>{item.val}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(99,102,241,0.06)', border:'1px solid var(--border-indigo)', borderRadius:'var(--r-md)', padding:'16px' }}>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6 }}>Live Demo</p>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:12 }}>See CopMap running in a real deployment scenario.</p>
              <NavLink to="/contact" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:'var(--indigo-bright)', fontWeight:600, fontFamily:'var(--font-display)' }}>
                Schedule Now <ArrowUpRight size={12}/>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop:'1px solid var(--border-subtle)', padding:'20px 0' }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)' }}>
            © {new Date().getFullYear()} EyeQlytics Technologies Pvt. Ltd. · All rights reserved.
          </p>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms of Use','Security'].map(l => (
              <a key={l} href="#" style={{ fontSize:12, color:'var(--text-muted)', transition:'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
