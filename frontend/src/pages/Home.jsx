import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Leaf, Truck, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';
import heroTeaFallback from '../assets/hero-tea.jpg';

const cinzel = { fontFamily: 'Cinzel, Georgia, serif' };
const cg     = { fontFamily: 'Cormorant Garamond, Georgia, serif' };

/* ─────────────────────────────────────────
   DECORATIVE SVG COMPONENTS
   ───────────────────────────────────────── */

/* Tall botanical tea-branch illustration */
function BotanicalBranch({ className = '', style: s = {}, size = 140 }) {
  return (
    <svg className={className} style={s}
      width={size} height={Math.round(size * 2.6)}
      viewBox="0 0 100 260" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 255 C49 210 48 155 52 95 C54 64 57 32 53 4"
        stroke="currentColor" fill="none" strokeWidth="0.9" strokeLinecap="round"/>
      <path d="M50 235 C35 224 18 203 26 184 C32 168 50 178 50 235Z"/>
      <line x1="50" y1="235" x2="26" y2="184" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M51 208 C67 196 83 175 75 156 C68 140 52 151 51 208Z"/>
      <line x1="51" y1="208" x2="75" y2="156" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M49 178 C34 166 17 143 26 124 C33 108 49 119 49 178Z"/>
      <line x1="49" y1="178" x2="26" y2="124" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M52 150 C68 137 85 114 76 95 C69 79 52 91 52 150Z"/>
      <line x1="52" y1="150" x2="76" y2="95" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M50 118 C34 105 17 80 27 62 C35 47 50 59 50 118Z"/>
      <line x1="50" y1="118" x2="27" y2="62" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M52 90 C69 76 87 51 77 33 C69 18 52 31 52 90Z"/>
      <line x1="52" y1="90" x2="77" y2="33" stroke="rgba(0,0,0,0.18)" strokeWidth="0.5"/>
      <path d="M50 56 C34 43 18 18 29 4 C37 -7 51 5 50 56Z"/>
      <ellipse cx="53" cy="7" rx="4" ry="6"/>
    </svg>
  );
}

/* Small decorative sprig for corners */
function Sprig({ className = '', style: s = {} }) {
  return (
    <svg className={className} style={s} width="44" height="80"
      viewBox="0 0 44 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 78 C21 63 20 47 23 28 C24 18 25 8 23 1"
        stroke="currentColor" fill="none" strokeWidth="0.7" strokeLinecap="round"/>
      <path d="M22 66 C13 58 4 45 10 35 C15 27 22 33 22 66Z"/>
      <path d="M23 48 C32 40 41 27 35 17 C30 9 23 16 23 48Z"/>
      <path d="M21 32 C12 24 4 11 11 2 C17 -5 22 4 21 32Z"/>
      <ellipse cx="23" cy="3" rx="3" ry="4"/>
    </svg>
  );
}

/* Ornamental ring — CTA centrepiece */
function OrnamentalRing({ className = '', style: s = {}, size = 380 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const pts = Array.from({ length: 8 }, (_, i) => ({
    x: cx + r * Math.cos((i * 45) * Math.PI / 180),
    y: cy + r * Math.sin((i * 45) * Math.PI / 180),
  }));
  return (
    <svg className={className} style={s}
      width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx={cx} cy={cy} r={r}      fill="none" stroke="currentColor" strokeWidth="0.7"/>
      <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke="currentColor" strokeWidth="0.4"/>
      <circle cx={cx} cy={cy} r={r - 24} fill="none" stroke="currentColor" strokeWidth="0.2"/>
      {pts.map((p, i) => (
        <rect key={i} x={p.x - 3.5} y={p.y - 3.5} width={7} height={7}
          transform={`rotate(45 ${p.x} ${p.y})`} />
      ))}
      <line x1={8}   y1={cy} x2={size-8} y2={cy}   stroke="currentColor" strokeWidth="0.3" opacity="0.55"/>
      <line x1={cx}  y1={8}  x2={cx}     y2={size-8} stroke="currentColor" strokeWidth="0.3" opacity="0.55"/>
      <line x1={cx-r*0.7} y1={cy-r*0.7} x2={cx+r*0.7} y2={cy+r*0.7} stroke="currentColor" strokeWidth="0.2" opacity="0.3"/>
      <line x1={cx+r*0.7} y1={cy-r*0.7} x2={cx-r*0.7} y2={cy+r*0.7} stroke="currentColor" strokeWidth="0.2" opacity="0.3"/>
    </svg>
  );
}

/* Wavy underline */
function WavyUnderline({ color = '#D4A853', className = '' }) {
  return (
    <svg className={className} style={{ height: 9 }}
      viewBox="0 0 300 9" preserveAspectRatio="none" fill="none">
      <path d="M0 4.5 Q37.5 0.5,75 4.5 T150 4.5 T225 4.5 T300 4.5"
        stroke={color} strokeWidth="1.3" opacity="0.6"/>
    </svg>
  );
}

/* FadeIn on scroll */
function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}>
      {children}
    </div>
  );
}

