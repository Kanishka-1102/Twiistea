import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <img
                src="/images/logo1.png"
                alt="TwisTea"
                style={{ height: '56px', width: 'auto', objectFit: 'contain', borderRadius: '8px', display: 'block' }}
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              India's finest artisan teas, sourced from 40+ family-run gardens. Delivered fresh to your door.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'Instagram', d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
                { label: 'Facebook', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { label: 'YouTube', d: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM10 15.5v-7l6 3.5-6 3.5z' },
              ].map(({ label, d }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center hover:bg-[#1B4332] hover:border-[#1B4332] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase mb-5">Quick Links</h5>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Tea Collection', to: '/products?category=tea' },
                { label: 'Merchandise', to: '/products?category=merchandise' },
                { label: 'About Us', to: '/about' },
                { label: 'My Orders', to: '/account/orders' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-white/45 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Teas */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase mb-5">Our Teas</h5>
            <ul className="space-y-3">
              {['Darjeeling First Flush', 'Assam Gold CTC', 'Masala Chai Blend', 'Kashmiri Kahwa', 'Himalayan Green', 'Tulsi Ginger'].map(item => (
                <li key={item}>
                  <Link to={`/products?category=tea&search=${item}`}
                    className="text-white/45 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase mb-5">Contact</h5>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2.5">
                <MapPin size={14} className="text-[#B5821F] flex-shrink-0 mt-0.5" />
                <span className="text-white/45 text-sm">Darjeeling, West Bengal</span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={14} className="text-[#B5821F] flex-shrink-0" />
                <a href="tel:+919876543210" className="text-white/45 hover:text-white text-sm transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={14} className="text-[#B5821F] flex-shrink-0" />
                <a href="mailto:hello@twistea.in" className="text-white/45 hover:text-white text-sm transition-colors">hello@twistea.in</a>
              </li>
            </ul>

            <p className="text-white/45 text-xs mb-2.5">Subscribe for exclusive offers</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-white/6 border border-white/10 text-white text-xs placeholder-white/25 focus:outline-none focus:border-[#1B4332]" />
              <button className="w-9 h-9 rounded-lg bg-[#1B4332] flex items-center justify-center flex-shrink-0 hover:bg-[#155227] transition-colors">
                <ArrowRight size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/8">
          <p className="text-white/25 text-xs">© 2024 Twistea. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Shipping'].map(label => (
              <a key={label} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
