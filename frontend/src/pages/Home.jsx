import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Leaf, Truck, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

/* ─── Simple fade-in on scroll ─── */
function FadeIn({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Hero ─── */
function Hero({ config }) {
  const navigate = useNavigate();
  const heroImage = config?.hero_image?.url;

  return (
    <section className="relative bg-[#F5F1EA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] items-center gap-12">

          {/* Left — Text */}
          <div className="py-24 lg:py-0 order-2 lg:order-1">
            <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-5">
              New Season · Spring 2024
            </p>
            <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
              India's Finest
              <br />
              <em className="text-[#1B4332] not-italic">Artisan Teas</em>
              <br />
              Delivered to
              <br />
              Your Door.
            </h1>
            <p className="text-[#555] text-lg leading-relaxed mb-10 max-w-md font-light">
              Hand-picked from Darjeeling, Assam & Nilgiris — crafted for every Indian household.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/products?category=tea')}
                className="btn-primary px-8 py-3.5 text-sm">
                Shop Teas <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/products?category=merchandise')}
                className="btn-outline px-8 py-3.5 text-sm">
                Gift Sets
              </button>
            </div>

            {/* Trust row */}
            <div className="flex gap-6 mt-12 flex-wrap">
              {['100% Organic', 'Farm Direct', '10K+ Happy Customers'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-[#777]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative order-1 lg:order-2 h-[55vw] lg:h-full max-h-[720px] min-h-[320px]">
            {heroImage ? (
              <img src={heroImage} alt="Twistea hero"
                className="w-full h-full object-cover" />
            ) : (
              /* Placeholder when no image set yet */
              <div className="w-full h-full flex items-center justify-center bg-[#E8E0D4] text-center p-8">
                <div>
                  <p className="text-7xl mb-4">🫖</p>
                  <p className="text-[#999] text-sm">Upload your hero image from Admin → Site Images</p>
                </div>
              </div>
            )}
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-lg">🍃</div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">First Flush is here</p>
                <p className="text-xs text-[#999]">Darjeeling Spring 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Marquee ─── */
function Marquee() {
  const items = ['Darjeeling First Flush', 'Assam Gold', 'Masala Chai', 'Kashmiri Kahwa', 'Himalayan Green', 'Tulsi Ginger', 'Oolong Reserve', 'Nilgiri Mist', 'Rose Black Tea', 'Mint Refresh'];
  return (
    <div className="bg-[#1B4332] py-3 overflow-hidden border-y border-[#155227]">
      <div className="flex marquee-inner whitespace-nowrap select-none">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-5 text-white/70 text-xs font-medium tracking-wider">
            <span className="text-[#B5821F]">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Category Section ─── */
function Categories({ config }) {
  const teaImg = config?.category_tea_image?.url;
  const mercImg = config?.category_merch_image?.url;

  return (
    <section className="section-pad bg-white">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-3">Collections</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a]">Shop by Category</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Tea Collection', sub: '50+ premium varieties', href: '/products?category=tea', img: teaImg, bg: '#E8F0EB', emoji: '🍃' },
            { label: 'Merchandise', sub: 'Mugs, gift sets & more', href: '/products?category=merchandise', img: mercImg, bg: '#F5EDD8', emoji: '🎁' },
          ].map(({ label, sub, href, img, bg, emoji }, i) => (
            <FadeIn key={label} delay={i * 0.1}>
              <Link to={href}
                className="group relative rounded-2xl overflow-hidden flex items-end"
                style={{ height: 360, background: bg }}>
                {img
                  ? <img src={img} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : <div className="absolute inset-0 flex items-center justify-center"><span style={{ fontSize: 100 }} className="opacity-20">{emoji}</span></div>
                }
                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="relative p-8 w-full">
                  <p className="text-white/70 text-xs font-medium tracking-wider mb-1">{sub}</p>
                  <h3 className="text-white text-2xl font-bold mb-4">{label}</h3>
                  <span className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] text-xs font-semibold px-5 py-2.5 rounded-full group-hover:bg-[#B5821F] group-hover:text-white transition-colors duration-200">
                    Explore <ArrowRight size={13} />
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

/* ─── Promo Banners ─── */
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
    <div className="container-pad pb-8">
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 220 }}>
        <img src={b.image.url} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${b.backgroundColor}e0 0%, transparent 65%)` }} />
        <div className="absolute inset-0 flex items-center px-10">
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: b.textColor }}>{b.title}</h3>
            {b.subtitle && <p className="text-sm mb-4 opacity-80" style={{ color: b.textColor }}>{b.subtitle}</p>}
            {b.link && b.ctaText && (
              <a href={b.link} className="btn-primary btn-sm inline-flex text-xs">{b.ctaText} <ArrowRight size={13} /></a>
            )}
          </div>
        </div>
        {list.length > 1 && (
          <>
            <button onClick={() => setCur(c => (c - 1 + list.length) % list.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><ChevronLeft size={15} /></button>
            <button onClick={() => setCur(c => (c + 1) % list.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"><ChevronRight size={15} /></button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Featured Products ─── */
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-pad bg-[#FAFAF7]">
      <div className="container-pad">
        <FadeIn>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-2">Bestsellers</p>
              <h2 className="text-4xl font-bold text-[#1a1a1a]">Our Most Loved Teas</h2>
            </div>
            <Link to="/products" className="btn-outline btn-sm text-xs inline-flex">View All <ArrowRight size={13} /></Link>
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-xl" style={{ height: 340 }} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <FadeIn key={p._id} delay={i * 0.05}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Why Us ─── */
function WhyUs() {
  const items = [
    { icon: Leaf, title: 'Farm Direct', desc: 'Sourced from 40+ family-run gardens in Darjeeling, Assam & Nilgiris.' },
    { icon: ShieldCheck, title: '100% Organic', desc: 'No pesticides, no chemicals. Certified organic across all our blends.' },
    { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on orders above ₹500. Pan-India in 3–5 business days.' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns. Not happy? We\'ll make it right.' },
  ];
  return (
    <section className="section-pad bg-white border-y border-[#F0E8DC]">
      <div className="container-pad">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.08} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF4F0] flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-[#1B4332]" />
              </div>
              <h4 className="font-semibold text-[#1a1a1a] text-sm mb-2">{title}</h4>
              <p className="text-[#777] text-xs leading-relaxed">{desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Story strip ─── */
function StoryStrip({ config }) {
  const img = config?.about_hero_image?.url;
  return (
    <section className="section-pad bg-[#F5F1EA]">
      <div className="container-pad">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E8E0D4]">
              {img
                ? <img src={img} alt="Our story" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-7xl">🫖</div>
              }
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-4">Our Story</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight mb-5">
              Rooted in Indian Tea Tradition
            </h2>
            <p className="text-[#555] leading-relaxed mb-5 text-[15px]">
              Twistea started in 2020 as a small family stall in Kolkata, sharing our grandmother's masala chai recipe. Today we work directly with over 40 small-scale, organic tea gardens across India.
            </p>
            <p className="text-[#555] leading-relaxed mb-8 text-[15px]">
              Every blend is curated with care — no middlemen, no compromises, just the pure soul of Indian tea in your cup.
            </p>
            <div className="flex gap-10 mb-8">
              {[['40+', 'Tea Gardens'], ['10K+', 'Customers'], ['15+', 'Awards']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-3xl font-bold text-[#1B4332]">{n}</p>
                  <p className="text-[#999] text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-outline inline-flex">Read Our Story <ArrowRight size={15} /></Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const reviews = [
    { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: 'The Darjeeling First Flush is absolutely divine. Nothing I\'ve tried compares to this freshness and quality.' },
    { name: 'Arjun Mehta', city: 'Bangalore', rating: 5, text: 'The Masala Chai blend is exactly like my dadi used to make. Perfectly spiced. Genuinely impressed.' },
    { name: 'Kavitha Nair', city: 'Chennai', rating: 5, text: 'Ordered the gift set for Diwali — my parents were overjoyed. Beautiful packaging, exceptional tea.' },
    { name: 'Rohit Gupta', city: 'Delhi', rating: 5, text: 'Delivered in 2 days, quality is exceptional. Assam Gold is my new morning ritual. 10/10.' },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(c => (c + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="section-pad bg-white">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-3">Reviews</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a]">What Our Customers Say</h2>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#FAFAF7] border border-[#F0E8DC] rounded-2xl p-10 text-center" style={{ minHeight: 220 }}>
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(reviews[idx].rating)].map((_, i) => <Star key={i} size={16} className="text-[#B5821F] fill-[#B5821F]" />)}
            </div>
            <p className="text-[#333] text-lg leading-relaxed mb-7 italic font-['Playfair_Display']">
              "{reviews[idx].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center text-white font-bold text-sm">
                {reviews[idx].name[0]}
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1a1a1a] text-sm">{reviews[idx].name}</p>
                <p className="text-[#999] text-xs">{reviews[idx].city}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-[#1B4332] w-8' : 'bg-[#D5C9BB] w-2'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#1B4332]">
      <div className="container-pad py-20 text-center">
        <FadeIn>
          <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-4">Start Brewing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Find Your Perfect Cup</h2>
          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto font-light">
            Over 50 varieties — from bold breakfast teas to delicate single-origin flushes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/products')} className="bg-white text-[#1B4332] px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#F5F1EA] transition-colors inline-flex items-center gap-2">
              Shop All Teas <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/products?category=merchandise')}
              className="border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              Gift Sets
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default function Home() {
  const [config, setConfig] = useState({});
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    api.get('/upload/site-config').then(r => setConfig(r.data)).catch(() => {});
    api.get('/banners').then(r => setBanners(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ background: '#ffffff' }}>
      <Hero config={config} />
      <Marquee />
      <Categories config={config} />
      <WhyUs />
      <PromoBanners banners={banners} />
      <FeaturedProducts />
      <StoryStrip config={config} />
      <Testimonials />
      <CTA />
    </div>
  );
}
