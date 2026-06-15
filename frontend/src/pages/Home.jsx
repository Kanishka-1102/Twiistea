import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Phone, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

/* ── Scroll-reveal wrapper ── */
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
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   1. HERO
   ════════════════════════════════════════ */
function Hero() {
  const navigate = useNavigate();
  return (
    /*
      Section is the positioning context.
      paddingBottom = white space below the card where leaves sit.
      Leaves are a SIBLING of the card — outside overflow:hidden — so they
      overlap the card bottom without being clipped by it.
    */
    <section style={{
      background: '#ffffff',
      position: 'relative',
      paddingBottom: 'clamp(60px, 10vw, 130px)',
    }}>

      {/* ── "SIP PURE. FEEL NATURE." heading ── */}
      <div style={{
        padding: 'clamp(40px, 5.5vw, 72px) clamp(16px, 3.33vw, 48px)',
      }}>
        <h1 style={{
          fontFamily: "'Outfit', 'Inter', Arial, sans-serif",
          fontSize: 'clamp(2rem, 8.02vw, 7.22rem)',
          fontWeight: 700,
          color: '#3AB449',
          lineHeight: 1,
          letterSpacing: '0',
          textTransform: 'uppercase',
          margin: 0,
          whiteSpace: 'nowrap',
        }}>
          SIP PURE. FEEL NATURE.
        </h1>
      </div>

      {/* ── Hero card ── clips only its own background image ── */}
      <div style={{
        margin: '0 clamp(16px, 3.33vw, 48px)',
        height: 'clamp(400px, 54vw, 660px)',
        borderRadius: 'clamp(16px, 2vw, 28px)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Background image — sunny top, golden sky */}
        <img
          src="/images/hero section.png"
          alt="TwisTea tea garden"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />

        {/* Gradient — dark left, clear right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(3,12,5,0.78) 0%, rgba(3,12,5,0.55) 38%, rgba(3,12,5,0.20) 65%, rgba(3,12,5,0.00) 88%)',
        }} />

        {/* ── Text — top-left, Figma: X:48 Y:262, gap:24 ── */}
        <div style={{
          position: 'absolute',
          top: 'clamp(32px, 4.5vw, 64px)',
          left: 'clamp(24px, 3.33vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: 'clamp(240px, 42%, 520px)',
          zIndex: 3,
        }}>
          <h2 style={{
            fontFamily: "'Outfit', 'Inter', Arial, sans-serif",
            fontSize: 'clamp(1.6rem, 4vw, 3.6rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.06,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            TwisTea<br />Organic Tea
          </h2>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(12px, 1.1vw, 15px)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: '1.72',
            margin: 0,
            maxWidth: '360px',
          }}>
            Discover The Essence Of Wellness In Every Sip —Naturally
            Brewed From The Finest Organic Leaves.
          </p>

          <button
            onClick={() => navigate('/products')}
            className="transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{
              background: '#3AB449',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: 'clamp(10px, 1.1vw, 13px) clamp(20px, 2vw, 28px)',
              fontFamily: "'Outfit', Inter, sans-serif",
              fontSize: 'clamp(11px, 0.9vw, 13px)',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              width: 'fit-content',
              border: 'none',
              cursor: 'pointer',
            }}>
            SHOP NOW
          </button>
        </div>

        {/* ── Product stack — bottom-right, Figma: 160×336, gap:16 ── */}
        <div style={{
          position: 'absolute',
          right: 'clamp(12px, 2.5vw, 36px)',
          bottom: 'clamp(12px, 2.5vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px, 1.1vw, 16px)',
          width: 'clamp(80px, 11.1vw, 160px)',
          zIndex: 3,
        }}>
          {[
            '/images/product2-removebg-preview.png',
            '/images/product1-removebg-preview.png',
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="TwisTea product"
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.30))',
              }}
            />
          ))}
        </div>

      </div>

      {/*
        ── Tea leaves ──
        Sibling of card → NOT clipped by card's overflow:hidden.
        position: absolute relative to section.
        bottom: 0 = base of the paddingBottom white space.
        Height > paddingBottom so leaves reach up INTO the card visually.
      */}
      <img
        src="/images/teapng.parspng.com-7 2.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 'clamp(40px, 5vw, 80px)',
          height: 'clamp(180px, 30vw, 390px)',
          width: 'auto',
          objectFit: 'contain',
          zIndex: 10,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.22))',
        }}
      />

    </section>
  );
}

