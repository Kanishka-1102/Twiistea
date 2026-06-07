import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { User, Package, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const statusColors = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-600',
};

function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl text-[#1a1a1a] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>My Profile</h2>
      <form onSubmit={handleSave} className="space-y-5 max-w-md">
        <div>
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Full Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Email</label>
          <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Phone</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 98765 43210" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
    </div>
  );

  return (
    <div>
      <h2 className="font-bold text-2xl text-[#1a1a1a] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-[#E5DDD0] mb-3" />
          <p className="text-[#999] mb-4 text-sm">No orders yet</p>
          <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#F0EBE3]">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-bold text-[#1B4332] text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-[#999] mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                {order.items.slice(0, 4).map((item, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F1EA] flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🍵</div>
                    }
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-12 h-12 rounded-lg bg-[#F0EBE3] flex items-center justify-center text-xs text-[#999] flex-shrink-0">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#1a1a1a]">₹{order.pricing?.total?.toLocaleString('en-IN')}</p>
                <p className="text-xs text-[#999]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { to: '/account', label: 'Profile', icon: User, exact: true },
  { to: '/account/orders', label: 'My Orders', icon: Package },
];

export default function Account() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return <Navigate to="/login?redirect=/account" replace />;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="bg-[#F5F1EA] py-6 px-4 border-b border-[#F0EBE3]">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-bold text-2xl text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>My Account</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 text-center border border-[#F0EBE3]">
              <div className="w-16 h-16 bg-[#1B4332] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-[#1a1a1a] text-sm">{user.name}</p>
              <p className="text-xs text-[#999] mt-0.5">{user.email}</p>
            </div>
            <nav className="bg-white rounded-2xl overflow-hidden border border-[#F0EBE3]">
              {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === to : location.pathname.startsWith(to);
                return (
                  <Link key={to} to={to}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium border-b border-[#F5F1EA] last:border-0 transition-colors ${active ? 'bg-[#F0F7F3] text-[#1B4332]' : 'text-[#555] hover:bg-[#FAFAF7]'}`}>
                    <span className="flex items-center gap-2.5"><Icon size={15} />{label}</span>
                    <ChevronRight size={14} className="text-[#ddd]" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-[#F0EBE3]">
            <Routes>
              <Route index element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
