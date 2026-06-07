import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Image, Megaphone,
  BarChart3, Menu, X, LogOut, ChevronRight, Settings, Store
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/banners', label: 'Banners', icon: Megaphone },
  { to: '/admin/media', label: 'Site Images', icon: Image },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">T</span>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-white">Twistea</p>
            <p className="text-primary-300 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-primary-700 text-white shadow-tea' : 'text-primary-200 hover:bg-primary-800 hover:text-white'}`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-primary-700 space-y-2">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-primary-300 hover:text-white hover:bg-primary-800 text-sm transition-all">
          <Store size={16} /> View Store
        </NavLink>
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-primary-400 text-xs truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="text-primary-400 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-cream-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary-950 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-primary-950 z-50 md:hidden flex flex-col animate-slide-down">
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)} className="text-primary-300 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <Sidebar mobile />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-cream-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button className="md:hidden p-2 rounded-xl hover:bg-cream-100 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="text-sm text-tea-light hidden md:block">Welcome back, <span className="text-primary-700 font-semibold">{user.name}</span></div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="badge bg-gold-100 text-gold-700 text-xs">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
