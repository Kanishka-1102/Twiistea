import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, IndianRupee, ArrowUpRight, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../lib/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_COLORS = {
  placed: '#3b82f6', confirmed: '#6366f1', processing: '#f59e0b',
  shipped: '#f97316', out_for_delivery: '#8b5cf6', delivered: '#22c55e',
  cancelled: '#ef4444', returned: '#6b7280',
};

function StatCard({ title, value, icon: Icon, color, sub, link }) {
  return (
    <Link to={link || '#'} className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-tea transition-shadow block">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={22} className="text-white" />
        </div>
        <ArrowUpRight size={16} className="text-tea-light" />
      </div>
      <p className="text-tea-light text-sm mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-tea-dark">{value}</p>
      {sub && <p className="text-xs text-tea-light mt-1">{sub}</p>}
    </Link>
  );
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/analytics'),
      api.get('/orders?limit=5'),
    ]).then(([a, o]) => {
      setAnalytics(a.data);
      setRecentOrders(o.data.orders);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = MONTHS.map((month, i) => {
    const sale = analytics?.monthlySales?.find(s => s._id === i + 1);
    const ret = analytics?.returns?.find(r => r._id === i + 1);
    return { month, revenue: sale?.revenue || 0, orders: sale?.orders || 0, returns: ret?.amount || 0 };
  });

  const statusData = analytics?.statusBreakdown?.map(s => ({
    name: s._id.replace(/_/g, ' '),
    value: s.count,
    color: STATUS_COLORS[s._id] || '#6b7280',
  })) || [];

  const totals = analytics?.totals || {};

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
      <div className="skeleton h-72 rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-primary-800">Dashboard</h1>
        <p className="text-tea-light text-sm">Overview of your Twistea store</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${(totals.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={IndianRupee} color="bg-primary-700" sub="All time" link="/admin/analytics" />
        <StatCard title="Total Orders" value={totals.totalOrders || 0}
          icon={ShoppingBag} color="bg-gold-500" sub="All time" link="/admin/orders" />
        <StatCard title="Total Returns" value={`₹${(totals.totalReturns || 0).toLocaleString('en-IN')}`}
          icon={AlertCircle} color="bg-red-400" sub="Refunded" link="/admin/orders?status=returned" />
        <StatCard title="Net Profit" value={`₹${((totals.totalRevenue || 0) - (totals.totalReturns || 0)).toLocaleString('en-IN')}`}
          icon={TrendingUp} color="bg-green-500" sub="Revenue - Returns" link="/admin/analytics" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold text-primary-800 mb-1">Monthly Revenue vs Returns</h3>
          <p className="text-tea-light text-xs mb-5">{new Date().getFullYear()}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a4a2e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a4a2e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede4d3" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b6355' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8b6355' }} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} />
              <Tooltip formatter={(v, n) => [`₹${v.toLocaleString('en-IN')}`, n]} contentStyle={{ borderRadius: '12px', border: '1px solid #ede4d3', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1a4a2e" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: '#1a4a2e', r: 3 }} />
              <Area type="monotone" dataKey="returns" name="Returns" stroke="#ef4444" fill="url(#retGrad)" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold text-primary-800 mb-5">Order Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-tea-light text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h3 className="font-heading text-lg font-semibold text-primary-800">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-primary-700 hover:underline font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50">
              <tr>
                {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-tea-light px-4 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-tea-light text-sm">No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order._id}`} className="text-primary-700 font-medium text-sm hover:underline">{order.orderNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-tea-dark">{order.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-tea-medium">{order.items?.length}</td>
                  <td className="px-4 py-3 text-sm font-medium">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="badge text-xs capitalize" style={{ background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-tea-light">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
