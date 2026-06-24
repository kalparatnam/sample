import{n as e,r as t,t as n}from"./index-1kzxczrw.js";import{A as r,E as i,R as a,S as o,T as s,a as c,i as l,k as u,r as d,s as f,t as p,w as m}from"./three.module-CSH1PP57.js";var h=t(e(),1),g=n(),_=`
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;   // 0..1, lagged
  uniform float uReduce;  // 1.0 = frozen
  uniform float uScroll;  // 0..1 page progress

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, amp = 0.55;
    for(int i=0;i<6;i++){ v += amp*noise(p); p = p*2.03 + vec2(11.3, 7.1); amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float aspect = uRes.x / uRes.y;
    vec2 p = uv; p.x *= aspect;

    float t = uTime * (1.0 - uReduce);

    // double domain warp → organic flowing ribbons
    vec2 q = vec2(fbm(p + vec2(0.0, t*0.05)), fbm(p + vec2(5.2, -t*0.045)));
    vec2 r = vec2(fbm(p + 1.8*q + vec2(t*0.035, 1.3)), fbm(p + 1.8*q + vec2(-1.1, t*0.028)));
    float f = fbm(p + 2.6*r);

    // luminous caustic streaks (interference bands riding the warp)
    float caustic = pow(0.5 + 0.5*sin((r.x + r.y)*9.4 + t*0.4 + f*4.0), 3.0);

    // brand chord, hue drift with scroll
    vec3 indigo = vec3(0.31, 0.27, 0.90);
    vec3 azure  = vec3(0.22, 0.60, 0.97);
    vec3 teal   = vec3(0.02, 0.71, 0.83);
    vec3 amber  = vec3(0.96, 0.62, 0.04);

    float s = uScroll;
    vec3 col = mix(indigo, azure, smoothstep(0.2, 0.85, f + s*0.15));
    col = mix(col, teal,  smoothstep(0.5, 1.05, length(r)));
    col = mix(col, amber, smoothstep(0.8, 1.2, q.y) * (0.40 + s*0.15));
    col = mix(col, vec3(1.0), caustic * 0.32);                 // light streaks

    // cursor gravity — luminous swell, heavy lag
    vec2 m = uMouse; m.x *= aspect;
    float d = distance(p, m);
    float glow = exp(-d*d*2.0) * 0.7;
    col += glow * mix(azure, vec3(1.0), 0.5);

    float intensity = smoothstep(0.15, 1.0, f) * 0.30 + caustic * 0.12 + glow * 0.5;
    intensity *= 0.55 + 0.45 * fbm(p*1.4 + r);                  // break flat bands

    // soft vignette keeps the centre clean for content
    float vig = smoothstep(1.3, 0.25, length(uv - 0.5));
    intensity *= mix(0.82, 1.0, vig);

    float alpha = clamp(intensity, 0.0, 0.52);

    float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.045;        // anti-banding grain
    col += g;

    gl_FragColor = vec4(col, alpha);
  }
`,v=`
  void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`,y=`
  attribute vec3  aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uReduce;
  uniform vec2  uParallax;
  uniform float uSize;
  varying vec3  vColor;
  varying float vA;
  void main(){
    vColor = aColor;
    float t = uTime * (1.0 - uReduce);
    vec3 pos = position;
    pos.x += sin(t * 0.20 + aSeed * 6.2831) * 0.7;
    pos.y += cos(t * 0.16 + aSeed * 5.1300) * 0.6;
    // depth parallax — nearer motes (bigger seed) react more to cursor
    pos.xy += uParallax * (0.3 + aSeed * 1.1);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 1.8) * (300.0 / -mv.z);
    vA = 0.18 + 0.30 * aSeed;
  }
`,b=`
  precision mediump float;
  varying vec3  vColor;
  varying float vA;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // soft core + faint halo → reads as a luminous mote on the pearl canvas
    float a = (smoothstep(0.5, 0.0, d) * 0.75 + pow(smoothstep(0.5, 0.18, d), 2.0) * 0.35) * vA;
    gl_FragColor = vec4(vColor, a);
  }
`,x=[[.31,.27,.9],[.22,.6,.97],[.02,.71,.83],[.5,.55,.98],[.96,.62,.04]];function S(){let e=(0,h.useRef)(null);return(0,h.useEffect)(()=>{let t=e.current;if(!t)return;let n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,h=window.matchMedia(`(max-width: 760px)`).matches,g;try{g=new p({canvas:t,alpha:!0,antialias:!1,powerPreference:`high-performance`})}catch{return}g.setClearColor(0,0),g.setPixelRatio(Math.min(window.devicePixelRatio,h?1:1.5)),g.autoClear=!1;let S=new u,C=new c,w={uTime:{value:0},uRes:{value:new a(1,1)},uMouse:{value:new a(.5,.55)},uReduce:{value:+!!n},uScroll:{value:0}},T=new r({vertexShader:v,fragmentShader:_,uniforms:w,transparent:!0,depthTest:!1,depthWrite:!1}),E=new o(new s(2,2),T);S.add(E);let D=h?600:1700,O=new Float32Array(D*3),k=new Float32Array(D*3),A=new Float32Array(D);for(let e=0;e<D;e++){O[e*3]=(Math.random()-.5)*18,O[e*3+1]=(Math.random()-.5)*12,O[e*3+2]=-2-Math.random()*7;let t=x[Math.random()>.93?4:Math.random()*4|0];k[e*3]=t[0],k[e*3+1]=t[1],k[e*3+2]=t[2],A[e]=Math.random()}let j=new l;j.setAttribute(`position`,new d(O,3)),j.setAttribute(`aColor`,new d(k,3)),j.setAttribute(`aSeed`,new d(A,1));let M={uTime:{value:0},uReduce:{value:+!!n},uParallax:{value:new a(0,0)},uSize:{value:h?2.6:3.3}},N=new r({vertexShader:y,fragmentShader:b,uniforms:M,transparent:!0,depthWrite:!1,depthTest:!1,blending:1}),P=new i(j,N),F=new u;F.add(P);let I=new m(55,1,.1,100);I.position.z=6;let L=()=>{let e=window.innerWidth,t=window.innerHeight;g.setSize(e,t,!1);let n=g.getPixelRatio();w.uRes.value.set(e*n,t*n),I.aspect=e/t,I.updateProjectionMatrix()};L(),window.addEventListener(`resize`,L);let R=new a(.5,.55),z=new a(0,0),B=e=>{let t=e.clientX/window.innerWidth,n=1-e.clientY/window.innerHeight;R.set(t,n),z.set((t-.5)*1.6,(n-.5)*1.2)};window.addEventListener(`mousemove`,B,{passive:!0});let V=()=>{let e=document.documentElement.scrollHeight-window.innerHeight;w.uScroll.value=e>0?Math.min(1,window.scrollY/e):0};window.addEventListener(`scroll`,V,{passive:!0});let H=new f,U=0,W=!0,G=()=>{g.clear(),g.render(S,C),g.render(F,I)},K=()=>{if(U=requestAnimationFrame(K),!W)return;let e=H.getElapsedTime();w.uTime.value=e,M.uTime.value=e,w.uMouse.value.lerp(R,.04),M.uParallax.value.lerp(z,.05),G()},q=()=>{W=!document.hidden,W&&!n?(H.start(),K()):(cancelAnimationFrame(U),H.stop())};return document.addEventListener(`visibilitychange`,q),n?(w.uTime.value=12,M.uTime.value=12,w.uMouse.value.copy(R),G()):K(),()=>{cancelAnimationFrame(U),window.removeEventListener(`resize`,L),window.removeEventListener(`mousemove`,B),window.removeEventListener(`scroll`,V),document.removeEventListener(`visibilitychange`,q),T.dispose(),E.geometry.dispose(),N.dispose(),j.dispose(),g.dispose()}},[]),(0,g.jsx)(`canvas`,{ref:e,"aria-hidden":`true`,style:{position:`fixed`,inset:0,width:`100%`,height:`100%`,zIndex:-2,pointerEvents:`none`}})}export{S as default};