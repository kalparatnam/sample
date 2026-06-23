import{a as e,r as t,t as n}from"./index-CgNrJAd9.js";import{S as r,h as i,i as a,o,p as s,t as c,v as l,y as u}from"./three.module-vlNfbw9F.js";var d=e(t(),1),f=n(),p=`
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uMouse;   // 0..1, lagged
  uniform float uReduce;  // 1.0 = reduced motion (freeze time)

  // hash + value noise + fbm (cheap, stable across GPUs)
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
    for(int i=0;i<5;i++){ v += amp*noise(p); p *= 2.02; amp *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    float aspect = uRes.x / uRes.y;
    vec2 p = uv; p.x *= aspect;

    float t = uTime * (1.0 - uReduce);

    // domain warp → organic, flowing aurora ribbons
    vec2 q = vec2(fbm(p + vec2(0.0, t*0.06)), fbm(p + vec2(5.2, -t*0.05)));
    vec2 r = vec2(fbm(p + 1.7*q + vec2(t*0.04, 1.3)), fbm(p + 1.7*q + vec2(-1.1, t*0.03)));
    float f = fbm(p + 2.4*r);

    // brand chord
    vec3 indigo = vec3(0.31, 0.27, 0.90);
    vec3 azure  = vec3(0.22, 0.60, 0.97);
    vec3 teal   = vec3(0.02, 0.71, 0.83);
    vec3 amber  = vec3(0.96, 0.62, 0.04);

    vec3 col = mix(indigo, azure, smoothstep(0.2, 0.8, f));
    col = mix(col, teal,  smoothstep(0.55, 1.05, length(r)));
    col = mix(col, amber, smoothstep(0.78, 1.15, q.y) * 0.5); // warm signal, sparing

    // cursor gravity — soft luminous swell that follows with lag
    vec2 m = uMouse; m.x *= aspect;
    float d = distance(p, m);
    float glow = exp(-d*d*2.2) * 0.6;
    col += glow * mix(azure, vec3(1.0), 0.4);

    // intensity / alpha — kept FAINT: this is only a connective base layer;
    // each section paints its own distinct living visual on top.
    float intensity = smoothstep(0.2, 1.0, f) * 0.34 + glow * 0.5;
    intensity *= 0.55 + 0.45 * fbm(p*1.5 + r);          // breaks up flat bands
    float alpha = clamp(intensity, 0.0, 0.5);

    // fine in-shader grain (kills any visible gradient banding)
    float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.05;
    col += g;

    gl_FragColor = vec4(col, alpha);
  }
`,m=`
  void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }
`;function h(){let e=(0,d.useRef)(null);return(0,d.useEffect)(()=>{let t=e.current;if(!t)return;let n=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,d=window.matchMedia(`(max-width: 760px)`).matches,f;try{f=new c({canvas:t,alpha:!0,antialias:!1,powerPreference:`high-performance`})}catch{return}f.setClearColor(0,0),f.setPixelRatio(Math.min(window.devicePixelRatio,d?1:1.5));let h=new l,g=new a,_={uTime:{value:0},uRes:{value:new r(1,1)},uMouse:{value:new r(.5,.55)},uReduce:{value:+!!n}},v=new u({vertexShader:m,fragmentShader:p,uniforms:_,transparent:!0}),y=new s(new i(2,2),v);h.add(y);let b=()=>{let e=window.innerWidth,t=window.innerHeight;f.setSize(e,t,!1),_.uRes.value.set(e*f.getPixelRatio(),t*f.getPixelRatio())};b(),window.addEventListener(`resize`,b);let x=new r(.5,.55),S=e=>{x.set(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight)};window.addEventListener(`mousemove`,S,{passive:!0});let C=0,w=new o,T=!0,E=()=>{C=requestAnimationFrame(E),T&&(_.uTime.value=w.getElapsedTime(),_.uMouse.value.lerp(x,.04),f.render(h,g))},D=()=>{T=!document.hidden,T?(w.start(),E()):(cancelAnimationFrame(C),w.stop())};return document.addEventListener(`visibilitychange`,D),n?(_.uTime.value=12,_.uMouse.value.copy(x),f.render(h,g)):E(),()=>{cancelAnimationFrame(C),window.removeEventListener(`resize`,b),window.removeEventListener(`mousemove`,S),document.removeEventListener(`visibilitychange`,D),v.dispose(),y.geometry.dispose(),f.dispose()}},[]),(0,f.jsx)(`canvas`,{ref:e,"aria-hidden":`true`,style:{position:`fixed`,inset:0,width:`100%`,height:`100%`,zIndex:-2,pointerEvents:`none`}})}export{h as default};