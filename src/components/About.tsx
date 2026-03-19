import { useEffect, useRef } from 'react';
import { Code2, Palette, Zap } from 'lucide-react';
import profilePic from '../assets/madhu.jpeg';

/* ─── physics constants ─────────────────────────────────── */
const L        = 200;   // lanyard length at rest (px)
const GRAVITY  = 0.52;  // px / frame²
const SPRING   = 0.055; // stiffer spring → snappier, shorter swings
const DAMP     = 0.88;  // heavy damping → settles in 1-2 swings

/* ─── IDCard ────────────────────────────────────────────── */
function IDCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);

  /* physics state (all refs — no re-renders) */
  const pos   = useRef({ x: 0, y: -L });   // start card at anchor
  const vel   = useRef({ x: 0, y: 0 });
  const phase = useRef<'idle'|'fall'|'spring'|'drag'>('idle');
  const grab  = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });
  const raf   = useRef<number>();

  /* draw bezier lanyard: anchor-top → card-top
     anchor drifts slightly toward drag direction for realism */
  const drawRope = (tx: number, ty: number) => {
    const svg  = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const W   = wrap.offsetWidth;
    // anchor drifts very subtly — 5% of card displacement
    const ax  = W / 2 + tx * 0.05;
    const ay  = 52 + Math.abs(tx) * 0.03; // base ay=52 (anchor lower on page)
    const cx  = W / 2 + tx;
    const cy  = 52 + L + ty;              // card top centre
    const dx  = cx - ax;
    const mY  = (ay + cy) / 2;
    const sag = Math.sqrt(Math.abs(tx) * 1.5) * 1.4 + 10;
    const d   = `M${ax},${ay} C${ax+dx*.15},${mY+sag} ${cx-dx*.15},${mY+sag} ${cx},${cy}`;
    svg.querySelectorAll('[data-rope]').forEach(e => e.setAttribute('d', d));
  };

  /* apply card CSS + redraw rope */
  const apply = (tx: number, ty: number) => {
    if (cardRef.current) {
      const r = Math.max(-10, Math.min(10, tx * 0.035)); // gentle rotation
      cardRef.current.style.transform = `translate(${tx}px,${ty}px) rotate(${r}deg)`;
    }
    drawRope(tx, ty);
  };

  /* scale raw mouse delta — 0.35 keeps movement subtle */
  const DRAG_SCALE = 0.35;

  /* spring animation toward (0,0) */
  const doSpring = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    phase.current = 'spring';
    const tick = () => {
      if (phase.current === 'drag') return;
      vel.current.x = (vel.current.x - pos.current.x * SPRING) * DAMP;
      vel.current.y = (vel.current.y - pos.current.y * SPRING) * DAMP;
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;
      apply(pos.current.x, pos.current.y);
      const done =
        Math.abs(pos.current.x) < 0.09 && Math.abs(pos.current.y) < 0.09 &&
        Math.abs(vel.current.x) < 0.04 && Math.abs(vel.current.y) < 0.04;
      if (done) { pos.current={x:0,y:0}; vel.current={x:0,y:0}; apply(0,0); phase.current='idle'; }
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  /* gravity fall, then spring bounce */
  const doFall = () => {
    if (phase.current !== 'idle') return;
    if (raf.current) cancelAnimationFrame(raf.current);
    phase.current = 'fall';
    const tick = () => {
      if (phase.current !== 'fall') return;
      vel.current.y += GRAVITY;
      pos.current.y += vel.current.y;
      apply(pos.current.x, pos.current.y);
      if (pos.current.y >= 0) doSpring();   // hand off to spring when past rest
      else raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    /* initial render */
    requestAnimationFrame(() => apply(pos.current.x, pos.current.y));

    /* trigger fall when IDCard enters viewport */
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(doFall, 150); },
      { threshold: 0.25 }
    );
    if (wrapRef.current) obs.observe(wrapRef.current);

    /* window events */
    const onMove = (e: MouseEvent) => {
      if (phase.current !== 'drag') return;
      const rawX = e.clientX - grab.current.mx;
      const rawY = e.clientY - grab.current.my;
      const tx   = grab.current.cx + rawX * DRAG_SCALE;
      const ty   = grab.current.cy + rawY * DRAG_SCALE;
      vel.current = { x: tx - pos.current.x, y: ty - pos.current.y };
      pos.current = { x: tx, y: ty };
      apply(tx, ty);
    };
    const onUp = () => {
      if (phase.current !== 'drag') return;
      document.body.style.cursor = '';
      // bleed off most throw velocity so release swing is gentle
      vel.current.x *= 0.25;
      vel.current.y *= 0.25;
      doSpring();
    };
    const onTMove = (e: TouchEvent) => {
      if (phase.current !== 'drag') return;
      e.preventDefault();
      const t    = e.touches[0];
      const rawX = t.clientX - grab.current.mx;
      const rawY = t.clientY - grab.current.my;
      const tx   = grab.current.cx + rawX * DRAG_SCALE;
      const ty   = grab.current.cy + rawY * DRAG_SCALE;
      vel.current = { x: tx - pos.current.x, y: ty - pos.current.y };
      pos.current = { x: tx, y: ty };
      apply(tx, ty);
    };
    const onTEnd = () => {
      if (phase.current !== 'drag') return;
      vel.current.x *= 0.25;
      vel.current.y *= 0.25;
      doSpring();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('touchmove', onTMove, { passive:false });
    window.addEventListener('touchend',  onTEnd);
    return () => {
      obs.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('touchmove', onTMove);
      window.removeEventListener('touchend',  onTEnd);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (raf.current) cancelAnimationFrame(raf.current);
    phase.current = 'drag';
    grab.current  = { mx:e.clientX, my:e.clientY, cx:pos.current.x, cy:pos.current.y };
    vel.current   = { x:0, y:0 };
    document.body.style.cursor = 'grabbing';
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const t = e.touches[0];
    phase.current = 'drag';
    grab.current  = { mx:t.clientX, my:t.clientY, cx:pos.current.x, cy:pos.current.y };
    vel.current   = { x:0, y:0 };
  };

  return (
    <div ref={wrapRef}
      className="relative flex flex-col items-center w-full"
      style={{ userSelect:'none', minHeight: L + 520 }}>

      {/* ── Anchor hardware — positioned slightly into About section ── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
           style={{ top: 10 }}>
        {/* mounting plate */}
        <div style={{
          width:56, height:22,
          background:'linear-gradient(180deg,#4b5563,#1f2937)',
          borderRadius:'0 0 14px 14px',
          boxShadow:'0 6px 20px rgba(0,0,0,0.7)',
        }}/>
        {/* bolt */}
        <div style={{
          width:16, height:16, borderRadius:'50%', marginTop:-5, zIndex:1,
          background:'linear-gradient(135deg,#9ca3af,#374151)',
          border:'1.5px solid #4b5563',
          boxShadow:'0 2px 8px rgba(0,0,0,0.7)',
        }}/>
        {/* open hook */}
        <div style={{
          width:16, height:20, marginTop:-4,
          border:'3px solid #6b7280',
          borderTop:'none', borderRadius:'0 0 50% 50%',
          background:'transparent',
        }}/>
      </div>

      {/* ── SVG rope ── */}
      <svg ref={svgRef}
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ width:'100%', height:'100%', zIndex:5 }}>
        <path data-rope="" fill="none" stroke="rgba(0,0,0,0.5)"      strokeWidth="20" strokeLinecap="round"/>
        <path data-rope="" fill="none" stroke="url(#rg)"             strokeWidth="14" strokeLinecap="round"/>
        <path data-rope="" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5"  strokeLinecap="round"/>
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#111827"/>
            <stop offset="35%"  stopColor="#374151"/>
            <stop offset="65%"  stopColor="#374151"/>
            <stop offset="100%" stopColor="#111827"/>
          </linearGradient>
        </defs>
      </svg>

      {/* ── Draggable card ── */}
      <div style={{ marginTop: L + 38, position:'relative', zIndex:10 }}>

        <div
          ref={cardRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{ cursor:'grab', willChange:'transform', touchAction:'none', position:'relative' }}
        >
          {/* metal clip — INSIDE cardRef so it moves + rotates with the card */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center"
               style={{ top: -18 }}>
            <div style={{ width:26, height:16, background:'linear-gradient(180deg,#9ca3af,#6b7280)', borderRadius:'4px 4px 2px 2px', boxShadow:'0 2px 8px rgba(0,0,0,0.6)' }}/>
            <div style={{ width:10, height:10, borderRadius:'50%', marginTop:-4, background:'#374151', border:'2px solid #9ca3af', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.7)' }}/>
          </div>
          {/* ── Card shell ── */}
          <div style={{ width:'clamp(288px,80vw,360px)' }}
            className="rounded-3xl overflow-hidden border border-white/10
                       shadow-[0_40px_100px_rgba(0,0,0,0.85),0_0_80px_rgba(34,211,238,0.07)]">

            <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"/>

            <div className="bg-gradient-to-b from-[#0f1829] via-[#0c1220] to-[#09090f]">
              {/* header */}
              <div className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-[9px] tracking-[0.28em] text-cyan-400/60 uppercase font-semibold">Portfolio</p>
                  <p className="text-[8px] text-gray-600 tracking-widest">Developer ID</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600
                                flex items-center justify-center
                                shadow-[0_0_18px_rgba(34,211,238,0.45)]">
                  <span className="text-white text-xs font-bold">MK</span>
                </div>
              </div>

              {/* big photo — 3:4 portrait */}
              <div className="px-5">
                <div className="w-full rounded-2xl overflow-hidden"
                     style={{ aspectRatio:'3/4',
                       boxShadow:'0 0 35px rgba(34,211,238,0.14),inset 0 0 30px rgba(0,0,0,0.5)',
                       border:'1px solid rgba(255,255,255,0.07)' }}>
                  <img
                    src={profilePic} alt="Madhu Kuruva"
                    className="w-full h-full object-cover object-top pointer-events-none"
                    draggable={false} loading="eager"
                  />
                </div>
              </div>

              {/* name + role */}
              <div className="text-center px-5 pt-4 pb-5">
                <h3 className="text-white font-bold text-xl sm:text-2xl tracking-wide">Madhu Kuruva</h3>
                <p className="mt-1.5 text-sm tracking-[0.2em] uppercase font-semibold
                              bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Full Stack Developer
                </p>
                {/* ── Recruiter-attention badge ── */}
                <div className="flex justify-center mt-3">
                  <div className="relative flex items-center gap-2 px-4 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg,rgba(21,128,61,0.35),rgba(22,163,74,0.2))',
                         border: '1.5px solid rgba(74,222,128,0.6)',
                         boxShadow: '0 0 18px rgba(74,222,128,0.35), inset 0 0 12px rgba(74,222,128,0.08)',
                       }}>
                    {/* pulsing ring */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"/>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"
                            style={{ boxShadow:'0 0 8px rgba(74,222,128,1)' }}/>
                    </span>
                    <span className="text-green-300 font-bold text-xs tracking-widest uppercase">
                      Available for Hire
                    </span>
                  </div>
                </div>

              </div>

              <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500"/>
            </div>
          </div>

          <p className="text-center text-gray-700 text-[10px] tracking-widest mt-4 animate-pulse pointer-events-none select-none">
            ✦ grab &amp; swing ✦
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── About Section ─────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) leftRef.current?.classList.add('ab-in'); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { icon: Code2,   value:'5+',  label:'Projects',    color:'text-cyan-400'   },
    { icon: Palette, value:'10+', label:'Skills',      color:'text-purple-400' },
    { icon: Zap,     value:'1+',  label:'Internships', color:'text-yellow-400' },
  ];

  const education = [
    { year:'2026', title:'BTech in Computer Science',
      institute:'Malla Reddy Engineering College And Management Science', status:'Current' },
    { year:'2023', title:'Diploma – ECE Stream',
      institute:'Anurag Engineering College', status:'Completed' },
    { year:'2020', title:'10th Grade',
      institute:'SR High School', status:'Completed' },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0a0a14] px-4 sm:px-6 relative"
      style={{ paddingTop: 0, paddingBottom:'6rem', overflow:'visible' }}
    >
      {/* background glows */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-[150px]"/>
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full blur-[150px]"/>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">

          {/* ── LEFT: text content ── */}
          <div ref={leftRef} className="space-y-6 about-left pt-20 md:pt-16">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">About Me</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"/>
            </div>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              I'm a final year BTech student passionate about building innovative solutions through
              full-stack development. With a strong foundation in computer science fundamentals,
              I love crafting elegant applications that solve real-world problems.
            </p>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              My journey in tech has taught me the importance of continuous learning and staying
              updated with the latest technologies. I thrive on challenges and am excited to
              bring my skills to impactful projects.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2">
              {stats.map(({ icon:Icon, value, label, color }) => (
                <div key={label}
                  className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl
                             border border-white/10 hover:border-cyan-500/50
                             transition-all duration-300 hover:scale-105">
                  <Icon className={`w-6 sm:w-8 h-6 sm:h-8 ${color} mx-auto mb-2 sm:mb-3`}/>
                  <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Education</h3>
              {education.map((item, i) => (
                <div key={i}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4
                             bg-white/5 backdrop-blur-sm rounded-xl border border-white/10
                             hover:border-cyan-500/50 transition-all duration-300"
                  style={{ transitionDelay:`${i*80}ms` }}>
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14
                                  bg-gradient-to-br from-cyan-500 to-purple-600
                                  rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">{item.year}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base">{item.title}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.institute}</p>
                    <p className="text-cyan-400 text-xs mt-1">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: ID Card (anchor bleeds up into Hero) ── */}
          <div className="flex justify-center" style={{ overflow:'visible' }}>
            <div className="w-full max-w-sm" style={{ overflow:'visible' }}>
              <IDCard />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .about-left {
          opacity: 0;
          transform: translateX(-32px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .about-left.ab-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </section>
  );
}