/* ════════════════════════════════════════
   2. MARQUEE
   ════════════════════════════════════════ */
function Marquee() {
  const items = Array(8).fill('SIP PURE. FEEL NATURE.');
  return (
    <div className="overflow-hidden" style={{
      background: '#ffffff',
      borderTop: '1px solid #efefef',
      borderBottom: '1px solid #efefef',
      padding: 'clamp(14px, 2vw, 26px) 0',
    }}>
      <div className="flex marquee-inner whitespace-nowrap select-none">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center"
            style={{
              fontFamily: "'Outfit', 'Inter', Arial, sans-serif",
              fontSize: 'clamp(1.4rem, 3.2vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              padding: '0 clamp(20px, 3vw, 48px)',
              color: i % 2 === 0 ? '#3AB449' : 'transparent',
              WebkitTextStroke: i % 2 === 0 ? 'none' : '2px #3AB449',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   3. OUR FAVORITES THIS SEASON
   ════════════════════════════════════════ */
function FavoritesThisSeason() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=8')
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sampleProducts = [
    { img: '/images/product1.png', name: 'Elaichi Tea', price: '₹149', tag: 'Bestseller' },
    { img: '/images/product2.png', name: 'Premium Tea', price: '₹199', tag: 'New' },
    { img: '/images/product1.png', name: 'Masala Chai', price: '₹169', tag: 'Popular' },
    { img: '/images/product2.png', name: 'Green Tea',   price: '₹179', tag: 'Organic' },
  ];

  return (
    <section style={{ background: '#FFFFFF', padding: '90px 0' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        <FadeIn>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '3px',
                color: '#1B4332',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>Our Collection</p>
              <h2 style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                fontWeight: 700,
                color: '#1a1a1a',
                letterSpacing: '0.05em',
              }}>OUR FAVORITES THIS SEASON</h2>
            </div>
            <Link to="/products"
              className="inline-flex items-center gap-2 group"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1B4332',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}>
              View All <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton rounded-xl" style={{ height: 340 }} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <FadeIn key={p._id} delay={i * 0.05}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        ) : (
          /* Fallback sample cards when backend is offline */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sampleProducts.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.07}>
                <div className="rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ border: '1px solid #EDEAE3' }}>
                  <div className="relative overflow-hidden" style={{ background: '#F4F9F5', aspectRatio: '1 / 1' }}>
                    <img src={p.img} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white"
                      style={{
                        background: '#1B4332',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                      }}>{p.tag}</span>
                  </div>
                  <div className="p-4">
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#1a1a1a',
                      marginBottom: '4px',
                    }}>{p.name}</p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      color: '#1B4332',
                      fontWeight: 700,
                      marginBottom: '12px',
                    }}>{p.price}</p>
                    <button className="w-full py-2.5 rounded-lg font-semibold transition-all active:scale-95 hover:brightness-90"
                      style={{
                        background: '#1B4332',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        letterSpacing: '0.5px',
                      }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   4. PROMO BANNER — Pure Comfort, Every Sip
   ════════════════════════════════════════ */
function PromoBanner() {
  const navigate = useNavigate();
  return (
    <section style={{ background: '#F5F0DC', padding: '90px 0' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <FadeIn>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: '#1B4332',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}>Featured Blend</p>

            <h2 style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.12,
              letterSpacing: '0.02em',
              marginBottom: '20px',
            }}>
              Pure Comfort,<br />Every Sip.
            </h2>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: '#555',
              lineHeight: '1.85',
              marginBottom: '32px',
              maxWidth: '440px',
            }}>
              From our signature Elaichi Tea to the bold Premium blend —
              every TwisTea pouch is packed with natural flavour, rich aroma,
              and the warmth of Indian tradition. Strong, refreshing, and
              completely natural.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 transition-all duration-200 hover:brightness-90 active:scale-95"
              style={{
                background: '#1B4332',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '14px 28px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
              }}>
              Shop Now <ArrowRight size={15} />
            </button>
          </FadeIn>

          {/* Right — product image */}
          <FadeIn delay={0.15} className="flex justify-center lg:justify-end">
            <img
              src="/images/productframepng.png"
              alt="TwisTea Elaichi and Premium Tea"
              className="w-full object-contain"
              style={{
                maxWidth: '420px',
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.14))',
              }}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   5. ROOTED IN WELLNESS
   ════════════════════════════════════════ */
function WellnessSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden" style={{ padding: '100px 0' }}>
      {/* Background — tea estate */}
      <img
        src="/images/Frame 8453.png"
        alt="Tea estate"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(4,22,11,0.92) 0%, rgba(4,22,11,0.80) 50%, rgba(4,22,11,0.45) 100%)',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <FadeIn>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: '#D4A853',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}>Our Tea Blends</p>

            <h2 style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.08,
              letterSpacing: '0.04em',
              marginBottom: '24px',
            }}>
              ROOTED IN<br />WELLNESS
            </h2>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.68)',
              lineHeight: '1.88',
              marginBottom: '16px',
              maxWidth: '480px',
            }}>
              At TwisTea, every blend is crafted with purpose. We source our teas
              directly from small family-owned gardens across Darjeeling, Assam,
              and the Nilgiris — where tradition and nature work hand in hand.
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.68)',
              lineHeight: '1.88',
              marginBottom: '40px',
              maxWidth: '480px',
            }}>
              No artificial flavours. No shortcuts. Just pure, honest tea that
              nourishes the body and calms the mind — one cup at a time.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10 flex-wrap">
              {[['40+', 'Tea Gardens'], ['10K+', 'Customers'], ['100%', 'Natural']].map(([n, l]) => (
                <div key={l}>
                  <p style={{
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontSize: '2rem',
                    color: '#D4A853',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}>{n}</p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}>{l}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '13px 26px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.32)',
              }}>
              Our Story <ArrowRight size={15} />
            </button>
          </FadeIn>

          {/* Right — stacked product images */}
          <FadeIn delay={0.18} className="flex flex-col items-center lg:items-end gap-2">
            <img
              src="/images/product1.png"
              alt="TwisTea Elaichi Tea"
              className="object-contain"
              style={{
                width: 'clamp(200px, 30vw, 280px)',
                filter: 'drop-shadow(0 20px 36px rgba(0,0,0,0.5))',
              }}
            />
            <img
              src="/images/product2.png"
              alt="TwisTea Premium Tea"
              className="object-contain"
              style={{
                width: 'clamp(200px, 30vw, 280px)',
                marginTop: '-28px',
                filter: 'drop-shadow(0 20px 36px rgba(0,0,0,0.5))',
              }}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   6. CONTACT SECTION
   ════════════════════════════════════════ */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false);
    toast.success("Message sent! We'll get back to you shortly.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="relative overflow-hidden" style={{ padding: '100px 0' }}>
      {/* Background */}
      <img
        src="/images/hero section.png"
        alt="Tea garden"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(4,22,11,0.82)' }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — contact info */}
          <FadeIn>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: '#D4A853',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>Get in Touch</p>

            <h2 style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '16px',
            }}>Contact Us</h2>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: '1.85',
              marginBottom: '44px',
              maxWidth: '360px',
            }}>
              Have a question about our teas or want to know more?
              We'd love to hear from you.
            </p>

            <div className="space-y-6">
              {[
                { Icon: MapPin, text: '42, Tea Garden Road, Darjeeling,\nWest Bengal 734101' },
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@twistea.in' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: 'rgba(212,168,83,0.1)',
                      border: '1px solid rgba(212,168,83,0.22)',
                    }}>
                    <Icon size={15} style={{ color: '#D4A853' }} />
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: '1.7',
                    paddingTop: '10px',
                    whiteSpace: 'pre-line',
                  }}>{text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right — form */}
          <FadeIn delay={0.15}>
            <form onSubmit={handleSubmit}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
              <div className="space-y-4">

                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '8px',
                  }}>Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '8px',
                  }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.5px',
                    display: 'block',
                    marginBottom: '8px',
                  }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Your message..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all duration-200 hover:brightness-90 active:scale-95 disabled:opacity-60"
                  style={{
                    background: '#1B4332',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  }}>
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>

              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   PAGE SHELL
   ════════════════════════════════════════ */
export default function Home() {
  return (
    <div>
      <Hero />
      <Marquee />
      <FavoritesThisSeason />
      <PromoBanner />
      <WellnessSection />
      <ContactSection />
    </div>
  );
}
