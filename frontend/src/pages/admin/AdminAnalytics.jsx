import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp, TrendingDown, RefreshCw, Package } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import api from '../../lib/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PIE_COLORS = ['#1a4a2e','#c8922a','#3d8564','#5ea382','#8ec3a8','#bcdcca'];

function StatCard({ title, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-tea-light text-xs mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-tea-dark">{value}</p>
      {sub && <p className="text-xs text-tea-light mt-1">{sub}</p>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-cream-200 p-3 text-xs">
      <p className="font-semibold text-tea-dark mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name.includes('₹') || p.name.toLowerCase().includes('revenue') || p.name.toLowerCase().includes('return') || p.name.toLowerCase().includes('profit')
            ? `₹${p.value.toLocaleString('en-IN')}`
            : p.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    api.get(`/orders/analytics?year=${year}`).then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [year]);

  const chartData = MONTHS.map((month, i) => {
    const sale = data?.monthlySales?.find(s => s._id === i + 1);
    const ret = data?.returns?.find(r => r._id === i + 1);
    const revenue = sale?.revenue || 0;
    const returns = ret?.amount || 0;
    return {
      month, revenue, orders: sale?.orders || 0,
      returns, profit: revenue - returns,
    };
  });

  const totals = data?.totals || {};
  const totalRevenue = totals.totalRevenue || 0;
  const totalReturns = totals.totalReturns || 0;
  const netProfit = totalRevenue - totalReturns;

  const categoryData = (data?.categoryRevenue || []).map((c, i) => ({
    name: c._id === 'tea' ? 'Tea' : 'Merchandise',
    revenue: c.revenue,
    count: c.count,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const yearOptions = [2024, 2025, 2026];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="skeleton h-72 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl text-primary-800">Analytics</h1>
          <p className="text-tea-light text-sm">Sales performance, returns & profitability</p>
        </div>
        <div className="flex gap-2">
          {yearOptions.map(y => (
            <button key={y} onClick={() => setYear(y)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${year === y ? 'bg-primary-800 text-white' : 'bg-white border border-cream-300 text-tea-dark hover:border-primary-400'}`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} color="bg-primary-700" sub={`${totals.totalOrders || 0} orders`} />
        <StatCard title="Net Profit" value={`₹${netProfit.toLocaleString('en-IN')}`} icon={TrendingUp} color="bg-green-500" sub="After returns" />
        <StatCard title="Total Returns" value={`₹${totalReturns.toLocaleString('en-IN')}`} icon={RefreshCw} color="bg-red-400" sub="Refunded" />
        <StatCard title="Total Orders" value={totals.totalOrders || 0} icon={ShoppingBag} color="bg-gold-500" sub={`${year}`} />
      </div>

      {/* Monthly Revenue, Returns & Profit */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h3 className="font-heading text-lg font-semibold text-primary-800 mb-1">Monthly Breakdown — {year}</h3>
        <p className="text-xs text-tea-light mb-5">Revenue, Returns & Net Profit per month</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {[['rev','#1a4a2e'],['ret','#ef4444'],['prof','#22c55e']].map(([id, color]) => (
                <linearGradient key={id} id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ede4d3" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8b6355' }} />
            <YAxis tick={{ fontSize: 11, fill: '#8b6355' }} tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(1)}k` : `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#1a4a2e" fill="url(#grad-rev)" strokeWidth={2.5} dot={{ fill: '#1a4a2e', r: 3 }} />
            <Area type="monotone" dataKey="returns" name="Returns (₹)" stroke="#ef4444" fill="url(#grad-ret)" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
            <Area type="monotone" dataKey="profit" name="Profit (₹)" stroke="#22c55e" fill="url(#grad-prof)" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} strokeDasharray="5 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders per month bar chart */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-heading text-lg font-semibold text-primary-800 mb-1">Orders per Month</h3>
          <p className="text-xs text-tea-light mb-5">Number of orders placed each month</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede4d3" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8b6355' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8b6355' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill="#1a4a2e" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.orders === Math.max(...chartData.map(d => d.orders)) ? '#c8922a' : '#1a4a2e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue Pie */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="font-heading text-lg font-semibold text-primary-800 mb-1">Revenue by Category</h3>
          <p className="text-xs text-tea-light mb-5">Share of revenue per product category</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="45%" outerRadius={80} dataKey="revenue" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-tea-light text-sm">No sales data yet</div>
          )}
        </div>
      </div>

      {/* Monthly data table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-200">
          <h3 className="font-heading text-lg font-semibold text-primary-800">Monthly Detail — {year}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50">
              <tr>
                {['Month', 'Orders', 'Revenue', 'Returns', 'Net Profit', 'Margin'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-tea-light px-4 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {chartData.map((row) => {
                const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100).toFixed(1) : 0;
                return (
                  <tr key={row.month} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-tea-dark">{row.month}</td>
                    <td className="px-4 py-3 text-sm text-tea-medium">{row.orders}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-700">₹{row.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-red-500">₹{row.returns.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">₹{row.profit.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`badge text-xs ${Number(margin) > 50 ? 'bg-green-100 text-green-700' : Number(margin) > 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-primary-50 font-bold">
                <td className="px-4 py-3 text-sm text-primary-800">TOTAL</td>
                <td className="px-4 py-3 text-sm text-primary-800">{totals.totalOrders || 0}</td>
                <td className="px-4 py-3 text-sm text-primary-800">₹{totalRevenue.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-red-600">₹{totalReturns.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-green-700">₹{netProfit.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="badge bg-primary-100 text-primary-700 text-xs">
                    {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
