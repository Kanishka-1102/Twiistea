import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, X, Menu, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const GREEN = '#3AB449';

function isActive(link, pathname) {
  if (link.to === '/') return pathname === '/';
  if (link.to === '/products') return pathname.startsWith('/products');
  return pathname === link.to;
}

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/products' },
  { label: 'Contact Us', to: '/#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin } = useAuthStore();
  const { itemCount, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className="relative z-50 bg-white"
        style={{ borderBottom: `1.5px solid ${GREEN}` }}
      >
        {/* ── Main bar ── */}
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-[100px]" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: '1fr auto 1fr', height: 'clamp(64px, 8vw, 100px)' }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 justify-self-start">
              <img
                src="/images/cuplogo.png"
                alt="TwisTea logo"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
              <span
                className="text-lg sm:text-xl font-bold"
                style={{ fontFamily: "'Georgia', serif", color: '#1a1a1a', letterSpacing: '0.01em' }}
              >
                Twis<span style={{ color: GREEN }}>Tea</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map(link => {
                const active = isActive(link, location.pathname);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-semibold uppercase transition-colors duration-150 whitespace-nowrap"
                    style={{ color: active ? GREEN : '#444', letterSpacing: '0.06em' }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = GREEN; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#444'; }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2 justify-self-end">

              {/* Search */}
              <button
                onClick={() => setSearchOpen(s => !s)}
                className="p-2 rounded-lg transition-colors duration-150"
                style={{ color: '#555' }}
                onMouseEnter={e => e.currentTarget.style.color = GREEN}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
              >
                <Search size={19} />
              </button>

              {/* User — desktop only */}
              <div className="hidden md:block relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenu(s => !s)}
                      className="flex items-center gap-1 p-2 rounded-lg transition-colors duration-150"
                      style={{ color: '#555' }}
                      onMouseEnter={e => e.currentTarget.style.color = GREEN}
                      onMouseLeave={e => e.currentTarget.style.color = '#555'}
                    >
                      <User size={19} />
                      <ChevronDown size={12} className={`transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-[#1a1a1a] truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#444] hover:bg-gray-50 transition-colors">
                          <User size={14} /> My Account
                        </Link>
                        <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#444] hover:bg-gray-50 transition-colors">
                          <ShoppingBag size={14} /> My Orders
                        </Link>
                        {isAdmin() && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-green-50 transition-colors" style={{ color: GREEN }}>
                            <LayoutDashboard size={14} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="p-2 rounded-lg transition-colors duration-150"
                    style={{ color: '#555' }}
                    onMouseEnter={e => e.currentTarget.style.color = GREEN}
                    onMouseLeave={e => e.currentTarget.style.color = '#555'}
                  >
                    <User size={19} />
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-lg transition-colors duration-150"
                style={{ color: '#555' }}
                onMouseEnter={e => e.currentTarget.style.color = GREEN}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
              >
                <ShoppingBag size={19} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: GREEN }}
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger — mobile only */}
              <button
                className="md:hidden p-2 rounded-lg transition-colors duration-150"
                style={{ color: mobileOpen ? GREEN : '#555' }}
                onClick={() => setMobileOpen(s => !s)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-3">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search teas, merchandise..."
                  autoFocus
                  className="w-full px-4 py-2.5 pr-10 text-sm border rounded-lg bg-gray-50 text-[#1a1a1a] placeholder-gray-300 focus:outline-none"
                  style={{ borderColor: GREEN }}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: GREEN }}>
                  <Search size={16} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Mobile slide-down menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ borderTop: mobileOpen ? '1px solid #f0f0f0' : 'none' }}
        >
          <div className="bg-white px-5 pt-4 pb-6 space-y-1">
            {navLinks.map(link => {
              const active = isActive(link, location.pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center py-3.5 text-sm font-semibold uppercase border-b border-gray-100 last:border-0 transition-colors"
                  style={{ color: active ? GREEN : '#333', letterSpacing: '0.06em' }}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full mr-2.5 flex-shrink-0" style={{ background: GREEN }} />}
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: GREEN }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a]">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/account" className="flex items-center gap-2.5 py-3 text-sm text-[#444] border-b border-gray-100">
                    <User size={15} /> My Account
                  </Link>
                  <Link to="/account/orders" className="flex items-center gap-2.5 py-3 text-sm text-[#444] border-b border-gray-100">
                    <ShoppingBag size={15} /> My Orders
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="flex items-center gap-2.5 py-3 text-sm font-medium border-b border-gray-100" style={{ color: GREEN }}>
                      <LayoutDashboard size={15} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="flex items-center gap-2.5 py-3 text-sm text-red-500 w-full">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full py-3 mt-2 text-sm font-semibold text-white rounded-xl"
                  style={{ background: GREEN }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for desktop user dropdown */}
      {userMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
      )}
    </>
  );
}