/* Animated count-up */
function CountUp({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        const num = parseInt(to, 10);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 1600, 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * num));
          if (p < 1) requestAnimationFrame(tick); else setVal(num);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.6 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* Magnetic button */
function MagneticBtn({ children, onClick, className, style: sp }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const b = ref.current; if (!b) return;
    const r = b.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.18;
    const y = (e.clientY - r.top  - r.height / 2) * 0.18;
    b.style.transition = 'transform 0.1s ease';
    b.style.transform  = `translate(${x}px,${y}px)`;
  }, []);
  const onLeave = useCallback(() => {
    const b = ref.current; if (!b) return;
    b.style.transition = 'transform 0.5s ease';
    b.style.transform  = 'translate(0,0)';
  }, []);
  return (
    <button ref={ref} onClick={onClick} className={className} style={sp}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </button>
  );
}

/* Floating tea-leaf particles */
function FloatingParticles() {
  const leaves = [
    { left: '6%',  delay: '0s',    dur: '6.2s' },
    { left: '16%', delay: '1.5s',  dur: '5.1s' },
    { left: '27%', delay: '0.7s',  dur: '7s'   },
    { left: '40%', delay: '2.3s',  dur: '5.6s' },
    { left: '53%', delay: '0.9s',  dur: '6.5s' },
    { left: '66%', delay: '1.9s',  dur: '5.2s' },
    { left: '78%', delay: '0.4s',  dur: '6.8s' },
    { left: '90%', delay: '2.8s',  dur: '5.9s' },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {leaves.map((l, i) => (
        <div key={i} className="absolute bottom-8 leaf-particle"
          style={{ left: l.left, '--delay': l.delay, '--dur': l.dur }}>
          <svg width="12" height="17" viewBox="0 0 12 17" fill="none">
            <path d="M6 1 C9 3,11 7,9 12 C7 17,6 17,4 13 C1 8,2 3,5 1.5 C5.7 1,6 1,6 1Z"
              fill="rgba(212,168,83,0.14)" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5"/>
            <line x1="6" y1="1" x2="6" y2="16" stroke="rgba(212,168,83,0.18)" strokeWidth="0.4"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════ */
function Hero({ config }) {
  const navigate = useNavigate();
  const heroImage = config?.hero_image?.url;

  return (
    <section className="relative overflow-hidden diagonal-texture"
      style={{ background: '#0A1A0F', minHeight: '100svh' }}>

      {/* Dot matrix */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(212,168,83,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          zIndex: 0,
        }}/>

      {/* Corner vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(18,50,30,0.4) 0%,transparent 50%)', zIndex: 0 }}/>

      {/* ── BACKGROUND ELEMENTS ── */}

      {/* Large "TWISTEA" watermark */}
      <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden select-none"
        style={{ zIndex: 1 }}>
        <span style={{
          ...cinzel,
          fontSize: 'clamp(5rem, 17vw, 14rem)',
          fontWeight: 700,
          color: 'rgba(212,168,83,0.028)',
          letterSpacing: '0.22em',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          marginLeft: '-0.1em',
        }}>
          TWISTEA
        </span>
      </div>

      {/* Botanical branch — top-left, peeking behind text */}
      <div className="absolute top-0 left-0 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(212,168,83,0.09)', zIndex: 1, transform: 'translateX(-30%) translateY(-5%)' }}>
        <BotanicalBranch size={180}/>
      </div>

      {/* Botanical branch — bottom-left, smaller */}
      <div className="absolute bottom-0 left-8 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(212,168,83,0.07)', zIndex: 1, transform: 'rotate(10deg) translateY(20%)' }}>
        <BotanicalBranch size={100}/>
      </div>

      {/* Soft gold radial glow — centre-left */}
      <div className="absolute pointer-events-none hidden lg:block"
        style={{
          width: '40vw', height: '40vw',
          top: '50%', left: '10%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)',
          zIndex: 1,
        }}/>

      {/* Floating leaves */}
      <FloatingParticles/>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] items-center"
          style={{ minHeight: '100svh' }}>

          {/* Text column */}
          <div className="relative flex flex-col items-center text-center justify-center
            py-20 pb-8 lg:py-28 order-2 lg:order-1 lg:pr-12">

            {/* Gold corner brackets */}
            <div className="absolute -top-2 -left-2 hidden lg:block">
              <svg width="24" height="24" fill="none">
                <path d="M0 24 L0 0 L24 0" stroke="rgba(212,168,83,0.25)" strokeWidth="1"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 hidden lg:block">
              <svg width="24" height="24" fill="none">
                <path d="M24 0 L24 24 L0 24" stroke="rgba(212,168,83,0.25)" strokeWidth="1"/>
              </svg>
            </div>

            {/* Seasonal tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-9"
              style={{
                border: '1px solid rgba(212,168,83,0.3)',
                color: '#D4A853',
                background: 'rgba(212,168,83,0.06)',
                borderRadius: '3px',
                ...cinzel, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
              }}>
              Spring 2024 Harvest
            </div>

            {/* Heading */}
            <div className="mb-9 w-full">
              <h1 className="leading-[1.08] text-[#EDE5D0] mb-1"
                style={{ ...cinzel, fontSize: 'clamp(1.65rem, 3.5vw, 2.7rem)', fontWeight: 400, letterSpacing: '0.1em' }}>
                India's Finest
              </h1>
              <div className="relative inline-block mb-1">
                <h1 className="font-semibold italic leading-[1.08] shimmer-gold"
                  style={{ ...cg, fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}>
                  Artisan Teas
                </h1>
                <WavyUnderline className="absolute left-0 bottom-[-6px] w-full"/>
              </div>
              <h1 className="leading-[1.08] text-[#EDE5D0] mt-1"
                style={{ ...cinzel, fontSize: 'clamp(1.65rem, 3.5vw, 2.7rem)', fontWeight: 400, letterSpacing: '0.1em' }}>
                Delivered to Your Door.
              </h1>
            </div>

            <p className="mb-10 text-[#7EA08A]"
              style={{ fontSize: '14.5px', lineHeight: '1.85', maxWidth: '19rem' }}>
              Grown on hillsides. Harvested by hand.
              <br/>Shipped straight from the garden to you.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <MagneticBtn
                onClick={() => navigate('/products?category=tea')}
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold active:scale-95"
                style={{ background: '#D4A853', color: '#0A1A0F', borderRadius: '5px', ...cinzel, fontSize: '11px', letterSpacing: '1.5px' }}>
                Shop Teas <ArrowRight size={13}/>
              </MagneticBtn>
              <MagneticBtn
                onClick={() => navigate('/products?category=merchandise')}
                className="inline-flex items-center gap-2 px-7 py-3.5 font-medium active:scale-95"
                style={{ border: '1px solid rgba(212,168,83,0.32)', color: '#D4A853', borderRadius: '5px', ...cinzel, fontSize: '11px', letterSpacing: '1.5px' }}>
                Gift Sets
              </MagneticBtn>
            </div>

            <div className="flex items-center gap-4 mt-10 flex-wrap justify-center">
              {['100% Organic', 'Farm Direct', '10K+ Customers'].map((t, i, a) => (
                <div key={t} className="flex items-center gap-4">
                  <span style={{ fontSize: '11px', color: '#4A7558' }}>{t}</span>
                  {i < a.length - 1 && <span className="w-px h-3 bg-[#1E3D28]"/>}
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="relative order-1 lg:order-2 overflow-hidden"
            style={{ height: 'clamp(260px, 58vw, 100svh)' }}>
            <div className="absolute -right-4 sm:-right-6 lg:right-0 inset-y-0 left-0">
              <img src={heroImage || heroTeaFallback} alt="Twistea artisan tea"
                className="w-full h-full object-cover object-center lg:rounded-tl-[44px] lg:rounded-bl-[44px]"/>
            </div>

            {/* Floating badge with steam */}
            <div className="absolute bottom-6 left-4 sm:left-6 px-4 py-3 flex items-center gap-3 z-10"
              style={{
                background: 'rgba(7,20,11,0.88)', borderRadius: '12px',
                border: '1px solid rgba(212,168,83,0.2)', backdropFilter: 'blur(14px)',
              }}>
              <div className="relative">
                <svg className="absolute -top-5 left-0.5" width="22" height="20" viewBox="0 0 22 20" fill="none">
                  <path className="steam-a" d="M4 18 Q3 12 5 7 Q7 3 4 0" stroke="rgba(212,168,83,0.45)" strokeWidth="1.3" strokeLinecap="round"/>
                  <path className="steam-b" d="M11 18 Q10 12 12 7 Q14 3 11 0" stroke="rgba(212,168,83,0.3)" strokeWidth="1" strokeLinecap="round"/>
                  <path className="steam-c" d="M18 18 Q17 12 19 7 Q21 3 18 0" stroke="rgba(212,168,83,0.2)" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,168,83,0.12)' }}>🍃</div>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#EDE5D0' }}>First Flush is here</p>
                <p style={{ fontSize: '11px', color: '#7A9A82' }}>Darjeeling Spring 2024</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   MARQUEE
   ══════════════════════════════════════════════════ */
function Marquee() {
  const items = ['Darjeeling First Flush','Assam Gold','Masala Chai','Kashmiri Kahwa',
    'Himalayan Green','Tulsi Ginger','Oolong Reserve','Nilgiri Mist','Rose Black Tea','Mint Refresh'];
  return (
    <div className="py-3.5 overflow-hidden"
      style={{
        background: '#0C2114',
        borderTop: '1px solid rgba(212,168,83,0.1)',
        borderBottom: '1px solid rgba(212,168,83,0.1)',
      }}>
      <div className="flex marquee-inner whitespace-nowrap select-none">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-7"
            style={{ color: 'rgba(237,229,208,0.42)', ...cinzel, fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            <span className="w-1 h-1 rounded-full shrink-0" style={{ background: 'rgba(212,168,83,0.5)' }}/>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CATEGORIES
   ══════════════════════════════════════════════════ */
function Categories({ config }) {
  const teaImg  = config?.category_tea_image?.url;
  const mercImg = config?.category_merch_image?.url;

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#FAF8F3' }}>
      {/* Background botanical sprig — top right */}
      <div className="absolute top-8 right-8 pointer-events-none"
        style={{ color: 'rgba(27,67,50,0.07)', transform: 'rotate(12deg)' }}>
        <BotanicalBranch size={80}/>
      </div>
      {/* Background botanical sprig — bottom left */}
      <div className="absolute bottom-8 left-6 pointer-events-none"
        style={{ color: 'rgba(27,67,50,0.06)', transform: 'rotate(-8deg) scaleX(-1)' }}>
        <BotanicalBranch size={60}/>
      </div>

      <div className="container-pad relative" style={{ zIndex: 1 }}>
        <FadeIn>
          <div className="text-center mb-12">
            <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: '#1B4332', textTransform: 'uppercase', marginBottom: '10px' }}>
              Collections
            </p>
            <h2 className="font-semibold text-[#0A1A0F]" style={{ ...cg, fontSize: 'clamp(2rem,4vw,3rem)' }}>
              What We Offer
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Tea Collection',  sub: '50+ premium varieties',    href: '/products?category=tea',           img: teaImg,  bg: '#1A3D28', emoji: '🍃' },
            { label: 'Merchandise',     sub: 'Mugs, gift sets and more', href: '/products?category=merchandise',   img: mercImg, bg: '#2C1908', emoji: '🎁' },
          ].map(({ label, sub, href, img, bg, emoji }, i) => (
            <FadeIn key={label} delay={i * 0.12}>
              <Link to={href} className="group relative overflow-hidden flex items-end"
                style={{ height: 380, background: bg, borderRadius: '18px', display: 'flex' }}>
                {img
                  ? <img src={img} alt={label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>
                  : <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ fontSize: 100, opacity: 0.07 }}>{emoji}</span>
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent transition-all duration-500 group-hover:from-black/82"/>
                <div className="absolute inset-0 rounded-[18px] border border-transparent group-hover:border-[#D4A853]/35 transition-all duration-500"/>
                <div className="relative p-8 w-full transform group-hover:-translate-y-1.5 transition-transform duration-400">
                  <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3px', color: 'rgba(212,168,83,0.75)', marginBottom: '6px', textTransform: 'uppercase' }}>{sub}</p>
                  <h3 className="text-white font-semibold mb-4" style={{ ...cg, fontSize: '1.55rem' }}>{label}</h3>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 transition-all duration-300 bg-[#D4A853] text-[#0A1A0F] group-hover:bg-[#E8C878] group-hover:gap-3"
                    style={{ borderRadius: '4px', ...cinzel, fontSize: '10px', letterSpacing: '1px' }}>
                    Explore <ArrowRight size={11}/>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   WHY US
   ══════════════════════════════════════════════════ */
function WhyUs() {
  const items = [
    { num: '01', icon: Leaf,        title: 'Farm Direct',   desc: 'Sourced from 40+ family-run gardens in Darjeeling, Assam and Nilgiris.' },
    { num: '02', icon: ShieldCheck, title: 'Fully Organic', desc: 'No pesticides, no shortcuts. Certified organic across every single blend.' },
    { num: '03', icon: Truck,       title: 'Free Delivery', desc: 'Free on orders above ₹500. Delivered pan-India in 3 to 5 business days.' },
    { num: '04', icon: RotateCcw,   title: 'Easy Returns',  desc: '7 days, no questions asked. If something is off, we make it right.' },
  ];
  return (
    <section className="relative overflow-hidden diagonal-texture" style={{ background: '#0C2114' }}>
      {/* Background botanical — far right */}
      <div className="absolute top-0 right-0 pointer-events-none hidden md:block"
        style={{ color: 'rgba(212,168,83,0.07)', transform: 'rotate(-10deg) translateX(30%) translateY(-10%)' }}>
        <BotanicalBranch size={220}/>
      </div>

      <div className="container-pad pt-14 pb-3 relative" style={{ zIndex: 1 }}>
        <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(212,168,83,0.45)', textTransform: 'uppercase' }}>
          Why Twistea
        </p>
      </div>
      <div className="container-pad pb-14 relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {items.map(({ num, icon: Icon, title, desc }, i) => (
            <FadeIn key={num} delay={i * 0.08}>
              <div className="relative flex gap-5 py-8 px-3 group cursor-default overflow-hidden"
                style={{
                  borderBottom: '1px solid rgba(212,168,83,0.07)',
                  borderRight: i % 2 === 0 ? '1px solid rgba(212,168,83,0.07)' : 'none',
                }}>
                {/* Giant bg number watermark per cell */}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none select-none"
                  style={{ ...cinzel, fontSize: '6.5rem', fontWeight: 700, color: 'rgba(212,168,83,0.055)', lineHeight: 1 }}>
                  {num}
                </span>
                <span className="shrink-0 leading-none mt-1 transition-colors duration-300 group-hover:opacity-60"
                  style={{ ...cinzel, fontSize: '1.9rem', fontWeight: 400, color: 'rgba(212,168,83,0.18)', lineHeight: 1 }}>
                  {num}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={14} style={{ color: '#D4A853', opacity: 0.7 }}/>
                    <h4 className="font-semibold text-[#EDE5D0]" style={{ ...cg, fontSize: '1.05rem' }}>{title}</h4>
                  </div>
                  <p style={{ color: '#5E8A6A', fontSize: '13.5px', lineHeight: '1.65' }}>{desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   PROMO BANNERS
   ══════════════════════════════════════════════════ */
function PromoBanners({ banners }) {
  const [cur, setCur] = useState(0);
  const list = banners.filter(b => b.position === 'hero');
  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setCur(c => (c + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);
  if (!list.length) return null;
  const b = list[cur];
  return (
    <div className="container-pad py-8" style={{ background: '#FAF8F3' }}>
      <div className="relative overflow-hidden" style={{ height: 220, borderRadius: '16px' }}>
        <img src={b.image.url} alt={b.title} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg,${b.backgroundColor}e0 0%,transparent 65%)` }}/>
        <div className="absolute inset-0 flex items-center px-10">
          <div>
            <h3 className="text-2xl font-semibold mb-2" style={{ ...cg, color: b.textColor }}>{b.title}</h3>
            {b.subtitle && <p className="text-sm mb-4 opacity-80" style={{ color: b.textColor }}>{b.subtitle}</p>}
            {b.link && b.ctaText && (
              <a href={b.link} className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold"
                style={{ background: '#D4A853', color: '#0A1A0F', borderRadius: '4px' }}>
                {b.ctaText} <ArrowRight size={12}/>
              </a>
            )}
          </div>
        </div>
        {list.length > 1 && (
          <>
            <button onClick={() => setCur(c => (c-1+list.length)%list.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
              <ChevronLeft size={15}/>
            </button>
            <button onClick={() => setCur(c => (c+1)%list.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
              <ChevronRight size={15}/>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FEATURED PRODUCTS
   ══════════════════════════════════════════════════ */
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="section-pad" style={{ background: '#FAF8F3' }}>
      <div className="container-pad">
        <FadeIn>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: '#1B4332', textTransform: 'uppercase', marginBottom: '8px' }}>Bestsellers</p>
              <h2 className="font-semibold text-[#0A1A0F]" style={{ ...cg, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)' }}>
                The ones they keep reordering.
              </h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 transition-all duration-200 hover:opacity-60 shrink-0 group"
              style={{ color: '#1B4332', fontSize: '12px', ...cinzel, letterSpacing: '1px' }}>
              View all <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/>
            </Link>
          </div>
        </FadeIn>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => <div key={i} className="skeleton rounded-xl" style={{ height:340 }}/>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p,i) => (
              <FadeIn key={p._id} delay={i*0.05}><ProductCard product={p}/></FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   STORY STRIP
   ══════════════════════════════════════════════════ */
function StoryStrip({ config }) {
  const img = config?.about_hero_image?.url;
  return (
    <section className="section-pad relative overflow-hidden diagonal-texture" style={{ background: '#0C2114' }}>

      {/* Large botanical — top right background */}
      <div className="absolute top-0 right-0 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(212,168,83,0.08)', transform: 'rotate(5deg) translateX(20%) translateY(-5%)' }}>
        <BotanicalBranch size={260}/>
      </div>

      {/* "MMXX" Roman watermark — bottom */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none"
        style={{ ...cinzel, fontSize: 'clamp(4rem,12vw,10rem)', fontWeight: 700, color: 'rgba(212,168,83,0.03)', lineHeight: 1, letterSpacing: '0.15em' }}>
        MMXX
      </div>

      <div className="container-pad relative" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="overflow-hidden" style={{ background: '#1A3D28', borderRadius: '18px', aspectRatio: '4/3' }}>
              {img
                ? <img src={img} alt="Our story" className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-7xl">🫖</div>
              }
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(212,168,83,0.6)', textTransform: 'uppercase', marginBottom: '14px' }}>
              Our Story
            </p>
            <h2 className="font-semibold text-[#EDE5D0] leading-tight mb-4"
              style={{ ...cg, fontSize: 'clamp(2rem,3.8vw,3rem)' }}>
              Rooted in Indian<br/>
              <em className="shimmer-gold">Tea Tradition</em>
            </h2>
            <div className="mb-6">
              <WavyUnderline color="#D4A853" className="w-36 opacity-40"/>
            </div>
            <p style={{ color: '#7EA08A', lineHeight: '1.75', fontSize: '15px', marginBottom: '14px' }}>
              Twistea started in 2020 as a small family stall in Kolkata, sharing our grandmother's masala chai recipe. Today we work directly with over 40 small-scale, organic tea gardens across India.
            </p>
            <p style={{ color: '#7EA08A', lineHeight: '1.75', fontSize: '15px', marginBottom: '36px' }}>
              Every blend is curated with care. No middlemen. No compromises. Just the pure soul of Indian tea in your cup.
            </p>
            <div className="flex gap-10 mb-8">
              {[['40','+',' Tea Gardens'],['10000','+',' Customers'],['15','+',' Awards']].map(([n,suf,l]) => (
                <div key={l}>
                  <p className="font-semibold" style={{ ...cg, fontSize: '2.2rem', color: '#D4A853', lineHeight: 1 }}>
                    <CountUp to={n}/>{suf}
                  </p>
                  <p style={{ color: '#4E7458', fontSize: '11px', marginTop: '4px' }}>{l.trim()}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 transition-all duration-200 hover:opacity-60 group"
              style={{ color: '#D4A853', fontSize: '12px', ...cinzel, letterSpacing: '1px' }}>
              Read our story <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform"/>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   TESTIMONIALS
   ══════════════════════════════════════════════════ */
function Testimonials() {
  const reviews = [
    { name: 'Priya Sharma',  city: 'Mumbai',    rating: 5, text: "The Darjeeling First Flush is absolutely divine. Nothing I've tried compares to this freshness and quality." },
    { name: 'Arjun Mehta',   city: 'Bangalore', rating: 5, text: "The Masala Chai blend is exactly like my dadi used to make. Perfectly spiced. Genuinely impressed." },
    { name: 'Kavitha Nair',  city: 'Chennai',   rating: 5, text: 'Ordered the gift set for Diwali. My parents were overjoyed. Beautiful packaging, exceptional tea.' },
    { name: 'Rohit Gupta',   city: 'Delhi',     rating: 5, text: 'Delivered in 2 days, quality is exceptional. Assam Gold is my new morning ritual. 10/10.' },
  ];
  const onTiltMove = (e) => {
    const c = e.currentTarget, r = c.getBoundingClientRect();
    const x = (e.clientX - r.left  - r.width  / 2) / r.width;
    const y = (e.clientY - r.top   - r.height / 2) / r.height;
    c.style.transform  = `perspective(700px) rotateX(${y*-4}deg) rotateY(${x*4}deg) translateZ(4px)`;
    c.style.transition = 'transform 0.12s ease';
  };
  const onTiltLeave = (e) => {
    e.currentTarget.style.transform  = 'perspective(700px) rotateX(0) rotateY(0) translateZ(0)';
    e.currentTarget.style.transition = 'transform 0.5s ease';
  };

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#FAF8F3' }}>
      {/* Large decorative quote mark — background */}
      <div className="absolute top-4 left-4 pointer-events-none select-none leading-none"
        style={{ ...cg, fontSize: 'clamp(8rem,20vw,18rem)', fontWeight: 700, color: 'rgba(27,67,50,0.06)', lineHeight: 1 }}>
        "
      </div>
      {/* Sprig — top right */}
      <div className="absolute top-10 right-8 pointer-events-none"
        style={{ color: 'rgba(27,67,50,0.09)', transform: 'rotate(15deg)' }}>
        <Sprig/>
      </div>
      {/* Sprig — bottom left */}
      <div className="absolute bottom-10 left-6 pointer-events-none"
        style={{ color: 'rgba(27,67,50,0.07)', transform: 'rotate(-20deg) scaleX(-1)' }}>
        <Sprig/>
      </div>

      <div className="container-pad relative" style={{ zIndex: 1 }}>
        <FadeIn>
          <div className="mb-10">
            <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: '#1B4332', textTransform: 'uppercase', marginBottom: '8px' }}>Reviews</p>
            <h2 className="font-semibold text-[#0A1A0F]" style={{ ...cg, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)' }}>
              10,000+ happy cups brewed.
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r,i) => (
            <FadeIn key={r.name} delay={i*0.09}>
              <div className="tilt-card p-6 h-full cursor-default"
                style={{ background: '#FFFFFF', border: '1px solid #E8E0D2', borderRadius: '14px' }}
                onMouseMove={onTiltMove} onMouseLeave={onTiltLeave}>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} size={13} style={{ color:'#D4A853', fill:'#D4A853' }}/>)}
                </div>
                <p className="italic mb-5" style={{ ...cg, fontSize: '1.05rem', color: '#2C2C2C', lineHeight: '1.65' }}>
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid #F0E8DC' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: '#1B4332', ...cinzel }}>{r.name[0]}</div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a] text-xs" style={cinzel}>{r.name}</p>
                    <p style={{ fontSize: '10px', color: '#AAA' }}>{r.city}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   CTA
   ══════════════════════════════════════════════════ */
function CTA() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden diagonal-texture"
      style={{ background: '#0A1A0F', borderTop: '1px solid rgba(212,168,83,0.07)' }}>

      {/* Ornamental ring — centred behind text */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'rgba(212,168,83,0.07)' }}>
        <OrnamentalRing size={400}/>
      </div>

      {/* Botanical branches flanking — desktop */}
      <div className="absolute top-0 left-0 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(212,168,83,0.08)', transform: 'rotate(-8deg) translateX(-35%) translateY(-10%)' }}>
        <BotanicalBranch size={200}/>
      </div>
      <div className="absolute top-0 right-0 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(212,168,83,0.08)', transform: 'rotate(8deg) scaleX(-1) translateX(-35%) translateY(-10%)' }}>
        <BotanicalBranch size={200}/>
      </div>

      {/* "TWISTEA" background watermark */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none overflow-hidden">
        <span style={{
          ...cinzel, fontSize: 'clamp(4rem,14vw,12rem)', fontWeight: 700,
          color: 'rgba(212,168,83,0.025)', letterSpacing: '0.2em', whiteSpace: 'nowrap', lineHeight: 1,
        }}>
          TWISTEA
        </span>
      </div>

      <div className="container-pad py-24 text-center relative" style={{ zIndex: 1 }}>
        <FadeIn>
          <p style={{ ...cinzel, fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(212,168,83,0.55)', textTransform: 'uppercase', marginBottom: '18px' }}>
            Start Brewing
          </p>
          <h2 className="font-semibold text-[#EDE5D0] mb-3" style={{ ...cg, fontSize: 'clamp(2rem,4.2vw,3.2rem)' }}>
            Your next favourite cup<br/>is waiting.
          </h2>
          <div className="flex justify-center mb-9">
            <WavyUnderline color="#D4A853" className="w-44 opacity-40"/>
          </div>
          <p style={{ color: '#7EA08A', fontSize: '15px', maxWidth: '380px', margin: '0 auto 36px', lineHeight: '1.7' }}>
            Over 50 varieties. From bold Assam mornings to delicate Darjeeling evenings.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <MagneticBtn onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold active:scale-95"
              style={{ background: '#D4A853', color: '#0A1A0F', borderRadius: '5px', ...cinzel, fontSize: '11px', letterSpacing: '1.5px' }}>
              Shop All Teas <ArrowRight size={14}/>
            </MagneticBtn>
            <MagneticBtn onClick={() => navigate('/products?category=merchandise')}
              className="inline-flex items-center gap-2 px-8 py-3.5 font-medium active:scale-95"
              style={{ border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', borderRadius: '5px', ...cinzel, fontSize: '11px', letterSpacing: '1.5px' }}>
              Gift Sets
            </MagneticBtn>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   PAGE SHELL
   ══════════════════════════════════════════════════ */
export default function Home() {
  const [config,  setConfig]  = useState({});
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    api.get('/upload/site-config').then(r => setConfig(r.data)).catch(() => {});
    api.get('/banners').then(r => setBanners(r.data)).catch(() => {});
  }, []);
  return (
    <div>
      <Hero config={config}/>
      <Marquee/>
      <Categories config={config}/>
      <WhyUs/>
      <PromoBanners banners={banners}/>
      <FeaturedProducts/>
      <StoryStrip config={config}/>
      <Testimonials/>
      <CTA/>
    </div>
  );
}
