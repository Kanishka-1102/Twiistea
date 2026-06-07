import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Truck, ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Puducherry'];

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '',
  });
  const [payment, setPayment] = useState({ method: 'cod' });

  const subtotal = items.reduce((acc, i) => acc + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (!items.length && !placedOrder) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={56} className="text-[#E5DDD0] mb-4" />
        <h2 className="font-bold text-2xl text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Your cart is empty</h2>
        <p className="text-[#999] mb-6 text-sm">Add some products before checking out</p>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: address,
        payment,
      });
      clearCart();
      setPlacedOrder(data);
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const OrderSummary = () => (
    <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#F0EBE3]">
      <h3 className="font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Order Summary</h3>
      <div className="space-y-3 max-h-52 overflow-y-auto no-scrollbar mb-4">
        {items.map(item => (
          <div key={item._id} className="flex gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5F1EA] flex-shrink-0">
              {item.images?.[0]?.url
                ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-lg">🍵</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] truncate">{item.name}</p>
              <p className="text-xs text-[#999]">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-[#1B4332]">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E5DDD0] pt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-[#777]"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between text-[#777]">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-[#777]"><span>GST (5%)</span><span>₹{tax}</span></div>
        {subtotal < 500 && <p className="text-xs text-[#B5821F] bg-[#FDF6E8] rounded-lg px-3 py-2">₹{500 - subtotal} more for free shipping</p>}
        <div className="flex justify-between font-bold text-[#1a1a1a] text-base pt-2 border-t border-[#E5DDD0]">
          <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );

  if (step === 3 && placedOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="font-bold text-3xl text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Order Placed!</h2>
          <p className="text-[#999] mb-8">Your tea is on its way 🍵</p>
          <div className="bg-[#FAFAF7] rounded-2xl p-5 text-left mb-6 space-y-3 border border-[#F0EBE3]">
            {[
              { l: 'Order Number', v: placedOrder.orderNumber, accent: true },
              { l: 'Total', v: `₹${placedOrder.pricing?.total?.toLocaleString('en-IN')}` },
              { l: 'Payment', v: placedOrder.payment?.method?.toUpperCase() },
              { l: 'Delivery', v: '3–5 business days' },
            ].map(({ l, v, accent }) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-[#999]">{l}</span>
                <span className={`font-bold ${accent ? 'text-[#1B4332]' : 'text-[#1a1a1a]'}`}>{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/account/orders" className="btn-primary">Track Order</Link>
            <Link to="/products" className="px-6 py-3 border border-[#E5DDD0] rounded-full text-sm font-semibold text-[#1a1a1a] hover:border-[#1B4332] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="bg-[#F5F1EA] py-6 px-4 border-b border-[#F0EBE3]">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-bold text-2xl text-[#1a1a1a]" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[{ n: 1, l: 'Delivery Address' }, { n: 2, l: 'Payment' }].map(({ n, l }, idx) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= n ? 'bg-[#1B4332] text-white' : 'bg-[#E5DDD0] text-[#999]'}`}>{n}</div>
              <span className={`text-sm font-medium ${step >= n ? 'text-[#1a1a1a]' : 'text-[#bbb]'}`}>{l}</span>
              {idx === 0 && <div className={`w-10 h-0.5 ml-1 ${step > 1 ? 'bg-[#1B4332]' : 'bg-[#E5DDD0]'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-[#F0EBE3]">
                <h2 className="font-bold text-lg text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Truck size={18} className="text-[#1B4332]" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', full: false },
                    { key: 'phone', label: 'Phone Number', type: 'tel', full: false },
                    { key: 'street', label: 'Street Address', type: 'text', full: true },
                    { key: 'city', label: 'City', type: 'text', full: false },
                    { key: 'pincode', label: 'PIN Code', type: 'text', full: false },
                  ].map(({ key, label, type, full }) => (
                    <div key={key} className={full ? 'sm:col-span-2' : ''}>
                      <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">{label}</label>
                      <input type={type} value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                        className="input-field" required />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">State</label>
                    <select value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className="input-field" required>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => { if (Object.values(address).every(v => v)) setStep(2); else toast.error('Please fill all address fields'); }}
                  className="btn-primary w-full mt-6">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-[#F0EBE3]">
                <h2 className="font-bold text-lg text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#1B4332]" /> Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💰' },
                    { value: 'upi', label: 'UPI Payment', desc: 'PhonePe, GPay, Paytm', icon: '📱' },
                    { value: 'online', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment.method === opt.value ? 'border-[#1B4332] bg-[#F0F7F3]' : 'border-[#E5DDD0] hover:border-[#1B4332]/40'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={payment.method === opt.value} onChange={e => setPayment({ method: e.target.value })} className="sr-only" />
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1a1a1a] text-sm">{opt.label}</p>
                        <p className="text-xs text-[#999]">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payment.method === opt.value ? 'border-[#1B4332] bg-[#1B4332]' : 'border-[#ddd]'}`}>
                        {payment.method === opt.value && <Check size={11} className="text-white" />}
                      </div>
                    </label>
                  ))}
                </div>

                {(payment.method === 'upi' || payment.method === 'online') && (
                  <div className="p-4 bg-[#FDF6E8] border border-[#F0D78C] rounded-xl text-sm text-[#B5821F] mb-4">
                    <p className="font-medium">Demo mode — payment gateway not connected.</p>
                    <p className="text-xs mt-0.5">Order will be processed as COD.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 border border-[#E5DDD0] rounded-full text-sm font-semibold text-[#555] hover:border-[#1B4332] transition-colors">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                    {loading
                      ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Placing Order...</span>
                      : `Place Order · ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1"><OrderSummary /></div>
        </div>
      </div>
    </div>
  );
}
