import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Eye, ChevronDown, Truck, Package, Check, X, RotateCcw, ArrowLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','returned'];
const STATUS_COLORS = {
  placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-yellow-100 text-yellow-700', shipped: 'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700', returned: 'bg-gray-100 text-gray-600',
};

function OrderDetail({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', note: '', trackingNumber: '', carrier: '' });
  const [returnForm, setReturnForm] = useState({ reason: '', refundAmount: '' });
  const [showReturn, setShowReturn] = useState(false);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then(r => {
      setOrder(r.data);
      setStatusForm(f => ({ ...f, status: r.data.status }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [orderId]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, {
        status: statusForm.status, note: statusForm.note,
        tracking: statusForm.trackingNumber ? { trackingNumber: statusForm.trackingNumber, carrier: statusForm.carrier } : undefined,
      });
      setOrder(data);
      toast.success('Order status updated!');
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(false); }
  };

  const processReturn = async () => {
    if (!returnForm.refundAmount) return toast.error('Enter refund amount');
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${orderId}/return`, { reason: returnForm.reason, refundAmount: Number(returnForm.refundAmount) });
      setOrder(data);
      setShowReturn(false);
      toast.success('Return processed!');
    } catch { toast.error('Failed to process return'); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="skeleton h-96 rounded-2xl" />;
  if (!order) return <div className="text-center py-16 text-tea-light">Order not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-cream-100 transition-colors"><ArrowLeft size={20} /></button>
        <div>
          <h2 className="font-display text-2xl text-primary-800">{order.orderNumber}</h2>
          <p className="text-tea-light text-sm">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <span className={`ml-auto badge capitalize ${STATUS_COLORS[order.status]}`}>{order.status?.replace(/_/g, ' ')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-lg font-semibold text-primary-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-cream-100 last:border-0">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-cream-100" />
                  <div className="flex-1">
                    <p className="font-medium text-tea-dark text-sm">{item.name}</p>
                    <p className="text-tea-light text-xs">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-bold text-primary-700">₹{item.total?.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-cream-200 space-y-1 text-sm">
              <div className="flex justify-between text-tea-medium"><span>Subtotal</span><span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-tea-medium"><span>Shipping</span><span>₹{order.pricing?.shipping}</span></div>
              <div className="flex justify-between text-tea-medium"><span>GST</span><span>₹{order.pricing?.tax}</span></div>
              <div className="flex justify-between font-bold text-tea-dark text-base pt-1 border-t border-cream-200">
                <span>Total</span><span className="price-tag">₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-lg font-semibold text-primary-800 mb-4">Update Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-tea-light mb-1 block">New Status</label>
                <select value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))} className="input-field text-sm">
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-tea-light mb-1 block">Note (optional)</label>
                <input value={statusForm.note} onChange={e => setStatusForm(f => ({ ...f, note: e.target.value }))} className="input-field text-sm" placeholder="Add a note" />
              </div>
              {statusForm.status === 'shipped' && (
                <>
                  <div>
                    <label className="text-xs text-tea-light mb-1 block">Carrier</label>
                    <input value={statusForm.carrier} onChange={e => setStatusForm(f => ({ ...f, carrier: e.target.value }))} className="input-field text-sm" placeholder="BlueDart, Delhivery..." />
                  </div>
                  <div>
                    <label className="text-xs text-tea-light mb-1 block">Tracking Number</label>
                    <input value={statusForm.trackingNumber} onChange={e => setStatusForm(f => ({ ...f, trackingNumber: e.target.value }))} className="input-field text-sm" placeholder="AWB123456" />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={updateStatus} disabled={updating} className="btn-primary btn-sm">
                {updating ? 'Updating...' : 'Update Status'}
              </button>
              {!order.isReturned && order.status === 'delivered' && (
                <button onClick={() => setShowReturn(!showReturn)} className="btn-secondary btn-sm text-sm">
                  <RotateCcw size={15} /> Process Return
                </button>
              )}
            </div>

            {showReturn && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
                <h4 className="text-sm font-semibold text-red-700">Process Return</h4>
                <input value={returnForm.reason} onChange={e => setReturnForm(f => ({ ...f, reason: e.target.value }))} className="input-field text-sm" placeholder="Return reason" />
                <input type="number" value={returnForm.refundAmount} onChange={e => setReturnForm(f => ({ ...f, refundAmount: e.target.value }))} className="input-field text-sm" placeholder={`Refund amount (max ₹${order.pricing?.total})`} />
                <div className="flex gap-2">
                  <button onClick={processReturn} disabled={updating} className="btn-primary btn-sm bg-red-600 hover:bg-red-700">Confirm Return</button>
                  <button onClick={() => setShowReturn(false)} className="btn-secondary btn-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-lg font-semibold text-primary-800 mb-4">Status Timeline</h3>
            <div className="space-y-3">
              {order.statusHistory?.slice().reverse().map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-700 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-tea-dark capitalize">{h.status?.replace(/_/g, ' ')}</p>
                    {h.note && <p className="text-xs text-tea-light">{h.note}</p>}
                    <p className="text-xs text-tea-light">{new Date(h.updatedAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-base font-semibold text-primary-800 mb-3">Customer</h3>
            <p className="font-medium text-tea-dark text-sm">{order.user?.name}</p>
            <p className="text-xs text-tea-light">{order.user?.email}</p>
            <p className="text-xs text-tea-light">{order.user?.phone}</p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-base font-semibold text-primary-800 mb-3">Delivery Address</h3>
            <p className="text-sm text-tea-dark font-medium">{order.shippingAddress?.name}</p>
            <p className="text-xs text-tea-medium mt-1 leading-relaxed">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
            <p className="text-xs text-tea-light mt-1">{order.shippingAddress?.phone}</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h3 className="font-heading text-base font-semibold text-primary-800 mb-3">Payment</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-tea-light">Method</span><span className="uppercase font-medium">{order.payment?.method}</span></div>
              <div className="flex justify-between"><span className="text-tea-light">Status</span>
                <span className={`font-medium capitalize ${order.payment?.status === 'paid' ? 'text-green-600' : order.payment?.status === 'refunded' ? 'text-red-500' : 'text-yellow-600'}`}>
                  {order.payment?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.tracking?.trackingNumber && (
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <h3 className="font-heading text-base font-semibold text-primary-800 mb-3">Tracking</h3>
              <p className="text-xs text-tea-light">Carrier: <span className="text-tea-dark font-medium">{order.tracking.carrier}</span></p>
              <p className="text-xs text-tea-light mt-1">AWB: <span className="text-tea-dark font-medium">{order.tracking.trackingNumber}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(id || null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 15, page });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch {} finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (selectedId) return <OrderDetail orderId={selectedId} onBack={() => setSelectedId(null)} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary-800">Orders <span className="text-tea-light text-base font-body font-normal">({total})</span></h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tea-light" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order number..." className="input-field pl-9 text-sm py-2" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field text-sm py-2 pr-8 appearance-none min-w-36">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-tea-light" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-tea-light px-4 py-3 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-5 rounded-lg" /></td>)}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-tea-light text-sm">No orders found</td></tr>
              ) : orders.map(order => (
                <tr key={order._id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedId(order._id)} className="text-primary-700 font-medium text-sm hover:underline">{order.orderNumber}</button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-tea-dark font-medium">{order.user?.name}</p>
                    <p className="text-xs text-tea-light">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-tea-medium">{order.items?.length}</td>
                  <td className="px-4 py-3 text-sm font-bold text-tea-dark">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-xs text-tea-medium uppercase">{order.payment?.method}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status]}`}>{order.status?.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-tea-light whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedId(order._id)} className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors text-primary-700">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200">
            <p className="text-xs text-tea-light">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg hover:bg-cream-100 disabled:opacity-40 transition-colors"><ArrowLeft size={16} /></button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg hover:bg-cream-100 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
