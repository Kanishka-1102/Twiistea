import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin } = useAuthStore();
  const { itemCount, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); setSearchOpen(false); }, [location]);

  if (isAdminRoute) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Tea Collection', to: '/products?category=tea' },
    { label: 'Merchandise', to: '/products?category=merchandise' },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}
        style={{ borderBottom: '1px solid #F0EBE3' }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/images/logo-twistea.png" alt="TwisTea" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`text-sm font-medium transition-colors duration-150 ${location.pathname + location.search === link.to ? 'text-[#1B4332]' : 'text-[#555] hover:text-[#1a1a1a]'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button onClick={() => setSearchOpen(s => !s)}
                className="p-2 text-[#555] hover:text-[#1a1a1a] hover:bg-[#F5F1EA] rounded-lg transition-colors">
                <Search size={18} />
              </button>

              {/* Cart */}
              <button onClick={toggleCart}
                className="relative p-2 text-[#555] hover:text-[#1a1a1a] hover:bg-[#F5F1EA] rounded-lg transition-colors">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1B4332] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {user ? (
                <div className="relative ml-1">
                  <button onClick={() => setUserMenu(s => !s)}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#F5F1EA] transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={12} className={`text-[#999] transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#F0EBE3] overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-[#F5F1EA]">
                        <p className="text-sm font-semibold text-[#1a1a1a] truncate">{user.name}</p>
                        <p className="text-xs text-[#999] truncate">{user.email}</p>
                      </div>
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#444] hover:bg-[#FAFAF7] transition-colors">
                        <User size={14} /> My Account
                      </Link>
                      <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#444] hover:bg-[#FAFAF7] transition-colors">
                        <ShoppingBag size={14} /> My Orders
                      </Link>
                      {isAdmin() && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1B4332] font-medium hover:bg-[#EEF4F0] transition-colors">
                          <LayoutDashboard size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-[#F5F1EA]">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block btn-primary btn-sm ml-2 text-xs px-5 py-2">
                  Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button className="md:hidden p-2 text-[#555] hover:bg-[#F5F1EA] rounded-lg transition-colors ml-1"
                onClick={() => setMobileOpen(s => !s)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-3 animate-[fadeIn_0.15s_ease]">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search teas, merchandise..."
                  autoFocus
                  className="w-full px-4 py-2.5 pr-10 text-sm border border-[#E5DDD0] rounded-lg bg-[#FAFAF7] text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1B4332]"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1B4332]">
                  <Search size={16} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#F0EBE3] bg-white">
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className="block py-3 text-sm text-[#444] font-medium border-b border-[#F5F1EA] last:border-0 hover:text-[#1B4332] transition-colors">
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link to="/login" className="btn-primary block text-center w-full mt-3 py-3">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay */}
      {(userMenu || mobileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserMenu(false); setMobileOpen(false); }} />
      )}
    </>
  );
}
